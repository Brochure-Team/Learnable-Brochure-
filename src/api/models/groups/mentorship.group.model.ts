import { model, Schema } from 'mongoose'
import { IMentorGroup } from '../../interfaces'
import mongooseAutoPopulate from 'mongoose-autopopulate'

const mentorGroupSchema = new Schema<IMentorGroup>({
    name: {
        type: String,
        default: ""
    },
    mentor: {
        type: Schema.Types.ObjectId || null,
        ref: "User",
        autopopulate: { select: "_id track fullName displayName email group_info"},
        default: null 
    },
    links: {
        type: [Object],
        default: []
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

mentorGroupSchema.plugin(mongooseAutoPopulate)

export default model<IMentorGroup>('Mentorship Group', mentorGroupSchema)