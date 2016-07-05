/**
 * good to GIT
 */

O2.createObject('O876.Browser', {
	
	STRINGS: {
		en: {
			wontrun: 'The game won\'t run because some HTML 5 features are not supported by this browser',
			install: 'You should install the latest version of one of these browsers : <b>Firefox</b>, <b>Chrome</b> or <b>Chromium</b>.',
			legend: '(the red colored features are not supported by your browser)'
		},
		
		fr: {
			wontrun: 'Le jeu ne peut pas se lancer, car certaines fonctionnalités HTML 5 ne sont pas supportées par votre navigateur',
			install: 'Vous devriez installer la dernière version de l\'un de ces navigateurs : <b>Firefox</b>, <b>Chrome</b> ou <b>Chromium</b>.',
			legend: '(les fonctionnalités marquées en rouge ne sont pas supportées par votre navigateur)'
		}
	},
	
	LANGUAGE: 'en',
	
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
		return !!window.chrome && !O876.Browser.isOpera();              // Chrome 1+
	},
	
	isIE: function() {
		return /*@cc_on!@*/false || !!document.documentMode; // At least IE6
	},
	
	/**
	 * Return the lists of detected browsers
	 */
	getDetectedBrowserList: function() {
		return (['Opera', 'Firefox', 'Safari', 'Chrome', 'IE']).filter(function(f) {
			return O876.Browser['is' + f]();
		});
	},

	/**
	 * Tests if all specified HTML5 feature are supported by the browser
	 * if no parameter is set, tests all the HTML 5 feature
	 * the returned objet has a 'html' field to be displayed
	 * @param aRequire array of string
	 * @return object
	 */
	getHTML5Status: function(aRequired) {
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
			aFeats.push('<tr><td style="color: ' + (oReport[iFeat] ? '#080' : '#800') + '">' + (oReport[iFeat] ? '✔' : '✖') + '</td><td' + (oReport[iFeat] ? '' : ' style="color: #F88"') + '>' + iFeat + '</td></tr>');
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
		oReport.browser = O876.Browser.getDetectedBrowserList();
		return oReport;
	},
	
	checkHTML5: function(sTitle) {
		if (!sTitle) {
			sTitle = 'HTML 5 Application';
		}
		var oHTML5 = O876.Browser.getHTML5Status();
		if (!oHTML5.all) {
			var m = O876.Browser.STRINGS[O876.Browser.LANGUAGE];
			document.body.innerHTML = '<div style="color: #AAA; font-family: monospace; background-color: black; border: solid 4px #666; padding: 8px">' +
				'<h1>' + sTitle + '</h1>' +
				'<p>' + m.wontrun + ' (' + oHTML5.browser.join(', ') + ').<br/>' +
				m.install + '</p>' + oHTML5.html + 
				'<p style="color: #888; font-style: italic">' + m.legend + '</p></div>'; 
			return false;
		}
		return oHTML5.all;
	},
});
