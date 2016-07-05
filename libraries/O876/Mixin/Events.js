/**
 * good to GIT
 */
(function(O2) {

	var WEHName = '_WeirdEventHandlers';

	O2.createClass('O876.Mixin.Events', {

		on: function(sEvent, pCallback) {
			if (this[WEHName] === null) {
				this[WEHName] = {};
			}
			var weh = this[WEHName];
			if (!(sEvent in weh)) {
				weh[sEvent] = [];
			}
			weh[sEvent].push(pCallback);
			return this;
		},

		one: function(sEvent, pCallback) {
			pCallback._WeirdEventHandlersFlagOnce = true;
			return this.on(sEvent, pCallback);
		},

		off: function(sEvent, pCallback) {
			if (this[WEHName] === null) {
				throw new Error('no event "' + sEvent + '" defined');
			}
			if (sEvent === undefined) {
				this[WEHName] = {};
			} else if (!(sEvent in this[WEHName])) {
				throw new Error('no event "' + sEvent + '" defined');
			}
			var weh = this[WEHName];
			var wehe, n;
			if (pCallback !== undefined) {
				wehe = weh[sEvent];
				n = wehe.indexOf(pCallback);
				if (n < 0) {
					throw new Error('this handler is not defined for event "' + sEvent + '"');
				} else {
					wehe.splice(n, 1);
				}
			} else {
				weh[sEvent] = [];
			}
			return this;
		},

		trigger: function(sEvent) {
			if (this[WEHName] === null) {
				return this;
			}
			var weh = this[WEHName];
			if (!(sEvent in weh)) {
				return this;
			}
			var aArgs = Array.prototype.slice.call(arguments, 1);
			weh[sEvent].forEach(function(pCallback) {
				if (('_WeirdEventHandlersFlagOnce' in pCallback) && (pCallback._WeirdEventHandlersFlagOnce)) {
					delete pCallback._WeirdEventHandlersFlagOnce;
					this.off(sEvent, pCallback);
				}
				pCallback.apply(this, aArgs);
			}, this);
			return this;
		}
	});

	O876.Mixin.Events.prototype[WEHName] = null;
})(O2);
