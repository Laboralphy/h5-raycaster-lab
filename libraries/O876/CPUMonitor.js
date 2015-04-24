/** Classe de mesure de l'activité CPU
 * 
 */
O2.createClass('O876.CPUMonitor', {
	// Temps chronometrés par l'objet
	aTimes: null,
	sTimes: null,
	nTimes: 0,
	nIdleTime: 0,
	aColors: null,
	
	__construct: function() {
		this.aColors = ['#F00', '#0F0', '#FF0', '#00F', '#F0F', '#0FF', '#FFF'];
		this.aTimes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.sTimes = ['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''];
	},
	
	
	/** Lance le début du chronometrage
	 * Calcule le temps d'inactivité (temps courant  - dernier chrono)
	 */
	start: function() {
		var d = Date.now();
		if (this.nTimes > 0) {
			this.nIdleTime = d - this.aTimes[this.nTimes - 1];
			this.nTimes = 0;
		}
		this.aTimes[this.nTimes++] = d;
	},
	
	/** Insertion d'un temps de chrono
	 * 
	 */
	trigger: function(s, d) {
		if (d === undefined) {
			d = Date.now();
		}
		this.sTimes[this.nTimes - 1] = s;
		this.aTimes[this.nTimes++] = d;
	},
	
	render: function(oContext, x, y) {
		var n;
		for (var i = 0; i < (this.nTimes - 1); i++) {
			n = this.aTimes[i + 1] - this.aTimes[i];
			// n = time !
			oContext.fillStyle = this.aColors[i % 7];
			oContext.fillRect(x, y, n, 8);
			x += n;
		}
		oContext.fillStyle = this.aColors[i % 7];
		oContext.fillRect(x, y, this.nIdleTime, 8);
	}
});
