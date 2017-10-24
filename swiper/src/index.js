


/**
 * 
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {// AMD
        define(factory);
    } else if (typeof exports === 'object') {// Node, CommonJS之类的
        module.exports = factory();
    } else {// 浏览器全局变量(root 即 window)
        root.SwiperSlider = factory();
    }
}(this, function () {
    var _doc = document,
        defaults = {
            selector: "",
            imgs: [],
            autoplay: false,
            interval: 3000,
            touch: true,
            scale: 0.13,
            button: true,
            clickCb: function () { }
        };

    function SwiperSlider(options) {
        this.$opts = Object.assign({}, defaults, options);
        if (!this.$opts.selector) throw new Error("the options require a setting 'selector'");
        if (!this.$opts.imgs.length) throw new Error("the length of imgs must be >= 1");
        this._ctx = _doc.querySelector(this.$opts.selector);
        if (!this._ctx) throw new Error("not found element with seletor '" + selector + "'");

        var slider = new Slider(this);

        this.getIndex = function () {
            return slider.index;
        }

        this.play = function () {
            slider.autoplay();
        }

        this.pause = function () {
            slider.pause();
        }

        this.autoplay = function () {
            this.$opts.autoplay = true;
            slider.autoplay();
        }
    }

    SwiperSlider.prototype = {
        constrructor: SwiperSlider,
    };

    function Slider(other) {
        Object.assign(this, other)
        this.init();
    }

    Slider.prototype = {
        constructor: Slider,
        even: false,
        css: [],
        items: [],
        timer: null,
        animating: false,
        init: function () {
            this.render();
            if (this.$opts.autoplay) this.autoplay();
            this.initEvents();
        },

        render: function () {
            var opts = this.$opts;
            var imgs = opts.imgs;
            var length = opts.imgs.length;
            var html = "<div class='swiper-slider'><ul class='swiper-slider-list'>";
            for (var i = 0; i < length; i++) {
                html += "<li class='swiper-slider-item'>";
                html += "<img class='swiper-slider-img' src='" + imgs[i] + "'></li>";
            }
            html += "</ul>";
            if (opts.button) {
                html += "<a class='swiper-slider-btn swiper-slider-btn-prev J-SwiperSliderBtn' data-btn='prev'>&lt;</a>";
                html += "<a class='swiper-slider-btn swiper-slider-btn-next J-SwiperSliderBtn' data-btn='next'>&gt;</a>";
            }
            html += "</div>";
            this._ctx.innerHTML = html;
            this.getCssText();
            this.setCssText();
        },
        getCssText: function () {
            var _ctx = this._ctx;
            var opts = this.$opts;
            var length = opts.imgs.length;
            var middle = this.middle = ~~(length / 2);
            this.items = [].slice.call(_ctx.querySelectorAll("li"));
            if (length % 2 == 0) {
                this.even = true;
                this.items.splice(middle + 1, 0, null);
                length = this.items.length;
            }
            var zIndex = middle + 1;
            var translateZ = 2 + middle * 4;
            var scaleWidth = this.items[0].clientWidth * opts.scale * middle / 2;
            var translateX = (_ctx.clientWidth / 2 - this.items[0].clientWidth / 2 + scaleWidth) / middle;
            var cssArr = [], offset, css, scale;
            for (var i = 0; i < length; i++) {
                offset = i - middle;
                scale = 1 - opts.scale * (offset > 0 ? length - i : i);
                css = "";
                // css += "z-index:" + (zIndex - (offset > 0 ? length - i : i)) + ";";
                css += "-webkit-transition: all .5s ease-in-out;";
                css += "-webkit-transform: translate3d(" + (offset > 0 ? -(length - i) : i) * translateX + "px, 0, " + (translateZ - (offset > 0 ? length - i : i) * 4) + "px) ";
                css += "scale3d(" + scale + ", " + scale + ", 1);";
                css += "visibility: visible;";
                cssArr.push(css);
            }
            this.css = cssArr;
        },
        setCssText: function (css) {
            var css = css || this.css;
            var length = this.items.length;
            for (var i = 0; i < length; i++) {
                if (this.items[i]) this.items[i].style.cssText = css[i];
            }
        },
        autoplay: function () {
            var self = this;
            function loop() {
                self.timer = setTimeout(function () {
                    self.sliderNext();
                    loop();
                }, self.$opts.interval)
            }
            loop();
        },
        sliderNext: function () {
            var self = this;
            if (self.animating) return;
            self.animating = true;
            self.items.push(self.items.shift());
            if (self.even) {//偶数
                var index = self.items.findIndex(function (t) { return t === null });
                if (index != self.middle) {
                    self.items.splice(index, 1);
                    self.items.splice(self.middle, 0, null);
                }
            }
            self.setCssText();
        },
        sliderPrev: function () {
            var self = this;
            if (self.animating) return;
            self.animating = true;
            self.items.unshift(self.items.pop());
            if (self.even) {//偶数
                var index = self.items.findIndex(function(t){ return t === null});
                if (index != self.middle + 1) {
                    self.items.splice(index, 1);
                    self.items.splice(self.middle + 1, 0 , null);
                }
            }
            self.setCssText();
        },
        pause: function () {
            clearTimeout(this.timer);
        },
        initEvents: function () {
            var self = this;
            var ctx = self._ctx;
            self.touchEvents();
            ctx.addEventListener("mouseenter", function (e) {
                self.pause();
            });

            ctx.addEventListener("mouseleave", function (e) {
                if (self.$opts.autoplay) self.autoplay();
            });

            ctx.addEventListener("click", Util.debounce(function (e) {
                if (e.target.dataset.btn === "prev") {
                    self.sliderNext();
                } else if (e.target.dataset.btn === "next") {
                    self.sliderPrev();
                }
            }, 200));

            self.items[0].addEventListener("webkitTransitionEnd", function () {
                self.animating = false;
            })

        },
        touchEvents: function(){
            var self = this;
            var x, offset;

            if (!self.$opts.touch) return;
            self._ctx.addEventListener("touchstart", function(e){
                x = e.changedTouches[0].pageX;
                self.pause();
            });

            self._ctx.addEventListener("touchend", function(e){
                offset = e.changedTouches[0].pageX - x;
                if (Math.abs(offset) < 50) return;
                offset < 0 ? self.sliderNext() : self.sliderPrev();
                if (self.$opts.autoplay) self.autoplay();
            });
        }
    };







    var Util = {
        init: function () {
            this.assignPolyfill();
            this.findIndexPolyfill();
        },
        assignPolyfill: function () {
            if (typeof Object.assign != 'function') {
                // Must be writable: true, enumerable: false, configurable: true
                Object.defineProperty(Object, "assign", {
                    value: function assign(target, varArgs) { // .length of function is 2
                        'use strict';
                        if (target == null) { // TypeError if undefined or null
                            throw new TypeError('Cannot convert undefined or null to object');
                        }

                        var to = Object(target);

                        for (var index = 1; index < arguments.length; index++) {
                            var nextSource = arguments[index];

                            if (nextSource != null) { // Skip over if undefined or null
                                for (var nextKey in nextSource) {
                                    // Avoid bugs when hasOwnProperty is shadowed
                                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                        to[nextKey] = nextSource[nextKey];
                                    }
                                }
                            }
                        }
                        return to;
                    },
                    writable: true,
                    configurable: true
                });
            }
        },
        findIndexPolyfill: function () {
            if (!Array.prototype.findIndex) {
                Object.defineProperty(Array.prototype, 'findIndex', {
                    value: function (predicate) {
                        if (this == null) {
                            throw new TypeError('"this" is null or not defined');
                        }
                        var o = Object(this);
                        var len = o.length >>> 0;
                        if (typeof predicate !== 'function') {
                            throw new TypeError('predicate must be a function');
                        }
                        var thisArg = arguments[1];
                        var k = 0;
                        while (k < len) {
                            var kValue = o[k];
                            if (predicate.call(thisArg, kValue, k, o)) {
                                return k;
                            }
                            k++;
                        }
                        return -1;
                    }
                });
            }
        },
        debounce: function (fn, time) {
            var timer;
            return function (e) {
                clearTimeout(timer)
                timer = setTimeout(fn.bind(this, e), time);
            }
        }
    };

    Util.init();










    return SwiperSlider;
}));


