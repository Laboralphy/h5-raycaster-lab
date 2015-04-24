O2.createClass('UnderwaterPlugin', {

	oGame: null,
	
	MAX_APNEA: 20,
	MAX_BUBBLES: 5,
	HUD_BUBBLE: 51,
	HUD_POP: 52,
	APNEA_DAMAGE: 5,
	
	bInWater: false,

	/**
	 * Fonction appelée par le Game Instance.
	 * On se sert de cette fonction pour déclarer les évènements
	 * que le plugin suivra.
	 * @param g instance de Game
	 */
	setGame: function(g) {
		this.oGame = g;
		this.oGame.registerPluginSignal('gamerestart', this);
	},
	

	/**
	 * Cette fonction sera copié dans le gestionnaire de controlleur ui
	 * Elle recois les commandes interface utilisateur
	 * déclenchée par oGame.ui_command('xxxx', param);
	 * les commande les plus commune sont 'on' et 'off'
	 * @param sCommand commande envoyée par l'instance game
	 * @param xParams divers paramètres 
	 */
	uiController: function(sCommand, xParams) {
		var w;
		switch (sCommand) {
			case 'on': // Ouverture de la fenetre / Mise à jour inventaire
				this.clear();
				this.centerWidget(this.declareWidget(new UI.StubWindow(xParams)));
				break;
				
			case 'off':
				w = this.getWidget();
				if (w.oPopup._bVisible) {
					w.oPopup.hide();
					return false;
				} else {
					this.oScreen.hide();
				}
				return true;
		}
	},

	
	/**
	 * entrer dans l'eau :
	 * enregistrer les évènements suivants :
	 *  timesecond pour pouvoir gérer l'apnée
	 *  exitlevel pour désactiver l'apnée quand on sort de l'eau
	 */
	waterIn: function() {
		if (this.bInWater) {
			return;
		}
		this.bInWater = true;
		this.oGame.registerPluginSignal('timesecond', this);
		this.oGame.registerPluginSignal('exitlevel', this);
		var p = this.oGame.oDungeon.getPlayerCreature();
		p.setBaseAttribute('maxapnea', this.MAX_APNEA);
		p.modifyAttribute('apnea', -p.getAttribute('apnea'));
		this.displayBubbles(0, this.MAX_APNEA);
	},

	/**
	 * Sortir de l'eau
	 * désenregistrer les évènements
	 */
	waterOut: function() {
		if (!this.bInWater) {
			return;
		}
		this.bInWater = false;
		this.oGame.unregisterPluginSignal('timesecond', this);
		this.oGame.unregisterPluginSignal('exitlevel', this);
		for (var x = 0; x < this.MAX_BUBBLES; ++x) {
			this.oGame.oHUD.printTile(11 + x, 0, 0);
		}
	},
	
	/**
	 * Respirer : remettre l'apnée à zéro
	 */
	breathe: function() {
		var p = this.oGame.oDungeon.getPlayerCreature();
		p.modifyAttribute('apnea', -p.getAttribute('apnea'));
		this.displayBubbles(0, this.MAX_APNEA);
		this.oGame.sys_flash(0x0044FF, 50, 10);
		var nBubbles = MathTools.rnd(0, 5);
		if (nBubbles < SOUNDS.AMB_BUBBLES.length) {
			this.oGame.sys_playSound(SOUNDS.AMB_BUBBLES[nBubbles]);
		}
	},

	/**
	 * Progression sous marine
	 * gérer l'apnée et les conséquences
	 */
	dive: function() {
		var g = this.oGame;
		var p = g.oDungeon.getPlayerCreature();
		var nApnea = p.getAttribute('apnea');
		var nMaxApnea = p.getAttribute('maxapnea');
		if (nApnea < nMaxApnea) {
			++nApnea;
			p.modifyAttribute('apnea', 1);
		} else {
			this.oGame.oDungeon.oEffectProcessor.damageCreature(p, this.APNEA_DAMAGE, '');
		}
		this.displayBubbles(nApnea, nMaxApnea);
	},
	
	/**
	 * Verifier si la créature est dans une zone de bulles
	 * @param oCreature
	 */
	checkAir: function() {
		var g = this.oGame;
		var p = g.getPlayer();
		var aSector = g.oRaycaster.oMobileSectors.get(p.xSector, p.ySector);
		var l = aSector.length;
		var o;
		for (var i = 0; i < l; ++i) {
			o = aSector[i];
			if (o.getData('bubbles')) {
				return true;
			}
		}
		return false;
	},
	
	/**
	 * Affichage de la jauge des bulles;
	 */
	displayBubbles: function(nApnea, nMaxApnea) {
		// affichage de la jauge d'apnée
		var nMaxBubbles = this.MAX_BUBBLES; 
		var nBubbles = (nMaxBubbles << 1) * (nMaxApnea - nApnea) / nMaxApnea | 0;
		var bPop = (nBubbles & 1) !== 0;
		nBubbles >>= 1;
		
		for (var x = 0; x < nBubbles; ++x) {
			this.oGame.oHUD.printTile(11 + x, 0, this.HUD_BUBBLE);
		}
		if (bPop) {
			this.oGame.oHUD.printTile(11 + x, 0, this.HUD_POP);
			++x;
		}
		while (x < nMaxBubbles) {
			this.oGame.oHUD.printTile(11 + x, 0, 0);
			++x;
		}
	},
	
	/** 
	 * Fonction évènementielle comme
	 * time, timesecond, key, block, ....
	 */
	
	exitlevel: function() {
		this.waterOut();
	},

	timesecond: function() {
		if (this.checkAir()) {
			this.breathe();
		} else {
			this.dive();
		}
	},
	
	block: function(nBlock) {
		if (nBlock === 129) {
			// la porte a été ouverte : EAU
			this.oGame.unregisterPluginSignal('block', this);
			this.oGame.oRaycaster.oEffects.addEffect(new GXFlood(this.oGame.oRaycaster));
			this.oGame.sys_playSound(SOUNDS.WATER_SPLASH);
			this.oGame.sys_playMusic(SOUNDS.MUSIC_UNDERWATER);
			this.waterIn();
		}
	},
	
	gamerestart: function() {
		this.waterOut();
	}
});
