import { internService, mentorService, coordinatorService, userService } from "./user.service"
import GenericService from "./generic.service";
import applicantService from "./applicant.service";
import { mentorshipGroupService } from "./groups";
import {
  NotFoundException,
  ForbiddenException,
  UnAuthorizedException,
} from "./error.service";

import {
  IUser,
  InternInterface,
  IMentor,
  IApplicant,
  ICreateUser,
  IMentorGroup,
  IGenericObject
} from "../interfaces";

import { hash, sendMail, tokenHandler, verifyHash, logger } from "../utils";
import { MESSAGES, JWT_EXPIRES_IN, JWT_EMAIL_VERIFICATION_EXPIRES_IN } from "../../configs";
import { JwtPayload } from "jsonwebtoken";

class AuthService {
  private internService: GenericService<InternInterface>;
  private mentorService: GenericService<IMentor>;
  private coordinatorService: GenericService<IUser>;
  private userService: GenericService<IUser>;
  private mentorshipGroupService: GenericService<IMentorGroup>;
  
  constructor(
    internService: GenericService<InternInterface>,
    mentorService: GenericService<IMentor>,
    coordinatorService: GenericService<IUser>,
    userService: GenericService<IUser>,
    mentorshipGroupService: GenericService<IMentorGroup>
  ) {
    this.internService = internService;
    this.mentorService = mentorService;
    this.coordinatorService = coordinatorService;
    this.userService = userService;
    this.mentorshipGroupService = mentorshipGroupService;
  }

  async register(payload: ICreateUser, routes: string[]) {
    const { email, fullName, password } = payload;

    if (routes.includes("coordinators")) {
      payload.role = "coordinator";
    } else {
      const existingSuccessfulApplicant = (await applicantService.findOne({
        email,
      })) as IApplicant | null;

      if (!existingSuccessfulApplicant)
        throw new NotFoundException("Applicant Not Found");

      const now = new Date().getFullYear();
      if (existingSuccessfulApplicant.year !== now)
        throw new ForbiddenException("Registration closed");

      payload = { ...payload, ...existingSuccessfulApplicant.toObject() };
    }

    const existingUser = (await this.userService.findOne({ email })) as IUser | null;

    if (existingUser) throw new ForbiddenException("Email not available.");

    payload.password = await hash(password);
    payload.avatar = `https://api.dicebear.com/6.x/initials/svg?seed=${fullName}`;

    if (payload.role === "coordinator") {
      await this.coordinatorService?.create(payload);
    } else if (payload.role === "mentor") {
      // const group_info = await this.groupInfoService.create({});
      // payload.group_info = group_info;
      await this.mentorService.create(payload);
    } else if (payload.role === "intern") {
      await this.internService.create(payload);
    }

    const { user, accessToken } = await this.login(email, password, false);

    const isSent = await sendMail(
      user,
      "Account Created",
      MESSAGES.SIGNUP_SUCCESS_MAIL
    );
    logger.info(`Email sucessfully sent to: ${user.email}`);
    console.log("Signup success mail details:", isSent);

    let message = `Registered User: [Full Name: ${user.fullName}, Display Name: ${user.displayName}]`;
    logger.info(message);

    return { user, accessToken };
  }

  async login(email: string, password: string, sendEmail = true) {
    const existingUser = (await this.userService.findOne({ email })) as IUser | null;

    if (!existingUser) throw new NotFoundException("User Not Found");
    console.log(234, email, password, existingUser);

    const isValidPassword = await verifyHash(password, existingUser.password);
    if (!isValidPassword)
      throw new UnAuthorizedException("Invalid email or password");

    const user: any = { ...existingUser.toObject() };
    delete user.password;

    const accessToken = await tokenHandler.generate(
      { _id: user._id },
      JWT_EXPIRES_IN
    );

    if (sendEmail) {
      const isSent = await sendMail(
        existingUser,
        "Account Login",
        MESSAGES.LOGIN_SUCCESS_MAIL
      );
      logger.info(`Email sucessfully sent to: ${existingUser.email}`);
      console.log("Login success mail details:", isSent);
    }

    let message = `Logged In User: [Full Name: ${user.fullName}, Display Name: ${user.displayName}]`;
    logger.info(message);

    return { user, accessToken };
  }

