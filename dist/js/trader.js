console.log("hello");

(function ($) {
    if (typeof $ === 'undefined') {
      throw new Error('TraderUI\'s JavaScript requires jQuery. jQuery must be included before TraderUI\'s JavaScript.');
    }
  
    var version = $.fn.jquery.split(' ')[0].split('.');
    var minMajor = 1;
    var ltMajor = 2;
    var minMinor = 9;
    var minPatch = 1;
    var maxMajor = 4;
  
    if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
      throw new Error('TraderUI\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
    }
  })($);
function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}


var Table = function ($) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'table';
    var DATA_KEY = 'tu.table';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_COLUMNS_KEY = 'fixColumn';
    var JQUERY_NO_CONFLICT = $.fn[NAME];

    var Default = {
        scroll: true,
        ellipsis: false,
        average: false
    };
    var DefaultType = {
        scroll: 'boolean',
        ellipsis: 'boolean',
        average: 'boolean'
    };
    var Event = {
        FIXED: "fixed" + EVENT_KEY,
        STATIC: "static" + EVENT_KEY,
        LOAD_DATA_API: "load" + EVENT_KEY,
        CLICK_DATA_API: "click" + EVENT_KEY
    };
    var ClassName = {
        SCROLL: 'o-scroll',
        FIXED: 'position-absolute',
        FADE: 'fade',
        SHOW: 'show'
    };
    var Selector = {
        DATA_FIX_COLUMN: '[data-fix-column]',
        FIXED_CONTENT: '.position-absolute'
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    var Table =
        /*#__PURE__*/
        function () {
            function Table(element, config) {
                this._config = this._getConfig(config);
                this._element = element;
                this._parentBox = $(element).parent();
                this._columns = $(element).data(DATA_COLUMNS_KEY);
                this._isFixed = false;
                this._originalMargin = 0;
            } // getters

            var _proto = Table.prototype;

            _proto.fixToggle = function fixToggle(relatedTarget) {
                return this._isFixed ? this.static() : this.fixed(relatedTarget);
            };

            _proto.fixed = function fixed(relatedTarget) {

                if (this._isTransitioning || this._isFixed) {
                    return;
                }

                if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE)) {
                    this._isTransitioning = true;
                }

                var fixedEvent = $.Event(Event.FIXED, {
                    relatedTarget: relatedTarget
                });
                $(this._element).trigger(fixedEvent);

                if (this._isFixed || fixedEvent.isDefaultPrevented()) {
                    return;
                }

                this._isFixed = true;

                this._onScroll();

                this._fixColumn();

            };

            _proto.static = function static() {

                if (this._isTransitioning || !this._isFixed) {
                    return;
                }

                if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE)) {
                    this._isTransitioning = true;
                }

                var staticEvent = $.Event(Event.STATIC);
                $(this._element).trigger(staticEvent);

                if (!this._isFixed || staticEvent.isDefaultPrevented()) {
                    return;
                }

                this._isFixed = false;

                this._onScroll();

                this._staticColumn();


            }

            _proto.dispose = function dispose() {
                $.removeData(this._element, DATA_KEY);
                $(window, document, this._element).off(EVENT_KEY);
                this._config = null;
                this._element = null;
                this._parentBox = null;
                this._columns = null;
                this._isFixed = null;
                this._originalMargin = null;
            };

            _proto._getConfig = function _getConfig(config) {
                config = $.extend({}, Default, config);
                Util.typeCheckConfig(NAME, config, DefaultType);
                return config;
            };

            _proto._onScroll = function _onScroll() {
                this._isFixed ? this._parentBox.addClass(ClassName.SCROLL) : this._parentBox.removeClass(ClassName.SCROLL)
            };

            _proto._staticColumn = function _staticColumn() {
                var _this = this;
                $(_this._element).find("tr").each(function (i, ele) {
                    var isFirst = 0 == i;
                    var itemName = isFirst ? "th" : "td";
                    for (var j = 0; j <= _this._columns; j++) {
                        var isPadding = _this._columns == j;
                        var item = $(ele).find(itemName + ":eq(" + j + ")");
                        item.removeAttr("style");
                        !isPadding?item.removeClass(ClassName.FIXED):null;
                    }
                });
            };

            _proto._fixColumn = function _fixColumn() {
                var _this = this;
                var itemLeft = [],
                    itemWidth = [],
                    itemHeight = [],
                    itemLineHeight = [],
                    itemPadding = [];

                $(_this._element).find("tr").each(function (i, ele) {
                    var isFirst = 0 == i;
                    var itemName = isFirst ? "th" : "td";
                    itemHeight[i] = $(ele).innerHeight();
                    itemLineHeight[i] = itemHeight[i] - parseInt($(ele).find(itemName).css('padding-top')) * 2;


                    if (isFirst) {
                        for (var j = 0; j <= _this._columns; j++) {
                            var item = $(ele).find(itemName + ":eq(" + j + ")");
                            itemLeft[j] = item.position().left;
                            itemWidth[j] = item.innerWidth();
                            itemPadding[j] = $(ele).find(itemName + ":eq(" + _this._columns + ")").position().left;
                        }
                    }

                    for (var j = 0; j <= _this._columns; j++) {
                        var isPadding = _this._columns == j;
                        var item = $(ele).find(itemName + ":eq(" + j + ")");
                        if (isPadding) {
                            item.css("padding-left", itemPadding[0] + "px");
                        } else {
                            item.addClass(ClassName.FIXED).css("left", itemLeft[j] + "px").css("width", itemWidth[j] + "px").css("height", itemHeight[i] + "px").css("line-height", itemLineHeight[i] + "px");
                        }
                    }
                });
            };

            Table._jQueryInterface = function _jQueryInterface(config, relatedTarget) {
                return this.each(function () {
                    var data = $(this).data(DATA_KEY);

                    if (!data) {
                        data = new Table(this, _config);
                        $(this).data(DATA_KEY, data);
                    }

                    var _config = $.extend({}, Table.Default, $(this).data(), typeof config === 'object' && config);



                    if (typeof config === 'string') {
                        if (typeof data[config] === 'undefined') {
                            throw new Error("No method named \"" + config + "\"");
                        }

                        data[config](relatedTarget);
                    } else if (_config.fixColumn) {
                        data.fixed(relatedTarget);
                    }
                });
            };

            _createClass(Table, null, [{
                key: "Default",
                get: function get() {
                    return Default;
                }
            }]);

            return Table;
        }();

    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */

    $(document).on(Event.CLICK_DATA_API, Selector.DATA_FIX_COLUMN, function (event) {
        var target;
        var selector = Util.getSelectorFromElement(this);

        if (selector) {
            target = $(selector)[0];
        }

        var config = $.extend({}, $(target).data(), $(this).data());

        Table._jQueryInterface.call($(target), config, this);
    });

    $(window).on(Event.LOAD_DATA_API, function () {
        $(Selector.DATA_FIX_COLUMN).each(function () {
            var $table = $(this);
            Table._jQueryInterface.call($table, $table.data(), this);
        });
    });

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn[NAME] = Table._jQueryInterface;
    $.fn[NAME].Constructor = Table;

    $.fn[NAME].noConflict = function () {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return Table._jQueryInterface;
    };

    return Table;
}($);

