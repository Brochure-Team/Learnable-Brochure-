import { Model } from 'mongoose';
import { Announcement } from '../models'
import GenericService from "./generic.service";
import { IAnnouncement } from "../interfaces";
export class AnnouncementService extends GenericService<IAnnouncement> {
    constructor(model: Model<IAnnouncement>){
        super(model)
    }
}

export default new AnnouncementService(Announcement)