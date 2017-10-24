O2.createObject('MW.BLUEPRINTS_DATA', {
	// mobs
	m_warlock : {
		type : RC.OBJECT_TYPE_MOB,
		tile : "m_warlock_b",
		width : 40,
		height : 64,
		thinker : "MW.Mob",
		fx : 0,
		data : {
			sounds : {
				die : 'x_death'
			},
			speed : 4
		}
	},

	m_succubus:{
		type : RC.OBJECT_TYPE_MOB,
		tile : "m_succubus",
		width : 40,
		height : 64,
		thinker : "MW.Mob",
		fx : 0,
		data : {
			sounds : {
				die : 'x_death'
			},
			speed : 3
		}
	},
	
	m_imp1: {
		type : RC.OBJECT_TYPE_MOB,
		tile : "m_imp1",
		width : 40,
		height : 64,
		thinker : "MW.Mob",
		fx : 0,
		data : {
			sounds : {
				die : 'x_death'
			},
			speed : 4
		}
	},

	m_imp2: {
		type : RC.OBJECT_TYPE_MOB,
		tile : "m_imp2",
		width : 40,
		height : 64,
		thinker : "MW.Mob",
		fx : 0,
		data : {
			sounds : {
				die : 'x_death'
			},
			speed : 4
		}
	},

	m_pumpkin: {
		type : RC.OBJECT_TYPE_MOB,
		tile : "m_pumpkin",
		width : 40,
		height : 64,
		thinker : "MW.Mob",
		fx : 2,
		data : {
			sounds : {
				die : 'x_death'
			},
			speed : 2
		}
	},

	m_bigknight: {
		type : RC.OBJECT_TYPE_MOB,
		tile : "m_bigknight",
		width : 40,
		height : 64,
		thinker : "MW.Mob",
		fx : 0,
		data : {
			sounds : {
				die : 'x_death'
			},
			speed : 3
		}
	},

	p_magbolt : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c2 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c2",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c3 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c3",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c4 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c4",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c5 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c5",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c6 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c6",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c7 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c7",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c8 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c8",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_firebolt : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_fireball",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_fire2',
				die : 'hit_exp'
			}
		}
	},

	p_fireball : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_fireball",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_fire2',
				die : 'hit_exp'
			}
		}
	},

	p_lightbolt : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_lightbolt",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 3,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'amb_gloom'
			}
		}
	},

	p_spell : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_spell",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'hit_spell0',
				die : 'hit_spell1'
			}
		}
	},

	p_spell_c2 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_spell_c2",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'hit_spell0',
				die : 'hit_spell1'
			}
		}
	},

	p_bouncing : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : 'p_bouncing',
		width: 14,
		height : 45,
		thinker : "MW.Mob",
		fx : 2,
		data : {
			sounds : {
				spawn : 'hit_elec',
				die : 'hit_spell1'
			}
		}
	},

	p_icebolt : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_icebolt",
		width: 14,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_ice',
				die : 'hit_ice'
			}
		}
	},

	p_slash : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_slash",
		width: 14,
		height : 16,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_dag'
			}
		}
	},

	o_smoke_white : {
		type : RC.OBJECT_TYPE_PLACEABLE,
		tile : 'o_smoke_white',
		width : 1,
		height : 96,
		thinker : 'MW.Timed',
		fx : 0,
		data : {
			sounds : {
				spawn : 'hit_spell0'
			}
		}
	},

	o_teleport : {
		type : RC.OBJECT_TYPE_PLACEABLE,
		tile : 'o_teleport',
		width : 1,
		height : 96,
		thinker : 'MW.Timed',
		fx : 2,
		data : {
			sounds : {
				spawn : 'fx_teleport'
			}
		}
	},

	o_boom : {
		type : RC.OBJECT_TYPE_PLACEABLE,
		tile : 'o_boom',
		width : 1,
		height : 96,
		thinker : 'MW.Timed',
		fx : 2,
		data : {
			sounds : {
				spawn : 'hit_spell0'
			}
		}
	},
	
	o_expfire : {
		type : RC.OBJECT_TYPE_PLACEABLE,
		tile : 'o_expfire',
		width : 1,
		height : 96,
		thinker : 'MW.Timed',
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_exp'
			}
		}
	},
	
	o_bumporb: {
		type : RC.OBJECT_TYPE_PLACEABLE,
		tile : 'o_bumporb',
		width : 1,
		height : 96,
		thinker : 'MW.Timed',
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_toxic'
			}
		}
	}
});
