import { Router } from 'express';
import { meetingAttendanceController } from '../controllers'
import { authenticate, allowCoordinator, validate } from '../middlewares'
import { GetOneMeetingAttendanceSchema, GetMeetingAttendancesSchema } from '../validations';

const meetingAttendanceRouter = Router()

meetingAttendanceRouter.get('/', [authenticate, validate(GetMeetingAttendancesSchema), allowCoordinator],meetingAttendanceController.searchMeetings)

meetingAttendanceRouter.get('/:id', [authenticate, validate(GetOneMeetingAttendanceSchema), allowCoordinator], meetingAttendanceController.getMeeting)

export default meetingAttendanceRouter