import { Request, Response } from "express";
import { sendResponse } from "../utils";
import { meetingAttendanceService } from "../services"

class MeetingAttendanceController{
    async getMeeting(req: Request, res: Response) {
        const isExistingMeeting = await meetingAttendanceService.findOne({ _id: req.params.id})
        if(!isExistingMeeting) return sendResponse(res, 404, false, 'Meeting not found')

        return sendResponse(res, 200, true, `Meeting fetched successfully!`, isExistingMeeting)
    }

    async searchMeetings(req: Request, res: Response) {
        const query = req.query
        console.log(query);
        
        let result = await meetingAttendanceService.findAll(query)
        
        if (!result.data) return sendResponse(res, 401, false, 'Meetings were not fetched.')

        if (result.data.length === 0) return sendResponse(res, 404, false, 'There are no meeting attendances matching your search.')

        return sendResponse(res, 200, true, 'Meeting attendances fetched successfully!', result)
    }
}

export default new MeetingAttendanceController()