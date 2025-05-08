const _ = require("lodash");

class AdminService {
  async getAllAdmins() {
    try {
      
      return {
        status: 200,
        message: __("admins.found"),
      };
    } catch (error) {
      return Promise.reject({
        status: 500,
        messageCode: "server.error",
        error,
      });
    }
  }
}

module.exports = new AdminService();