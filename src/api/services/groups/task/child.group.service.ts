import { Model } from "mongoose";
import { GroupService } from "./group.service";
import { ChildGroupModel } from "../../../models";
import { ICreateSubGroup, IGroup, ISubGroup, ITask, IUpdateGroup, IUser, InternInterface } from "../../../interfaces";
import { ForbiddenException, InternalException, NotFoundException } from "../../error.service";
import { internService } from "../../user.service";
import taskService from "../../task.service";
import parentGroupService from "./parent.group.service";

class ChildGroupService extends GroupService<ISubGroup> {
  constructor(model: Model<ISubGroup>) {
    super(model);
  }

  async createChild(payload: ICreateSubGroup) {
    const { interns, parent_group } = payload

    const isExistingParentGroup: IGroup | null = await parentGroupService.findOne({ _id: parent_group })
    if (!isExistingParentGroup) throw new NotFoundException('Parent group not found.')

    // ches if internsToAdd exist and are already in a group if there is a task id
    let isExistingIntern: InternInterface | null;
    for (const intern of interns) {
      isExistingIntern = await internService.findOne({ _id: intern })
      if (!isExistingIntern) throw new NotFoundException(`Intern not found`)

      const isAlreadyInAChildGroupForTask = await this.findOne({ interns: isExistingIntern._id, parent_group })
      if (isAlreadyInAChildGroupForTask) throw new ForbiddenException(`${isExistingIntern.fullName} already belongs in a child group for this parent group.`)

      // checking to be sure an intern does not already belong to any groups for a task creating groups with tasks
      if (isExistingParentGroup.task) {
        const isExistingTask = await taskService.findOne({ _id: isExistingParentGroup.task._id })
        if (!isExistingTask) throw new NotFoundException('Task not found')

        // const isAlreadyInGroupForTask = await this.findOne({ interns: isExistingIntern._id, task: isExistingParentGroup.task._id })
        // if (isAlreadyInGroupForTask) throw new ForbiddenException(`${isExistingIntern.fullName} already belongs in a group for this task.`)

        payload.task = isExistingParentGroup.task._id
        payload.tracks = isExistingParentGroup.tracks
      }
    }

    const { name: groupName, childCount } = isExistingParentGroup.toObject()

    const group = await this.create({
      ...payload,
      name: `${groupName} ${childCount + 1}`,
      parent_group: parent_group as string,
      description: isExistingParentGroup.description
    } as ICreateSubGroup)

    if (!group) throw new InternalException(`Sub Group was not created.`)

    isExistingParentGroup.childCount = childCount + 1
    await isExistingParentGroup.save()

    return group
  }

  async updateChildGroup(_id: string, payload: IUpdateGroup, user: IUser) {
    const { parent_group } = payload;
    const { _id: userId, role } = user;

    // checks if group exists
    const isExistingGroup: ISubGroup | null = await this.findOne({
      _id,
      parent_group,
    });
    if (!isExistingGroup) throw new NotFoundException("Group not found");

    // checks if a user is permitted to edit this group
    const interns =
      isExistingGroup.__t === "child"
        ? (isExistingGroup.interns as InternInterface[])
        : [];
    const internIds = interns.map((intern) => intern._id.toString());

    const isAdminOrCoordinator = role?.toLowerCase() === 'admin' || role?.toLowerCase() === 'coordinator';
    if (!internIds.includes(userId.toString()) && !isAdminOrCoordinator) throw new ForbiddenException("You do not have the permission to update this group.");

    // update group
    const updatedGroup = await this.updateOne(
      { _id: isExistingGroup._id },
      payload
    );

    if (!updatedGroup) throw new InternalException(`Group was not updated.`);

    return updatedGroup
  }

  // Tim requested this, i know it'll cause problems so when it does, revert to different endpoints for adding and removing
  async addOrRemoveFromGroup(parent_group: string, _id: string, interns: string[]) {
    const isExistingGroup = await this.findOne({ _id, parent_group }) as ISubGroup;
    if (!isExistingGroup) throw new NotFoundException("Task group not found");

    for (const intern of interns) {
      const isExistingIntern = await internService.findOne({ _id: intern });
      if (!isExistingIntern) throw new NotFoundException(`Intern not found`);

      const isInGroupTrack =
        isExistingGroup.tracks.length === 0 ? true :
          isExistingGroup.tracks.includes(isExistingIntern.track)
            ? true
            : false;

      if (!isInGroupTrack) throw new ForbiddenException(`The tracks for this group do not match your track`);

      const task = isExistingGroup?.task as ITask
      if (task) {
        const { _id: id } = task

        const isAlreadyInAGroupForTask = await this.findOne({ task: id, interns: intern }) as ISubGroup
        const taskId = isAlreadyInAGroupForTask && isAlreadyInAGroupForTask._id.toString()

        console.log(1, intern, task, isAlreadyInAGroupForTask, taskId, _id);

        if (taskId && taskId !== _id)
          throw new ForbiddenException(`${isExistingIntern.fullName} already belongs in a group for this task.`)
      }
    }

    isExistingGroup.interns = interns

    const updatedGroup = await isExistingGroup.save();
    if (!updatedGroup) throw new InternalException(`There was an error updating group members.`);

    return updatedGroup
  }

