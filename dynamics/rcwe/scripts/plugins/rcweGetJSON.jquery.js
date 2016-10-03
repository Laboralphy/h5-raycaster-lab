//MathTools.rnd(1000000, 9999999).toString(36);

/**
 * No cached ajax plugin
 */

(function ($) {
	var aQueue = [];
	var bRunning = false;
	$.rcweGetJSON = function() {
		
		function goAjax() {
			var aNext = aQueue.shift();			
			if (!aNext) {
				bRunning = false;
				return;
			}
			bRunning = true;
			var sURL = aNext[0];
			var pComplete = aNext[1];
			var pError = aNext[2];
			$.getJSON(sURL, function(data) {
				pComplete(data);
				goAjax();
			}).fail(function(ajax, err) {
				pError(err);
				goAjax();
			}).progress(function(x, y, z) {
				console.log(x, y, z);
			});
		}
		
		var sURL = '', oParams = {}, pComplete = function() {}, pError = function() {};
		var nQuest = sURL.indexOf('?');
		if (nQuest >= 0) {
			$.extend(oParams, O876.parseSearch(sURL));
			sURL = sURL.substr(0, nQuest);
		}
		switch (O876.typeMap(arguments, 'short')) {
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
				return aQueue;
		}
		var aParams = [];
		oParams.__countercache = MathTools.rnd(1000000, 9999999).toString(36);
		for (var sParam in oParams) {
			aParams.push(sParam + '=' + encodeURIComponent(oParams[sParam]));
		}
		sURL += '?' + aParams.join('&');
		aQueue.push([sURL, pComplete, pError]);
		if (!bRunning) {
			goAjax();
		}
	}
})(jQuery);
