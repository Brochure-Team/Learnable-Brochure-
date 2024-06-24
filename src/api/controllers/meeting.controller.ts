import { Request, Response } from "express";
import { sendResponse } from "../utils";
import { meetingService } from "../services"

class MeetingController {
    async getMeeting(req: Request, res: Response) {
        const isExistingMeeting = await meetingService.findOne({ _id: req.params.id })
        if (!isExistingMeeting) return sendResponse(res, 404, false, 'Meeting not found')

        return sendResponse(res, 200, true, `Meeting fetched successfully!`, isExistingMeeting)
    }

    async searchMeetings(req: Request, res: Response) {
        const query = req.query

        if (query.topic) {
            query['topic'] = { $regex: (query.topic as string).trim(), $options: "i" }
        }

        if (query.track) {
            query['tracks'] = query.track
            delete query.track
        }
        console.log(req.query);

        const result = await meetingService.findAll(query)
        const { data: meetings } = result

        if (!meetings) return sendResponse(res, 401, false, 'Meetings were not fetched.')

        if (meetings.length === 0) return sendResponse(res, 404, false, 'There are no meetings matching your search.')

        return sendResponse(res, 200, true, 'Meetings fetched successfully!', result)
    }
}

export default new MeetingController()