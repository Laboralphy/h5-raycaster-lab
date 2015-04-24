/**
 * Classe de conception de l'aventure.
 * Ultra spécifique.
 * Permet de configurer les seed des niveau et d'assurer la cohérence entre les niveau
 * Permet de traiter certains évènement scénaristiques
 */

O2.createClass('Adventure', {
	
	oEvents: null,
	oVariables: null,
	
	
	AF_STORY_READ: 0,       // Scénario lu en début de partie
	
	/**
	 * Positionne un flag d'aventure à 1 ou 0 pour la créature
	 * Ce système permet de stocker des renseignement booléen en minimisant 
	 * la quantité de donnée qui devront être sauvegardées.
	 * @param oCreature GC.Creature
	 * @param nFlag numero du flag à modifier
	 * @param 
	 */
	setAdventureFlag: function(oCreature, nFlag, bFlag) {
		var n32 = nFlag >> 5;
		var nBit = nFlag & 31;

		var sFlag = 'f_' + n32.toString();
		var nValue = oCreature.getAttribute(sFlag);
		if (bFlag) {
			nValue |= 1 << nBit;
		} else {
			nValue &= 0xFFFFFFFF ^ (1 << nBit); 
		}
		oCreature.setBaseAttribute(sFlag, nValue);
	},
		
	/**
	 * Lecture d'un flag d'aventure de la créature
	 */
	getAdventureFlag: function(oCreature, nFlag) {
		var n32 = nFlag >> 5;
		var nBit = nFlag & 31;

		var sFlag = 'f_' + n32.toString();
		var nValue = oCreature.getAttribute(sFlag);
		return (nValue & (1 << nBit)); 
	},
	
	/** Définition d'un évènement associé au niveau de donjon spécifié
	 * @param d string nom du donjon
	 * @param f number niveau du donjon
	 * @param s string Event
	 * @param p string Procédure a appelé lorsque l'évènement se produit
	 */
	defineEvent: function(d, f, s, p) {
		if (this.oEvents === null) {
			this.oEvents = {};
		}
		if (!(d in this.oEvents)) {
			this.oEvents[d] = [];
		}
		if (this.oEvents[d][f] === undefined) {
			this.oEvents[d][f] = {};
		}
		this.oEvents[d][f][s] = p;
	},
	
	
	
	eventReadBookOfStory: function(oGame) {
		// verifier si le joueur à déja lu ce livre
		var oPlayer = oGame.oDungeon.getPlayerCreature();
		if (oPlayer.getAttribute('f_story') === 0) {
			oGame.oBookSystem.read('~book_of_the_story');
			oPlayer.setBaseAttribute('f_story', 1);
			oGame.setDoomloop('stateStoryBook');
		}
	},
	
	eventUnsealDoor: function(oGame, x, y) {
		var rc = oGame.oRaycaster;
		var h = rc.oHorde;
		var nHLen = h.getMobileCount();
		var iHorde, oMob, oCreature, oBP;
		var rcp = rc.nPlaneSpacing;
		var xBlock = x * rcp + (rcp >> 1);
		var yBlock = y * rcp + (rcp >> 1);
		for (iHorde = 1; iHorde < nHLen; iHorde++) {
			oMob = h.getMobile(iHorde);
			oCreature = oMob.getData('creature');
			oBP = oMob.getBlueprint();
			if (oBP && oBP.nType == RC.OBJECT_TYPE_MOB) {
				if (oCreature.getAttribute('f_boss')) {
					// c'est un boss !
					if (oCreature.getAttribute('dead') === 0) {
						// c'est un boss encore vivant -> la porte ne s'ouvrira pas
						oGame.sys_notify('door_sealed', [x, y]);
						oGame.sys_playSound(SOUNDS.DOOR_LOCKED, xBlock, yBlock);
						return;
					}
				}
			}
		}
		rc.setMapXY(x, y, rc.aWorld.walls.metacodes[LABY.BLOCK_ELEVATOR_DOOR_NEXT_UNSEALED]); // door_unlocked
		oGame.sys_notify('door_unsealed', [x, y]);
		oGame.sys_playSound(SOUNDS.DOOR_UNLOCKED, xBlock, yBlock);
		oGame.oDungeon.setAreaBlockProperty(x, y, LABY.BLOCK_ELEVATOR_DOOR_NEXT_UNSEALED);
	},
	
	eventGotRelic: function(oGame) {
		var nScore = oGame.oDungeon.getScore(oGame.oDungeon.getPlayerCreature());
		oGame.oDialogSystem.display(STRINGS._('~m_relic', [nScore.toString()]), [[STRINGS._('~key_endgame'), 5, oGame.sys_endGame]]);
	},
	
	eventEscapeGame: function(oGame) {
		oGame.sys_notify('cant_go_there');
	},
	
	/**
	 * Entrée dans un niveau sous marin.
	 * Activer l'effet de vision sous marine
	 */
	eventEnterUnderwaterLevel: function(oGame) {
		oGame.oRaycaster.oEffects.addEffect(new GXUnderwater(oGame.oRaycaster));
		oGame.oUnderwater.waterIn();
	},
	
	eventEnterValvedLevel: function(oGame) {
		oGame.registerPluginSignal('block', oGame.oUnderwater);
	},
	
	/**
	 * Pour tous les donjons et tous les niveaux
	 * fabrique une graine de génération aléatoire
	 * prenant en compte la graine initiale de configuration
	 * (la graine qui défini la taille du laby, l'algo etc...)
	 */
	seedLevels: function(d) {
		var iLevel, oDungeon, nLevelCount, sDungeon = '';
		for (sDungeon in d) {
			nLevelCount = d[sDungeon].length;
			for (iLevel = 0; iLevel < nLevelCount; iLevel++) {
				oDungeon = d[sDungeon][iLevel];
				oDungeon.seed = Math.random() * 0x10000000 | 0;
				if ('shops' in oDungeon) {
					oDungeon.options += '-s' + oDungeon.shops.length.toString();
				}
			}
		}
	},
	
	
	/** 
	 * Permet des calculer toutes les données qui ne sont aps statiques.
	 */
	config: function(d) {
		
		this.oEvents = {};
		
		var d1 = d.d1;
		var mines = d.mines;
		var medusa = d.medusa;
		
		
		if (this.oVariables === null) {
			this.oVariables = {
				portalToMines: MathTools.rnd(1, 2),
				portalToMedusa: 4
			};
		}
		
		this.seedLevels(d);
		
		////// FOREST ////// FOREST ////// FOREST ////// FOREST //////
		////// FOREST ////// FOREST ////// FOREST ////// FOREST //////
		////// FOREST ////// FOREST ////// FOREST ////// FOREST //////
		////// FOREST ////// FOREST ////// FOREST ////// FOREST //////
		////// FOREST ////// FOREST ////// FOREST ////// FOREST //////
		////// FOREST ////// FOREST ////// FOREST ////// FOREST //////

		this.defineEvent('forest', 0, 'enterLevel', 'eventReadBookOfStory');
		this.defineEvent('forest', 0, 'entranceSwitch', 'eventEscapeGame');


		
		////// D1 ////// D1 ////// D1 ////// D1 ////// D1 ////// D1 //////
		////// D1 ////// D1 ////// D1 ////// D1 ////// D1 ////// D1 //////
		////// D1 ////// D1 ////// D1 ////// D1 ////// D1 ////// D1 //////
		////// D1 ////// D1 ////// D1 ////// D1 ////// D1 ////// D1 //////
		////// D1 ////// D1 ////// D1 ////// D1 ////// D1 ////// D1 //////
		////// D1 ////// D1 ////// D1 ////// D1 ////// D1 ////// D1 //////

		// configuration du d1
		// A quel niveau se trouve le portail vers les mines ?
		var nPortalToMines = this.oVariables.portalToMines;
		d1[nPortalToMines].options += '-p1'; 
		d1[nPortalToMines].transit = { portal : 'mines' };
		

		// portail vers medusa
		var nPortalToMedusa = this.oVariables.portalToMedusa;
		d1[nPortalToMedusa].options += '-p1'; 
		d1[nPortalToMedusa].transit = { portal : 'medusa' };
		
		

		// niveau 5 : room du boss
		this.defineEvent('d1', 5, 'activateSealedDoor', 'eventUnsealDoor');
		


		////// TREASURE ROOM ////// TREASURE ROOM ////// TREASURE ROOM //////
		////// TREASURE ROOM ////// TREASURE ROOM ////// TREASURE ROOM //////
		////// TREASURE ROOM ////// TREASURE ROOM ////// TREASURE ROOM //////
		////// TREASURE ROOM ////// TREASURE ROOM ////// TREASURE ROOM //////
		////// TREASURE ROOM ////// TREASURE ROOM ////// TREASURE ROOM //////
		////// TREASURE ROOM ////// TREASURE ROOM ////// TREASURE ROOM //////
		
		this.defineEvent('treasure', 0, 'openRelicChest', 'eventGotRelic');
		
		
		////// MINES ////// MINES ////// MINES ////// MINES ////// MINES //////
		////// MINES ////// MINES ////// MINES ////// MINES ////// MINES //////
		////// MINES ////// MINES ////// MINES ////// MINES ////// MINES //////
		////// MINES ////// MINES ////// MINES ////// MINES ////// MINES //////
		////// MINES ////// MINES ////// MINES ////// MINES ////// MINES //////
		////// MINES ////// MINES ////// MINES ////// MINES ////// MINES //////
				
		// configuration des mines
		// configuration des transitions des mines
		mines[0].transit = { entrance : ['d1', nPortalToMines, 3] };
		mines[2].transit = { exit : ['d1', nPortalToMines, 3] };

		this.defineEvent('mines', 2, 'activateSealedDoor', 'eventUnsealDoor');
		
		////// MEDUSA ////// MEDUSA ////// MEDUSA ////// MEDUSA ////// MEDUSA //////
		////// MEDUSA ////// MEDUSA ////// MEDUSA ////// MEDUSA ////// MEDUSA //////
		////// MEDUSA ////// MEDUSA ////// MEDUSA ////// MEDUSA ////// MEDUSA //////
		////// MEDUSA ////// MEDUSA ////// MEDUSA ////// MEDUSA ////// MEDUSA //////
		////// MEDUSA ////// MEDUSA ////// MEDUSA ////// MEDUSA ////// MEDUSA //////
		////// MEDUSA ////// MEDUSA ////// MEDUSA ////// MEDUSA ////// MEDUSA //////
		
		// configuration des niveaux medusa
		medusa[0].transit = { entrance : ['d1', nPortalToMedusa, 3] };
		medusa[2].transit = { exit : ['d1', nPortalToMedusa, 3] };
		
		this.defineEvent('medusa', 0, 'enterLevel', 'eventEnterValvedLevel');
		this.defineEvent('medusa', 1, 'enterLevel', 'eventEnterUnderwaterLevel');
		this.defineEvent('medusa', 2, 'enterLevel', 'eventEnterUnderwaterLevel');
		this.defineEvent('medusa', 2, 'activateSealedDoor', 'eventUnsealDoor');
	},

	/** 
	 * Le joueur déclenche un évènement concernant le niveau en cours
	 * @param oInstance instance d'objet à utiliser pour le callback 
	 * @param s string event ('enter', 'exit', 'bosskill'...)
	 * @param d string nom du donjon
	 * @param f int numero de l'étage 
	 */
	notify: function(oGame, s) {
		var d = oGame.oDungeon.getPlayerLocationArea();
		var f = oGame.oDungeon.getPlayerLocationFloor();
		var aArgs = Array.prototype.slice.call(arguments, 2);
		aArgs.unshift(oGame);
		if (d in this.oEvents && this.oEvents[d][f] !== undefined && s in this.oEvents[d][f] && this.oEvents[d][f][s]) {
			this[this.oEvents[d][f][s]].apply(this, aArgs);
		}
	}
});
