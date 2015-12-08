O2.createClass('O876.Browser', {
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
	}
});
