// laby checker
/* globals O2, Astar, LABY, LabyLand, MAP, XHR */
O2.extendClass('LabyLand', Astar.Land, {
	// la classe permet de gerer les passage secret et les clés
	
	aBlocks: null,
	aKeys: null,
	aShops: null,
	bOutput: true,
	
	isCellWalkable : function(x, y) {
		try {
			var n = this.getCell(x, y);
			switch (n) {
				case LABY.BLOCK_VOID:
					return true;
				
				case LABY.BLOCK_LOCKEDDOOR_0:
					return this.aKeys[0];
					
				case LABY.BLOCK_LOCKEDDOOR_1:
					return this.aKeys[1];
					
				case LABY.BLOCK_LOCKEDDOOR_2:
					return this.aKeys[2];

				case LABY.BLOCK_LOCKEDDOOR_3:
					return this.aKeys[3];
			}
		} catch (e) {
			return false;
		}
		return false;
	},
	
	
	printInfo: function(s) {
		if (!this.bOutput) {
			return;
		}
		var oInfo = document.getElementById('checklaby_info');
		oInfo.innerHTML += s;
	},

	printInfoLn: function(s) {
		if (!this.bOutput) {
			return;
		}
		if (s !== undefined) {
			this.printInfo(s);
		}
		this.printInfo('<br />');
	},
	
	writeXCell: function(x, y) {
		if (!this.bOutput) {
			return;
		}
		var oTable = document.getElementsByTagName('table')[1];
		var oRow = oTable.getElementsByTagName('tr')[y];
		var oCell = oRow.getElementsByTagName('td')[x];
		oCell.innerHTML = 'X';
		oCell.className = '';
		oCell.style.fontWeight = 'bold';
	},
	
	printPath: function() {
		if (!this.bOutput) {
			return;
		}
		var p;
		for (var i = 0; i < this.aPath.length; ++i) {
			p = this.aPath[i];
			this.writeXCell(p.x, p.y);
		}
	},
	
	searchUniqueBlock: function(n, xStart, yStart) {
		var xEnd = this.aBlocks[n][0];
		var yEnd = this.aBlocks[n][1];
		return this.searchBlockXY(xStart, yStart, xEnd, yEnd);
	},
	
	searchBlockXY: function(xStart, yStart, xEnd, yEnd) {
		this.reset();
		var n = this.aTab[yEnd][xEnd];
		this.aTab[yEnd][xEnd] = 0;
		this.printInfo(' > start [' + xStart + ':' + yStart + '] end [' + xEnd + ':' + yEnd + ']');
		this.findPath(xStart, yStart, xEnd, yEnd);
		this.aTab[yEnd][xEnd] = n;
		var o;
		if (this.aPath.length >= 2) {
			o = this.aPath[this.aPath.length - 2];
		} else {
			o = {x:xStart, y:yStart};
		}
		return [o.x, o.y];
	},
	
	processWalk: function() {
		this.MAX_ITERATIONS = 16384;
		// se positionner à l'entrée
		var aLast = [this.aBlocks[LABY.BLOCK_ELEVATOR_ENTRANCE][0], this.aBlocks[LABY.BLOCK_ELEVATOR_ENTRANCE][1]];
		this.aKeys = {};
		this.aKeys = [false, false, false, false];
		var nTries = 4;
		var bOk = true;
		try {
			this.printInfo('Starting...');
			
			while (nTries) {
				bOk = true;
				// chercher la clé bleue
				if (!this.aKeys[0] && LABY.BLOCK_KEY_0 in this.aBlocks) {
					try {
						this.printInfo('Walking to blue key');
						aLast = this.searchUniqueBlock(LABY.BLOCK_KEY_0, aLast[0], aLast[1]);
						this.aKeys[0] = true;
						this.printPath();
						this.printInfoLn();
					} catch (e) {
						this.printInfoLn('failed');
						bOk = false;
					}
				}
				if (!this.aKeys[1] && LABY.BLOCK_KEY_1 in this.aBlocks) {
					try {
						this.printInfo('Walking to red key');
						aLast = this.searchUniqueBlock(LABY.BLOCK_KEY_1, aLast[0], aLast[1]);
						this.aKeys[1] = true;
						this.printPath();
						this.printInfoLn();
					} catch (e) {
						this.printInfoLn('failed');
						bOk = false;
					}
				}
				if (!this.aKeys[2] && LABY.BLOCK_KEY_2 in this.aBlocks) {
					try {
						this.printInfo('Walking to green key');
						aLast = this.searchUniqueBlock(LABY.BLOCK_KEY_2, aLast[0], aLast[1]);
						this.aKeys[2] = true;
						this.printPath();
						this.printInfoLn();
					} catch (e) {
						this.printInfoLn('failed');
						bOk = false;
					}
				}
				if (!this.aKeys[3] && LABY.BLOCK_KEY_3 in this.aBlocks) {
					try {
						this.printInfo('Walking to yellow key');
						aLast = this.searchUniqueBlock(LABY.BLOCK_KEY_3, aLast[0], aLast[1]);
						this.aKeys[3] = true;
						this.printPath();
						this.printInfoLn();
					} catch (e) {
						this.printInfoLn('failed');
						bOk = false;
					}
				}
				if (bOk) {
					nTries = 0;
				} else {
					--nTries;
				}
			}
			if (LABY.BLOCK_ELEVATOR_PORTAL in this.aBlocks) {
				this.printInfo('Walking to portal');
				aLast = this.searchUniqueBlock(LABY.BLOCK_ELEVATOR_PORTAL, aLast[0], aLast[1]);
				this.printPath();
				this.printInfoLn();
			}
			var oShop, nShop = 0;
			while (this.aShops.length) {
				this.printInfo('Walking to shop #' + nShop);
				oShop = this.aShops.shift();
				++nShop;
				aLast = this.searchBlockXY(aLast[0], aLast[1], oShop[0], oShop[1]);
				this.printPath();
				this.printInfoLn();
				
			}
			this.printInfo('Walking to exit');
			aLast = this.searchUniqueBlock(LABY.BLOCK_ELEVATOR_EXIT, aLast[0], aLast[1]);
			this.printPath();
			this.printInfoLn();
		} catch (e) {
			this.printPath();
			console.debug(e.stack);
			this.printInfo(e);
			return false;
		}
		this.printPath();
		this.printInfo('Path found');
		return true;
	},
	
	
	/**
	 * Recherche different type de block spéciaux
	 * entrée, sortie, clé, porte vérouillée, magasin
	 * @returns
	 */
	labyAnalysis: function() {
		var x, y, n;
		this.aBlocks = {};
		this.aShops = [];
		for (y = 0; y < this.nHeight; ++y) {
			for (x = 0; x < this.nWidth; ++x) {
				n = this.aTab[y][x];
				switch (n) {
					case LABY.BLOCK_KEY_0:
					case LABY.BLOCK_KEY_1:
					case LABY.BLOCK_KEY_2:
					case LABY.BLOCK_KEY_3:
						this.aBlocks[n] = [x, y];
						break;
						
					case LABY.BLOCK_SHOP:
						this.aShops.push([x, y]);
						break;

					case LABY.BLOCK_ELEVATOR_ENTRANCE:
					case LABY.BLOCK_ELEVATOR_EXIT:
					case LABY.BLOCK_ELEVATOR_PORTAL:
						this.aBlocks[n] = [x, y];
						this.aTab[y][x] = LABY.BLOCK_VOID;
						break;
						
					// block a ignorer
					case LABY.BLOCK_SECRET:
					case LABY.BLOCK_SECRET_WALL:
					case LABY.BLOCK_DOOR:
					case LABY.BLOCK_JAIL_DOOR:
					case LABY.BLOCK_ELEVATOR_DOOR_PREV:
					case LABY.BLOCK_ELEVATOR_DOOR_NEXT_SEALED:
					case LABY.BLOCK_ELEVATOR_DOOR_NEXT_UNSEALED:
					case LABY.BLOCK_DOOR:
					case LABY.BLOCK_CURTAIN:
					case LABY.BLOCK_MOB_LEVEL_0:
					case LABY.BLOCK_MOB_LEVEL_1:
					case LABY.BLOCK_MOB_LEVEL_2:
					case LABY.BLOCK_MOB_LEVEL_3:
					case LABY.BLOCK_MOB_LEVEL_4:
					case LABY.BLOCK_MOB_LEVEL_5:
					case LABY.BLOCK_MOB_LEVEL_6:
					case LABY.BLOCK_MOB_LEVEL_7:
					case LABY.BLOCK_MOB_LEVEL_8:
					case LABY.BLOCK_MOB_LEVEL_9:
					case LABY.BLOCK_MOB_LEVEL_X:
					case LABY.BLOCK_SOB_TYPE_1:
					case LABY.BLOCK_SOB_TYPE_2:
					case LABY.BLOCK_SOB_TYPE_3:
					case LABY.BLOCK_SOB_TYPE_4:
					case LABY.BLOCK_SOB_TYPE_5:
						this.aTab[y][x] = LABY.BLOCK_VOID;
						break;
				}
			}
		}
	}
});



