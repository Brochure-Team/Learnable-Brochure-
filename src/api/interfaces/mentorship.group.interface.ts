import { Schema, Types, Document } from 'mongoose'
import { IUser } from './profile.interface';

export interface IMentorGroup extends Document {
    _id: Schema.Types.ObjectId | string;
    mentor: Types.ObjectId | IUser | null | string
    name: string;
    links: {website: string; url: string}[];
    deleted: boolean;
}

export interface ICreateMentorGroup {
    name?: string;
    mentor: Types.ObjectId | IUser | null | string
    links?: {website: string; url: string}[];
}

export interface IUpdateMentorGroup {
    name?: string;
    links?: {website: string; url: string}[];
}