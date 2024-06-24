import { Router } from 'express';
import { meetingController } from '../controllers'
import { authenticate, allowCoordinator, validate } from '../middlewares'
import { GetOneMeetingSchema, GetMeetingsSchema } from '../validations';

const meetingRouter = Router()

meetingRouter.get('/', [authenticate, validate(GetMeetingsSchema), allowCoordinator], meetingController.searchMeetings)

meetingRouter.get('/:id', [authenticate, validate(GetOneMeetingSchema), allowCoordinator], meetingController.getMeeting)

export default meetingRouter