const fs = require('fs');
let jwt = require('jsonwebtoken');

class JWTService {
    // CREATE JWT FOR INTER SERVICES HIT
    async createOwnJWT(data = {}){
        return await this.returnJWT({
            authorities: [
                "IS_AUTH_SERVER"
            ],
            ...data
        }, "10m");
    };

    async returnJWT(data, expiry) {
        if(!expiry){
            expiry = 60 * 60 * 1000;
        };

        // sign with RSA SHA512
        let keyPath = process.env.PRIVATE_KEY_PATH;
        var privateKEY = fs.readFileSync(keyPath, 'utf8');

        var token = jwt.sign(data, privateKEY, { expiresIn: expiry, algorithm: "RS256" });

        return token;
    };
}

module.exports = new JWTService();