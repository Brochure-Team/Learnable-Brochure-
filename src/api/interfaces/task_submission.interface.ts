import { Schema, Types, Document } from 'mongoose'
import { ITask } from './task.interface';
import { IUser, InternInterface } from './profile.interface';
import { IGroup } from './group.interface';

export type IAnswer = { question_id: number; submission_link: string; grade: number; feedback: string; };

export interface ITaskSubmission extends Document {
    _id: string;
    task: ITask | Schema.Types.ObjectId;
    answers: IAnswer[];
    interns: Schema.Types.ObjectId[] | InternInterface[];
    group: Schema.Types.ObjectId | IGroup | null;
    type: string;
    tracks: string[];
    isGraded: boolean;
    gradedBy: Schema.Types.ObjectId | IUser;
    grade: number;
    deleted: boolean
}

export interface ICreateTaskSubmission{
    task: string | Schema.Types.ObjectId;
    answers: IAnswer[];
    type: string;
    tracks: string[];
    interns?: string[] | Schema.Types.ObjectId[] | InternInterface[];
    group?: string | Schema.Types.ObjectId | IGroup | null;
}

export interface IUpdateTaskSubmission {
    isGraded?: boolean;
    answers?: IAnswer[];
    grade?: number;
    deleted?: boolean
}