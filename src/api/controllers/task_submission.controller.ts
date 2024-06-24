import { Request, Response } from "express"
import { taskSubmissionService } from "../services"
import { sendResponse } from "../utils"
import { IUser, IMentor } from '../interfaces'

class TaskSubmission {
    async submit(req: Request, res: Response) {
        const { id } = req.params
        const payload = req.body
        const user = req.user as unknown as IMentor

        const data = await taskSubmissionService.submitTask(id, payload, user)

        return sendResponse(res, 200, true, "Task was submitted successfully", data)
    }

    async getSubmission(req: Request, res: Response) {
        const { id, task_id } = req.params
        const data = await taskSubmissionService.getTaskSubmission(id, task_id)

        return sendResponse(res, 200, true, "Task submission fetched successfully", data)
    }

    async getSubmissionsForAnIntern(req: Request, res: Response) {
        const { id: intern_id } = req.params
        const { taskSubmissions, currentPage, totalPages } = await taskSubmissionService.getAllTaskSubmissionsForAnIntern(intern_id);

        return sendResponse(res, 200, true, "All your task submission were fetched successfully", taskSubmissions, { currentPage, totalPages })
    }

    async search(req: Request, res: Response) {
        const query = req.query
        const { task_id } = req.params

        const { taskSubmissions, currentPage, totalPages } = await taskSubmissionService.filterTaskSubmissions(task_id, query)

        return sendResponse(res, 200, true, 'Task submissions successfully fetched', taskSubmissions, { currentPage, totalPages })
    }

    async edit(req: Request, res: Response) {
        const { id: _id, task_id: task } = req.params
        const payload = req.body
        const user = req.user as unknown as IUser

        const data = await taskSubmissionService.updateTaskSubmission({ _id, task }, payload, user)

        return sendResponse(res, 200, true, "Task submission edited successfully", data)
    }


    async grade(req: Request, res: Response) {
        const { id: _id, task_id: task } = req.params
        const payload = req.body
        const user = req.user as unknown as IMentor

        const data = await taskSubmissionService.gradeOrRemarkTaskSubmission({ _id, task }, 'grade', payload, user)

        return sendResponse(res, 200, true, "Task submission was graded successfully", data)
    }


    async remark(req: Request, res: Response) {
        const { id: _id, task_id: task } = req.params
        const payload = req.body
        const user = req.user as unknown as IMentor

        const data = await taskSubmissionService.gradeOrRemarkTaskSubmission({ _id, task }, 'remark', payload, user)

        return sendResponse(res, 200, true, "Task submission was regraded successfully", data)
    }


    async disable(req: Request, res: Response) {
        const { id } = req.params

        const data = await taskSubmissionService.disableTaskSubmission(id)

        return sendResponse(res, 200, true, "Task submission was removed successfully", data)
    }


    async delete(req: Request, res: Response) {
        const { id } = req.params

        const data = await taskSubmissionService.deleteTaskSubmission(id)

        return sendResponse(res, 200, true, "Submission deleted successfully", data)
    }
}

export default new TaskSubmission