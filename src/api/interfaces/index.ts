import { Request } from 'express'
import { IUser } from "./profile.interface";
import { UploadApiResponse } from 'cloudinary';

export interface IGenericObject {
    [key: string]: any
}

export interface CustomRequest extends Request {
    user: IUser;
}

export interface IPaginate {
    currentPage: Number;
    totalPages: Number
}

export type ICustomValidationFields = (value: any, helpers: any, fieldToCheck: any, valueToCheck: any) => any

export interface IReqFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number
}

export type IUpload = IReqFile & UploadApiResponse

export { IApplicant } from './applicant.interface'
export { IAnnouncement } from './announcement.interface'
export { IUpdateUser, ICreateUser, IUser, InternInterface, IMentor } from './profile.interface'
export { ITask, ICreateTask, IUpdateTask, IQuestion } from './task.interface'
export { ITaskSubmission, IUpdateTaskSubmission, ICreateTaskSubmission, IAnswer } from './task_submission.interface'
export { ILeaderBoard, ICreateLeaderBoard, IUpdateLeaderBoard } from './leaderboard.interface'
export { IStrike, IBonus, IAppraisal, IAttendance } from './leaderboard_entries.interface'
export { IGroup, ISubGroup, ICreateGroup, ICreateSubGroup, IUpdateGroup } from './group.interface'
export { IMentorGroup, ICreateMentorGroup, IUpdateMentorGroup } from './mentorship.group.interface'
export { IMeeting } from './meeting.interface'
export { IMeetingAttendance } from './meeting_attendance.interface'
export { ICollections, ICreateCollections, IUpdateCollections } from './generic.interface'