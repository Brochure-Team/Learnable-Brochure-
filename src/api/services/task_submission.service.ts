import { Model } from "mongoose";
import GenericService from "./generic.service";
import {
  IAnswer,
  ICreateTaskSubmission,
  IGroup,
  IMentor,
  ISubGroup,
  ITask,
  ITaskSubmission,
  IUpdateTaskSubmission,
  IUser,
  InternInterface,
} from "../interfaces";
import { TaskSubmission } from "../models";
import taskService from "./task.service";
import {
  ForbiddenException,
  InternalException,
  NotFoundException,
} from "./error.service";
import { getTime, hasDuplicateKey } from "../utils";
import { childGroupService, groupService } from "./groups";
import { isSubmissionOwnerOrGroupMember } from "../middlewares";
export class TaskSubmissionService extends GenericService<ITaskSubmission> {
  constructor(model: Model<ITaskSubmission>) {
    super(model);
  }

  async submitTask(
    _id: string,
    submitTaskData: ICreateTaskSubmission,
    user: IMentor
  ) {
    const { answers } = submitTaskData;
    const { _id: intern, track } = user;
    // Checks if task exists with the task id
    const existingTask = (await taskService.findOne({ _id })) as ITask;
    if (!existingTask) throw new NotFoundException("Task does not exist.");

    // Checks if the number of answers are the same with the number of questions
    if (existingTask.questions.length !== answers.length)
      throw new ForbiddenException(
        "Your answers are more than or less than the number of questions."
      );

    // Checks if the question_id of each answer are unique
    if (hasDuplicateKey(answers, "question_id"))
      throw new ForbiddenException(
        "Question id must be unique for each answer."
      );

    // Checks if a submission has already been made by the user for particular task
    const isExistingSubmission = await this.findOne({
      $or: [
        { task: existingTask._id, intern },
        { task: existingTask._id, group: intern },
      ],
    });

    if (isExistingSubmission)
      throw new ForbiddenException(
        "You have already made a submission for this task."
      );

    // Checks if a user is trying to submit a task that is not for their track
    if (!existingTask.tracks.includes(<string>track))
      throw new ForbiddenException(
        "You can only attempt tasks for your track."
      );

    // Gets the current time and task deadline for checks
    const now = getTime().unix;
    let deadline = existingTask.deadline
      ? getTime(existingTask.deadline).unix
      : null;

    if (!deadline)
      throw new ForbiddenException(
        "You cannot submit this task as the deadline has not been set yet."
      );

    if (deadline && now > deadline)
      throw new ForbiddenException(
        "You cannot submit this task as the deadline for submission has passed."
      );

    if (existingTask.type === "group") {
      const group = (await childGroupService.findOne({
        interns: intern,
      })) as ISubGroup;
      if (!group) throw new NotFoundException("Group not found for your task.");

      submitTaskData.group = group._id;
      submitTaskData.interns = group.interns;
    } else if (existingTask.type === "individual") {
      submitTaskData.interns = [intern];
    }

    // Sets task submission details
    submitTaskData.task = existingTask._id;
    submitTaskData.tracks = submitTaskData.tracks || existingTask.tracks;
    submitTaskData.type = submitTaskData.type || existingTask.type;

    // Creates task submission
    const newTaskSubmission = await this.create(submitTaskData);
    if (!newTaskSubmission)
      throw new InternalException("Task submission failed!");

    return newTaskSubmission;
  }

  async getTaskSubmission(_id: string, task: string) {
    const existingTaskSubmission = await this.findOne({ _id, task });

    if (!existingTaskSubmission)
      throw new NotFoundException("Submission does not exist.");
    if (!existingTaskSubmission)
      throw new InternalException("Failed to get task submissio.!");

    return existingTaskSubmission;
  }

  async getAllTaskSubmissionsForAnIntern(interns: string) {
    const {
      data: taskSubmissions,
      currentPage,
      totalPages,
    } = await this.findAll({ interns });

    if (!taskSubmissions)
      throw new InternalException("Submission could not be fetched.");

    return { taskSubmissions, currentPage, totalPages };
  }

  async filterTaskSubmissions(task_id: string, query: any) {
    const { task, intern, id, _id, type, question_id, isGraded, deleted } =
      query;

    if (task || task_id) {
      const _task = task || task_id;
      query.task = (_task as string).toLowerCase().trim();
      delete query.task_id;
    }

    if (intern) {
      query.interns = (intern as string).toLowerCase().trim();
      delete query.intern;
    }

    if (id || _id) {
      query._id = ((id || _id) as string).trim();
      delete query?.id;
    }

    if (type) query.type = { $regex: (type as string).trim(), $options: "i" };

    if (question_id) {
      query["answers.question_id"] = (question_id as string).trim();
      delete query.question_id;
    }

    if (typeof deleted === "boolean") query.deleted = deleted;
    if (typeof isGraded === "boolean") query.isGraded = isGraded;

    const {
      data: taskSubmissions,
      currentPage,
      totalPages,
    } = await this.findAll(query);

    if (!taskSubmissions)
      throw new InternalException(
        "There was a problem getting task submissions matching your search"
      );

    return { taskSubmissions, currentPage, totalPages };
  }

