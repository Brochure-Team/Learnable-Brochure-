import { IGenericObject, ICreateUser, IUpdateUser, IUser, ICreateTask, IUpdateTask, ITask, ICreateLeaderBoard, IUpdateLeaderBoard, ILeaderBoard, ICreateTaskSubmission, IUpdateTaskSubmission, ITaskSubmission, ICreateGroup, IUpdateGroup, IGroup, ICreateMentorGroup, IUpdateMentorGroup, IMentorGroup } from ".";

export type ICollections = IUser | ITask | ILeaderBoard | ITaskSubmission | IGroup | IMentorGroup;

export type ICreateCollections = ICreateUser | ICreateTask | ICreateGroup | ICreateLeaderBoard | ICreateTaskSubmission | ICreateMentorGroup;

export type IUpdateCollections = IUpdateUser | IUpdateTask | IUpdateGroup | IUpdateLeaderBoard | IUpdateTaskSubmission | IUpdateMentorGroup;