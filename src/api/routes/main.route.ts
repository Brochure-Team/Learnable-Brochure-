import { Application } from 'express';
import { apiVersion } from '../../configs'
import { serverController } from '../controllers';
import { authRouter, coordinatorRouter, applicantRouter, userRouter, uploadRouter, announcementRouter, generalTaskRouter, pingRouter, extraRouter, leaderBoardRouter, groupRouter, mentorsRouter, meetingRouter, meetingAttendanceRouter, zoomWebhookRouter } from '.';

export default (app: Application) => {
  app.use(`${apiVersion}/health`, serverController.checkHealth);
  app.use(`${apiVersion}/auth`, authRouter);
  app.use(`${apiVersion}/users`, userRouter);
  app.use(`${apiVersion}/applicants`, applicantRouter);
  app.use(`${apiVersion}/coordinators`, coordinatorRouter);
  app.use(`${apiVersion}/files`, uploadRouter);
  app.use(`${apiVersion}/announcements`, announcementRouter);
  app.use(`${apiVersion}/tasks`, generalTaskRouter);
  app.use(`${apiVersion}/groups`, groupRouter);
  app.use(`${apiVersion}/mentors`, mentorsRouter);
  app.use(`${apiVersion}/meetings`, meetingRouter);
  app.use(`${apiVersion}/webhook`, zoomWebhookRouter);
  app.use(`${apiVersion}/meeting_attendances`, meetingAttendanceRouter);
  app.use(`${apiVersion}/leaderboard`, leaderBoardRouter);
  app.use(`${apiVersion}/ping`, pingRouter);
  app.use(`${apiVersion}/check_time`, extraRouter);
  app.use(`${apiVersion}/`, serverController.redirectToHome);
  app.use(`/`, serverController.sayWelcome);
  app.use(serverController.resourceNotFound);
};