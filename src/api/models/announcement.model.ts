import { model, Schema } from 'mongoose'
import {IAnnouncement} from '../interfaces/announcement.interface'

const announcementSchema = new Schema<IAnnouncement>({
    author: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    mentions: [{
        type: String,
        required: true,
    }]
}, {timestamps: true})

export default model<IAnnouncement>('Announcement', announcementSchema)