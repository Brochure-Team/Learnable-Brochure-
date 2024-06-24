import { Request, Response } from "express";
import { taskService } from "../services";
import { sendResponse } from "../utils";
import { IMentor, IUser } from "../interfaces/profile.interface";

class TaskController {
    async createTask(req: Request, res: Response) {
        const payload = req.body
        const user = req.user as unknown as IMentor

        const data = await taskService.createNewTask(payload, user)

        return sendResponse(res, 200, true, "Task was created successfully", data)
    }

    async getTask(req: Request, res: Response) {
        const { id } = req.params

        const data = await taskService.getOneTask(id)

        return sendResponse(res, 200, true, "Task fetched successfully", data)
    }


    async getTasks(req: Request, res: Response) {
        const query = req.query

        const { tasks, currentPage, totalPages } = await taskService.searchTasks(query)

        return sendResponse(res, 200, true, 'Tasks successfully fetched', tasks, { currentPage, totalPages })
    }


    async editTask(req: Request, res: Response) {
        const { id } = req.params
        const payload = req.body
        const user = req.user as unknown as IUser

        const data = await taskService.editTask(id, payload, user)

        return sendResponse(res, 200, true, "Task updated successfully", data)
    }

    async approve(req: Request, res: Response) {
        const { id } = req.params
        const payload = req.body

        const data = await taskService.approveTask(id, payload)

        return sendResponse(res, 200, true, "Task approved successfully", data)
    }

    async changeDeadline(req: Request, res: Response) {
        const { id } = req.params
        const payload = req.body

        const data = await taskService.changeTaskDeadline(id, payload)

        return sendResponse(res, 200, true, "Task deadline extended successfully", data)
    }

    async enableTask(req: Request, res: Response) {
        const { id: _id } = req.params
        const user = req.user as unknown as IUser

        const data = await taskService.enableOrDisableTask({ _id, deleted: true }, 'enable', user)

        return sendResponse(res, 200, true, "Task enabled successfully", data)
    }

    async disableTask(req: Request, res: Response) {
        const { id: _id } = req.params
        const user = req.user as unknown as IUser

        const data = await taskService.enableOrDisableTask({ _id }, 'disable', user)

        return sendResponse(res, 200, true, "Task disabled successfully", data)
    }

    async deleteTask(req: Request, res: Response) {
        const { id } = req.params
        const data = await taskService.deleteOneTask(id)

        return sendResponse(res, 200, true, "Task deleted successfully", data)
    }
}

export default new TaskController()