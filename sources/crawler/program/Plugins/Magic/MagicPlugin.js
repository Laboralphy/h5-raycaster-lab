O2.createClass('MagicPlugin', {
	
	// affichage des cooldown
	// apprentissage
	
	oGame: null,
	oCanvas: null,
	oContext: null,
	
	bDisplayInvalid: true,
	oDisplay: null,
	sSelected: '',
	
	nTimeStop: 0,
	nTimeStopGameTime: 0,
	oTimeStopMobile: null,	
	oTimeStopGX: null,
	
	/**
	 * fonction macro
	 * Active ou sélectionne un sort
	 * en fonction des donnée défini dans le fichier de data
	 * @param b livre de sort, ensemble des sorts connus
	 * @param n numéro du sort activé
	 */
	triggerSpell: function(b, n) {
		var s = b[n];
		if (s === undefined) {
			return;
		}
		if (MAGIC_DATA[s].target) {
			this.select(s);
		} else {
			this.castSpell(this.oGame.getPlayer(), s);
		}
	},
	
	/**
	 * Réception des touche pressée par le joueur
	 */
	key: function(nKey) {
		var b = this.oGame.getPlayer().getData('creature').oExtraData.magic.book;
		switch (nKey) {
			case 3: // MOUSE.BUTTON.RIGHT
			case KEYS.ALPHANUM.V:
				if (this.sSelected) {
					this.castSpell(this.oGame.getPlayer(), this.sSelected);
				}
			break;
			
			case KEYS.F1:
				this.triggerSpell(b, 0);
			break;
			
			case KEYS.F2:
				this.triggerSpell(b, 1);
			break;
			
			case KEYS.F3:
				this.triggerSpell(b, 2);
			break;
			
			case KEYS.F4:
				this.triggerSpell(b, 3);
			break;

			case KEYS.F5:
				this.triggerSpell(b, 4);
			break;

			case KEYS.F6: 
				this.triggerSpell(b, 5);
			break;
			
			case KEYS.F7: 
				this.triggerSpell(b, 6);
			break;
			
			case KEYS.F8: 
				this.triggerSpell(b, 7);
			break;
			
			case KEYS.F9: 
				this.triggerSpell(b, 8);
			break;
			
			case KEYS.F10: 
				this.triggerSpell(b, 9);
			break;
			
			case KEYS.F11: 
				this.triggerSpell(b, 10);
			break;
			
		}
		return false;
	},
	
	/**
	 * Evènement qui survient lorsqu'on change de niveau
	 */
	exitlevel: function() {
		this.spellTimeRestart();
	},
	
	
	select: function(s) {
		if (s != this.sSelected) {
			this.sSelected = s;
			this.display();
		}
	},
	
	/**
	 * Examiner les dégât infliger à toute créature
	 * @param oAttacker Mobile qui a infligé les dégats
	 * @param oVictim Mobile qui a encaissé les dégâts
	 * @param nAmount quantité de dégâts
	 */
	damage: function(oAttacker, oVictim, nAmount) {
		if (oAttacker === null) {
			// pas d'aggresseur identifié ? bye
			return false;
		}
		
		// agresseur sous vampyre effect
		// transférer un certain nombre de HP de la victime à l'agresseur
		var oAttackerCreature = oAttacker.getData('creature');  
		var nVampyre = oAttackerCreature.getAttribute('vampyre');
		if (nVampyre > 0) {
			var ep = this.oGame.oDungeon.oEffectProcessor;
			var nHeal = Math.max(1, nAmount * ep.BUFF_FACTOR[nVampyre]) | 0;
			ep.healCreature(oAttackerCreature, nHeal);
		}
		
		return false;
	},
	
	timesecond: function() {
		if (this.bDisplayInvalid) {
			this.display();
		}
		if (this.nTimeStop) {
			this.nTimeStop -= 1;
			if (this.nTimeStop === 0) {
				// fin du timestop
				this.spellTimeRestart();				
			}
		}
		return false;
	},
	

	invalidateDisplay: function() {
		this.bDisplayInvalid = true;
	},
	
	/**
	 * Affichage HUD des sort (cooldown)
	 */
	display: function() {
		var xStart = 320;
		var wIcon = 48;
		// création du canvas en cas.
		if (this.oCanvas === null) {
			this.oCanvas = document.createElement('canvas');
			this.oCanvas.height = wIcon;
			this.oCanvas.width = 12 * this.oCanvas.height;
			this.oContext = this.oCanvas.getContext('2d');
		}
		var oCreature = this.oGame.oDungeon.getPlayerCreature();
		var aBook = oCreature.oExtraData.magic.book;
		var nSpellCount = aBook.length;
		var sSpell;
		var nCooldown;
		var x, y;
		var oIcons = this.oGame.oRaycaster.oHorde.oTiles.i_icons.oImage;
		if (!oIcons.complete) {
			return;
		}
		this.bDisplayInvalid = false;
		this.oContext.fillStyle = 'rgba(0, 0, 0, 0.666)';
		for (var iSpell = 0; iSpell < nSpellCount; iSpell += 1) {
			sSpell = aBook[iSpell];
			nCooldown = this.computeCooldown(oCreature, sSpell);
			x = iSpell * wIcon;
			this.oContext.drawImage(oIcons, ICONS[MAGIC_DATA[sSpell].icon] * wIcon, 0, wIcon, wIcon, x, 0, wIcon, wIcon);
			if (nCooldown < 0) {
				this.invalidateDisplay();
				y = wIcon - (wIcon * (MAGIC_DATA[sSpell].cooldown + nCooldown) / MAGIC_DATA[sSpell].cooldown | 0);
				this.oContext.fillRect(x, 0, wIcon, y);
			} else if (this.sSelected === sSpell) {
				var sGCO = this.oContext.globalCompositeOperation;
				this.oContext.globalCompositeOperation = 'lighter';
				this.oContext.drawImage(oIcons, ICONS[MAGIC_DATA[sSpell].icon] * wIcon, 0, wIcon, wIcon, x, 0, wIcon, wIcon);
				this.oContext.globalCompositeOperation = sGCO;
			}
		}
		var c = this.oGame.oHUD.oContext;
		var ca = this.oGame.oHUD.oCanvas;
		// déssiner les touches
		c.drawImage(this.oCanvas, 0, 0, this.oCanvas.width, this.oCanvas.height, 320, 0, this.oCanvas.width * 32 / 48 | 0, 32);
		c.clearRect(xStart, 32, ca.width - xStart, ca.height - 32);
		c.fillStyle = '#FFFFFF';
		c.font = 'monospace 12px bold';
		for (iSpell = 0; iSpell < nSpellCount; iSpell += 1) {
			c.fillText('F' + (iSpell + 1).toString(), 32 * iSpell + xStart + 10, 44);
		}
		this.oGame.oHUD._bInvalid = true;
	},
	
	computeCooldown: function(c, sSpell) {
		var m = c.oExtraData.magic.cooldown;
		var md = MAGIC_DATA[sSpell];
		var nCastTime = m[sSpell] || 0;
		if (nCastTime) {
			nCastTime += md.cooldown;
		}
		// verif cooldown
		return this.oGame.nTimeMs - nCastTime;
	},
	
	
	/**
	 * Lancement d'un sort.
	 * @param oWho Creature qui lance le sort
	 * @param sSpell identifiant du sort
	 */
	castSpell: function(oWho, sSpell) {
		// il faudrait vérifer que le sort est connu de la creature
		// on vérifie que le cooldown est ok.
		var c = oWho.getData('creature');
		var m = c.oExtraData.magic.cooldown;
		var md = MAGIC_DATA[sSpell];
		// verif cooldown
		if (this.computeCooldown(c, sSpell) < 0) {
			// cooldown encore actif
			this.oGame.sys_notify('magic_cooldown');
			return;
		}
		// verif magie
		if ((c.getAttribute('energy') - c.getAttribute('mp')) < md.mp) { 
			// pas assez de mana
			this.oGame.sys_notify('magic_oom');
			return;
		}
		if (this['spell' + sSpell](oWho)) {
			this.oGame.sys_playSound(SOUNDS[md.sound]);
			for (var i = 0; i < md.visual.length; i += 3) {
				this.oGame.sys_flash(md.visual[i], md.visual[i + 1], md.visual[i + 2]);
			}
			m[sSpell] = this.oGame.nTimeMs;
			this.invalidateDisplay();
			c.modifyAttribute('mp', md.mp);
		}
	},
	

	/**
	 * Effet du sort :
	 * Appliquer un effet sdrn au lanceur
	 * Cet effet ajoute +4 à l'attribut "vampyre" 
	 */
	spellDrainLife: function(oMobile) {
		// niveau
		this.oGame.gc_affect(oMobile, 'hsdrnEP', 1, 0); // initialement P
		return true;
	},
	
	/**
	 * Téléport
	 * Déplacement du joueur vers le mur situé en face de lui
	 * puis retournement à 180° pour éviter d'avoir le nez planté dans le mur
	 * désorientation des ennemis qui on pris le mobile pour cible.
	 */
	spellTeleport: function(oMobile) {
		// passage en éthéré
		oMobile.bEthereal = true;
		var nSize = oMobile.nSize; 
		oMobile.nSize = 0;
		oMobile.fSpeed = 16;
		// transport jusqu'a collision
		this.oGame.gc_visualEffect('o_teleport', oMobile.x, oMobile.y);
		var bCollision = false;
		do {
			oMobile.moveForward();
			bCollision = oMobile.oWallCollision.x || oMobile.oWallCollision.y;
			if (bCollision) {
				oMobile.rollbackXY();
			}
		} while (!bCollision);
		// frein et rotation
		oMobile.fTheta += PI;
		oMobile.fSpeed = 0;
		// correction de la position
		var ps = oMobile.oRaycaster.nPlaneSpacing;
		var ps2 = ps >> 1;
		oMobile.x = (oMobile.x / ps | 0) * ps + ps2; 		
		oMobile.y = (oMobile.y / ps | 0) * ps + ps2; 		
		// sortie de l'éthéré
		oMobile.bEthereal = false;
		oMobile.nSize = nSize;
		this.oGame.gc_visualEffect('o_teleport', oMobile.x, oMobile.y);
		// Désorientation des mobs
		this.spellForget(oMobile);
		return true;
	},
	
	/**
	 * Désorientation des ennemis qui ont pris le mobile pour cible
	 */
	spellForget: function(oMobile) {
		var g = this.oGame;
		var h = g.oRaycaster.oHorde;
		var nMobs = h.getMobileCount();
		var oMob;
		for (var iMob = 0; iMob < nMobs; iMob += 1) {
			oMob = h.getMobile(iMob);
			if (oMob.oThinker) {
				if (oMob.getType() == RC.OBJECT_TYPE_MOB) {
					if (oMob.oThinker.getTarget() == oMobile) {
						oMob.oThinker.setWanderMode();
					}
				}
			}
		}
		return true;
	},
	
	/**
	 * Ouverture de la porte devant soit
	 * Le sort est annulé si il n'y a aucune porte verrouillée devant soi
	 */
	spellKnock: function(oMobile) {
		var oDoorCellXY = oMobile.getFrontCellXY();
		if ('x' in oDoorCellXY && 'y' in oDoorCellXY) {
			var x = oDoorCellXY.x;
			var y = oDoorCellXY.y;
			switch (this.oGame.oDungeon.getAreaBlockProperty(x, y)) {
				case LABY.BLOCK_LOCKEDDOOR_0:
				case LABY.BLOCK_LOCKEDDOOR_1:
				case LABY.BLOCK_LOCKEDDOOR_2:
				case LABY.BLOCK_LOCKEDDOOR_3:
				case LABY.BLOCK_UNLOCKEDDOOR:
				case LABY.BLOCK_WATCH_DOOR_LOCKED:
					this.oGame.gc_unlockDoor(x, y);
					return true;
			}
		}
		this.oGame.sys_notify('magic_fail_knock');
		return false;
	},

	spellDeathSpell: function(oMobile) {
		// 1/ Rechercher la créature correspondant au mobile
		// 2/ Identifier son arme
		// 3/ Produire les projectiles associés à l'arme
		var oCreature = oMobile.getData('creature');
		var aMissiles = this.oGame.oDungeon.getWeaponMissileDefinition(SPELLS_DATA.mis_deathspell_1);
		var nMissiles = aMissiles.length;
		var oMissileDef, oMissile = null, sOptions;
		for (var iMis = 0; iMis < nMissiles; iMis++) {
			oMissileDef = aMissiles[iMis];
			// Creation missile
			oMissile = this.oGame.spawnMobile(oMissileDef.blueprint, oMobile.x, oMobile.y, oMobile.fTheta + oMissileDef.angle);
			// initialisation des paramètres
			oMissile.fSpeed = this.oGame.TIME_FACTOR * oMissile.getData('speed') / 1000;
			oMissile.oOwner = oMobile;
			sOptions = oMissileDef.options;
			// Peut-etre la créature est elle frappée de confusion ?
			if (oCreature.getAttribute('confused') > 0) {
				sOptions += 'r';
			}
			// traitement des options de trajectoire
			oMissile.oThinker.setOptions(sOptions);
			// ajout des effets
			oMissile.oThinker.setEffects(oMissileDef.effects, oMissileDef.chances, oCreature.getAttribute('power'));
			// réglage du thinker
			oMissile.oThinker.nStepSpeed = oMissile.getData('steps');
			oMissile.oThinker.nLifeOut = this.oGame.nTime + oMissile.getData('range');
			// mise à feu
			oMissile.oThinker.fire(oMobile);
		}
		var aSnd = oMissile.getData('sounds');
		this.oGame.sys_playSound(aSnd[0], oMobile.x, oMobile.y);
		
		return true;
	},
	

	/**
	 * Tracé de la carte du niveau sur un mur WALL
	 */
	spellMagicMapping: function(oMobile) {
		var oWallCellXY = oMobile.getFrontCellXY();
		if ('x' in oWallCellXY && 'y' in oWallCellXY) {
			var x = oWallCellXY.x;
			var y = oWallCellXY.y;
			if (this.oGame.oDungeon.getAreaBlockProperty(x, y) == LABY.BLOCK_WALL) {
				// dessiner la carte sur le mur
				var xMob = oMobile.xSector;
				var yMob = oMobile.ySector;
				var nSide = -1;
				// ou se trouve le mobile par rapport au mur
				if (xMob === (x - 1)) { // à gauche
					nSide = 0;
				} else if (xMob === (x + 1)) { // à droite
					nSide = 2;
				} else if (yMob === (y - 1)) { // en haut
					nSide = 3;
				} else if (yMob === (y + 1)) { // en bas
					nSide = 1;
				}					
				if (nSide >= 0) {
					var g = this.oGame;
					g.oRaycaster.cloneWall(x, y, nSide, function(rc, c, xBlock, yBlock, n) {
						var aWallStyles = ['#552200', '#663300', '#773300'];   
						var aVoidStyles = ['#FFFFFF', '#FFFFEE', '#FFFFDD'];   
						var oContext = c.getContext('2d');
						var wMap = 44;
						var oMap = O876.CanvasFactory.getCanvas();
						var wWall = rc.xTexture;
						var hWall = rc.yTexture;
						oMap.width = wMap;
						oMap.height = wMap;
						var xMap = (wWall - wMap) >> 1; 
						var yMap = (hWall - wMap) >> 1; 

						oContext.fillStyle = '#FFFFFF';
						oContext.strokeStyle = '#000000';
						oContext.fillRect(xMap, yMap, wMap, wMap);
						
						oContext.fillStyle = '#000000';
						var xi, yi;
						var xb, yb;
						for (yi = 0; yi < wMap; yi += 1) {
							for (xi = 0; xi < wMap; xi += 1) {
								xb = xi + (xBlock - (wMap >> 1));
								yb = yi + (yBlock - (wMap >> 1));
								if (rc.insideMap(xb) && rc.insideMap(yb)) {
									switch (g.oDungeon.getAreaBlockProperty(xb, yb)) {
										case LABY.BLOCK_VOID:
										case LABY.BLOCK_MOB_LEVEL_0:
										case LABY.BLOCK_MOB_LEVEL_1:
										case LABY.BLOCK_MOB_LEVEL_2:
										case LABY.BLOCK_MOB_LEVEL_3:
										case LABY.BLOCK_MOB_LEVEL_4:
										case LABY.BLOCK_MOB_LEVEL_5:
										case LABY.BLOCK_MOB_LEVEL_6:
										case LABY.BLOCK_MOB_LEVEL_7:
										case LABY.BLOCK_MOB_LEVEL_8:
										case LABY.BLOCK_MOB_LEVEL_9:
										case LABY.BLOCK_MOB_LEVEL_X:
											// la case est considérée comme vide
											oContext.fillStyle = MathTools.rndChoose(aVoidStyles);
											break;
										
										case LABY.BLOCK_DOOR:
										case LABY.BLOCK_WATCH_DOOR_LOCKED:
										case LABY.BLOCK_ELEVATOR_DOOR_PREV:
										case LABY.BLOCK_ELEVATOR_DOOR_NEXT_SEALED:
										case LABY.BLOCK_ELEVATOR_DOOR_NEXT_UNSEALED:
											// la case est considérée comme "porte"
											oContext.fillStyle = '#888888';
											break;
											
										case LABY.BLOCK_KEY_0:
											oContext.fillStyle = '#0000FF';
											break;
	
										case LABY.BLOCK_KEY_1:
											oContext.fillStyle = '#FF0000';
											break;
	
										case LABY.BLOCK_KEY_2:
											oContext.fillStyle = '#00FF00';
											break;
	
										case LABY.BLOCK_KEY_3:
											oContext.fillStyle = '#FFFF00';
											break;
											
										case LABY.BLOCK_LOCKEDDOOR_0:
											oContext.fillStyle = '#0000AA';
											break;
	
										case LABY.BLOCK_LOCKEDDOOR_1:
											oContext.fillStyle = '#AA0000';
											break;
	
										case LABY.BLOCK_LOCKEDDOOR_2:
											oContext.fillStyle = '#00AA00';
											break;
	
										case LABY.BLOCK_LOCKEDDOOR_3:
											oContext.fillStyle = '#AAAA00';
											break;
									
										case LABY.BLOCK_SECRET:
										case LABY.BLOCK_CURTAIN:
											oContext.fillStyle = '#FF00FF';
											break;
											
										case LABY.BLOCK_TREASURE:
										case LABY.BLOCK_WATCH_TREASURE:
										case LABY.BLOCK_SHOP:
											oContext.fillStyle = '#FFAA00';
											break;
											
										case LABY.BLOCK_ELEVATOR_EXIT:
										case LABY.BLOCK_ELEVATOR_ENTRANCE:
										case LABY.BLOCK_ELEVATOR_PORTAL:
											oContext.fillStyle = '#00FFFF';
											break;
										
										default:
											oContext.fillStyle = MathTools.rndChoose(aWallStyles);
											break;
									}
								} else {
									oContext.fillStyle = MathTools.rndChoose(aWallStyles);
								}
								oContext.fillRect(xi + xMap, yi + yMap, 1, 1);
							}
						}
						oContext.beginPath();
						oContext.lineWidth = 1;
						oContext.strokeStyle = 'rgba(255, 0, 0, 0.666)';
						oContext.moveTo(xMap + (wMap >> 1) - 3, yMap + (wMap >> 1) - 3);
						oContext.lineTo(xMap + (wMap >> 1) + 3, yMap + (wMap >> 1) + 3);
						oContext.stroke();
						oContext.beginPath();
						oContext.moveTo(xMap + (wMap >> 1) + 3, yMap + (wMap >> 1) - 3);
						oContext.lineTo(xMap + (wMap >> 1) - 3, yMap + (wMap >> 1) + 3);
						oContext.stroke();
						oContext.lineWidth = 2;
						oContext.strokeStyle = 'rgb(64, 64, 0)';
						oContext.strokeRect(xMap - 1, yMap - 1, wMap + 2, wMap + 2);
					});
					return true;
				}
			}
		}
		this.oGame.sys_notify('magic_fail_magicmapping');
		return false;
	},
	
	/**
	 * Invocation de nourriture en face du joueur
	 */
	spellSummonFood: function(oMobile) {
		var oWallCellXY = oMobile.getFrontCellXY();
		if ('x' in oWallCellXY && 'y' in oWallCellXY) {
			var x = oWallCellXY.x;
			var y = oWallCellXY.y;
			switch (this.oGame.oDungeon.getAreaBlockProperty(x, y)) {
				case LABY.BLOCK_VOID:
				case LABY.BLOCK_MOB_LEVEL_0:
				case LABY.BLOCK_MOB_LEVEL_1:
				case LABY.BLOCK_MOB_LEVEL_2:
				case LABY.BLOCK_MOB_LEVEL_3:
				case LABY.BLOCK_MOB_LEVEL_4:
				case LABY.BLOCK_MOB_LEVEL_5:
				case LABY.BLOCK_MOB_LEVEL_6:
				case LABY.BLOCK_MOB_LEVEL_7:
				case LABY.BLOCK_MOB_LEVEL_8:
				case LABY.BLOCK_MOB_LEVEL_9:
				case LABY.BLOCK_MOB_LEVEL_X:
					this.oGame.gc_dropLoot('spell_summon_food', x, y);
					this.oGame.gc_spawnLootBag(4, x, y);
					var ps = this.oGame.oRaycaster.nPlaneSpacing;
					var ps2 = ps >> 1;
					this.oGame.gc_visualEffect('o_boom', x * ps + ps2, y * ps + ps2);
					return true;
			}
		}
		this.oGame.sys_notify('magic_fail_summonfood');
		return false;
	},
	
	/**
	 * Applique un effet de reflexion de missile
	 */
	spellReflect: function(oMobile) {
		this.oGame.gc_affect(oMobile, 'hbrefCP', 1, 0);
		return true;
	},
	
	/**
	 * Modifie les donnée visuelle du niveau pour augmenter la luminosité
	 */
	spellLight: function(oMobile) {
		var r = this.oGame.oRaycaster;
		r.oVisual.light = 200; 
		r.oVisual.fogDistance = 1; 
		r.buildGradient();
		return true;
	},
	
	/**
	 * Fonction remplaçant le thinker de la horde
	 * lors du time stop
	 */
	timeStopHordeThinker: function() {
		var oMobile = this.__timestopMobile;
		oMobile.think();
		if (!oMobile.bActive) {
			this.unlinkMobile(oMobile);
			this.oMobileDispenser.pushMobile(oMobile.oSprite.oBlueprint.sId, oMobile);
		}
	},
	
	timeStopAnimator: function(nInc) {
		return this.nIndex + this.nStart;
	},
	
	timeStopTextureAnimation: function() {
	},

	/**
	 * Reprise du time stop
	 */
	spellTimeRestart: function() {
		// aucun effet si pas de timestop
		if (!this.oTimeStopMobile) {
			return false;
		}
		// réactiver le thinker de la horde
		var h = this.oGame.oRaycaster.oHorde;
		h.think = this.__timestopThink;
		h.__timestopMobile = null;
		this.__timestopThink = null;		

		// réactiver les fonction d'animation
		O876_Raycaster.Animation.prototype.animate = O876_Raycaster.Animation.prototype.__timestopAnimate;
		O876_Raycaster.Animation.prototype.__timestopAnimate = null;
		O876_Raycaster.Raycaster.prototype.textureAnimation = O876_Raycaster.Raycaster.prototype.__timestopAnimate;
		O876_Raycaster.Raycaster.prototype.__timestopAnimate = null; 

		// restauration des chronomètres
		this.oGame.nTime = this.nTimeStopGameTime;
		this.oGame.nTimeMs = this.nTimeStopGameTime * this.oGame.oRaycaster.TIME_FACTOR;
		this.oTimeStopMobile.getData('creature').oExtraData.retrigger = 0;
		this.nTimeStop = 0;
		
		this.oTimeStopMobile = null;
		this.oTimeStopGX.terminate();
		this.oTimeStopGX = null;
		
		this.oGame.sys_flash(0xFFFFFF, 50, 5);
	},

	__timestopThink: null,
	
	spellTimeStop: function(oMobile) {
		if (this.oTimeStopMobile) {
			return false;
		}
		// désactiver le thinker de la horde
		var h = this.oGame.oRaycaster.oHorde;
		h.__timestopMobile = oMobile;
		this.__timestopThink = h.think;
		h.think = this.timeStopHordeThinker;
		
		// Désactiver les fonction d'animation
		O876_Raycaster.Animation.prototype.__timestopAnimate = O876_Raycaster.Animation.prototype.animate;
		O876_Raycaster.Animation.prototype.animate = this.timeStopAnimator;
		O876_Raycaster.Raycaster.prototype.__timestopAnimate = O876_Raycaster.Raycaster.prototype.textureAnimation;
		O876_Raycaster.Raycaster.prototype.textureAnimation = this.timeStopTextureAnimation; 
		

		// mémoriser le time stopper
		this.oTimeStopMobile = oMobile;
		
		// 9 secondes au compteur
		this.nTimeStop = 9;
		// mémoriser l'ancien gametime
		this.nTimeStopGameTime = this.oGame.nTime;
		// effet noir et blanc
		this.oGame.oRaycaster.oEffects.addEffect(this.oTimeStopGX = new GXTimeStop(this.oGame.oRaycaster));
		return true;

	},
	
	// prochain sort
	// - leure immobile pour encaisser les tir à la place du joueur
	// - poster de pinup qui déroute les adversaires
	// - portail d'aspiration des mobs.
	// - 
	
	setGame: function(g) {
		this.oGame = g;
		this.oGame.registerPluginSignal('key', this);
		this.oGame.registerPluginSignal('damage', this);
		this.oGame.registerPluginSignal('timesecond', this);
		this.oGame.registerPluginSignal('exitlevel', this);
	}
});
