O2.createObject('BLUEPRINTS_DATA', {
	g_ayako: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_ayako',
		width: 40,
		height: 96,
		thinker: 'Mansion.Wraith',
		fx: 1,
		data: {
			sounds: { // 
				seen: 'laugh'
			}
		}
	},
	
	g_hanged: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_hanged',
		width: 26,
		height: 96,
		thinker: 'Mansion.Wraith',
		fx: 1,
		data: {
			sounds: {
				seen: 'ropes'
			}
		}
	},
	
	g_reika: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_reika',
		width: 64,
		height: 96,
		thinker: 'Mansion.Wraith',
		fx: 1,
		data: {}
	},
	
	g_head: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_head',
		width: 32,
		height: 96,
		thinker: 'Mansion.Wraith',
		fx: 1,
		data: {
			sounds: {
				seen: 'ghost'
			},
			lifespan: 1500
		}
	},
	
	g_wanderer: {
		type: RC.OBJECT_TYPE_MOB,
		tile: 'g_wanderer',
		width: 32,
		height: 96,
		thinker: 'Mansion.Wraith',
		fx: 1,
		data: {
			sounds: {
				seen: 'mourn'
			},
			lifespan: 3000
		}
	}
});
