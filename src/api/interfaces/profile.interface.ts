import { Types, Document } from "mongoose"
import { IMentorGroup } from "./mentorship.group.interface";
export interface IUser extends Document {
    _id: string;
    fullName: string;
    avatar: string;
    email: string;
    password: string;
    displayName: string;
    role: string;
    otp: object[]
    phoneNumber: string;
    deleted: boolean
    isVerified: boolean
}

export interface InternInterface extends IUser {
    mentor: Types.ObjectId | IUser | null | string
    track: string;
}

export interface IMentor extends IUser {
    permissions: string[]
    track: string;
    group_info: Types.ObjectId | IMentorGroup | string
}
// export interface ICoordinator extends IUser{
//     permissions: string[]
// }

export interface ICreateUser {
    fullName: string;
    email: string;
    avatar: string;
    password: string;
    displayName: string;
    group_info?: Types.ObjectId | IMentorGroup | string;
    role: string; type: string;
    phoneNumber: string;
    track?: string;
}

export interface IUpdateUser {
    email?: string;
    avatar?: string;
    password?: string;
    newPassword?: string;
    displayName?: string;
    phoneNumber?: string;
    track?: string;
    deleted?: boolean
    isVerified?: boolean
    permissions?: string[]
}