import { Request, Response } from "express";
import { applicantService } from "../services";
import { sendResponse } from "../utils";
import { IGenericObject, IApplicant } from "../interfaces";

class ApplicantController {
    async createApplicant(req: Request, res: Response) {
        const existingSuccessfulApplicant = await applicantService.findOne({email: req.body.email})
        if(existingSuccessfulApplicant) return sendResponse(res, 403, false, 'Applicant already exists')

        const newApplicant = await applicantService.create(req.body)

        return sendResponse(res, 201, true, 'Applicant successfully added to the database', newApplicant)
    }

    async getApplicant(req: Request, res: Response) {
        const existingSuccessfulApplicant = await applicantService.findOne({_id: req.params.id, deleted: false})
        if(!existingSuccessfulApplicant) return sendResponse(res, 404, false, 'Applicant does not exist')

        return sendResponse(res, 200, true, 'Applicant successfully fetched', existingSuccessfulApplicant)
    }

    async getAllApplicants(req: Request, res: Response) {
        const query: IGenericObject = {}

        if(req.query.year) query.year = parseFloat(<string>req.query.year)
        if(req.query.id) query._id = req.query.id
        if(req.query._id) query._id = req.query._id
        if(req.query.email) query.email = req.query.email
        if(req.query.role) query.role = req.query.role
        if(req.query.track) query.track = req.query.track
        if(typeof req.query.deleted === 'boolean' ) query.deleted = req.query.deleted
        
        const result = await applicantService.findAll(query)
        if(!result.data) return sendResponse(res, 404, false, 'There are no applicants matching your search')

        const existingSuccessfulApplicants = result.data

        return sendResponse(res, 200, true, 'Applicants successfully fetched', existingSuccessfulApplicants, { currentPage: result.currentPage, totalPages: result.totalPages })
    }

    async disableApplicant(req: Request, res: Response) {
        const existingSuccessfulApplicant = await applicantService.findOne({ _id: req.params.id })
        if(!existingSuccessfulApplicant) return sendResponse(res, 404, false, 'Applicant does not exist')

        const disabledApplicant: IApplicant | null = await applicantService.updateOne({ _id: req.params.id }, {deleted: true})

        return sendResponse(res, 200, true, 'Applicant successfully disabled', disabledApplicant as IApplicant)
    }

    async enableApplicant(req: Request, res: Response) {
        const existingSuccessfulApplicant = await applicantService.findOne({_id: req.params.id})
        if(!existingSuccessfulApplicant) return sendResponse(res, 404, false, 'Applicant does not exist')

        const enabledApplicant: IApplicant | null = await applicantService.updateOne({ _id: req.params.id }, {deleted: false})

        return sendResponse(res, 200, true, 'Applicant successfully enabled', enabledApplicant as IApplicant)
    }

    async disableAllApplicants(req: Request, res: Response) {
        const year = parseFloat(<string>req.params.year)
        
        const allDisabledApplicants = await applicantService.disableMany({year})
        
        return sendResponse(res, 200, true, `All applicants from ${year} cohort successfully disabled`, allDisabledApplicants)
   }
}

export default new ApplicantController()