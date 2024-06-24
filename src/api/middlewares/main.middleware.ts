import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import asyncError from './errors.middleware';
import indexRoute from '../routes/main.route';

// import '../services/zoom_meeting.service';
// import { corsConfig, morganConfig } from '../../configs';

export default (app: Application) => {
  app.use(morgan('combined'));
  app.use(cors());
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  indexRoute(app);
  app.use(asyncError);
};