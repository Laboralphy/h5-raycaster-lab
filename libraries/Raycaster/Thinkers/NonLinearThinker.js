/** Interface de controle des mobile 
 * O876 Raycaster project
 * @date 2013-03-04
 * @author Raphaël Marandet 
 * Fait bouger le mobile de manière non-lineaire
 * Avec des coordonnée de dépat, d'arriver, et un temps donné
 * L'option lineaire est tout de même proposée.
 */
O2.extendClass('O876_Raycaster.NonLinearThinker', O876_Raycaster.Thinker, {
	_oEasingX: null,
	_oEasingY: null,

	_aStart: 0,
	
	setMove: function(x, y, a, dx, dy, t, s) {
		if (x === null || x === undefined) {
			x = this.oMobile.x;
		}
		if (y === null || y === undefined) {
			y = this.oMobile.y;
		}
		this._oEasingX = this._oEasingX || new O876.Easing();
		this._oEasingY = this._oEasingY || new O876.Easing();
		if (a !== null && a !== undefined) {
			this._aStart = a;
		} else {
			this._aStart = this.oMobile.fTheta;
		}
		var tf = this.oGame.oRaycaster.TIME_FACTOR;
		this._oEasingX.from(x).to(x + dx).during(t / tf | 0).use(s || 'smoothstep');
		this._oEasingY.from(y).to(y + dy).during(t / tf | 0).use(s || 'smoothstep');
	},

	think : function() {
		this.think = this.thinkInit;
	},

	// Déplacement à la position de départ
	thinkInit : function() {
		this.think = this.thinkMove;
	},
	
	thinkMove: function() {
		if (this._oEasingX && this._oEasingY) {
			var bx = this._oEasingX.next().over();
			var by = this._oEasingY.next().over();
			var x = this._oEasingX.val();
			var y = this._oEasingY.val();
			this.oMobile.setXY(x, y);
			if (bx && by) {
				this.think = this.thinkStop;
			}
		}
	},

	thinkStop: function() {
	},
	
	thinkIdle: function() {
	}
});
