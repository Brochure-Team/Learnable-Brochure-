import { Request, Response } from "express";
import { sendResponse } from "../utils";
import mentorshipService from "../services/mentorship.service";

class MentorShipController {
    async giveMentorPermission(req: Request, res: Response) {
        const { permission } = req.body
        const { id } = req.params

        const mentor = await mentorshipService.givePermission(id, permission)

        return sendResponse(res, 200, true, `${permission} role assigned successfully!`, mentor)
    }

    async takeMentorPermission(req: Request, res: Response) {
        const { permission } = req.body
        const { id } = req.params

        const mentor = await mentorshipService.takePermission(id, permission)

        return sendResponse(res, 200, true, `${permission} permission removed successfully!`, mentor)
    }

    async assignMentor(req: Request, res: Response) {
        const { id } = req.params
        const { interns } = req.body

        const data = await mentorshipService.assignMentor(id, interns)

        return sendResponse(res, 200, true, `Interns successfully added to mentorship group!`, data)
    }

    async changeMentor(req: Request, res: Response) {
        const { intern_id } = req.body
        const { id } = req.params

        const intern = await mentorshipService.changeMentor(id, intern_id)

        return sendResponse(res, 200, true, `Mentor successfully changed for ${intern.fullName}!`, intern)
    }
}

export default new MentorShipController()