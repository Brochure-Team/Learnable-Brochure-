import { Schema, Document, ObjectId } from 'mongoose'
import { ITask } from './task.interface';
import { InternInterface } from './profile.interface';

export interface IGroup extends Document {
    _id: Schema.Types.ObjectId | string;
    name: string;
    description: string;
    task: ITask;
    childCount: number;
    type: string;
    tracks: string[];
    deleted: boolean;
}

export interface ICreateGroup extends Document {
    name: string;
    description?: string;
    task?: ITask | string;
    tracks?: string[];
}

export interface ICreateSubGroup extends ICreateGroup {
    interns: string[];
    parent_group: Schema.Types.ObjectId | IGroup | string;
}
export interface ISubGroup extends IGroup {
    parent_group: Schema.Types.ObjectId | IGroup | string;
    interns: Schema.Types.ObjectId[] | string[] | InternInterface[];
    links: {website: string; url: string}[];
    __t: string;
}

export interface IUpdateGroup {
    name?: string;
    description?: string;
    task?: string;
    tracks?: string[];
    interns?: string[]
    parent_group?: Schema.Types.ObjectId | IGroup | string;
    childCount?: number
}