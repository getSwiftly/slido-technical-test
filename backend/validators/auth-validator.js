const Joi = require("joi");

class AuthValidator {
  loginPlatformAdmin() {
    return Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
  }

  loginAdmin() {
    return Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
  }

  registerUser() {
    return Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().allow(null, ''),
      country: Joi.string().allow(null, ''),
      password: Joi.string().required(),
    });
  }

  registerForStripe() {
    return Joi.object({
      email: Joi.string().required(),
      mode: Joi.string().required(),
      dataId: Joi.string().required()
    });
  }

  verifyUserOTP() {
    return Joi.object({
      phone: Joi.string().required(),
      code: Joi.string().required(),
    });
  }

  sendOTPAgain() {
    return Joi.object({
      phone: Joi.string().required()
    });
  }

  loginUser() {
    return Joi.object({
      phone: Joi.string(),
      email: Joi.string(),
      password: Joi.string(),
      otp: Joi.string()
    });
  }

  socialLogin() {
    return Joi.object({
      firebaseToken: Joi.string()
    });
  }

  forgotPassword() {
    return Joi.object({
      email: Joi.string().required()
    });
  }

  updatePassword() {
    return Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required()
    });
  }

  registerOrganization() {
    return Joi.object({
      //ORGANIZATION ADMIN DETAILS
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      password: Joi.string().required(),
      country: Joi.string(),
      //ORGANIZATION DETAILS
      organizationName: Joi.string(),
      organizationAddress: Joi.string(),
      organizationCity: Joi.string(),
      organizationCountry: Joi.string(),
      organizationWebsite: Joi.string(),
      type: Joi.string(),
      linkedIn: Joi.string(),
      organizationSize: Joi.string(),
    });
  }

  verifyOrganization() {
    return Joi.object({
      email: Joi.string().required(),
      emailVerificationCode: Joi.string().required(),
      phone: Joi.string().required(),
      phoneVerificationCode: Joi.string().required(),
    });
  }

  sendOrgOTP() {
    return Joi.object({
      phone: Joi.string().required(),
      email: Joi.string().required()
    });
  }

  // verifyEmail() {
  //   return Joi.object({
  //     id: Joi.string().required()
  //   });
  // }

  // forgotPassword() {
  //   return Joi.object({
  //     email: Joi.string().required()
  //   });
  // }

  // resetPassword() {
  //   return Joi.object({
  //     token: Joi.string().required(),
  //     password: Joi.string().required(),
  //     confirmPassword: Joi.string().required(),
  //   });
  // }
}

module.exports = new AuthValidator();
