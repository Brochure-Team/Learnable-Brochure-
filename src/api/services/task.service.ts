import { Model } from 'mongoose';
import GenericService from "./generic.service";
import { ICreateTask, IMentor, IQuestion, ITask, IUpdateTask, IUser } from '../interfaces';
import { Task } from '../models'
import { ForbiddenException, InternalException, NotFoundException } from './error.service';
import { getTime } from '../utils';
import { taskSubmissionService } from '.';

export class TaskService extends GenericService<ITask> {
    constructor(model: Model<ITask>){
        super(model)
    }

    async createNewTask(createTaskData: ICreateTask, user: IMentor) {
        const { questions, tracks } = createTaskData
        const { track, _id } = user

        for (const question of questions) {
            const existingTask = await this.findOne({ "questions.title": question.title })
            
            if(!existingTask) break;

            const title = question.title
            const existingTaskTracks: string[] = existingTask.tracks
            
            if (existingTaskTracks.includes(<string>track)) 
                throw new ForbiddenException(`A task question with the title '${title}' for ${track} already exists`)
        }

        let i = 1
        for (const question of questions) {
            question.id = i
            i++
        }

        if (!tracks.includes(track)) throw new ForbiddenException(`You can only create tasks for your track`)

        createTaskData.facilitator = _id

        const newTask = await this.create(createTaskData)
        if (!newTask) throw new InternalException("Task was not created successfully")

        return newTask
    }

    async getOneTask(_id: string) {
        const existingTask: ITask | null = await this.findOne({ _id })

        if (!existingTask) throw new NotFoundException("Task does not exist.")

        return existingTask
    }

    async editTask(_id: string, data: IUpdateTask, user: IUser) {
        const existingTask = await this.findOne({ _id })
        const { role, _id: userId } = user

        if (!existingTask) throw new NotFoundException("Task does not exist.")

        if (role !== "coordinator" && userId.toString() !== (existingTask.facilitator as IUser)._id.toString())
            throw new ForbiddenException(`You can only edit tasks for your track or tasks that you created.`)

        const updatedTask = await this.updateOne({ _id: existingTask._id }, data)
        if (!updatedTask) throw new InternalException('Task was not updated successfully!')

        return updatedTask
    }

    async approveTask(_id: string, approveTaskData: any) {
        const { deadline } = approveTaskData
        const existingTask = await this.findOne({ _id })

        if (!existingTask) throw new NotFoundException("Task does not exist.")

        if (existingTask.deadline) throw new ForbiddenException("This task has already been approved.")

        const time = getTime(deadline)
        if (time.long === "Invalid Date") throw new ForbiddenException('Task duration must be a valid date.')
            
        const _deadline = time.unix
        const now = getTime().unix
        
        if (now > _deadline) throw new ForbiddenException('Task deadline must be ahead of the current time!')

        approveTaskData.approved = true
        approveTaskData.deadline = getTime(deadline).long
    
        const approvedTask = await this.updateOne({ _id: existingTask._id}, approveTaskData)
        if (!approvedTask) throw new InternalException('Task was not approved successfully!')

        return approvedTask
    }

    async changeTaskDeadline(_id: string, extendTaskData: any) {
        const { deadline } = extendTaskData
        const existingTask = await this.findOne({ _id })

        if (!existingTask) throw new NotFoundException("Task does not exist.")

        const now = getTime().unix
        let _deadline = getTime(deadline).unix
        const currentDeadline: number | null = existingTask.deadline ? getTime(existingTask.deadline).unix : null

        if (!currentDeadline) throw new ForbiddenException("This task does not have a deadline.")
        // if(currentDeadline > deadline) return sendResponse(res, 403, false, 'Deadline must be ahead of the current deadline!')
        if (currentDeadline === _deadline) throw new ForbiddenException('Deadline cannot be the same!')
        if (now > _deadline) throw new ForbiddenException('New task deadline must be ahead of the current time!')

        const updatedTask = await this.updateOne({ _id:  existingTask._id }, extendTaskData)
        if (!updatedTask) throw new InternalException('Task deadline was not extended successfully!')

        return updatedTask
    }

    async enableOrDisableTask(filter: { _id: string; deleted?: boolean }, action: string, user: IUser) {
        const { role, _id } = user
        const existingTask = await this.findOne(filter)
        if (!existingTask) throw new NotFoundException("Task does not exist.")

        if (role !== "coordinator" && _id.toString() !== (existingTask.facilitator as IUser)._id.toString())
            throw new ForbiddenException(`You can only ${action} tasks for your track or tasks that you created.`)

        // enabling and disabling a task
        if (action === 'disable') {
            const disabledTask = await this.updateOne({ _id: existingTask._id }, { deleted: true })
            if (!disabledTask) throw new InternalException('Task was not disabled successfully!')

            const { data: submissions } = (await taskSubmissionService.findAll({ task: existingTask._id }))
            for (const submission of submissions) {
                await taskSubmissionService.updateOne({ _id: submission._id}, { deleted: true })
            }

            return disabledTask
        }

        if (action === 'enable') {
            const enabledTask = await this.updateOne({ _id: existingTask._id }, { deleted: false })
            if (!enabledTask) throw new InternalException('Task was not enabled successfully!')

            const { data: submissions} = (await taskSubmissionService.findAll({ task: existingTask._id }))
            for (const submission of submissions) {
                await taskSubmissionService.updateOne({ _id: submission._id }, { deleted: false })
            }

            return enabledTask
        }
    }

    async deleteOneTask(_id: string) {
        const existingTask = await this.findOne({ _id })

        if (!existingTask) throw new NotFoundException("Task does not exist.")

        const deletedTask = await this.deleteOne({ _id: existingTask._id })
        if (!deletedTask) throw new InternalException('Task was not deleted successfully!')

        return deletedTask
    }

    async searchTasks(query: any) {
        const { _id, id, title, deleted, approved, track, question_id, submit_on, facilitator_id } = query

        if (track) {
            query.tracks = (track as string).toLowerCase().trim()
            delete query.track
        }
        if (submit_on) {
            query['questions.submit_on'] = (submit_on as string).toLowerCase().trim()
            delete query.submit_on
        }
        if (question_id) {
            query['questions._id'] = (question_id as string).trim()
            delete query.question_id
        }
        if (facilitator_id) {
            query.facilitator = (facilitator_id as string).trim()
            delete query.facilitator_id
        }
        if (id || _id) {
            query._id = ((id || _id) as string).trim()
            delete query.id
        }
        if (title) {
            query['questions.title'] = { $regex: (title as string).trim(), $options: "i" }
            delete query.title
        }

        if (typeof deleted === 'boolean') query.deleted = deleted
        if (typeof approved === 'boolean') query.approved = approved

        const { data: tasks, currentPage, totalPages } = await this.findAll(query)

        if (!tasks) throw new InternalException('There was an error fetching tasks.')
        
        return { tasks, currentPage, totalPages }
    }

}

export default new TaskService(Task)