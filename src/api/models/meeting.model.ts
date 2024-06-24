import { model, Schema } from 'mongoose'
import { IMeeting } from '../interfaces'

const meetingSchema = new Schema<IMeeting>({
    uuid: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    host_id: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    topic: {
        type: String,
        required: false
    },
    user_name: {
        type: String,
        required: false
    },
    user_email: {
        type: String,
        required: false
    },
    start_time: {
        type: Date || String,
        required: true
    },
    end_time: {
        type: Date || String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    total_minutes: {
        type: Number,
        required: true
    },
    participants_count: {
        type: Number,
        required: true
    },
    tracking_fields: {
        type: [String],
        required: false
    },
    dept: {
        type: String,
        required: false
    },
    tracks: {
        type: [String],
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export default model<IMeeting>('Meeting', meetingSchema)