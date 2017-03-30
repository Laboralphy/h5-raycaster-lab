O2.extendClass('MANSION.GhostThinker', O876_Raycaster.Thinker, {
	_nTime : 0,
	_sCurrentThinkProc: '',
	_oTarget: null,
	_bDebug: false,
	

	__construct : function() {
		this.reset();
	},
	
	reset: function() {
		this.setThink('Init');
	},
	
	getTarget: function() {
		return this._oTarget;
	},

	/** 
	 * Fait disparaitre le fantome et le désactive
	 */ 
	vanish: function() {
		this._nTime = 0;
		this.setThink('Vanishing');
		var s = this.oMobile.oSprite;
		s.bTranslucent = true;
		s.nAlpha = 1;
	},
	
	playSound: function(sSound) {
		var oMe = this.oMobile;
		var oSounds = oMe.data('sounds');
		if (oSounds && (sSound in oSounds)) {
			this.oGame.playSound(oSounds[sSound], oMe.x, oMe.y);
		}
	},
	
	/**
	 * Renvoie true si la cible spécifié est tournée vers le fantome.
	 * @param oTarget mobile dont on souhaite tester s'il nous a vu
	 * @return bool
	 */
	ghostSeen: function(oTarget) {
		var fTargetAngle = oTarget.getAngle();
		var oMe = this.oMobile;
		return MathTools.isPointInsideAngle(oTarget.x, oTarget.y, fTargetAngle, PI / 2, oMe.x, oMe.y);
	},
	
	/**
	 * fonctionnement normal du fantome
	 */
	process: function() {
		++this._nTime;
		var s = this.oMobile.oSprite;
		if (this._nTime & 2) {
			s.bTranslucent = true;
			s.nAlpha = 1;
		} else {
			s.bTranslucent = false;
			s.nAlpha = 0;
		}
	},
	
	thinkInit: function() {
		var m = this.oMobile;
		var s = m.oSprite;
		s.bTranslucent = true;
		s.nAlpha = 3;
		this._oTarget = this.oGame.getPlayer();
		this.setThink('Spawning');
	},
	
	thinkSpawning: function() {
		var s = this.oMobile.oSprite;
		--s.nAlpha;
		if (s.nAlpha <= 0) {
			s.bTranslucent = false;
			this.setThink('Idle');
		}
	},
	
	thinkVanishing: function() {
		var s = this.oMobile.oSprite;
		++this._nTime;
		s.nAlpha = (this._nTime >> 1) + 1;
		if (s.nAlpha > 3) {
			s.nAlpha = 3;
			this.oMobile.bActive = false;
			this.oMobile.gotoLimbo();
			this.setThink('Idle');
		}
	},

	
	thinkIdle: function() {
		this.process();
	},
	
	
	
	////// PHASES ////// PHASES ////// PHASES ////// PHASES //////		
	////// PHASES ////// PHASES ////// PHASES ////// PHASES //////		
	////// PHASES ////// PHASES ////// PHASES ////// PHASES //////		
	
	/**
	 * Renvoie le nom de la procedure thinker
	 * en fonction de la phase
	 */
	getThinkProcName: function(s) {
		var sThink = s.charAt(0).toUpperCase() + s.substr(1);
		return 'think' + sThink;
	},
	
	/**
	 * Se positionne sur une nouvelle phase
	 * Exécute les fonction de sortie et d'entrée de phase 
	 */
	setThink: function(s) {
		var aArgs = Array.prototype.slice.call(arguments, 1);
		var sPrevProcName = this.getThinkProcName(this._sCurrentThinkProc);
		var sProcName = this.getThinkProcName(s);
		var sProcExit = sPrevProcName + '_exit';
		var sProcEnter = sProcName + '_enter';
		if (sProcExit in this) {
			this[sProcExit]();
		}
		if (sProcName in this) {
			this.think = this[sProcName];
		} else {
			throw new Error('Thinker action not found ' + sProcName);
		}
		this._sCurrentThinkProc = s;
		if (this._bDebug) {
			var aLine = [];
			var m = this.oMobile;
			if (m) {
				aLine.push(m.getBlueprint('name'));
				aLine.push('pos x:' + (m.x | 0) + ' - y:' + (m.y | 0) + ' - sector x:' + m.xSector + ' - y:' + m.ySector);
				aLine.push('thinker: ' + s);
				var soul = m.data('soul');
				if (soul) {
					aLine.push('hp: ' + soul.getAttribute('hp') + '/' + soul.getAttribute('vitality'));
				}
				this.oGame.console().clear().print(aLine.join('\n'));
			}
		}
		if (sProcEnter in this) {
			this[sProcEnter].apply(this, aArgs);
		}
	}
	
});
