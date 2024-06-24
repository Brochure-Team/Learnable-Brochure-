import { Model } from "mongoose";
import { GroupService } from "./group.service";
import { ParentGroupModel } from "../../../models";
import {
  ICreateGroup,
  IGroup,
  ISubGroup,
  ITask,
  IUpdateGroup,
  IUser,
} from "../../../interfaces";
import {
  ForbiddenException,
  InternalException,
  NotFoundException,
} from "../../error.service";
import taskService from "../../task.service";
import groupService from "./group.service";
import childGroupService from "./child.group.service";

class ParentGroupService extends GroupService<IGroup> {
  constructor(model: Model<IGroup>) {
    super(model);
  }

  async createParent(payload: ICreateGroup) {
    const { name, task } = payload;

    // checks to be sure there's no group with the same name capitalised, uppercase or lowercase
    const regex = new RegExp(`\\b${name}\\b`);
    const isExistingGroup: IGroup | null = await this.findOne({
      name: { $regex: regex, $options: "i" },
    });

    if (isExistingGroup)
      throw new ForbiddenException("A group with this name already exists");

    // checking to be sure an intern does not already belong to any groups for a task creating groups with tasks
    if (task) {
      const isExistingTask: ITask | null = await taskService.findOne({
        _id: task,
      });
      if (!isExistingTask) throw new NotFoundException("Task not found");

      if (isExistingTask.type !== "group")
        throw new ForbiddenException("This task is not a group task");

      const taskAlreadyHasAGroup: IGroup | null = await this.findOne({ task });
      if (taskAlreadyHasAGroup)
        throw new ForbiddenException("This task already has a group.");

      payload.tracks = isExistingTask.tracks;
    }

    const group = await this.create(payload);

    if (!group) throw new InternalException(`Group was not created.`);

    return group;
  }

  async editParentGroup(_id: string, payload: IUpdateGroup, user: IUser) {
    const { name, task } = payload;
    const { role: userType } = user;

    // checks if group exists
    const isExistingGroup: IGroup | null = await this.findOne({ _id });
    if (!isExistingGroup) throw new NotFoundException("Group not found");

    // checks if a user is permitted to edit this group
    const isCoordinator =
      userType.toLowerCase() === "coordinator" ? true : false;

    if (!isCoordinator)
      throw new ForbiddenException(
        "You do not have the permission to update this group."
      );

    // setting or changing a group's task
    if (task) {
      // restricted to coordinators - will refactor authorization middleware and move this later
      if (!isCoordinator)
        throw new ForbiddenException(
          "You do not have the permission to add a task to this group."
        );

      // checks if task exists
      const isExistingTask = await taskService.findOne({ _id: task });
      if (!isExistingTask) throw new NotFoundException("Task not found");

      // check if it's a group task
      if (isExistingTask.type !== "group")
        throw new ForbiddenException("This task is not a group task");

      if (isExistingGroup.task && isExistingGroup.task._id.toString() === task)
        throw new ForbiddenException("This task is already assigned to this group.");

      const taskAlreadyHasAGroup: IGroup | null = await this.findOne({ task });
      if (taskAlreadyHasAGroup)
        throw new ForbiddenException("This task already has a parent group.");

      payload.tracks = isExistingTask.tracks;
    }

    // checks if any other group has the same name
    if (name) {
      const regex = new RegExp(`\\b${name}\\b`);
      const isExistingGroupWithName = await groupService.findOne({
        name: { $regex: regex, $options: "i" },
      });

      if (
        isExistingGroupWithName &&
        isExistingGroupWithName._id.toString() === _id.toString()
      ) {
        throw new ForbiddenException("This group already has this name.");
      } else if (isExistingGroupWithName) {
        throw new ForbiddenException("A group with this name already exists");
      }
    }

    // update group
    const updatedGroup: IGroup | null = await this.updateOne(
      { _id: isExistingGroup._id },
      payload
    );
    if (!updatedGroup) throw new InternalException(`Group was not updated.`);

    const { data } = await childGroupService.findAll({ parent_group: _id });

    const subGroups = data as unknown as ISubGroup[];
    let i = 1;
    for (const subGroup of subGroups) {
      await childGroupService.updateOne(
        { _id: subGroup._id },
        {
            ...payload,
          name: `${updatedGroup.name} ${i}`
        })

      i++;
    }

    await updatedGroup.save();

    return updatedGroup;
  }

  async removeOneGroup(_id: string) {
    const isExistingGroup = await this.findOne({ _id });
    if (!isExistingGroup) throw new NotFoundException("Group not found");

    const disabledTaskGroup = (await this.updateOne(
      { _id },
      { deleted: true }
    )) as unknown as IGroup | null;

    if (!disabledTaskGroup) throw new InternalException(`Group was not removed.`);

    const groups = await childGroupService.updateMany({ parent_group: _id }, { deleted: true });
    if (!groups) throw new InternalException(`There was an error fetching child groups.`);
    
    return disabledTaskGroup;
  }
}

export default new ParentGroupService(ParentGroupModel);
