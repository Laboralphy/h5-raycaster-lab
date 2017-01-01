O2.createClass('O876.DragDrop', {
	
	onDrop: null, // évènement : on lache un élémnet dans une drop zone - (dropZone, item)
	onDragOver: null, // évènement : on déplace un élément au dessus de la drop zone
	onDragItem: null, // évènement : on commence à déplacer un élément draggable
	onReleaseItem: null, // évènement : on relache un élément 
	onDropZoneLightens: null,
	onDropZoneDarkens: null,

	/**
	 * Drag Start Event Handler
	 * @param oEvent
	 * @returns
	 */
	handleDragStart: function(oEvent) {
		var oTarget = oEvent.target;
		var $target = $(oTarget);
		if (this.onDragItem) {
			this.onDragItem(oEvent.target);
		}
		oEvent.dataTransfer.effectAllowed = 'move';
		var id = $target.attr('id');
		if (id === undefined) {
			throw new Error('draggable items must have "id" attribute set');
		}
		oEvent.dataTransfer.setData('Text', id);
	},
	
	handleDragEnd: function(oEvent) {
		if (this.onReleaseItem) {
			this.onReleaseItem(oEvent.target);
		}
	},
	
	handleDragOver: function(oEvent) {
		if (oEvent.preventDefault) {
			oEvent.preventDefault();
		}
		oEvent.dataTransfer.dropEffect = 'move';
		return false;
	},
	
	handleDragEnter: function(oEvent) {
		var $target = $(this.getDropZone(oEvent.target));
		this.dropZoneLight($target, true);
	},
	
	handleDragLeave: function(oEvent) {
		var $target = $(this.getDropZone(oEvent.target));
		this.dropZoneLight($target, false);
	},
	
	handleDrop: function(oEvent) {
		if (oEvent.stopPropagation) {
			oEvent.stopPropagation();
		}
		if (oEvent.preventDefault) {
			oEvent.preventDefault();
		}
		var $target = $(this.getDropZone(oEvent.target));
		var $origTarget = $('#' + oEvent.dataTransfer.getData('Text'));
		this.dropZoneLight($target, false);
		if (this.onDrop) {
			var p = $target.position();
			this.onDrop($target.get(0), $origTarget.get(0), oEvent.clientX - p.left, oEvent.clientY - p.top);
		}
		if (this.onReleaseItem) {
			this.onReleaseItem($origTarget.get(0));
		}
		return false;
	},
	
	/**
	 * Défini la surbrillance de la dropzone, gère les conflits de priorités des event Enter/Leave
	 */
	dropZoneLight: function(dz, bOn) {
		var $dz = $(dz);
		var nLight = $dz.data('dnd_dropzone_light') + (bOn ? 1 : -1);
		$dz.data('dnd_dropzone_light', nLight);
		if (nLight > 0) {
			if (this.onDropZoneLightens) {
				this.onDropZoneLightens(dz);
			}
		} else {
			if (this.onDropZoneDarkens) {
				this.onDropZoneDarkens(dz);
			}
		}
	},
	
	/**
	 * Renvoie la drop zone qui contient l'élément spécifié
	 */
	getDropZone: function(oElement) {
		var $element = $(oElement);
		while (!this.isDropZone($element.get(0))) {
			$element = $element.parent();
			if ($element.length === 0) {
				throw new Error('specified element is not inside a droppable element');
			}
		}
		return $element.get(0);
	},
	
	/**
	 * Défini une drop zone
	 */
	setDropZone: function(oItem, bDZ) {
		$(oItem).data({dnd_dropzone: bDZ, dnd_dropzone_light: 0});
	},
	
	/**
	 * Renvoie true si l'objet spécifié est une dropzone
	 */
	isDropZone: function(oItem) {
		return !!$(oItem).data('dnd_dropzone');
	},
	
	/**
	 * On effectue un traitement pour chaque entité d'un ensemble :
	 * on lui ajoute la fonctionnalité de dragging. 
	 */
	setDraggableEntities: function($set) {
		var self = this;
		$set.each(function() {
			var $ent = $(this);
			if ($ent.attr('draggable') != 'true') { // pas draggable
				$ent.attr('draggable', 'true');
				var oEnt = $ent.get(0);
				var pEventStart = self.handleDragStart.bind(self);
				var pEventEnd = self.handleDragEnd.bind(self);
				$ent.data('dragEventHandlers', {start: pEventStart, end: pEventEnd});
				oEnt.addEventListener('dragstart', pEventStart, false);
				oEnt.addEventListener('dragend', pEventEnd, false);
			}
		});
	},

	setDroppableEntities: function($set) {
		var self = this;
		$set.each(function() {
			var $ent = $(this);
			if (!self.isDropZone(this)) { // pas dropable
				self.setDropZone(this, true);
				var oEnt = $ent.get(0);
				var pEventOver = self.handleDragOver.bind(self);
				var pEventEnter = self.handleDragEnter.bind(self);
				var pEventLeave = self.handleDragLeave.bind(self);
				var pEventDrop = self.handleDrop.bind(self);
				$ent.data('dropEventHandlers', {
					over: pEventOver,
					enter: pEventEnter,
					leave: pEventLeave,
					drop: pEventDrop
				});
				oEnt.addEventListener('dragover', pEventOver, false);
				oEnt.addEventListener('dragenter', pEventEnter, false);
				oEnt.addEventListener('dragleave', pEventLeave, false);
				oEnt.addEventListener('drop', pEventDrop, false);
			}
		});
	},
	
	/**
	 * Remove draggable capability of an item
	 * @param oItem
	 */
	removeDraggableFlag: function(oItem) {
		var $ent = $(oItem);
		$ent.removeAttr('draggable');
		var pEvent = $ent.data('dragEventHandlers');
		oItem.removeEventListener('dragstart', pEvent.start, false);
		oItem.removeEventListener('dragend', pEvent.end, false);
	},
	
	removeDroppableFlag: function(oItem) {
		var $ent = $(oItem);
		if (this.isDropZone(oItem)) { // dropable : virer le flag
			var pEvent = $ent.data('dropEventHandlers');
			this.setDropZone(oItem, false);
			oItem.removeEventListener('dragover', pEvent.over);
			oItem.removeEventListener('dragenter', pEvent.enter);
			oItem.removeEventListener('dragleave', pEvent.leave);
			oItem.removeEventListener('drop', pEvent.drop);
		}
	},
	
	
});
