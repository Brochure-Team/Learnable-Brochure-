import { Model, Types } from "mongoose";
import { GroupModel } from "../../../models";
import GenericService from "../../generic.service";
import { IGroup } from "../../../interfaces";
import { InternalException, NotFoundException } from "../../error.service";

export class GroupService<T extends IGroup> extends GenericService<T> {
  constructor(model: Model<T>) {
    super(model);
  }

  async getOneGroup(_id: string) {
    const isExistingGroup = await this.findOne({ _id });
    if (!isExistingGroup) throw new NotFoundException("Group not found");

    return isExistingGroup;
  }

  async searchAllGroups(query: any) {
    const { id: _id, name, description, intern, track, type, parent } = query;

    if (_id) {
      query._id = _id as string;
      delete query.id;
    }

    if (parent) {
      query.parent_group = new Types.ObjectId(parent as string);
      delete query.parent;
    }

    if (type) {
      query.__t = { $regex: (<string>type).trim(), $options: "i" };
      delete query.type;
    }

    if (name) {
      query.name = { $regex: (<string>name).trim(), $options: "i" };
    }

    if (description) {
      query.description = {
        $regex: (<string>description).trim(),
        $options: "i",
      };
    }

    if (intern) {
      query.interns = new Types.ObjectId(intern as string);
      delete query.intern;
    }

    if (track) {
      query.tracks = (<string>track).trim();
      delete query.track;
    }

    const { data: groups, currentPage, totalPages } = await this.findAll(query);

    if (!groups) throw new NotFoundException("Groups were not fetched.");

    return { groups, currentPage, totalPages }
  }
}

export default new GroupService(GroupModel);
