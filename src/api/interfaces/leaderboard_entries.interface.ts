import { Types, Document } from 'mongoose'
import { IUser } from './profile.interface'

export interface IStrike extends Document{
    intern: Types.ObjectId | IUser;
    deleted: boolean;
}

export interface IBonus extends Document{
    intern: Types.ObjectId | IUser;
    deleted: boolean;
}

export interface IAppraisal extends Document{
    intern: Types.ObjectId | IUser;
    score: number;
    deleted: boolean;
}

export interface IAttendance extends Document{
    intern: Types.ObjectId | IUser;
    percentage: number;
    score: number;
    deleted: boolean;
}