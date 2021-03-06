/* globals RCWE, W */

O2.extendClass('RCWE.AdvancedPad', RCWE.Window, {
	_id: 'advancedpad',
	oLevelOptions: null,
	
	build: function() {
		__inherited('Advanced Pad');
		this.getContainer().addClass('AdvancedPad');
		this.oLevelOptions = {};
		this.addCommand('<span class="icon-enlarge" style="-webkit-transform: rotate(45deg); display: block; float:left"></span>&nbsp;', 'Shift map', this.cmd_viewshift.bind(this));
		this.addCommand('<span class="icon-stop2"></span>', 'Block tools', this.cmd_blocktools.bind(this));
		this.addCommand('<span class="icon-wrench"></span>', 'Build game', this.cmd_buildgame.bind(this));
		this.addCommand('<span class="icon-download"></span>', 'Level options', this.cmd_leveloptions.bind(this));
		//this.addCommand('⚙', 'Restart with plugins', this.cmd_viewplugins.bind(this));
		
		this.getBody().empty();
		this.getBody().append('<p>This tab provide various tools for map displacement (useful when expanding map) or game build (useful to play your level in big screen).</p>');
	},
	
	cmd_selectOneCommand: function(oEvent) {
		var $this = $(oEvent.target);
		if ($this.get(0).tagName.toLowerCase() != 'button') {
			$this = $this.parent('button');
		}
		$this.siblings().removeClass('selected');
		$this.addClass('selected');
	},
	
	cmd_viewplugins: function(oEvent) {
		this.cmd_selectOneCommand(oEvent);
		this.getBody().empty();
		this.getBody().append('<p><b>Plugins</b></p><p>This is the plugin selector. Plugins are dedicated to specific projects (like Blight magic) and have no use otherwise. You don\'t need them to build your level. You can activate plugins here and restart the editor (unsaved work will be lost).</p>');
		var $plist = $('<p>Available plugins : </p>');
		$plist.append(this.buildPluginList());
		var $buttonLoadPlugin = $('<button>Reload RCWE</button> <i style="color: #666">Don\'t forget to save your work</i>');
		$buttonLoadPlugin.on('click', function() {
			var aPluginList = [];
			$('.AdvancedPad dl.pluginCheckList input[type="checkbox"]').each(function() {
				var $input = $(this);
				if ($input.prop('checked')) {
					aPluginList.push($input.attr('name'));
				}
			});
			window.location.href = '?plugins=' + aPluginList.join('+');
		});
		this.getBody().append($plist).append($buttonLoadPlugin);
	},
	
	cmd_blocktools: function(oEvent) {
		this.cmd_selectOneCommand(oEvent);
		this.getBody().empty();
		this.getBody().append('<p><b>Block and Tile Tools</b></p><p>This is the block and tile tools page.</p>');
		this.getBody().append('<p>The replacement tool is used to replace a block by another one, or by any block randomly chosen from a list (space separated values).</p>');
		// block replacement : replace a block 
		var $form = $('<form><table><tbody><tr><th>block</th><th>replaced by...</th></tr><tr><td><input size="3" name="from" type="text"/></td><td><input size="12" name="to" type="text"/></td></tr></tbody></table></form>');
		var $button=$('<button type="button">Replace</button>');
		$button.on('click', (function() {
			var sFrom = $('input[name="from"]', $form).eq(0).val();
			var sTo = $('input[name="to"]', $form).eq(0).val();
			this.doAction('blockreplace', sFrom | 0, sTo.split(' ').map(function(x) { return x | 0; }));
		}).bind(this));
		$form.append($button);
		this.getBody().append($form);
		this.getBody().append('<br />');
		this.getBody().append('<p>The tile economizer will display all tiles that are not used in blocks.</p>');
		$button = $('<button type="button">Start</button>');
		$divEcoTile = $('<div class="eco-tiles" ></div>');
		$button.on('click', (function() {
			this.doAction('tileeconomizer');
		}).bind(this));
		this.getBody().append($button).append($divEcoTile);
	},
	
	buildPluginList: function() {
		var aList = Object.keys(RCWE.Plugin);
		var $list = $('<dl class="pluginCheckList"></dl>');
		aList.forEach(function(s) {
			var $option = $('<dt></dt>');
			var $input = $('<input type="checkbox"/>');
			$input.attr('name', s);
			if (s in W.oMediator._oPlugins) {
				$input.prop('checked', true);
			}
			$option.append($input).append('<b>' + s + '</b>');
			$list.append($option);
			$list.append('<dd>' + RCWE.Plugin[s].prototype.description + '</dd>');
		});
		return $list;
	},
	
	/**
	 * Load preference for the advanced tab forms
	 */
	loadPref: function(aPrefs) {
		var oPref = JSON.parse(window.localStorage.getItem('pref/advancedpad'));
		if (oPref) {
			var xValue;
			aPrefs.forEach(function(sPref) {
				xValue = oPref[sPref];
				var $item = $('#' + sPref);
				switch (typeof xValue) {
					case 'boolean':
						$item.prop('checked', xValue);
					break;
					
					case 'string':
						$item.val(xValue);
					break;
				}
			});
		}
	},
	
	savePref: function(aPrefs) {
		var oPref = JSON.parse(window.localStorage.getItem('pref/advancedpad'));
		if (!oPref) {
			oPref = {};
		}
		aPrefs.forEach(function(sPref) {
			var $item = $('#' + sPref);
			switch ($item.attr('type')) {
				case 'checkbox':
					oPref[sPref] = $item.prop('checked');
				break;
				
				default:
					oPref[sPref] = $item.val();
				break;
			}
		});
		window.localStorage.setItem('pref/advancedpad', JSON.stringify(oPref));
	},
	
	
	cmd_viewshift: function(oEvent) {
		this.cmd_selectOneCommand(oEvent);
		this.getBody().empty();
		
		var $shift = $('<div class="shiftpad"><p><b>Shift map</b></p><p>This tool can shift the entire map by 1 or 10 cells position in any direction. This is useful to insert space between the edge and an edge touching room.</p></div>');
		
		var $table = $('<table class="shifter"><tbody>' +
			'<tr><td></td><td class="up"></td><td></td></tr>' +
			'<tr><td class="left"></td><td></td><td class="right"></td></tr>' +
			'<tr><td></td><td class="down"></td><td></td></tr>' +
			'</tbody></table>');

		$('td.up', $table)    .append('<button type="button" data-dir="up" data-n="10"><span class="icon-arrow-up"></span></button><br/><button type="button" data-dir="up" data-n="1"><span class="icon-arrow-up2"></span></button>');
		$('td.down', $table)  .append('<button type="button" data-dir="down" data-n="1"><span class="icon-arrow-down2"></span></button><br/><button type="button" data-dir="down" data-n="10"><span class="icon-arrow-down"></span></button>');
		$('td.left', $table)  .append('<button type="button" data-dir="left" data-n="10"><span class="icon-arrow-left"></span></button><button type="button" data-dir="left" data-n="1"><span class="icon-arrow-left2"></span></button>');
		$('td.right', $table) .append('<button type="button" data-dir="right" data-n="1"><span class="icon-arrow-right2"></span></button><button type="button" data-dir="right" data-n="10"><span class="icon-arrow-right"></span></button>');

		$('button', $table).on('click', (function(oEvent) {
			var $b = $(oEvent.target).parent('button');
			var sDir = $b.data('dir');
			var n = $b.data('n') | 0;
			this.doAction('shiftmap', sDir, n);
		}).bind(this));

		this.getBody().append($shift);
		$shift.append($table);
	},
	
	cmd_buildgame: function(oEvent) {
		this.cmd_selectOneCommand(oEvent);
		this.getBody().empty();
		var aPrefs = ('adv_gofps adv_gofull adv_gosmooth').split(' ');
		
		var $desc = $('<div class="buildpad"><p><b>Build a game</b></p><p>This tool can build a game with the current level. It will produce a Zip archive file ready to be downloaded.</p></div>');
		var $form = $('<form class="buildparams"></form>');
		$form.append('<div><label class="w96" title="Give a name to your game, it will be displayed on the title bar" for="adv_gname">Game name </label><input type="text" id="adv_gname"/></div>');
		$form.append('<div><label class="w96" title="Options to customize game behavior">Options </label>' +
			'<input id="adv_gofps" type="checkbox"/> <label for="adv_gofps" title="In FPS mode, you use your mouse to rotate the camera, and the keyboard (keys W, A, S, D) to move on the floor.">FPS control mode</span>' +
			'</div>');
		$form.append('<div><label class="w96">&nbsp;</label>' +
			'<input id="adv_gofull" type="checkbox"/> <label for="adv_gofull" title="If checked, the game will be fullscreen">Fullscreen mode</span>' +
			'</div>');
		$form.append('<div><label class="w96">&nbsp;</label>' +
			'<input id="adv_gosmooth" type="checkbox"/> <label for="adv_gosmooth" title="If checked, the wall textures rendering will be smooth. If not checked, it wil be pixelate">Smooth wall textures</span>' +
			'</div>');
		var $startDiv;
		$form.append($startDiv = $('<div class="spaced"><label>&nbsp;</label>' +
			'</div>'));
		var $startButton = $('<button type="button">⚒ Build</button>');
		$startDiv.append($startButton);
		$startButton.on('click', (function() {
			this.savePref(aPrefs);
			this.doAction('buildgame');
		}).bind(this));
		$desc.append($form);
		this.getBody().append($desc);

		this.doAction('requestname');
		this.loadPref(aPrefs);
	},

	/**

	 */
    cmd_leveloptions: function(oEvent) {
        this.cmd_selectOneCommand(oEvent);
        this.getBody().empty();

        var $form = $('<div class="leveloption"><p><b>Level options</b></p><p>You can set level options here.</p></div>');

        var $table;

        $table = $('<table>' +
            '<tr><th>stretch upper textures</th><td><input id="advancedpad_option_stretched" type="checkbox" /></td></tr>' +
            '<tr><td><button id="advancedpad_option_save" type="button">Save options</button></td id="advancedpad_option_done" ><td> </td></tr>' +
			'</table>');

        var $opStretch = $('#advancedpad_option_stretched', $table);
        var $opSave = $('#advancedpad_option_save', $table);
        var $opDone = $('#advancedpad_option_done', $table);
        $opStretch.prop('checked', !!this.oLevelOptions.stretch);
        $opSave.on('click', (function() {
        	this.oLevelOptions = {
        		stretch: $opStretch.prop('checked')
            };
        	this.doAction('leveloptionsdone');
		}).bind(this));

		$form.append($table);
        this.getBody().append($form);
	}
});
