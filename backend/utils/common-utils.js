const _ = require('lodash');

const GENERAL_ERROR_CODE = "server.error";
const BAD_REQ_ERROR_CODE = "bad.request";

const saltRounds = +process.env.SALT_ROUNDS;

const handleRouteError = (resp) => {
    return (error) => {
        logErrorDetails(error);

        if (isBadRequestError(error)) {
            sendBadRequestResponse(error, resp);
        } else {
            sendGeneralErrorResponse(resp);
        }
    };
};

const logErrorDetails = (error) => {
    console.error(error);
};

const isBadRequestError = (error) => {
    return !_.isEmpty(error) && _.isFinite(error.status) && error.status >= 400 && error.status < 500;
};

const sendBadRequestResponse = (error, resp) => {
    if(error.message) {
        console.log(error.message);
        resp.status(error.status).send({status: error.status, message: error.message, error});
    }else{
        const messageCode = _.isEmpty(error.messageCode) ? BAD_REQ_ERROR_CODE : error.messageCode;
        resp.status(error.status).send({status: error.status, message: __(messageCode), error});
    }
};

const sendGeneralErrorResponse = (resp) => {
    // resp.status(500).send({status: 500, message: resp.__(GENERAL_ERROR_CODE)});
    resp.status(500).send({status: 500, message: 'GENERAL_ERROR'});
};

const omitFields = (object, fields = []) => {
    return _.omit(object, fields);
};

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const generateRandomNumber = async (min, max) => {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

const generateRandomString = async (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    handleRouteError,
    omitFields,
    generateRandomNumber,
    validateEmail,
    generateRandomString
};