/** Effet graphique temporisé
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * 
 * Change graduellement le gradient de luminosité ambiente.
 */
O2.extendClass('O876_Raycaster.GXAmbientLight', O876_Raycaster.GXEffect, {
	sClass: 'AmbientLight',
	_oEasing: null,
	_bOver: false,
	_x: 0,
	
	__construct: function(rc) {
		__inherited(rc);
		this._oEasing = new O876.Easing();
	},
	
	setLight: function(x, t) {
		if (x > 0 && t > 0) {
			var rc = this.oRaycaster;
			this._bOver = false;
			this._oEasing
				.from(rc.nShadingFactor)
				.to(x)
				.during(t * rc.TIME_FACTOR / 1000 | 0)
				.use('smoothstep');
		}
		return this;
	},
	
	isOver: function() {
		return this._bOver;
	},

	process: function() {
		var e = this._oEasing;
		e.next();
		this._bOver = e.over();
	},

	render: function() {
		var x = this._oEasing.val();
		if (x > 0) {
			var rc = this.oRaycaster;
			this._bOver = false;
			rc.nShadingFactor = x | 0;
			if (rc.oUpper) {
				rc.oUpper.nShadingFactor = x | 0;
			}
		}
	},

	terminate: function() {
		this._bOver = true;
	}
});
