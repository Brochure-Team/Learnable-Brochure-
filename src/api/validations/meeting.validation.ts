import joi from 'joi'
import { validateObjectId } from '../utils'

export const GetOneMeetingSchema = {
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const GetMeetingsSchema = {
    query: joi.object({
        id: joi.number().optional(),
        _id: joi.string().custom(validateObjectId, 'object id validation').optional(),
        topic: joi.string().optional(),
        track: joi.string().optional(),
        deleted: joi.boolean().optional(),
        page: joi.number().optional(),
        limit: joi.number().optional()
    })
}