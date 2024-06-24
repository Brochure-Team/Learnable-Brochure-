import joi from 'joi'
import { validateObjectId } from '../utils'

export const CreateMainGroupSchema = {
    body: joi.object({
        name: joi.string().required(),
        description: joi.string().optional(),
        task_id: joi.string().custom(validateObjectId, 'object id validation').optional(),
        links: joi.array().items(
            joi.object({
                name: joi.string().required(),
                url: joi.string().required()
            })
        ).optional()
    })
}

export const CreateChildGroupSchema = {
    body: joi.object({
        links: joi.array().items(
            joi.object({
                name: joi.string().required(),
                url: joi.string().required()
            })
        ).optional(),
        interns: joi.array().items(
            joi.string().custom(validateObjectId, 'object id validation').required()
        ).required()
    }),
    params: joi.object({
        parent_group_id: joi.string().custom(validateObjectId, 'object id validation').required(),
    })
}
    
export const EditParentGroupSchema = {
    body: joi.object({
        name: joi.string().optional(),
        description: joi.string().optional(),
        task_id: joi.string().custom(validateObjectId, 'object id validation').optional()
    }),
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const EditChildGroupSchema = {
    body: joi.object({
        links: joi.array().items(
            joi.object({
                name: joi.string().required(),
                url: joi.string().required()
            })
        ).optional()
    }),
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required(),
        parent_group_id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const DeleteGroupSchema = {
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const DisableParentGroupSchema = {
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const DisableChildGroupSchema = {
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required(),
        parent_group_id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const ViewGroupSchema = {
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const AddToGroupSchema = {
    body: joi.object({
        interns: joi.array().items(
            joi.string().custom(validateObjectId, 'object id validation').required()
        ).required()
    }),
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required(),
        parent_group_id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const RemoveFromGroupSchema = {
    body: joi.object({
        interns: joi.array().items(
            joi.string().custom(validateObjectId, 'object id validation').required()
        ).required()
    }),
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required(),
        parent_group_id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const ViewAllGroupsSchema = {
    query: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').optional(),
        _id: joi.string().custom(validateObjectId, 'object id validation').optional(),
        intern: joi.string().custom(validateObjectId, 'object id validation').optional(),
        parent: joi.string().custom(validateObjectId, 'object id validation').optional(),
        task: joi.string().custom(validateObjectId, 'object id validation').optional(),
        name: joi.string().optional(),
        type: joi.string().optional(),
        description: joi.string().optional(),
        track: joi.string().optional(),
        deleted: joi.boolean().optional(),
        page: joi.number().optional(),
        limit: joi.number().optional()
    })
}