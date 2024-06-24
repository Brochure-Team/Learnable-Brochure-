import { Request, Response } from "express";
import { coordinatorService } from "../../services";
import { sendResponse } from "../../utils";

class CoordinatorController {
    async getCoordinator(req: Request, res: Response) {
        const existingCoordinator = await coordinatorService.findOne({ _id: req.params.id });
    
        if (!existingCoordinator)
          return sendResponse(res, 404, false, `This coordinator does not exist`);
    
        return sendResponse(
          res,
          200,
          true,
          `Coordinator fetched successfully!`,
          existingCoordinator
        );
      }

    async getCoordinators(req: Request, res: Response) {
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

        const { data: users, currentPage, totalPages } = await coordinatorService.findAll(req.query)
        if (!users) return sendResponse(res, 404, false, 'There was a problem fetching coordinators.')
        if (users.length === 0) return sendResponse(res, 200, true, 'There are no coordinators matching your search', [])

        return sendResponse(res, 200, true, 'Coordinators successfully fetched', { users, currentPage, totalPages })
    }
}

export default new CoordinatorController();