const { Router } = require("express");
const router = Router();
const { handleRouteError } = require("../../../utils/common-utils");

const client = require("../../../config/pg-client");

router.get("/", async (req, resp) => {
  try {
    
    const res = await client.query('SELECT * from testtable')
    console.log("HELLO WORLD", res.rows) // Hello world!
    await client.end()

    return resp.status(200).send({
      status: 200,
      message: "DB connection successful",
    });
  } catch (error) {
    handleRouteError(resp)({
      status: 403,
      message: __("mandatory.fields"),
      error,
    });
  }
});

module.exports = router;