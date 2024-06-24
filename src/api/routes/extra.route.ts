import { Router } from 'express';
import { serverController } from '../controllers';

const extraRouter = Router()

extraRouter.get('/', serverController.getCurrentTime)

extraRouter.get('/:time', serverController.getCurrentTime)

export default extraRouter