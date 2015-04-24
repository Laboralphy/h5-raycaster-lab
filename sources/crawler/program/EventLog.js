/**
 * EventLog
 * Classe de log des évènement du jeu.
 * Les évènements décrivent la progression d'un joueur dans le jeu afin de
 * proposer des éléments de réflexion sur l'équilibrage du jeu. 
 */


O2.createClass('EventLog', {
	
	oProgressDigest: null,
	
	getItemRef: function(oInv, sSlot) {
		if (sSlot in oInv.oEquipSlots && oInv.oEquipSlots[sSlot]) {
			return oInv.oEquipSlots[sSlot].resref;
		} else {
			return null;
		}
	},
	
	/** 
	 * Effectue un petit résumé de la progression du jeu
	 * Position du joueur, score
	 * @return objet
	 */
	process: function(oGame) {
		if (this.oProgressDigest === null) {
			this.oProgressDigest = {
				d: null,	// donjon
				f: null,	// niveau
				r: null,	// seed du niveau
				x: null,	// position x
				y: null,	// position y
				a: null,	// angle
				s: null,	// score
				hp: null,	// hp
				mp: null,	// mp
				fp: null,	// fp
				ks: null,	// clés possédées
				kg: null,	// clés générique possédées
				iw: null,	// arme équippée
				ia: null,	// amulette équipée
				ir: null,	// bague équipée
				ie: null,	// boucle d'oreilles équippées
				cr: null	// nombre de recettes de craft connues
			};
		}
		var oPlayer = oGame.getPlayer();
		var oDungeon = oGame.oDungeon;
		var oCreature = oDungeon.getPlayerCreature();
		var oInventory = oDungeon.getCreatureInventory(oCreature);
		var dd = oDungeon.getPlayerLocationArea();
		var df = oDungeon.getPlayerLocationFloor();
		var oCandidate = {
			d: dd,
			f: df,
			r: WORLD_DATA.dungeons[dd][df].seed,
			x: oPlayer.xSector,
			y: oPlayer.ySector,
			a: Math.round(oPlayer.fTheta * 1000) / 1000,
			s: oGame.oScore.getScore(oPlayer),
			hp: oCreature.getAttribute('vitality') - oCreature.getAttribute('hp'),
			mp: oCreature.getAttribute('energy') - oCreature.getAttribute('mp'),
			fp: oCreature.getAttribute('foodp') / 10 | 0,
			ks: oDungeon.getPossessedKeys(),
			kg: oDungeon.getGenericKeyCount(),
			iw: this.getItemRef(oInventory, 'hand'),
			ia: this.getItemRef(oInventory, 'neck'),
			ir: this.getItemRef(oInventory, 'finger'),
			ie: this.getItemRef(oInventory, 'ears'),
			cr: oCreature.oExtraData.craft.length
		};

		var oDigest = {};
		var bEmpty = true;

		for (var sKey in oCandidate) {
			if (this.oProgressDigest[sKey] != oCandidate[sKey]) {
				oDigest[sKey] = oCandidate[sKey];
				this.oProgressDigest[sKey] = oCandidate[sKey];
				bEmpty = false;
			}
		}
		if (!bEmpty) {
			var oPostData = {
					f: 'ru_log_*remote_addr',
					d: oDigest
			};
			oGame.oXHR.storeString('../../dynamics/crawlerfs/l.php', oPostData);
		}
	}
});
