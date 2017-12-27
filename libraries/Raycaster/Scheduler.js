/**
 * @class O876_Raycaster.Scheduler
 * Temporise et retarde l'exécution de certaines commandes
 */
O2.createClass('O876_Raycaster.Scheduler', {
	aCommands: null,
	bInvalid: true,
	nTime: 0,

	
	__construct: function() {
		this.aCommands = [];
	},

	/** 
	 * Retarde l'exécution de la function passée en paramètre
	 * la fonction doit etre une méthode de l'instance défini dans le
	 * constructeur
	 * @param pCommand methode à appeler
	 * @param nDelay int delai d'exécution
	 */
	delay: function(pCommand, nDelay) {
		if (nDelay === undefined) {
			throw new Error('need delay parameter');
		}
		this.aCommands.push({
			time: nDelay + this.nTime,
			command: pCommand
		});
		this.bInvalid = true;
	},

	clear: function() {
		this.aCommands = [];
	},

	/** 
	 * Appelée à chaque intervale de temps, cette fonction détermine 
	 * quelle sont les fonctions à appeler.
	 * @param nTime int temps
	 */ 
	schedule: function(nTime) {
		this.nTime = nTime;
		if (this.bInvalid) { // trier en cas d'invalidité
			this.aCommands.sort(function(a, b) { return a.time - b.time; });
			this.bInvalid = false;
		}
		while (this.aCommands.length && this.aCommands[0].time <= nTime) {
			this.aCommands.shift().command();
		}
	}
});
