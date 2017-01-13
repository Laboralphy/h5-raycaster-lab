/**
 * @class O876.Auto.Trans
 * Transition for the Automaton
 * This class is a Transition.
 * A test is done, and if a "true" boolean value is return then
 * the automaton switches to another State
 */

O2.createClass('O876.Auto.Trans', {
	_test: null,
	_state: null,
	
	/**
	 * Returns true if all tests pass
	 * @return boolean
	 */
	pass: function(oState) {
		var ev = {
			state: oState,
			test: this._test,
			result: null
		};
		this.trigger('test', ev);
		return !!ev.result;
	}
});


O2.mixin(O876.Auto.Trans, O876.Mixin.Prop);
O2.mixin(O876.Auto.Trans, O876.Mixin.Events);
