/**
 * Fait apparaitre un fantome
 */
O2.createClass('MANSION.Script.Intro', {
	
	_splash: function(tag, xPhoto, sSound) {
		var rc = tag.game.oRaycaster;
		var gx = rc.addGXEffect(MANSION.GX.IntroSplash);
		if (!Array.isArray(xPhoto)) {
			xPhoto = [xPhoto];
		}
		var aPhotos = xPhoto.map(function(p) {
			return rc.getTile(p).oImage;
		});
		if (sSound) {
			tag.game.playSound(SOUNDS_DATA.intro[sSound]);
		}
		gx.splash(aPhotos, 4);
	},
	
	_cameraAdvance: function(tag, n, t) {
		tag.game.getPlayer().getThinker().setMove(null, null, null, tag.game.oRaycaster.nPlaneSpacing * n, 0, t * 1000);
	},
	
	_openDoor: function(tag, x, y) {
		tag.game.openDoor(x, y, true);
		var ps = tag.game.oRaycaster.nPlaneSpacing;
		var ps2 = ps >> 1;
		tag.game.playSound(SOUNDS_DATA.events.dooropen, x * ps + ps2, y * ps + ps2);
	},
	
	_text: function(tag, aText) {
		var rc = tag.game.oRaycaster;
		var rcc = rc.oCanvas;
		var oText = tag.game.oRaycaster.addGXEffect(MANSION.GX.SimpleText);
		oText.text(aText, rcc.width >> 1, rcc.height >> 1);
	},
	
	
	thunder: function(tag) {
		var rc = tag.game.oRaycaster;
		var sf = rc.nShadingFactor;
		rc.addGXEffect(O876_Raycaster.GXAmbientLight).setLight(1000, 80);
		var oFlash = rc.addGXEffect(O876_Raycaster.GXFlash).setFlash('#FFF', 0.7, 0, 5);
		tag.game.playSound(SOUNDS_DATA.ambiance.thunder);
		setTimeout(function() {
			rc.addGXEffect(O876_Raycaster.GXAmbientLight).setLight(sf, 1000);
		}, 160);
	},
	
	init: function(tag) {
		// 30 unités jusqu'a destination
		tag.game.playAmbience(SOUNDS_DATA.bgm.cthulhu);
		this._cameraAdvance(tag, 15, 20);
		this._text(tag, ['A cursed forest...']);
	},
	
	phase: function(tag) {
		var aTags = tag.data.split(' ');
		var nPhase = aTags.pop();
		var g = tag.game;
		switch (nPhase) {
			case 'doormansion':
				this._openDoor(tag, tag.x + 1, tag.y);
				this._cameraAdvance(tag, 12, 20);
			break;
			
			
			case 'phamu': // start
				this._splash(tag, 'intro_s0_amulet', 'stress1');
			break;

			
			case 'phcult':
				this._splash(tag, 'intro_s0_cult', 'stress2');
			break;

			case 'phsacr':
				this._splash(tag, [
					'intro_s1_forest_hands',
					'intro_s1_hell_skull',
					'intro_s1_sacr_news'				
				], 'stress4');
			break;
			
			case 'phnec1':
				this._splash(tag, [
					'intro_ng_01',
					'intro_ng_05'
				], 'stress1');
			break;
			
			case 'phnec2':
				this._splash(tag, [
					'intro_ng_07',
					'intro_ng_09',
					'intro_ng_10'
				], 'stress5');
			break;
			
			case 'phgods':
				this._splash(tag, [
					'intro_s4_shogot',
					'intro_s4_nyarlathothep',
					'intro_s4_cthulhu'			
				], 'stress4');
			break;
			case 'txcult':
				this._text(tag, ['An evil cult...']);
			break;
			
			case 'txworsh':
				this._text(tag, ['...worshippers of Dark Gods...']);
			break;

			case 'txmans':
				this._text(tag, ['...their dreadful mansion.']);
			break;
			
			case 'txheap':
				this._text(tag, ['Heaps of powerful and dangerous', 'tomes of black magic.']);
			break;
			
			case 'txgetem':
				this._text(tag, ['These manuscripts must be', 'retrieved before it\'s too late !']);
			break;

			case 'end':
				var g = tag.game;
				var rc = g.oRaycaster;
				this._openDoor(tag, tag.x + 1, tag.y);
				this._cameraAdvance(tag, 3, 1);
				g.playSound(SOUNDS_DATA.intro.stressfinal);
				rc.addGXEffect(O876_Raycaster.GXAmbientLight).setLight(10, 1000);
				
				setTimeout(function() {
					rc.addGXEffect(O876_Raycaster.GXFade).fadeOut('#000', 1000).neverEnding();
				}, 1500);
				
				setTimeout((function() {
					g.setLevel('m090-htp');
				}).bind(this), 2500);
			break;
		}
		tag.remove = true;
	},
});
