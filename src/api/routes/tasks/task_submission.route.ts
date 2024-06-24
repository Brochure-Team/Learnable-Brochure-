import { Router } from 'express';
import { taskSubmissionController } from '../../controllers'
import { validate, authenticate, allowCoordinator, allowIntern, allowMarker, allowFacilitator } from '../../middlewares'
import { CreateTaskSubmissionSchema, ViewAllTaskSubmissionsSchema, ViewOneTaskSubmissionSchema, DeleteOneTaskSubmissionSchema, DisableOneTaskSubmissionSchema, GradeTaskSubmissionSchema, ViewAllTaskSubmissionsForATaskSchema, EditATaskSubmissionSchema, RemarkTaskSubmissionSchema } from '../../validations'

const taskSubmissionRouter = Router()

/* ROUTES FOR TASK SUBMISSION */
taskSubmissionRouter.get('/submissions', [authenticate, validate(ViewAllTaskSubmissionsSchema)], taskSubmissionController.search)

taskSubmissionRouter.post('/:task_id/submissions/create', [authenticate, allowIntern, validate(CreateTaskSubmissionSchema)], taskSubmissionController.submit)

taskSubmissionRouter.get('/:task_id/submissions', [authenticate, validate(ViewAllTaskSubmissionsForATaskSchema)], taskSubmissionController.search)

taskSubmissionRouter.get('/:task_id/submissions/:id', [authenticate, validate(ViewOneTaskSubmissionSchema)], taskSubmissionController.getSubmission)
    
taskSubmissionRouter.delete('/:task_id/submissions/:id', [authenticate, allowCoordinator, validate(DeleteOneTaskSubmissionSchema)], taskSubmissionController.delete)
    
taskSubmissionRouter.patch('/:task_id/submissions/:id', [authenticate, validate(EditATaskSubmissionSchema)], taskSubmissionController.edit)

taskSubmissionRouter.patch('/:task_id/submissions/:id/disable', [authenticate, allowCoordinator, validate(DisableOneTaskSubmissionSchema)], taskSubmissionController.disable)

taskSubmissionRouter.patch('/:task_id/submissions/:id/grade', [authenticate, allowMarker, validate(GradeTaskSubmissionSchema)], taskSubmissionController.grade)

taskSubmissionRouter.patch('/:task_id/submissions/:id/remark', [authenticate, allowMarker, validate(RemarkTaskSubmissionSchema)], taskSubmissionController.remark)

export default taskSubmissionRouter