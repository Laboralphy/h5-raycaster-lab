O2.createClass('DescriptorPlugin', {

	oGame: null,
	oEffectProcessor: null,
	nPreviousMode: 0,

	uiController: function(sCommand, xParams) {
		var w;
		switch (sCommand) {
			case 'on': // Ouverture de la fenetre / Mise à jour inventaire
				w = this.oScreen.linkControl(new UI.DescriptorWindow(xParams));
				this.centerWidget(w);
				break;
		}
	},
	
	displayDescriptionWindow: function(oItem) {
		if (oItem) {
			this.describe(oItem);
			return true;
		} else {
			return false;
		}			
	},

	getSelectedItem: function() {
		var nIndex, oInv, oItem = null;
		switch (this.oGame.nIntfMode) {
			case UI.INTFMODE_INVENTORY:
				nIndex = this.oGame.oUI.command('Inventory', 'get');
				oInv = this.oGame.oDungeon.getCreatureInventory(oPlayerCreature);
				oItem = null;
				if (nIndex >= 0) {
					oItem = oInv.aBagSlots[nIndex];
				} else {
					for (var iSlot in oInv.oEquipSlots) {
						nIndex++;
						if (nIndex === 0) {
							oItem = oInv.oEquipSlots[iSlot];
						}
					}
				}
				break;
				
			case UI.INTFMODE_SHOP:
				oItem = this.oGame.oUI.command('Shop', 'get');
				break;
		}
		return oItem;
	},

	processKey: function(nKey) {
		if (this.oGame.nIntfMode == UI.INTFMODE_DESCRIPTOR) {
			switch (nKey) {
				case KEYS._INT_ESCAPE:
				case KEYS._CNT_ACTION:
					this.oGame.oUI.command('', 'off');
					this.oGame.nIntfMode = this.nPreviousMode;
					return true;
			}
		}
		return false;
	},

	setGame: function(g) {
		this.oGame = g;
	},
	
	/**
	 * Renvoie la version affichable de la duration spécifiée
	 * @param nDir int
	 * @return string
	 */
	getDurationDescription: function(nDur) {
		var sDur;
		switch (nDur) {
			case 62:
				sDur = STRINGS._('~med_overtime') + '180 ' + STRINGS._('~med_second');
				break;
		
			case 61:
				sDur = STRINGS._('~med_overtime') + '120 ' + STRINGS._('~med_second');
				break;
				
			case 0:
			case 63:
				sDur = '';
				break;
		
			default:
				sDur = STRINGS._('~med_overtime') + nDur.toString() + ' ' + STRINGS._('~med_second');
				break;
		}
		return sDur;
	},
	
	/**
	 * Fabrique une chaine de description de dégât
	 * C'est compliqué
	 * @param nLevel niveau
	 * @param nDur durée
	 * @param nFactor facteur de dégat
	 * @param sEffectStr
	 * @return string
	 */
	getDamageDescription: function(nLevel, nDur, nFactor, sEffectStr) {
		return nDur === 0 ? STRINGS._('~desc_' + sEffectStr) + ' ' + nLevel.toString() + '-' + (nFactor * nLevel) : STRINGS._('~desc_' + sEffectStr) + ' ' + (nLevel * nDur).toString() + this.getDurationDescription(nDur);
	},

	
	/**
	 * Renvoie la description d'un effet de sous-type DAMAGE 
	 */
	getEffectDescription: function(sEffect) {
		var ep = this.oGame.oDungeon.oEffectProcessor;
		var sSubType = ep.getEffectSubType(sEffect);
		var nLevel = ep.getEffectLevel(sEffect);
		var nDur = ep.getEffectDuration(sEffect);
		var sDur = this.getDurationDescription(nDur);
		sDur = sDur ? ' ' + sDur : '';
		switch (sSubType) {
			case 'ahld': return STRINGS._('~attr_held') + sDur;
			case 'aroo': return STRINGS._('~attr_rooted') + sDur;
			case 'asnr': return STRINGS._('~attr_snared') + ' +' + nLevel + sDur;
			case 'avul': return STRINGS._('~attr_vulnerability') + ' +' + nLevel + sDur;
			case 'awea': return STRINGS._('~attr_power') + ' -' + nLevel + sDur;
			case 'aill': return STRINGS._('~attr_pharma') + ' -' + nLevel + sDur;
			case 'abld': return STRINGS._('~attr_blind') + sDur;
			case 'acnf': return STRINGS._('~attr_confused') + sDur;
			case 'adhp': return STRINGS._('~attr_vitality') + ' -' + (nLevel * ep.HEAL_FACTOR) + sDur;
			case 'ajnx': return STRINGS._('~attr_luck') + ' -' + nLevel + sDur;
			case 'admp': return STRINGS._('~attr_energy') + ' -' + (nLevel * ep.ENERGY_FACTOR) + sDur;
			case 'ahun': return STRINGS._('~attr_foodc') + ' +' + nLevel + sDur;

			case 'bpow': return STRINGS._('~attr_power') + ' +' + nLevel + sDur;
			case 'bhst': return STRINGS._('~attr_speed') + ' +' + nLevel + sDur;
			case 'bpha': return STRINGS._('~attr_pharma') + ' +' + nLevel + sDur;
			case 'binv': return STRINGS._('~attr_invulnerability') + sDur;
			case 'besp': return STRINGS._('~attr_esp') + sDur;
			case 'bclk': return STRINGS._('~attr_invisibility') + sDur;
			case 'bxhp': return STRINGS._('~attr_vitality') + ' +' + (nLevel * ep.HEAL_FACTOR) + sDur;
			case 'blck': return STRINGS._('~attr_invisibility') + sDur;
			case 'bxmp': return STRINGS._('~attr_energy') + ' +' + (nLevel * ep.ENERGY_FACTOR) + sDur;
			case 'bsfc': return STRINGS._('~attr_foodc') + ' -' + nLevel + sDur;

			case 'rant': return STRINGS._('~attr_antidote') + sDur;
			case 'rhea': return STRINGS._('~attr_hp') + ' +' + (nDur ? (nDur * nLevel).toString() + sDur : (nLevel * ep.HEAL_FACTOR));
			case 'rbod': return STRINGS._('~attr_health') + sDur;
			case 'rmin': return STRINGS._('~attr_clearmind') + sDur;
			case 'rmov': return STRINGS._('~attr_freedom') + sDur;
			case 'rene': return STRINGS._('~attr_mp') + ' +' + (nLevel * ep.ENERGY_FACTOR);
			case 'rfdp': return STRINGS._('~attr_foodp') + ' +' + nLevel + '0';

			case 'rphy': return STRINGS._('~attr_drphysical') + ' +' + nLevel + sDur;
			case 'rfir': return STRINGS._('~attr_drfire') + ' +' + nLevel + sDur;
			case 'rcld': return STRINGS._('~attr_drcold') + ' +' + nLevel + sDur;
			case 'rele': return STRINGS._('~attr_drelectricity') + ' +' + nLevel + sDur;
			case 'rtox': return STRINGS._('~attr_drtoxic') + ' +' + nLevel + sDur;
			case 'rmag': return STRINGS._('~attr_drmagical') + ' +' + nLevel + sDur;
			case 'rdth': return STRINGS._('~attr_drdeath') + ' +' + nLevel + sDur;

			case 'xphy': return this.getDamageDescription(nLevel, nDur, ep.DAMAGE_FACTOR_PHYSICAL, 'effect_xphy');
			case 'xmag': return this.getDamageDescription(nLevel, nDur, ep.DAMAGE_FACTOR_MAGICAL, 'effect_xmag'); 
			case 'xcld': return this.getDamageDescription(nLevel, nDur, ep.DAMAGE_FACTOR_COLD, 'effect_xcld'); 
			case 'xfir': return this.getDamageDescription(nLevel, nDur, ep.DAMAGE_FACTOR_FIRE, 'effect_xfir'); 
			case 'xele': return this.getDamageDescription(nLevel, nDur, ep.DAMAGE_FACTOR_ELECTRICITY, 'effect_xele'); 
			case 'xtox': return this.getDamageDescription(nLevel, nDur, ep.DAMAGE_FACTOR_TOXIC, 'effect_xtox'); 
			case 'xene': return this.getDamageDescription(nLevel, nDur, ep.ENERGY_FACTOR, 'effect_xene');
			
			case 'disp': return STRINGS._('~desc_effect_disp') + ' ' + nLevel;
			case 'null': return STRINGS._('~desc_effect_null');
			
			default: return sSubType;
		}
	},
	
	getSpellProjectionDescription: function(s) {
		var sMain = s.substr(0, 2);
		var aDesc = [STRINGS._('~desc_spell_project_' + sMain)];
		var aOptions = s.substr(2);
		var sKey;
		for (var i = 0; i < aOptions.length; i++) {
			sKey = '~desc_spell_project_' + aOptions[i];
			aDesc.push(STRINGS._(sKey));
		}
		return aDesc.join(' - ');
	},

	/**
	 * Creation de la description d'un sort
	 */
	getSpellDescription: function(oSpell) {
		//{ blueprint: 'p_magbolt', cost: 0, options: 'l1', effects: ['mxmagCA', 'mabldBF', 'mavulCF', 'maillCF'], chances: [ 1, 0.1, 0.25, 0.2 ] },
		var i;
		var aSpellDesc = [];
		var sDesc, sChance;
		for (i = 0; i < oSpell.effects.length; i++) {
			sDesc = this.getEffectDescription(oSpell.effects[i]);
			sChance = '';
			switch (oSpell.chances[i]) {
				case 0:
					continue;
				
				case 1:
					break;
					
				default:
					sChance = ' (' + (100 * oSpell.chances[i]).toString() + '%)';
			}
			aSpellDesc.push(sDesc + sChance);
		}
		return aSpellDesc;
	},
	
	/**
	 * Création de la description des multiple sorts
	 */
	getMultipleSpellDescription: function(aSpells) {
		var oSpell, aDesc = [], oSpellData, aSpellDesc, sLine, aLine;
		for (var i = 0; i < aSpells.length; i++) {
			oSpell = aSpells[i];
			oSpellData = SPELLS_DATA[oSpell.ref];
			aLine = [STRINGS._('~desc_spell_num') + (i + 1).toString()];
			if (oSpell.time) {
				aLine.push(STRINGS._('~desc_spell_charge') + ': ' + (oSpell.time / 1000).toString() + STRINGS._('~med_second'));
			}
			if (oSpellData.cost) {
				aLine.push(STRINGS._('~desc_spell_cost') + ': ' + oSpellData.cost);
			}
			aLine.push(this.getSpellProjectionDescription(oSpellData.options));
			sLine = aLine.join(' - ');
			aSpellDesc = [sLine];
			aSpellDesc = aSpellDesc.concat(this.getSpellDescription(oSpellData));
			aDesc.push(aSpellDesc.join('\n'));
		}
		return aDesc;
	},
	
	/**
	 * Création de la description des multiple sorts
	 */
	getDaggerSpellDescription: function(aSpells) {
		var oSpell, aDesc, oSpellData, aSpellDesc;
		oSpell = aSpells[0];
		oSpellData = SPELLS_DATA[oSpell.ref];
		aSpellDesc = this.getSpellDescription(oSpellData);
		aDesc = [aSpellDesc.join('\n')];
		return aDesc;
	},
	
	/**
	 * Création de la description pour un objet équipé
	 * @param sEffect effet
	 * @return string
	 */
	getWornPropertiesDescription: function(aEffects) {
		var a = [];
		for (var i = 0; i < aEffects.length; i++) {
			a.push(this.getEffectDescription(aEffects[i]));
		}
		return a;
	},
	
	makeString: function(o) {
		return o.properties;
	},

	describe: function(oItem) {
		var sProperties;
		switch (oItem.type) {
			case 'potion': 
			case 'ccc': 
			case 'earings':
			case 'amulet':
			case 'ring':
				sProperties = this.getWornPropertiesDescription(oItem.properties).join('\n');
				break;

			case 'dagger':
				sProperties = this.getDaggerSpellDescription(oItem.spells).join('');
				break;
				
			case 'wand':
				sProperties = this.getMultipleSpellDescription(oItem.spells).join('\n\n');
				break;
				
			default: 
				sProperties = '';
				break;
				
		}
		var sMessage = '';
		var sDIType = 'desc_item_' + oItem.type;
		var sDIItem = 'desc_item_' + oItem.resref;
		
		if (sDIItem in STRINGS.l) {
			sMessage += STRINGS._('~' + sDIItem) + '\n';
		}
		if (sDIType in STRINGS.l) {
			sMessage += STRINGS._('~' + sDIType) + '\n';
		}
		sMessage += '\n' + sProperties;
		
		this.nPreviousMode = this.oGame.nIntfMode;
		this.oGame.oUI.command('Descriptor', 'on', {message: sMessage, title: oItem.getName(), icon: oItem.icon, previousUI: this.oGame.oUI.sScreen});
		this.oGame.nIntfMode = UI.INTFMODE_DESCRIPTOR;
	}
});
