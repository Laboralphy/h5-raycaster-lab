/**
 * A class for manipulating canvas
 * Provides gimp like filter and effect like blur, emboss, sharpen
 */

O2.createClass('O876.Philter', {

	_oFilters: null,
	
	perf: null,

	__construct: function() {
		if ('performance' in window) {
			this.perf = performance;
		} else {
			this.perf = Date;
		}
		this.config({
			kernel: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
			bias: 0,
			factor: 1,
			more: false,
			radius: 1,
			level: 50,
			left: 0,
			top: 0,
			width: null,
			height: null,
			right: 0,
			bottom: 0,
			red: true,
			green: true,
			blue: true,
			alpha: true,
			channels: 'rgba',
			command: '',
			sync: true,
			delay: 256
		});
	},

	/**
	 * Configures the instance
	 * @param c string|object if this is a string, the function returns the 
	 * value of the config key. If c is an object, the function modify configuration
	 * according to the key/values pairs contained in the object
	 * @return value | this
	 */
	config: function(c, v) {
		return this.data(c, v);
	},

	init: function(p1, p2) {
		// analyzing parameters
		var sArgs = O876.typeMap(arguments, 'short');
		switch (sArgs) {
			case 's': // one string
			case 'su': // one string
				this.config('command', p1);
			break;
			
			case 'so': // one string, one object
				this.config(p2);
				this.config('command', p1);
			break;
			
			case 'o':
			case 'ou': // one object
				this.config(p1);
			break;
			
			case 'sf': // define new filter
				this._oFilters[p1] = p2;
				return;
			break;
			
			default:
				throw new Error('bad parameter format');
		}
		var sChannels = this.config('channels').toLowerCase();
		this.config('red', sChannels.indexOf('r') >= 0);
		this.config('green', sChannels.indexOf('g') >= 0);
		this.config('blue', sChannels.indexOf('b') >= 0);
		this.config('alpha', sChannels.indexOf('a') >= 0);
	},

	/**
	 * builds a canvas and copy the given image content inside this canvas
	 * builds a pixel buffer
	 * builds a structure containing references to the image, the canvas
	 * and the pixel buffer
	 * @param oImage DOM Image
	 * @return a structure
	 */
	buildShadowCanvas: function(oCanvas) {
		var ctx = oCanvas.getContext('2d');
		var w = oCanvas.width;
		var h = oCanvas.height;
		var imgdata = ctx.getImageData(0, 0, w, h);
		var data = new Uint32Array(imgdata.data.buffer);
		
		return {
			canvas: oCanvas,
			context: ctx,
			imageData: imgdata,
			pixelData: imgdata.data,
			pixels: data,
			width: w,
			height: h,
			_p: false
		};
	},

	/**
	 * Copies the pixel data buffer to the original canvas ;
	 * This operation visually modify the image
	 * @param sc Structure built by buildShadowCanvas()
	 */
	commitShadowCanvas: function(sc) {
		if (sc._p) {
			sc.context.putImageData(sc.imageData, 0, 0);
		}
	},


	/**
	 * Get the working region
	 */
	getRegion: function(sc) {
		var xs = this.config('left');
		var ys = this.config('top');
		var xe = this.config('width') !== null ? xs + this.config('width') - 1 : null;
		var ye = this.config('height') !== null ? ys + this.config('height') - 1 : null;
		xe = xe !== null ? xe : sc.width - this.config('left') - 1;
		ye = ye !== null ? ye : sc.height - this.config('right') - 1;
		return {
			xs: xs,
			ys: ys,
			xe: xe,
			ye: ye
		};
	},

	/**
	 * Get a color structure of the given pixel
	 * if a color structure is specified, the function will fill this
	 * structure with pixel color values. this will prevent from
	 * building a new object each time a pixel is read,
	 * and will potentially increase overall performances
	 * in all cases, the color structure is also returned
	 * @param sc Shadow Canvas structure
	 * @param x pixel x
	 * @param y pixel y
	 * @param oResult optional Color structure {r: int, g: int, b: int, a: int}
	 * @return Color structure
	 */
	getPixel: function(sc, x, y, oResult) {
		if (oResult === undefined) {
			oResult = {};
		}
		if (x >= 0 && y >= 0 && x < sc.width && y < sc.height) {
			var n = y * sc.width + x;
			var p = sc.pixels[n];
			oResult.r = p & 255;
			oResult.g = (p >> 8) & 255;
			oResult.b = (p >> 16) & 255;
			oResult.a = (p >> 24) & 255;
			return oResult;
		} else {
			return null;
		}
	},


	/**
	 * Change pixel value
	 * @param sc Shadow Canvas structure
	 * @param x pixel x
	 * @param y pixel y
	 * @param c Color structure {r: int, g: int, b: int, a: int}
	 */
	setPixel: function(sc, x, y, c) {
		if (x >= 0 && y >= 0 && x < sc.width && y < sc.height) {
			var n = y * sc.width + x;
			var nAlpha = ('a' in c) ? c.a << 24 : (sc.pixels[n] & 0xFF000000);
			sc.pixels[n] = c.r | (c.g << 8) | (c.b << 16) | nAlpha;
			sc._p = true;
		}
	},
	
	
	/**
	 * applies a function to each pixel
	 * @param sc shadow canvas
	 * @param pFunc function to call
	 */
	pixelProcess: function(sc, pFunc, oContext) {
		var x, y, p = {}, r = {}, k;
		var w = sc.width;
		var h = sc.height;
		var bChr = this.config('red');
		var bChg = this.config('green');
		var bChb = this.config('blue');
		var bCha = this.config('alpha');
		var factor = this.config('factor');
		var bias = this.config('bias');
		var r = this.getRegion(sc);
		var nStartTime = this.perf.now();
		var perf = this.perf;
		var nDelay = this.config('delay');
		var bASync = !this.config('sync');
		var rxs = r.xs;
		var rys = r.ys;
		var xFrom = rxs;
		var yFrom = rys;
		var rxe = r.xe;
		var rye = r.ye;
		if (oContext) {
			xFrom = oContext.x;
			yFrom = oContext.y;
		} else {
			this.trigger('progress', {value: 0});
		}
		var getPixel = this.getPixel;
		var setPixel = this.setPixel;
		for (y = yFrom; y <= rye; ++y) {
			for (x = xFrom; x <= rxe; ++x) {
				this.getPixel(sc, x, y, p);
				for (k in p) {
					r[k] = p[k];
				}
				pFunc(x, y, p);
				if (bChr) {
					r.r = Math.min(255, Math.max(0, factor * p.r + bias)) | 0;
				}	
				if (bChg) {
					r.g = Math.min(255, Math.max(0, factor * p.g + bias)) | 0;
				}
				if (bChb) {
					r.b = Math.min(255, Math.max(0, factor * p.b + bias)) | 0;
				}
				if (bCha) {
					r.a = Math.min(255, Math.max(0, factor * p.a + bias)) | 0;
				}
				this.setPixel(sc, x, y, r);
			}
			xFrom = rxs;
			var pn = perf.now();
			var nElapsedTime = pn - nStartTime;
			if (bASync && nElapsedTime > nDelay) {
				nStartTime = pn;
				requestAnimationFrame((function() {
					this.trigger('progress', { elapsed: nElapsedTime, value: (y - rys) / (rye - rys)});
					this.pixelProcess(sc, pFunc, {
						x: x,
						y: y
					});
				}).bind(this));
				return;
			}
		}
		if (bASync) {
			this.trigger('progress', {value: 1});
			this.trigger('pixelprocess.end', {sc: sc});
		}
	},

	/**
	 * filter: convolution
	 * applies a convolution kernel on the image
	 * used options:
	 * 	- kernel
	 *  - factor
	 * 	- bias
	 */
	convolutionProcess: function(scs) {
		var x, y, p = {}, nc = {}, xyf;
		var scd = this.buildShadowCanvas(scs.canvas);
		var w = scs.width;
		var h = scs.height;
		var aMatrix = this.config('kernel');
		var yfCount = aMatrix.length;
		var xfCount = yfCount > 0 ? aMatrix[0].length : 0;
		this.pixelProcess(scs, (function(x, y, p) {
			var xm, ym, xf, yf, p2 = {}, k;
			for (k in p) {
				p[k] = 0;
			}
			for (yf = 0; yf < yfCount; ++yf) {
				for (xf = 0; xf < xfCount; ++xf) {
					xm = (x - (xfCount >> 1) + xf + w) % w;
					ym = (y - (yfCount >> 1) + yf + h) % h;
					if (this.getPixel(scd, xm, ym, p2)) {
						xyf = aMatrix[yf][xf];
						for (k in p2) {
							p[k] += p2[k] * xyf;
						}
					}
				}
			}
		}).bind(this));
	},

	/**
	 * applies a contrast filter
	 * @param level 
	 */
	filterContrast: function(sc) {
		var c = this.config('level');
		var f = (259 * (c + 255)) / (255 * (259 - c));
		this.pixelProcess(sc, function(x, y, p) {
			p.r = f * (p.r - 128) + 128;
			p.g = f * (p.g - 128) + 128;
			p.b = f * (p.b - 128) + 128;
		});
	},

	/**
	 * Applies a negate color filter
	 */
	filterNegate: function(sc) {
		this.pixelProcess(sc, function(x, y, p) {
			p.r = 255 - p.r;
			p.g = 255 - p.g;
			p.b = 255 - p.b;
		});
	},

	/**
	 * Applies a color filter
	 * @param kernel a 3x3 kernel, corresponding to a transformation matrix
	 */
	filterColor: function(sc) {
		var m = this.config('kernel');
		if (m.length < 3) {
			throw new Error('color kernel must be 3x3 sized');
		}
		if (m[0].length < 3 || m[1].length < 3 || m[2].length < 3) {
			throw new Error('color kernel must be 3x3 sized');
		}
		this.pixelProcess(sc, function(x, y, p) {
			var r = (p.r * m[0][0] + p.g * m[0][1] + p.b * m[0][2]);
			var g = (p.r * m[1][0] + p.g * m[1][1] + p.b * m[1][2]);
			var b = (p.r * m[2][0] + p.g * m[2][1] + p.b * m[2][2]);
			p.r = r;
			p.g = g;
			p.b = b;
		});
	},

	/**
	 * Applies a noise filter
	 * @param level amount of noise
	 */
	filterNoise: function(sc) {
		var nAmount = this.config('level');
		this.pixelProcess(sc, function(x, y, p) {
			var nb = nAmount * (Math.random() - 0.5);
			p.r = Math.min(255, Math.max(0, p.r + nb)) | 0;
			p.g = Math.min(255, Math.max(0, p.g + nb)) | 0;
			p.b = Math.min(255, Math.max(0, p.b + nb)) | 0;
		});
	},

	/**
	 * Build a gaussian blur matrix
	 * @param phi
	 */
	buildGaussianBlurMatrix: function(phi) {
		var nSize = Math.max(1, Math.ceil(phi * 3));
		var a = [], row;
		var y, x;
		for (y = -nSize; y <= nSize; ++y) {
			row = [];
			for (x = -nSize; x <= nSize; ++x) {
				row.push((1 / (2 * Math.PI * phi * phi)) * Math.exp(-(x * x + y * y) / (2 * phi * phi)));
			}
			a.push(row);
		}
		return a;
	},

	/** 
	 * Applies a hsl filter to change hue, brightness and saturation
	 */
	filterHSL: function(sc) {
		/**
		 * Converts an RGB color value to HSL. Conversion formula
		 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
		 * Assumes r, g, and b are contained in the set [0, 255] and
		 * returns h, s, and l in the set [0, 1].
		 *
		 * @param   Number  r       The red color value
		 * @param   Number  g       The green color value
		 * @param   Number  b       The blue color value
		 * @return  Array           The HSL representation
		 */
		function rgbToHsl(r, g, b){
			r /= 255, g /= 255, b /= 255;
			var max = Math.max(r, g, b), min = Math.min(r, g, b);
			var h, s, l = (max + min) / 2;

			if (max == min){
				h = s = 0; // achromatic
			} else {
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch(max){
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
			}

			return [h, s, l];
		}

		// utility function used by hslToRgb
		function hue2rgb(p, q, t){
			if (t < 0) {
				++t;
			}
			if (t > 1) {
				--t;
			}
			if (t < 1 / 6) {
				return p + (q - p) * 6 * t;
			}
			if (t < 1 / 2) {
				return q;
			}
			if (t < 2 / 3) {
				return p + (q - p) * (2/3 - t) * 6;
			}
			return p;
		}
		
		/**
		 * Converts an HSL color value to RGB. Conversion formula
		 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
		 * Assumes h, s, and l are contained in the set [0, 1] and
		 * returns r, g, and b in the set [0, 255].
		 *
		 * @param   Number  h       The hue
		 * @param   Number  s       The saturation
		 * @param   Number  l       The lightness
		 * @return  Array           The RGB representation
		 */
		function hslToRgb(h, s, l) {
			var r, g, b;

			if (s === 0){
				r = g = b = l; // achromatic
			} else {
				var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				var p = 2 * l - q;
				r = hue2rgb(p, q, h + 1/3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1/3);
			}
			return [r * 255, g * 255, b * 255];
		}
		var hue = this.config('hue') || 0;
		var saturation = this.config('saturation') || 0;
		var lightness = this.config('lightness') || 0;

		this.pixelProcess(sc, function(x, y, pixel) {
			var hsl = rgbToHsl(pixel.r, pixel.g, pixel.b);
			var h = (hsl[0] + hue + 1) % 1;
			var s = Math.min(1, Math.max(0, hsl[1] + saturation));
			var l = Math.min(1, Math.max(0, hsl[2] + lightness));
			h += hue;
			var rgb = hslToRgb(h, s, l);
			pixel.r = rgb[0];
			pixel.g = rgb[1];
			pixel.b = rgb[2];
		});
	},
	
	/**
	 * description copied from http://www.incx.nec.co.jp/imap-vision/library/wouter/kuwahara.html
	 * implemented by Øyvind Kolås <oeyvindk@hig.no> 2004
	 * Performs the Kuwahara Filter
	 */
	filterKuwahara: function(sc) {
		var oSelf = this;
		var edge_duplicate = 1;
		var height = sc.height;
		var width = sc.width;
		
		function get_rgb(x, y) {
			var p = oSelf.getPixel(sc, Math.min(width - 1, Math.max(0, x)), Math.min(height - 1, Math.max(0, y)));
			p.r /= 255;
			p.g /= 255;
			p.b /= 255;
			return p;
		}

		function get_value(x, y) {
			var p = get_rgb(x, y);
			var max = Math.max(p.r, p.g, p.b), min = Math.min(p.r, p.g, p.b);
			return (max + min) / 2;
		}
		
		function set_rgb(x, y, r, g, b) {
			if (x >= 0 && x < width && y >= 0 && y < height) {
				oSelf.setPixel(sc, x, y, {r: r * 255 | 0, g: g * 255 | 0, b: b * 255 | 0});
			}
		}
		
		// local function to get the mean value, and
		// variance from the rectangular area specified
		
		function rgb_mean_and_variance (x0, y0, x1, y1) {
			var variance, mean, r_mean, g_mean, b_mean;
			var min = 1;
			var max = 0;
			var accumulated_r = 0;
			var accumulated_g = 0;
			var accumulated_b = 0;
			var count = 0;
			var x, y, v, rgb;
	 
			for (y = y0; y <= y1; ++y) {
				for (x = x0; x <= x1; ++x) {
					v = get_value(x, y);
					rgb = get_rgb(x, y);
					accumulated_r += rgb.r;
					accumulated_g += rgb.g;
					accumulated_b += rgb.b;
					++count;
					if (v < min) {
						min = v;
					}
					if (v > max) {
						max = v;
					}
				}
			}
			variance = max - min,
			mean_r = accumulated_r / count;
			mean_g = accumulated_g / count;
			mean_b = accumulated_b / count;
			return {mean: {r: mean_r, g: mean_g, b: mean_b}, variance: variance};
		}

		// return the kuwahara computed value
		function rgb_kuwahara(x, y, radius) {
			var best_r, best_g, best_b;
			var best_variance = 1.0;
			
			function updateVariance(x0, y0, x1, y1) {
				var m = rgb_mean_and_variance (x0, y0, x1, y1);
				if (m.variance < best_variance) {
					best_r = m.mean.r;
					best_g = m.mean.g;
					best_b = m.mean.b;
					best_variance = m.variance;
				}
			}
			
			updateVariance(x - radius, y - radius, x, y);
			updateVariance(x, y - radius, x + radius, y);
			updateVariance(x, y, x + radius, y + radius);
			updateVariance(x - radius, y, x, y + radius);
			return {r: best_r * 255 | 0, g: best_g * 255 | 0, b: best_b * 255 | 0};
		}

		var radius = this.config('radius');
		
		this.pixelProcess(sc, function(x, y, p) {
			var rgb = rgb_kuwahara(x, y, radius);
			p.r = rgb.r;
			p.g = rgb.g;
			p.b = rgb.b;
		});
	},


	run: function(oCanvas, p1, p2) {
		this.init(p1, p2);
		var fStartTime = this.perf.now();
		var sc = this.buildShadowCanvas(oCanvas);
		this.one('pixelprocess.end', (function(oEvent) {
			this.commitShadowCanvas(oEvent.sc);
			this.trigger('complete', this.config());
		}).bind(this));
		switch (this.config('command')) {

			case 'contrast': 
				this.filterContrast(sc);
			break;

			case 'negate': 
				this.filterNegate(sc);
			break;

			case 'grayscale':
				this.config('kernel', [
					[0.30, 0.59, 0.11], 
					[0.30, 0.59, 0.11], 
					[0.30, 0.59, 0.11]
				]);
				this.filterColor(sc);
			break;
			
			case 'sepia':
				this.config('kernel', [
					[0.393, 0.769, 0.189],
					[0.349, 0.686, 0.168],
					[0.272, 0.534, 0.131]
				]);
				this.filterColor(sc);
			break;

			case 'color':
				this.filterColor(sc);
			break;

			case 'noise':
				this.filterNoise(sc);
			break;

			case 'hsl':
				this.filterHSL(sc);
			break;

			case 'blur':
				if (this.config('radius') < 2) {
					this.config('kernel', [
						[0.0, 0.2, 0.0],
						[0.2, 0.2, 0.2],
						[0.0, 0.2, 0.0]
					]);
				} else {
					this.config('kernel', this.buildGaussianBlurMatrix(Math.max(2, this.config('radius')) / 3));
				}
				this.convolutionProcess(sc);
			break;

			case 'convolution':
				this.convolutionProcess(sc);
			break;
			
			case 'pixelmap':
				this.pixelProcess(sc, this.config('func'));
			break;

			case 'sharpen':
				if (this.config('more')) {
					this.config('kernel', [
						[1,  1,  1], 
						[1, -7,  1], 
						[1,  1,  1] 
					]);
				} else {
					this.config('kernel', [
						[-1, -1, -1, -1, -1], 
						[-1,  2,  2,  2, -1], 
						[-1,  2,  8,  2, -1], 
						[-1,  2,  2,  2, -1], 
						[-1, -1, -1, -1, -1]
					]);
					this.config('factor', 1 / 8);
				}
				this.convolutionProcess(sc);
			break;
			
			case 'edges':
				this.config('alpha', false); // alpha channel will mess up everything
				this.config('kernel', [
					[-1, -1, -1], 
					[-1,  8, -1], 
					[-1, -1, -1] 
				]);
				this.convolutionProcess(sc);
			break;
			
			case 'emboss':
				if (this.config('sobel')) {
					this.config('kernel', [
						[-1, -2, -1], 
						[ 0,  0,  0], 
						[ 1,  2,  1]
					]);
				} else if (this.config('more')) {
					this.config('kernel', [
						[-2, -1,  0], 
						[-1,  1,  1], 
						[ 0,  1,  2]
					]);
				} else {
					this.config('kernel', [
						[-1, -1,  0], 
						[-1,  1,  1], 
						[ 0,  1,  1]
					]);
				}
				this.convolutionProcess(sc);
			break;
			
			case 'kuwahara':
				this.filterKuwahara(sc);
			break;
			
		}
		if (this.config('sync')) {
			this.commitShadowCanvas(sc);
			var fEndTime = this.perf.now();
			this.data('duration', fEndTime - fStartTime);
		}
	}


});

O2.mixin(O876.Philter, O876.Mixin.Data);
O2.mixin(O876.Philter, O876.Mixin.Events);
