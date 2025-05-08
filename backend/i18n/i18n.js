const i18n = require("i18n");
const path = require("path");

const getLocales = () => ["en", "sv"];

const configure = () => {
	i18n.configure({
		locales: getLocales(),
		directory: path.join(__dirname, "/locales"),
		defaultLocale: process.env.DEFAULT_LANG || "en",
		autoReload: false,

		// setting of log level DEBUG - default to require('debug')('i18n:debug')
		logDebugFn(msg) {
			console.log(msg)
		},

		// setting of log level WARN - default to require('debug')('i18n:warn')
		logWarnFn(msg) {
			console.info(msg)
		},

		// setting of log level ERROR - default to require('debug')('i18n:error')
		logErrorFn(msg) {
			console.error(msg)
		},

		register: global
	});

	return i18n
};

module.exports = configure();