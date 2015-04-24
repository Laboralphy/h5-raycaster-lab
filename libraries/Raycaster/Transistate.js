O2.createClass('O876_Raycaster.Transistate', {
	nInterval : 160,
	oInterval : null,
	pDoomloop : null,
	sDoomloopType : 'interval',
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
	setDoomloop : function(sProc) {
		this.pDoomloop = this[this._sState = sProc];
	},

	getDoomLoop : function() {
		return this._sState;
	},

	initDoomloop : function() {
		this.pDoomloop();
		this.pause();
		this.oInterval = setInterval(this.doomloop.bind(this), this.nInterval);
		this.bBound = true;
	},

	doomloop : function() {
		this.pDoomloop();
	},


	/** 
	 * Met la machine en pause
	 * Le timer est véritablement coupé
	 */
	pause : function() {
		this.bPause = true;
		if (this.oInterval) {
			clearInterval(this.oInterval);
			this.oInterval = null;
		}
	},

	/** 
	 * Remet la machine en route après une pause
	 * Le timer est recréé.
	 */
	resume : function() {
		this.pause();
		this.bPause = false;
		this.initDoomloop();
	}
});
