/**
 * List and Form Window
 * Génère une fenetre avec une liste dont les éléments ont des propriété
 * qu'il est possible de modifier grace au formulaire générère à coté de la liste
 */
O2.extendClass('RCWE.ListAndForm', RCWE.Window, {
	
	_oList: null,
	_oForm: null,
	_oStruct: null,
	_aIdRecycler: null,
	_nMaxGivenId: null,
	_sSelected: null, // les listes perdent la mémoire quand y'en a plusieurs
	
	onSelect: null,
	onSave: null,
	
	build: function(sCustomTitle, sHtmlForm) {
		__inherited(sCustomTitle);
		
		this._aIdRecycler = [];
		this._nMaxGivenId = 0;
		
		this.addCommand('+', 'create new entry', this.cmd_add.bind(this));
		this.addCommand('-', 'delete the selected entry', this.cmd_del.bind(this));
		this.addCommand('⬆', 'move the selected entry up', this.cmd_up.bind(this));
		this.addCommand('⬇', 'move the selected entry down', this.cmd_down.bind(this));
		this.addCommand('✎', 'change the selected entry caption', this.cmd_ren.bind(this));

		var $oStruct = $('<table><tr><td></td><td></td></tr></table>');
		this._oStruct = $oStruct;
		this._oContainer.append($oStruct);
		var $oCells = $('td', $oStruct);

		// Création de la liste
		var $oList = $('<select style="font-size: 75%; width: 192px" size="15"></select>');
		this._oList = $oList;
		$oList.bind('change', this.cmd_select.bind(this));
		$oCells.eq(0).append($oList);
		
		// creation du formulaire
		var $oForm = $('<form></form>');
		$oForm.html(sHtmlForm);
		this._oForm = $oForm;
		$oCells.eq(1).append($oForm);
		
		this.getSelectedOption();
	},
	
	bindForm: function() {
		$('input, select', this.getForm()).bind('change', this.cmd_save.bind(this));
	},



	////// INTERROGATION ////// INTERROGATION ////// INTERROGATION //////
	////// INTERROGATION ////// INTERROGATION ////// INTERROGATION //////
	////// INTERROGATION ////// INTERROGATION ////// INTERROGATION //////
	////// INTERROGATION ////// INTERROGATION ////// INTERROGATION //////
	////// INTERROGATION ////// INTERROGATION ////// INTERROGATION //////
	////// INTERROGATION ////// INTERROGATION ////// INTERROGATION //////
	setSelectedOption: function(s) {
		this._sSelected = s;
		this._oList.val(s);
		$('option', this._oList).each(function() {
			var $this = $(this);
			if ($this.val() == s) {
				$this.attr('selected', 'selected');
			} else {
				$this.removeAttr('selected');
			}
		});
	},
	/**
	 * Renvoie l'option actuellement selectinnée ou null si aucune option n'est selectionnée
	 * active / désactive le formulaire selon si une option est seelctionnée
	 * @return option
	 */
	getSelectedOption: function() {
		var $oOption = $('option[value="' + this._sSelected + '"]', this._oList);
		if ($oOption.length) {
			return $oOption;
		} else {
			return null;
		}
	},
	
	clear: function() {
		$('option', this._oList).remove();
		this._aIdRecycler = [];
		this._nMaxGivenId = 0;
		this._sSelected = null;
	},
	
	/**
	 * Renvoie l'objet formulaire... pour pouvoir y ajouter des propriété
	 * @return form
	 */
	getForm: function() {
		return this._oForm;
	},


	////// IMPORT / EXPORT ////// IMPORT / EXPORT ////// IMPORT / EXPORT //////
	////// IMPORT / EXPORT ////// IMPORT / EXPORT ////// IMPORT / EXPORT //////
	////// IMPORT / EXPORT ////// IMPORT / EXPORT ////// IMPORT / EXPORT //////
	////// IMPORT / EXPORT ////// IMPORT / EXPORT ////// IMPORT / EXPORT //////
	////// IMPORT / EXPORT ////// IMPORT / EXPORT ////// IMPORT / EXPORT //////
	////// IMPORT / EXPORT ////// IMPORT / EXPORT ////// IMPORT / EXPORT //////
	/**
	 * Creer un objet d'exportation des données dans un but de sauvegarde
	 * @return array
	 */
	getData: function() {
		var aOutput = [];
		var oEntry;
		$('option', this._oList).each(function() {
			var $option = $(this);
			oEntry = {};
			$.extend(oEntry, $option.data());
			aOutput.push($option.val());
			aOutput.push($option.html());
			aOutput.push(oEntry);
		});
		return aOutput;
	},
	
	/**
	 * importation des données dans un but de restauration
	 * @param a array
	 */
	setData: function(a) {
		this._oList.empty();
		for (var i = 0; i < a.length; i += 3) {
			this._oList.append($('<option></option>').val(a[i]).html(a[i + 1]).data(a[i + 2]));
			this._nMaxGivenId = Math.max(this._nMaxGivenId, a[i] | 0);
		}
		if (a.length) {
			this._oList.val(a[0]);
			this.getSelectedOption();
			this.cmd_select();
		}
	},
	
	
	
	////// COMMANDES ////// COMMANDES ////// COMMANDES ////// COMMANDES //////
	////// COMMANDES ////// COMMANDES ////// COMMANDES ////// COMMANDES //////
	////// COMMANDES ////// COMMANDES ////// COMMANDES ////// COMMANDES //////
	////// COMMANDES ////// COMMANDES ////// COMMANDES ////// COMMANDES //////
	////// COMMANDES ////// COMMANDES ////// COMMANDES ////// COMMANDES //////
	////// COMMANDES ////// COMMANDES ////// COMMANDES ////// COMMANDES //////
	/**
	 * Commande d'ajout d'élément
	 */
	cmd_add: function(sNew) {
		if (typeof sNew !== 'string') {
			sNew = prompt('What is the new entry name ?');
		}
		if (sNew) {
			var $oOption = $('<option></option>');
			$oOption.html(sNew);
			// calculer le nouvel indice
			var iVal = this._aIdRecycler.shift();
			if (iVal === undefined) {
				iVal = ++this._nMaxGivenId;
			}
			$oOption.val(iVal);
			this._oList.append($oOption).val($oOption.val());
			this.cmd_select();
			return $oOption;
		} else {
			return null;
		}
	},
	
	/**
	 * Commande de suppression d'élément
	 */
	cmd_del: function() {
		var $oOption = this.getSelectedOption();
		if ($oOption) {
			if (confirm('Delete this entry ? : ' + $oOption.html())) {
				this._aIdRecycler.push($oOption.val() | 0);
				this._aIdRecycler.sort(function(a, b) { return a - b; });
				var $next = $oOption.next();
				var $new = $next.length ? $next : $oOption.prev();
				if ($new.length) {
					this._oList.val($new.val());
				}
				$oOption.remove();
				this.cmd_select();
			}
		}
	},
	
	/**
	 * Commande de déplacement d'élément vers le haut
	 */
	cmd_up: function() {
		var $option1 = this.getSelectedOption();
		if (!$option1) {
			return;
		}
		var $option2 = $option1.prev();
		if ($option2.length) {
			$option1.detach();
			$option2.before($option1);
		}
	},
	
	/**
	 * Commande de déplacement d'élément vers le bas
	 */
	cmd_down: function() {
		var $option1 = this.getSelectedOption();
		if (!$option1) {
			return;
		}
		var $option2 = $option1.next();
		if ($option2.length) {
			$option1.detach();
			$option2.after($option1);
		}
	},

	/**
	 * Renommage d'élément
	 */
	cmd_ren: function() {
		var $option = this.getSelectedOption();
		if (!$option) {
			return;
		}
		var sName = prompt('What is the entry new name ?', $option.html());
		if (sName) {
			$option.html(sName);
		}
	},

	/**
	 * Validation des modification des propriété de l'élément selectionné
	 */
	cmd_save: function(oEvent) {
		var $option = this.getSelectedOption();
		if (!$option) {
			return;
		}
		var $oForm = this._oForm;
		$('input, select', $oForm).each(function() {
			var $this = $(this);
			var sName = $this.attr('name');
			if (sName) {
				if ($this.attr('type') === 'checkbox') {
					$option.data(sName, $this.prop('checked'));
				} else {
					$option.data(sName, $this.val());
				}
			}
		});
		if (this.onSave) {
			this.onSave(this);
		}
	},
	
	/**
	 * Remplissage du formulaire à l'aide des propriété d'un élément nouvelelment 
	 * sélectionné
	 */
	cmd_load: function(oEvent) {
		var $option = this.getSelectedOption();
		if (!$option) {
			return;
		}
		var $oForm = this._oForm;
		$('input, select', $oForm).each(function() {
			var $this = $(this);
			var sName = $this.attr('name');
			if (sName) {
				switch ($this.attr('type')) {
					case 'checkbox':
						$this.prop('checked', !!$option.data(sName));
						break;

					case 'radio':
						$this.prop('checked', !!$option.data(sName));
						break;
						
					default:
						$this.val($option.data(sName));
				}
			}
		});
	},
	
	/**
	 * Réaction à la selection
	 */
	cmd_select: function() {
		this._sSelected = this._oList.val();
		this.cmd_load();
		if (this.onSelect) {
			this.onSelect(this);
		}
	},
});
