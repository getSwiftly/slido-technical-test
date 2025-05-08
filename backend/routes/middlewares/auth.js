const fs = require('fs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

let publicKey = "";

const authenticate = (authority) => {
    console.log('Fetching public key');

    return (req, resp, next) => {
        getPublicKey()
            .then(key => {
                const header = req.header('Authorization');
                if (_.isEmpty(header)) {
                    return Promise.reject({
                        status: 401,
                        message: "Full authorization is required to access this route"
                    });
                }

                const token = header.split(' ').pop();
                try {
                    const decodedToken = jwt.verify(token, key, {algorithms: ['RS256']});
                    return Promise.resolve(decodedToken);
                } catch (e) {
                    console.error('Error occurred while decoding access token', e);
                    return Promise.reject({status: 400, message: 'Could not decode Access Token'});
                }
            })
            .then(decoded => {
                req.jwt = decoded;

                if (_.isEmpty(decoded.authorities)) {
                    return Promise.reject({status: 401, message: 'You do not have authority to access this resource'});
                }

                const authorities = authority.split(',');

                if (authorities.length === 1 && authorities[0] === "") {
                    next();
                    return Promise.resolve();
                }

                for (let index = 0; index < authorities.length; index++) {
                    const auth = authorities[index].trim();

                    if (decoded.authorities.indexOf(auth) > -1) {
                        next();
                        return Promise.resolve();
                    }
                }
                return Promise.reject({status: 401, message: 'You do not have authority to access this resource'});
            })
            .catch(error => {
                resp.status(401).send({
                    status: 401,
                    message: error.message || "You are unauthorized to access this resource",
                    error
                });
            });
    };
};

const getPublicKey = () => {
    console.log('Fetching public key');
    return new Promise((resolve, reject) => {
        if (_.isEmpty(publicKey)) {
            fs.readFile(process.env.PUBLIC_KEY_PATH, (error, file) => {
                if (error) {
                    reject(error);
                } else {
                    publicKey = file;
                    resolve(file);
                }
            });
        } else {
            resolve(publicKey);
        }
    });
};

module.exports = {
    authenticate
};
