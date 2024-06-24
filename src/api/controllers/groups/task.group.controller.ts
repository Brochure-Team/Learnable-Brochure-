import { Request, Response } from "express";
import { childGroupService, parentGroupService, groupService } from "../../services";
import { sendResponse } from "../../utils";
import { IUser } from "../../interfaces";

class Group {
  async createParentGroup(req: Request, res: Response) {
    const { task_id } = req.body

    if (task_id) {
      req.body.task = task_id;
      delete req.body.task_id;
    }
  
    const group = await parentGroupService.createParent(req.body);

    return sendResponse(
      res,
      201,
      true,
      `Group was created successfully!`,
      group
    );
  }

  async createChildGroup(req: Request, res: Response) {
    const { parent_group_id } = req.params

    if (req.body.task_id) {
      req.body.task = req.body.task_id;
      delete req.body.task_id;
    }

    const group = await childGroupService.createChild({
      ...req.body,
      parent_group: parent_group_id
    });

    return sendResponse(
      res,
      201,
      true,
      `Group was created successfully!`,
      group
    );
  }

  async editParentGroup(req: Request, res: Response) {
    const { task_id } = req.body;
    const { id } = req.params;

    if (task_id) {
      req.body.task = task_id;
      delete req.body.task_id;
    }

    const updatedGroup = await parentGroupService.editParentGroup(
      id,
      req.body,
      req.user as unknown as IUser
    );

    return sendResponse(
      res,
      200,
      true,
      `Group was updated successfully!`,
      updatedGroup
    );
  }

  async editChildGroup(req: Request, res: Response) {
    const { parent_group_id, id } = req.params;

    if (parent_group_id) {
      req.body.parent_group = parent_group_id
      delete req.body.parent_group_id
    }

    // update group
    const updatedGroup = await childGroupService.updateChildGroup(id,
      req.body,
      req.user as unknown as IUser
    )

    return sendResponse(
      res,
      200,
      true,
      `Group was updated successfully!`,
      updatedGroup
    );
  }

  async removeParentGroup(req: Request, res: Response) {
    const { id } = req.params;

    const parentGroup = await parentGroupService.removeOneGroup(id)

    return sendResponse(
      res,
      200,
      true,
      `Group was removed successfully!`,
      parentGroup
    );
  }

  async removeChildGroup(req: Request, res: Response) {
    const { id, parent_group_id } = req.params;

    const childGroup = await childGroupService.removeOneGroup(id, parent_group_id)

    return sendResponse(
      res,
      200,
      true,
      `Group was removed successfully!`,
      childGroup
    );
  }

  async addToGroup(req: Request, res: Response) {
    const { id, parent_group_id } = req.params;
    const { interns } = req.body;

    const group = await childGroupService.addToGroup(parent_group_id, id, interns)

    return sendResponse(
      res,
      200,
      true,
      `Intern added to group successfully!`,
      group
    );
  }

  async removeFromGroup(req: Request, res: Response) {
    const { id, parent_group_id } = req.params;
    const { interns } = req.body;

    // saves the current version of group members
    const group = await childGroupService.removeFromGroup(parent_group_id, id, interns)

    return sendResponse(
      res,
      200,
      true,
      `Intern removed from group successfully!`,
      group
    );
  }

  async manageGroupMembers(req: Request, res: Response) {
    const { id, parent_group_id } = req.params;
    const { interns } = req.body;

    const group = await childGroupService.addOrRemoveFromGroup(parent_group_id, id, interns)

    return sendResponse(
      res,
      200,
      true,
      `Group members updated successfully!`,
      group
    );
  }

  async getGroup(req: Request, res: Response) {
    const { id } = req.params;

    const group = await groupService.getOneGroup(id);

    return sendResponse(
      res,
      200,
      true,
      `Group fetched successfully!`,
      group
    );
  }

  async searchGroups(req: Request, res: Response) {
    const { groups, currentPage, totalPages } = await groupService.searchAllGroups(req.query);

    return sendResponse(
      res,
      200,
      true,
      "Groups fetched successfully!",
      groups,
      { currentPage, totalPages }
    );
  }
}

export default new Group();