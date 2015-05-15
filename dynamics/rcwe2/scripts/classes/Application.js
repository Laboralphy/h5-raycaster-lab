O2.createClass('RCWE.Application', {
	
	oStructure: null,
	
	oMapGrid: null,
	
	__construct: function() {
		this.buildStructure($('body').get(0));
	},

	buildStructure: function(oRoot) {
		var $structure = $(
		'<table class="o876structure window main">' +
		'	<tbody>' +
		'		<tr class="floatingHeight">' +
		'			<td class="c10 floatingWidth">' +
		'				<div>' +
		'				</div>' +
		'			</td>' +
		'			<td class="c11">' +
		'				<div>' +
		'				</div>' +
		'			</td>' +
		'		</tr>' +
		'	</tbody>' +
		'</table>');
		$(oRoot).append($structure);
		this.oStructure = {
			d00: $('td.c00 > div', $structure),
			d10: $('td.c10 > div', $structure),
			d11: $('td.c11 > div', $structure),
			d20: $('td.c20 > div', $structure)
		};


/*
		var oBlockBuilder = new RCWE.BlockBuilder();
		oBlockBuilder.build();
		$(this.oStructure.d11).append(oBlockBuilder.getContainer());
		
		var oWallBrowser = new RCWE.TileBrowser();
		oWallBrowser.nAllowedWidth = 64;
		oWallBrowser.nAllowedHeight = 96;
		oWallBrowser.build('Wall textures', {markers: ['L', 'R']});
		$(this.oStructure.d11).append(oWallBrowser.getContainer());

		var oFlatBrowser = new RCWE.TileBrowser();
		oFlatBrowser.nAllowedWidth = 64;
		oFlatBrowser.nAllowedHeight = 64;
		oFlatBrowser.build('Flat textures', {markers: ['Fl', 'Ce']});
		$(this.oStructure.d11).append(oFlatBrowser.getContainer());
		 */
		
		
		var oMapGrid = new RCWE.LabyGrid();
		oMapGrid.build();
		oMapGrid.setSize('100%', '100%');
		oMapGrid.setGridSize(32);
		this.linkWidget('d10', oMapGrid);
		
		oMapGrid.onDraw = this.labyGridDrawCell.bind(this);
		oMapGrid.redraw();
		
		var nD11Width = 464;
		
		var oBlockEditor = new RCWE.BlockEditor();
		oBlockEditor.build();
		oBlockEditor.setSize(nD11Width, 192);
		this.linkWidget('d11', oBlockEditor);

		var oTileBrowser = new RCWE.TileBrowser();
		oTileBrowser.build();
		oTileBrowser.setSize(nD11Width, 200);
		this.linkWidget('d11', oTileBrowser);
		
		this.oMapGrid = oMapGrid;
		this.resizeWindow();		
	},
	
	labyGridDrawCell: function(nCode, oContext, x, y, wCell, hCell) {
		oContext.fillStyle = 'rgb(220, 220, 220)';
		oContext.fillRect(x, y, wCell, hCell);
		oContext.strokeStyle = 'rgb(96, 96, 96)';
		oContext.strokeRect(x, y, wCell, hCell);
	},
	
	/**
	 * Links the specified widget in the application DOM structure
	 * @param sSection section of the application DOM structure
	 * @param w instance of widget
	 */
	linkWidget: function(sSection, w) {
		this.oStructure[sSection].append(w.getContainer());
	},


	resizeWindow: function() {
		if (this.oMapGrid) {
			var $canvas = $(this.oMapGrid.oCanvas);
			var $scrollzone = this.oMapGrid.oScrollZone;
			$canvas.hide();
			$scrollzone.width('');
			var w = $canvas.parent().width();
			$canvas.show();
			$scrollzone.width(w);
		}
	},

});
