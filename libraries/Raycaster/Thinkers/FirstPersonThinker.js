/**
 * @class O876_Raycaster.FirstPersonThinker
 */
O2.extendClass('O876_Raycaster.FirstPersonThinker', O876_Raycaster.Thinker,
{
    aCommands : null,
    oBinds: null,
    aKeyBindings: null, // binds keycodes to symbolic events
    aKeyBoundList: null, // keeps a list of bound key
	nMouseSensitivity: 166,
	_bFrozen: false,

	__construct : function() {
		this.defineKeys( {
			forward : [KEYS.ALPHANUM.Z, KEYS.ALPHANUM.W],
			backward : KEYS.ALPHANUM.S,
			left : [KEYS.ALPHANUM.Q, KEYS.ALPHANUM.A],
			right : KEYS.ALPHANUM.D,
			use : KEYS.SPACE
		});
		this.on('forward.command', (function() {
			this.oMobile.moveForward();
			this.checkCollision();
		}).bind(this));
		this.on('left.command', (function() {
			this.oMobile.strafeLeft();
			this.checkCollision();
		}).bind(this));
		this.on('right.command', (function() {
			this.oMobile.strafeRight();
			this.checkCollision();
		}).bind(this));
		this.on('backward.command', (function() {
			this.oMobile.moveBackward();
			this.checkCollision();
		}).bind(this));
		MAIN.pointerlock.on('mousemove', this.readMouseMovement.bind(this));
	},

    bindKey: function(nKey, sEvent) {
        if (this.aKeyBindings === null) {
            this.aKeyBindings = [];
        }
        if (this.aKeyBoundList === null) {
            this.aKeyBoundList = [];
        }
        if (this.aCommands === null) {
            this.aCommands = [];
        }
        this.aKeyBindings[nKey] = [sEvent, 0];
        this.aCommands[sEvent] = false;
        if (this.aKeyBoundList.indexOf(nKey) < 0) {
            this.aKeyBoundList.push(nKey);
        }
    },

    /**
     * Define keys that will be used to control the mobile on which is applied this Thinker
     * @param a is an object matching KEY CODES and Event names
     */
    defineKeys : function(a) {
        var i, l;
        for (var sEvent in a) {
            if (Array.isArray(a[sEvent])) {
                l = a[sEvent].length;
                for (i = 0; i < l; ++i) {
                    this.bindKey(a[sEvent][i], sEvent);
                }
            } else {
                this.bindKey(a[sEvent], sEvent);
            }
        }
    },

    getCommandStatus : function(sEvent) {
        return this.aCommands[sEvent];
    },

    updateKeys : function() {
        var sKey = '', nKey, sProc, aButton;
        var aCmds = this.aCommands;
        var oKbd = this.oGame.getKeyboardDevice();
        var aKeyData;
        var sEvent;
        var kbl = this.aKeyBoundList;
        var kb = this.aKeyBindings;
        for (var iKey = 0, l = kbl.length; iKey < l; ++iKey) {
            nKey = kbl[iKey];
            aKeyData = kb[nKey];
            sEvent = aKeyData[0];
            sProc = '';
            switch (oKbd.aKeys[nKey]) {
                case 1: // down
                    if (aKeyData[1] === 0) {
                        sProc = sEvent + '.down';
                        aCmds[sEvent] = true;
                        aKeyData[1] = 1;
                    }
                    break;

                case 2: // Up
                    if (aKeyData[1] === 1) {
                        sProc = sEvent + '.up';
                        aCmds[sEvent] = false;
                        aKeyData[1] = 0;
                    }
                    break;
                default:
                    sProc = '';
                    break;
            }
            if (sProc) {
                this.trigger(sProc);
            }
        }
        var oMouse = this.oGame.getMouseDevice();
        while (aButton = oMouse.readMouse()) {
            nKey = aButton[3];
            sEvent = 'button' + nKey;
            sProc = '';
            switch (aButton[0]) {
                case 1: // button down
                    sProc = sEvent + '.down';
                    this.aCommands[sEvent] = true;
                    break;

                case 0: // button up
                    sProc = sEvent + '.up';
                    this.aCommands[sEvent] = false;
                    break;

                case 3:
                    sProc = 'wheel.up';
                    break;

                case -3:
                    sProc = 'wheel.down';
                    break;

                default:
                    sProc = '';
                    break;
            }
            if (sProc) {
                this.trigger(sProc);
            }
        }
        for (sEvent in this.aCommands) {
            if (this.aCommands[sEvent]) {
                sProc = sEvent + '.command';
                if (sProc) {
                    this.trigger(sProc);
                }
            }
        }
    },


	readMouseMovement: function(oEvent) {
		if (!this._bFrozen) {
			this.oMobile.rotate(oEvent.x / this.nMouseSensitivity);
		}
	},

	/**
	 * Freezes all movement and rotation
	 */
	freeze: function() {
		this._bFrozen = true;
	},

	/**
	 * if frozen then back to normal
	 */
	thaw: function() {
		this._bFrozen = false;
	},

	think: function() {
		if (!this._bFrozen) {
			this.updateKeys();
		}
	},

	checkCollision: function() {
		if (this.oMobile.oMobileCollision !== null) {
			var oTarget = this.oMobile.oMobileCollision;
			if (oTarget.oSprite.oBlueprint.nType !== RC.OBJECT_TYPE_MISSILE) {
				this.oMobile.rollbackXY();
			}
		}
	}
});

O2.mixin(O876_Raycaster.FirstPersonThinker, O876.Mixin.Events);