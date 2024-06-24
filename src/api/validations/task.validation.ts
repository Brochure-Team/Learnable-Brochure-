import joi from 'joi'
import { validateObjectId } from '../utils'

export const CreateTaskSchema = {
  body: joi.object({
    questions: joi.array().items(
      joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        resources: joi.array().items({
          label: joi.string().required(),
          link: joi.string().required()
        }).required(),
        submit_on: joi.array().items(
          joi.string().required()
        ).required()
      }).exist()
    ).required(),
    tracks: joi.array().items(
      joi.string().valid('frontend', 'backend', 'web3', 'product design').required()).required(),
    type: joi.string().valid('individual', 'group').optional(),
  })
}

export const EditTaskSchema = {
  body: joi.object({
    questions: joi.array().items(
      joi.object({
        id: joi.number().required(),
        title: joi.string().required(),
        description: joi.string().required(),
        resources: joi.array().items({
          label: joi.string().required(),
          link: joi.string().required()
        }).required(),
        submit_on: joi.array().items(
          joi.string().required()
        ).required()
      }).exist()
    ).optional(),
    tracks: joi.array().items(
      joi.string().valid('frontend', 'backend', 'web3', 'product design').required()).optional(),
    type: joi.string().valid('individual', 'group').optional(),
  }),
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
}

export const ApproveTaskSchema = {
  body: joi.object({
    deadline: joi.string().required()
  }),
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
};

export const ExtendTaskDeadlineSchema = {
  body: joi.object({
    deadline: joi.string().required()
  }),
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
};

export const RemoveTaskSchema = {
  body: joi.object({
  }),
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
}

export const DeleteTaskSchema = {
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
}

export const ViewTaskSchema = {
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
}

export const ViewAllTasksSchema = {
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').optional(),
    _id: joi.string().custom(validateObjectId, 'object id validation').optional(),
    facilitator_id: joi.string().custom(validateObjectId, 'object id validation').optional(),
    title: joi.string().optional(),
    track: joi.string().optional(),
    type: joi.string().optional(),
    approved: joi.boolean().optional(),
    score: joi.number().optional(),
    deadline: joi.string().optional(),
    page: joi.number().optional(),
    limit: joi.number().optional()
  })
}

export const EnableOrDisableTaskSchema = {
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').optional()
  })
}