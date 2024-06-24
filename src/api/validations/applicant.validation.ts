import joi from 'joi'
import { validateObjectId } from '../utils'

export const CreateApplicantSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        role: joi.string().required(),
        track: joi.string().required()
    })
}

export const GetApplicantSchema = {
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const GetAllApplicantsSchema = {
    query: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').optional(),
        _id: joi.string().custom(validateObjectId, 'object id validation').optional(),
        email: joi.string().optional(),
        role: joi.string().optional(),
        track: joi.string().optional(),
        year: joi.string().optional(),
        deleted: joi.boolean().optional(),
        page: joi.number().optional(),
        limit: joi.number().optional()
    })
}

export const EnableOrDisableApplicantSchema = {
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const DisableAllApplicantsSchema = {
    params: joi.object({
        year: joi.string().required()
    })
}