function checkThisLaby() {
	var l = new LabyLand();
	l.init(MAP);
	l.labyAnalysis();
	return l.processWalk();
}

var oAutoCheck = {
	index: 0,
	stop: 0,
	generator: '',
	options: ''
};

function autoCheck() {
	var oBody = document.getElementsByTagName('body')[0];
	XHR.get('laby.php?s=' + oAutoCheck.index +'&g=' + oAutoCheck.generator + '&o=' + oAutoCheck.options, function(data) {
		MAP = JSON.parse(data);
		var l = new LabyLand();
		l.bOutput = false;
		l.init(MAP);
		l.labyAnalysis();
		if ((oAutoCheck.index % 100) === 0) {
			oBody.innerHTML += oAutoCheck.index.toString();
		} 
		if (l.processWalk()) {
			oBody.innerHTML += '.';
		} else {
			oBody.innerHTML += ' Error: ' + oAutoCheck.generator + ' ' + oAutoCheck.index + ' ' + oAutoCheck.options;
		}
		if (oAutoCheck.index < oAutoCheck.stop) {
			++oAutoCheck.index;
			window.setTimeout(autoCheck, 16);
		}
	});
}

function checkAllLaby(sGenerator, sOptions, nFrom, nTo) {
	// effacer
	// coller une barre de prog
	// nombre max de check
	var oBody = document.getElementsByTagName('body')[0];
	oBody.innerHTML = '<button type="button" onclick="checkstop()">Stop</button>';
	oAutoCheck.index = nFrom;
	oAutoCheck.stop = nTo;
	oAutoCheck.generator = sGenerator;
	oAutoCheck.options = sOptions;
	autoCheck();
}

function checkstop() {
	oAutoCheck.stop = oAutoCheck.index; 
}
