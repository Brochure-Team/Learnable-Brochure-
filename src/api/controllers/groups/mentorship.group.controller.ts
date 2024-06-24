import { Request, Response } from "express";
import { mentorshipGroupService } from "../../services";
import { sendResponse } from "../../utils";
import { IMentor, IUser } from "../../interfaces/profile.interface";

class MentorshipController {
    async getOne(req: Request, res: Response) {
        const { id } = req.params

        const data = await mentorshipGroupService.getGroup(id)

        return sendResponse(res, 200, true, "Mentorship Group fetched successfully", data)
    }


    async search(req: Request, res: Response) {
        const query = req.query

        const { groups, currentPage, totalPages } = await mentorshipGroupService.getGroups(query)

        return sendResponse(res, 200, true, 'Mentorship Groups successfully fetched', groups, { currentPage, totalPages })
    }


    async edit(req: Request, res: Response) {
        const { id } = req.params
        const payload = req.body
        const user = req.user as unknown as IUser

        const data = await mentorshipGroupService.editGroup(id, payload, user)

        return sendResponse(res, 200, true, "Mentorship Group updated successfully", data)
    }

    async delete(req: Request, res: Response) {
        const { id: _id } = req.params
        const data = await mentorshipGroupService.deleteGroup({ _id })

        return sendResponse(res, 200, true, "Mentorship Group deleted successfully", data)
    }

    async disable(req: Request, res: Response) {
        const { id: _id } = req.params
        const data = await mentorshipGroupService.disableGroup({ _id })

        return sendResponse(res, 200, true, "Mentorship Group disabled successfully", data)
    }
}

export default new MentorshipController()