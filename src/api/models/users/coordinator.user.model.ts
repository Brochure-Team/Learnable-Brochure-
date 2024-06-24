import { Schema } from 'mongoose'
import User from './user.model'
import { IUser } from '../../interfaces'

const coordinatorSchema = new Schema<IUser>({
    role: {
        type: String,
        enum: ['coordinator'],
        default: 'coordinator'
    }
})

export default User.discriminator<IUser>('Coordinator', coordinatorSchema)