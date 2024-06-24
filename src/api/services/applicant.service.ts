import { Model } from "mongoose";
import GenericService from "./generic.service";
import { IApplicant } from '../interfaces';
import { Applicant } from '../models'
export class ApplicantService extends GenericService<IApplicant> {
    constructor(model: Model<IApplicant>){
        super(model)
    }
}

export default new ApplicantService(Applicant)