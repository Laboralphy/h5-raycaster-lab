
/**
 * Répète en boucle une fonction a des fins de benchmark
 * @param o objet à invoquer
 * @param f méthode de l'objet à benchmarker
 * @param iMax nombre d'itération
 * @return float : temps occupé par les itération de la méthode d'objet
 */
function benchmark(o, f, iMax) {
	var d1 = Date.now();
	for (var i = 0; i < iMax; i++) {
		f.apply(o, []);
	}
	return Date.now() - d1;
}


/**
 * Inclue le numéro de version dans l'élément identifié "ver"
 * @param sVersion
 * @return
 */
function displayVersion(sVersion) {
	var oVer = document.getElementById('ver');
	oVer.innerHTML = sVersion;
}

/**
 * Calcule la position d'un élément par rapport au coin superieur gauche de la fenêtre du navigateur
 * Cette fonction n'existe pas sur firefox.
 * @param oElement élément dont on cherche la position
 * @return array of int
 */
function getElementPos(oElement) {
	var x = 0;
	var y = 0;
	if (oElement.offsetParent) {
		do {
			x += oElement.offsetLeft;
			y += oElement.offsetTop;
		} while (oElement = oElement.offsetParent);
	}
	return [x, y];
}

/**
 * Evènement resize window
 * appelée lorsqu'on redimension la fenetre
 * @param oEvent
 * @return void
 */
function windowResizeEvent(oEvent) {
	var oCanvas = document.getElementById('screen');
	if (oCanvas) {
		var xy = getElementPos(oCanvas);
		oCanvas.__x = xy[0];
		oCanvas.__y = xy[1];
	}
}


function resizeScreen(x, y) {
	var oCanvas = document.getElementById('screen');
	oCanvas.style.width = x.toString() + 'px';
	oCanvas.style.height = y.toString() + 'px';
	oCanvas.__ratio = x / 800;
}






/**
 * Fonction principale appelée au chargement de la page
 * @return void
 */
function main() {
	// Game initialisation
	window.G = new Game();
	window.addEventListener('blur', function(oEvent) { G.blur(); }, false);
	window.addEventListener('focus', function(oEvent) { G.focus(); }, false);
	window.addEventListener('resize', windowResizeEvent, false);

	var oCanvas = document.getElementById('screen');
	oCanvas.addEventListener('mousedown', function(oEvent) {
		if (!O876_Raycaster.PointerLock.locked()) {
			G.enterPointerLockedMode();
		}
	});

	windowResizeEvent(null);
	// Afficher le numéro de version
	displayVersion(G.sys_getVersion());
}

window.addEventListener('load', main);
