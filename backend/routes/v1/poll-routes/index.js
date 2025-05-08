const { Router } = require("express");
const router = Router();
const { handleRouteError } = require("../../../utils/common-utils");
const PollService = require("../../../services/v1/poll-service");
const { authenticate } = require("../../middlewares/auth");
const PollValidator = require("../../../validators/poll-validator");

//authenticate("ANONYMOUS"), 

router.post("/", async (req, resp) => {
  try {
    const result = await PollService.createPoll(req.body);
    resp.status(result.status).send(result);
  } catch (error) {
    handleRouteError(resp)({
      status: 500,
      message: error.message || "Error creating poll",
      error,
    });
  }
});

router.get("/:pollId", async (req, resp) => {
  try {
    const result = await PollService.getPollById(req.params.pollId);
    resp.status(result.status).send(result);
  } catch (error) {
    handleRouteError(resp)({
      status: error.status || 500,
      message: error.message || "Error retrieving poll",
      error,
    });
  }
});

router.post("/:pollId/vote", authenticate("ANONYMOUS"), async (req, resp) => {
  try {
    // Validate request body
    await PollValidator.voteOnPoll().validateAsync(req.body);

    const { optionId } = req.body;
    const userId = req.jwt.userId; // Get userId from JWT token

    const result = await PollService.voteOnPoll(req.params.pollId, optionId, userId);
    resp.status(result.status).send(result);
  } catch (error) {
    // Handle validation errors
    if (error.isJoi) {
      return handleRouteError(resp)({
        status: 400,
        message: error.details[0].message,
        error
      });
    }

    handleRouteError(resp)({
      status: error.status || 500,
      message: error.message || "Error recording vote",
      error,
    });
  }
});

module.exports = router; 