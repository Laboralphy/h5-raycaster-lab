O2.createObject('MANSION.BLUEPRINTS_DATA', {
	g_aging_girl: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_aging_girl',
		width: 32,
		height: 96,
		thinker: 'MANSION.GChaser',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'Aging girl',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/f40-hit',
				die: 'ghosts/specific/f40-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},

	g_bashed_boy: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_bashed_boy',
		width: 32,
		height: 96,
		thinker: 'MANSION.GZigZagTeleRusher',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'Bashed boy',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/b50-hit',
				die: 'ghosts/specific/b50-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},

	g_blond_child: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_blond_child',
		width: 32,
		height: 96,
		thinker: 'MANSION.GRetaliater',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'Blond child',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/f10-hit',
				die: 'ghosts/specific/f10-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},

	g_dark_tears: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_dark_tears',
		width: 32,
		height: 96,
		thinker: 'MANSION.GZigZag',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'Dark tears',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/f30-hit',
				die: 'ghosts/specific/f30-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},

	g_decaying: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_decaying',
		width: 32,
		height: 96,
		thinker: 'MANSION.GZigZagRusher',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'Decaying',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/f45-hit',
				die: 'ghosts/specific/f45-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},

	g_dementia: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_dementia',
		width: 32,
		height: 96,
		thinker: 'MANSION.GChaser',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'Dementia',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/f50-hit',
				die: 'ghosts/specific/f50-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},

	g_eyeball: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_eyeball',
		width: 32,
		height: 96,
		thinker: 'MANSION.GChaser',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'Eyeball',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/b40-hit',
				die: 'ghosts/specific/b40-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},

	g_half_skull: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_half_skull',
		width: 32,
		height: 96,
		thinker: 'MANSION.GChaser',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'Half skull',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/m50-hit',
				die: 'ghosts/specific/m50-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},

	g_hardy: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_hardy',
		width: 32,
		height: 96,
		thinker: 'MANSION.GChaser',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'Hardy',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/m40-hit',
				die: 'ghosts/specific/m40-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},

	g_old_ghoul: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_old_ghoul',
		width: 32,
		height: 96,
		thinker: 'MANSION.GChaser',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'Old ghoul',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/m80-hit',
				die: 'ghosts/specific/m80-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},

	g_severed_jaw: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_severed_jaw',
		width: 32,
		height: 96,
		thinker: 'MANSION.GChaser',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'Severed jaw',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/m60-hit',
				die: 'ghosts/specific/m60-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},

	g_spooky_doll: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_spooky_doll',
		width: 32,
		height: 96,
		thinker: 'MANSION.GChaser',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'Spooky doll',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/doll-hit',
				die: 'ghosts/specific/doll-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},

	g_triple: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_triple',
		width: 32,
		height: 96,
		thinker: 'MANSION.GChaser',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'Triplettes',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/triple-hit',
				die: 'ghosts/specific/triple-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},

	g_white_teeth: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_white_teeth',
		width: 32,
		height: 96,
		thinker: 'MANSION.GChaser',
		fx: 3,
		data: {
			subtype: 'ghost',
			name: 'White teeth',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,
				reaction: 20,
			},
			sounds: {
				hit: 'ghosts/specific/m20-hit',
				die: 'ghosts/specific/m20-die',
				attack: 'ghosts/generic/ghost-attack'
			}
		}
	},






	//////// MISSILES ////////
	p_ecto: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_ecto',
		width: 20,
		height: 96,
		thinker: 'MANSION.Missile',
		fx: 3,
		data: {
			name: 'ectomissile',
			speed: 3,
			sounds: {
				fire: 'fire1',
				explode: 'impact1'
			}
		}
	},
	
	o_flame: {
		type: RC.OBJECT_TYPE_PLACEABLE,
		tile: 'o_flame',
		width: 62,
		height: 62,
		thinker: 'MANSION.Timed',
		fx: 3,
		data: {
			name: 'ectoflame',
			speed: 0,
			sounds: {
				spawn: 'bluefire'
				//fire: 'fire1',
				//explode: 'impact1'
			}
		}
	}
});
