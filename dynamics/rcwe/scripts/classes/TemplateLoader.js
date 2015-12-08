O2.extendClass('RCWE.TemplateLoader', RCWE.Window, {

	_id: 'templateloader',
	
	build: function() {
		__inherited('Template Loader');
		this.getContainer().addClass('TemplateLoader');
		this.addCommand('↵', 'Return to browser', this.cmd_return.bind(this));
	},
	
	cmd_return: function() {
		this.doAction('close');
	},
	
	show: function(sType) {
		if (!sType.match(/^[a-z]+$/)) {
			throw new Error('what is this template type ?');
		}
		this.getBody().empty();
		$.ajax({
			dataType: 'json',
			url: 'services/?action=' + sType + '.list', 
			success: (function(TEMPLIST) {
				TEMPLIST.forEach(function(sTemp) {
					var $body = this.getBody();
					var $div = $('<div class="template"></div>');
					var $title = $('<p class="title">' + sTemp + '</p>');
					var $img = $('<img src="' + RCWE.CONST.PATH_TEMPLATES + '/' + sType + 's/' + sTemp + '/thumbnail.png" />');
					var $button = $('<button class="load" data-template="' + sTemp + '" type="button">Load template "' + sTemp + '"</button>');
					$div.append('<hr />').append($title).append($img).append('<br />').append($button);
					$body.append($div);
				}, this);
				$('button.load', this.getBody()).on('click', (function(oEvent) {
					var $button = $(oEvent.target);
					var sTemplate = $button.data('template');
					this.doAction('loadtemplate', sTemplate, sType);
				}).bind(this));
			}).bind(this)
		});
		__inherited();
	},
});
