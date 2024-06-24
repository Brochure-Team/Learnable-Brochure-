import { Router } from 'express';
import { announcementController } from '../../controllers'
import { authenticate } from '../../middlewares'

const announcementRouter = Router()

announcementRouter.post('/', [authenticate], announcementController.createAnnouncement)

announcementRouter.get('/:id', [authenticate], announcementController.getAnnouncement)

announcementRouter.put('/:id', [authenticate], announcementController.updateAnnouncement)

announcementRouter.put('/:id', [authenticate], announcementController.deleteAnnouncement)

announcementRouter.get('/', [authenticate], announcementController.getAllAnnouncements)

export default announcementRouter