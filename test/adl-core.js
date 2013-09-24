(function () { "use strict";
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
var IMap = function() { }
IMap.__name__ = true;
var Reflect = function() { }
Reflect.__name__ = true;
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && v.__enum__ == null || t == "function" && (v.__name__ || v.__ename__) != null;
}
var Std = function() { }
Std.__name__ = true;
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	addSub: function(s,pos,len) {
		this.b += len == null?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
}
var adl = {}
adl.ADL = function() { }
$hxExpose(adl.ADL, "adl.ADL");
adl.ADL.__name__ = true;
adl.ADL.read = function(data) {
	var description = haxe.Json.parse(data);
	var reg = new adl.Registry();
	return reg.read(description);
}
adl.ADL.main = function() {
}
adl.Listenable = function() { }
adl.Listenable.__name__ = true;
adl.Listenable.prototype = {
	__class__: adl.Listenable
}
adl.Animation = function() {
	this.params = new haxe.ds.StringMap();
	this.events = new adl.Events();
	this.on("setdelay",$bind(this,this.setDelay));
};
adl.Animation.__name__ = true;
adl.Animation.__interfaces__ = [adl.Listenable];
adl.Animation.prototype = {
	trigger: function(name,data) {
		this.events.trigger(name,data);
	}
	,on: function(name,callback) {
		this.events.on(name,callback);
	}
	,read: function(description) {
		var _g = 0, _g1 = Reflect.fields(description);
		while(_g < _g1.length) {
			var name = _g1[_g];
			++_g;
			var param = new adl.Parameter();
			param.set(Reflect.getProperty(description,name));
			this.params.set(name,param);
			this.trigger("set" + name,param);
		}
		return this;
	}
	,setDelay: function(param) {
		console.log("set delay");
	}
	,__class__: adl.Animation
}
adl.AnimationFactory = function() { }
adl.AnimationFactory.__name__ = true;
adl.AnimationFactory.readArray = function(description) {
	var sequenceDescription = description;
	var animation = null;
	if(sequenceDescription.length > 1) {
		animation = new adl.Sequence();
		animation.read(description);
	} else if(sequenceDescription.length == 1 && js.Boot.__instanceof(sequenceDescription[0],Array)) {
		animation = new adl.Parallel();
		animation.read(sequenceDescription[0]);
	} else throw "A sequence should have 2 or more animations";
	return animation;
}
adl.AnimationFactory.readObject = function(description) {
	var animation = null;
	if(Reflect.hasField(description,"type")) {
		var type = Reflect.getProperty(description,"type");
		switch(type) {
		case "linear":
			animation = new adl.animation.Linear();
			animation.read(description);
			break;
		default:
			throw "Unrecognized type : " + type;
		}
	} else throw "Can't read an animation with no type";
	return animation;
}
adl.AnimationFactory.create = function(description) {
	var animation = null;
	if(js.Boot.__instanceof(description,Array)) animation = adl.AnimationFactory.readArray(description); else if(Reflect.isObject(description)) animation = adl.AnimationFactory.readObject(description); else throw "Unknown animation type";
	return animation;
}
adl.Context = function() {
	this.data = { };
};
adl.Context.__name__ = true;
adl.Context.prototype = {
	getValue: function(name,defaultV) {
		var result = defaultV;
		if(Reflect.hasField(this.data,name)) result = Reflect.getProperty(this.data,name);
		return result;
	}
	,__class__: adl.Context
}
adl.Events = function() {
	this.routes = new haxe.ds.StringMap();
};
adl.Events.__name__ = true;
adl.Events.__interfaces__ = [adl.Listenable];
adl.Events.prototype = {
	trigger: function(name,data) {
		var callbacks = this.routes.get(name);
		if(callbacks != null) {
			var _g = 0;
			while(_g < callbacks.length) {
				var callback = callbacks[_g];
				++_g;
				callback(data);
			}
		}
	}
	,on: function(name,callback) {
		var callbacks = this.routes.get(name);
		if(callbacks == null) {
			callbacks = new Array();
			this.routes.set(name,callbacks);
		}
		callbacks.push(callback);
	}
	,__class__: adl.Events
}
adl.Sequence = function() {
	adl.Animation.call(this);
	this.animations = new Array();
};
adl.Sequence.__name__ = true;
adl.Sequence.__super__ = adl.Animation;
adl.Sequence.prototype = $extend(adl.Animation.prototype,{
	read: function(descriptions) {
		adl.Animation.prototype.read.call(this,descriptions);
		var _g = 0;
		while(_g < descriptions.length) {
			var description = descriptions[_g];
			++_g;
			this.animations.push(adl.AnimationFactory.create(description));
		}
		return this;
	}
	,__class__: adl.Sequence
});
adl.Parallel = function() {
	adl.Sequence.call(this);
};
adl.Parallel.__name__ = true;
adl.Parallel.__super__ = adl.Sequence;
adl.Parallel.prototype = $extend(adl.Sequence.prototype,{
	__class__: adl.Parallel
});
adl.Parameter = function() {
	this.ctx = new adl.Context();
};
adl.Parameter.__name__ = true;
adl.Parameter.prototype = {
	getValue: function(name) {
		return this.ctx.getValue(name);
	}
	,set: function(value) {
		return this;
	}
	,__class__: adl.Parameter
}
adl.Registry = function() {
	this.animations = new haxe.ds.StringMap();
};
adl.Registry.__name__ = true;
adl.Registry.prototype = {
	read: function(description) {
		var _g = 0, _g1 = Reflect.fields(description);
		while(_g < _g1.length) {
			var field = _g1[_g];
			++_g;
			var animationDescription = Reflect.getProperty(description,field);
			this.animations.set(field,adl.AnimationFactory.create(animationDescription));
		}
		return this;
	}
	,__class__: adl.Registry
}
adl.animation = {}
adl.animation.Linear = function() {
	adl.Animation.call(this);
};
adl.animation.Linear.__name__ = true;
adl.animation.Linear.__super__ = adl.Animation;
adl.animation.Linear.prototype = $extend(adl.Animation.prototype,{
	settype: function(param) {
		console.log("dat setter");
	}
	,__class__: adl.animation.Linear
});
var haxe = {}
haxe.Json = function() {
};
haxe.Json.__name__ = true;
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
}
haxe.Json.prototype = {
	parseNumber: function(c) {
		var start = this.pos - 1;
		var minus = c == 45, digit = !minus, zero = c == 48;
		var point = false, e = false, pm = false, end = false;
		while(true) {
			c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 48:
				if(zero && !point) this.invalidNumber(start);
				if(minus) {
					minus = false;
					zero = true;
				}
				digit = true;
				break;
			case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				if(zero && !point) this.invalidNumber(start);
				if(minus) minus = false;
				digit = true;
				zero = false;
				break;
			case 46:
				if(minus || point) this.invalidNumber(start);
				digit = false;
				point = true;
				break;
			case 101:case 69:
				if(minus || zero || e) this.invalidNumber(start);
				digit = false;
				e = true;
				break;
			case 43:case 45:
				if(!e || pm) this.invalidNumber(start);
				digit = false;
				pm = true;
				break;
			default:
				if(!digit) this.invalidNumber(start);
				this.pos--;
				end = true;
			}
			if(end) break;
		}
		var f = Std.parseFloat(HxOverrides.substr(this.str,start,this.pos - start));
		var i = f | 0;
		return i == f?i:f;
	}
	,invalidNumber: function(start) {
		throw "Invalid number at position " + start + ": " + HxOverrides.substr(this.str,start,this.pos - start);
	}
	,parseString: function() {
		var start = this.pos;
		var buf = new StringBuf();
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			if(c == 34) break;
			if(c == 92) {
				buf.addSub(this.str,start,this.pos - start - 1);
				c = this.str.charCodeAt(this.pos++);
				switch(c) {
				case 114:
					buf.b += "\r";
					break;
				case 110:
					buf.b += "\n";
					break;
				case 116:
					buf.b += "\t";
					break;
				case 98:
					buf.b += "";
					break;
				case 102:
					buf.b += "";
					break;
				case 47:case 92:case 34:
					buf.b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCharCode(uc);
					break;
				default:
					throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
				}
				start = this.pos;
			} else if(c != c) throw "Unclosed string";
		}
		buf.addSub(this.str,start,this.pos - start - 1);
		return buf.b;
	}
	,parseRec: function() {
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 32:case 13:case 10:case 9:
				break;
			case 123:
				var obj = { }, field = null, comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 125:
						if(field != null || comma == false) this.invalidChar();
						return obj;
					case 58:
						if(field == null) this.invalidChar();
						obj[field] = this.parseRec();
						field = null;
						comma = true;
						break;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					case 34:
						if(comma) this.invalidChar();
						field = this.parseString();
						break;
					default:
						this.invalidChar();
					}
				}
				break;
			case 91:
				var arr = [], comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 93:
						if(comma == false) this.invalidChar();
						return arr;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					default:
						if(comma) this.invalidChar();
						this.pos--;
						arr.push(this.parseRec());
						comma = true;
					}
				}
				break;
			case 116:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 114 || this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return true;
			case 102:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 97 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 115 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return false;
			case 110:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 108) {
					this.pos = save;
					this.invalidChar();
				}
				return null;
			case 34:
				return this.parseString();
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
				return this.parseNumber(c);
			default:
				this.invalidChar();
			}
		}
	}
	,invalidChar: function() {
		this.pos--;
		throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
	}
	,doParse: function(str) {
		this.str = str;
		this.pos = 0;
		return this.parseRec();
	}
	,__class__: haxe.Json
}
haxe.ds = {}
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: haxe.ds.StringMap
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(typeof(JSON) != "undefined") haxe.Json = JSON;
adl.ADL.version = "0.0.1";
adl.ADL.main();
function $hxExpose(src, path) {
	var o = typeof window != "undefined" ? window : exports;
	var parts = path.split(".");
	for(var ii = 0; ii < parts.length-1; ++ii) {
		var p = parts[ii];
		if(typeof o[p] == "undefined") o[p] = {};
		o = o[p];
	}
	o[parts[parts.length-1]] = src;
}
})();