  async addToGroup(parent_group: string, _id: string, interns: string[]) {
    const isExistingGroup = await this.findOne({ _id, parent_group }) as ISubGroup;
    if (!isExistingGroup) throw new NotFoundException("Task group not found");

    const group_interns = isExistingGroup.interns as InternInterface[];
    const group_interns_id = group_interns.map((intern) =>
      intern._id.toString()
    );
    const idsOfInternsToAdd = interns as string[];

    for (const intern_id of idsOfInternsToAdd) {
      const isExistingIntern = await internService.findOne({ _id: intern_id });
      if (!isExistingIntern) throw new NotFoundException(`Intern not found`);

      const isAlreadyInGroup =
        group_interns_id.length > 0 &&
          group_interns_id.filter(
            (group_intern_id) => group_intern_id.toString() === intern_id
          ).length > 0
          ? true
          : false;

      const isInGroupTrack =
        isExistingGroup.tracks.length === 0 ? true :
          isExistingGroup.tracks.includes(isExistingIntern.track)
            ? true
            : false;

      if (isAlreadyInGroup) throw new ForbiddenException(`${isExistingIntern.fullName} is already a member of this group.`)

      if (!isInGroupTrack) throw new ForbiddenException(`The tracks for this group do not match your track`);
    }

    isExistingGroup.interns = [...group_interns_id, ...interns];

    const updatedGroup = await isExistingGroup.save();
    if (!updatedGroup) throw new InternalException(`Intern was not added to this group.`);

    return updatedGroup
  }

  async removeFromGroup(parent_group: string, _id: string, interns: string[]) {
    const isExistingGroup = await this.findOne({ _id, parent_group }) as ISubGroup;
    if (!isExistingGroup) throw new NotFoundException("Group not found");

    // check if the group has members
    const existingGroupInterns =
      isExistingGroup.interns && isExistingGroup.interns.length > 0
        ? isExistingGroup.interns
        : null;

    if (!existingGroupInterns) throw new ForbiddenException("This group has no interns yet.");

    // get the user ids of all interns that on the group in an array
    const existingGroupInternIds = existingGroupInterns.map((intern) =>
      (intern as InternInterface)._id.toString()
    );

    // check if all provided ids are interns on the group
    for (const intern of interns) {
      if (!existingGroupInternIds.includes(intern)) throw new ForbiddenException("This intern does not belong to this group");
    }

    // removes interns that their ids were provided
    let i = 0;
    for (const intern of existingGroupInternIds) {
      if (interns.includes(intern))
        existingGroupInternIds.splice(i, 1);

      i++;
    }

    // sets the grroup members to the current version after removing
    isExistingGroup.interns = existingGroupInternIds;

    // saves the current version of group members
    const updatedGroup = await isExistingGroup.save();
    if (!updatedGroup) throw new InternalException(`Intern was not removed from this group.`)

    return updatedGroup
  }

  async removeOneGroup(_id: string, parent_group: string) {
    const isExistingGroup: ISubGroup | null = await this.findOne({ _id, parent_group });
    if (!isExistingGroup) throw new NotFoundException("Group not found");

    const disabledTaskGroup = await this.disableOne({ _id })

    if (!disabledTaskGroup) throw new InternalException(`Group was not removed.`);

    const { groups } = await this.searchAllGroups({ parent_group });
    if (!groups) throw new InternalException(`There was an error fetching groups.`);

    let i = 1
    const parentGroupName = (isExistingGroup.parent_group as IGroup).name
    for (const group of groups) {
      let name = `${parentGroupName} ${i}`
      await this.updateOne({ _id: group._id }, { name })
      i++
    }

    await parentGroupService.updateOne({ _id: parent_group }, { childCount: groups.length })

    return disabledTaskGroup;
  }
}

export default new ChildGroupService(ChildGroupModel);