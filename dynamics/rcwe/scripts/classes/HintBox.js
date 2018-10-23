O2.createClass('RCWE.HintBox', {
	
	_id: 'hintbox',
	
	_oContainer: null,
	_bFixed: false,
	
	_oData: null,
	_sSetup: '',
	
	onAction: null,
	
	build: function() {
		var $structure = $('<div class="hintbox">' +
		'</div>');
		this._oContainer = $structure;
		this.setupThingSelection();
		this.hide();
	},

    /**
	 * Configure la hintbox pour un usage Thing
     */
    setupThingSelection: function() {
    	if (this._sSetup === 'thing') {
    		return;
		}
		this._sSetup = 'thing';
        var $structure = this._oContainer;
        $structure.empty();
        $structure.append(
            '<table><tr>' +
            '<td class="commands"></td>' +
            '<td><canvas width="96" height="96"></canvas></td>' +
            '</tr></table>'
        );
        var $commands = $('td.commands', $structure);
        $commands.append('<button class="command" type="button" data-command="remove" title="remove this thing">✖</button><br/>');
        $commands.append('<button class="command" type="button" data-command="select" title="select the blueprint">⬚</button><br/>');
        $('button.command', $structure).on('click', this.cmd_command.bind(this));
    },

    /**
     * Configure la hintbox pour un usage Tag
     */
    setupTagSelection: function() {
        if (this._sSetup === 'tag') {
            return;
        }
        this._sSetup = 'tag';
        var $structure = this._oContainer;
        $structure.empty();
        $structure.append(
            '<div class="tag-description"></div>'
        );
    },

	setTagLabel: function(sTagLabel) {
        $('div.tag-description', this._oContainer).text(sTagLabel);
	},


    doAction: RCWE.Window.prototype.doAction,
	
	cmd_command: function(oEvent) {
		this.doAction($(oEvent.target).data('command'), this._oData.x, this._oData.y);
	},
	
	setThingXY: function(x, y) {
		this._oData = {x: x, y: y};
	},
	
	getThingXY: function() {
		return this._oData;
	},
	
	getCanvas: function() {
		return $('canvas', this._oContainer).get(0);
	},
	
	getContainer: function() {
		return this._oContainer;
	},
	
	getWidth: function() {
		return this._oContainer.width();
	},
	
	getHeight: function() {
		return this._oContainer.height();
	},
	
	show: function(x, y) {
		this._oContainer.css({
			top: y + 'px',
			left: x + 'px'
		})
		.show();
	},
	
	isFixed: function() {
		return this._bFixed;
	},
	
	fix: function(x, y, sThing) {
		this._bFixed = true;
		this.show(x, y);
		$('.commands', this._oContainer).show();
	},
	
	unfix: function() {
		this._bFixed = false;
		this.hide();
	},

	hide: function() {
		if (this._bFixed) {
			return;
		}
		$('.commands', this._oContainer).hide();
		this._oContainer.hide();
	}
});
