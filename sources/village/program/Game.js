O2.extendClass('VILLAGE.Game', O876_Raycaster.GameAbstract, {
	init: function() {
		this.on('leveldata', function(wd) {
			wd.data = LEVEL_DATA[Object.keys(LEVEL_DATA)[0]];
		});
	}
});
