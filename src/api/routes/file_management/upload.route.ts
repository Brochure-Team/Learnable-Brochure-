import { Router } from 'express'
import { authenticate, uploadFiles } from '../../middlewares'
import { uploadController } from '../../controllers'

const uploadRouter = Router()

uploadRouter.post('/upload', [authenticate, uploadFiles(1)], uploadController.uploadFile)

export default uploadRouter