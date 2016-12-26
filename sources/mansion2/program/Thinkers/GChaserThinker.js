/**
 * Chaser :
 * Ce thinker ne fait que poursuivre la cible, 
 * se téléporte a proximité de la cible en cas de perte de vue
 */
O2.extendClass('MANSION.GChaserThinker', MANSION.VengefulThinker, {
	thinkIdle: function() {
		__inherited();
		var oTarget = this.getTarget();
		console.log('my target', oTarget);
		if (this.isEntityVisible(oTarget)) {
			console.log(new Date(), 'target visible : chasing');
			this.setThink('Chase', 120);
		} else {
			var m = this.oMobile;
			console.log(new Date(), 'target invisible : teleport random from x', m.x | 0, 'y', m.y | 0);
			this.teleportRandom(128, 256); 
		}
		
	}
});