  async requestPasswordReset(email: string) {
    const existingUser = await this.userService.findOne({ email });

    if(!existingUser) throw new NotFoundException(MESSAGES.USER_NOT_FOUND)
    
    const token = await tokenHandler.generate({ _id: existingUser._id, email: existingUser.email }, <string>process.env.JWT_PASSWORD_RESET_EXPIRES_IN)
    const encodedToken = encodeURIComponent(token)

    const passwordResetLink = `${process.env.PASSWORD_RESET_URL}?token=${encodedToken}`
    let message = `Use this link ${passwordResetLink} to reset your account Password. This link expires in 10 minutes!`;

    const isSent = await sendMail(existingUser, 'Password Reset Request', message)
    console.log("Password reset request mail details:", isSent);

    return
}

  async resetPassword(payload: any, token: string) {
    const decoded = await tokenHandler.verify(token);
    if (decoded === 'expired') throw new ForbiddenException('Password reset link expired. Try requesting a new reset link.')
    if (decoded === 'invalid') throw new UnAuthorizedException('Invalid password reset link. Please check the url and try again.')

    const existingUser = await this.userService.findOne({ _id: (decoded as JwtPayload)._id, email: (decoded as JwtPayload).email });
    if (!existingUser) throw new NotFoundException(MESSAGES.USER_NOT_FOUND); 

    payload.password = await hash(<string>payload.password);

    if(!existingUser.isVerified) payload.isVerified = true
    const updatedUser = await this.userService.updateOne({ _id: existingUser._id }, payload);

    if (!updatedUser) throw new Error('Error')

    const isSent = await sendMail(existingUser, 'Password Reset Successful', MESSAGES.PASSWORD_RESET_SUCCESS_MAIL)
    console.log("Password reset mail details:", isSent);

    return
}

async requestEmailVerification(email: string) {
  const existingUser = await userService.findOne({ email });
  if (!existingUser) throw new NotFoundException(MESSAGES.USER_NOT_FOUND)
    
  const data: IGenericObject = existingUser.toObject();
  delete data.password;

  const verificationToken = await tokenHandler.generate( data, JWT_EMAIL_VERIFICATION_EXPIRES_IN);
  const verificationLink = `${process.env.SERVER_URL}/auth/verify-email/${verificationToken}`;
  const resetMessage = `Click on the following link to verify your email: ${verificationLink}`

  const isSent = await sendMail(existingUser, "Email Verification", resetMessage);
  logger.info(`Email sucessfully sent to: ${existingUser.email}`);
  console.log("Email verification request mail details:", isSent);

  return
}

async verifyEmail(token: string) {
  const decoded = await tokenHandler.verify(token);
  if (decoded === 'expired') throw new UnAuthorizedException('Account verification link expired. Try requesting a new verification link.') 
  if (decoded === 'invalid') throw new UnAuthorizedException('Invalid account verification link. Please check the url and try again.')

  const existingUser = await this.userService.findOne({ email: (decoded as JwtPayload).email }) as IUser | null
  if (!existingUser) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);

  if (existingUser.isVerified) throw new ForbiddenException('Your email has already been verified');

  await userService.updateOne({ _id: existingUser._id }, { isVerified: true });

  const isSent = await sendMail(existingUser, "Email Verification", MESSAGES.EMAIL_VERIFICATION_SUCCESS_MAIL);
  logger.info(`Email sucessfully sent to: ${existingUser.email}`);
  console.log("Email verification success mail details:", isSent);

  return
}
}

export default new AuthService(
  internService,
  mentorService,
  coordinatorService,
  userService,
  mentorshipGroupService
);