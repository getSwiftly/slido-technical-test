class SystemConfig {

    constructor() {
        this._appName = process.env.APP_NAME;
        this._port = process.env.PORT;
    }

    get appName() {
        return this._appName;
    }

    get port() {
        return this._port;
    }

    get appIdentifier() {
        return `${this.appName}|${this.port}`;
    }

}

module.exports = new SystemConfig();