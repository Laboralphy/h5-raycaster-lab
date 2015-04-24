/** 
 * Paramètres : 
 * {
 *   title: titre de la fenetre
 *   message: message descriptif, genre : 'what will you craft ?',
 *   recipes: tableau des recettes de craft
 *   compounds: tableau associatif de composants id => nombre
 * }
 */
O2.extendClass('UI.CraftWindow', UI.Window, {

	nWidth: 540,
	nHeight: 356,
	
	nOptionWidth: 512,
	nOptionHeight: 58,
	nOptionVisible: 5,
	
	nOptionY: 32,
	
	oParams: null,
	
	oPopup: null,
	oProgressBar: null,
	oProgressCaption: null,
	oPopupMessage: null,
	nProgress: 0,
	oSelector: null,
	ySelected: null,
	
	oCraftItem: null,
	
	clNOCRAFT_COLOR: '#444444',
	clNOCRAFT_BORDER: '#666666',
	clNOCRAFT_SELECT: '#444455',
	
	__construct: function(oParams) {
		__inherited({caption: STRINGS._('~win_craft')});
		this.oParams = oParams;
		this.buildWindowContent();
		//this.setStatusCaption(STRINGS._('~key_craft'));
		//this.select(0);
		this.setCommands([
		                  ['~key_gen_close', 'craft_close', 4],
		                  null,
		                  ['~key_craft_go', 'craft_go', 1],
		                  null,
		                  ['~key_craft_prev', 'craft_prev', 1],
		                  ['~key_craft_next', 'craft_next', 1]
		                   ]);
	},
	
	command: function(sCommand) {
		var y;
		switch (sCommand) {
			case 'craft_close':
				if (this.oPopup._bVisible) {
					this.getPlugin('Craft').abort();
				} else {
					this.close();
				}
				break;
				
			case 'craft_next':
				y = this.oSelector.getScrollY() + this.nOptionHeight;
				y = Math.min(y, (Math.max(0, this.getOptionCount() - this.nOptionVisible)) * this.nOptionHeight);
				this.oSelector.scrollTo(0, y);
				break;
				
			case 'craft_prev':
				y = this.oSelector.getScrollY() - this.nOptionHeight;
				y = Math.max(0, y);
				this.oSelector.scrollTo(0, y);
				break;
				
			case 'craft_go':
				this.getPlugin('Craft').craftSelectedItem();
				break;
		}
	},
	
	
	getOption: function(n) {
		return this.oSelector.getContainer().getControl(n);
	},
	
	getOptionCount: function() {
		return this.oSelector.getContainer().getControlCount();
	},
	
	selectUp: function() {
		this.select(this.ySelected - 1);
	},
	
	selectDown: function() {
		this.select(this.ySelected + 1);
	},
	
	select: function(y) {
		var nOptionCount = this.getOptionCount();
		y = Math.max(0, Math.min(nOptionCount - 1, y));
		var o;
		if (this.ySelected !== y) {
			if (this.ySelected !== null) {
				o = this.getOption(this.ySelected);
				o.setBorder(1, o.__craftable ? UI.clWINDOW_BORDER : this.clNOCRAFT_BORDER);
				o.setColor(o.__craftable ? UI.clDARK_WINDOW : this.clNOCRAFT_COLOR);
			}
			o = this.getOption(this.ySelected = y);
			o.setBorder(3, o.__craftable ? UI.clSELECT_BORDER : this.clNOCRAFT_BORDER);
			o.setColor(o.__craftable ? UI.clSELECT_WINDOW : this.clNOCRAFT_SELECT);
		}
	},
	
	getSelectedRecipe: function() {
		if (this.oParams.recipes[this.ySelected]) {
			return this.oParams.recipes[this.ySelected][0].resref;
		} else {
			return null;
		}
	},
	
	setCraftItem: function(oItem) {
		this.oProgressBar.setCaption(oItem.getName());
		this.oCraftItem = oItem;
	},
	
	getCraftItem: function() {
		return this.oCraftItem;
	},
	
	abortCraft: function() {
		this.oPopup.hide();
	},
	
	updateCraftableFlag: function(f) {
		var o, oIcon, n = this.getOptionCount();
		for (var i = 0; i < n; i++) {
			o = this.getOption(i);
			o.__craftable = f(this.oParams.recipes[i][0].resref);
			o.setBorder(1, o.__craftable ? UI.clWINDOW_BORDER : this.clNOCRAFT_BORDER);
			o.setColor(o.__craftable ? UI.clDARK_WINDOW : this.clNOCRAFT_COLOR);
			oIcon = o.getControl(0);
			oIcon._set('_bRedCross', !o.__craftable);
			o.invalidate();
		}
		var s = this.ySelected;
		this.ySelected = null;
		this.select(s);
	},

	resetProgress: function() {
		this.oProgressBar.setProgress(0);
		this.oProgressCaption.setCaption(STRINGS._('~m_crafting_in_progress'));
		this.oPopup.setTitleCaption(STRINGS._('~win_craft_progress'));
		this.oPopupMessage.hide();
		this.oProgressCaption.show();
//		this.oPopup.setStatusCaption(STRINGS._('~key_craftprogress'));
		this.oProgressBar.show();
		this.nProgress = 0;
	},
	
	progress: function() {
		this.nProgress++;
		this.oProgressBar.setProgress(Math.min(this.oProgressBar.nMax, this.nProgress));
		return this.nProgress > this.oProgressBar.nMax;
	},

	/**
	 * Configure la fenetre pour afficher un message
	 */
	displayMessage: function(sMessage) {
		this.oPopup.setTitleCaption(STRINGS._('~win_information'));
		this.oProgressCaption.hide();
		this.oPopupMessage.setCaption(sMessage);
		this.oPopupMessage.show();
		this.oPopupMessage.font.invalidate();
		this.oProgressBar.hide();
//		this.oPopup.setStatusCaption(STRINGS._('~key_craftmsg'));
		this.oPopup.show();
	},
	
	optionClick: function() {
		this.getParent().getParent().getParent().select(this.__y);
	},
	
	optionDblclick: function() {
		var p = this.getParent().getParent().getParent();
		p.select(this.__y);
		p.command('craft_go');
	},
	
	buildWindowContent: function() {
		this.setSize(this.nWidth, this.nHeight);
		var r = this.oParams.recipes;
		var aAble = this.oParams.able;
		// Création d'un sélecteur de recette
		this.oSelector = this.linkControl(new H5UI.ScrollBox());
		this.oSelector.moveTo((this.nWidth - this.nOptionWidth) >> 1, this.nOptionY),
		this.oSelector.setSize(this.nOptionWidth, this.nOptionHeight * this.nOptionVisible);
		var oCaption, oOption, oIcon, oItem, iComp, oComp;
		var yIcon = (this.nOptionHeight - UI.INV_ICON_SIZE) >> 1;
		var bCraftable;
		this.onMouseWheelUp = function() {
			this.command('craft_prev');
		};
		this.onMouseWheelDown = function() {
			this.command('craft_next');
		};
		for (var iRec = 0; iRec < r.length; iRec++) {
			oItem = r[iRec][0];
			bCraftable = aAble.indexOf(oItem.resref) >= 0;
			// Option
			oOption = this.oSelector.linkControl(new H5UI.Box());
			oOption.setSize(this.nOptionWidth, this.nOptionHeight);
			oOption.moveTo(0, iRec * oOption.getHeight());
			oOption.__craftable = bCraftable;
			oOption.setColor(bCraftable ? UI.clDARK_WINDOW : this.clNOCRAFT_COLOR);
			oOption.setBorder(1, bCraftable ? UI.clWINDOW_BORDER : this.clNOCRAFT_BORDER);
			oOption.__y = iRec;
			oOption.onClick = this.optionClick;
			oOption.onDblclick = this.optionDblclick;
			// Icone
			oIcon = oOption.linkControl(new UI.Icon());
			oIcon.setSize(UI.INV_ICON_SIZE, UI.INV_ICON_SIZE);
			// icone centrée en Y, marge Y rapporté en X
			oIcon.moveTo(yIcon, yIcon);
			oIcon.setImage(this.oParams.image);
			oIcon.xStart = oItem.icon * UI.INV_ICON_SIZE;
			if (oItem.stackcount > 1) {
				oIcon.setStackCounter(oItem.stackcount);
			}
			oIcon._set('_bRedCross', !bCraftable);
			// Intitulé
			oCaption = oOption.linkControl(new H5UI.Text());
			oCaption.font.setFont('monospace');
			oCaption.font.setSize(12);
			oCaption.font.setColor(UI.clFONT);
			oCaption.setAutosize(true);
			oCaption.moveTo(64, 16);
			oCaption.setCaption(oItem.name);
			// ingrédients
			for (iComp = 1; iComp < r[iRec].length; iComp++) {
				oComp = r[iRec][iComp];
				oIcon = oOption.linkControl(new UI.Icon());
				oIcon.setSize(UI.INV_ICON_SIZE, UI.INV_ICON_SIZE);
				oIcon.moveTo(this.nOptionWidth - 1 - (UI.INV_ICON_SIZE + 4) * iComp, yIcon);
				oIcon.setImage(this.oParams.image);
				oIcon.xStart = oComp.icon * UI.INV_ICON_SIZE;
				oIcon.setStackCounter(oComp.stackcount);
			}
		}
		var p = this.oPopup = this.linkControl(new UI.Window({caption: STRINGS._('~win_craft_progress')}));
		p.hide();
		p.setSize(320, 160);
		p.moveTo((this.nWidth - p.getWidth()) >> 1, (this.nHeight - p.getHeight()) >> 1);

		// caption de message warning, error etc...
		oCaption = p.linkControl(new H5UI.Text());
		oCaption.font.setFont('monospace');
		oCaption.font.setSize(12);
		oCaption.font.setColor(UI.clFONT);
		oCaption.moveTo(20, 40);
		oCaption.setSize((this.nWidth - oCaption._x) >> 1, 60);
		oCaption.setAutosize(false);
		oCaption.setWordWrap(true);
		this.oPopupMessage = oCaption;
		
		// caption de petit message de progression
		oCaption = p.linkControl(new H5UI.Text());
		oCaption.font.setFont('monospace');
		oCaption.font.setSize(12);
		oCaption.font.setColor(UI.clFONT);
		oCaption.setAutosize(true);
		oCaption.moveTo(10, 80);
		this.oProgressCaption = oCaption;
		
		var pb = this.oProgressBar = p.linkControl(new UI.ProgressBar());
		pb.setSize(300, 24);
		pb.moveTo(10, 100);
		pb.setMax(100);
		pb.setProgress(0);
		p.setCommands([['~key_gen_close', 'craft_close', 4]]);
		p.command = function(s) {
			this.getParent().command(s);
		};
	}
});
