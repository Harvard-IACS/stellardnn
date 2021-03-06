(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else if (typeof exports === 'object')
        exports["HSScrollNav"] = factory();
    else
        root["HSScrollNav"] = factory();
})(window, function () {
    return /******/ (function (modules) { // webpackBootstrap
        /******/ 	// The module cache
        /******/
        var installedModules = {};
        /******/
        /******/ 	// The require function
        /******/
        function __webpack_require__(moduleId) {
            /******/
            /******/ 		// Check if module is in cache
            /******/
            if (installedModules[moduleId]) {
                /******/
                return installedModules[moduleId].exports;
                /******/
            }
            /******/ 		// Create a new module (and put it into the cache)
            /******/
            var module = installedModules[moduleId] = {
                /******/            i: moduleId,
                /******/            l: false,
                /******/            exports: {}
                /******/
            };
            /******/
            /******/ 		// Execute the module function
            /******/
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/
            /******/ 		// Flag the module as loaded
            /******/
            module.l = true;
            /******/
            /******/ 		// Return the exports of the module
            /******/
            return module.exports;
            /******/
        }

        /******/
        /******/
        /******/ 	// expose the modules object (__webpack_modules__)
        /******/
        __webpack_require__.m = modules;
        /******/
        /******/ 	// expose the module cache
        /******/
        __webpack_require__.c = installedModules;
        /******/
        /******/ 	// define getter function for harmony exports
        /******/
        __webpack_require__.d = function (exports, name, getter) {
            /******/
            if (!__webpack_require__.o(exports, name)) {
                /******/
                Object.defineProperty(exports, name, {enumerable: true, get: getter});
                /******/
            }
            /******/
        };
        /******/
        /******/ 	// define __esModule on exports
        /******/
        __webpack_require__.r = function (exports) {
            /******/
            if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                /******/
                Object.defineProperty(exports, Symbol.toStringTag, {value: 'Module'});
                /******/
            }
            /******/
            Object.defineProperty(exports, '__esModule', {value: true});
            /******/
        };
        /******/
        /******/ 	// create a fake namespace object
        /******/ 	// mode & 1: value is a module id, require it
        /******/ 	// mode & 2: merge all properties of value into the ns
        /******/ 	// mode & 4: return value when already ns object
        /******/ 	// mode & 8|1: behave like require
        /******/
        __webpack_require__.t = function (value, mode) {
            /******/
            if (mode & 1) value = __webpack_require__(value);
            /******/
            if (mode & 8) return value;
            /******/
            if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
            /******/
            var ns = Object.create(null);
            /******/
            __webpack_require__.r(ns);
            /******/
            Object.defineProperty(ns, 'default', {enumerable: true, value: value});
            /******/
            if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) {
                return value[key];
            }.bind(null, key));
            /******/
            return ns;
            /******/
        };
        /******/
        /******/ 	// getDefaultExport function for compatibility with non-harmony modules
        /******/
        __webpack_require__.n = function (module) {
            /******/
            var getter = module && module.__esModule ?
                /******/            function getDefault() {
                    return module['default'];
                } :
                /******/            function getModuleExports() {
                    return module;
                };
            /******/
            __webpack_require__.d(getter, 'a', getter);
            /******/
            return getter;
            /******/
        };
        /******/
        /******/ 	// Object.prototype.hasOwnProperty.call
        /******/
        __webpack_require__.o = function (object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        /******/
        /******/ 	// __webpack_public_path__
        /******/
        __webpack_require__.p = "";
        /******/
        /******/
        /******/ 	// Load entry module and return exports
        /******/
        return __webpack_require__(__webpack_require__.s = "./src/js/hs-scroll-nav.js");
        /******/
    })
        /************************************************************************/
        /******/ ({

            /***/ "./src/classes/scroll-nav-section.js":
            /*!*******************************************!*\
              !*** ./src/classes/scroll-nav-section.js ***!
              \*******************************************/
            /*! exports provided: default */
            /***/ (function (module, __webpack_exports__, __webpack_require__) {

                "use strict";
                eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return HSScrollNavSection; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar HSScrollNavSection = /*#__PURE__*/function () {\n  function HSScrollNavSection(element, config) {\n    _classCallCheck(this, HSScrollNavSection);\n\n    this.element = element;\n    this.config = config;\n    this.section = $(this.element.attr('href'));\n  }\n\n  _createClass(HSScrollNavSection, [{\n    key: \"show\",\n    value: function show(callback) {\n      var _this = this;\n\n      var self = this,\n          isCollbackFinished = false;\n\n      if (!this.section.length) {\n        return;\n      }\n\n      var timerId = setInterval(function () {\n        isCollbackFinished = self.config.beforeShow.call(self.section);\n\n        if (isCollbackFinished) {\n          clearInterval(timerId);\n\n          _this.changeHash();\n\n          $('html, body').stop().animate({\n            scrollTop: self.offset + self.config.customOffsetTop\n          }, {\n            duration: self.config.duration,\n            easing: self.config.easing,\n            complete: function complete() {\n              $('html, body').stop().animate({\n                scrollTop: self.offset + self.config.customOffsetTop\n              }, {\n                duration: self.config.duration,\n                easing: self.config.easing,\n                complete: function complete() {\n                  self.config.afterShow.call(self.section);\n\n                  if ($.isFunction(callback)) {\n                    callback();\n                  }\n                }\n              });\n            }\n          });\n        }\n      }, 100);\n    }\n  }, {\n    key: \"changeHash\",\n    value: function changeHash() {\n      this.section.attr('id', '');\n      $(this.config.sectionClass).removeClass(this.config.activeSectionClass);\n      this.section.addClass(this.config.activeSectionClass);\n      window.location.hash = this.element.attr('href');\n      this.section.attr('id', this.element.attr('href').slice(1));\n    }\n  }, {\n    key: \"highlight\",\n    value: function highlight() {\n      var parent = this.element.parent('li');\n\n      if (parent.length) {\n        parent.addClass(this.config.activeItemClass);\n      }\n    }\n  }, {\n    key: \"unhighlight\",\n    value: function unhighlight() {\n      var parent = this.element.parent('li');\n\n      if (parent.length) {\n        parent.removeClass(this.config.activeItemClass);\n      }\n    }\n  }, {\n    key: \"offset\",\n    get: function get() {\n      var header = this.config.header,\n          headerStyles = header.length ? getComputedStyle(header.get(0)) : false,\n          headerPosition = header.length ? headerStyles.position : false,\n          offset = this.section.offset().top;\n\n      if (header.length && (headerPosition === 'fixed' || headerPosition === 'absolute') && parseInt(headerStyles.top) === 0) {\n        offset = offset - header.outerHeight() - parseInt(headerStyles.marginTop);\n      }\n\n      if (this.config.over.length) {\n        offset = offset - this.config.over.outerHeight();\n      }\n\n      return offset;\n    }\n  }]);\n\n  return HSScrollNavSection;\n}();\n\n\n\n//# sourceURL=webpack://HSScrollNav/./src/classes/scroll-nav-section.js?");

                /***/
            }),

            /***/ "./src/js/hs-scroll-nav.js":
            /*!*********************************!*\
              !*** ./src/js/hs-scroll-nav.js ***!
              \*********************************/
            /*! exports provided: default */
            /***/ (function (module, __webpack_exports__, __webpack_require__) {

                "use strict";
                eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return HSScrollNav; });\n/* harmony import */ var _classes_scroll_nav_section__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../classes/scroll-nav-section */ \"./src/classes/scroll-nav-section.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/*\n* HSScrollNav Plugin\n* @version: 2.0.0 (Mon, 25 Nov 2019)\n* @requires: jQuery v3.0 or later\n* @author: HtmlStream\n* @event-namespace: .HSScrollNav\n* @license: Htmlstream Libraries (https://htmlstream.com/)\n* Copyright 2019 Htmlstream\n*/\n\n\nvar HSScrollNav = /*#__PURE__*/function () {\n  function HSScrollNav(element, config) {\n    _classCallCheck(this, HSScrollNav);\n\n    this.element = element;\n    this.defaults = {\n      duration: 400,\n      easing: 'linear',\n      over: $(),\n      sectionClass: '.scroll-nav-section',\n      customOffsetTop: 0,\n      activeItemClass: 'active',\n      activeSectionClass: 'active',\n      afterShow: function afterShow() {},\n      beforeShow: function beforeShow() {\n        return true;\n      },\n      header: $('.header')\n    };\n    this.config = config;\n  }\n\n  _createClass(HSScrollNav, [{\n    key: \"init\",\n    value: function init() {\n      var self = this,\n          element = this.element,\n          dataSettings = $(element).attr('data-hs-scroll-nav-options') ? JSON.parse($(element).attr('data-hs-scroll-nav-options')) : {};\n      this._items = $();\n      this.config = Object.assign({}, this.defaults, this.config, dataSettings);\n\n      this._makeItems();\n\n      this._bindEvents();\n\n      $(window).on('scroll.HSScrollNav', function () {\n        self.highlight();\n      }).trigger('scroll.HSScrollNav');\n    }\n  }, {\n    key: \"_makeItems\",\n    value: function _makeItems() {\n      var self = this;\n      this.element.find('a[href^=\"#\"]').each(function (i, el) {\n        var $this = $(el);\n\n        if (!$this.data('HSScrollNavSection')) {\n          $this.data('HSScrollNavSection', new _classes_scroll_nav_section__WEBPACK_IMPORTED_MODULE_0__[\"default\"]($this, self.config));\n          self._items = self._items.add($this);\n        }\n      });\n    }\n  }, {\n    key: \"_bindEvents\",\n    value: function _bindEvents() {\n      var self = this;\n      this.element.on('click.HSScrollNav', 'a[href^=\"#\"]', function (e) {\n        var link = this,\n            target = $(this).data('HSScrollNavSection'),\n            $parent = $(self.element).parent(),\n            parentID = $parent.attr('id'),\n            windW = window.innerWidth,\n            mobileDestroy = Boolean(self.element[0].dataset.mobileDestroy);\n\n        if (windW <= 769 && mobileDestroy === true) {\n          $('[data-target=\"#' + parentID + '\"]').trigger('click');\n          $('[data-target=\"#' + parentID + '\"] > .hamburger__box').removeClass('is-active');\n          $parent.on('hidden.bs.collapse', function () {\n            self._lockHightlight = true;\n            if (self.current) self.current.unhighlight();\n            link.blur();\n            self.current = $(link).data('HSScrollNavSection');\n            self.current.highlight();\n            target.show(function () {\n              self._lockHightlight = false;\n            });\n          });\n        } else {\n          self._lockHightlight = true;\n          if (self.current) self.current.unhighlight();\n          link.blur();\n          self.current = $(link).data('HSScrollNavSection');\n          self.current.highlight();\n          target.show(function () {\n            self._lockHightlight = false;\n          });\n        }\n\n        e.preventDefault();\n      });\n    }\n  }, {\n    key: \"highlight\",\n    value: function highlight() {\n      var self = this,\n          items,\n          currentItem,\n          current,\n          scrollTop;\n\n      if (!this._items.length || this._lockHightlight) {\n        return;\n      }\n\n      scrollTop = $(window).scrollTop();\n\n      this._items.each(function (i, el) {\n        var Section = $(el).data('HSScrollNavSection'),\n            $section = Section.section;\n\n        if (scrollTop > Section.offset) {\n          current = Section;\n        }\n      });\n\n      if (current && this.current !== current) {\n        this.unhighlight();\n        current.highlight();\n\n        if (this.current) {\n          current.changeHash();\n        }\n\n        this.current = current;\n      }\n    }\n  }, {\n    key: \"unhighlight\",\n    value: function unhighlight() {\n      this._items.each(function (i, el) {\n        $(el).data('HSScrollNavSection').unhighlight();\n      });\n    }\n  }]);\n\n  return HSScrollNav;\n}();\n\n\n\n//# sourceURL=webpack://HSScrollNav/./src/js/hs-scroll-nav.js?");

                /***/
            })

            /******/
        })["default"];
});