import { Model } from "mongoose";
import { User, Intern, Mentor, Coordinator } from "../models";

import GenericService from "./generic.service";
import {
  NotFoundException,
  ForbiddenException,
  UnAuthorizedException,
  InternalException,
} from "./error.service";

import {
  IUser,
  InternInterface,
  IMentor,
  IUpdateUser,
} from "../interfaces";

import { hash, sendMail, verifyHash } from "../utils";
import { mentorshipGroupService } from "./groups";

class UserService<T extends IUser> extends GenericService<T> {
  private internService?: GenericService<InternInterface>;
  private mentorService?: GenericService<IMentor>;
  private coordinatorService?: GenericService<IUser>;

  // Constructor overloads to optionally let the user class itself be instantiated with extra properties
  constructor(model: Model<T>);
  constructor(
    model: Model<T>,
    internService: GenericService<InternInterface>,
    mentorService: GenericService<IMentor>,
    coordinatorService: GenericService<IUser>
  );

  constructor(
    model: Model<T>,
    internService?: GenericService<InternInterface>,
    mentorService?: GenericService<IMentor>,
    coordinatorService?: GenericService<IUser>
  ) {
    super(model);

    // Ensure that only the base UserService class can accept the extra services
    if (
      internService &&
      mentorService &&
      coordinatorService &&
      new.target === UserService
    ) {
      this.internService = internService;
      this.mentorService = mentorService;
      this.coordinatorService = coordinatorService;
    }
  }

  async editUser(id: string, payload: IUpdateUser, user: IUser) {
    const { email, password, newPassword } = payload;
    const existingUser = (await this.findOne({ _id: id })) as IUser | null;

    if (!existingUser) throw new NotFoundException(`This user does not exist`);

    if (user._id.toString() !== existingUser._id.toString())
      throw new ForbiddenException(
        `You do not have permission to update this user`
      );

    if (email) {
      const existingUser = await this.findOne({ email });
      if (existingUser)
        throw new ForbiddenException(`This email is not available.`);
    }

    if (password) {
      const isValid = await verifyHash(password, existingUser.password);

      if (!isValid)
        throw new UnAuthorizedException(`Email or Password is incorrect`);
      payload.password = await hash(<string>newPassword);
      delete payload.newPassword;
    }

    const updatedUser = await this.updateOne({ _id: id }, payload);
    if (!updatedUser)
      throw new ForbiddenException("Your profile update failed");

    const data: any = updatedUser.toObject();
    delete data.password;

    let message = "";
    for (const key in payload) {
      let specificMessage: string | boolean = false;
      let genericMessage = `Your profile was updated successfully! Please reset your password if this wasn't done by you`;

      if (key === "password")
        specificMessage = `Your ${key} was changed successfully!`;

      if (key === "avatar")
        specificMessage = `Your ${key} was changed successfully!`;

      if (key === "password")
        specificMessage = `Your ${key} was changed successfully!`;

      if (key === "displayName")
        specificMessage = `Your ${key} was changed successfully!`;

      if (!specificMessage) {
        message = genericMessage;
      } else {
        message = specificMessage;
      }
    }

    await sendMail(user, "Profile Updated", message);
    return updatedUser;
  }
}

export class InternService extends UserService<InternInterface> {
  constructor(model: Model<InternInterface>) {
    super(model);
  }
}

export class MentorService extends UserService<IMentor> {
  constructor(model: Model<IMentor>) {
    super(model);
  }

  async deleteMentor(_id: string) {
    const mentor = await this.findOne({ _id })

    if(!mentor) throw new NotFoundException('Mentor not found')

    const deletedMentor = await this.deleteOne({ _id })
    if(!deletedMentor) throw new InternalException('There was an error deleting mentor')

    await mentorshipGroupService.deleteOne({ mentor: mentor._id })

    return deletedMentor
  }

  async disableMentor(_id: string) {
    const mentor = await this.findOne({ _id })

    if(!mentor) throw new NotFoundException('Mentor not found')

    const disabledMentor = await this.disableOne({ _id })

    if(!disabledMentor) throw new InternalException('There was an error disabling mentor')

    await mentorshipGroupService.disableOne({ mentor: mentor._id })

    return disabledMentor
  }
}

export class CoordinatorService extends UserService<IUser> {
  constructor(model: Model<IUser>) {
    super(model);
  }
}

export const internService = new InternService(Intern);
export const mentorService = new MentorService(Mentor);
export const coordinatorService = new CoordinatorService(Coordinator);
export const userService = new UserService(
  User,
  internService,
  mentorService,
  coordinatorService
);

export default UserService;