  async updateTaskSubmission(
    params: { _id: string; task: string },
    updateTaskSubmissionData: IUpdateTaskSubmission,
    user: IUser
  ) {
    const { _id, task } = params;

    const existingTaskSubmission = (await this.findOne({
      _id,
      task,
    })) as ITaskSubmission;

    if (!existingTaskSubmission)
      throw new NotFoundException("Task submission does not exist.");

    const isAllowedToEdit = isSubmissionOwnerOrGroupMember(
      existingTaskSubmission,
      user
    );

    if (!isAllowedToEdit)
      throw new ForbiddenException(
        "You cannot edit a submission that does not belong to you."
      );

    if (existingTaskSubmission.type === "group") {
      const existingTaskGroup: IGroup | null = await groupService.findOne({
        _id: (existingTaskSubmission.group as IGroup)._id,
      });
      if (!existingTaskGroup)
        throw new ForbiddenException(
          "The task group this submission belongs to was not found."
        );
    }

    // Gets task deadline and current time for checks
    const deadline =
      (existingTaskSubmission.task as ITask).deadline &&
      getTime(<string>(existingTaskSubmission.task as ITask).deadline).unix;
    const now = getTime().unix;

    if (!deadline || (deadline && now > deadline))
      throw new ForbiddenException(
        "This task submission cannot be edited as its submission deadline has passed."
      );

    if (existingTaskSubmission.isGraded)
      throw new ForbiddenException("This submission has already been graded.");

    const updatedTaskSubmission = await this.updateOne(
      { _id: existingTaskSubmission._id },
      updateTaskSubmissionData
    );
    if (!updatedTaskSubmission)
      throw new InternalException(
        "Task submission was not edited successfully!"
      );

    return updatedTaskSubmission;
  }

  async gradeOrRemarkTaskSubmission(
    params: { _id: string; task: string },
    action: string,
    gradeTaskSubmissionData: any,
    user: IMentor
  ) {
    const { _id, task } = params;
    const { _id: userId, track } = user;
    const { answers } = gradeTaskSubmissionData;

    // Checks if submission exists
    const existingTaskSubmission = await this.findOne({ _id, task }) as ITaskSubmission;
    if (!existingTaskSubmission)
      throw new NotFoundException("Submission does not exist.");

    if (!existingTaskSubmission.tracks.includes(<string>track))
      throw new ForbiddenException(
        `You can only mark task submissions for your track.`
      );

    // Gets task deadline and current time for checks
    const deadline =
      (existingTaskSubmission.task as ITask).deadline &&
      getTime(<string>(existingTaskSubmission.task as ITask).deadline).unix;
    const now = getTime().unix;

    if (!deadline || (deadline && now < deadline))
      throw new ForbiddenException(
        "This task submission cannot be graded until its submission deadline has passed."
      );

    // Checks if task is graded already
    if (action === "grade" && existingTaskSubmission.isGraded)
      throw new ForbiddenException("This submission has already been graded.");

    // Checks if task was previously graded
    if (action === "remark" && !existingTaskSubmission.isGraded)
      throw new ForbiddenException("This submission was not graded.");

    // Checks if task is owned by a mentor's mentee
    const interns = existingTaskSubmission.interns as InternInterface[];
    interns.forEach((intern: InternInterface) => {
      if ((intern.mentor as IUser)?._id.toString() === userId.toString())
        throw new ForbiddenException("You cannot grade your mentees task.");
    });

    // Checks if all answers were graded
    if (answers.length !== existingTaskSubmission.answers.length)
      throw new ForbiddenException(
        "The number of graded and original questions are not the same."
      );

    // Updates grade for every answer in the task submission
    const markedAnswers = answers;
    const unmarkedAnswers = existingTaskSubmission.toObject().answers;
    gradeTaskSubmissionData.answers = [];

    for (const unmarkedAnswer of unmarkedAnswers) {
      for (const markedAnswer of markedAnswers)
        if (unmarkedAnswer.question_id === markedAnswer.question_id) {
          gradeTaskSubmissionData.answers.push({
            ...unmarkedAnswer,
            ...markedAnswer,
          });
        }
    }

    // Adds individual answer grades to make up the total task score
    const totalGrades = gradeTaskSubmissionData.answers.reduce(
      (totalGrade: number, currentAnswer: IAnswer) => {
        let valueToAdd = currentAnswer.grade;
        return totalGrade + valueToAdd;
      },
      0
    );

    // Sets field for grading tasks
    // req.body.grade = Math.ceil(totalGrades / req.body.answers.length)
    // req.body.grade = Math.floor(totalGrades / req.body.answers.length)
    gradeTaskSubmissionData.grade = totalGrades / answers.length;
    gradeTaskSubmissionData.isGraded = true;
    gradeTaskSubmissionData.gradedBy = userId;

    const gradedOrRemarkedTaskSubmission = await this.updateOne(
      { _id: existingTaskSubmission._id },
      gradeTaskSubmissionData
    );
    if (!gradedOrRemarkedTaskSubmission)
      throw new InternalException("Submission was not successfully graded!");

    return gradedOrRemarkedTaskSubmission;
  }

  async disableTaskSubmission(_id: string) {
    const existingTaskSubmission = await this.findOne({ _id });

    if (!existingTaskSubmission)
      throw new NotFoundException("Submission does not exist.");

    const disabledTaskSubmission = await this.updateOne(
      { _id: existingTaskSubmission._id },
      { deleted: true }
    );
    if (!disabledTaskSubmission)
      throw new InternalException("Submission was not removed successfully!");

    return disabledTaskSubmission;
  }

  async deleteTaskSubmission(_id: string) {
    const existingTaskSubmission = await this.findOne({ _id });

    if (!existingTaskSubmission)
      throw new NotFoundException("Submission does not exist.");

    const deletedTaskSubmission = await this.deleteOne({ _id });
    if (!deletedTaskSubmission)
      throw new InternalException("Submission was not removed successfully!");

    return deletedTaskSubmission;
  }
}

export default new TaskSubmissionService(TaskSubmission);