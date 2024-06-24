import joi from 'joi'
import { checkForRequiredInput, validateObjectId } from '../utils'

export const UpdateUserProfileSchema = {
    body: joi.object().keys({
        email: joi.string().email().optional(),
        avatar: joi.string().optional(),
        password: joi.string().optional(),
        displayName: joi.string().optional(),
        phoneNumber: joi.string().optional(),
        newPassword: joi.string().custom((val, obj) => checkForRequiredInput(val, obj, 'password', 'isProvided')),
    }).or('email', 'avatar', 'password', 'newPassword', 'displayName', 'phoneNumber'),
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required(),
    })
};

export const ViewUserProfileSchema = {
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const DeleteUserProfileSchema = {
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').required()
    })
}

export const ViewAllUserProfiles = {
    params: joi.object({
        id: joi.string().custom(validateObjectId, 'object id validation').optional(),
        _id: joi.string().custom(validateObjectId, 'object id validation').optional(),
        displayName: joi.string().optional(),
        email: joi.string().email().optional(),
        fullName: joi.string().optional(),
        page: joi.number().optional(),
        limit: joi.number().optional()
    })
}