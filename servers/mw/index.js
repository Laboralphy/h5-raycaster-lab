var synthesis = require('synthesis');
var fs = require('fs');


function readConfig() {
	var oConfig = {};
	var re = new RegExp('\(.+).js$', '');
	var aCfg = fs.readdirSync(__dirname + '/config/');
	var sFile;
	for (var i = 0; i < aCfg.length; ++i) {
		sFile = aCfg[i];
		aMatch = sFile.match(re);
		if (aMatch) {
			oConfig[aMatch[1]] = require(__dirname + '/config/' + sFile);
		}
	}
	return oConfig;
}




//////MAIN ////// MAIN ////// MAIN ////// MAIN ////// MAIN ////// MAIN ////// MAIN ////// MAIN //////
//////MAIN ////// MAIN ////// MAIN ////// MAIN ////// MAIN ////// MAIN ////// MAIN ////// MAIN //////
//////MAIN ////// MAIN ////// MAIN ////// MAIN ////// MAIN ////// MAIN ////// MAIN ////// MAIN //////

function main() {
	console.log('O876 Modulable Server - dev version 2015-02-04');
	var sServerConfigKey = 'server';
	var c = readConfig();
	
	// configuration des services
	if (sServerConfigKey in c) {
		synthesis.init(c[sServerConfigKey]);
	} else {
		throw new Error('Server configuration file not found : config/server.js');
	}

	var aServices = [];
	var oService;
	for (var s in c) {
		if (s != sServerConfigKey) {
			oService = require(s);
			if (!('service' in oService)) {
				throw new Error('Service ' + s + ' has no method "service()".');
			}
			if ('init' in oService) {
				oService.init(c[s]);
			}
			aServices.push(oService.service);
		}
	}
	synthesis.run(aServices);
}

main();
