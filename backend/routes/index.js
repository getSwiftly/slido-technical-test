const v1Routes = require("./v1");
const cors = require("cors");

const setupThirdPartyMiddlewares = (app) => {
  let corsOptions = {
    exposedHeaders: [
      "Accept-Language",
      "Access-Control-Allow-Origin",
      "Connection",
      "Content-Length",
      "Content-Type",
      "Date",
      "Etag",
      "Server",
      "Via",
      "X-Auth",
      "X-Powered-By",
    ],
  };

  app.use(cors(corsOptions));
};

const setup = (app) => {
  if (app) {
    setupThirdPartyMiddlewares(app);
    routes(app);
    console.log("Setting up routes");
  } else {
    console.error("Undefined app provided for routes");
  }
};

const routes = (app) => {
  app.get("/", (req, res) =>
    res.status(200).send({
      message: `${process.env.APP_NAME} is Running!!`,
    })
  );

  v1Routes(app);
};

module.exports = setup;
