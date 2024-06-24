import { Schema, model } from 'mongoose'
import { IAttendance, IAppraisal, IBonus, IStrike } from '../interfaces'
import mongooseAutoPopulate from 'mongoose-autopopulate'

const strikeSchema = new Schema<IStrike>({
    intern: {
        type: Schema.Types.ObjectId,
        ref: "User",
        autopopulate: { select: '-password -createdAt -updatedAt -deleted -__v -isVerified -__t' } 
    },
    deleted: {
        type: Boolean,
        default: false
    } 
}, { timestamps: true })

const appraisalSchema = new Schema<IAppraisal>({
    intern: {
        type: Schema.Types.ObjectId,
        ref: "User",
        autopopulate: { select: '-password -createdAt -updatedAt -deleted -__v -isVerified -__t' } 
    },
    score: {
        type: Number
    },
    deleted: {
        type: Boolean,
        default: false
    } 
}, { timestamps: true })

const attendanceSchema = new Schema<IAttendance>({
    intern: {
        type: Schema.Types.ObjectId,
        ref: "User",
        autopopulate: { select: '-password -createdAt -updatedAt -deleted -__v -isVerified -__t' } 
    },
    percentage: {
        type: Number
    },
    score: {
        type: Number
    },
    deleted: {
        type: Boolean,
        default: false
    } 
}, { timestamps: true })

const bonusSchema = new Schema<IBonus>({
    intern: {
        type: Schema.Types.ObjectId,
        ref: "User",
        autopopulate: { select: '-password -createdAt -updatedAt -deleted -__v -isVerified -__t' } 
    },
    deleted: {
        type: Boolean,
        default: false
    } 
}, { timestamps: true })

strikeSchema.plugin(mongooseAutoPopulate)
appraisalSchema.plugin(mongooseAutoPopulate)
bonusSchema.plugin(mongooseAutoPopulate)
attendanceSchema.plugin(mongooseAutoPopulate)

export const StrikeModel = model<IStrike>('Strike', strikeSchema)
export const AppraisalModel = model<IAppraisal>('Appraisal', appraisalSchema)
export const AttendanceModel = model<IAttendance>('Attendance', attendanceSchema)
export const BonusModel = model<IBonus>('Bonus', bonusSchema)