import { Schema, model } from 'mongoose'
import { ILeaderBoard } from '../interfaces'
import mongooseAutoPopulate from 'mongoose-autopopulate'

const leaderboardSchema = new Schema<ILeaderBoard>({
    intern: {
        type: Schema.Types.ObjectId,
        ref: "User",
        autopopulate: { select: '-password -createdAt -updatedAt -deleted -__v -isVerified -__t' } 
    },
    track: {
        type: String
    },
    pointsMoved: {
        type: Number,
        default: 0
    },
    previousRank: {
        type: Number,
        default: 0
    },
    currentRank: {
        type: Number,
        default: 1
    },
    bonus: {
        type: Number,
        default: 0
    },
    strikes: {
        type: Number,
        default: 0
    },
    attendance: {
        type: Number,
        default: 0
    },
    appraisals: {
        type: [Number],
        default: []
    },
    tasks: {
        type: [Object],
        default: []
    },
    points: {
        type: Number,
        default: 0
    },
    powerRanking: {
        type: Number,
        default: 0
    },
    deleted: {
        type: Boolean,
        default: false
    } 
}, { timestamps: true })

leaderboardSchema.plugin(mongooseAutoPopulate)

export default model<ILeaderBoard>('Leaderboard Entries', leaderboardSchema)