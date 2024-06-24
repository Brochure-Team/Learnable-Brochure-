import { Request, Response, Router }from 'express'
import { zoomWebhookController } from '../controllers'
const webhookRouter = Router()

webhookRouter.get('/', (req: Request, res: Response) => {
    res.send('Zoom Webhook route is live')
})

webhookRouter.post('/save_meeting', zoomWebhookController)

export default webhookRouter;