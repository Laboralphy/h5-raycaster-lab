/** Effet graphique temporisé
 * Ajoute un filtre coloré pour représenté l'application d'effets
 * entravant le mouvement du joueur.
 * Il y a plusieurs modes correspondant à plusieurs couleurs
 * - Mode SNARE : dégradé inférieur vert
 * - Mode ROOT : dégradé inférieur magenta
 * - Mode HOLD : calque complet bleu
 * Il ne peut y avoir qu'un seul mode à la fois
 * Chaque mode à sa priorité
 * C'est le mode le plus prioritaire qui s'exprime.
 * ex : si le joueur est ROOT + HOLD, c'est HOLD qui s'exprime
 * l'effet sera donc un calque complet bleu.
 * 
 */
O2.extendClass('MW.GXColorVeil', O876_Raycaster.GXEffect, {
	sClass: 'ColorVeil',
	oCanvas: null,
	oContext: null,
	nTime: 0,

	xStyle: null,
	yFrom: 0,
	yTo: 0,
	
	nEffectMask: 0,
	
	SNARE: 1,
	ROOT: 2,
	HOLD: 4,
	REFLECT: 8,

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.getScreenCanvas();
		this.oContext = this.oCanvas.getContext('2d'); 
		this.nTime = 0;
	},
	
	/**
	 * Défini l'effet sur SNARE
	 * Construit un gradien inférieur vert
	 */
	setupSnare: function() {
		this.xStyle = this.oContext.createLinearGradient(0, this.oCanvas.height >> 1, 0, this.oCanvas.height - 1);
		this.xStyle.addColorStop(0, 'rgba(0, 64, 255, 0)');
		this.xStyle.addColorStop(1, 'rgba(0, 64, 255, 1)');
		this.yFrom = this.oCanvas.height >> 1;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	/** Défini l'effet sur ROOT
	 * Construit un gradient inférieur magenta
	 */
	setupRoot: function() {
		this.xStyle = this.oContext.createLinearGradient(0, this.oCanvas.height >> 1, 0, this.oCanvas.height - 1);
		this.xStyle.addColorStop(0, 'rgba(0, 220, 255, 0)');
		this.xStyle.addColorStop(1, 'rgba(0, 220, 255, 1)');
		this.yFrom = this.oCanvas.height >> 1;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	/** Défini l'effet sur HOLD
	 * Construit un calque coloré Bleu
	 */
	setupHold: function() {
		this.xStyle = this.oContext.createLinearGradient(0, 0, this.oCanvas.width - 1, 0);
		this.xStyle.addColorStop(0.000, 'rgba(220, 220, 255, 0)');
		this.xStyle.addColorStop(0.125, 'rgba(220, 220, 255, 1)');
		this.xStyle.addColorStop(0.250, 'rgba(220, 220, 255, 0)');
		this.xStyle.addColorStop(0.375, 'rgba(220, 220, 255, 1)');
		this.xStyle.addColorStop(0.500, 'rgba(220, 220, 255, 0)');
		this.xStyle.addColorStop(0.625, 'rgba(220, 220, 255, 1)');
		this.xStyle.addColorStop(0.750, 'rgba(220, 220, 255, 0)');
		this.xStyle.addColorStop(0.875, 'rgba(220, 220, 255, 1)');
		this.xStyle.addColorStop(1.000, 'rgba(220, 220, 255, 0)');
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	setupReflect: function() {
		var w2 = this.oCanvas.width >> 1;
		var h2 = this.oCanvas.height >> 1;
		this.xStyle = this.oContext.createRadialGradient(w2, h2, h2 >> 2, w2, h2, w2);
		this.xStyle.addColorStop(0, 'rgba(0, 185, 255, 0)');
		this.xStyle.addColorStop(1, 'rgba(0, 185, 255, 1)'); // 00b9ff
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	setupInvisible: function() {
		var w2 = this.oCanvas.width >> 1;
		var h2 = this.oCanvas.height >> 1;
		this.xStyle = this.oContext.createRadialGradient(w2, h2, h2 >> 2, w2, h2, w2);
		this.xStyle.addColorStop(0, 'rgba(0, 0, 0, 0)');
		this.xStyle.addColorStop(0.6, 'rgba(0, 0, 0, 0.8)'); 
		this.xStyle.addColorStop(1, 'rgba(128, 0, 192, 0.8)'); 
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	
	setupVampyre: function() {
		var w2 = this.oCanvas.width >> 1;
		var h2 = this.oCanvas.height >> 1;
		this.xStyle = this.oContext.createRadialGradient(w2, h2, h2 >> 2, w2, h2, w2);
		this.xStyle.addColorStop(0, 'rgba(0, 0, 0, 0)');
		this.xStyle.addColorStop(0.6, 'rgba(128, 0, 0, 0.8)'); 
		this.xStyle.addColorStop(1, 'rgba(192, 64, 64, 0.8)'); 
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	setupPower: function() {
		var w2 = this.oCanvas.width >> 1;
		var h2 = this.oCanvas.height >> 1;
		this.xStyle = this.oContext.createRadialGradient(w2, h2, h2 >> 2, w2, h2, w2);
		this.xStyle.addColorStop(0, 'rgba(0, 0, 0, 0)');
		this.xStyle.addColorStop(0.6, 'rgba(255, 0, 0, 0.75)'); 
		this.xStyle.addColorStop(0.9, 'rgba(255, 255, 0, 0.75)'); 
		this.xStyle.addColorStop(1, 'rgba(255, 255, 255, 0.75)'); 
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},

	setupWeakness: function() {
		var w2 = this.oCanvas.width >> 1;
		var h2 = this.oCanvas.height >> 1;
		this.xStyle = this.oContext.createRadialGradient(w2, h2, h2 >> 2, w2, h2, w2);
		this.xStyle.addColorStop(0, 'rgba(0, 0, 0, 0)');
		this.xStyle.addColorStop(0.6, 'rgba(255, 0, 0, 0.75)'); 
		this.xStyle.addColorStop(0.9, 'rgba(255, 0, 255, 0.75)'); 
		this.xStyle.addColorStop(1, 'rgba(64, 0, 255, 0.75)'); 
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	/**
	 * Défini l'effet sur MAGNET
	 * Construit un gradien inférieur gris
	 */
	setupMagnet: function() {
		this.xStyle = this.oContext.createLinearGradient(0, this.oCanvas.height >> 1, 0, this.oCanvas.height - 1);
		this.xStyle.addColorStop(0, 'rgba(160, 160, 160, 0)');
		this.xStyle.addColorStop(1, 'rgba(160, 160, 160, 1)');
		this.yFrom = this.oCanvas.height >> 1;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},


	/**
	 * Défini l'effet sur MAGNET
	 * Construit un gradien inférieur gris
	 */
	setupDefense: function() {
		this.xStyle = this.oContext.createLinearGradient(0, 0, this.oCanvas.width, this.oCanvas.height);
		this.xStyle.addColorStop(0, 'rgba(250, 250, 160, 1)');
		this.xStyle.addColorStop(0.4, 'rgba(250, 250, 160, 0)');
		this.xStyle.addColorStop(0.6, 'rgba(250, 250, 160, 0)');
		this.xStyle.addColorStop(1, 'rgba(250, 250, 160, 1)');
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},

	isOver: function() {
		return this.bOver;
	},

	process: function() {
		this.nTime++;
	},

	render: function() {
		var f = this.oContext.globalAlpha;
		this.oContext.globalAlpha = Math.sin(MathTools.toRad(this.nTime << 3)) / 5 + 0.444;
		this.oContext.fillStyle = this.xStyle;
		this.oContext.fillRect(0, this.yFrom, this.oCanvas.width, this.yTo);
		this.oContext.globalAlpha = f;
	},

	done: function() {
	},
	
	terminate: function() {
		this.bOver = true;
	}
});
