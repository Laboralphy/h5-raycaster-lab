/** Gestion de la horde de sprite
 * L'indice des éléments de cette horde n'a pas d'importance.
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 */
O2.createClass('O876_Raycaster.Horde',  {
	oRaycaster : null,
	oThinkerManager : null,
	aMobiles : null,
	aStatics : null,
	aSprites : null,
	oBlueprints : null,
	oTiles : null,
	nTileCount : 0,
	oImageLoader : null,
	oMobileDispenser : null,
	xTonari: [ 0, 0, 1, 1, 1, 0, -1, -1, -1 ],
	yTonari: [ 0, -1, -1, 0, 1, 1, 1, 0, -1 ],

	__construct : function(r) {
		this.oRaycaster = r;
		this.oImageLoader = this.oRaycaster.oImages;
		this.oMobileDispenser = new O876_Raycaster.MobileDispenser();
		this.aMobiles = [];
		this.aStatics = [];
		this.aSprites = [];
		this.oBlueprints = {};
		this.oTiles = {};
	},

	/** lance think pour chaque élément de la horde
	 */
	think : function() {
		var oMobile, aDiscarded = null;
		var i = 0;
		while (i < this.aMobiles.length) {
			oMobile = this.aMobiles[i];
			oMobile.think();
			if (oMobile.bActive) {
				i++;
			} else {
				if (aDiscarded === null) {
					aDiscarded = [];
				}
				aDiscarded.push(oMobile);
				this.unlinkMobile(oMobile);
				this.oMobileDispenser.pushMobile(oMobile.oSprite.oBlueprint.sId, oMobile);
			}
		}
		return aDiscarded;
	},

	/**
	 * {src, width, height, frames}
	 */
	defineTile : function(sId, aData) {
		this.nTileCount++;
		var oTile = new O876_Raycaster.Tile(aData);
		oTile.oImage = this.oImageLoader.load(oTile.sSource);
		this.oTiles[sId] = oTile;
		return oTile;
	},

	/**
	 * defines a new blueprint from a plain object of the worl definition
	 * @param sId blueprint identifier
	 * @param oData blueprint plain objet definition
	 */
	defineBlueprint : function(sId, oData) {
		var oBP = new O876_Raycaster.Blueprint(oData);
		if (oData.tile in this.oTiles) {
			oBP.oTile = this.oTiles[oData.tile];
		} else if ('tile' in oData) {
			throw new Error('this tile is unknown : "' + oData.tile + '" for blueprint ' + sId);
		} else {
			throw new Error('no tile is defined in "' + sId + '" data');
		}
		oBP.sId = sId;
		this.oBlueprints[sId] = oBP;
		this.oMobileDispenser.registerBlueprint(sId);
	},

	// {blueprint}
	defineSprite : function(aData) {
		var oSprite = new O876_Raycaster.Sprite();
		oSprite.oBlueprint = this.oBlueprints[aData.blueprint];
		this.aSprites.push(oSprite);
		return oSprite;
	},

	// Ajoute un mobile existant dans la liste
	/**
	 * @param oMobile
	 */
	linkMobile : function(oMobile) {
		oMobile.bActive = true;
		this.aMobiles.push(oMobile);
		return oMobile;
	},

	unlinkMobile : function(oMobile) {
		var nHordeRank = this.aMobiles.indexOf(oMobile);
		if (nHordeRank < 0) {
			this.unlinkStatic(oMobile);
			return;
		}
		ArrayTools.removeItem(this.aMobiles, nHordeRank);
	},
	

	unlinkStatic : function(oMobile) {
		var nHordeRank = this.aStatics.indexOf(oMobile);
		if (nHordeRank < 0) {
			return;
		}
		ArrayTools.removeItem(this.aStatics, nHordeRank);
		// Un static n'a pas de thinker il faut le sortir du laby ici.
        this.oRaycaster.oMobileSectors.unregister(oMobile);
        oMobile.xSector = -1;
        oMobile.ySector = -1;
	},
	

	/**
	 * Définition d'un Mobile
	 * @param aData donnée de définition
	 * @return O876_Raycaster.Mobile
	 */ 	
	defineMobile : function(aData) {
		var oMobile = new O876_Raycaster.Mobile();
		oMobile.oRaycaster = this.oRaycaster;
		oMobile.oSprite = this.defineSprite(aData);
		var bp = oMobile.getBlueprint();
		var oThinker = null;
		if (bp.sThinker !== null) {
			oThinker = this.oThinkerManager.createThinker(bp.sThinker);
		}
		oMobile.data(bp.data());
		oMobile.setThinker(oThinker);
		oMobile.fTheta = aData.angle;
		oMobile.nSize = oMobile.oSprite.oBlueprint.nPhysWidth >> 1;
		oMobile.setXY(aData.x, aData.y);
		if (oThinker) {
			this.linkMobile(oMobile);
		} else {
			this.aStatics.push(oMobile);
			oMobile.bVisible = true;
			oMobile.bEthereal = true;
			oMobile.bActive = true;
		}
		return oMobile;
	},

	/**
	 * Création d'un nouveau mobile
	 * @param sBlueprint string, blueprint
	 * @param x ...
	 * @param y position initiale
	 * @param fTheta angle initial
	 * @return O876_Raycaster.Mobile
	 */
	spawnMobile : function(sBlueprint, x, y, fTheta) {
		var oMobile = this.oMobileDispenser.popMobile(sBlueprint);
		if (!oMobile) {
			var aData = {
				blueprint : sBlueprint,
				x : x,
				y : y,
				angle : fTheta
			};
			oMobile = this.defineMobile(aData);
		} else {
			this.linkMobile(oMobile);
			oMobile.fTheta = fTheta;
			oMobile.setXY(x, y);
		}
		return oMobile;
	},


	getMobile : function(n) {
		return this.aMobiles[n];
	},

	getMobileCount : function() {
		return this.aMobiles.length;
	},

	/** Test si le mobile spécifié entre en collision avec un autre mobile
	 */
	computeCollision : function(oMobile) {
		var xTonari = this.xTonari;
		var yTonari = this.yTonari;
		var oRegister = this.oRaycaster.oMobileSectors;
		var oSector;
		var i;
		var oOther, iOther, nSectorLength;
		for (i = 0; i < 9; i++) {
			oSector = oRegister.get(oMobile.xSector + xTonari[i],
					oMobile.ySector + yTonari[i]);
			if (oSector !== null) {
				nSectorLength = oSector.length;
				for (iOther = 0; iOther < nSectorLength; ++iOther) {
					oOther = oSector[iOther];
					if (oOther != oMobile) {
						if (oMobile.hits(oOther)) {
							oMobile.oMobileCollision = oOther;
							return;
						}
					}
				}
			}
		}
		oMobile.oMobileCollision = null;
	},
	
	getAllocatedMemory: function() {
		var nRes = 0, oTile;
		for (var s in this.oTiles) {
			oTile = this.oTiles[s];
			nRes += oTile.oImage.width * oTile.oImage.height * 4;
		}
		return nRes;
	}
});
