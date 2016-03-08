/** Interface de controle des mobile 
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Fait bouger lemobile de manière aléatoire
 */
O2.extendClass('O876_Raycaster.WanderThinker', O876_Raycaster.Thinker, {
	nTime: 0,
	aAngles: null,
	nAngle: 0,

	__construct: function() {
		this.aAngles = [0, 0.25 * PI, 0.5 * PI, 0.75 * PI, PI, -0.75 * PI, -0.5 * PI, -0.25 * PI];
		this.nTime = 0;
		this.think = this.thinkInit;
	},
  
	think: function() {},

	thinkInit: function() {
		this.oMobile.fSpeed = 2;
		this.think = this.thinkGo;
	},

	thinkGo: function() {
		if (this.nTime <= 0) { // changement d'activité si le timer tombe à zero
			this.nAngle = MathTools.rnd(0, 7);
			this.oMobile.fTheta = this.aAngles[this.nAngle];
			this.nTime = MathTools.rnd(15, 25) * 4;
		} else {
			--this.nTime;
			this.oMobile.moveForward();
			if (this.oMobile.oWallCollision.x !== 0 || this.oMobile.oWallCollision.y !== 0) {
				this.nTime = 0;
			}
		}
	}
});

