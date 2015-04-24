O2.createObject('STRINGS', {
		
	lang: 'en',
	
	_parameterSubstitution: function(sDispMsg, aParams) {
		if (aParams !== undefined) {
			switch (aParams.length) {
				case 10:
					sDispMsg = sDispMsg.replace(/\$9/g, STRINGS._(aParams[9])); // no break here
				case 9:
					sDispMsg = sDispMsg.replace(/\$8/g, STRINGS._(aParams[8])); // no break here
				case 8:
					sDispMsg = sDispMsg.replace(/\$7/g, STRINGS._(aParams[7])); // no break here 
				case 7:
					sDispMsg = sDispMsg.replace(/\$6/g, STRINGS._(aParams[6])); // no break here
				case 6:
					sDispMsg = sDispMsg.replace(/\$5/g, STRINGS._(aParams[5])); // no break here
				case 5:
					sDispMsg = sDispMsg.replace(/\$4/g, STRINGS._(aParams[4])); // no break here
				case 4:
					sDispMsg = sDispMsg.replace(/\$3/g, STRINGS._(aParams[3])); // no break here
				case 3:
					sDispMsg = sDispMsg.replace(/\$2/g, STRINGS._(aParams[2])); // no break here
				case 2:
					sDispMsg = sDispMsg.replace(/\$1/g, STRINGS._(aParams[1])); // no break here
				case 1:
					sDispMsg = sDispMsg.replace(/\$0/g, STRINGS._(aParams[0])); // no break here
			}
		}
		return sDispMsg;
	},
	
	_: function(xKey, aParams) {
		if (xKey === null) {
			return '';
		}
		var i = '', sKey, sDispMsg;
		if (typeof xKey === 'string') {
			sKey = xKey.substr(1);
			var oStrings = STRINGS[STRINGS.lang];
			if (sKey in oStrings) {
				sDispMsg = oStrings[sKey];
				if (typeof sDispMsg === 'string') {
					return STRINGS._parameterSubstitution(sDispMsg, aParams);
				} else if (typeof sDispMsg === 'object' || Array.isArray(sDispMsg)) {
					return STRINGS._(sDispMsg, aParams);
				} 
			} else {
				return STRINGS._parameterSubstitution(xKey, aParams);
			}
		} else if (ArrayTools.isArray(xKey)) {
			var aArray = [];
			for (var iArray = 0; iArray < xKey.length; iArray++) {
				aArray.push(STRINGS._(xKey[iArray], aParams));
			}
			return aArray;
		} else if (typeof xKey === 'object') {
			var oResult = {};
			for (i in xKey) {
				oResult[i] = STRINGS._(xKey[i], aParams);
			}
			return oResult;
		} else {
			return xKey;
		}
	},

	en: {
		dlg_button_close: 'Close',
		dlg_button_respawn: 'Revenge !',
		dlg_button_reboot: 'Restart',
		dlg_button_continue: 'Continue',
		
		dlg_youdied_title: 'Killed',
		dlg_youdied_message: 'You were killed by $0.',
		dlg_disconnected_title: 'Connection lost',
		dlg_disconnected_message: 'The connection with the server is lost. Please try again later.',
		dlg_loading_title: 'Loading',
		
		dlg_login_msg: 'Enter your nickname and click on ',
		dlg_login_pass: 'This account is protected by a password.',
		dlg_login_button: 'Connect',
		dlg_logged_msg: 'Welcome <b>$0</b>',
		dlg_logged_button: 'Join game',
					
		boss_msg: 'This is the white mode. You are in white mode because you pressed the "B" key. Press "B" again to exit white mode.',
		boss_title: 'white mode',
		
		frag_msg: 'You killed $0.',
				
		item_pickup: 'Acquired : $0.',
		item_invfull: 'Your inventory is full !',
		item_equip: 'You are now using : $0',
		item_drop: 'You dropped : $0',
		
		itm_scr_blindness: 'Scroll of Blindness',
		itm_scr_confusion: 'Scroll of Confusion',
		itm_scr_drainlife: 'Scroll of Drain life',
		itm_scr_hold: 'Scroll of Hold',
		itm_scr_power: 'Scroll of Power',
		itm_scr_reflect: 'Scroll of Reflection',
		itm_scr_root: 'Scroll of Root',
		itm_scr_snare: 'Scroll of Snare',
		itm_scr_teleport: 'Scroll of Teleport',
		itm_scr_monster: 'Scroll of Summon monster',
		itm_scr_fireball: 'Scroll of Fireball',
		itm_scr_magnet: 'Scroll of Magnet',
		itm_scr_weakness: 'Scroll of Weakness',
		itm_scr_dispel: 'Scroll of Dispel',

		itm_pot_esp: 'Potion of E.S.P.',
		itm_pot_healing: 'Potion of Healing',
		itm_pot_healing2: 'Potion of Greater Healing',
		itm_pot_healing3: 'Potion of Rejunenation',
		itm_pot_haste: 'Potion of Haste',
		itm_pot_remedy: 'Remedy',
		itm_pot_invisibility: 'Potion of Invisibility',
		itm_pot_resist: 'Potion of Magic Resistance',
		itm_pot_luck: 'Potion of Fortune',
		itm_pot_energy: 'Potion of Energy',
		itm_pot_immortal: 'Potion of Immortality',
		
		itm_book_amnesia: 'Amnesia',
		itm_book_bouncingorb: 'Bouncing Orb',
		itm_book_charm: 'Charm Monster',
		itm_book_clairvoyance: 'Clairvoyance',
		itm_book_deathspell: 'Death Spell',
		itm_book_deflector: 'Missile Deflector',
		itm_book_fireball: 'Fireball',
		itm_book_freeze: 'Cone of Cold',
		itm_book_magicshutdown: 'Magic Shutdown',
		itm_book_mkscroll: 'Conjure Scroll',
		itm_book_nullitysphere: 'Nullity Sphere',
		itm_book_remind: 'Remind',
		
		// wands
		itm_wand_basic: 'Basic Wand',
		itm_wand_prismatic: 'Prismatic Wand',
		
		// some weird items
		itm_pot_frozen: 'Frozen potion',
		itm_pot_slowness: 'Potion of Slowness',
		itm_pot_poison: 'Poison',
		itm_pot_confusion: 'Potion of Confusion',

		alert_wtf_invfull: "Your inventory is full.",
		alert_wtf_held: "You're held, you can't do ANY action.",
		alert_wtf_root: "You are rooted. You can't move.",
		alert_wtf_blindread_0: 'You can\'t read scrolls or books while blinded.',
		alert_wtf_blindread_1: 'Scrolls and spellbooks are not written in Braille, you know...',
		alert_wtf_confusedread_0: 'You are confused. You can\'t clearly cast the spell.',
		alert_wtf_confusedread_1: 'Confusion has blurred your mind : You fumbled the spellcasting.',
		
		alert_level_change_60: 'One minute before the game ends.',
		alert_level_change_30: '30 seconds before the game ends.',
		alert_level_change_10: '10 seconds before the game ends.',
			
		load_lvl: 'map data...',
		load_gfx: 'loading assets...',
		load_shd: 'pre-shading...',
		load_end: 'complete !'
	}
});
