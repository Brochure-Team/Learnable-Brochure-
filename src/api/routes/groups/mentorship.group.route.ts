import { Router } from 'express';
import { mentorshipGroupController } from '../../controllers'
import { validate, authenticate } from '../../middlewares'
import { EditMentorshipGroupSchema, ViewMentorshipGroupSchema, ViewAllMentorshipGroupsSchema } from '../../validations'

const mentorshipGroupRouter = Router()

mentorshipGroupRouter.get('/', [authenticate, validate(ViewAllMentorshipGroupsSchema)], mentorshipGroupController.search)

mentorshipGroupRouter.get('/:id', [authenticate, validate(ViewMentorshipGroupSchema)], mentorshipGroupController.getOne)

mentorshipGroupRouter.patch('/:id', [authenticate, validate(EditMentorshipGroupSchema)], mentorshipGroupController.edit)

export default mentorshipGroupRouter