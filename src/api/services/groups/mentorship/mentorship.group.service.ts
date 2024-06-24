import { Model } from 'mongoose';
import GenericService from "../../generic.service";
import { MentorshipGroup } from "../../../models";
import { IGenericObject, IMentor, IMentorGroup, IUpdateMentorGroup, IUser, InternInterface } from '../../../interfaces';
import { ForbiddenException, InternalException, NotFoundException } from '../../error.service';
import { internService } from '../../user.service';

export class MentorShipGroupService extends GenericService<IMentorGroup> {
    constructor(model: Model<IMentorGroup>){
        super(model)
    }

    async getGroup(_id: string) {
        const group = await this.findOne({ _id })
        if(!group) throw new NotFoundException('Mentorship Group does not exist.')

        const { data: interns } = await internService.findAll({ mentor: (group.mentor as IMentor)._id, page: 1, limit: 500 }, '-password')
        
        if(!group) throw new NotFoundException('Mentorship Group does not exist.')

        if(!group) throw new InternalException('There was an error fetching mentorship group')

        return { group, interns }
    }


    async getGroups(query: any) {
        const { data: groups, currentPage, totalPages } = await this.findAll(query)

        return { groups, currentPage, totalPages }
    }


    async editGroup(_id: string, editGroupData: IUpdateMentorGroup, user: IUser) {
        const { _id: userId, role } = user;
        const group = await this.findOne({ _id })

        if(!group) throw new NotFoundException('Mentorship Group does not exist.')
        const mentor = (group.mentor as IMentor)._id

        const { data: interns } = await internService.findAll({ mentor, page: 1, limit: 500 }, '-password')
        const ids = (interns as InternInterface[]).map(intern => intern._id.toString())

        if(!ids.includes(userId) && role !== 'coordinator' && userId.toString() !== mentor.toString()) throw new ForbiddenException('You cannot update this mentorship group')

        const data = await this.updateOne({ _id }, editGroupData)

        if(!data) throw new InternalException('There was an error updating mentorship group')

        return data
    }

    async deleteGroup(filter: IGenericObject) {
        const group = await this.findOne(filter)

        if(!group) throw new NotFoundException('Mentorship Group does not exist.')

        const data = await this.deleteOne(filter)

        if(!data) throw new InternalException('There was an error deleting mentorship group')

        return data
    }

    async disableGroup(filter: IGenericObject) {
        const group = await this.findOne(filter)

        if(!group) throw new NotFoundException('Mentorship Group does not exist.')

        const data = await this.disableOne(filter)

        if(!data) throw new InternalException('There was an error disabling mentorship group')

        return data
    }
}
    
export default new MentorShipGroupService(MentorshipGroup);