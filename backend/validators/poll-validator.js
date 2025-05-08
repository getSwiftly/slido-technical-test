const Joi = require("joi");

class PollValidator {
  createPoll() {
    return Joi.object({
      question: Joi.string().required(),
      options: Joi.array().items(Joi.string()).min(2).required(),
      expiresAt: Joi.date().iso().required()
    });
  }

  voteOnPoll() {
    return Joi.object({
      optionId: Joi.number().integer().positive().required()
        .messages({
          'number.base': 'Option ID must be a number',
          'number.integer': 'Option ID must be an integer',
          'number.positive': 'Option ID must be positive',
          'any.required': 'Option ID is required'
        })
    });
  }
}

module.exports = new PollValidator(); 