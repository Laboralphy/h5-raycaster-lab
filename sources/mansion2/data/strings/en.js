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
		// paintings
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
		}
	},

	// something happened
	EVENTS: {
		item: "You acquired : $item",
		locked: "This door is locked. You need : $item",
		curselocked: "This door is blocked by a mysterious force.",
		unlock: "You unlocked the door with : $item",
	},

	// The names of all items
	ITEMS: {
		// keys
		key_cabin_s: 'Cabin key',

		// book
		book_sigils: 'Tome of Sigils',
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
			hint_pickup: "Left-click to pick up this item."
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
			mo_notes: 'Notes',
			mo_help: 'Help'
		},
		album_title: 'Album',
		notes_title: 'Notes'
	}

});
