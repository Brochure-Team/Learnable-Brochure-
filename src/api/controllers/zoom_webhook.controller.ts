import { Request, Response } from 'express'
import crypto from 'crypto'
import { saveMeetingsService } from '../services'

export default (req: Request, res: Response) => {
  console.log('THIS IS THE WEBHOOK BODY:', req.body)

  // construct the message string
  const message = `v0:${req.headers['x-zm-request-timestamp']}:${JSON.stringify(req.body)}`
  const hashForVerify = crypto.createHmac('sha256', <string>process.env.ZOOM_WEBHOOK_SECRET_TOKEN).update(message).digest('hex')
  
  // hash the message string with your Webhook Secret Token and prepend the version semantic
  const signature = `v0=${hashForVerify}`
  // you validating the request came from Zoom https://marketplace.zoom.us/docs/api-reference/webhook-reference#notification-structure
  if (req.headers['x-zm-signature'] === signature) {
    
    // Zoom validating you control the webhook endpoint https://marketplace.zoom.us/docs/api-reference/webhook-reference#validate-webhook-endpoint
    if(req.body.event === 'endpoint.url_validation') {
      const hashForValidate = crypto.createHmac('sha256', <string>process.env.ZOOM_WEBHOOK_SECRET_TOKEN).update(req.body.payload.plainToken).digest('hex')

      return res.status(200).json({
        plainToken: req.body.payload.plainToken,
        encryptedToken: hashForValidate
      })
    } else {
      saveMeetingsService(req.body.payload.object.id)
      .then((result) => {
        return res.status(200).json({success: true, message: result })
      })
      .catch((error) => {
        console.error("Async operation error:", error);
      })
    }
  } else {
    
    return res.status(401).json({ message: 'Unauthorized request to Zoom Meeting End Webhook.', status: 401 })
  }
}