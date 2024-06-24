import { Request, Response } from "express";
import { userService } from "../../services";
import { IGenericObject, IUpload, IUser } from "../../interfaces";
import { sendResponse, sendMail, hash, verifyHash } from "../../utils";
class ProfileController {
  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = req.user as unknown as IUser;
    const data = await userService.editUser(id, req.body, user);
    return sendResponse(
      res,
      200,
      true,
      "Your profile has been succesfully updated",
      data
    );
  }

  async uploadAvatar(req: Request, res: Response) {
    const { uploads } = req.body;
    const existingUser: IUser | null = await userService.findOne({
      _id: req.params.id,
    });
    if (!existingUser)
      return sendResponse(res, 404, false, "User does not exist");

    if (req.user._id.toString() !== existingUser._id.toString())
      return sendResponse(
        res,
        403,
        false,
        "You are not authorised to change this avatar"
      );

    const updatedUser = await userService.updateOne(
      { _id: req.params.id },
      { avatar: uploads[0].secure_url }
    );
    if (!updatedUser)
      return sendResponse(res, 401, false, "Your avatar was not updated");

    const data: IGenericObject = updatedUser.toObject();
    delete data.password;

    return sendResponse(
      res,
      200,
      true,
      `Avatar updated successfully`,
      updatedUser
    );
  }

  async disableUser(req: Request, res: Response) {
    const { _id, role } = req.user
    const existingUser = await userService.findOne({ _id: req.params.id });

    if (!existingUser)
      return sendResponse(res, 404, false, `This user does not exist`);

    if (
      _id.toString() !== existingUser._id.toString() &&
      role !== "coordinator"
    )
      return sendResponse(
        res,
        403,
        false,
        `You do not have permission to delete this user`
      );

    if (role === "coordinator" && existingUser.role === "coordinator")
      return sendResponse(
        res,
        403,
        false,
        `You do not have permission to delete this user`
      );

    const disabledUser = await userService.disableOne({
      _id: existingUser._id,
    });
    if (!disabledUser)
      return sendResponse(res, 401, false, "There was an error disabling user");

    const data: IGenericObject = disabledUser.toObject();
    delete data.password;

    let message = `Your account was disabled. Please let us know if this was a mistake`;
    const user = req.user as unknown as IUser;
    await sendMail(user, "Profile Deactivated", message);

    return sendResponse(res, 200, true, `User deleted successfully!`, data);
  }

  async getUser(req: Request, res: Response) {
    const existingUser = await userService.findOne({ _id: req.params.id });

    if (!existingUser)
      return sendResponse(res, 404, false, `This user does not exist`);

    return sendResponse(
      res,
      200,
      true,
      `User fetched successfully!`,
      existingUser
    );
  }

  // Getting all users
  async getUsers(req: Request, res: Response) {
    const { id, fullName, deleted } = req.query;

    if (id) {
      delete req.query.id;
      req.query._id = id;
    }
    if (fullName)
      req.query.fullName = {
        $regex: (fullName as string).toLowerCase().trim(),
        $options: "i",
      };
    if (typeof deleted === "boolean") req.query.deleted = deleted;

    const {
      data: users,
      currentPage,
      totalPages,
    } = await userService.findAll(req.query);
    if (!users)
      return sendResponse(
        res,
        404,
        false,
        "There was a problem fetching users."
      );
    if (users.length === 0)
      return sendResponse(
        res,
        200,
        true,
        "There are no users matching your search",
        []
      );

    return sendResponse(res, 200, true, "Users successfully fetched", {
      users,
      currentPage,
      totalPages,
    });
  }
}

export default new ProfileController();
