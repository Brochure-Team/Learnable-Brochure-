import { Schema, Document } from 'mongoose'
import { IUser } from './profile.interface';
export interface IQuestion{
    id: number;
    title: string; 
    description: string;
    resources: { label: string; link: string }[]
}

export interface ITask extends Document { 
    _id: string;
    title: string; 
    questions: IQuestion[];
    facilitator: Schema.Types.ObjectId | IUser;
    tracks: string[];
    type: string; 
    deadline: Date | null | string; 
    approved: boolean; 
    deleted: boolean
}

export interface ICreateTask{
    title: string; 
    questions: IQuestion[];
    facilitator: Schema.Types.ObjectId | string;
    tracks: string[];
    type: string; 
}
export interface IUpdateTask {
    deleted?: boolean 
    approved?: boolean;
    deadline?: number;
}