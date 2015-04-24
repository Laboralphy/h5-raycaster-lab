O2.extendClass('RCWE.ObjectPlacer', RCWE.Window, {

	oPad: null,
	oList: null,
	aPadButtons: null,
	
	onNewObject: null,
	onSelectObject: null,
	onDeleteObject: null,
	
	nPlaneSpacing: 64,
	
	sXCaption: '✖',  // flags : ⚑⚐
	
	/**
	 * Fabrique la structure DOM du composant.
	 */
	build: function() {
		__inherited('Objects');
		var $oContainer = this.getContainer();
		
		var $oTable = $('<table><tr><td></td><td></td></tr></table>');

		var $oList = $('<select style="font-size: 75%; width: 192px" size="15"></select>');
		$oList.bind('change', this.cmd_select.bind(this));
		
		var $oPad = $('<div class="pad9">' + 
			'<button>7</button><button>8</button><button>9</button><br />' +
			'<button>4</button><button>5</button><button>6</button><br />' +
			'<button>1</button><button>2</button><button>3</button><br />' +
		'</div>');
		


		$oContainer.append($oTable);
		var oCells = $('td', $oTable);
		oCells.eq(0).append($oList);
		oCells.eq(1).append('<div><span class="label">Grid alignment :</span></div>');
		oCells.eq(1).append($oPad);
		
		
		
		var pb = [0];
		$('button', $oPad).attr('type', 'button').addClass('padbutton').bind('click', this.padClick.bind(this)).each(function() {
			var $this = $(this);
			var n = $this.html() | 0;
			$this.data('padindex', n);
			pb[n] = $this;
		}).html('&nbsp;');
		this.aPadButtons = pb;
		this.oPad = $oPad;
		
		$oPad = $('<div>' + 
				'<button>↥</button><button>↦</button><button>↧</button><button>↤</button>' + 
				'</div>');

		oCells.eq(1).append('<div><span class="label">Move object :</span></div>');
		oCells.eq(1).append($oPad);
		$('button', $oPad).attr('type', 'button').bind('click', this.cmd.bind(this)).each(function() {
			var $b = $(this);
			var a = ['move1up', 'move1right', 'move1down', 'move1left'];
			var l = ['move this object up', 'move this object right', 'move this object down', 'move this object left'];
			$b.data('command', a[$b.index()]).attr('title', l[$b.index()]);
		});
		

		
		this.oList = $oList;
		this.buildToolBar();
	},
	
	buildToolBar: function() {
		this.addCommand('+', 'add a new entry in the list', this.cmd_add.bind(this));
		this.addCommand('-', 'delete the selected entry', this.cmd_del.bind(this));
		this.addCommand('✖', 'clear selected objects', this.cmd.bind(this)).data('command', 'clear');
		// ↤↥↦↧
		this.addCommand('↥', 'move selected objects up', this.cmd.bind(this)).data('command', 'moveup');
		this.addCommand('↧', 'move selected objects down', this.cmd.bind(this)).data('command', 'movedown');
		this.addCommand('↤', 'move selected objects left', this.cmd.bind(this)).data('command', 'moveleft');
		this.addCommand('↦', 'move selected objects right', this.cmd.bind(this)).data('command', 'moveright');
		
	},
	
	onCommand: null,
	
	cmd: function(oEvent) {
		this.onCommand($(oEvent.target).data('command'));
	},

	
	
	/**
	 * Fabrique les element DOM options du selecteur de metacodes
	 * @param a donnée de description des metacodes
	 */
	unserialize: function(a) {
		var $oList = this.oList;
		$oList.empty();
		a.forEach(function(i, n, a) {
			var $option = $('<option>' + i.name + '</option>');
			$option.data(i);
			$oList.append($option);
		});
	},

	/**
	 * Construit un tableau composé des valeur des métacodes
	 * ordonnée de la même manière que les option du select oMetaCodes
	 * @return array
	 */
	serialize: function() {
		var a = []; 
		$('option', this.oList).each(function() {
			var $this = $(this);
			var sId = $this.val();
			var d = {};
			d.id = sId;
			d.name = $this.html();
			$.extend(d, $this.data());
			a.push(d);
		});
		return a;
	},
	
	padClick: function(oEvent) {
		var $oTarget = $(oEvent.target);
		var nIndex = $oTarget.data('padindex');
		if (nIndex) {
			var oSelected = $('option:selected', this.oList);
			if (oSelected.length) {
				oSelected.data('padindex', nIndex);
				this.cmd_select();
			}
		}
	},

	
	
	/**
	 * Renvoie les objet qui se trouve dans la case spécifiée
	 * @param x1 
	 * @param y1
	 * @param x2 
	 * @param y2
	 * @return Array
	 */
	getObjects: function(x1, y1, x2, y2) {
		var a = [];
		$('option', this.oList).each(function() {
			var $option = $(this);
			var nx = $option.data('x') | 0;
			var ny = $option.data('y') | 0;
			if (nx >= x1 && ny >= y1 && nx <= x2 && ny <= y2) {
				a.push(this);
			}
		});
		return a;
	},

	generateDecals: function(map) {
		var a = [];
		var ps = this.nPlaneSpacing; 
		$('option', this.oList).each(function() {
			var $option = $(this);
			var nx = $option.data('x') | 0;
			var ny = $option.data('y') | 0;
			if (!(map[ny][nx] & 0xFF00)) {
				return;
			}
			var p = $option.data('padindex') | 0;
			var sName = $option.data('blueprint');
			var nSide;
			switch (p) {
				case 8: // up
					nSide = 3;
					break;

				case 6: // right
					nSide = 2;
					break;

				case 2: // down
					nSide = 1;
					break;

				case 4: // left
					nSide = 0;
					break;
					
				default: //
					throw new Error('misplaced decal ' + sName + ' at ' + nx + ' : ' + ny);
			}
			a.push({x: nx, y: ny, side: nSide, tile: sName});
		});
		return a;
	},
	
	generateObjects: function(map) {
		var a = [];
		var ps = this.nPlaneSpacing; 
		$('option', this.oList).each(function() {
			var $option = $(this);
			var x = $option.data('x') | 0;
			var y = $option.data('y') | 0;
			if (map[y][x] & 0xFF00) {
				return;
			}
			x = x * ps + (ps >> 1);
			y = y * ps + (ps >> 1); 
			var p = $option.data('padindex') | 0;
			var nSize = $option.data('size') | 0;
			var sName = $option.data('blueprint');
			var nOffset = (ps >> 1) - nSize;
			switch (p) {
				case 8:
					y -= nOffset;
					break;

				case 4:
					x -= nOffset;
					break;

				case 6:
					x += nOffset;
					break;

				case 2:
					y += nOffset; 
					break;

				case 1:
					y += nOffset; 
					x -= nOffset; 
					break;

				case 3:
					y += nOffset; 
					x += nOffset; 
					break;

				case 7:
					y -= nOffset; 
					x -= nOffset; 
					break;

				case 9:
					y -= nOffset; 
					x += nOffset; 
					break;
			}
			a.push({
				blueprint: sName,
				x: x,
				y: y,
				angle: 0
			});
		});
		return a;
	},
	
	cmd_add: function() {
		if (this.onNewObject) {
			var oNew = $('<option></option>');
			if (this.onNewObject(oNew)) {
				$('button', this.oPad).html('&nbsp;');
				this.oList.append(oNew);
				this.oList.prop('selectedIndex', oNew.index());
			}
		}
	},
	
	cmd_select: function() {
		var oSelected = $('option:selected', this.oList);
		if (oSelected.length) {
			var nIndex = oSelected.data('padindex');
			$('button', this.oPad).html('&nbsp;');
			if (nIndex) {
				this.aPadButtons[nIndex].html(this.sXCaption);
				// ..... a changer plus tard
			}
			if (this.onSelectObject) {
				this.onSelectObject(oSelected);
			}
		}
	},
	
	cmd_del: function() {
		var oSelected = $('option:selected', this.oList);
		if (oSelected.length && confirm('delete this entry : ' + oSelected.html() + ' ?')) {
			oSelected.remove();
			if (this.onDeleteObject) {
				this.onDeleteObject(oSelected);			
			}
		}
	}
});
