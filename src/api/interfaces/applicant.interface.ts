import { Document } from 'mongoose'
export interface IApplicant extends Document{
    _id: string;
    email: string;
    role: string;
    track: string;
    year: number;
    deleted: boolean
}