import { model, Schema } from 'mongoose'
import { IApplicant } from '../interfaces'

const applicantSchema = new Schema<IApplicant>({
    email: {
        type: String,
        required: true
    }, 
    track: {
        type: String,
        required: true
    }, 
    role: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
        default: new Date().getFullYear()
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export default model<IApplicant>('Applicant', applicantSchema)