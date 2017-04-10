"use strict"
var util = {
	//添加事件兼容
	addEvent: function(dom, type, fn) {
		if (dom.addEventListener) {
			dom.addEventListener(type, fn)
		} else if (dom.attachEvent) {
			dom.attachEvent("on" + type, fn)
		}
	},
	removeEvent: function(dom, type, fn) {
		if (dom.removeEventListener) {
			dom.removeEventListener(type, fn)
		} else if (dom.detachEvent) {
			dom.detachEvent("on" + type, fn)
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
	//设置cookie
	//key:cookie名称；
	//value：cookie值；
	//options：一个对象 包含expires path domain secure 
	setCookie: function(key, value, options) {
		var str = escape(key) + "=" + escape(value);
		if (options.expires) {
			var time = new Date();
			time.setTime(time.getTime() + options.expires * 3600 * 1000)
			options.expires = time.toUTCString();
		}
		for (var x in options) {
			str += ";" + x + "=" + options[x];
		}
		document.cookie = str;
	},
	getCookie: function(key) {
		var _key = " " + escape(key);
		var _cookie = " " + document.cookie + ";";
		var index = _cookie.indexOf(_key);
		if (index === -1) {
			return null
		};
		var endIndex = _cookie.indexOf(";", index);
		var value = _cookie.slice(index + _key.length + 1, endIndex);
		value = unescape(value);
		return value;
	},
	deleteCookie: function(key) {
		var value = this.getCookie(key);
		if (valie === null) {
			return false;
		}
		this.setCookie(key, null, {
			expires: 0
		})
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
	stopPropagation: function(e) {
		var e = e || window.event;
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	},
	preventDefault: function(e) {
		var e = e || window.event;
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
	},
	//元素缩放方法 传入三个参数
	/**
	 *bod  需要缩放的dom
	 *dom  触感缩放条件的子元素;ps:需要手动在CSS中增加一个鼠标样式;
	 *flag 用于标示拖动的方向 如果不传 表示按鼠标移动的X Y 改变;如果传入"x" / "y"表示按x/y方向移动距离等比例缩放;
	 */
	drag: function(bod, dom, flag) {
		var me = this;
		this.addEvent(dom, "mousedown", function(e) {
			me.preventDefault();
			me.stopPropagation();
			var x = e.clientX,
				y = e.clientY,
				height = parseInt(me.getStyle(bod, "height")),
				width = parseInt(me.getStyle(bod, "width")),
				_darg = function(e) {
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
			me.addEvent(document, "mousemove", _darg)
			me.addEvent(document, "mouseup", function() {
				me.removeEvent(document, "mousemove", _darg);
			})
		})
	},
	//获取CSS
	getStyle: function(ele, style) {
		return window.getComputedStyle ? window.getComputedStyle(ele, null)[style] : ele.currentStyle[style];
	},
	//元素拖动方法;
	DOMMove: function(bod, ele) { //移动 bod 是需要移动的dom ele是可以触发移动的子dom
		ele = ele ? ele : bod; //如果只传一个参数  那就全部可以移动
		var me = this;
		this.addEvent(ele, "mousedown", function(e) {
			me.stopPropagation();
			me.preventDefault();
			var x = e.clientX,
				y = e.clientY,
				//这里通过加上一个margin来补偿多减去的offsetLeft
				clickX = x - bod.offsetLeft + parseInt(me.getStyle(bod, "marginLeft")),
				clickY = y - bod.offsetTop + parseInt(me.getStyle(bod, "marginTop")),
				_move = function(e) {
					bod.style.left = e.clientX - clickX + "px";
					bod.style.top = e.clientY - clickY + "px";
					me.preventDefault()
				};
			me.addEvent(document, "mousemove", _move);
			me.addEvent(document, "mouseup", function() {
				me.removeEvent(document, "mousemove", _move);
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
		if (typeof time !== "number") {
			time = 50;
			context = time;
		}
		var old = new Date().getTime(),
			now, arg;
		return function() {
			now = new Date().getTime();
			arg = arguments;
			if (now - old > time) {
				fn.apply(context);
				old = now;
			}
		}
	},
	//节流函数2 
	//停止后多少秒调用
	throttle: function(fn, time, context) {
		var times = null,
			arg;
		return function() {
			arg = arguments;
			clearTimeout(times);
			times = setTimeout(function() {
				fn.apply(context, arg)
			}, time)
		}
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
		return e.KeyCode || e.which;
	},
	/**
	 *键盘上下左右触发dom移动;
	 *可以同时触发两个方向的事件;
	 *传入四个参数:dom 需要移动的dom;
	 *main 移动的范围容器
	 *speed 每秒移动速度;
	 *callback 每次执行触发的函数;
	 */
	keyDomMove: (function() {
		//通过闭包保存变量
		var keyCode = {
			keyDownArr: [],
			//每次按下上下左右的将当前按下的方向保存 为ture;
			downKeyCode: function(e) {
				var e = e || window.event;
				//只需要用到上下左右 只保存4个键值;
				if (util.getKeyCode() === 37 || util.getKeyCode() === 38 || util.getKeyCode() === 39 || util.getKeyCode() === 40) {
					e.preventDefault ? e.preventDefault() : e.cancelBubble = true;
					if (keyCode.keyDownArr.indexOf(e.keyCode) === -1) {
						keyCode.keyDownArr.push(e.keyCode)
					}
				}
			},
			//每次弹起上下左右的将当前弹起的方向修改为flase;
			upKeyCode: function(e) {
				var e = e || window.event;
				var _index = keyCode.keyDownArr.indexOf(util.getKeyCode());
				if (_index >= 0) {
					keyCode.keyDownArr.splice(_index, 1);
				}
			}
		};
		return function(dom, main, speed, callback) {
			if (typeof speed != "number") {
				speed = 1;
			} else {
				//速度必须大于60px每秒;每次移动的像素小于1px 浏览器会修正为0px;这也是因为运用了定时器的缺点;
				//除以60是因为浏览器播放动画每秒60帧可以保持动画的流畅性;
				speed = (speed / 60) > 1 ? (speed / 60) : 1
			}
			//用于左右 和上下穿透;
			function changeXY(xy, min, max) {
				if (xy < min) {
					xy = max;
				} else if (xy >= max) {
					xy = min;
				}
				return xy;
			};
			var me = this;
			this.addEvent(document, "keydown", function(e) {
				var e = e || window.event;
				keyCode.downKeyCode();
				me.addEvent(document, "keyup", function(e) {
					var e = e || window.event;
					keyCode.upKeyCode();
				})
			})
			setInterval(function() {
				keyCode.keyDownArr.forEach(function(item) {
					var mainHeight = parseFloat(me.getStyle(main, "height")) - 20,
						mainWidth = parseFloat(me.getStyle(main, "width")) - 20;
					if (item === 37) {
						var x = dom.offsetLeft - speed;
						x = changeXY(x, 0, mainWidth);
						dom.style.left = x + "px";
					} else if (item === 38) {
						var y = dom.offsetTop - speed
						y = changeXY(y, 0, mainHeight);
						dom.style.top = y + "px";
					} else if (item === 39) {
						var x = dom.offsetLeft + speed;
						x = changeXY(x, 0, mainWidth);
						dom.style.left = x + "px";
					} else if (item === 40) {
						var y = dom.offsetTop + speed;
						y = changeXY(y, 0, mainHeight);
						dom.style.top = y + "px";
					}
					callback && callback();
				})
			}, 1000 / 60)
		};
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