/**
 * La table des loots
 * chaque entrée représente un theme de loot
 * un insecte ne droppera pas la même chose qu'un sorcier
 */

O2.createObject('LOOT_DATA', {

	m_bigface: {
		chances: {
			0: 1,
			1: 1
		},
		items: {
			gold:				6,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},
	
	m_madface: {
		chances: {
			0: 1,
			1: 1
		},
		items: {
			gold:				6,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},
	
	m_bigarmor: {
		chances: {
			0: 1,
			1: 1
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_bigpirate: {
		chances: {
			0: 1,
			1: 1
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_acidblob: {
		chances: {
			0: 1,
			1: 1
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_fireblob: {
		chances: {
			0: 1,
			1: 1
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_wasp: {
		chances: {
			0: 3,
			1: 1
		},
		items: {
			ccc_herb0:			1,
			ccc_herb1:			2
		}
	},

	m_raven: {
		chances: {
			0: 1,
			1: 1
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_imp1: {
		chances: {
			0: 1,
			1: 1
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_imp2: {
		chances: {
			0: 1,
			1: 1
		},
		items: {
		gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_phanto: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_turret: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
		gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_spider: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_cube: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_pumpkin: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_warlock: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_warlock2: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_myco: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_myco2: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_myco3: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_pira: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_medusa: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_bigfaceboss: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_bigarmorboss: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},

	m_warlockboss: {
		chances: {
			0: 1,
			1: 3
		},
		items: {
			gold:				10,
			ccc_bread:			4,
			ccc_meat:			2
		}
	},
	
	m_medusaqueen: {
		chances: {
			1: 1
		},
		items: {
			wand_lyte_3:		1
		}
	},
	
	
	// Sort d'invocation de nourriture
	spell_summon_food: {
		chances: {
			1: 1
		},
		items: {
			ccc_bread:			6,
			ccc_cake:			3,
			ccc_meal:			1
		}
	},

	
	// Table de loot pour petit niveau, avec surtout des objets de première nécessité
	// des potions de vie, de mana, des clés grise et des légumes.
	// 40% de chance d'avoir 2 items
	basic_chest : {
		chances: {
			0: 1,
			1: 5,
			2: 4
		},
		items: {
			GKEY:				5,
			'GKEY*2':			2,
			
			gold:				20,
			'gold*2':			5,
			
			// commun 30
			pot_heal_1:			9,
			pot_heal_2:			3,
			pot_regen_1:		5,
			pot_ether_1:		10,
			pot_ether_2:		3,

			// Plus rare 17
			pot_power_1:		2,
			pot_vital_1:		2,
			pot_vital_2:		1,
			pot_luck_1:			1,
			pot_antidote:		4,
			pot_resphy_1:		1,
			
			// craft
			ccc_h2o:			5,
			ccc_bread:			4,
			ccc_cake:			3,
			ccc_herb0:			3,
			ccc_meat:			2,
			ccc_vegs:			3
		}
	},
	
	basic_bigchest : {
		chances: {
			3: 1,
			4: 1
		},
		items: {
			gold:				20,
			'gold*2':			5,
			'gold*3':			5,
			'gold*4':			5,
			
			// commun 30
			pot_heal_1:			9,
			pot_heal_2:			3,
			pot_regen_1:		5,
			pot_ether_1:		10,
			pot_ether_2:		3,

			// Plus rare 17
			pot_power_1:		2,
			pot_vital_1:		2,
			pot_vital_2:		1,
			pot_luck_1:			1,
			pot_antidote:		4,
			pot_resphy_1:		1,
			pot_resfir_1:		1,
			pot_restox_1:		1,
			pot_resmag_1:		1,	
			pot_dispell:		1,
			pot_remedy:			1,
			pot_cleansing:		1,
			pot_freedom:		1,
			pot_star_1:			1,
			pot_haste:			1,

			// craft
			ccc_h2o:			5,
			ccc_bread:			4,
			ccc_cake:			3,
			ccc_herb0:			3,
			ccc_meat:			2,
			ccc_vegs:			3
		}
	},
	
	basic_closet : {
		chances: {
			0: 4,
			1: 5,
			2: 4
		},
		items: {
			ccc_h2o:			5,
			ccc_herb1:			9,
			ccc_herb2:			3,
			
			pot_luck_1:			1,
			pot_antidote:		2,
			pot_resphy_1:		1,
			pot_resfir_1:		1,
			pot_restox_1:		1,
			pot_resmag_1:		1,	
			pot_dispell:		1
		}
	}



// magic : monstre de type magique, possède quelque objets magique 

});
