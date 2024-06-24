import { Router } from 'express';
import { leaderBoardController } from '../controllers'
import { validate, authenticate, allowCoordinator }from '../middlewares'
import { } from '../validations'

const leaderBoardRouter = Router()

leaderBoardRouter.patch('/update', [authenticate, allowCoordinator], leaderBoardController.updateLeaderBoard)

leaderBoardRouter.get('/', [authenticate], leaderBoardController.getLeaderBoardEntries)

export default leaderBoardRouter