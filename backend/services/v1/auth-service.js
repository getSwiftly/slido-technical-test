const uuid = require("uuid");
const _ = require("lodash");
const JWTService = require('../jwt.service');
const saltRounds = 10;
var fs = require('fs');
const path = require('path');
const moment = require('moment');

class AuthService {
  async generateAnonymousToken() {
    try {
      const token = await JWTService.returnJWT({
        authorities: ["ANONYMOUS"],
        userId: uuid.v4(),
        type: "anonymous",
      }, "10m"); // Token valid for 10 minutes

      return {
        status: 200,
        message: "Anonymous token generated successfully",
        data: {
          token
        }
      };
    } catch (error) {
      throw {
        status: 500,
        message: "Error generating anonymous token",
        error
      };
    }
  }
}

module.exports = new AuthService();
