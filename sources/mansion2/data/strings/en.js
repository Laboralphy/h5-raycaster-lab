/**
 * @const MANSION
 * @property {object} MANSION.STRINGS_DATA_EN
 * the displayable strings database in english
 */
O2.createObject('MANSION.STRINGS_DATA_EN', {
	
	// Message display during load level
	RC: {
		l_lvl: 'loading : level geometry',
		l_gfx: 'loading : graphic resources',
		l_shd: 'shading : textures and sprites',
		l_tag: 'level tag processing',
		l_end: 'done',
	},
	
	// Message displayed during combat mode
	SHOTS: {
		core: 'Core shot',
		close: 'Close shot',
		fatal: 'Fatal frame',
		zero: 'Zero shot',
		double: 'Double shot',
		triple: 'Triple shot',
		multiple: 'Multiple shot',
		score: 'Score +'
	},

	SUBJECTS: {
		// PAINTINGS
		p_skull_monk: {
			title: 'Skull masked monk',
			description: 'Neither really a monk nor really a mask. A scholar who tried to obtain eternal life, but failed in the attempt.'
		},
		p_blood_moon: {
			title: 'Blood moon',
			description: 'The moon is pretty in red. And so think most nocturnal creatures.'
		},
		p_beatrice: {
			title: 'Beatrice the witch',
			description: 'A powerful sorceress, she claimed to have lived a thousand years.'
		},
		p_miku: {
			title: 'Miku and her brother',
			description: 'She could not save him. He disappeared in the depths of the Himuro mansion.'
		},
		p_slenderman: {
			title: 'Slenderman',
			description: 'A supernatural creature with nebulously defined characteristics and abilities.'
		},

		p_nyarlathotep : {
			title: 'Nyarlathotep',
			description: 'A monstrous figure, a messenger of unspeakable unholy entities from beyond our space and time.'
		},


		// CLUES
		c_sigil_exit: {
			title: 'A strange book',
			description: 'A strange book appeared on the sigil photo, the two things could be related.'
		},
		
		// WRAITH
		w_cowled_skull: {
			title: 'Cowled skull',
			description: 'He eagerly seeks in the afterlife the secret he could not recover during life.'
		},

		w_petrified_medusa: {
			title: 'Medusa',
			description: 'A representation of the infamous gorgon.'
		},

		w_twisted_novellist: {
			title: 'Twisted novellist',
			description: 'He wrote quite a lot about evil books and dark rituals... He died violently while reading the Vermis Mysterii.'
		},

		w_stray_dancer: {
			title: 'Stray dancer',
			description: 'She ventured too far in the woods during and dark and misty night. She still searches how to get out.'
		}
	},

	// something happened
	EVENTS: {
		item: "You acquired : $item",
		locked: "This door is locked. You need : $item",
		curselocked: "This door is blocked by a mysterious force.",
		unlock: "You unlocked the door with : $item",
		mystphoto: "You store the mysterious photo in your album."
	},

	// The names of all items
	ITEMS: {
		// keys
		key_cabin_s: 'Cabin key',
		key_main_door: 'Main door key',
		key_backyard: 'Backyard key',

		// book
		book_sigils: 'Tome of Sigils',
		book_reglas: 'Las Reglas de Ruina'
	},

	INTRO: {
		txforest: 'A cursed forest...',
		txcult: 'An evil cult...',
		txworsh: '...worshippers of Dark Gods...',
		txmans: '...their abandoned mansion is\nnow haunted by vengeful spirits.',
		txheap: 'Heaps of powerful and dangerous\ntomes of black magic.',
		txgetem: 'Recover these lost books before\nthey fall into the wrong hands !'
	},

	LEVELS: {
		tutorial: {
			hint_shoot_painting: 'Take a picture of this painting !',
			hint_pickup_page: 'Your goal is to recover fragments of manuscript like this one.',
			hint_ghost_incoming: "You have attracted a vengeful spirit's attention.",
			hint_exit: "Left-click to exit level.",
			hint_left_click: "Left-click is used to open doors, and pick up items.",
			hint_see_exit: "You found the exit !",
			hint_pickup: "Left-click to pick up this item.",
			hint_shoot_clue: "Take a photo of strange symbols and sigils to get clues.",

            desc_rotten_clothes: "Lots of stinking clothes in this drawer.",
            desc_vase: "A dusty empty vase.",
            desc_budd_face: "A multifaced buddha statue."
		}
	},
	
	UI: {
		empty_album: 'Empty album',
		back: '↩ back',
		prev: '◀prev',
		next: 'next▶',
		menu: '↩ menu',
		menu_title: 'Menu',
		menu_options: {
			mo_album: 'Album',
			mo_notes: 'Books',
			mo_status: 'Status'
		},
		statuspad_title: 'Status',
		album_title: 'Album',
		notes_title: 'Books',
		perm_bonus: '[permanent effect]',
		sort: {
			dateAsc: '▲date',
			typeAsc: '▲type',
			dateDesc: '▼date',
			typeDesc: '▼type'
		}
	},

	ATTRIBUTES: {
        resistance: 'Defense',
		power: 'Power',
		vitality: 'Sanity',
		speed: 'Speed',
		sight: 'Sight',
	}

});
