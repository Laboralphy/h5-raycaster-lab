O2.createObject('O876.Browser', {
	__construct: function() {
		var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
			// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
		var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
		var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
			// At least Safari 3+: "[object HTMLElementConstructor]"
		var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
		var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6	
	},

	isOpera: function() {
		return !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
			// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
	},
	
	isFirefox: function() {
		return typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
	},
	
	isSafari: function() {
		return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
			// At least Safari 3+: "[object HTMLElementConstructor]"
	},
	
	isChrome: function() {
		return !!window.chrome && !isOpera;              // Chrome 1+
	},
	
	isIE: function() {
		return /*@cc_on!@*/false || !!document.documentMode; // At least IE6
	},

	/**
	 * Tests if all specified HTML5 feature are supported by the browser
	 * if no parameter is set, tests all the HTML 5 feature
	 * the returned objet has a 'html' field to be displayed
	 * @param aRequire array of string
	 * @return object
	 */
	isHTML5: function(aRequired) {
		var oReport = {
			canvas: 'HTMLCanvasElement' in window,
			audio: 'HTMLAudioElement' in window,
			fullscreen: ('webkitIsFullScreen' in document) || ('mozFullScreen' in document),
			animation: 'requestAnimationFrame' in window,
			performance: ('performance' in window) && ('now' in performance),
			pointerlock: ('pointerLockElement' in document) || ('mozPointerLockElement' in document),
			uint32array: 'Uint32Array' in window
		};
		var i, b = true;
		var aFeats = ['<table><tbody>'];
		
		function testFeature(iFeat) {
			b = b && oReport[iFeat];
			aFeats.push('<tr><td style="color: ' + (oReport[iFeat] ? '#080' : '#800') + '">' + (oReport[iFeat] ? '✔' : '✖') + '</td><td>' + iFeat + '</td></tr>');
		}
		
		if (aRequired) {
			aRequired.forEach(testFeature);
		} else {
			for (i in oReport) {
				testFeature(i);
			}
		}
		aFeats.push('</tbody></table>');
		oReport.all = b;
		oReport.html = '<div>' + aFeats.join('') + '</div>';
		
		return oReport;
	}
});
