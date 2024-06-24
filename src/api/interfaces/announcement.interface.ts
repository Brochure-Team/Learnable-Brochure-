import { Document } from 'mongoose'
export interface IAnnouncement extends Document {
    _id: string;
    author: string;
    subject: string;
    content: string;
    mentions: string[];
}