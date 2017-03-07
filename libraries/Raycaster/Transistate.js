/**
 * @class O876_Raycaster.Transistate
 */
O2.createClass('O876_Raycaster.Transistate', {
	nInterval : 160,
	oInterval : null,
	oRafInterval: null,
	pDoomloop : null,
	sDoomloopType : 'interval',
	sDefaultDoomloopType: 'interval',
	bPause : false,
	nTimeModulo : 0,
	_sState : '',
	bBound: false,

	__construct : function(sFirst) {
		this.setDoomloop(sFirst);
	},


	/** Definie la procédure à lancer à chaque doomloop
	 * @param sProc nom de la méthode de l'objet à lancer
	 */
	setDoomloop : function(sProc, sType) {
		this.sDoomloopType = sType;
		if (!(sProc in this)) {
			throw new Error('"' + sProc + '" is not a valid timer proc');
		}
		this.pDoomloop = this[this._sState = sProc].bind(this);
		this.stopTimers();
		switch (sType) {
			case 'interval':
				this.oInterval = window.setInterval(this.pDoomloop, this.nInterval);
			break;
			
			case 'raf':
				this.oRafInterval = window.requestAnimationFrame(this.pDoomloop);
			break;
			
			default:
				this.setDoomloop(sProc, this.sDefaultDoomloopType);
			break;
		}
	},

	/**
	 * Returns the timer proc name
	 * (defined with setDoomloop)
	 * @return string
	 */
	getDoomLoop : function() {
		return this._sState;
	},

	doomloop : function() {
		this.pDoomloop();
	},


	/**
	 * Stop all timer procedure
	 */
	stopTimers: function() {
		if (this.oInterval) {
			window.clearInterval(this.oInterval);
			this.oInterval = null;
		}
		if (this.oRafInterval) {
			window.cancelAnimationFrame(this.oRafInterval);
			this.oRafInterval = null;
		}
	},

	/** 
	 * Met la machine en pause
	 * Le timer est véritablement coupé
	 */
	pause : function() {
		if (!this.bPause) {
			this.bPause = true;
			this.stopTimers();
		}
	},

	/** 
	 * Remet la machine en route après une pause
	 * Le timer est recréé.
	 */
	resume : function() {
		if (this.bPause) {
			this.setDoomloop(this.getDoomLoop(), this.sDoomloopType);
			this.bPause = false;
		}
	}
});
