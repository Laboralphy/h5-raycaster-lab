var oComponents = {
    leaf: 1,
    mush: 2, 
    dust: 3,
    root: 4
    // monster eye
    // demon tooth
    // 
};

var oRecipes = {
	// level 1
	pot_healing: 'leaf',
	pot_esp: 'dust',
	// toxic
	pot_slowness: 'root',
	// ---- mush
	
	// level 2
	pot_healing2: 'leaf mush',
	pot_resist: 'leaf root',
	pot_invisibility: 'mush dust',
	pot_energy: 'mush root',
	pot_luck: 'dust root',
	// toxic
	pot_poison: 'leaf dust',
	
	// level 3
	pot_healing3: 'leaf mush root',
	pot_remedy: 'leaf dust root',
	pot_haste: 'mush dust root',
	pot_confusion: 'leaf mush dust',
		
	// level 4
	pot_immortal: 'leaf mush dust root'
};


function buildData() {
	var aComp, nCode;
	var oData = [];
	var sRec = '';
	for (sRec in oRecipes) {
		r = oRecipes[sRec];
		aComp = r.split(' ');
		nCode = aComp.reduce(function(nPrev, sVal) {
			if (sVal in oComponents) {
				return nPrev | (1 << (oComponents[sVal] - 1));
			} else {
				throw new Error('alchemy recipe error : unknown component id : ' + sVal);
			}
		}, 0);
		if (oData[nCode]) {
			throw new Error('alchemy recipe error : "' + r + '" has already been used');
		}
		oData[nCode] = sRec;
	}
	return {
		recipes: oData,
		components: oComponents
	};
}


module.exports = {
	data: buildData(),
	update: function(nRecipe, data) {
		if (nRecipe & 1) {
			--data.leaf;
		}
		if (nRecipe & 2) {
			--data.mush;
		}
		if (nRecipe & 4) {
			--data.dust;
		}
		if (nRecipe & 8) {
			--data.root;
		}
	},
	test: function(nRecipe, data) {
		if ((nRecipe & 1) && data.leaf < 1) {
			return false;
		}
		if ((nRecipe & 2) && data.mush < 1) {
			return false;
		}
		if ((nRecipe & 4) && data.dust < 1) {
			return false;
		}
		if ((nRecipe & 8) && data.root < 1) {
			return false;
		}
		return true;
	}
};
