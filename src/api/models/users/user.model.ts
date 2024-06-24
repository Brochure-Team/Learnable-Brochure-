import { model, Schema } from 'mongoose'
import { IUser } from '../../interfaces'

const userSchema = new Schema<IUser>({
    fullName: {
        type: String,
        required: true
    }, 
    displayName: {
        type: String,
        required: true
    }, 
    avatar: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    }, 
    phoneNumber: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export default model<IUser>('User', userSchema)