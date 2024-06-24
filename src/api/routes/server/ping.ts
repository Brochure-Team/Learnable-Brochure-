import axios from 'axios';
import { Request, Response, Router } from 'express';
import { sendResponse } from '../../utils';

const pingRouter = Router()

pingRouter.get('/', async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${process.env.SERVER_BASE_URL}/health`);
        return sendResponse(res, response.status, true, "Your server is healthy")
    } catch (error) {
        return sendResponse(res, 500, false, "Your server is unhealthy")
    }
});

export default pingRouter