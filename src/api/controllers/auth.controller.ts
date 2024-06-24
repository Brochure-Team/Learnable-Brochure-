import { Request, Response } from "express";
import { sendResponse, getRoute } from "../utils";
import { authService } from "../services";
import { MESSAGES } from "../../configs";
class AuthenticationController {
  async signup(req: Request, res: Response) {
    const route = getRoute(req.originalUrl);
    const { user, accessToken } = await authService.register(req.body, route);

    res.cookie("token", accessToken, { httpOnly: true, maxAge: 60000 });
    return sendResponse(res, 201, true, MESSAGES.SIGNUP_SUCCESSFUL, {
      user,
      accessToken,
    });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { user, accessToken } = await authService.login(
      email,
      password,
      true
    );

    res.cookie("token", accessToken, { httpOnly: true, maxAge: 60000 });
    return sendResponse(res, 200, true, MESSAGES.LOGIN_SUCCESSFUL, {
      user,
      accessToken,
    });
  }

  async requestPasswordReset(req: Request, res: Response) {
    const { email } = req.body;
    await authService.requestPasswordReset(email);

    return sendResponse(res, 200, true, MESSAGES.PASSWORD_RESET_URL_SENT);
  }

  async resetPassword(req: Request, res: Response) {
    const { token } = req.params;

    await authService.resetPassword(req.body, token);

    return sendResponse(res, 200, true, MESSAGES.PASSWORD_RESET_SUCCESSFUL);
  }

  async requestEmailVerification(req: Request, res: Response) {
    const email = req.user.email || req.body.email;

    await authService.requestEmailVerification(email)
    return sendResponse(res, 200, true, MESSAGES.EMAIL_VERIFICATION_REQUEST_SUCCESSFUL);
  }

  async verifyEmail(req: Request, res: Response) {
    const { token } = req.params
    await authService.verifyEmail(token)

    return res.redirect(301, <string>process.env.APP_URL)
  }
}

export default new AuthenticationController();
