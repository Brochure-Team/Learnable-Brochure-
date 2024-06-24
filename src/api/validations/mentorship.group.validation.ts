import joi from 'joi'
import { validateObjectId } from '../utils'
    
export const EditMentorshipGroupSchema = {
    body: joi.object({
        name: joi.string().optional(),
        links: joi.array().items(
            joi.object({
                name: joi.string().required(),
                url: joi.string().required()
            })
        ).optional()
    }),
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const RemoveMentorshipGroupSchema = {
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const ViewMentorshipGroupSchema = {
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const ViewAllMentorshipGroupsSchema = {
    query: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').optional(),
        _id: joi.string().custom(validateObjectId, 'object id validation').optional(),
        mentor: joi.string().custom(validateObjectId, 'object id validation').optional(),
        name: joi.string().custom(validateObjectId, 'object id validation').optional(),
        deleted: joi.boolean().optional(),
        page: joi.number().optional(),
        limit: joi.number().optional()
    })
}