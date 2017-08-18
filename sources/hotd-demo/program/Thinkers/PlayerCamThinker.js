/**
 * Thinker de missile
 */
O2.extendClass('HOTD.PlayerCamThinker', O876_Raycaster.NonLinearThinker, {

	_movements: null,
	_nUntilTime: 0,
	_sLastDir: '',

	_aMobs: null,
	_FAST: false,

	until: function(n) {
		if (this._FAST) {
			n = 0;
		}
		this._nUntilTime = this.oGame.getTime() + n;
	},

	timeout: function() {
		return this.oGame.getTime() >= this._nUntilTime;
	},


	openFrontDoor() {
		var g = this.oGame;
		var m = this.oMobile;
		var vDoor = m.getFrontCellXY();
		g.openDoor(vDoor.x, vDoor.y, true);
		var sNoise = 'mechanisms/door-open';
		var rc = this.oGame.oRaycaster;
		switch (rc.getMapPhys(vDoor.x, vDoor.y)) {
            case rc.PHYS_CURT_SLIDING_UP:
                sNoise = 'mechanisms/push-stone';
				break;

            case rc.PHYS_SECRET_BLOCK:
                sNoise = 'mechanisms/push-stone';
                break;
		}
        this.oGame.playSound(sNoise, vDoor.x * 64, vDoor.y * 64);
	},

    text: function(aText) {
        var rc = this.oGame.oRaycaster;
        var rcc = rc.getScreenCanvas();
        var oText = rc.addGXEffect(HOTD.GX.SimpleText);
        oText.text(aText, rcc.width >> 1, rcc.height >> 1);
    },


	spawnMob: function(sBP, sLoc) {
		if (!this._aMobs) {
			this._aMobs = [];
		}
		if (this._FAST) {
			return;
		}
		var oLoc = this.oGame.getLocator(sLoc);
		var oMob = this.oGame.spawnMob(sBP, oLoc.x, oLoc.y);
		this._aMobs.push(oMob);
	},

	allClear: function() {
		return this._aMobs.length === 0;
	},

	mobDied: function(oMob) {
		var iMob = this._aMobs.indexOf(oMob);
		if (iMob < 0) {
			throw new Error('WTF');
		}
		this._aMobs.splice(iMob, 1);
	},

	click: function(x, y) {
		// on touche un mob ?
		var oHit = this._aMobs.filter(function(m) {
			var ls = m.oSprite.aLastRender;
			var xMob = ls[5];
			var yMob = ls[6];
			var wMob = ls[7];
			var hMob = ls[8];
			var zMob = ls[9];
			return x > xMob && x < (xMob + wMob) && y > yMob && y < (yMob + hMob);
		}).sort(function(m1, m2) {
			return m1.oSprite.aLastRender[9] - m2.oSprite.aLastRender[9];
		}).shift();
		if (oHit) {
			// on a touché un mob
			console.log('Hit !');
			oHit.getThinker().die();
			this.mobDied(oHit);
		}
	},

	clearMouse: function() {
		this.oGame.getMouseDevice().clearEvents();
	},

	updateMouse: function() {
		var oMouse = this.oGame.getMouseDevice();
		var aButton;
		while (aButton = oMouse.inputMouse()) {
			if (aButton[0] === 1 && aButton[3] === 0) {
				this.click(aButton[1], aButton[2]);
			}
		}
	},

	thinkInit: function() {

		var rnd = function(n1, n2) {
			return (Math.random() * (n2 - n1 + 1) | 0) + n1;
		};


		this._movements = [

			['bgm', 'music/atrium'],
			['text', '- La Cabane aux Milles Zombies -'],

			// move 1
			// move 1
			// move 1
			['move', 3, 0, null, 3000],

			// ambush 1
			// ambush 1
			// ambush 1
			['wait', 1500],
			['spawn', 'm_zomb', 'spawn-1-1'],
			['wait', 2000],
			['spawn', 'm_zomb', 'spawn-1-2'],
			['wait', 2000],
			['spawn', 'm_zomb', 'spawn-1-3'],
			['wait', 'clear'],

			// go to garden
			// go to garden
			// go to garden
			['move', 3, 0, null, 3000],
			['move', 2, -2, -PI/2, 2000],



			// ambush 2
			// ambush 2
			// ambush 2
			['spawn', 'm_zomb', 'spawn-2-1'],
			['wait', 1500],
			['spawn', 'm_zomb', 'spawn-2-3'],
			['wait', 1300],
			['spawn', 'm_zomb', 'spawn-2-5'],
			['wait', 3000],

			['spawn', 'm_zomb', 'spawn-2-3'],
			['wait', 300],
			['spawn', 'm_zomb', 'spawn-2-2'],
			['wait', 100],
			['spawn', 'm_zomb', 'spawn-2-4'],
			['wait', 3000],

			['spawn', 'm_zomb', 'spawn-2-9'],
			['wait', 100],
			['spawn', 'm_zomb', 'spawn-2-7'],
			['wait', 500],
			['spawn', 'm_zomb', 'spawn-2-6'],
			['wait', 'clear'],


			// go to entrance door
			// go to entrance door
			// go to entrance door
			['move', 0, -7, null, 7000],
			['open'],
            ['bgm', 'music/manor'],
			['wait', 1000],


			// ambush 3 : behind entrance door
			// ambush 3 : behind entrance door
			// ambush 3 : behind entrance door
			['spawn', 'm_zomb', 'spawn-3-1'],
			['wait', 'clear'],

			// step through entrance door
			// step through entrance door
			// step through entrance door
			['move', 0, -3, null, 3000],


			 // ambush 4 : first room
			 // ambush 4 : first room
			 // ambush 4 : first room
			['spawn', 'm_skull', 'spawn-4-' + rnd(1, 8)],
			['wait', 500 + rnd(0, 200)],
			['spawn', 'm_skull', 'spawn-4-' + rnd(1, 8)],
			['wait', 500 + rnd(0, 200)],
			['spawn', 'm_skull', 'spawn-4-' + rnd(1, 8)],
			['wait', 500 + rnd(0, 200)],
			['spawn', 'm_skull', 'spawn-4-' + rnd(1, 8)],
			['wait', 2500],

			['spawn', 'm_skull', 'spawn-4-' + rnd(1, 8)],
			['wait', 500 + rnd(0, 200)],
			['spawn', 'm_skull', 'spawn-4-' + rnd(1, 8)],
			['wait', 400 + rnd(0, 200)],
			['spawn', 'm_skull', 'spawn-4-' + rnd(1, 8)],
			['wait', 300 + rnd(0, 200)],
			['spawn', 'm_skull', 'spawn-4-' + rnd(1, 8)],
			['wait', 200 + rnd(0, 200)],
			['spawn', 'm_skull', 'spawn-4-' + rnd(1, 8)],
			['wait', 150 + rnd(0, 200)],
			['spawn', 'm_skull', 'spawn-4-' + rnd(1, 8)],
			['wait', 100 + rnd(0, 200)],

			['wait', 'clear'],



			// go to center of entrance hall
			// go to center of entrance hall
			// go to center of entrance hall
			['move', 0, -4, null, 4000],

			// look at chimney
			// look at chimney
			// look at chimney
			['move', 0, 0, -PI, 500],
			['wait', 2000],

			// look at picture
			// look at picture
			// look at picture
			['move', 0, 0, 0, 500],
			['wait', 2000],

			// look at door then walk, and open
			// look at door then walk, and open
			// look at door then walk, and open
			['move', 0, 0, -PI / 2, 500],
			['move', 0, -1, null, 1000],
			['open'],
			['wait', 1000],

			// step inside living room
			// step inside living room
			// step inside living room
			['move', 0, -2, null, 2000],
			['wait', 500],


			// ambush living room
			// ambush living room
			// ambush living room
			['spawn', 'm_zomb', 'spawn-5-' + rnd(1, 6)],
			['wait', 400 + rnd(0, 500)],
			['spawn', 'm_skull', 'spawn-5-' + rnd(1, 6)],
			['wait', 400 + rnd(0, 500)],
			['spawn', 'm_zomb', 'spawn-5-' + rnd(1, 6)],
			['wait', 400 + rnd(0, 500)],
			['spawn', 'm_skull', 'spawn-5-' + rnd(1, 6)],
			['wait', 400 + rnd(0, 500)],
			['spawn', 'm_zomb', 'spawn-5-' + rnd(1, 6)],
			['wait', 400 + rnd(0, 500)],
			['spawn', 'm_skull', 'spawn-5-' + rnd(1, 6)],
			['wait', 400 + rnd(0, 500)],
			['spawn', 'm_zomb', 'spawn-5-' + rnd(1, 6)],
			['wait', 400 + rnd(0, 500)],
			['spawn', 'm_skull', 'spawn-5-' + rnd(1, 6)],
			['wait', 400 + rnd(0, 500)],
			['spawn', 'm_zomb', 'spawn-5-' + rnd(1, 6)],
			['wait', 400 + rnd(0, 500)],
			['wait', 'clear'],



			// go to center of living room, look at chimney
			// go to center of living room, look at chimney
			// go to center of living room, look at chimney
			['move', 0, -3, 0, 3000],

			// ambush living room chimney
			// ambush living room chimney
			// ambush living room chimney
			['spawn', 'm_skull', 'spawn-6-1'],
			['wait', 'clear'],
			['wait', 500],

			// move to door corridor
			// move to door corridor
			// move to door corridor
			['move', 0, 0, -PI, 750],
			['move', -5, 0, null, 5000],
			['open'],
			['wait', 1000],

			// step inside corridor
			['move', -5, 0, null, 5000],
			['move', 0, 0, -PI / 2, 500],
			['wait', 1000],

			// look at sleeping room door, open it
			// look at sleeping room door, open it
			// look at sleeping room door, open it
			['move', 0, 0, PI / 2, 500],
			['open'],
			['wait', 1000],

			// step inside sleeping room
			// step inside sleeping room
			// step inside sleeping room
			['move', 0, 2, 3 * PI / 8, 2000],
			['spawn', 'm_zomb', 'spawn-10-1'],
			['wait', 250],
			['spawn', 'm_zomb', 'spawn-10-2'],
			['wait', 100],
			['spawn', 'm_zomb', 'spawn-10-3'],
			['wait', 'clear'],
            ['wait', 500],


			// checkout the picture
			// checkout the picture
			// checkout the picture
			['move', 2, 2, 0, 2800],
			['wait', 500],
			['move', 1, 0, null, 1000],
			['open'],
			['wait', 2000],

			// move inside secret passage
			// move inside secret passage
			// move inside secret passage
			['move', 2, 0, PI / 2, 4000],
			['wait', 2000],
			['move', 0, 0, PI, 500],

			// go out the secret passage
			['move', -3, 0, 5 * PI / 4, 2000],

			// go out the room
			['move', -2, -2, null, 2000],
			['move', 0, -2, null, 1000],
			['move', 0, 0, PI, 500],
			['move', -5, 0, null, 4000],

			// approach curtain
			// approach curtain
			// approach curtain
			['move', 0, -1, 3 * PI / 2, 1000],
			['open'],
			['wait', 1000],

			['move', 0, 0, PI / 2, 4000],
			['move', 0, 3, null, 3000],
			['open'],
			['wait', 1000],

			['move', 0, 3, null, 2000],
			['wait', 500],
			['open'],
			['wait', 1000],
			['move', 0, 6, null, 6000],

			['spawn', 'm_zomb', 'spawn-11-1'],
			['spawn', 'm_zomb', 'spawn-11-2'],
			['spawn', 'm_zomb', 'spawn-11-3'],
			['wait', 1500],
			['spawn', 'm_zomb', 'spawn-11-4'],
			['spawn', 'm_zomb', 'spawn-11-5'],
			['spawn', 'm_zomb', 'spawn-11-6'],
			['spawn', 'm_zomb', 'spawn-11-7'],
			['wait', 1500],
			['spawn', 'm_zomb', 'spawn-11-1'],
			['spawn', 'm_zomb', 'spawn-11-2'],
			['spawn', 'm_zomb', 'spawn-11-3'],
			['wait', 1500],
			['spawn', 'm_zomb', 'spawn-11-4'],
			['spawn', 'm_zomb', 'spawn-11-5'],
			['spawn', 'm_zomb', 'spawn-11-6'],
			['spawn', 'm_zomb', 'spawn-11-7'],
			['wait', 1500],
			['wait', 'clear'],

            ['wait', 1500],
            ['text', 'Fin de la démo', 'Merci d\'avoir joué.']
		];
		this.setMove(null, null, null, 0, 0, 0, 1500);
		__inherited();
	},

	thinkStop: function() {
		var m = this._movements.shift();
		if (m && Array.isArray(m) && m.length > 0) {
			switch (m.shift()) {
				case 'move':
					if (this._FAST) {
						m[3] /= 5;
					}
					this.setMove(null, null, null, m[0] * 64, m[1] * 64, m[2], m[3]);
					this.think = this.thinkMove;
					break;

				case 'wait':
					this.clearMouse();
					if (m.length) {
						if (isNaN(m[0])) {
							//this.oGame.trigger('wait', {event: m[0]});
							this.think = this.thinkWaitingClear;
						} else {
							this.until(m[0]);
							this.think = this.thinkWaiting;
						}
					} else {
						this.think = this.thinkIdle;
					}
					break;

				case 'spawn':
					this.spawnMob(m[0], m[1]);
					break;

				case 'open':
					this.openFrontDoor();
					break;

                case 'bgm':
                    this.oGame.playAmbiance(m[0]);
                    break;

                case 'text':
                    this.text(m);
                    break;

                default:
					console.warn('bad PlayerCamThinker command', m);
					this.think = this.thinkIdle;
					break;
			}
		} else {
			this.think = this.thinkIdle;
		}
	},

	thinkWaiting: function() {
		this.updateMouse();
		if (this.timeout()) {
			this.resume();
		}
	},

	thinkWaitingClear: function() {
		this.updateMouse();
		if (this.allClear()) {
			this.resume();
		}
	},

	resume: function() {
		this.thinkStop();
	}
});
