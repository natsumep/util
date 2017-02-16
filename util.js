"use strict"
var util = {
	//添加事件兼容
	addEvent: function(dom, type, fn) {
		if (dom.addEventListener) {
			dom.addEventListener(type, fn)
		} else if (dom.attachEvent) {
			dom.attachEvent("on" + type, fn)
		} else {
			dom["on" + type] = fn;
		}
	},
	//自定义事件
	on: function(type, fn) { //添加自定义事件；
		if (typeof this.hands[type] === "undefined") {
			this.hands[type] = [];
		};
		this.hands[type].push(fn);
	},
	//触发自定义事件
	fire: function(type, date) { //触发自定义事件；
		if (this.hands[type] instanceof Array) {
			var Hands = this.hands[type];
			//date=[window.evetn,date]
			for (var i = 0; i < Hands.length; i++) {
				Hands[i](date);
			}
		}
	},
	//移除自定义事件
	remove: function(type, fn) {
		if (this.hands[type] instanceof Array) {
			for (var i = 0; i < this.hands[type].length; i++) {
				this.hands[i] === fn && this.hands[type].splice(i, 1);
			}
		}
	},
	//子类继承
	extend: function(c, s) {
		if (typeof s === "function") {
			var _O = function() {}
			_O.prototype = s.prototype
			c.prototype = new _O()
			c.prototype.constructor = c
		} else if (typeof s === "Object") {
			var F = function() {}
			F.prototype = a
			c.prototype = new F()
		}
		return c;
	},
	//方法复制;A复制到B
	clone: function(a, b) {
		if (!b) {
			return a;
		}
		for (var x in b) {
			a[x] = b[x];
		}
		return a;
	},
	//Ajax;  4个参数(meth, url, callback, poseDate) 
	ajax: (function() {
		function handleReadyState(o, callback) {
			var time = window.setInterval(
				function() {
					if (o && o.readyState === 4) {
						window.clearInterval(time);
						if (callback) {
							callback(o);
						}
					}
				}, 50)
		};
		var getXHR = function() {
			var http = null;
			try {
				http = new XMLHttpRequest();
				getXHR = function() {
					return new XMLHttpRequest();
				}
			} catch (e) {
				var xml = [
					"MSXML2.XMLHTTP.3.0",
					"MSXML2.XMLHTTP",
					"Microsoft.XMLHTTP"
				];
				for (var i = 0; i < xml.length; i++) {
					try {
						http = new activeXObject(xml[i]);
						getXHR = function() {
							return new activeXObject(xml[i]);
						}
						break;
					} catch (e) {};
				}
			}
			return http;
		};
		return function(meth, url, callback, poseDate) {
			var http = getXHR();
			http.open(meth, url, true);
			handleReadyState(http, callback);
			http.send(meth === "get" ? null : poseDate || null);
			return http;
		}
	})(),
	//深拷贝;从P拷贝到C
	deepCopy: function(p, c) {
		c = c || {};
		for (var i in p) {
			if (typeof p[i] === "Object") {
				c[i] = (typeof p[i] === "Array") ? [] : {};
				deepCopy(p(i), c[i])
			} else {
				c[i] = p[i];
			}
		}
		return c;
	},
	//元素缩放方法 传入三个参数
	/**
	 *bod  需要缩放的dom
	 *dom  触感缩放条件的子元素;ps:需要手动在CSS中增加一个鼠标样式;
	 *flag 用于标示拖动的方向 如果不传 表示按鼠标移动的X Y 改变;如果传入"x" / "y"表示按x/y方向移动距离等比例缩放;
	 */
	drag: function(bod, dom, flag) {
		var me = this;
		dom.addEventListener("mousedown", function(e) {
			e.preventDefault();
			e.stopPropagation();
			var x = e.clientX,
				y = e.clientY,
				height = parseInt(me.getStyle(bod, height)),
				width = parseInt(me.getStyle(bod, width)),
				_darg = function(e) {
					e.preventDefault();
					var _x = e.clientX,
						_y = e.clientY,
						X = _x - x,
						Y = _y - y;
					if (flag) {
						if (flag === "x") {
							bod.style.height = height + X + "px";
							Y
							bod.style.width = width + X + "px";
						} else {
							bod.style.height = height + Y + "px";
							bod.style.width = width + Y + "px";
						}

					} else {
						bod.style.height = height + Y + "px";
						bod.style.width = width + X + "px";
					}
				};
			document.addEventListener("mousemove", _darg)
			document.addEventListener("mouseup", function() {
				document.removeEventListener("mousemove", _darg);
			})
		})
	},
	//获取CSS
	getStyle: function(ele, style) {
		return window.getComputedStyle ? window.getComputedStyle(ele, null)[style] : ele.currentStyle[style];
	},
	//元素拖动方法;
	move: function(bod, ele) { //移动 bod 是需要移动的dom ele是可以触发移动的子dom
		ele = ele ? ele : bod; //如果只传一个参数  那就全部可以移动
		var me = this;
		ele.addEventListener("mousedown", function(e) {
			e.stopPropagation();
			e.preventDefault();
			var x = e.clientX,
				y = e.clientY,
				//这里通过加上一个margin来补偿多减去的offsetLeft
				clickX = x - bod.offsetLeft + parseInt(me.getStyle(bod, "marginLeft")),
				clickY = y - bod.offsetTop + parseInt(me.getStyle(bod, "marginTop")),
				_move = function(e) {
					//console.log(clickX)
					bod.style.left = e.clientX - clickX + "px";
					bod.style.top = e.clientY - clickY + "px";
					e.preventDefault()
				};
			document.addEventListener("mousemove", _move);
			document.addEventListener("mouseup", function() {
				document.removeEventListener("mousemove", _move);
			})
		})
	},
	//获取元素到最外层dom的距离;
	findOffset: function(ele, style) {
		var str = ele[style];
		if (ele.offsetParent) {
			return str + findOffset(ele.offsetParent, style);
		} else {
			return str;
		}
	},
	//节流函数 传入3个参数; fn 节流的函数, time节流的间隔时间,默认50 , context :函数作用域,默认window ;
	//间隔时间调用;
	throttlev: function(fn, time, context) {
		var old = new Date().getTime();
		return function() {
			var now = new Date().getTime();
			if (typeof time !== "number") {
				time = 50;
				context = time;
			}
			if (now - old > time) {
				fn.apply(context);
				old = now;
			}
		}
	},
	//节流函数2 
	//停止后多少秒调用
	throttle: function(fn, time, context) {
		clearTimeout(fn.id);
		fn.id = setTimeout(function() {
			fn.call(context)
		}, time)
	},
	//16进制颜色转rgb
	//参数传入"#xxx" || "#xxxxxx"
	getRGB: function(coloa) {
		if (coloa.charAt(0) != "#" || coloa.length != 4 && coloa.length != 7) {
			//alert(coloa.length)
			console.log("请输入正确的颜色")
		}
		if (coloa.length == 4) {
			var a = coloa.slice(1, 2);
			var b = coloa.slice(2, 3)
			var c = coloa.slice(3)
			return "RGB(" + Number("0x" + a + a) + "," + Number("0x" + b + b) + "," + Number("0x" + c + c) + ")"
		} else {
			var a = coloa.slice(1, 3);
			var b = coloa.slice(3, 5)
			var c = coloa.slice(5)
			return "rgb(" + Number("0x" + a) + "," + Number("0x" + b) + "," + Number("0x" + c) + ")"
		}
	},
	//rgb转16进制, 
	//传入(xxx,xxx,xxx);
	getColor: function(rgb1, rgb2, rgb3) {
		console.log(rgb1, rgb2, rgb3)
		if (rgb1 >= 0 && rgb1 <= 255 && rgb2 >= 0 && rgb2 <= 255 && rgb3 >= 0 && rgb3 <= 255) {
			var a = parseInt(rgb1).toString(16),
				b = parseInt(rgb2).toString(16),
				c = parseInt(rgb3).toString(16);
			if (a.length == b.length == b.length == 2) {
				return "#" + a + b + c
			}
			if (a.length == 1) {
				a = a + a;
			}
			if (b.length == 1) {
				b = b + b;
			}
			if (c.length == 1) {
				c = c + c;
			}
			return "#" + a + b + c;
		}
		console.log("请输入正确的颜色");
	},
	//获取键值
	getKeyCode: function(e) {
		var e = e || window.event;
		return me.getKeyCode(e) || e.which;
	},
	/**
	 *键盘上下左右触发dom移动;
	 *可以同时触发两个方向的事件,
	 *传入两个参数:dom 需要移动的dom;
	 *speed 移动速度,不传默认为50像素每秒;ps:为了保持动画连贯,最低每秒移动50像素
	 */
	keyDomMove: (function() {
		var me = this;
		var keyCode = {
			downKeyCode: function(e) {
				var e = e || window.event;
				if (me.getKeyCode(e) === 37 || me.getKeyCode(e) === 38 || me.getKeyCode(e) === 39 || me.getKeyCode(e) === 40) {
					keyCode[me.getKeyCode(e)] = true;
				}
			},
			upKeyCode: function(e) {
				var e = e || window.event;
				if (keyCode[me.getKeyCode(e)]) {
					keyCode[me.getKeyCode(e)] = false;
				}
			},
			time: {}
		};
		return function(dom, speed) {
			if (typeof speed != "number") {
				speed = 1;
			} else {
				speed = (speed / 50) > 1 ? (speed / 50) : 1
			}
			var left = parseInt(window.getComputedStyle(dom).marginLeft),
				top = parseInt(window.getComputedStyle(dom).marginTop);

			document.addEventListener("keydown", function(e) {
				keyCode.downKeyCode();
				if (keyCode[37] && !keyCode.time[37]) {
					keyCode.time[me.getKeyCode(e)] = setInterval(function() {
						dom.style.left = box.offsetLeft - left - speed + "px";
					}, 20)
				};
				if (keyCode[38] && !keyCode.time[38]) {
					keyCode.time[me.getKeyCode(e)] = setInterval(function() {
						dom.style.top = dom.offsetTop - top - speed + "px";
					}, 20)
				};
				if (keyCode[39] && !keyCode.time[39]) {
					keyCode.time[me.getKeyCode(e)] = setInterval(function() {
						dom.style.left = dom.offsetLeft - left + speed + "px";
					}, 20)
				};
				if (keyCode[40] && !keyCode.time[40]) {
					keyCode.time[me.getKeyCode(e)] = setInterval(function() {
						dom.style.top = dom.offsetTop - top + speed + "px";
					}, 20)
				};
				document.addEventListener("keyup", function(e) {
					keyCode.upKeyCode();
					clearInterval(keyCode.time[me.getKeyCode(e)]);
					keyCode.time[me.getKeyCode(e)] = null;
				})
			})

		}
	})(),
	//添加空白;
	//num代表需要添加多少个Br
	//dom表示在上面元素之前添加;不传默认在body后面添加;
	addBr: function(num, dom) {
		for (var i = num; i >= 0; i--) {
			var br = document.createElement("br");
			if (!dom) {
				document.body.appendChild(br);
			} else {
				document.body.insertBefore(br, dom);
			}
		}
	},
	//页面锚链接跳转平缓动画;
	//time 表示移动到锚链接位置所用时间;
	//dom 表示指定dom;不传表示所有锚链接都添加平缓移动动画;
	animetionScroll: function(time, dom) {
		time = time / 1000 || 2;
		var me = this;

		function show(dom, time) {
			var y,
				target = dom.getAttribute("href").slice(1) ? document.getElementById(dom.getAttribute("href").slice(1)) : "body";
			if (target === "body") {
				y = 0;
			} else {
				y = target.offsetTop;
			};
			var _y = (y - me.getScrollTop()) / (time * 60),
				top = me.getScrollTop(),
				time = setInterval(function() {
					top += _y;
					if ((_y > 0 && top >= y) || (_y < 0 && top <= y)) {
						top = y;
						clearInterval(time);
					}
					window.scroll(0, top);
				}, 1000 / 60)
		};
		if (!dom) {
			var $Link = document.querySelectorAll("a[href^='#']"),
				arr = [].slice.call($Link);
			arr.forEach(function(item, index) {
				item.addEventListener("click", function(e) {
					e.preventDefault();
					show(item, time)
				})
			})
		} else {
			dom.addEventListener("click", function(e) {
				e.preventDefault();
				show(dom, time)
			})
		}
	},
	//获取当前页面可视窗口
	getClientHeight: function() {
		if (window.innerHeight) {
			return window.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) {
			return document.documentElement.clientHeight;
		} else {
			return document.body.clientHeight;
		}
	},
	//获取滚动条位置
	getScrollTop: function() {
		if (window.pageYOffset) {
			return window.pageYOffset;
		} else if (document.documentElement && document.documentElement.scrollTop) {
			return document.documentElement.scrollTop;
		} else {
			return document.body.scrollTop;
		}
	}

};



//调用方式util.xx();