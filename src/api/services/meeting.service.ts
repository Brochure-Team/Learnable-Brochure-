import { Model } from 'mongoose';
import { MeetingModel } from "../models";
import GenericService from "./generic.service";
import { IMeeting } from '../interfaces';

export class MeetingService extends GenericService<IMeeting> {
    constructor(model: Model<IMeeting>){
        super(model)
    }
}
export default new MeetingService(MeetingModel);