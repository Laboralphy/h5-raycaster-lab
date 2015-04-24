O2.extendClass('CutsceneIntro', 'Cutscene', {
	
	fFade: -0.05,
	fAlpha: 1,
	
	sPhase: 'phaseInit',
	
	nLabyWidth: 0,
	nLabySize: 0,
	
	
	__construct: function() {
		__inherited();
	
		this.nLabySize = this.oRaycaster.nMapSize;
		this.oCameraThinker = this.oRaycaster.oCamera.oThinker;
		this.oCameraThinker.oCutscene = this;
	},
	
	onSoundEvent: function(sSound) {
	},
	
	
	getLevelData: function() {
		return {
			map: [],
			walls: GFX_DATA.textures.t_forest,
			visual: GFX_DATA.visuals.forest,
			startpoint: {
				x: 320,
				y: 416,
				angle: 0
			},
			tiles: {
				m_myco: MONSTERS_TILES.m_myco,
				m_warlockboss: MONSTERS_TILES.m_warlockboss,
				m_adventurer: MONSTERS_TILES.m_adventurer,
				o_boom: GFX_DATA.tiles.o_boom,
				o_chicken: GFX_DATA.tiles.o_chicken,
				o_tome: GFX_DATA.tiles.o_tome
			},
			blueprints: {
				m_myco: { 
					type: RC.OBJECT_TYPE_MOB, 
					tile: 'm_myco', 
					width: 5, 
					height: 64, 
					thinker: 'O876_Raycaster.Linear', 
					fx: 0, 
					data: { 
						vitality: 4, 
						speed: 30, 
						weapon: 'dag_brass', 
						flags: '0' 
					} 
				},
				m_warlockboss: { 
					type: RC.OBJECT_TYPE_MOB, 
					tile: 'm_warlockboss', 
					width: 5, 
					height: 64, 
					thinker: 'O876_Raycaster.Linear', 
					fx: 2, 
					data: { 
						vitality: 4, 
						speed: 30, 
						weapon: 'wand_warlock_1', 
						flags: '0' 
					} 
				},
				m_adventurer: { 
					type: RC.OBJECT_TYPE_MOB, 
					tile: 'm_adventurer', 
					width: 5, 
					height: 64, 
					thinker: 'O876_Raycaster.Linear', 
					fx: 0, 
					data: { 
						vitality: 4, 
						speed: 30, 
						weapon: 'wand_warlock_1', 
						flags: '0' 
					} 
				},
				o_boom: {
					type: RC.OBJECT_TYPE_PLACEABLE,
					tile: 'o_boom',
					width: 1,
					height: 96,
					thinker: 'O876_Raycaster.Linear',
					fx: 0,
					data: {}
				},
				o_tome: {
					type: RC.OBJECT_TYPE_PLACEABLE,
					tile: 'o_tome',
					width: 1,
					height: 64,
					thinker: 'O876_Raycaster.NonLinear',
					fx: 0,
					data: {}
				},
				o_chicken: {
					type: RC.OBJECT_TYPE_PLACEABLE,
					tile: 'o_chicken',
					width: 1,
					height: 64,
					thinker: 'O876_Raycaster.Linear',
					fx: 0,
					data: {}
				}
			},
			objects: [{
				blueprint: 'm_adventurer',
				x: 64 * 8 + 32,
				y: 64 * 18 + 32,
				angle: PI / 2
			}, {
				blueprint: 'm_warlockboss',
				x: 64 * 9 + 32,
				y: 64 * 18 + 32,
				angle: PI / 2
			}, {
				blueprint: 'm_myco',
				x: 64 * 5 + 32,
				y: 64 * 18 + 32,
				angle: PI / 2
			}, {
				blueprint: 'm_myco',
				x: 64 * 6 + 32,
				y: 64 * 18 + 32,
				angle: PI / 2
			}, {
				blueprint: 'm_myco',
				x: 64 * 7 + 32,
				y: 64 * 18 + 32,
				angle: PI / 2
			}, {
				blueprint: 'm_myco',
				x: 64 * 8 + 32,
				y: 64 * 18 + 32,
				angle: PI / 2
			}, {
				blueprint: 'o_chicken',
				x: 64 * 9 + 32,
				y: 64 * 18 + 32,
				angle: 0
			}, {
				blueprint: 'o_boom',
				x: 64 * 10 + 32,
				y: 64 * 18 + 32,
				angle: 0
			}, {
				blueprint: 'o_tome',
				x: 64 * 11 + 32,
				y: 64 * 18 + 32,
				angle: 0
			}]
		};
	},
	
	getLabyMap: function() {
		return [//     1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23
				[160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160],
				[160,163,160,163,160,162,160,162,160,162,160,163,160,162,160,162,160,162,160,163,160,162,160,163,160],
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],  //  2
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],  //  3
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],  //  4
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],  //  5
				[160,160,160,160,160,  0,160,160,160,160,160,160,160,160,160,160,160,  0,160,160,160,160,160,160,160],  //  6
				[160,163,160,163,160,  0,160,162,160,162,160,163,160,162,160,162,160,  0,160,163,160,162,160,163,160],  //  7
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],  //  8
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],  //  9
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],  // 10
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],
				[160,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,160],
				[160,162,160,163,160,162,160,163,160,162,160,162,160,163,160,163,160,160,160,160,160,131,160,160,160],
				[160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160,160]
			];
	},
	
	onRender: function() {
		this[this.sPhase]();
		// dark veil
		if (this.fAlpha) {
			this.oRenderContext.fillStyle = 'rgba(0, 0, 0, ' + this.fAlpha + ')';
			this.oRenderContext.fillRect(this.xRC, this.yRC, this.oRCCanvas.width, this.oRCCanvas.height);
		}
		if (this.fFade) {
			this.fAlpha += this.fFade;
			if (this.fAlpha < 0) {
				this.fAlpha = 0;
				this.fFade = 0;
			}
			if (this.fAlpha > 1) {
				this.fAlpha = 1;
				this.fFade = 0;
			}
		}
	},
	
	setActorMove: function(iActor, x, y, a, dx, dy, t, nAnim, pOnStop) {
		var oActor = this.oRaycaster.oHorde.getMobile(iActor);
		
		var oThinker = oActor.oThinker;
		
		if (x !== null && x !== undefined) {
			x = this.oRaycaster.nPlaneSpacing * x + (this.oRaycaster.nPlaneSpacing >> 1) | 0;
		} 
		if (y !== null && y !== undefined) {
			y = this.oRaycaster.nPlaneSpacing * y + (this.oRaycaster.nPlaneSpacing >> 1) | 0;
		}
		oThinker.setMove(x, y, a, dx, dy, t);
		if (nAnim !== null && nAnim !== undefined) {
			oActor.oSprite.playAnimationType(nAnim, true);
		}
		if (pOnStop !== null && pOnStop !== undefined) {
			oThinker.thinkStop = pOnStop;
		} else {
			oThinker.thinkStop = this.doNothing;
		}
		oThinker.think = oThinker.thinkInit;
		oThinker.think();
	},
	
	setActorNonLinearMove: function(iActor, x, y, a, dx, dy, t, nAnim, pOnStop) {
		var oActor = this.oRaycaster.oHorde.getMobile(iActor);
		
		var oThinker = oActor.oThinker;
		
		x = this.oRaycaster.nPlaneSpacing * x + (this.oRaycaster.nPlaneSpacing >> 1) | 0;
		y = this.oRaycaster.nPlaneSpacing * y + (this.oRaycaster.nPlaneSpacing >> 1) | 0;
		dx = this.oRaycaster.nPlaneSpacing * dx + (this.oRaycaster.nPlaneSpacing >> 1) | 0;
		dy = this.oRaycaster.nPlaneSpacing * dy + (this.oRaycaster.nPlaneSpacing >> 1) | 0;

		oThinker.setMove(x, y, a, dx, dy, t);
		if (nAnim !== null && nAnim !== undefined) {
			oActor.oSprite.playAnimationType(nAnim);
		}
		if (pOnStop !== null && pOnStop !== undefined) {
			oThinker.thinkStop = pOnStop;
		} else {
			oThinker.thinkStop = this.doNothing;
		}
		oThinker.think = oThinker.thinkInit;
		oThinker.think();
	},
	
	setCameraMove: function (x, y, a, dx, dy, t, pOnStop) {
		this.setActorMove(0, x, y, a, dx, dy, t, null, pOnStop);
	},
	
	
	wait: function(nTime, pEvent) {
		this.setCameraMove(null, null, null, null, null, nTime, pEvent);		
	},
	
	
	
	
	
	////// DO ACTION - this = thinker ////// DO ACTION - this = thinker ////// DO ACTION - this = thinker //////
	////// DO ACTION - this = thinker ////// DO ACTION - this = thinker ////// DO ACTION - this = thinker //////
	////// DO ACTION - this = thinker ////// DO ACTION - this = thinker ////// DO ACTION - this = thinker //////
	////// DO ACTION - this = thinker ////// DO ACTION - this = thinker ////// DO ACTION - this = thinker //////
	////// DO ACTION - this = thinker ////// DO ACTION - this = thinker ////// DO ACTION - this = thinker //////
	////// DO ACTION - this = thinker ////// DO ACTION - this = thinker ////// DO ACTION - this = thinker //////
	
	doNothing: function() {
	},
	
	doStandAnimation: function() {
		this.oMobile.oSprite.playAnimationType(0);
		this.think = this.thinkIdle;
	},
	
	doVanish: function() {
		this.oMobile.oSprite.bVisible = false;
		this.think = this.thinkIdle;
	},
	
	
	
	////// EVENT - this = thinker ////// EVENT - this = thinker ////// EVENT - this = thinker //////
	////// EVENT - this = thinker ////// EVENT - this = thinker ////// EVENT - this = thinker //////
	////// EVENT - this = thinker ////// EVENT - this = thinker ////// EVENT - this = thinker //////
	////// EVENT - this = thinker ////// EVENT - this = thinker ////// EVENT - this = thinker //////
	////// EVENT - this = thinker ////// EVENT - this = thinker ////// EVENT - this = thinker //////
	////// EVENT - this = thinker ////// EVENT - this = thinker ////// EVENT - this = thinker //////
	
	
	
	
	// adv commence à se perdre il prend le mauvais chemin
	eventGoingWrongWay: function() {
		this.oCutscene.setActorMove(1, null, null, 3 * PI / 2, 0, -2, 500);
		this.oCutscene.setCameraMove(null, null, null, 0, -2, 3 * 64 / 2, this.oCutscene.eventGoingWrongWayLookLeft);
	},
	
	// adv check le chemin à gauche
	eventGoingWrongWayLookLeft: function() {
		this.oCutscene.setActorMove(1, null, null, PI, 0, 0, 500, 0);
		this.oCutscene.setCameraMove(null, null, null, 0, 0, 15, this.oCutscene.eventGoingWrongWayLookRight);
	},
	
	// adv check le chemin à gauche
	eventGoingWrongWayLookRight: function() {
		this.oCutscene.setActorMove(1, null, null, 0, 0, 0, 500);
		this.oCutscene.wait(25, this.oCutscene.eventGoingWrongWayLookLeft2);
	},

	// adv check le chemin à gauche
	eventGoingWrongWayLookLeft2: function() {
		this.oCutscene.setActorMove(1, null, null, PI, 0, 0, 500, 0);
		this.oCutscene.wait(60, this.oCutscene.eventGoingWrongWayLookForth);
	},
	
	// adv check le chemin à gauche
	eventGoingWrongWayLookForth: function() {
		this.oCutscene.setActorMove(1, null, null, PI / 2, 0, 0, 500);
		this.oCutscene.wait(60, this.oCutscene.eventGoingWrongWayComeBack);
	},

	// adv check le chemin à gauche
	eventGoingWrongWayComeBack: function() {
		this.oCutscene.setActorMove(1, null, null, PI / 2, 0, 2, 500, 1);
		this.oCutscene.setCameraMove(null, null, null, 0, 2, 3 * 64 / 2, this.oCutscene.eventOnTheRoadAgain);
	},
	
	eventOnTheRoadAgain: function() {
		this.oCutscene.setActorMove(1, null, null, 0, 2, 0, 500);
		this.oCutscene.setCameraMove(null, null, null, 2, 0, 3 * 64 / 2, this.oCutscene.eventWaitEmbush);
	},
	
	
	eventWaitEmbush: function() {
		this.oCutscene.wait(10, this.oCutscene.eventEmbush);
		this.oCutscene.setActorMove(1, null, null, 0.4, 0, 0, 0, 0);
	},
	
	eventEmbush: function() {
		this.oCutscene.setActorMove(3, 5.3, 7.8, 0, 8, 0, 8, 1, this.oCutscene.doStandAnimation);
		this.oCutscene.setActorMove(4, 5, 8.3, -0.5, 8, 0, 18, 1, this.oCutscene.doStandAnimation);
		this.oCutscene.setActorMove(5, 10, 7.8, PI * (0.9), -8, 0, 5, 1, this.oCutscene.doStandAnimation);
		this.oCutscene.setCameraMove(null, null, null, 0, 0, 10, this.oCutscene.eventWaitEmbush2);
	},
	
	eventWaitEmbush2: function() {
		this.oCutscene.wait(30, this.oCutscene.eventWarlockZoom);
	},
	
	eventWarlockZoom: function() {
		this.oCutscene.setCameraMove(null, null, null, 4, -2, 20, this.oCutscene.eventWarlockSpeaks);
	},
	
	eventWarlockSpeaks: function() {
		var nTime = this.oCutscene.popup(STRINGS._('~cs0_ambush0'));
		this.oCutscene.setActorMove(2, null, null, null, null, null, 10, 1, this.oCutscene.doStandAnimation);
		this.oCutscene.setCameraMove(null, null, null, 0, 0, nTime + 10, this.oCutscene.eventAdvZoom);
	},
	
	eventAdvZoom: function() {
		this.oCutscene.setCameraMove(null, null, null, -8, 0, 10, this.oCutscene.eventAdvSpeaks);
	},
	
	eventAdvSpeaks: function() {
		var nTime = this.oCutscene.popup(STRINGS._('~cs0_ambush1'));
		this.oCutscene.setCameraMove(null, null, null, 0, 0, nTime + 10, this.oCutscene.eventWarlockZoom2);
	},
	
	eventWarlockZoom2: function() {
		this.oCutscene.setCameraMove(null, null, null, 8, 0, 10, this.oCutscene.eventWarlockSpeaks2);
	},

	eventWarlockSpeaks2: function() {
		var nTime = this.oCutscene.popup(STRINGS._('~cs0_ambush2'));
		this.oCutscene.setActorMove(2, null, null, null, null, null, 10, 1, this.oCutscene.doStandAnimation);
		this.oCutscene.setCameraMove(null, null, null, 0, 0, nTime + 10, this.oCutscene.eventUnzoom);
	},
	
	eventUnzoom: function() {
		this.oCutscene.setCameraMove(null, null, null, -4, 2, 20, this.oCutscene.eventWarlockAttacks);
	},
	
	eventWarlockAttacks: function() {
		this.oCutscene.onSoundEvent('hit_spell0');
		this.oCutscene.setActorMove(2, null, null, null, null, null, 5, 1, this.oCutscene.doStandAnimation);
		this.oCutscene.setActorMove(8, 8, 8.1, 0, 0, 0, 0, 0); // boom
		this.oCutscene.setActorMove(7, 8, 8, 0, 0, 0, 0, 0);
		this.oCutscene.setActorMove(1, null, 3);
		this.oCutscene.setCameraMove(null, null, null, 0, 0, 25, this.oCutscene.eventBookToWarlock);
	},
	
	eventBookToWarlock: function() {
		this.oCutscene.onSoundEvent('m_chicken0');
		this.oCutscene.setActorNonLinearMove(9, 8, 8, 0, 10, 8, 64, 0, this.oCutscene.doVanish);
		this.oCutscene.setCameraMove(null, null, null, 0, 0, 25, this.oCutscene.eventWarlockLaughter);
	},
	
	eventWarlockLaughter: function() {
		var nTime = this.oCutscene.popup(STRINGS._('~cs0_ambush3'));
		this.oCutscene.setActorMove(2, null, null, null, null, null, 10, 1, this.oCutscene.doStandAnimation);
		this.oCutscene.setCameraMove(null, null, null, 0, 0, nTime + 10, this.oCutscene.eventWarlockLeaves);
	},
	
	eventWarlockLeaves: function() {
		this.oCutscene.setActorMove(2, null, null, 0, 4, 0, 100, 1, this.oCutscene.doStandAnimation);
		this.oCutscene.wait(10, this.oCutscene.eventMycosLeave);
	},
	
	eventMycosLeave: function() {
		this.oCutscene.setActorMove(3, null, null, PI, -4, 0, 100, 1, this.oCutscene.doStandAnimation);
		this.oCutscene.setActorMove(4, null, null, PI, -4, 0, 100, 1, this.oCutscene.doStandAnimation);
		this.oCutscene.wait(50, this.oCutscene.eventChickenRuns);
	},
	
	eventChickenRuns: function() {
		this.oCutscene.onSoundEvent('m_chicken1');
		this.oCutscene.setActorMove(7, null, null, null, -1, 0, 64, 3);
		this.oCutscene.setActorMove(5, null, null, null, -1.5, 1, 15, 1, this.oCutscene.doStandAnimation);
		this.oCutscene.wait(15, this.oCutscene.eventChickenRuns2);
	},
	
	eventChickenRuns2: function() {
		this.oCutscene.setActorMove(5, null, null, null, -1.5, 0, 49, 1, this.oCutscene.doStandAnimation);
		this.oCutscene.wait(49, this.oCutscene.eventAdvBack);
	},
	
	eventAdvBack: function() {
		this.oCutscene.onSoundEvent('hit_spell0');
		this.oCutscene.setActorMove(8, 7, 8.1, 0, 0, 0, 100, 0); // boom
		//this.oCutscene.setActorMove(8, 7, 8.1, 0, 0, 0, 100, 1);
		this.oCutscene.setActorMove(7, null, 3);
		this.oCutscene.setActorMove(1, 7, 8, 0.8 * PI, 0, 0, 0, 0);
		this.oCutscene.wait(20, this.oCutscene.eventAdvPayBack);
	},
	
	eventAdvPayBack: function() {
		this.oCutscene.setActorMove(5, null, null, null, 0, 0, 0, 0);
		this.oCutscene.wait(20, this.oCutscene.eventMycoFlees);
	},
		
	eventMycoFlees: function() {
		this.oCutscene.setActorMove(1, null, null, 0, 2, 0, 10, 1, this.oCutscene.doStandAnimation);
		this.oCutscene.setActorMove(5, null, null, 0, 6, 0, 500, 1);
		this.oCutscene.wait(50, this.oCutscene.eventAngryAdvZoom);
	},
	
	eventAngryAdvZoom: function() {
		this.oCutscene.popup(STRINGS._('~cs0_advangry0'));
		this.oCutscene.setCameraMove(null, null, null, -2, -2, 32, this.oCutscene.eventAngryAdvSpeaks);
	},
	
	eventAngryAdvSpeaks: function() {
		var nTime = 0;
		nTime += this.oCutscene.popup(STRINGS._('~cs0_advangry1'), nTime) + 10;
		nTime += this.oCutscene.popup(STRINGS._('~cs0_advangry2'), nTime) + 10;
		this.oCutscene.setCameraMove(null, null, null, 0, -0.25, nTime, this.oCutscene.eventAdvFaceCamera);
	},
	
	eventAdvFaceCamera: function() {
		this.oCutscene.setActorMove(1, null, null, 0.25 * PI, 0, 0, 10, 0, this.oCutscene.doStandAnimation);
		this.oCutscene.setCameraMove(null, null, null, 0, 0, 3, this.oCutscene.eventItsWar);
	},
	
	eventItsWar: function() {
		this.oCutscene.setActorMove(1, null, null, 0.5 * PI, 0, 0, 10, 0, this.oCutscene.doStandAnimation);
		var nTime = this.oCutscene.popup(STRINGS._('~cs0_advangry3'), 10);
		this.oCutscene.setCameraMove(null, null, null, 0, 0, nTime * 2, this.oCutscene.eventEnd);
	},
		
	eventEnd: function() {
		this.oCutscene.end();
	},
	
	
	// FINISH
	end: function() {
		this.sPhase = 'phaseFinish';
	},
	
	hasEnded: function() {
		return this.sPhase === 'phaseFinish';
	},
	
	
	
	
	
	
	////// PHASES ////// PHASES ////// PHASES ////// PHASES ////// PHASES ////// PHASES //////
	////// PHASES ////// PHASES ////// PHASES ////// PHASES ////// PHASES ////// PHASES //////
	////// PHASES ////// PHASES ////// PHASES ////// PHASES ////// PHASES ////// PHASES //////
	////// PHASES ////// PHASES ////// PHASES ////// PHASES ////// PHASES ////// PHASES //////
	////// PHASES ////// PHASES ////// PHASES ////// PHASES ////// PHASES ////// PHASES //////
	////// PHASES ////// PHASES ////// PHASES ////// PHASES ////// PHASES ////// PHASES //////
	
	
	phaseInit: function() {
		// visuel
		this.fFade = -0.05;
		this.fAlpha = 1;
		var t = this.oCameraThinker;
		t.oRaycaster = this.oRaycaster;
	
		// placement camera
		this.setActorMove(0, 2, 10.5, 3 * PI / 2, 2, 0, 96, null, this.eventGoingWrongWay);
		
		this.setActorMove(1, 2, 8, 0, 2, 0, 500, 1);
		this.setActorMove(2, 10, 8, PI * (0.9), 0, 0, 500, 0);
		
		// Story
		var nTime = 0;
		nTime += this.popup(STRINGS._('~cs0_advwalking0'), nTime) + 10;
		nTime += this.popup(STRINGS._('~cs0_advwalking1'), nTime) + 10;
		nTime += this.popup(STRINGS._('~cs0_advwalking2'), nTime) + 40;
		nTime += this.popup(STRINGS._('~cs0_advlost0'), nTime) + 50;
		nTime += this.popup(STRINGS._('~cs0_advlost1'), nTime) + 10;
		
		this.sPhase = 'phaseRun';
	},
	
	phaseRun: function() {
	},
	
	phaseFinish: function() {
	},
	
	nShadedTileCount: 0,

	render: function() {
		__inherited();
		if (!this.bRender) {
			G._callGameEvent('onLoading', ['shd', ++this.nShadedTileCount, this.oRaycaster.oHorde.nTileCount]);
		}
	}
});
