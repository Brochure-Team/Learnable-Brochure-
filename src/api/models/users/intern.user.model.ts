import { Schema } from 'mongoose'
import User from './user.model'
import { InternInterface } from '../../interfaces'
import autopopulate from "mongoose-autopopulate"

const internSchema = new Schema<InternInterface>({
    role: {
        type: String,
        enum: ['intern'],
        default: 'intern'
    },
    mentor: {
        type: Schema.Types.ObjectId || null,
        ref: "User",
        autopopulate: { select: "_id track fullName displayName email group_info"},
        default: null 
    },
    track: {
        type: String,
        enum: ['product design', 'backend', 'frontend', 'web3'],
        required: true
    }
})

internSchema.plugin(autopopulate)

export default User.discriminator<InternInterface>('Intern', internSchema)