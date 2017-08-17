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
			},
			speed: 3
		},
		tile: 'm_skull',
		thinker: 'HOTD.Zombie',
	}
});
