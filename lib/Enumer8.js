"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Symbol$iterator;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CONFIG = Symbol('CONFIG'),
    CASES = Symbol('CASES'),
    FROZEN = Symbol('FROZEN'),
    IDS = Symbol('IDS');
/**
 * @const {Config} Default Enum Configuration
 * @private
 */

var DEFAULTS = {
  type: false,
  freeze: false
  /**
   * Enumeration Class
   * @class Enum
   */

};
_Symbol$iterator = Symbol.iterator;

var Enum =
/*#__PURE__*/
function () {
  /**
   * Creates an instance of Enum.
   * @param {Config|RawTypes} [config={}]
   * @memberof Enum
   */
  function Enum() {
    var _this = this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Enum);

    this[_Symbol$iterator] = function () {
      return _this.cases[Symbol.iterator]();
    };

    this.pushCase = function (id, val) {
      _this.ids.push(id);

      var newCase = {
        id: id
      };
      console.log("id: ".concat(id, ", val: ").concat(val, ", type: ").concat(_this[CONFIG].type));
      if (typeof val === 'undefined') newCase.rawValue = _this.typeResolve(id, val, _this[CONFIG].type);else if (_typeof(val) !== _this[CONFIG].type) throw new TypeError("Raw value must conform to the specified type.\nRaw value: ".concat(_typeof(val), ", Expected: ").concat(_this[CONFIG].type));else newCase.rawValue = val;
      _this[id] = newCase;
      _this.cases[id] = newCase;
    };

    this.typeResolve = function (id, rawValue, type) {
      switch (_typeof(rawValue)) {
        case 'undefined':
          switch (type) {
            case false:
              return id;

            case 'string':
              return id;

            case 'number':
              return _this.ids.indexOf(id) + 1;

            case 'boolean':
              return true;

            default:
              throw new Error('The provided type was not found!');
          }

        case _this[CONFIG].type:
          return rawValue;

        default:
          throw new Error("Raw value must conform to the specified type.\nRaw value: ".concat(_typeof(rawValue), ", Expected: ").concat(_this[CONFIG].type));
      }
    };

    this.validateCases = function (caseArray) {
      var cases, type;

      switch (_typeof(caseArray[0])) {
        case 'string':
        case 'number':
        case 'boolean':
          if (caseArray.forEach(function (c) {
            return ['string', 'number', 'boolean'].includes(_typeof(c));
          })) throw new Error('Enumer8 currently only supports string, number, and boolean values');
          cases = caseArray;
          type = 'array';
          break;

        case 'object':
          if (caseArray.length > 1) throw new Error('Individual values cannot be enumerated if an object/array is present');

          if (Array.isArray(caseArray[0])) {
            var verified = _this.validateCases(caseArray[0]);

            cases = verified.cases;
            type = verified.type;
          } else {
            cases = caseArray[0];
            type = 'object';
          }

          break;

        default:
          throw new TypeError('Enumer8 currently only supports string, number, and boolean values');
      }

      return {
        cases: cases,
        type: type
      };
    };

    switch (_typeof(config)) {
      case 'object':
        this[CONFIG] = Object.assign(DEFAULTS, config);
        break;

      case 'string':
        this[CONFIG] = Object.assign(DEFAULTS, {
          type: config
        });
        break;

      default:
        throw new Error('Unknown configuration object recieved');
    }

    return this;
  }
  /**
   * Enumerates the case(s) passed into the function
   * @param {...caseTypes} Case A string, array of strings, or object to enumerate
   * @return {Enum}
   */


  _createClass(Enum, [{
    key: "case",
    value: function _case() {
      var _this2 = this;

      if (this[FROZEN]) {
        console.error('Cases cannot be added after the enumeration is frozen.');
        return this;
      }

      for (var _len = arguments.length, Case = new Array(_len), _key = 0; _key < _len; _key++) {
        Case[_key] = arguments[_key];
      }

      var _this$validateCases = this.validateCases(Case),
          cases = _this$validateCases.cases,
          type = _this$validateCases.type;

      switch (type) {
        case 'array':
          cases.forEach(function (c) {
            return _this2.pushCase(c);
          });
          break;

        case 'object':
          if (!this[CONFIG].type) throw new Error('Type must be defined in initialization to use enumeration cases with raw values.');
          Object.keys(cases).forEach(function (c) {
            return _this2.pushCase(c, cases[c]);
          });
          break;

        default:
          throw new TypeError('Unknown case array returned from verification.');
      }

      return this;
    }
    /**
     * Returns the enumerated property with a specified value
     * @param {*} value The value to find in the enumeration
     * @returns {EnumCase}
     */

  }, {
    key: "findVal",
    value: function findVal(value) {
      return this.cases.find(function (c) {
        return c.rawValue === value;
      });
    }
    /** Freezes the enumeration */

  }, {
    key: "freeze",
    value: function freeze() {
      this[FROZEN] = true;
    }
    /**
     * Returns whether or not the enumeration is frozen
     * @returns {boolean}
     */

  }, {
    key: "isFrozen",
    value: function isFrozen() {
      return this[FROZEN];
    }
    /**
     * Get all enumerated values
     * @return {Array}
     */

  }, {
    key: "cases",
    get: function get() {
      this[CASES] = this[CASES] || {};
      return this[CASES];
    }
    /** Allows for the iteration of cases */

  }, {
    key: "ids",

    /**
     * @private
     */
    get: function get() {
      this[IDS] = this[IDS] || [];
      return this[IDS];
    }
    /**
     * @private
     */

  }]);

  return Enum;
}();

exports["default"] = Enum;
//# sourceMappingURL=Enumer8.js.map