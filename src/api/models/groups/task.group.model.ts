import { model, Schema } from 'mongoose'
import mongooseAutoPopulate from 'mongoose-autopopulate'
import { IGroup, ISubGroup } from '../../interfaces'

const groupSchema = new Schema<IGroup>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: "Task",
        autopopulate: { select: ' -__v -createdAt -updatedAt' }
    },
    tracks: {
        type: [{
            type: String
        }]
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const parentGroupSchema = new Schema<IGroup>({
    childCount: {
        type: Number,
        default: 0,
        required: false
    },
}, { timestamps: true })

const childGroupSchema = new Schema<ISubGroup>({
    parent_group: {
        type: Schema.Types.ObjectId || null,
        ref: "Task Group",
        autopopulate: { select: ' -createdAt -updatedAt -deleted -__v' },
        default: null
    },
    interns: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        autopopulate: { select: '-password -createdAt -updatedAt -deleted -__v' }
    },
    links: {
        type: [Object]
    }
}, { timestamps: true })

groupSchema.plugin(mongooseAutoPopulate)
childGroupSchema.plugin(mongooseAutoPopulate)

export const GroupModel = model<IGroup>('Task Group', groupSchema)
export const ParentGroupModel = GroupModel.discriminator<IGroup>('parent', parentGroupSchema)
export const ChildGroupModel = GroupModel.discriminator<ISubGroup>('child', childGroupSchema)