/** Factory light weight spécialisée dans la création de cellule de tableau composée
 * à partir de textures murale et sol.
 */

O2.createClass('RCWE.CellFactory', {
	oCanvases: null,
	oWallTextures: null,
	oFlatTextures: null,
	nWallWidth: 0,
	nFlatWidth: 0,
	nCellSize: 32,
	
	setWallTextures: function(oCanvas, nWidth) {
		this.oWallTextures = oCanvas;
		this.nWallWidth = nWidth;
	},

	setFlatTextures: function(oCanvas, nWidth) {
		this.oFlatTextures = oCanvas;
		this.nFlatWidth = nWidth;
	},
	
	getKey: function(nLeft, nRight, nFloor, nCeil, nPhys) {
		var aKey = ['k'];
		aKey.push(nLeft === null ? 'N' : nLeft); 
		aKey.push(nRight === null ? 'N' : nRight); 
		aKey.push(nFloor === null ? 'N' : nFloor); 
		aKey.push(nCeil === null ? 'N' : nCeil);
		aKey.push(nPhys === null ? 'N' : nPhys); 
		return aKey.join('_');
	},
	
	reset: function() {
		this.oCanvases = {};
	},
	
	getCellCanvas: function(nLeft, nRight, nFloor, nCeil, nPhys) {
		if (!(this.oWallTextures.complete && this.oFlatTextures.complete)) {
			throw new Error('Wall or Flat textures not complete');
		}
		if (this.oCanvases === null) {
			this.oCanvases = {};
		}
		
		if (nLeft === '') {
			nLeft = null;
		}
		if (nRight === '') {
			nRight = null;
		}
		if (nCeil === '') {
			nCeil = null;
		}
		if (nFloor === '') {
			nFloor = null;
		}
		
		var sKey = this.getKey(nLeft, nRight, nFloor, nCeil, nPhys);
		if (sKey in this.oCanvases) {
			return this.oCanvases[sKey];
		}
		
		var oCanvas = document.createElement('canvas');
		var cs = this.nCellSize;
		var cs2 = cs >> 1;
		var cs4 = cs >> 2;
		var cs075 = cs - cs4;
		oCanvas.width = oCanvas.height = cs;
		var oContext = oCanvas.getContext('2d');
		
		var sMask = '';
		sMask += nLeft === null ? '_' : '+';
		sMask += nRight=== null ? '_' : '+';
		sMask += nFloor === null ? '_' : '+';
		sMask += nCeil === null ? '_' : '+';
		
		var ww = this.nWallWidth;
		var fw = this.nFlatWidth;
		var wh = this.oWallTextures.height;
		var fh = this.oFlatTextures.height;
		
		oContext.fillStyle = '#000000';
		oContext.fillRect(0, 0, cs, cs);
		switch (nPhys | 0) {
			case 0: // void
			case 11: // invisible block
				if (nCeil !== null) {
					oContext.drawImage(this.oFlatTextures, nCeil * fw, 0, fw, fh, 0, 0, cs, cs2);
				}
				if (nFloor !== null) {
					oContext.drawImage(this.oFlatTextures, nFloor * fw, 0, fw, fh, 0, cs2, cs, cs2);
				}
				break;

			case 1: // solid
			case 2: // door
			case 3: // door
			case 4: // door
			case 5: // door
			case 6: // door
			case 7: // door
			case 8: // door
			case 9: // secret
			case 10: // transparent
			case 12: // offset	
				if (nLeft !== null) {
					oContext.drawImage(this.oWallTextures, nLeft * ww, 0, ww, wh, 0, 0, cs2, cs);
				}
				if (nRight !== null) {
					oContext.drawImage(this.oWallTextures, nRight * ww, 0, ww, wh, cs2, 0, cs2, cs);
				}
				break;
		}

		switch (nPhys === null ? -1 : nPhys | 0) {
			case 0:
				break;

			case 1:
				oContext.strokeStyle = '#FF8800';
				oContext.lineWidth = 2;
				oContext.strokeRect(0, 0, cs, cs);
				break;
				
			case 2:
			case 3:
				oContext.strokeStyle = '#00FF88';
				oContext.lineWidth = 2;
				oContext.strokeRect(0, 0, cs, cs);
				oContext.beginPath();
				oContext.moveTo(cs2, cs4);
				oContext.lineTo(cs2 + cs4, cs4 + cs2);
				oContext.lineTo(cs2 - cs4, cs4 + cs2);
				oContext.lineTo(cs2, cs4);
				oContext.closePath();
				oContext.stroke();
				break;
				
			case 4:
			case 5:
				oContext.strokeStyle = '#00FF88';
				oContext.lineWidth = 2;
				oContext.strokeRect(0, 0, cs, cs);
				oContext.beginPath();
				oContext.moveTo(cs2, cs075);
				oContext.lineTo(cs2 + cs4, cs4);
				oContext.lineTo(cs2 - cs4, cs4);
				oContext.lineTo(cs2, cs075);
				oContext.closePath();
				oContext.stroke();
				break;
				
			case 6:
				oContext.strokeStyle = '#00FF88';
				oContext.lineWidth = 2;
				oContext.strokeRect(0, 0, cs, cs);
				oContext.beginPath();
				oContext.moveTo(cs4, cs2);
				oContext.lineTo(cs4 + cs2, cs4);
				oContext.lineTo(cs4 + cs2, cs075);
				oContext.lineTo(cs4, cs2);
				oContext.closePath();
				oContext.stroke();
				break;

			case 7:
				oContext.strokeStyle = '#00FF88';
				oContext.lineWidth = 2;
				oContext.strokeRect(0, 0, cs, cs);
				oContext.beginPath();
				oContext.moveTo(cs4 + cs2, cs2);
				oContext.lineTo(cs4, cs4);
				oContext.lineTo(cs4, cs4 + cs2);
				oContext.lineTo(cs4 + cs2, cs2);
				oContext.closePath();
				oContext.stroke();
				break;

			case 8:
				oContext.strokeStyle = '#00FF88';
				oContext.lineWidth = 2;
				oContext.strokeRect(0, 0, cs, cs);
				oContext.beginPath();
				oContext.moveTo(cs2, cs2 - cs4);
				oContext.lineTo(cs2, cs2 + cs4);
				oContext.lineTo(cs, cs2);
				oContext.lineTo(cs2, cs2 - cs4);
				oContext.lineTo(0, cs2);
				oContext.lineTo(cs2, cs2 + cs4);
				oContext.closePath();
				oContext.stroke();
				break;
				
			case 9:
				oContext.strokeStyle = '#FFAA00';
				oContext.lineWidth = 2;
				var cs1 = cs >> 2;
				var cs2 = cs >> 1;
				var cs3 = cs1 + cs2;
				var cs3_5 = cs3 + (cs1 >> 1);
				oContext.strokeRect(0, 0, cs, cs);
				oContext.beginPath();
				oContext.moveTo(cs1, cs1);
				oContext.lineTo(cs2, 0);
				oContext.lineTo(cs3, cs1);
				oContext.lineTo(cs2, cs2);
				oContext.lineTo(cs2, cs3);
				oContext.arc(cs2, cs3_5, 2, 0, 2 * Math.PI, false);
				oContext.stroke();
				
				break;

			case 10:
				oContext.strokeStyle = '#AA00FF';
				oContext.lineWidth = 2;
				oContext.strokeRect(0, 0, cs, cs);
				oContext.beginPath();
				oContext.moveTo(0, 0);
				oContext.lineTo(cs, cs);
				oContext.closePath();
				oContext.stroke();
				break;
				
			case 11:
				oContext.strokeStyle = '#AAFF00';
				oContext.lineWidth = 2;
				oContext.strokeRect(0, 0, cs, cs);
				oContext.beginPath();
				oContext.moveTo(0, cs);
				oContext.lineTo(cs, 0);
				oContext.closePath();
				oContext.stroke();
				break;
				
				
			case 12:
				oContext.strokeStyle = '#AAFF00';
				oContext.lineWidth = 2;
				oContext.strokeRect(0, 0, cs, cs);
				oContext.beginPath();
				oContext.moveTo(0, cs);
				oContext.lineTo(cs, 0);
				oContext.closePath();
				oContext.stroke();
				break;
				
				
			default:
				oContext.beginPath();
				oContext.strokeStyle = '#FF0000';
				oContext.lineWidth = 4;
				oContext.moveTo(0, 0);
				oContext.lineTo(cs, cs);
				oContext.moveTo(cs, 0);
				oContext.lineTo(0, cs);
				oContext.closePath();
				oContext.stroke();
				break;
				
		}
		oContext.strokeStyle = 'rgba(96, 96, 96, 0.8)';
		oContext.strokeRect(0, 0, cs, cs);
		this.oCanvases[sKey] = oCanvas;
		return oCanvas;
	}
	
});
