import { Router } from 'express';
import taskGroupRouter from './task.group.route';
import mentorshipRouter from './mentorship.group.route';

const groupRouter = Router()

groupRouter.use('/task', taskGroupRouter)

groupRouter.use('/mentorship', mentorshipRouter)

export default groupRouter