import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../api/utils";

// app messages
export const MESSAGES = {
    SIGNUP_SUCCESSFUL: 'You have succesfully signed up',
    SIGNUP_SUCCESS_MAIL: `Welcome to LearnWave. Please verify your email to continue`,
    SIGNUP_FAILED: 'Sign up failed',
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'User already exists',
    EMAIL_NOT_AVAILABLE: `Email is not available, please try again with a different email.`,
    APPLICANT_NOT_FOUND: `Applicant with this email not found`,
    REGISTRATION_CLOSED: `You cannot sign up because registration has closed for the year.`,
    INVALID_CREDENTIALS: 'Invalid username or password',
    INVALID_OTP: 'Invalid OTP!',
    INVALID_TOKEN: 'Invalid token!',
    EXPIRED_TOKEN: 'Token has expired, please request another verification!',
    LOGIN_SUCCESSFUL: 'You have succesfully logged in',
    LOGIN_SUCCESS_MAIL: `You successfully logged into your LearnWave account. Please reset your password if this wasn't you`,
    LOGIN_FAILED: 'Login failed',
    LOGOUT_SUCCESSFUL: 'You have successfully logged out',
    LOGOUT_SUCCESS_MAIL: `You successfully logged out of your LearnWave account. Please reset your password if this wasn't you`,
    LOGOUT_FAILED: 'Logout failed',
    PASSWORD_RESET_SUCCESSFUL: 'Password reset successful',
    PASSWORD_RESET_SUCCESS_MAIL: `Your password was reset successfully!`,
    PASSWORD_RESET_FAILED: 'Password reset failed',
    PASSWORD_RESET_URL_SENT: 'Password reset link sent',
    PASSWORD_CHANGE_SUCCESSFUL: 'Password change successful',
    PASSWORD_CHANGE_SUCCESS_MAIL: '',
    PASSWORD_CHANGE_FAILED: 'Password change failed',
    EMAIL_VERIFICATION_REQUEST_SUCCESSFUL: 'Email verification request successful',
    EMAIL_VERIFICATION_SUCCESSFUL: 'Email verification successful',
    EMAIL_VERIFICATION_SUCCESS_MAIL: `Your email has been verified. Happy Learning!`,
    EMAIL_VERIFICATION_FAILED: 'Email verification failed',
    USER_DELETE_SUCCESSFUL: 'User deleted successfully',
    USER_UPDATE_SUCCESSFUL: 'User updated successfully',
    PAGE_NOT_FOUND: `The route you're looking for does not exist`,
}

// environmental variables
export const apiVersion = process.env.API_VERSION;
export const mongoUri = <string>process.env.MONGODB_URI
export const dbName = <string>process.env.DB_NAME
export const JWT_EXPIRES_IN = <string>process.env.JWT_EXPIRES_IN
export const JWT_EMAIL_VERIFICATION_EXPIRES_IN = <string>process.env.JWT_EMAIL_VERIFICATION_EXPIRES_IN
export const port = parseFloat(<string>process.env.PORT) || 8080
export const baseUrl = <string>process.env.SERVER_BASE_URL
export const pingTime = parseFloat(<string>process.env.TIME_TO_PING)

// middleware configurations
export const morganConfig = `:date[iso] :method :url :status :response-time ms :remote-addr :http-version :referrer :user-agent`;
export const corsConfig = {
        origin: '*',
        exposedHeaders: ['Authorization', 'Access-Token']
};