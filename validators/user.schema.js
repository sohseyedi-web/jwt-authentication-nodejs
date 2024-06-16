const createHttpError = require("http-errors");
const Joi = require("joi");

const signupSchema = Joi.object({
  username: Joi.string()
    .min(5)
    .max(100)
    .error(createHttpError.BadRequest("Username entered is not correct.")),
  password: Joi.string()
    .min(5)
    .max(100)
    .error(createHttpError.BadRequest("Password entered is not correct.")),
  email: Joi.string()
    .email()
    .error(createHttpError.BadRequest("Email entered is not correct.")),
  role: Joi.string()
    .required()
    .valid("DOCTOR", "USER")
    .error(createHttpError.BadRequest("Role selection is required")),
});
const signinSchema = Joi.object({
  password: Joi.string()
    .min(5)
    .max(100)
    .error(createHttpError.BadRequest("Password entered is not correct.")),
  email: Joi.string()
    .email()
    .error(createHttpError.BadRequest("Email entered is not correct.")),
});

module.exports = {
  signinSchema,
  signupSchema,
};
