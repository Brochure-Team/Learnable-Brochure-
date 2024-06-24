import { Request, Response } from "express";
import { internService } from "../../services";
import { sendResponse } from "../../utils";

class InternController {
    async getIntern(req: Request, res: Response) {
        const existingIntern = await internService.findOne({ _id: req.params.id });
    
        if (!existingIntern)
          return sendResponse(res, 404, false, `This intern does not exist`);
    
        return sendResponse(
          res,
          200,
          true,
          `Intern fetched successfully!`,
          existingIntern
        );
      }

    // Getting all interns
    async getInterns(req: Request, res: Response) {
        const { id, fullName, deleted } = req.query

        if (id) {
            delete req.query.id
            req.query._id = id
        }
        if (fullName) req.query.fullName = {
            $regex: (fullName as string).toLowerCase().trim(),
            $options: "i",
        };
        if (typeof deleted === 'boolean') req.query.deleted = deleted

        const { data: users, currentPage, totalPages } = await internService.findAll(req.query)
        if (!users) return sendResponse(res, 404, false, 'There was a problem fetching users.')
        if (users.length === 0) return sendResponse(res, 200, true, 'There are no users matching your search', [])

        return sendResponse(res, 200, true, 'Users successfully fetched', { users, currentPage, totalPages })
    }
}

export default new InternController();