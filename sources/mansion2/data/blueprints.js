O2.createObject('BLUEPRINTS_DATA', {
	g_head1: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_head1',
		width: 32,
		height: 96,
		thinker: 'MANSION.Vengeful',
		fx: 3,
		data: {
			name: 'head1',
			speed: 2,
			cyber: {
				shootprob: 0.333,  // probabilité de tirer un missile lors d'un mouvement de contre attaque
				reaction: 20,	// temps de réaction : plus c'est bas, plus le fantôme est réactif
			}
		}
	},

	g_head2: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_head2',
		width: 32,
		height: 96,
		thinker: 'MANSION.G_Chaser',
		fx: 3,
		data: {
			name: 'head2',
			speed: 2,
			cyber: {
				shootprob: 0.333,  // probabilité de tirer un missile lors d'un mouvement de contre attaque
				reaction: 20,	// temps de réaction : plus c'est bas, plus le fantôme est réactif
			}
		}
	},

	g_head3: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_head3',
		width: 32,
		height: 96,
		thinker: 'MANSION.G_Chaser',
		fx: 3,
		data: {
			name: 'head3',
			speed: 2,
			cyber: {
				shootprob: 0.333,  // probabilité de tirer un missile lors d'un mouvement de contre attaque
				reaction: 20,	// temps de réaction : plus c'est bas, plus le fantôme est réactif
			}
		}
	},
	
	g_head4: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_head4',
		width: 32,
		height: 96,
		thinker: 'MANSION.G_Chaser',
		fx: 3,
		data: {
			name: 'head4',
			speed: 2,
			cyber: {
				shootprob: 0.333,  // probabilité de tirer un missile lors d'un mouvement de contre attaque
				reaction: 20,	// temps de réaction : plus c'est bas, plus le fantôme est réactif
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
	}
});
