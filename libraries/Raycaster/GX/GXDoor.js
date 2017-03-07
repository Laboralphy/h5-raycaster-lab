/** Effet spécial temporisé
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * Cet effet gère l'ouverture et la fermeture des portes, ce n'est pas un effet visuel a proprement parlé
 * L'effet se sert de sa référence au raycaster pour déterminer la présence d'obstacle génant la fermeture de la porte
 * C'est la fonction de temporisation qui est exploitée ici, même si l'effet n'est pas visuel.
 */
O2.extendClass('O876_Raycaster.GXDoor', O876_Raycaster.GXEffect, {
	sClass : 'Door',
	nPhase : 0, // Code de phase : les porte ont 4 phases : 0: fermée(init), 1: ouverture, 2: ouverte et en attente de fermeture, 3: en cours de fermeture, 4: fermée->0
	oRaycaster : null, // Référence au raycaster        
	x : 0, // position de la porte
	y : 0, // ...
	fOffset : 0, // offset de la porte
	
	nMaxTime : 3000, // temps d'ouverture max en ms
	nTime : 3000, // temps restant avant fermeture
	nAutoClose : 0, // Flag autoclose 1: autoclose ; 0: stay open

	fSpeed : 0, // vitesse d'incrémentation/décrémentation de la porte
	nLimit : 0, // limite d'incrément de l'offset (reduit par 2 pour les porte double)
	nCode : 0, // Code physique de la porte

	oEasing: null,

	__construct: function(r) {
		__inherited(r);
		this.oEasing = new O876.Easing();
		this.setAutoClose(true);
	},
	
	isOver : function() {
		return this.nPhase > 3;
	},

	process : function() {
		var r = this.oRaycaster;
		switch (this.nPhase) {
			case 0: // init
				Marker.markXY(r.oDoors, this.x, this.y, this);
				this.nCode = r.getMapPhys(this.x, this.y);
				switch (this.nCode) {
					case r.PHYS_DOOR_SLIDING_DOUBLE:
						this.fSpeed = 600 / r.TIME_FACTOR;
						this.nLimit = r.nPlaneSpacing >> 1;
						this.oEasing.from(0).to(this.nLimit).during(this.fSpeed).use('smoothstep');
						break;
			
					case r.PHYS_DOOR_SLIDING_LEFT:
					case r.PHYS_DOOR_SLIDING_RIGHT:
						this.fSpeed = 600 / r.TIME_FACTOR;
						this.nLimit = r.nPlaneSpacing;
						this.oEasing.from(0).to(this.nLimit).during(this.fSpeed).use('smoothstep');
						break;
			
					default:
						this.fSpeed = 800 / r.TIME_FACTOR;
						this.nLimit = r.yTexture;
						this.oEasing.from(0).to(this.nLimit).during(this.fSpeed).use('smoothstep');
						break;
				}
				this.nPhase++;	/** no break on the next line */

			case 1: // la porte s'ouvre jusqu'a : offset > limite
				if (this.oEasing.next().over()) {
					this.fOffset = this.nLimit - 1;
					r.setMapPhys(this.x, this.y, 0);
					this.nPhase++;
					this.oEasing.from(this.fOffset).to(0).during(this.fSpeed);
				}
				this.fOffset = this.oEasing.val() | 0;
				break;

			case 2: // la porte attend avant de se refermer   
				this.nTime -= this.nAutoclose;
				if (this.nTime <= 0) {
					// Recherche de sprites solides empechant de refermer la porte
					if (r.oMobileSectors.get(this.x, this.y).length) {
						this.nTime = this.nMaxTime >> 1;
					} else {
						r.setMapPhys(this.x, this.y, this.nCode);
						this.nPhase++;
					}
				}
				break;
		
			case 3: // la porte se referme
				if (this.oEasing.next().over()) {
					this.terminate();
				}
				this.fOffset = this.oEasing.val();
				break;
		}
		r.setMapOffs(this.x, this.y, this.fOffset | 0);
	},

	/** Fermeture de la porte
	 * @param bForce force la fermeture en cas de présence de mobile
	 */
	close : function(bForce) {
		this.nTime = 0;
		if (bForce && this.nPhase == 2) {
			this.nPhase++;
		}
	},
	
	/** Position le flag autoclose
	 * @param n nouvelle valeur du flag
	 * 0: pas d'autoclose : la porte reste ouverte
	 * 1: autoclose : la porte se referme après le délai normal imparti
	 */
	setAutoClose : function(n) {
		this.nAutoclose = n ? this.oRaycaster.TIME_FACTOR : 0;
	},
	
	terminate : function() {
		// en phase 0 rien n'a vraiment commencé : se positionner en phase 4 et partir
		if (this.nPhase === 0) {
			this.nPhase = 4;
			Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
			return;
		}
		this.fOffset = 0;
		Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
		this.nPhase = 4;
		this.oRaycaster.setMapOffs(this.x, this.y, 0);
		this.oRaycaster.setMapPhys(this.x, this.y, this.nCode);
	}
});
