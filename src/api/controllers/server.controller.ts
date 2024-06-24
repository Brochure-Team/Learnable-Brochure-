import { Request, Response, NextFunction } from "express";
import { sendResponse, getTime, isHome } from "../utils";
import { MESSAGES } from "../../configs";

class ServerController {
    async getCurrentTime(req: Request, res: Response) {
        const { time } = req.params

        if (time) return sendResponse(res, 200, true, "Time information fetched successfully", getTime(time))

        return sendResponse(res, 200, true, "Current server time fetched successfully", getTime())
    }

    checkHealth(req: Request, res: Response) {
        res.sendStatus(200)
    }

    resourceNotFound(req: Request, res: Response) {
        sendResponse(res, 404, false, MESSAGES.PAGE_NOT_FOUND)
    }

    sayWelcome(req: Request, res: Response, next: NextFunction) {
        if (isHome(req)) return sendResponse(res, 200, true, 'Welcome to learnwave api')
        next()
    }

    redirect = (url: string, res: Response) => res.redirect(301, url)

    redirectToHome = (req: Request, res: Response, next: NextFunction) => {
        if (isHome(req)) this.redirect('/', res)
        next()
    }
}

export default new ServerController()