/**
 * Effet spécial temporisé O876 Raycaster project
 * 
 * @date 2012-01-01
 * @author Raphaël Marandet Cet effet gère l'ouverture et la fermeture des
 *         portes, ce n'est pas un effet visuel a proprement parlé L'effet se
 *         sert de sa référence au raycaster pour déterminer la présence
 *         d'obstacle génant la fermeture de la porte C'est la fonction de
 *         temporisation qui est exploitée ici, même si l'effet n'est pas
 *         visuel.
 */
O2.extendClass('O876_Raycaster.GXSecret', O876_Raycaster.GXEffect, {
	sClass : 'Secret',
	nPhase : 0, // Code de phase : les block secrets ont X
				// phases : 0: fermé(init), 1: ouverture block
				// 1, 2: ouverture block 2, 3: terminé
	oRaycaster : null, // Référence au raycaster
	x : 0, // position de la porte
	y : 0, // ...
	fOffset : 0, // offset de la porte
	fSpeed : 0, // vitesse d'incrémentation/décrémentation de la
				// porte
	nLimit : 0, // Limite d'offset de la porte
	oEasing: null,

	__construct: function(r) {
		__inherited(r);
		this.nLimit = r.nPlaneSpacing;
		this.oEasing = new O876.Easing();
	},
	
	isOver : function() {
		return this.nPhase >= 3;
	},

	seekBlockSecret : function(dx, dy) {
		if (this.oRaycaster.getMapPhys(this.x + dx,
				this.y + dy) === this.oRaycaster.PHYS_SECRET_BLOCK) {
			this.oRaycaster.setMapPhys(this.x, this.y, 0);
			Marker.clearXY(this.oRaycaster.oDoors, this.x,
					this.y);
			this.x += dx;
			this.y += dy;
			Marker.markXY(this.oRaycaster.oDoors, this.x,
					this.y, this);
			return true;
		}
		return false;
	},

	seekBlockSecret4Corners : function() {
		if (this.seekBlockSecret(-1, 0)) {
			return;
		}
		if (this.seekBlockSecret(0, 1)) {
			return;
		}
		if (this.seekBlockSecret(1, 0)) {
			return;
		}
		if (this.seekBlockSecret(0, -1)) {
			return;
		}
	},

	process : function() {
		switch (this.nPhase) {
			case 0: // init
				Marker.markXY(this.oRaycaster.oDoors, this.x,
						this.y, this);
				this.fSpeed = RC.TIME_DOOR_SECRET / this.oRaycaster.TIME_FACTOR;
				this.nPhase++; /** no break here */
				this.oEasing.from(0).to(this.nLimit).during(this.fSpeed).use('squareAccel');
				/** @fallthrough */

				// passage au case suivant
			case 1: // le block se pousse jusqu'a : offset > limite
				if (this.oEasing.next().over()) {
					this.fOffset = this.nLimit - 1;
					// rechercher le block secret suivant
					this.seekBlockSecret4Corners();
					this.nPhase++;
					this.fOffset = 0;
					this.oEasing.from(0).to(this.nLimit).during(this.fSpeed).use('squareDeccel');
				} else {
					this.fOffset = this.oEasing.val();
				}
				break;
	
			case 2: // le 2nd block se pousse jusqu'a : offset >
					// limite
				if (this.oEasing.next().over()) {
					this.oRaycaster.setMapPhys(this.x, this.y, 0);
					Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
					this.nPhase++;
					this.fOffset = 0;
				} else {
					this.fOffset = this.oEasing.val();
				}
				break;
		}
		this.oRaycaster.setMapOffs(this.x, this.y, this.fOffset | 0);
	},

	terminate : function() {
		// en phase 0 rien n'a vraiment commencé : se
		// positionner en phase 3 et partir
		switch (this.nPhase) {
		case 0:
			this.nPhase = 3;
			Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
			break;
	
		case 1:
		case 2:
			this.fOffset = 0;
			Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
			this.oRaycaster.setMapPhys(this.x, this.y, 0);
			break;
		}
	}
});
