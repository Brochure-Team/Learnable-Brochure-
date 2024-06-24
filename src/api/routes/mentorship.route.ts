import { Router } from 'express';
import { mentorsController } from '../controllers'
import { authenticate, allowCoordinator, validate } from '../middlewares'
import { MentorPermissionSchema, AssignMentorSchema, ChangeMentorSchema } from '../validations';

const mentorsRouter = Router()

mentorsRouter.patch('/:id/change', [authenticate, validate(ChangeMentorSchema), allowCoordinator], mentorsController.changeMentor)

mentorsRouter.patch('/:id/assign', [authenticate, validate(AssignMentorSchema), allowCoordinator], mentorsController.assignMentor)

mentorsRouter.patch('/:id/permissions/give', [authenticate, validate(MentorPermissionSchema), allowCoordinator], mentorsController.giveMentorPermission)

mentorsRouter.patch('/:id/permissions/take', [authenticate, validate(MentorPermissionSchema), allowCoordinator], mentorsController.takeMentorPermission)

export default mentorsRouter