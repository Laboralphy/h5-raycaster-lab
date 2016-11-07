O2.createClass('RCWE.PasteBin', {

	bActive: true,
	pasteCatcher: null,
	ctrl_pressed: false,
	command_pressed: false,
	paste_event_support: false,

	__construct: function(ff) {
		if (ff) {
			this.init();
		} else {
			this.oPasteBin.declareEvent();			
		}
	},

//on keyboard press
	on_keyboard_action: function (event) {
		var k = event.keyCode;
		//ctrl
		if (k == 17 || event.metaKey || event.ctrlKey) {
			if (this.ctrl_pressed == false)
				this.ctrl_pressed = true;
		}
		//v
		if (k == 86) {
			if (document.activeElement != undefined && document.activeElement.type == 'text') {
				//let user paste into some input
				return false;
			}

			if (this.ctrl_pressed == true && this.pasteCatcher != null){
				this.pasteCatcher.focus();
			}
		}
	},
	//on kaybord release
	on_keyboardup_action: function (event) {
		//ctrl
		if (event.ctrlKey == false && this.ctrl_pressed == true) {
			this.ctrl_pressed = false;
		}
		//command
		else if(event.metaKey == false && this.command_pressed == true){
			this.command_pressed = false;
			this.ctrl_pressed = false;
		}
	},


	init: function () {
		var _self = this;
		//handlers
		document.addEventListener('keydown', function (e) {
			_self.on_keyboard_action(e);
		}, false); //firefox fix
		document.addEventListener('keyup', function (e) {
			_self.on_keyboardup_action(e);
		}, false); //firefox fix
		document.addEventListener('paste', function (e) {
			_self.pasteEvent(e);
		}, false); //official paste handler
		var pasteCatcher = document.createElement("div");
		this.pasteCatcher = pasteCatcher;
		pasteCatcher.setAttribute("id", "paste_ff");
		pasteCatcher.setAttribute("contenteditable", "");
		pasteCatcher.style.cssText = 'opacity: 0; position: fixed; top: 0px; left: 0px; width: 10px; margin-left: -20px;';
		document.body.appendChild(pasteCatcher);

		// create an observer instance
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (_self.paste_event_support === true || _self.ctrl_pressed == false || mutation.type != 'childList'){
					//we already got data in paste_auto()
					return true;
				}
				//if paste handle failed - capture pasted object manually
				if(mutation.addedNodes.length == 1) {
					if (mutation.addedNodes[0].src != undefined) {
						//image
						_self.pasteImage(mutation.addedNodes[0].src);
					}
					//register cleanup after some time.
					setTimeout(function () {
						pasteCatcher.innerHTML = '';
					}, 20);
				}
			});
		});
		var config = { attributes: true, childList: true, characterData: true };
		observer.observe(pasteCatcher, config);
	},	

	pasteEvent: function(event) {
		this.paste_event_support = false;
		if (!this.bActive) {
			return;
		}
		var items = (event.clipboardData || event.originalEvent.clipboardData).items;
		var index, item, blob, reader;
		if (items) {
			this.paste_event_support = true;
		}
		for (index in items) {
			item = items[index];
			if (item.kind === 'file') {
				blob = item.getAsFile();
				reader = new FileReader();
				reader.addEventListener('load', (function(event){
					var sCheck = 'data:image/png;base64,';
					if (event.target.result.substr(0, sCheck.length) === sCheck) {
						this.pasteImage(event.target.result);
					}
					sCheck = 'data:image/jpeg;base64,';
					if (event.target.result.substr(0, sCheck.length) === sCheck) {
						this.pasteImage(event.target.result);
					}
				}).bind(this)); // data url!
				reader.readAsDataURL(blob);
			}
		}
	},

	declareEvent: function() {
		document.addEventListener('paste', this.pasteEvent.bind(this));
	},

	pasteImage: function(sSrc) {
		var oImage = new Image();
		oImage.addEventListener('load', (function(oEvent) {
			this.trigger('paste.image', oEvent.target);
		}).bind(this));
		oImage.src = sSrc;
		if (oImage.complete) {
			this.trigger('paste.image', oImage);
		}
	}

});

O2.mixin(RCWE.PasteBin, O876.Mixin.Events);