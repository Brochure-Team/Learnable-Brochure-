import { Request, Response } from "express";
import { mentorService } from "../../services";
import { sendResponse } from "../../utils";

class MentorController {
  async getMentor(req: Request, res: Response) {
    const existingMentor = await mentorService.findOne({ _id: req.params.id });

    if (!existingMentor)
      return sendResponse(res, 404, false, `This mentor does not exist`);

    return sendResponse(
      res,
      200,
      true,
      `Mentor fetched successfully!`,
      existingMentor
    );
  }

  async getMentors(req: Request, res: Response) {
    const { id, fullName, deleted } = req.query;

    if (id) {
      delete req.query.id;
      req.query._id = id;
    }
    if (fullName)
      req.query.fullName = {
        $regex: (fullName as string).toLowerCase().trim(),
        $options: "i",
      };
    if (typeof deleted === "boolean") req.query.deleted = deleted;

    const {
      data: users,
      currentPage,
      totalPages,
    } = await mentorService.findAll(req.query);
    if (!users)
      return sendResponse(
        res,
        404,
        false,
        "There was a problem fetching mentors."
      );
    if (users.length === 0)
      return sendResponse(
        res,
        200,
        true,
        "There are no mentors matching your search",
        []
      );

    return sendResponse(res, 200, true, "Mentors successfully fetched", {
      users,
      currentPage,
      totalPages,
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params
    const data = await mentorService.deleteMentor(id)

    return sendResponse(res, 200, true, "Mentor deleted successfully", data);
  }

  async disable(req: Request, res: Response) {
    const { id } = req.params
    const data = await mentorService.disableMentor(id)

    return sendResponse(res, 200, true, "Mentor disabled successfully", data);
  }
}

export default new MentorController();
