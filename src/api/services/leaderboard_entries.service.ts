import { Model } from "mongoose";
import { BonusModel, StrikeModel, AppraisalModel, AttendanceModel } from "../models";
import { IBonus, IAttendance, IStrike, IAppraisal } from "../interfaces";
import GenericService from "./generic.service";
export class BonusService extends GenericService<IBonus> {
    constructor(model: Model<IBonus>){
        super(model)
    }
}

export class AttendanceService extends GenericService<IAttendance> {
    constructor(model: Model<IAttendance>){
        super(model)
    }
}

export class AppraisalService extends GenericService<IAppraisal> {
    constructor(model: Model<IAppraisal>){
        super(model)
    }
}

export class StrikeService extends GenericService<IStrike> {
    constructor(model: Model<IStrike>){
        super(model)
    }
}
export const bonusService = new BonusService(BonusModel);
export const strikeService = new StrikeService(StrikeModel);
export const appraisalService = new AppraisalService(AppraisalModel);
export const attendanceService = new AttendanceService(AttendanceModel);