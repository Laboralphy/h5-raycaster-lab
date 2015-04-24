/**
 * Temporise et retarde l'exécution de certaines commandes
 */
O2.createClass('O876_Raycaster.Scheduler', {
	oCommands: null,
	aIndex: null,
	bInvalid: true,
	nTime: 0,

	
	__construct: function() {
		this.oCommands = {};
		this.aIndex = [];
	},

	/** 
	 * Retarde l'exécution de la function passée en paramètre
	 * la fonction doit etre une méthode de l'instance défini dans le
	 * constructeur
	 * @param pCommand methode à appeler
	 * @param nDelay int delai d'exécution
	 */
	delayCommand: function(oInstance, pCommand, nDelay) {
		var aParams = Array.prototype.slice.call(arguments, 3);
		var n = nDelay + this.nTime;
		if (!(n in this.oCommands)) {
			this.oCommands[n] = [];
		}
		this.oCommands[n].push([oInstance, pCommand, aParams]);
		this.aIndex.push(n);
		this.bInvalid = true;
	},

	/** 
	 * Appelée à chaque intervale de temps, cette fonction détermine 
	 * quelle sont les fonctions à appeler.
	 * @param nTime int temps
	 */ 
	schedule: function(nTime) {
		this.nTime = nTime;
		if (this.bInvalid) { // trier en cas d'invalidité
			this.aIndex.sort(function(a, b) { return a - b; });
			this.bInvalid = false;
		}
		var n, i, o;
		while (this.aIndex.length && this.aIndex[0] < nTime) {
			n = this.aIndex.shift();
			o = this.oCommands[n];
			for (i = 0; i < o.length; i++) {
				o[i][2].apply(o[i][0], o[i][2]);
			}
			delete this.oCommands[n];
		}
	}
});
