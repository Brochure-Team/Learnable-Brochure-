import { Router } from 'express';
import taskSubmissionRouter from './task_submission.route'
import taskRouter from './task.route'

const generalTaskRouter = Router()

// placed like this so the params can catch both task/:id and task/submissions routes
generalTaskRouter.use(taskSubmissionRouter)
generalTaskRouter.use(taskRouter)

export default generalTaskRouter