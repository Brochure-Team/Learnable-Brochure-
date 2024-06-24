import { Router } from 'express';
import { authController } from '../../controllers'
import { validate, authenticate } from '../../middlewares'
import { RegisterUserSchema, LoginSchema, AccountVerificationRequestSchema, AccountVerificationSchema, PasswordResetRequestSchema, PasswordResetSchema } from '../../validations'

const authRouter = Router()

authRouter.post('/register', [validate(RegisterUserSchema)], authController.signup)

authRouter.post('/login', [validate(LoginSchema)], authController.login)

authRouter.post('/verify-email', [validate(AccountVerificationRequestSchema), authenticate], authController.requestEmailVerification)

authRouter.get('/verify-email/:token', [validate(AccountVerificationSchema)], authController.verifyEmail)

authRouter.post('/request-password-reset', [validate(PasswordResetRequestSchema)], authController.requestPasswordReset)

authRouter.patch('/reset-password/:token', [validate(PasswordResetSchema)], authController.resetPassword)

export default authRouter