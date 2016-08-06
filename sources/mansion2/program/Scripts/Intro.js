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
	
	init: function(tag) {
		// 30 unités jusqu'a destination
		tag.game.playAmbience(SOUNDS_DATA.bgm.cthulhu);
		this._cameraAdvance(tag, 15, 20);
	},
	
	phase: function(tag) {
		var aTags = tag.data.split(' ');
		var nPhase = aTags.pop() | 0;
		var g = tag.game;
		console.log('intro tag', nPhase);
		switch (nPhase) {
			case 10: // start
				this._splash(tag, 'intro_s0_amulet', 'stress1');
			break;
			
			case 15:
				this._splash(tag, 'intro_s0_cult', 'stress2');
			break;

			case 16:
				this._splash(tag, [
					'intro_s1_forest_hands',
					'intro_s1_hell_skull',
					'intro_s1_sacr_news'				
				], 'stress4');
			break;
			
			case 30:
				this._openDoor(tag, tag.x + 1, tag.y);
				this._cameraAdvance(tag, 12, 20);
			break;
			
			case 41:
				this._splash(tag, [
					'intro_ng_01',
					'intro_ng_05'
				], 'stress1');
			break;
			
			case 42:
				this._splash(tag, [
					'intro_ng_07',
					'intro_ng_09',
					'intro_ng_10'
				], 'stress5');
			break;
			
			case 43:
				this._splash(tag, [
					'intro_s4_shogot',
					'intro_s4_nyarlathothep',
					'intro_s4_cthulhu'			
				], 'stress4');
			break;

			case 50:
				this._openDoor(tag, tag.x + 1, tag.y);
				this._cameraAdvance(tag, 3, 1);
				tag.game.playSound(SOUNDS_DATA.intro.stressfinal);
			break;
		}
		tag.remove = true;
	}
});
