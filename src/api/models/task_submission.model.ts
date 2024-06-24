import { model, Schema } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import { ITaskSubmission } from '../interfaces'

const answerSchema = new Schema({
    question_id: {
        type: Number,
        required: true
    },
    submission_link: {
        type: String,
        required: true,
        unique: true
    },
    grade: {
        type: Number,
        required: true,
        default: 0
    },
    feedback: {
        type: String,
        required: true,
        default: "there is no feedback on this question yet"
    }
}, { _id: false})

const taskSubmissionSchema = new Schema<ITaskSubmission>({
    task: {
        type: Schema.Types.ObjectId,
        ref: "Task",
        required: true,
        autopopulate: { select: ' -__v -createdAt -updatedAt -deleted' }
    }, 
    interns: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
        autopopulate: { select: '-password -createdAt -updatedAt -deleted -__v' }
    }, 
    group: {
        type: Schema.Types.ObjectId || null,
        ref: "Task Group",
        default: null,
        autopopulate: { select: ' -__v -createdAt -updatedAt -deleted' }
    }, 
    type: {
        type: String,
        enum: ['individual', 'group'],
        default: 'individual',
        required: true,
    },
    tracks: {
        type: [{
            type: String,
            required: true
        }],
        required: true
    },
    answers: {
        type: [answerSchema],
        required: true
    },
    isGraded: {
        type: Boolean,
        default: false
    },
    grade: {
        type: Number,
        required: true,
        default: 0
    },
    gradedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        autopopulate: { select: '-password -deleted -isVerified -__v -createdAt -updatedAt'}
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

taskSubmissionSchema.plugin(autopopulate)

export default model<ITaskSubmission>('Task Submission', taskSubmissionSchema)