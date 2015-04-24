O2.extendClass('MW.GXIconPad', O876_Raycaster.GXEffect, {
	sClass : 'IconPad',
	oCanvas : null,
	oContext : null,

	oRenderCanvas : null,
	oRenderContext : null,

	oIcons : null,
	oEffects : null,
	oCreature : null,

	sSnapShot : 'xxx',

	PAD_HEIGHT : 48,
	PAD_Y : 8,
	PAD_X : 8,
	PAD_ICON_SPACING : 2,
	PAD_ICON_SIZE : 48,

	__construct : function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d');
		this.oRenderCanvas = O876.CanvasFactory.getCanvas();
		this.oRenderCanvas.width = this.oCanvas.width - this.PAD_X - this.PAD_X;
		this.oRenderCanvas.height = this.PAD_HEIGHT;
		this.oRenderContext = this.oRenderCanvas.getContext('2d');
	},

	/**
	 * Défini la créature qui doit être monitorée
	 * 
	 * @param oCreature
	 */
	setCreature : function(oCreature) {
		this.oCreature = oCreature;
		this.oEffects = this.oCreature.oEffects;
	},

	/**
	 * Génère un icone ou retrouve celle qui a déja été créée avec
	 * l'identifiant spécifié
	 * 
	 * @param sIcon
	 *            identifiant de l'icone (nom de l'altération)
	 */
	getIcon : function(sIcon) {
		var sIconName = 'eff_' + sIcon;
		if (!(sIconName in ICONS)) {
			throw new Error('unknown alteration icon: ' + sIcon);
		}
		if (this.oIcons === null) {
			this.oIcons = {};
		}
		if (!(sIcon in this.oIcons)) {
			var oIcon = this.oRaycaster.oHorde.oTiles.i_icons32.oImage;

			this.oIcons[sIcon] = {
				icon : oIcon,
				effect : null,
				visible : true,
				offset : ICONS[sIconName] * this.PAD_ICON_SIZE
			};
		}
		return this.oIcons[sIcon];
	},

	/**
	 * Associe une icones avec un effet Si l'effet spécifié à un timeout
	 * trop petit par rapport a l'effet en cours, la commande est
	 * ignorée : on ne désire afficher que l'effets le plus long
	 */
	setIconEffect : function(oEffect) {
		var oIcon = this.getIcon(oEffect.sEffect.substr(1, 4));
		// pas d'effet associé
		if (oIcon.effect === null) {
			oIcon.effect = oEffect;
			return oIcon;
		}
		// même effet déja associé
		if (oIcon.effect == oEffect) {
			return oIcon;
		}
		if (oIcon.effect.bExpirable && oIcon.effect.nTimeOut < oEffect.nTimeOut) { 
			// L'effet en cours est expirable et le timer du nouvel effet est plus long
			// on change d'effet
			oIcon.effect = oEffect;
		}
		return oIcon;
	},
	
	reset: function() {
		this.sSnapShot = 'xxx';
		this.oIcons = null;
	},

	/**
	 * Produit un cliché des altération d'état Si le cliché change il
	 * faut refaire les icones
	 */
	processIcons : function() {
		var nEffCount = this.oEffects.length;
		var sSnapShot = '';
		var oEffect;
		var iEff;
		// vérifier juste si les effets sont les mêmes
		for (iEff = 0; iEff < nEffCount; iEff++) {
			oEffect = this.oEffects[iEff];
			sSnapShot += oEffect.sEffect;
		}
		if (sSnapShot != this.sSnapShot) {
			this.sSnapShot = sSnapShot;
			for (iEff = 0; iEff < nEffCount; iEff++) {
				oEffect = this.oEffects[iEff];
				this.setIconEffect(oEffect);
			}
			return this.orderIcons();
		} else {
			return false;
		}
	},

	// Comparateur d'icone
	compareIcons : function(oIconA, oIconB) {
		return oIconA.effect.sEffect > oIconB.effect.sEffect;
	},

	/**
	 * Organise les icons Commute l'état visible/invisible de chaque
	 * icone
	 */
	orderIcons : function() {
		var aDisplayIcons = [];
		var oIcon;
		for ( var iIc in this.oIcons) {
			oIcon = this.oIcons[iIc];
			if (oIcon.effect) { // Effet valide ?
				if (oIcon.effect.hasExpired()) { // L'effet vient
													// d'expirer
					// on supprime cet effet inutile
					oIcon.effect = null;
					oIcon.visible = false;
				} else {
					// l'effet est actif
					aDisplayIcons.push(oIcon);
					oIcon.visible = true;
				}
			}
		}
		aDisplayIcons.sort(this.compareIcons);
		return aDisplayIcons;
	},
	
	/**
	 * Cette fonction doit renvoyer TRUE si l'effet est fini
	 * 
	 * @return bool
	 */
	isOver : function() {
		return false;
	},

	/**
	 * Fonction appelée par le gestionnaire d'effet pour recalculer
	 * l'état de l'effet
	 */
	process : function() {
		var x = 0;
		var oIcon;
		var a = this.processIcons();
		if (a) {
			this.oRenderContext
					.clearRect(0, 0, this.oRenderCanvas.width,
							this.oRenderCanvas.height);
			for (var i in a) {
				oIcon = a[i];
				if (oIcon.visible) {
					this.oRenderContext.drawImage(oIcon.icon,
							oIcon.offset, 0, this.PAD_ICON_SIZE,
							this.PAD_ICON_SIZE, x, 0,
							this.PAD_ICON_SIZE, this.PAD_ICON_SIZE);
					x += this.PAD_ICON_SIZE + this.PAD_ICON_SPACING;
				}
			}
		}
	},

	/**
	 * Fonction appelée par le gestionnaire d'effet pour le rendre à
	 * l'écran
	 */
	render : function() {
		this.oContext.drawImage(this.oRenderCanvas, this.PAD_X,
				this.PAD_Y);
	},

	/**
	 * Fonction appelée lorsque l'effet se termine de lui même ou stoppé
	 * par un clear() du manager
	 */
	done : function() {
	},

	/** Permet d'avorter l'effet
	 * Il faut coder tout ce qui est nécessaire pour terminer proprement l'effet
	 * (restauration de l'état du laby par exemple)
	 */
	terminate : function() {
	}
});
