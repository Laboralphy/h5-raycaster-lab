/**
 * good to GIT
 */
O2.createClass('O876.Mixin.Events', {
	mixin: function(p) {
		p.extendPrototype({
			
			_WeirdEventHandlers: null,
		
			on: function(sEvent, pCallback) {
				if (this._WeirdEventHandlers === null) {
					this._WeirdEventHandlers = {};
				}
				var weh = this._WeirdEventHandlers;
				if (!(sEvent in weh)) {
					weh[sEvent] = [];
				}
				weh[sEvent].push(pCallback);
				return this;
			},

			one: function(sEvent, pCallback) {
				var pCallbackOnce;
				pCallbackOnce = (function() {
					pCallback.apply(this, Array.prototype.slice.call(arguments, 0));
					this.off(sEvent, pCallbackOnce);
					pCallbackOnce = null;
				}).bind(this);
				return this.on(sEvent, pCallbackOnce);
			},

			off: function(sEvent, pCallback) {
				if (this._WeirdEventHandlers === null) {
					throw new Error('no event "' + sEvent + '" defined');
				}
				if (sEvent === undefined) {
					this._WeirdEventHandlers = {};
				} else if (!(sEvent in this._WeirdEventHandlers)) {
					throw new Error('no event "' + sEvent + '" defined');
				}
				var weh = this._WeirdEventHandlers;
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
				if (this._WeirdEventHandlers === null) {
					return this;
				}
				var weh = this._WeirdEventHandlers;
				if (!(sEvent in weh)) {
					return this;
				}
				var aArgs = Array.prototype.slice.call(arguments, 1);
				weh[sEvent].forEach(function(pCallback) {
					pCallback.apply(this, aArgs);
				}, this);
				return this;
			}
		});
	}
});
