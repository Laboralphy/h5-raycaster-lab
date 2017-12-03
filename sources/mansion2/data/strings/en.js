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

        p_maya: {
            title: 'Maya',
            description: 'Steel color eyed, lively little girl. Private collection...'
        },
        p_karen: {
            title: 'Karen',
            description: 'Dark eyed little girl with beautiful long hair, Private collection...'
        },
		p_dorian: {
			title: 'Portrait of Dorian Gray',
			description: 'This painting of a monstrously ugly old man, bears a notch made with a knife.'
		},
		p_zoidberg: {
			title: 'Dr. Zoidberg',
			description: 'Need a good painting idea ? Why not Zoidberg ?'
		},
		p_thunder: {
			title: 'Thunder',
			description: 'This painting depicts a thunder strike.'
		},
		p_nightmare: {
			title: 'The Nightmare',
			description: 'A famous painting of Henry Fuseli. No wonder it is located in this hellish place.'
		},
		p_medusa: {
			title: 'Medusa',
			description: 'The infamous Gorgon, a mythical monstrer with a petrifying gaze.'
		},
		p_succubus: {
			title: 'Succubus',
			description: 'These demons are renowned for their taste for torture and seduction.'
		},
        p_innsmouth_1: {
            title: 'Innsmouth fisherman',
            description: 'This man is no more human. He looks more like a fish than a fisherman.'
        },
        p_innsmouth_2: {
            title: 'Innsmouth lady',
            description: 'Deep eyed lady with pale skin and large mouth.'
        },
        p_innsmouth_3: {
            title: 'Innsmouth folk',
            description: 'A grotesque painting of an old man looking at a monster by the window'
        },
		p_innsmouth_port: {
			title: 'The city of Innsmouth',
			description: 'The town of Innsmouth shelters a cult of Dagon, and is in a horrendous state of decay...'
		},
		p_jeff: {
			title: 'Jeff the killer',
			description: 'Bleached face and insane bloody smile.'
		},
		p_crosses: {
			title: 'Crosses',
			description: 'Is someone nailed on it ?'
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
		},

		w_blind_cultist: {
			title: 'Blind cultist',
			description: 'He was blinded during the blind demon ritual. He died shortly after due to the ritual failure'
		},
		w_conserved_painter: {
			title: 'Conserved painter',
			description: 'She was a skilled painter and she paint many pictures and portraits in this mansion. The cultists did not want her to leave.'
		},
		w_crimson_hood: {
			title: 'Little crimson hood',
			description: 'Lost in the wood, she could not reach her grandmother\'s house... in this reality.'
		},
		w_dark_scholar: {
			title: 'Dark scholar',
			description: 'Fascinated by occult lore, he tried to collect as much knowledge as possible, until he knew too much...'
		},
		w_demented_knife: {
			title: 'Demented knife',
			description: 'Sometimes mental illness cannot just be cured...'
		},
		w_electric_fairy: {
			title: 'Electric fairy',
			description: 'A new divinity is trying to emerge.'
		},
		w_gothic_witch: {
			title: 'Gothic witch',
			description: 'An adept of wicca, she believes in forces of nature, and reject any social conformism.'
		},
		w_grim_reaper: {
			title: 'Grim Reaper',
			description: 'Time is of no importance for the Reaper. At the end all men must die.'
		},
		w_mad_folklorist: {
			title: 'Mad folklorist',
			description: 'He lost his sanity after witnessing the failed summoning of an outer entity.'
		},
		w_mischevious_doll: {
			title: 'Mischevious doll',
			description: 'Human sized doll inhabited by some malevolent spirit. She feels neither compassion nor remorses'
		},
		w_noble_cultist: {
			title: 'Noble cultist',
			description: 'Too many bored and wealthy people fall into decadence and turn themselves to evil worshipping.'
		},
		w_penitentia: {
			title: 'Penitentia',
			description: 'Nothing is known about her. But anything can happen in this world.'
		},
		w_pole_of_skulls: {
			title: 'Pole of skulls',
			description: 'An evil totem. Long ago, it was believed that the spirit could not flee outside the skull, after death'
		},
		w_tormented_grudge: {
			title: 'Tormented grudge',
			description: 'This thing can harm you, even if you watch it on TV.'
		},
		w_voracious_clown: {
			title: 'Voracious clown',
			description: 'Bad, very bad for coulrophobic people.'
		},
		w_wicked_crone: {
			title: 'Wicked crone',
			description: 'A classic figure of the mean old women brewing disgusting potion with lizard tails and toadstools.'
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
