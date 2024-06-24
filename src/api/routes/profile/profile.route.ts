import { Router } from "express";
import {
  profileController,
  taskSubmissionController,
  internController,
  mentorController,
  coordinatorController,
} from "../../controllers";
import { UpdateUserProfileSchema } from "../../validations";
import { validate, authenticate, uploadFiles, allowCoordinator } from "../../middlewares";
import { ViewAnInternsTaskSubmissionSchema } from "../../validations";

const userRouter = Router();

// Querying all users with different options irrespective of type
userRouter.get("/", [authenticate], profileController.getUsers);

// Querying just mentors
userRouter.get("/mentors", [authenticate], mentorController.getMentors);
userRouter.get("/mentors/:id", [authenticate], mentorController.getMentor);
userRouter.patch("/mentors/:id", [authenticate, allowCoordinator], mentorController.disable);
userRouter.delete("/mentors/:id", [authenticate, allowCoordinator], mentorController.delete);

// Querying just interns
userRouter.get("/interns", [authenticate], internController.getInterns);
userRouter.get("/interns/:id", [authenticate], internController.getIntern);

// Getting all an intern's submissions
userRouter.get(
  "/interns/:id/task_submissions",
  [authenticate, validate(ViewAnInternsTaskSubmissionSchema)],
  taskSubmissionController.getSubmissionsForAnIntern
);

// Querying just coordinators
userRouter.get(
  "/coordinators",
  [authenticate],
  coordinatorController.getCoordinators
);
userRouter.get(
  "/coordinators/:id",
  [authenticate],
  coordinatorController.getCoordinator
);

// Changing avatar for all users
userRouter.patch(
  "/profile/:id/avatar",
  [authenticate, uploadFiles(1, ["jpeg", "jpg", "png", "gif"])],
  profileController.uploadAvatar
);

// Fetching a user of any type
userRouter.get("/profile/:id", [authenticate], profileController.getUser);

// Updating a user of any type
userRouter.patch(
  "/profile/:id",
  [authenticate, validate(UpdateUserProfileSchema)],
  profileController.updateUser
);

// Disabling a user of any type
userRouter.delete(
  "/profile/:id",
  [authenticate],
  profileController.disableUser
);

export default userRouter;
