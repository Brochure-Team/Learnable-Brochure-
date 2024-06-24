import { Schema, Document } from 'mongoose'
export interface IMeeting extends Document{
    _id: Schema.Types.ObjectId | string;
    uuid: string;
    id: number;
    host_id: string;
    type: number;
    topic: string;
    user_name: string;
    user_email: string;
    start_time: Date | string;
    end_time: Date | string;
    duration: number;
    total_minutes: number;
    participants_count: number;
    tracking_fields: [];
    dept: string;
    tracks: string[];
    deleted: boolean;
}