const { Router } = require("express");

const authRoutes = require("./auth-routes");
// const dbTestRoutes = require("./db-test");
const pollRoutes = require("./poll-routes");

const setup = (app) => {
  const router = Router();

  router.use("/auth", authRoutes);
  // router.use("/db-test", dbTestRoutes);
  router.use("/poll", pollRoutes);
  
  // this should be the last line
  app.use("/v1", router);
};

module.exports = setup;
