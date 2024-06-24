import { Router } from 'express'
import { authController } from '../../controllers'
import { validate, authenticate, allowCoordinator } from '../../middlewares'
import { RegisterUserSchema } from '../../validations'

const coordinatorRouter = Router()

coordinatorRouter.post('/create', [authenticate, allowCoordinator, validate(RegisterUserSchema)], authController.signup)

export default coordinatorRouter