import { Model } from 'mongoose';
import { ILeaderBoard } from '../interfaces';
import { LeaderBoard} from '../models';
import GenericService from "./generic.service";
export class LeaderBoardService extends GenericService<ILeaderBoard> {
    constructor(model: Model<ILeaderBoard>){
        super(model)
    }
}

export default new LeaderBoardService(LeaderBoard)