import joi from 'joi'
import { validateObjectId } from '../utils'

export const CreateTaskSubmissionSchema = {
  body: joi.object({
    answers: joi.array().items(
      joi.object({
        question_id: joi.number().required(),
        submission_link: joi.string().required()
      }).exist()
    ).required(),
    tracks: joi.array().items(
      joi.string().valid('frontend', 'backend', 'web3', 'product design').required()
    ).optional(),
    type: joi.string().valid('individual', 'group').optional()
  }),
  params: joi.object({
    task_id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
}

export const EditATaskSubmissionSchema = {
  body: joi.object({
    answers: joi.array().items(
      joi.object({
        question_id: joi.number().required(),
        submission_link: joi.string().required()
      }).exist()
    ).optional(),
    tracks: joi.array().items(
      joi.string().valid('frontend', 'backend', 'web3', 'product design').required()
    ).optional(),
    type: joi.string().valid('individual', 'group').optional()
  }),
  params: joi.object({
    task_id: joi.string().custom(validateObjectId, 'object id validation').required(),
    id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
}

export const GradeTaskSubmissionSchema = {
  body: joi.object({
    answers: joi.array().items(
      joi.object({
        question_id: joi.number().required(),
        // submission_link: joi.string().required(),
        feedback: joi.string().required(),
        grade: joi.number().required()
      }).required()
    ).required()
  }).required(),
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').required(),
    task_id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
};

export const RemarkTaskSubmissionSchema = {
  body: joi.object({
    answers: joi.array().items(
      joi.object({
        question_id: joi.number().required(),
        // submission_link: joi.string().required(),
        feedback: joi.string().required(),
        grade: joi.number().required()
      }).required()
    ).required()
  }).required(),
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').required(),
    task_id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
};

export const DisableOneTaskSubmissionSchema = {
  body: joi.object({
    deleted: joi.boolean().required()
  }),
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').required(),
    task_id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
}

export const DeleteOneTaskSubmissionSchema = {
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').required(),
    task_id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
}

export const ViewOneTaskSubmissionSchema = {
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').required(),
    task_id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
}

export const ViewAnInternsTaskSubmissionSchema = {
  params: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').required()
  })
}

export const ViewAllTaskSubmissionsSchema = {
  query: joi.object({
    task: joi.string().custom(validateObjectId, 'object id validation').optional(),
    id: joi.string().custom(validateObjectId, 'object id validation').optional(),
    _id: joi.string().custom(validateObjectId, 'object id validation').optional(),
    intern: joi.string().custom(validateObjectId, 'object id validation').optional(),
    track: joi.string().optional(),
    type: joi.string().optional(),
    grade: joi.number().optional(),
    deadline: joi.string().optional(),
    page: joi.number().optional(),
    limit: joi.number().optional()
  })
}

export const ViewAllTaskSubmissionsForATaskSchema = {
  params: joi.object({
    task_id: joi.string().custom(validateObjectId, 'object id validation').required()
  }),
  query: joi.object({
    id: joi.string().custom(validateObjectId, 'object id validation').optional(),
    _id: joi.string().custom(validateObjectId, 'object id validation').optional(),
    intern: joi.string().custom(validateObjectId, 'object id validation').optional(),
    track: joi.string().optional(),
    type: joi.string().optional(),
    grade: joi.number().optional(),
    deadline: joi.string().optional(),
    page: joi.number().optional(),
    limit: joi.number().optional()
  })
}