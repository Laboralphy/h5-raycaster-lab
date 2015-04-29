O2.createClass('RCWE.Application', {
	
	oStructure: null,
	
	__construct: function() {
		this.buildStructure($('body').get(0));
	},

	buildStructure: function(oRoot) {
		var $structure = $(
		'<table class="o876structure">' +
		'	<tbody>' +
		'		<tr>' +
		'			<td class="c00" colspan="2">' +
		'				<div>' +
		'				</div>' +
		'			</td>' +
		'		</tr>' +
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
		'		<tr>' +
		'			<td class="c20 floatingWidth" colspan="2">' +
		'				<div>' +
		'				</div>' +
		'			</td>' +
		'		</tr>' +
		'	</tbody>' +
		'</table>');
		$(oRoot).append($structure);
		this.oStructure = {
			d00: $('td.c00 > div', $structure).get(0),
			d10: $('td.c10 > div', $structure).get(0),
			d11: $('td.c11 > div', $structure).get(0),
			d20: $('td.c20 > div', $structure).get(0)
		};
		
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

		

	}

});
