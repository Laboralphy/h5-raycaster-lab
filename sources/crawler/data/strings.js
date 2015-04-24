var STRINGS = {
		
	l: 'en',
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
			if (sKey in STRINGS.l) {
				sDispMsg = STRINGS.l[sKey];
				if (typeof sDispMsg === 'string') {
					return STRINGS._parameterSubstitution(sDispMsg, aParams);
				} else if (typeof sDispMsg === 'object' || ArrayTools.isArray(sDispMsg)) {
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
		
		////// NOTIFICATIONS MESSAGES ////// NOTIFICATIONS MESSAGES ////// NOTIFICATIONS MESSAGES //////
		////// NOTIFICATIONS MESSAGES ////// NOTIFICATIONS MESSAGES ////// NOTIFICATIONS MESSAGES //////
		////// NOTIFICATIONS MESSAGES ////// NOTIFICATIONS MESSAGES ////// NOTIFICATIONS MESSAGES //////
		////// NOTIFICATIONS MESSAGES ////// NOTIFICATIONS MESSAGES ////// NOTIFICATIONS MESSAGES //////
		////// NOTIFICATIONS MESSAGES ////// NOTIFICATIONS MESSAGES ////// NOTIFICATIONS MESSAGES //////
		////// NOTIFICATIONS MESSAGES ////// NOTIFICATIONS MESSAGES ////// NOTIFICATIONS MESSAGES //////
		
		notify_key0_acquired: 'You acquired the blue key. ',
		notify_key1_acquired: 'You acquired the red key.',
		notify_key2_acquired: 'You acquired the green key.',
		notify_key3_acquired: 'You acquired the yellow key.',
		notify_gkey_acquired: 'You acquired a gray key.',
		notify_gkeys_acquired: 'You acquired $0 gray keys.',
		notify_door0_unlocked: 'You unlocked the blue door.',
		notify_door1_unlocked: 'You unlocked the red door.',
		notify_door2_unlocked: 'You unlocked the green door.',
		notify_door3_unlocked: 'You unlocked the yellow door.',
		notify_door_unlocked: 'You unlocked the door.',
		notify_door_lockpicked: 'You lockpicked the door.',
		notify_door_locked: 'This door is locked.',
		notify_door0_locked: 'This door is locked and requires a blue key.',
		notify_door1_locked: 'This door is locked and requires a red key.',
		notify_door2_locked: 'This door is locked and requires a green key.',
		notify_door3_locked: 'This door is locked and requires a yellow key.',
		notify_door_sealed: 'This door is blocked by mystical energies.',
		notify_door_unsealed: 'The door is no more blocked by mystical energies.',
		notify_secret_found: 'You found a hidden place.',
		notify_dungeon_left: 'You escaped the dungeon.',
		notify_dungeon_done: 'You reached the end of the dungeon.',
		notify_inventory_full: 'Your inventory is full.',
		notify_chest_empty: 'This chest is empty.',
		notify_closet_empty: 'This closet is empty.',
		// status
		notify_hungry: 'You are hungry. ',
		notify_starving: 'You are dying of starvation.',
		notify_energy_depleted: 'You are out of energy.',
		notify_hp_low: 'Danger ! Your health is low.',
		notify_energy_low: 'Warning ! Your energy is low.',
		notify_no_weapon: 'You cannot attack : You weild no weapon.',
		notify_no_energy: 'You do not have enough energy to cast spells.',
		
		// got item
		notify_item_pickup: 'You picked up: $0.',
		notify_item_receive: 'You received: $0.',
		notify_item_craft: 'You crafted: $0.',

		// lost item
		notify_item_drop: 'You dropped: $0.',
		notify_item_steal: 'You have been stolen: $0.',
		notify_item_give: 'You gave: $0',
		
		notify_item_no_pickup: 'No item here.',
		
		// exploration
		notify_entering_level: 'Welcome to "$0" on floor $1',
		notify_cant_go_there: 'You are going the wrong way.',
		
		// magic
		notify_magic_cooldown: 'This spell is still charging.',
		notify_magic_oom: 'You need more energy to cast this spell.',
		notify_magic_fail_knock: 'You must cast this spell in front of a locked door.',
		notify_magic_fail_magicmapping: 'You must cast this spell in front of a plain wall.',
		notify_magic_fail_summonfood: 'You must have space in front of you to cast this spell.',
		
		
		// dungeons
		w_forest: 'The Forest',
		w_d1: 'The Tower of Troubles',
		w_mines: 'The Mines',
		w_medusa: 'Underwater halls of Medusa',
		

		
		
		////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES //////
		////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES //////
		////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES //////
		////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES //////
		////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES //////
		////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES ////// ITEM NAMES //////
		
		// items
		item_unidentified_ring: 'Ring (unidentified)',
		item_unidentified_amulet: 'Amulet (unidentified)',
		item_unidentified_wand: 'Wand (unidentified)',
		item_unidentified_earings: 'Earings (unidentified)',
		item_unidentified_dagger: 'Dagger (unidentified)',
		item_unidentified_potion: 'Potion (unidentified)',
		
		item_gold: 'Gold',
		item_pot_heal_1: 'Potion of healing I',
		item_pot_heal_2: 'Potion of healing II',
		item_pot_heal_3: 'Potion of healing III',
		item_pot_regen_1: 'Potion of regeneration I',
		item_pot_regen_2: 'Potion of regeneration II',
		item_pot_regen_3: 'Potion of regeneration III',
		item_pot_ether_1: 'Potion of mana I',
		item_pot_ether_2: 'Potion of mana II',
		item_pot_ether_3: 'Potion of mana III',
		item_pot_star_1: 'Potion of the stars I',
		item_pot_star_2: 'Potion of the stars II',
		item_pot_power_1: 'Potion of power I',
		item_pot_power_2: 'Potion of power II',
		item_pot_power_3: 'Potion of power III',
		item_pot_haste: 'Potion of haste',
		item_pot_esp: 'Potion of weird sight',
		item_pot_vital_1: 'Potion of vitality I',
		item_pot_vital_2: 'Potion of vitality II',
		item_pot_vital_3: 'Potion of vitality III',
		item_pot_luck_1: 'Potion of fortune I',
		item_pot_luck_2: 'Potion of fortune II',
		item_pot_luck_3: 'Potion of fortune III',
		item_pot_antidote: 'Antidote',
		item_pot_remedy: 'Remedy',
		item_pot_cleansing: 'Potion of cleansing',
		item_pot_freedom: 'Potion of freedom',
		item_pot_invisibility: 'Potion of invisibility',

		item_pot_resphy_1: 'Potion of defense I',	
		item_pot_resphy_2: 'Potion of defense II',
		item_pot_resphy_3: 'Potion of defense III',
		item_pot_resfir_1: 'Potion of fire resistance I',
		item_pot_resfir_2: 'Potion of fire resistance II',
		item_pot_resfir_3: 'Potion of fire resistance III',
		item_pot_rescld_1: 'Potion of cold resistance I',
		item_pot_rescld_2: 'Potion of cold resistance II',
		item_pot_rescld_3: 'Potion of cold resistance III',
		item_pot_resele_1: 'Potion of electric resistance I',
		item_pot_resele_2: 'Potion of electric resistance II',
		item_pot_resele_3: 'Potion of electric resistance III',
		item_pot_restox_1: 'Potion of toxic resistance I',
		item_pot_restox_2: 'Potion of toxic resistance II',
		item_pot_restox_3: 'Potion of toxic resistance III',
		item_pot_resmag_1: 'Potion of magic resistance I',
		item_pot_resmag_2: 'Potion of magic resistance II',
		item_pot_resmag_3: 'Potion of magic resistance III',
		item_pot_dispell: 'Potion of dispell magic',
		
		item_amu_luck_1: 'Lucky charm I',
		item_amu_luck_2: 'Lucky charm II',
		item_amu_luck_3: 'Lucky charm III',
		item_amu_deathward: 'Death ward',
		item_amu_antidote: 'Poison ward',
		item_amu_remedy: 'Remedy stone',
		item_amu_cleansing: 'Cleansing stone',
		item_amu_freedom: 'Amulet of freedom',
		item_amu_health: 'Crystal of immunity',

		item_ring_power_1: 'Ring of power I',
		item_ring_power_2: 'Ring of power II',
		item_ring_power_3: 'Ring of power III',
		item_ring_thermdef_1: 'Ring of elements I',
		item_ring_thermdef_2: 'Ring of elements II',
		item_ring_thermdef_3: 'Ring of elements III',
		item_ring_elecdef_1: 'Ring of Faraday I',
		item_ring_elecdef_2: 'Ring of Faraday II',
		item_ring_elecdef_3: 'Ring of Faraday III',
		item_ring_integrity_1: 'Ring of integrity I',
		item_ring_integrity_2: 'Ring of integrity II',
		item_ring_integrity_3: 'Ring of integrity II',
		item_ring_btm_1: 'Ring of spirit',
		
		item_ear_magres_1: 'Earings of magic resistance I',
		item_ear_magres_2: 'Earings of magic resistance II',
		item_ear_magres_3: 'Earings of magic resistance III',
		item_ear_pharma_1: 'Earings of pharmacology I',
		item_ear_pharma_2: 'Earings of pharmacology II',
		item_ear_pharma_3: 'Earings of pharmacology III',
		item_ear_magplus_1: 'Earings of intelligence I',
		item_ear_magplus_2: 'Earings of intelligence II',
		item_ear_magplus_3: 'Earings of intelligence III',
		item_ear_affmag_1: 'Earings of arcane brillance I',
		item_ear_affmag_2: 'Earings of arcane brillance II',
		item_ear_affmag_3: 'Earings of arcane brillance III',
		
		
		item_dag_steel: 'Steel dagger',
		item_dag_kopper: 'Copper dagger',
		item_dag_gawld: 'Golden enchanted dagger',
		item_dag_brass: 'Brass dagger',
		item_dag_jade: 'Jade dagger',
		item_dag_sylver: 'Silver enchanted dagger',
		
		item_ccc_h2o: 'Water',
		item_ccc_bread: 'Bread',
		item_ccc_cake: 'Cake',
		item_ccc_herb0: 'Cooking herbs',
		item_ccc_herb1: 'Medicinal herbs',
		item_ccc_herb2: 'Blood herbs',
		item_ccc_herb3: 'Eridium herbs',
		item_ccc_herb4: 'Golden herbs',
		item_ccc_herb5: 'Dark herbs',
		item_ccc_vegs: 'Vegetables',
		item_ccc_meat: 'Raw meat',
		item_ccc_meal: 'Cooked meal',
		
		item_wand_yce_1: 'Wand of Frost',
		item_wand_fyre_2: 'Wand of Fire',
		item_wand_lyte_3: 'Wand of Energy',

		
		
		////// DESCRIPTION SECTION ////// DESCRIPTION SECTION ////// DESCRIPTION SECTION //////
		////// DESCRIPTION SECTION ////// DESCRIPTION SECTION ////// DESCRIPTION SECTION //////
		////// DESCRIPTION SECTION ////// DESCRIPTION SECTION ////// DESCRIPTION SECTION //////
		////// DESCRIPTION SECTION ////// DESCRIPTION SECTION ////// DESCRIPTION SECTION //////
		////// DESCRIPTION SECTION ////// DESCRIPTION SECTION ////// DESCRIPTION SECTION //////
		////// DESCRIPTION SECTION ////// DESCRIPTION SECTION ////// DESCRIPTION SECTION //////
		
		
		// item type description
		desc_item_ring: 'When worn this ring applies :',
		desc_item_earings: 'When worn this earing applies :',
		desc_item_amulet: 'When worn this amulet applies :',
		desc_item_dagger: 'This dagger applies the following effects :',
		desc_item_potion: 'When drunk this potion applies :',
		desc_item_ccc: 'When consumed this ingredient applies :',
		desc_item_wand: 'This wand casts one of the following spell (according to the charging time) :',
		
		// more specific item description
		// misc
		desc_item_gold: 'Pieces of precious metal. The more you have, the higher your score is.',
		// rings
		desc_item_ring_power_1: 'A nice that increases your damage output.',
		// ccc
		desc_item_ccc_meal: 'A delicious meal. Nom nom nom !',
		
		
		desc_effect_ahld : "Hold",
		desc_effect_aroo : "Root",
		desc_effect_asnr : "Slow down movement",
		desc_effect_avul : "Increase damage taken",
		desc_effect_awea : "Decrease damage output",
		desc_effect_aill : "Reduce self-healing efficiency",
		desc_effect_abld : "Blindness",
		desc_effect_acnf : "Confusion",
		desc_effect_adhp : "Decrease health",
		desc_effect_ajnx : "Decrease luck",
		desc_effect_admp : "Decrease magic",
		desc_effect_ahun : "Speed up food consumption",

		desc_effect_bpow : "Increase damage output",
		desc_effect_bhst : "Speed up movement",
		desc_effect_bpha : "Increase self-heal efficiency",
		desc_effect_binv : "Ignore damage taken",
		desc_effect_besp : "Detect invisible enemies",
		desc_effect_bclk : "Invisibility",
		desc_effect_bvel : "Speed up weapon charge",
		desc_effect_beco : "Decrease magic consumption",
		desc_effect_bxhp : "Fortify health",
		desc_effect_blck : "Fortify luck",
		desc_effect_bxmp : "Fortify magic",
		desc_effect_bsfc : "Slow food consumption",

		desc_effect_rant : "Remove poison effects",
		desc_effect_rhea : "Restore health",
		desc_effect_rbod : "Remove body ailments",
		desc_effect_rmin : "Remove mind afflictions",
		desc_effect_rmov : "Remove movement afflictions",
		desc_effect_rene : "Restore magic",
		desc_effect_rfdp : "Restore food points",

		desc_effect_rphy : "Resist physical damage",
		desc_effect_rfir : "Resist fire damage",
		desc_effect_rcld : "Resist cold damage",
		desc_effect_rele : "Resist electricity damage",
		desc_effect_rtox : "Resist toxic damage",
		desc_effect_rmag : "Resist arcane damage",
		desc_effect_rdth : "Resist instant death",

		desc_effect_xphy : "Damage (physical)",
		desc_effect_xfir : "Damage (fire)",
		desc_effect_xcld : "Damage (cold)",
		desc_effect_xele : "Damage (electricity)",
		desc_effect_xtox : "Damage (toxic)",
		desc_effect_xmag : "Damage (arcane)",
		desc_effect_xdth : "Instant death",
		desc_effect_xene : "Waste magic",
		desc_effect_xfdp : "Starve",

		desc_effect_disp : "Dispell",
		desc_effect_null : "Null",
		
		desc_item_level: 'level',
		
		desc_spell_cost : 'Cost',
		desc_spell_count : 'This item has many spells.',
		desc_spell_num : '#',
		desc_spell_charge : 'Charge time',
		desc_spell_project : 'Type',
		desc_spell_project_l1: 'single shot',
		desc_spell_project_l3: 'triple shot',
		desc_spell_project_l5: 'fivefold shot',
		desc_spell_project_w1: 'waveshot',
		desc_spell_project_w2: 'double waveshot',
		desc_spell_project_w3: 'triple waveshot',
		desc_spell_project_r: 'erratic',
		desc_spell_project_h: 'knockback',
		desc_spell_project_b: 'bouncing',
		desc_spell_project_a: 'area of effect',
		
		
		////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES //////
		////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES //////
		////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES //////
		////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES //////
		////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES //////
		////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES //////
		
		// basic
		attr_vitality: 'Vitality',
		attr_hp: 'HP',
		attr_speed: 'Move speed',
		attr_power: 'Power',
		attr_energy: 'Energy',
		attr_mp: 'MP',

		// food
		attr_foodp: 'Food points',
		attr_foodc: 'Food consumption',
		attr_foodmax: 'Food capacity',

		// damage resistances
		attr_drphysical: 'Armor',
		attr_drfire: 'Resist Fire',
		attr_drcold: 'Resist Cold',
		attr_drelectricity: 'Resist Electricity',
		attr_drtoxic: 'Resist Toxic',
		attr_drmagical: 'Resist Magic',

		// afflictions
		attr_dead: 'Dead',
		attr_rooted: 'Rooted',
		attr_vulnerability: 'Vulnerability',
		attr_disease: 'Disease',
		attr_blind: 'Blind',
		attr_held: 'Held',
		attr_snared: 'Snared',
		attr_confused: 'Confused',

		// blessings
		attr_antidote: 'Immune to poison',
		attr_pharma: 'Healing efficiency',
		attr_hasted: 'Hasted',
		attr_clearmind: 'Immune to mind afflictions',
		attr_health: 'Immune to body ailments',
		attr_freedom: 'Freedom of movement',
		attr_invulnerable: 'Invulnerable',
		attr_invisible: 'Invisible',
		attr_esp: 'Detection',
		attr_luck: 'Fortune',
		
		// special
		attr_apnea: 'Apnea',
		attr_maxapnea: 'Apnea capacity',
		
		
		
		
		
		// user interface
		win_loading: 'Loading',
		win_inventory: 'Inventory',
		win_charsheet: 'Character sheet',
		win_mainmenu: 'Main menu',
		win_craft: 'Crafting an item',
		win_craft_progress: 'Crafting progression',
		win_information: 'Information',
		win_dialog: 'Message',
		win_book: 'Book',
		win_playersheet: 'Character sheet',
		win_shop: 'Buy somethin\' will ya ?',
		win_shop_soldout: 'Sold out',
		
		
		mmenu_newgame: 'New game',
		mmenu_continue: 'Continue',
		mmenu_htp: 'How to play',
		mmenu_credits: 'Credits',
		mmenu_hiscores: 'High scores',
		
		m_pause: 'PAUSE',
		m_confirmdropitem: 'Drop this item on the floor ? ',
		m_crafting_in_progress: 'You are crafting a new item...',
		m_craft_success: 'You have successfuly crafted an item.',
		m_craft_more: 'You cannot craft this item at the moment. You need more : \n',
		m_nosave: 'There is no previously saved game here.',
		m_youdied: 'You died... With a score of $0.\n\nChoose "Continue" on the main menu to restore your game from the begining of this level.',
		m_relic: 'Congratulations ! Your courage and determination have paid. You have found the legendary Tome of Power ! Your quest is over.\nYour score is : $0',
		m_whatisyourname: 'To register your score in the hall of fame, enter your name.',
		m_shop_nogold: 'This item is too expensive. You don\'t have enough money.',
		m_cheat_prompt: 'Speak Friend and Enter...',
		
		// effect description
		med_applies: 'applies',
		med_grants: 'grant',
		med_permanent: 'permanent',
		med_second: 's',
		med_overtime: ' over ',
		
		key_gen_close: 'Close',
		key_book_prev: 'Prev. page',
		key_book_next: 'Next page',
		key_inv_use: 'Use/Equip',
		key_inv_look: 'Look',
		key_inv_drop: 'Drop',
		key_inv_sort: 'Sort',
		key_dlg_quit: 'Menu',
        key_craft_go: 'Craft',
        key_craft_prev: 'Scroll up',
        key_craft_next: 'Scroll down',
        key_endgame: 'End game',
        key_shop_buy: 'Buy',
        key_shop_sell: 'Sell',

		key_craftprogress: 'ESC: Abort and close',
		key_craftmsg: 'ESC: Close',
		key_craft: 'ESC: Close   UP/DOWN: Select   ENTER: Craft',
		key_closedialog: 'ESC: Close',
		key_closeplayersheet: 'ESC/P: Close',
		key_mainscreen_html: '[<b>E</b> Inventory] - [<b>P</b> Character sheet] - [<b>I</b> View last messages] - [<b>F11</b> Spell book] - [<b>F12</b> Save/Quit]',
		
		
		// CUTSCENES //// CUTSCENES //// CUTSCENES //// CUTSCENES //// CUTSCENES //// CUTSCENES //
		
		cs0_advwalking0: 'The Spell Book of Power...              ',
		cs0_advwalking1: 'I have it in my possession.',
		cs0_advwalking2: 'I must run and deliver it at the Arcane Sanctuary.',
		cs0_advlost0: 'Lost again...',
		cs0_advlost1: 'I hope I won\'t be ambushed.',

		cs0_ambush0: 'Freeze ! Give me the Spell Book of Power, puny worm.',
		cs0_ambush1: 'You want it, you take it, or else, out of my way.',
		cs0_ambush2: 'You want a fight huh ? Ok then, Let me show you.',
		cs0_ambush3: 'Har har, just give me the Spell Book, you moron !',

		cs0_advangry0: 'What the fuck...',
		cs0_advangry1: 'Ok go... Run and hide to your shabby dungeon...',
		cs0_advangry2: '... I\'ll take the Spell Book back from your corpse.',
		cs0_advangry3: 'THIS IS WAR !!!             ',
		
		// BOOKS //// BOOKS //// BOOKS //// BOOKS //// BOOKS //// BOOKS //// BOOKS //// BOOKS //

		book_of_the_keys: {
			title: 'The book of the keys',
			level: 1,
			images: ['resources/gfx/books/book_of_the_keys.png'],
			pages: [
				"Dungeon doors are sometimes locked. You'll need keys to open such doors. " +
				"There are 5 types of keys. The red, blue, green and yellow keys open the " +
				"color matching doors, but they can only be used inside the level you found them." +
				"The fifth type, the gray key, works much like a picklock device and can be used " +
				"on any gray locked door.You can stack gray keys and save them for a later use."
			]
		},

		book_of_cooking: {
			title: "The book of cooking",
			level: 1,
			images: ['resources/gfx/books/book_of_cooking.png'],
			pages: ["Good adventurers never neglect having a good meal before going deep into dungeons. Learn to cook meals and " +
			"You'll never fear of dying of starvation.\n"+
			"For a good meal, you'll need these ingredients :\n"+
			"Raw meat - Vegetables - Cooking herbs - Water.\n"+
			"If you have all of them, activate any fireplace or other hot places to cook your meal. Bon appétit."
			]
		},

		book_of_the_keyboard: {
			title: "The book of the keyboard",
			level: 1,
			images: null,
			pages: ["Remember the most important keys on your keyboard. Press E to open an inventory window. " +
			"Press F5 to save your game and exit to the main menu. " +
			"Press SPACE to activate things in game, like doors, bookshelves, chest or lootbags. "
			]
		},

		book_of_magical_energy: {
			title: "The book of magical energy",
			level: 1,
			images: ['resources/gfx/books/book_of_magical_energy.png'],
			pages: ["Your magical abilities to cast missiles with a wand are limited by a pool of magic points. You consume points each time you cast a missile. " +
			"Should you ever run out of magic points, you'll won't be able to cast missile anymore.	To restore your magic points, drink a potion of mana."
			]
		},

		book_of_the_dagger: {
			title: 'The book of the dagger', 
			level: 1,
			images: ['resources/gfx/books/book_of_the_dagger.png'],
			pages: ["A dagger is a very short sword. Everyone can use a dagger.	You'll need no special ability to attack foes with such a weapon. " +
			"It's very useful when you want to spare your magical energy. Some rare daggers are very sharp and deal a lot of damage. " +
			"However keep in mind that the limited range of the blade is risky when facing to ranged or heavy armored attackers."
			]
		},

		book_of_the_wand: {
			title: 'The book of the wand',
			level: 1,
			images: ['resources/gfx/books/book_of_the_wand.png'],
			pages: ["Your wand is your primary offensive weapon. It fires missiles and consumes magic points. " +
			"Some wands have special attacks like triple fireball, or bumping missiles. Keep the attack button pressed to charge your weapon a few seconds " +
			"and then release the attack button to cast powerful missiles."
			]
		},

		book_of_alchemy: {
			title: 'The book of alchemy',
			level: 1,
			images: ['resources/gfx/books/book_of_alchemy.png'],
			pages: ["Veteran adventurers learn to brew potions. Potions are magical beverages you drink in order to gain strength or ability enhancements for a short period of time. " + 
			"It's useful in combat. With the adequate potion you can deal or sustain more damage, you can move faster or you can regain health points. ",

			"If you find medicinal or magical herbs you may brew your own potions using an alchemy desk. But before that, you must find recipes. " +
			"Recipes can ben found in alchemy book, on alchemy labs bookshelves."
			]
		},

		book_of_the_spacebar: {
			title: 'The book of the space bar',
			level: 1,
			images: null,
			pages: ["The space bar is a key on your keyboard, the biggest one. This key is used in the game to activate things like alchemy desks (and open a crafting interface) or bookshelves (and open a book). " +
			"Space bar is also used to pick up dropped items, open chest, doors, and secret passages..."
			]
		},

		book_of_the_inventory: {
			title: 'The book of the inventory',
			level: 1,
			images: null,
			pages: ["Adventurers have bag to store items in. To open your bag and see what is inside, press the E key on your keyboard. " +
			"The inventory window will popup. Use the mouse to select an item. Double click on an item to use/equip/consume " +
			"the selected item (provided that it is usable, equipable or consumable). "
			]
		},
		
		book_of_the_story: {
			title: 'The story so far...',
			level: 1,
			images: [
			'resources/gfx/books/book_of_story0.png',
			'resources/gfx/books/book_of_story3.png'
			],
			pages: [
			"Welcome adventurer ! You are an adventurer versed in the arts of magic.\n" +
			"You were given the quest of carrying an Ancient Spell Book of Power and delivering it at the Arcane Sanctuary.\n\n" +
			"Unfortunatly, you were ambushed in a dark forest and a Weird Warlock stole the book from you.",
			
			"You follow your aggressor\'s footprints that lead to a dark ruined keep deep into the forest. " +
			"That's the Warlock's lair for sure !\n\n" +
			"You shall have revenge ! You decide to enter the dungeon and take the Spell Book back from the Warlock !\n"
			]
		},
		
		book_of_spells: {
			title: 'The book of spells',
			level: 1,
			images: [
			         	'resources/gfx/books/book_spells_info.png',
						'resources/gfx/books/book_spells_vampyre.png',
						'resources/gfx/books/book_spells_teleport.png',
						'resources/gfx/books/book_spells_knock.png',
						'resources/gfx/books/book_spells_death.png',
						'resources/gfx/books/book_spells_map.png',
						'resources/gfx/books/book_spells_food.png',
						'resources/gfx/books/book_spells_reflect.png',
						'resources/gfx/books/book_spells_light.png',
						'resources/gfx/books/book_spells_timestop.png'
			],
			pages: [
			"Spells are instantly cast using the Function keys (F1, F2...) on the keyboard.\n\n" +

			"Targetted spells : Such spells need accuracy and must be selected first by hitting their corresponding Function key. " +
			"Then, just aim and click ont the Right mouse button (or hit the V Key) to cast the spell.",
			
			"Life Drain\n\n" +
			"You may want to use this spell if your health becomes low. " +
			"Casting this spell will grant you a temporary Vampyre effect, your following succesful attacks with your wand or your dagger will devour " +
			"your enemy's health points and restore your own health points.",
			
			"Teleport\n\n" +
			"Teleportation allows you to instantly move foward until you reach any wall. "+
			"You are rotated by 180 degrees so the wall you are bumping into will be behind you.\n\n" +
			"This is a targetted spell (see on the first page). ",
			
			"Knock\n\n" +
			"This spell can unlock any locked door. Just place yourself in front of the door and close to it." +
			"Then cast the spell, the door should be instantly unlock.",
			
			"Death Spell\n\n" +
			"This spell cast an single invisible beam. Any creature hit by the beam is instantly killed.\n\n" +
			"This is a targetted spell (see on the first page). ",
			
			"Magic Mapping\n\n" +
			"A useful spell to locate yourself in the dungeon. " +
			"This spell draws maps on the wall. Find a good plain wall and cast the spell to print the map on the wall.\n" +
			"The map will show doors, locked doors, keys, chests, and even secret passage. The map will also be centered on your current position.",
			
			"Summon food\n\n" +
			"You should use this spell if you are diying of starvation. " +
			"This spell is used to summon food. After casting the spell, a bag of food will appear at your feet and will contain break or cake. " + 
			"All you have to do is picking up the bag and consume the food.",
			
			"Reflection Field\n\n" +
			"This spell raises a reflection field around the caster. This field causes the incomming hostile attacks to be reflected back. " +
			"Only a fraction of the damage is dealt to the caster. The negative effects convoyed by the missile are also diminished. " +
			"This reflection field works against missiles and melee attacks.",
			
			"Light\n\n" +
			"When cast, this spell augments light around the caster. Some levels are dark, and could be very difficult (if not impossible) to explore. " + 
			"This spell is essential in such case.",
			
			"Time Stop\n\n" +
			"Time is temporary halted when this spell is cast. The entire world is frozen. Only the caster may move and attack. " + 
			"The spell lasts 9 seconds (according to the caster\'s point of view). " +
			"If the caster shoots missiles, they will be frozen as well, until the spell ends."
			]
		},
		
		
		craft_brew_recipe: { 
			title: 'Recipe : $0',
			level: 1,
			images: null,
			pages: [
			"Browsing the shelves, you found a book of alchemy, explaining how to brew a $0. You may brew this potion at any alchemy desk providing you have the required components."
			]
		},
		
		
		
		cs1_credits : 
			'-------------------\n' +
			'REIKASTER UNDERLAND\n' +
			'-------------------\n\n\n' +
			
			'////// STAFF CREDITS //////\n' +
			'\n' +
			'Programming & Graphics\n' + 
			'- Raphaël Marandet (raphael.marandet@gmail.com)\n\n' +

			'////// OTHER CREDITS //////\n' +
			'\n' +
			
			'Audio ambience\n' +
			'- Yewbic (http://www.freesound.org/people/yewbic/)\n\n' +
			
			'Music\n' + 
			'- Bjorn A. Lynne (PRS) http://www.shockwave-sound.com (Free licence for non commercial projects)\n\n' +
			
			'////// SOFTWARES //////\n' +
			'\n' +
			'Audio & music\n' +
			'- Audacity (optimizing sound files)\n' +
			'- Timidity++ (Converting midi files to audio files).\n' +
			'\n' +			
			'Artwork\n' + 
			'- Openoffice Draw (Texture creation)\n' + 
			'- Gimp (Texture arrangement)\n' +
			'- Povray (Rendering sprites)\n' +
			'- ImageMagick (Spritesheet)\n' + 
			'\n' +
			'\n' +
			'\n' +
			'\n' +
			'\n' +
			'Thank you for playing.',
		
			
		mspage_icon: 'Send a comment',
		mspage_button_close: 'Return to<br />the game',
		mspage_button_close: 'Close',
		mspage_p1_title: 'Help me improve the game !',
		mspage_p1_text: 'Help me improve the game balance and stability by sending me comments and bug reports. ' +
		'If you have questions or suggestions, add your name and email address in your message so I can answer you.<br />' +
		'You may write in english or french.',
		mspage_p1_label: 'Message / Comments :',
		mspage_p1_button_send: 'Send',
		mspage_p1_thanx: 'Message sent. Thank for your feedback.',
		mspage_p1_error: 'There was an error while sending your message. The server or your connection maybe down.',

		mspage_p2_title: 'The Bravest Mages !',
		mspage_p2_text: 'Your score is : <b style="font-size: 150%">$0</b>.<br />You are ranked <b>#$1</b>.<br />Enter your name to register your score.',
		
		
		none: 'none'
		
	},
	
	
	fr: {
		
		cs0_advwalking0: 'Le Grimoire du Pouvoir...              ',
		cs0_advwalking1: 'Je l\'ai en ma possession.',
		cs0_advwalking2: 'Je dois l\'apporter au plus vite au sanctuaire des arcanes.',
		cs0_advlost0: 'Zut encore paumé...',
		cs0_advlost1: 'J\'espère que je ne vais pas tomber dans une embuscade.',

		cs0_ambush0: 'Halte ! Donne-moi le Grimoire du Pouvoir, gros nul !',
		cs0_ambush1: 'Si tu le veux, viens le prendre, ou dégage de mon chemin !',
		cs0_ambush2: 'Tu veux la baston ? je vais m\'occuper de ton cas.',
		cs0_ambush3: 'A moi le Grimoire ! Bien fait pour ta gueule, tocard !',

		cs0_advangry0: 'Le sale petit enculé...',
		cs0_advangry1: 'Il peut toujours se planquer dans son donjon pourri...',
		cs0_advangry2: '... Je récupèrerai le Grimoire sur son cadavre.',
		cs0_advangry3: 'C\'EST LA GUERRE !!!             ',
		
		book_of_the_story: {
			title: "L'histoire commence...",
			level: 1,
			images: [
			'resources/gfx/books/book_of_story0.png',
			'resources/gfx/books/book_of_story3.png'
			],
			pages: [
				"Bienvenue aventurier ! Vous êtes un aventurier versé dans les arts magiques. Et vous " +
				"avez reçu la quête rapporter l'Ancien Grimoire de Pouvoir au Sanctuaire des arcanes. " +
				"Le soucis c'est que vous êtes tombé dans une embuscade, et un Etrange Sorcier vous a volé le Grimoire.",

				"Vous suivez les traces de votre aggresseur, ce qui vous mène à un sombre fortin en ruine au plus profond de la forêt." +
				"Ca doit être le repaire du Sorcier !\n\n" +
				"L'heure de la vengence a sonné ! Vous allez pénétrer dans ce donjon et récupérer le grimoire volé."
			]
		}
	}
};
