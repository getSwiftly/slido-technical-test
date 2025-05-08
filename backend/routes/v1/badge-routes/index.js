const { Router } = require("express");
const router = Router();
const { handleRouteError } = require("../../../utils/common-utils");
const { BadgeService } = require("../../../services/v1");
const { BadgeValidator } = require("../../../validators");
const { authenticate } = require("../../middlewares/auth");

const Multer = require("multer");

//authenticate("PLATFORM_ADMIN"),
router.post("/create", Multer({storage: Multer.memoryStorage()}).single("badgeImage"), async (req, resp) => {
  try {
    await BadgeValidator.create().validateAsync(req.body);

    let file = null;
    if(req.file){
      file = req.file
    }

    BadgeService.create({...req.body}, file)
      .then((result) => {
        resp.status(result.status).send(result);
      })
      .catch(handleRouteError(resp));
  } catch (error) {
    handleRouteError(resp)({
      status: 403,
      message: __("mandatory.fields"),
      error,
    });
  }
});

router.patch("/update/:badgeId", Multer({storage: Multer.memoryStorage()}).single("badgeImage"), async (req, resp) => {
  try {
    await BadgeValidator.update().validateAsync(req.body);

    let file = null;
    if(req.file){
      file = req.file
    }

    BadgeService.update(req.params.badgeId, req.body, file)
      .then((result) => {
        resp.status(result.status).send(result);
      })
      .catch(handleRouteError(resp));
  } catch (error) {
    handleRouteError(resp)({
      status: 403,
      message: __("mandatory.fields"),
      error,
    });
  }
});

router.patch("/reset/:badgeId", async (req, resp) => {
  try {
    BadgeService.resetBadge(req.params.badgeId)
      .then((result) => {
        resp.status(result.status).send(result);
      })
      .catch(handleRouteError(resp));
  } catch (error) {
    handleRouteError(resp)({
      status: 403,
      message: __("mandatory.fields"),
      error,
    });
  }
});

router.get("/all", async (req, resp) => {
  try {
    BadgeService.list()
      .then((result) => {
        resp.status(result.status).send(result);
      })
      .catch(handleRouteError(resp));
  } catch (error) {
    handleRouteError(resp)({
      status: 403,
      message: __("mandatory.fields"),
      error,
    });
  }
});

router.patch("/community/:communtyId", async (req, resp) => {
  try {
    BadgeService.createForNewCommunity(req.params.communtyId)
      .then((result) => {
        resp.status(result.status).send(result);
      })
      .catch(handleRouteError(resp));
  } catch (error) {
    handleRouteError(resp)({
      status: 403,
      message: __("mandatory.fields"),
      error,
    });
  }
});

router.get("/community/:communtyId", async (req, resp) => {
  try {
    BadgeService.getCommunityBadgesSorted(req.params.communtyId)
      .then((result) => {
        resp.status(result.status).send(result);
      })
      .catch(handleRouteError(resp));
  } catch (error) {
    handleRouteError(resp)({
      status: 403,
      message: __("mandatory.fields"),
      error,
    });
  }
});

router.delete("/delete/:badgeId", async (req, resp) => {
  try {
    BadgeService.delete(req.params.badgeId)
      .then((result) => {
        resp.status(result.status).send(result);
      })
      .catch(handleRouteError(resp));
  } catch (error) {
    handleRouteError(resp)({
      status: 403,
      message: __("mandatory.fields"),
      error,
    });
  }
});

module.exports = router;