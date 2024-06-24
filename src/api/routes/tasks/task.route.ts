import { Router } from 'express';
import { taskController } from '../../controllers'
import { validate, authenticate, allowCoordinator, allowFacilitator, allowCoordinatorAndFacilitator }from '../../middlewares'
import { ApproveTaskSchema, CreateTaskSchema, ViewAllTasksSchema, ViewTaskSchema, DeleteTaskSchema, RemoveTaskSchema, EditTaskSchema, ExtendTaskDeadlineSchema, EnableOrDisableTaskSchema } from '../../validations'

const taskRouter = Router()

taskRouter.post('/create', [authenticate, allowFacilitator, validate(CreateTaskSchema)], taskController.createTask)

taskRouter.get('/', [authenticate, validate(ViewAllTasksSchema)], taskController.getTasks)

taskRouter.get('/:id', [authenticate, validate(ViewTaskSchema)], taskController.getTask)

taskRouter.delete('/:id', [authenticate, allowCoordinator, validate(DeleteTaskSchema)], taskController.deleteTask)

taskRouter.patch('/:id/approve', [authenticate, allowCoordinator, validate(ApproveTaskSchema)], taskController.approve)

taskRouter.patch('/:id/change-deadline', [authenticate, allowCoordinator, validate(ExtendTaskDeadlineSchema)], taskController.changeDeadline)

taskRouter.patch('/:id/edit', [authenticate, allowCoordinatorAndFacilitator, validate(EditTaskSchema)], taskController.editTask)

taskRouter.patch('/:id/enable', [authenticate, allowCoordinatorAndFacilitator, validate(EnableOrDisableTaskSchema)], taskController.enableTask)

taskRouter.patch('/:id/disable', [authenticate, allowCoordinatorAndFacilitator, validate(EnableOrDisableTaskSchema)], taskController.disableTask)

export default taskRouter