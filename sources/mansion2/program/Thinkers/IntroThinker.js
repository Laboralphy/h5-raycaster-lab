/**
 * Thinker de missile
 */
O2.extendClass('MANSION.IntroThinker', O876_Raycaster.NonLinearThinker, {
	
	thinkInit: function() {
		// 30 unités jusqu'a destination
		this.setMove(null, null, null, 0, 0, 0, 1000);
		__inherited();
	}
});
