import joi from 'joi'

export const LoginSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })
}

export const RegisterUserSchema = {
    body: joi.object({
        fullName: joi.string().required(),
        displayName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
    })
}

export const PasswordResetRequestSchema = {
    body: joi.object({
        email: joi.string().email().required(),
    })
}


export const PasswordResetSchema = {
    body: joi.object({
        password: joi.string().required(),
    }),
    params: joi.object({
        token: joi.string().required(),
    }) 
}

export const AccountVerificationRequestSchema = {
    body: joi.object({
        email: joi.string().email().required()
    })
}

export const AccountVerificationSchema = {
    params: joi.object({
        token: joi.string().required(),
    }) 
}