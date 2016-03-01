O2.createObject('BLUEPRINTS_DATA', {
	g_pat: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_head1',
		width: 32,
		height: 96,
		thinker: 'MANSION.GPat',
		fx: 3,
		data: {
			name: 'Pat',
			speed: 1,
			life: 1000,
			cyber: {
				shootprob: 0.333,  // probabilité de tirer un missile lors d'un mouvement de contre attaque
				reaction: 20,	// temps de réaction : plus c'est bas, plus le fantôme est réactif
			},
			sounds: {
				hit: 'e-pat-hit.ogg',
				die: 'e-pat-die.ogg',
				attack: 'e-ghost-attack.ogg'
			}
		}
	},

	g_warami: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_head2',
		width: 32,
		height: 96,
		thinker: 'MANSION.GWarami',
		fx: 3,
		data: {
			name: 'Waramichan',
			speed: 2,
			life: 1500,
			cyber: {
				shootprob: 0.333,  // probabilité de tirer un missile lors d'un mouvement de contre attaque
				reaction: 20,	// temps de réaction : plus c'est bas, plus le fantôme est réactif
			},
			sounds: {
				hit: 'e-warami-hit.ogg',
				die: 'e-warami-die.ogg',
				attack: 'e-ghost-attack.ogg'
			}
		}
	},

	g_dementia: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_head3',
		width: 32,
		height: 96,
		thinker: 'MANSION.GDementia',
		fx: 3,
		data: {
			name: 'Dementia',
			speed: 2,
			life: 2000,
			cyber: {
				shootprob: 0.333,  // probabilité de tirer un missile lors d'un mouvement de contre attaque
				reaction: 20,	// temps de réaction : plus c'est bas, plus le fantôme est réactif
			},
			sounds: {
				hit: 'e-mad-hit.ogg',
				die: 'e-mad-die.ogg',
				attack: 'e-ghost-attack.ogg'
			}
		}
	},
	
	g_angryman: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_head4',
		width: 32,
		height: 96,
		thinker: 'MANSION.G_Chaser',
		fx: 3,
		data: {
			name: 'Angryman',
			speed: 3,
			life: 2500,
			cyber: {
				shootprob: 0.333,  // probabilité de tirer un missile lors d'un mouvement de contre attaque
				reaction: 20,	// temps de réaction : plus c'est bas, plus le fantôme est réactif
			},
			sounds: {
				hit: 'e-gman-hit.ogg',
				die: 'e-gman-die.ogg',
				attack: 'e-ghost-attack.ogg'
			}
		}
	},
	
	g_bloodia: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_head5',
		width: 32,
		height: 96,
		thinker: 'MANSION.G_Chaser',
		fx: 3,
		data: {
			name: 'Bloodia',
			speed: 2,
			life: 3000,
			cyber: {
				shootprob: 0.333,  // probabilité de tirer un missile lors d'un mouvement de contre attaque
				reaction: 20,	// temps de réaction : plus c'est bas, plus le fantôme est réactif
			},
			sounds: {
				hit: 'e-dem-hit.ogg',
				die: 'e-dem-die.ogg',
				attack: 'e-ghost-attack.ogg'
			}
		}
	},
	
	g_edwound: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_head6',
		width: 32,
		height: 96,
		thinker: 'MANSION.G_Chaser',
		fx: 3,
		data: {
			name: 'Edwound',
			speed: 2,
			life: 5000,
			cyber: {
				shootprob: 0.333,  // probabilité de tirer un missile lors d'un mouvement de contre attaque
				reaction: 20,	// temps de réaction : plus c'est bas, plus le fantôme est réactif
			},
			sounds: {
				hit: 'e-mons-hit.ogg',
				die: 'e-mons-die.ogg',
				attack: 'e-ghost-attack.ogg'
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
			speed: 6,
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
