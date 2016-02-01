O2.extendClass('TUTORIAL1.Game', O876_Raycaster.Engine, {
	/**
	 * This event is a hook for a main menu loop
	 * return "true" to end or skip the "menu" state.
	 * return "false" to stay in the menu loop
	 * @return bool
	 */
	onMenuLoop: function() {
		return true; // no main menu : go directly to the game
	},
	
	/**
	 * this event must return a JSON of level data
	 * see "world-definition.txt"
	 * @return object
	 */
	onRequestLevelData: function() {
		return WORLD_DATA.level1;
	},

	/**
	 * This event is called when the level data have been loaded
	 * Use this event to initialize camera and other entities
	 */
	onEnterLevel: function() {
		this.oRaycaster.nPlaneSpacing = 64; // will be the size of a raycaster map cell
		var oCT = new O876_Raycaster.CameraKeyboardThinker(); // the camera will be controllable by keyboard
		oCT.oKeyboard = this._getKeyboardDevice();
		oCT.oGame = this;
		// we declare an event when SPACEBAR is pressed
		oCT.useDown = function() {
			this.oGame.activateWall();    
		};
		this.oRaycaster.oCamera.setThinker(oCT);  // the camera will use this thinker
		this.oRaycaster.oCamera.fSpeed = 6; // initial camera movement speed (6 pixels per frame)
	},
	
	
	/** 
	 * Called when SPACE is pressed
	 */
	activateWall: function() {
		var rc = this.oRaycaster;
		var oMobile = rc.oCamera;
		var oBlock = oMobile.getFrontCellXY(); 
		var x = oBlock.x;
		var y = oBlock.y;
		if (x === rc.oCamera.xSector && y === rc.oCamera.ySector) {
			return;
		}
		switch (rc.getMapXY(x, y)) {
			case 0x1001:
				if (x > 0 && y > 0 && x < (rc.getMapSize() - 1) && y < (rc.getMapSize() - 1)) {
					rc.setMapXY(x, y, 0x1002); // change wall texture
				}
			break;

			case 0x1002:
				if (x > 0 && y > 0 && x < (rc.getMapSize() - 1) && y < (rc.getMapSize() - 1)) {
					rc.setMapXY(x, y, 0x0000); // erase wall
				}
			break;
			
			case 0x0000:
				rc.setMapXY(x, y, 0x1001); // make wall
			break;
		}
	}
});
