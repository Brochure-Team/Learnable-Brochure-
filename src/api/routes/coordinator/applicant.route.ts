import { Router } from 'express'
import { applicantController } from '../../controllers'
import { validate, authenticate, allowCoordinator } from '../../middlewares'
import { CreateApplicantSchema, GetApplicantSchema, GetAllApplicantsSchema, EnableOrDisableApplicantSchema, DisableAllApplicantsSchema } from '../../validations'

const applicantRouter = Router()

applicantRouter.use([authenticate, allowCoordinator])

applicantRouter.post('/create', [validate(CreateApplicantSchema)], applicantController.createApplicant)

applicantRouter.get('/', [validate(GetAllApplicantsSchema)], applicantController.getAllApplicants)

applicantRouter.patch('/enable/:id', [validate(EnableOrDisableApplicantSchema)], applicantController.enableApplicant)

applicantRouter.delete('/disable/:id', [validate(EnableOrDisableApplicantSchema)], applicantController.disableApplicant)

applicantRouter.patch('/disable/:year', [validate(DisableAllApplicantsSchema)], applicantController.disableAllApplicants)

applicantRouter.get('/:id', [validate(GetApplicantSchema)], applicantController.getApplicant)

export default applicantRouter