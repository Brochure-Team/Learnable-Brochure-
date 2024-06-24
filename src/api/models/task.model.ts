import { model, Schema } from 'mongoose'
import mongooseAutoPopulate from 'mongoose-autopopulate'
import { ITask } from '../interfaces'

const questionSchema = new Schema({
        id: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true,
        }, 
        resources: {
            type: [Object]
        },
        submit_on: {
            type: [String],
            required: true
        }
}, { _id: false })

const taskSchema = new Schema<ITask>({
    questions: {
        type: [questionSchema],
        required: true
    },
    facilitator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        autopopulate: { select: '-password -createdAt -updatedAt -deleted -__v -isVerified -__t' } 
    },
    tracks: {
        type: [{
            type: String,
            required: true
        }],
        required: true
    },
    type: {
        type: String,
        enum: ['individual', 'group'],
        default: 'individual',
        required: true
    }, 
    deadline: {
        type: Date || null,
        default: null
    },
    approved: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

taskSchema.plugin(mongooseAutoPopulate)

export default model<ITask>('Task', taskSchema)