/**
 * @class O876.Mixin.Events
 * This class is a mixin
 * it will add custom events management functions to an existing prototype
 */
O2.createClass('O876.Mixin.Events', {
	mixin: function(p) {
		p.extendPrototype({
			
			_WeirdEventHandlers: null,

            /**
			 * Will declare an event handler
             * @param sEvent event name
             * @param pCallback function to be called when the event is triggered
             * @returns {*}
             */
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

            /**
             * Will declare an event handler. The handler will be called
			 * at most one time.
             * @param sEvent event name
             * @param pCallback function to be called when the event is triggered
             * @returns {*}
             */
			one: function(sEvent, pCallback) {
				var pCallbackOnce;
				pCallbackOnce = (function() {
					pCallback.apply(this, Array.prototype.slice.call(arguments, 0));
					this.off(sEvent, pCallbackOnce);
					pCallbackOnce = null;
				}).bind(this);
				return this.on(sEvent, pCallbackOnce);
			},

            /**
             * Will remove an event handler.
			 * If pCallback is specified, this pCallback only will be remove
			 * if no callback is specified, all the handlers will be removed for that
			 * event.
			 * if neither sEvent nor pCallback are specified, all events and all handler
			 * will be removed.
             * @param sEvent event name
             * @param pCallback function to be called when the event is triggered
             * @returns {*}
             */
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

            /**
			 * Triggers an event.
			 * Will call all callback associated with that event.
			 * All parameters following sEvent will be passed to
			 * the event handler.
             * @param sEvent event name
             * @returns {trigger}
             */
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
