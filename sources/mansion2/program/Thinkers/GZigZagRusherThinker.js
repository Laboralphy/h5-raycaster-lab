/**
 * Rusher en Zigzag
 * Ce thinker tente de s'approcher de la cible en zig zag,
 * Lorsqu"il est tout pret il se précipite pour surprendre sa cible 
 */
O2.extendClass('MANSION.GZigZagRusherThinker', MANSION.VengefulThinker, {

	MINIMUM_RUSH_DISTANCE: 192,

	thinkIdle: function() {
		__inherited();
		var oTarget = this.getTarget();
		if (this.isEntityVisible(oTarget)) {
			if (this.distanceTo(oTarget) <= this.MINIMUM_RUSH_DISTANCE) {
				this.setThink('Rush', 75);
			} else {
				this.setThink('ZigZagChase', MAIN.rand(300, 400));
			}
		} else {
			this.teleportRandom(128, 256); 
		}
		
	}
});
