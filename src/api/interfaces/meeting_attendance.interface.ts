import { Schema, Document } from 'mongoose'
import { IMeeting } from './meeting.interface';
export interface IMeetingAttendance extends Document{
    _id: Schema.Types.ObjectId | string;
    name: string;
    id: string;
    meeting: Schema.Types.ObjectId | IMeeting;
    user_id: number;
    attentiveness_score: string;
    customer_key: string;
    track: string;
    score: number;
    user_email: string;
    join_time: Date | string;
    leave_time: Date | string;
    duration: number;
    failover: boolean;
    status: string;
    deleted: boolean;
}