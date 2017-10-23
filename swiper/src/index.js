


/**
 * 
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {// AMD
        define(factory);
    } else if (typeof exports === 'object') {// Node, CommonJS之类的
        module.exports = factory();
    } else {// 浏览器全局变量(root 即 window)
        root.CarouselSlider = factory();
    }
}(this, function () {
    var _doc = document,
        defaults = {
            selector: "",
            imgs: [],
            content: [60, 80],
            autoplay: false,
            interval: 3000,
            touch: true,
            scale: 0.13,
            clickCb: function () { }
        };

    function CarouselSlider(options) {
        this.$opts = Object.assign({}, defaults, options);
        if (!this.$opts.selector) throw new Error("the options require a setting 'selector'");
        if (!this.$opts.imgs.length) throw new Error("the length of imgs must be >= 1");
        this._ctx = _doc.querySelector(this.$opts.selector);
        if (!this._ctx) throw new Error("not found element with seletor '" + selector + "'");

        var slider = new Slider(this);

        this.getIndex = function(){
            return slider.index;
        }

        this.play = function(){
            slider.autoplay();
        }

        this.autoplay = function(){
            this.$opts.autoplay = true;
            slider.autoplay();
        }
    }

    function Slider(other) {
        Object.assign(this, other)
        this.init();
    }

    Slider.prototype = {
        constructor: Slider,
        css: [],
        items: [],
        timer: null,
        init: function () {
            this.render();
            if (this.$opts.autoplay) this.autoplay();
            this.initEvent();
        },

        render: function () {
            var opts = this.$opts;
            var imgs = opts.imgs;
            var length = opts.imgs.length;
            var ulStyle = "width: 100%;height: 100%;transform-style: preserve-3d;";
            var html = "<ul style='" + ulStyle + "'>";
            for (var i = 0; i < length; i++) {
                html += "<li><img src='" + imgs[i] + "'/></li>";
            }
            html += "</ul>";
            this._ctx.innerHTML = html;
            this.getCssText();
            this.setCssText();
        },
        getCssText: function () {
            var _ctx = this._ctx;
            var opts = this.$opts;
            var length = opts.imgs.length;
            var middle = ~~(length / 2);
            var zIndex = middle + 1;
            var translateZ = 2 + middle * 4;
            this.items = [].slice.call(_ctx.querySelectorAll("li"));
            var scaleWidth = this.items[0].clientWidth*opts.scale*middle/2;
            var translateX = (_ctx.clientWidth / 2 - this.items[0].clientWidth / 2 + scaleWidth) / middle;
            console.log(translateX)
            var cssArr = [], offset, css, scale;
            for (var i = 0; i < length; i++) {
                offset = i - middle;
                scale = 1 - opts.scale * (offset > 0 ? length - i : i);
                css = "";
                // css += "z-index:" + (zIndex - (offset > 0 ? length - i : i)) + ";";
                css += "-webkit-transition: all .5s ease-in-out;";
                css += "-webkit-transform: translate3d(" + (offset > 0 ? -(length - i) : i) * translateX + "px, 0, " + (translateZ - (offset > 0 ? length - i : i)*4) + "px) ";
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
                this.items[i].style.cssText = css[i];
            }
        },
        autoplay: function(){
            var self = this;
            function loop(){
                self.timer = setTimeout(function(){
                    self.items.push(self.items.shift());
                    self.setCssText();
                    loop();
                }, self.$opts.interval)
            }
            loop();
        },
        initEvent: function(){
            var self = this;
            this._ctx.addEventListener("mouseenter", function(e){
                clearTimeout(self.timer);
            });

            this._ctx.addEventListener("mouseleave", function(e){
                if(self.$opts.autoplay) self.autoplay();
            });
        }
    }




    CarouselSlider.prototype = {
        constrructor: CarouselSlider,






    };








    var Util = {
        init: function () {
            this.assignPolyfill();
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
        }
    };

    Util.init();














    return CarouselSlider;
}));


