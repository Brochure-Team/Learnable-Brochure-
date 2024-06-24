import { Model } from 'mongoose';
import GenericService from "./generic.service";
import { MeetingAttendanceModel } from "../models";
import { IMeetingAttendance } from '../interfaces';
export class MeetingAttendanceService extends GenericService<IMeetingAttendance> {
    constructor(model: Model<IMeetingAttendance>){
        super(model)
    }
}

export default new MeetingAttendanceService(MeetingAttendanceModel);