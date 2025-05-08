const { Router } = require("express");
const router = Router();
const { handleRouteError } = require("../../../utils/common-utils");
// const { AuthValidator } = require("../../../validators");
const { authenticate } = require("../../middlewares/auth");
const AuthService = require("../../../services/v1/auth-service");

const jwt = require("jsonwebtoken");

router.post("/anon", async (req, resp) => {
  try {
    const result = await AuthService.generateAnonymousToken();
    resp.status(result.status).send(result);
  } catch (error) {
    handleRouteError(resp)({
      status: 403,
      message: __("mandatory.fields"),
      error,
    }); 
  }
});

module.exports = router;