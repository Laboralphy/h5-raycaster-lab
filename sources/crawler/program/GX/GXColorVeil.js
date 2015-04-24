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
O2.extendClass('GXColorVeil', O876_Raycaster.GXEffect, {
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

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d'); 
		this.nTime = 0;
	},
	
	/** 
	 * Suppression d'un effet
	 * @param nEffect Effet(s) à supprimer (possibilité de combinaison OR)
	 * ex : clearEffect(SNARE | ROOT) mais ca sert pas des masses...
	 */
	clearEffect: function(nEffect) {
		this.nEffectMask &= 7 ^ nEffect;
		this.setupVeil();
	},
	
	/** 
	 * Ajout d'un effet
	 * @param nEffect Effet(s) à ajouter (possibilité de combinaison OR)
	 */
	setEffect: function(nEffect) {
		this.nEffectMask |= nEffect;
		this.setupVeil();
	},
	
	/** Configuration de la couleur et du gradient en fonction
	 * de l'effet le plus prioritaire.
	 */
	setupVeil: function() {
		switch (this.nEffectMask) {
			case 0: // no effect
				this.terminate();
				break;
				
			case 1: // Snare effect only
				this.setupSnare();
				break;
				
			case 2: // Root
			case 3:
				this.setupRoot();
				break;
				
			case 4: // Hold
			case 5:
			case 6:
			case 7:
				this.setupHold();
				break;
		}
	},
	
	/**
	 * Défini l'effet sur SNARE
	 * Construit un gradien inférieur vert
	 */
	setupSnare: function() {
		this.xStyle = this.oContext.createLinearGradient(0, this.oCanvas.height >> 1, 0, this.oCanvas.height - 1);
		this.xStyle.addColorStop(0, 'rgba(0, 255, 0, 0)');
		this.xStyle.addColorStop(1, 'rgba(0, 255, 0, 1)');
		this.yFrom = this.oCanvas.height >> 1;
		this.yTo = this.oCanvas.height;
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
	},
	
	/** Défini l'effet sur HOLD
	 * Construit un calque coloré Bleu
	 */
	setupHold: function() {
		this.xStyle = 'rgb(220, 220, 255)';
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
	},
	
	

	isOver: function() {
		return this.nEffectMask === 0;
	},

	process: function() {
		this.nTime++;
	},

	render: function() {
		if (this.nEffectMask) {
			var f = this.oContext.globalAlpha;
			this.oContext.globalAlpha = Math.sin(MathTools.toRad(this.nTime << 3)) / 5 + 0.444;
			this.oContext.fillStyle = this.xStyle;
			this.oContext.fillRect(0, this.yFrom, this.oCanvas.width, this.yTo);
			this.oContext.globalAlpha = f;
		}
	},

	done: function() {
	},
	
	terminate: function() {
		this.bOver = true;
	}
});
