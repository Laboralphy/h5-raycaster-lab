//MathTools.rnd(1000000, 9999999).toString(36);

/**
 * No cached ajax plugin
 */

(function ($) {
	$.rcweGetJSON = function() {
		var sURL = '', oParams = {}, pComplete = function() {}, pError = function() {};
		var nQuest = sURL.indexOf('?');
		if (nQuest >= 0) {
			$.extend(oParams, O876.ParamGetter(sURL));
			sURL = sURL.substr(0, nQuest);
		}
		switch (O876.FunArgType(arguments)) {
			case 'soff':
				sURL = arguments[0];
				oParams = $.extend(oParams, arguments[1]);
				pComplete = arguments[2];
				pError = arguments[3];
			break;
			
			case 'sof':
				sURL = arguments[0];
				oParams = $.extend(oParams, arguments[1]);
				pComplete = arguments[2];
			break;
			
			case 'sff':
				sURL = arguments[0];
				pComplete = arguments[1];
				pError = arguments[2];
			break;
				
			case 'sf':
				sURL = arguments[0];
				pComplete = arguments[1];
			break;
				
			case 's':
				sURL = arguments[0];
			break;
		
			default:
				throw new Error('unknown function signature');
		}
		var aParams = [];
		oParams.__countercache = MathTools.rnd(1000000, 9999999).toString(36);
		for (var sParam in oParams) {
			aParams.push(sParam + '=' + encodeURIComponent(oParams[sParam]));
		}
		sURL += '?' + aParams.join('&');
		$.getJSON(sURL, pComplete).fail(pError);
	}
})(jQuery);
