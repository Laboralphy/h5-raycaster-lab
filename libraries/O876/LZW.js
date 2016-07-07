O2.createClass('O876.LZW', {
	DICT_SIZE: 4096,
	PACKET_SEPARATOR: ':',
	FILE_SIGN: 'O876' + String.fromCharCode(122) + ':',

	nLastRatio: 0,		
	nMystificator: 0,

	encode: function(sData) {
		var aPackets = this._createEncodedPackets(sData);
		var sBin = this._bundlePackets(aPackets);
		this.nLastRatio = sBin.length * 100 / sData.length | 0;
		return this.FILE_SIGN + sBin;
	},

	decode: function(sZData) {
		if (sZData.substr(0, this.FILE_SIGN.length) !== this.FILE_SIGN) {
			throw new Error('bad format');
		}
		var aPacketCount = this._getPacketInt(sZData, this.FILE_SIGN.length);
		var nCount = aPacketCount[0];
		var iOffset = aPacketCount[1];
		var aPackets = this._parsePackets(sZData, nCount, iOffset); 
		return this._decodePackets(aPackets);
	},

	_bundlePackets: function(aPackets) {
		var aOutput = [];
		var sSep = this.PACKET_SEPARATOR;
		aOutput.push(aPackets.length.toString(16));
		aOutput.push(sSep);
		for (var i = 0; i < aPackets.length; i++) {
			aOutput.push(aPackets[i].length.toString(16));
			aOutput.push(sSep);
			aOutput.push(aPackets[i]);
		}
		return aOutput.join('');
	},

	_getPacketInt: function(sPacket, iFrom) {
		var i = iFrom;
		var sNumber = '0x';
		var sSep = this.PACKET_SEPARATOR;
		while (sPacket.substr(i, 1) != sSep) {
			sNumber += sPacket.substr(i, 1);
			i++;
		}
		var nNumber = parseInt(sNumber);
		if (isNaN(nNumber)) {
			throw new Error('corrupted data ' + sNumber);
		}
		return [parseInt(sNumber), i + 1];
	},

	_parsePackets: function(sPackets, nCount, iFrom) {
		var aGPI, nLength, aOutput = [];
		for (var i = 0; i < nCount; i++) {
			aGPI = this._getPacketInt(sPackets, iFrom);
			nLength = aGPI[0];
			iFrom = aGPI[1];
			aOutput.push(sPackets.substr(iFrom, nLength));
			iFrom += nLength;
		}
		return aOutput;
	},

	_createEncodedPackets: function(s) {
		var i = 0;
		var o = [];
		var aOutput = [];
		do {
			o = this._encodeFragment(s, i);
			i = o[1];
			aOutput.push(o[2]);
		} while (!o[0]);
		return aOutput;
	},

	_decodePackets: function(a) {
		var o = [];
		for (var i = 0; i < a.length; i++) {
			o.push(this._decodeFragment(a[i]));
		}
		return o.join('');
	},

	_encodeFragment: function(s, iFrom) {
		var d = {};
		var i, iCode = 256;
		for (i = 0; i < 256; i++) {
			d[String.fromCharCode(i)] = i;
		}
		var w = '';
		var c;
		var wc;
		var o = [];
		var iIndex;
		var nLen = s.length;
		var bEnd = true;
		for (iIndex = iFrom; iIndex < nLen; iIndex++) {
			c = s.charAt(iIndex);
			wc = w + c;
			if (wc in d) {
				w = wc;
			} else {
				d[wc] = iCode++;
				o.push(d[w]);
				w = c;
			}
			if (d.length >= this.DICT_SIZE) {
				bEnd = false;
				iIndex++;
				break;
			}
		}
		o.push(d[w]);
		for (i = 0; i < o.length; i++) {
			o[i] = String.fromCharCode(o[i] ^ this.nMystificator);
		}
		return [bEnd, iIndex, o.join('')];
	},
	
	_decodeFragment: function(s) {
		var a;
		if (typeof s === 'string') {
			a = s.split('');
		} else {
			a = s;
		}
		for (var i = 0; i < a.length; i++) {
			a[i] = a[i].charCodeAt(0) ^ this.nMystificator;
		}
		var c, w, e = '', o = [], d = [];
		for (i = 0; i < 256; i++) {
			d.push(String.fromCharCode(i));
		}
		c = a[0];
		o.push(w = String.fromCharCode(c));
		for (i = 1; i < a.length; i++) {
			c = a[i];
			if (c > 255 && d[c] !== undefined) {
				e = d[c];
			} else if (c > 255 && d[c] === undefined) {
				e = w + e.charAt(0);
			} else {
				e = String.fromCharCode(c);
			}
			o.push(e);
			d.push(w + e.charAt(0));
			w = e;
		}
		return o.join('');
	}
});
