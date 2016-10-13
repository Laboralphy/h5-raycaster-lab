O2.extendClass('RCWE.Game', O876_Raycaster.GameAbstract, {
	__construct: function(oData) {
		__inherited();
		this._sLevelIndex = 'level';
		this.on('leveldata', function(wd) {
			wd.data = oData;
		});
		this.on('load', function(p) {
			var oProgress = document.getElementById('raycaster_progress');
			oProgress.max = p.max;
			oProgress.value = p.progress;
			oProgress.innerHTML = p.phase;
		});
		
		this.on('error', (function(s, d) {
			this.trigger('stop');
		}).bind(this));
	}
});
