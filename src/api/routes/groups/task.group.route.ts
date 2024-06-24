import { Router } from 'express';
import { groupController } from '../../controllers'
import { validate, authenticate, allowCoordinator, allowFacilitator, allowCoordinatorAndFacilitator } from '../../middlewares'
import { CreateMainGroupSchema, CreateChildGroupSchema, ViewAllGroupsSchema, ViewGroupSchema, DeleteGroupSchema, DisableParentGroupSchema, DisableChildGroupSchema, EditParentGroupSchema, EditChildGroupSchema, AddToGroupSchema, RemoveFromGroupSchema } from '../../validations'

const taskGroupRouter = Router()

taskGroupRouter.post('/create', [authenticate, allowCoordinator, validate(CreateMainGroupSchema)], groupController.createParentGroup)

taskGroupRouter.post('/:parent_group_id/sub/create', [authenticate, allowCoordinator, validate(CreateChildGroupSchema)], groupController.createChildGroup)

taskGroupRouter.patch('/:parent_group_id/sub/:id', [authenticate, validate(EditChildGroupSchema)], groupController.editChildGroup)

taskGroupRouter.patch('/:parent_group_id/sub/:id/disable', [authenticate, allowCoordinator, validate(DisableChildGroupSchema)], groupController.removeChildGroup)

taskGroupRouter.patch('/:parent_group_id/sub/:id/add', [authenticate, allowCoordinator, validate(AddToGroupSchema)], groupController.addToGroup)

taskGroupRouter.patch('/:parent_group_id/sub/:id/remove', [authenticate, allowCoordinator, validate(RemoveFromGroupSchema)], groupController.removeFromGroup)

taskGroupRouter.patch('/:parent_group_id/sub/:id/manage-members', [authenticate, allowCoordinator, validate(RemoveFromGroupSchema)], groupController.manageGroupMembers)

taskGroupRouter.get('/', [authenticate, validate(ViewAllGroupsSchema)], groupController.searchGroups)

taskGroupRouter.get('/:id', [authenticate, validate(ViewGroupSchema)], groupController.getGroup)

taskGroupRouter.patch('/:id', [authenticate, validate(EditParentGroupSchema)], groupController.editParentGroup)

// taskGroupRouter.delete('/:id', [authenticate, allowCoordinator, validate(DeleteTaskGroupSchema)], taskController.deleteTaskGroup)

taskGroupRouter.patch('/:id/disable', [authenticate, allowCoordinator, validate(DisableParentGroupSchema)], groupController.removeParentGroup)

export default taskGroupRouter