O2.extendClass('CITYFUN.Game', O876_Raycaster.GameAbstract, {
	init: function() {
		this.on('leveldata', function(wd) {
			wd.data = LEVEL_DATA[Object.keys(LEVEL_DATA)[0]];
		});
	}
});
window.addEventListener('load', function() {
    MAIN.configure(CONFIG);
    MAIN.run();
});