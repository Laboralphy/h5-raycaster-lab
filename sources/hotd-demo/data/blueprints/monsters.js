/**
 * Created by ralphy on 16/08/17.
 */
O2.createObject('HOTD.BLUEPRINTS_MONSTERS', {
	m_zomb: {
		type: RC.OBJECT_TYPE_MOB,
		width: 40,
		height: 96,
		fx: 0,
		data: {
			sounds: {
				die: ['monsters/zomb-die', 'monsters/zomb-die-2', 'monsters/zomb-die-3'],
				spawn: 'monsters/zomb-moan-2'
			},
			speed: 5
		},
		tile: 'm_zomb',
		thinker: 'HOTD.Zombie',
	},

	m_skull: {
		type: RC.OBJECT_TYPE_MOB,
		width: 40,
		height: 96,
		fx: RC.FX_LIGHT_SOURCE,
		data: {
			sounds: {
                die: 'monsters/ghost-burn',
                spawn: 'monsters/zomb-moan'
			},
			speed: 3
		},
		tile: 'm_skull',
		thinker: 'HOTD.Zombie',
	}
});
