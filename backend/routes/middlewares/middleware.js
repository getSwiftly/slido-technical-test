const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const i18n = require('../../i18n/i18n');


const setupThirdParty = (app) => {
    console.info('Setting up third-party middleware');

    // console.log('Setting up body-parser.json()');
    app.use(bodyParser.json({limit: '100mb'}));
    app.use(bodyParser.urlencoded({ limit: '100mb', extended: false }));
    app.use(express.json({limit: '100mb'}));
    app.use(express.urlencoded({ limit: '100mb', extended: false }));
	
	console.log('Setting up i18n');
    app.use(i18n.init);
};

const setup = (app) => {
    if (app) {
        console.info('Setting up middleware...');

        let _path = path.join(__dirname, '../', 'public');
        console.info(`Setting express static ${_path}`);

        app.use(express.static(_path));

        setupThirdParty(app);
    } 
	else {
        console.error('Undefined [app] provided');
    }
};

module.exports = setup;