var Util = function ($) {
  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */
  var transition = false;
  var MAX_UID = 1000000;
  var TransitionEndEvent = {
    WebkitTransition: 'webkitTransitionEnd',
    transition: 'transitionend' // shoutout AngusCroll (https://goo.gl/pxwQGp)

  };

  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: transition.end,
      delegateType: transition.end,
      handle: function handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined; // eslint-disable-line no-undefined
      }
    };
  }

  function transitionEndTest() {
    if (window.QUnit) {
      return false;
    }

    var el = document.createElement('bootstrap');

    for (var name in TransitionEndEvent) {
      if (typeof el.style[name] !== 'undefined') {
        return {
          end: TransitionEndEvent[name]
        };
      }
    }

    return false;
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $(this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    transition = transitionEndTest();
    $.fn.emulateTransitionEnd = transitionEndEmulator;

    if (Util.supportsTransitionEnd()) {
      $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
    }
  }

  function escapeId(selector) {
    // we escape IDs in case of special selectors (selector = '#myId:something')
    // $.escapeSelector does not exist in jQuery < 3
    selector = typeof $.escapeSelector === 'function' ? $.escapeSelector(selector).substr(1) : selector.replace(/(:|\.|\[|\]|,|=|@)/g, '\\$1');
    return selector;
  }
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  var Util = {
    TRANSITION_END: 'bsTransitionEnd',
    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        selector = element.getAttribute('href') || '';
      } // if it's an ID


      if (selector.charAt(0) === '#') {
        selector = escapeId(selector);
      }

      try {
        var $selector = $(document).find(selector);
        return $selector.length > 0 ? selector : null;
      } catch (error) {
        return null;
      }
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $(element).trigger(transition.end);
    },
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(transition);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
          }
        }
      }
    }
  };
  setTransitionEndSupport();
  return Util;
}($);
//# sourceMappingURL=trader.js.map