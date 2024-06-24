import joi from 'joi'
import { validateObjectId } from '../utils'

export const GetOneMeetingAttendanceSchema = {
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const GetMeetingAttendancesSchema = {
    query: joi.object({
        id: joi.number().optional(),
        _id: joi.string().custom(validateObjectId, 'object id validation').optional(),
        user_id: joi.number().optional(),
        track: joi.string().optional(),
        deleted: joi.boolean().optional(),
        page: joi.number().optional(),
        limit: joi.number().optional()
    })
}