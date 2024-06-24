import joi from 'joi'
import { validateObjectId } from '../utils'

export const MentorPermissionSchema = {
    body: joi.object({
        permission: joi.string().valid('mark', 'facilitate').required(),
    })
}

export const AssignMentorSchema = {
    body:  joi.object({
        interns: joi.array().items(
            joi.string().custom(validateObjectId, 'object id validation').required()
    ).required()
    }),
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const ChangeMentorSchema = {
    body: joi.object({
        intern_id: joi.string().custom(validateObjectId, 'object id validation').required()
    }),
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}