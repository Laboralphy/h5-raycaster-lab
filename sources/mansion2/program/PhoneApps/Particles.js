O2.extendClass('MANSION.PhoneApps.Particles', MANSION.PhoneApp.Abstract, {

	aParticles: null,
	fFriction: 0.9,
	oAttractor: null,
	oParticleCvs: null,
	
	__construct: function() {
		this.aParticles = [];	
	},
	
	addParticle: function(x, y, dx, dy) {
		var p = {
			x: x,
			y: y,
			z: 0,
			dx: dx,
			dy: dy,
			dz: 0,
			n: 100,
			sx: 1,
			sy: 1,
			done: false
		}
		this.aParticles.push(p);
		return p;
	},
	
	setAttractor: function(x, y, amp) {
		this.oAttractor = {x: x, y: y, amp: amp};
	},
	
	addRandomParticle: function(x, y, fStrength) {
		var fAngle = Math.random() * 2 * PI;
		var nStr = fStrength * 14;
		var fRadius = Math.random() * nStr + nStr;
		var p = this.addParticle(x, y, fRadius * Math.sin(fAngle), fRadius * Math.cos(fAngle));
		p.sx = p.sy = fStrength;
	},
	
	setParticleCanvas: function(c) {
		this.oParticleCvs = c;
	},
	
	applyAttractor: function(p, a) {
		var d = Math.max(5, MathTools.distance(p.x - a.x, p.y - a.y));
		var fAngleAttract = Math.atan2(a.x - p.x, a.y - p.y);
		var fAmp = a.amp / (d * d);
		p.dx += fAmp * Math.sin(fAngleAttract);
		p.dy += fAmp * Math.cos(fAngleAttract);		
	},
	
	processParticle: function(p) {
		if (p.x < 0 || p.y < 0) {
			p.done = true;
		}
		if (p.n <= 0) {
			p.done = true;
		}
		if (p.done) {
			return false;
		}
		var f = this.fFriction;
		p.dx *= f;
		p.dy *= f;

		this.applyAttractor(p, this.oAttractor);
		p.x += p.dx;
		p.y += p.dy;
		--p.n;
		return true;
	},
	
	processParticles: function() {
		this.aParticles = this.aParticles.filter(this.processParticle.bind(this));
	},
	
	renderParticle: function(p, oContext) {
		var c = this.oParticleCvs;
		var w = c.width * p.sx | 0;
		var h = c.height * p.sy | 0;
		oContext.drawImage(this.oParticleCvs, 0, 0, c.width, c.height, p.x - (w >> 1) | 0, p.y - (h >> 1) | 0, w, h);
	},	
	
	renderParticles: function(oContext) {
		var gco = oContext.globalCompositeOperation;
		oContext.globalCompositeOperation = 'lighter';
		var p = this.aParticles;
		for (var i = 0, l = p.length; i < l; ++i) {
			this.renderParticle(p[i], oContext);
		}
		oContext.globalCompositeOperation = gco;
	},
	
	render: function(oPhone) {
		this.processParticles();
		this.renderParticles(oPhone.oScreen.getContext('2d'));
	}
});
