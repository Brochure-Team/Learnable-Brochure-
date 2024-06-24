import  { Types, Document } from 'mongoose'
import { IUser } from './profile.interface';
import { ITaskSubmission } from './task_submission.interface';

export interface ILeaderBoard extends Document {
    _id: Types.ObjectId | string;
    intern: Types.ObjectId | string | IUser;
    track: string;
    pointsMoved: number;
    previousRank: number;
    currentRank: number;
    bonus: number;
    strikes: number;
    attendance: number;
    appraisals: number[];
    tasks: ITaskSubmission[];
    points: number;
    powerRanking: number;
    deleted: boolean;
}

export interface ICreateLeaderBoard {
    intern: Types.ObjectId | string | IUser;
    track: string;
}

export interface IUpdateLeaderBoard {
    pointsMoved?: number;
    previousRank: number;
    currentRank?: number;
    bonus: number;
    strikes: number;
    attendance: number;
    appraisals: number[];
    tasks: ITaskSubmission[];
    points: number;
    powerRanking: number;
    deleted?: boolean;
}