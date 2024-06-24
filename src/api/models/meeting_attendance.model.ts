import { model, Schema } from 'mongoose'
import { IMeetingAttendance } from '../interfaces'
import mongooseAutoPopulate from 'mongoose-autopopulate'

const meetingAttendanceSchema = new Schema<IMeetingAttendance>({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: false
    },
    meeting: {
        type: Schema.Types.ObjectId,
        ref: "Meeting",
        autopopulate: {select: '-deleted '}
    },
    user_id: {
        type: Number,
        required: true
    },
    user_email: {
        type: String,
        required: false
    },
    track: {
        type: String,
        required: true
    },
    join_time: {
        type: Date || String,
        required: true
    },
    leave_time: {
        type: Date || String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    failover: {
        type: Boolean,
        default: false
    },
    attentiveness_score: {
        type: String,
        required: false
    },
    customer_key: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    score: {
        type: Number,
        required: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

meetingAttendanceSchema.plugin(mongooseAutoPopulate)
export default model<IMeetingAttendance>('Meeting Attendee', meetingAttendanceSchema)