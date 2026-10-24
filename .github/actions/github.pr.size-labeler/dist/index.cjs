var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// node_modules/js-yaml/dist/js-yaml.cjs.js
var require_js_yaml_cjs = __commonJS({
  "node_modules/js-yaml/dist/js-yaml.cjs.js"(exports2) {
    /*! js-yaml 5.5.0 https://github.com/nodeca/js-yaml @license MIT */
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var NOT_RESOLVED = /* @__PURE__ */ Symbol("NOT_RESOLVED");
    function defineScalarTag(tagName, options) {
      var _options$implicit, _options$matchByTagPr, _options$implicitFirs, _options$represent, _options$representTag;
      return {
        tagName,
        nodeKind: "scalar",
        implicit: (_options$implicit = options.implicit) !== null && _options$implicit !== void 0 ? _options$implicit : false,
        matchByTagPrefix: (_options$matchByTagPr = options.matchByTagPrefix) !== null && _options$matchByTagPr !== void 0 ? _options$matchByTagPr : false,
        implicitFirstChars: (_options$implicitFirs = options.implicitFirstChars) !== null && _options$implicitFirs !== void 0 ? _options$implicitFirs : null,
        resolve: options.resolve,
        identify: options.identify,
        represent: (_options$represent = options.represent) !== null && _options$represent !== void 0 ? _options$represent : ((data) => String(data)),
        representTagName: (_options$representTag = options.representTagName) !== null && _options$representTag !== void 0 ? _options$representTag : (() => tagName)
      };
    }
    function defineSequenceTag(tagName, options) {
      var _options$matchByTagPr2, _options$finalize, _options$represent2, _options$representTag2;
      const carrierIsResult = options.finalize === void 0;
      return {
        tagName,
        nodeKind: "sequence",
        implicit: false,
        matchByTagPrefix: (_options$matchByTagPr2 = options.matchByTagPrefix) !== null && _options$matchByTagPr2 !== void 0 ? _options$matchByTagPr2 : false,
        create: options.create,
        addItem: options.addItem,
        finalize: (_options$finalize = options.finalize) !== null && _options$finalize !== void 0 ? _options$finalize : ((carrier) => carrier),
        carrierIsResult,
        identify: options.identify,
        represent: (_options$represent2 = options.represent) !== null && _options$represent2 !== void 0 ? _options$represent2 : ((data) => data),
        representTagName: (_options$representTag2 = options.representTagName) !== null && _options$representTag2 !== void 0 ? _options$representTag2 : (() => tagName)
      };
    }
    function defineMappingTag(tagName, options) {
      var _options$matchByTagPr3, _options$finalize2, _options$represent3, _options$representTag3;
      const carrierIsResult = options.finalize === void 0;
      return {
        tagName,
        nodeKind: "mapping",
        implicit: false,
        matchByTagPrefix: (_options$matchByTagPr3 = options.matchByTagPrefix) !== null && _options$matchByTagPr3 !== void 0 ? _options$matchByTagPr3 : false,
        create: options.create,
        addPair: options.addPair,
        has: options.has,
        keys: options.keys,
        get: options.get,
        finalize: (_options$finalize2 = options.finalize) !== null && _options$finalize2 !== void 0 ? _options$finalize2 : ((carrier) => carrier),
        carrierIsResult,
        identify: options.identify,
        represent: (_options$represent3 = options.represent) !== null && _options$represent3 !== void 0 ? _options$represent3 : ((data) => data),
        representTagName: (_options$representTag3 = options.representTagName) !== null && _options$representTag3 !== void 0 ? _options$representTag3 : (() => tagName)
      };
    }
    var strTag = defineScalarTag("tag:yaml.org,2002:str", {
      resolve: (source) => source,
      identify: (data) => typeof data === "string"
    });
    var NULL_VALUES$1 = [
      "",
      "~",
      "null",
      "Null",
      "NULL"
    ];
    var nullCoreTag = defineScalarTag("tag:yaml.org,2002:null", {
      implicit: true,
      implicitFirstChars: [
        "",
        "~",
        "n",
        "N"
      ],
      resolve: (source) => {
        if (NULL_VALUES$1.indexOf(source) !== -1) return null;
        return NOT_RESOLVED;
      },
      identify: (object) => object === null,
      represent: () => "null"
    });
    var nullJsonTag = defineScalarTag("tag:yaml.org,2002:null", {
      implicit: true,
      implicitFirstChars: ["n"],
      resolve: (source, isExplicit) => {
        if (source === "null" || isExplicit && source === "") return null;
        return NOT_RESOLVED;
      },
      identify: (object) => object === null,
      represent: () => "null"
    });
    var NULL_VALUES = [
      "",
      "~",
      "null",
      "Null",
      "NULL"
    ];
    var nullYaml11Tag = defineScalarTag("tag:yaml.org,2002:null", {
      implicit: true,
      implicitFirstChars: [
        "",
        "~",
        "n",
        "N"
      ],
      resolve: (source) => {
        if (NULL_VALUES.indexOf(source) !== -1) return null;
        return NOT_RESOLVED;
      },
      identify: (object) => object === null,
      represent: () => "null"
    });
    var TRUE_VALUES$2 = [
      "true",
      "True",
      "TRUE"
    ];
    var FALSE_VALUES$2 = [
      "false",
      "False",
      "FALSE"
    ];
    var boolCoreTag = defineScalarTag("tag:yaml.org,2002:bool", {
      implicit: true,
      implicitFirstChars: [
        "t",
        "T",
        "f",
        "F"
      ],
      resolve: (source) => {
        if (TRUE_VALUES$2.indexOf(source) !== -1) return true;
        if (FALSE_VALUES$2.indexOf(source) !== -1) return false;
        return NOT_RESOLVED;
      },
      identify: (object) => Object.prototype.toString.call(object) === "[object Boolean]",
      represent: (object) => object ? "true" : "false"
    });
    var TRUE_VALUES$1 = ["true"];
    var FALSE_VALUES$1 = ["false"];
    var boolJsonTag = defineScalarTag("tag:yaml.org,2002:bool", {
      implicit: true,
      implicitFirstChars: ["t", "f"],
      resolve: (source) => {
        if (TRUE_VALUES$1.indexOf(source) !== -1) return true;
        if (FALSE_VALUES$1.indexOf(source) !== -1) return false;
        return NOT_RESOLVED;
      },
      identify: (object) => Object.prototype.toString.call(object) === "[object Boolean]",
      represent: (object) => object ? "true" : "false"
    });
    var TRUE_VALUES = [
      "true",
      "True",
      "TRUE",
      "y",
      "Y",
      "yes",
      "Yes",
      "YES",
      "on",
      "On",
      "ON"
    ];
    var FALSE_VALUES = [
      "false",
      "False",
      "FALSE",
      "n",
      "N",
      "no",
      "No",
      "NO",
      "off",
      "Off",
      "OFF"
    ];
    var boolYaml11Tag = defineScalarTag("tag:yaml.org,2002:bool", {
      implicit: true,
      implicitFirstChars: [
        "y",
        "Y",
        "n",
        "N",
        "t",
        "T",
        "f",
        "F",
        "o",
        "O"
      ],
      resolve: (source) => {
        if (TRUE_VALUES.indexOf(source) !== -1) return true;
        if (FALSE_VALUES.indexOf(source) !== -1) return false;
        return NOT_RESOLVED;
      },
      identify: (object) => Object.prototype.toString.call(object) === "[object Boolean]",
      represent: (object) => object ? "true" : "false"
    });
    var YAML_INTEGER_IMPLICIT_PATTERN$1 = /* @__PURE__ */ new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$");
    var YAML_INTEGER_EXPLICIT_PATTERN$1 = /* @__PURE__ */ new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");
    function parseYamlInteger$2(source) {
      let value = source;
      let sign = 1;
      if (value[0] === "-" || value[0] === "+") {
        if (value[0] === "-") sign = -1;
        value = value.slice(1);
      }
      if (value.startsWith("0b")) return sign * parseInt(value.slice(2), 2);
      if (value.startsWith("0o")) return sign * parseInt(value.slice(2), 8);
      if (value.startsWith("0x")) return sign * parseInt(value.slice(2), 16);
      return sign * parseInt(value, 10);
    }
    function resolveYamlInteger$2(source, isExplicit) {
      if (isExplicit) {
        if (!YAML_INTEGER_EXPLICIT_PATTERN$1.test(source)) return NOT_RESOLVED;
      } else if (!YAML_INTEGER_IMPLICIT_PATTERN$1.test(source)) return NOT_RESOLVED;
      const result = parseYamlInteger$2(source);
      return Number.isFinite(result) ? result : NOT_RESOLVED;
    }
    var intCoreTag = defineScalarTag("tag:yaml.org,2002:int", {
      implicit: true,
      implicitFirstChars: [
        "-",
        "+",
        ..."0123456789"
      ],
      resolve: resolveYamlInteger$2,
      identify: (object) => Number.isInteger(object) && !Object.is(object, -0) && object.toString(10).indexOf("e") < 0,
      represent: (object) => object.toString(10)
    });
    var YAML_INTEGER_IMPLICIT_PATTERN = /* @__PURE__ */ new RegExp("^-?(?:0|[1-9][0-9]*)$");
    var YAML_INTEGER_EXPLICIT_PATTERN = /* @__PURE__ */ new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");
    function parseYamlInteger$1(source) {
      let value = source;
      let sign = 1;
      if (value[0] === "-" || value[0] === "+") {
        if (value[0] === "-") sign = -1;
        value = value.slice(1);
      }
      if (value.startsWith("0b")) return sign * parseInt(value.slice(2), 2);
      if (value.startsWith("0o")) return sign * parseInt(value.slice(2), 8);
      if (value.startsWith("0x")) return sign * parseInt(value.slice(2), 16);
      return sign * parseInt(value, 10);
    }
    function resolveYamlInteger$1(source, isExplicit) {
      if (isExplicit) {
        if (!YAML_INTEGER_EXPLICIT_PATTERN.test(source)) return NOT_RESOLVED;
      } else if (!YAML_INTEGER_IMPLICIT_PATTERN.test(source)) return NOT_RESOLVED;
      const result = parseYamlInteger$1(source);
      return Number.isFinite(result) ? result : NOT_RESOLVED;
    }
    var intJsonTag = defineScalarTag("tag:yaml.org,2002:int", {
      implicit: true,
      implicitFirstChars: ["-", ..."0123456789"],
      resolve: resolveYamlInteger$1,
      identify: (object) => Number.isInteger(object) && !Object.is(object, -0) && object.toString(10).indexOf("e") < 0,
      represent: (object) => object.toString(10)
    });
    var YAML_INTEGER_PATTERN = /* @__PURE__ */ new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");
    function parseYamlInteger(source) {
      let value = source.replace(/_/g, "");
      let sign = 1;
      if (value[0] === "-" || value[0] === "+") {
        if (value[0] === "-") sign = -1;
        value = value.slice(1);
      }
      if (value.startsWith("0b")) return sign * parseInt(value.slice(2), 2);
      if (value.startsWith("0x")) return sign * parseInt(value.slice(2), 16);
      if (value.includes(":")) {
        let result = 0;
        for (const part of value.split(":")) result = result * 60 + Number(part);
        return sign * result;
      }
      if (value !== "0" && value[0] === "0") return sign * parseInt(value, 8);
      return sign * parseInt(value, 10);
    }
    function resolveYamlInteger(source) {
      if (!YAML_INTEGER_PATTERN.test(source)) return NOT_RESOLVED;
      const result = parseYamlInteger(source);
      return Number.isFinite(result) ? result : NOT_RESOLVED;
    }
    var intYaml11Tag = defineScalarTag("tag:yaml.org,2002:int", {
      implicit: true,
      implicitFirstChars: [
        "-",
        "+",
        ..."0123456789"
      ],
      resolve: resolveYamlInteger,
      identify: (object) => Number.isInteger(object) && !Object.is(object, -0) && object.toString(10).indexOf("e") < 0,
      represent: (object) => object.toString(10)
    });
    var YAML_FLOAT_PATTERN$1 = /* @__PURE__ */ new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
    var YAML_FLOAT_SPECIAL_PATTERN$1 = /* @__PURE__ */ new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
    function resolveYamlFloat$2(source) {
      if (!YAML_FLOAT_PATTERN$1.test(source)) return NOT_RESOLVED;
      let value = source.toLowerCase();
      const sign = value[0] === "-" ? -1 : 1;
      if ("+-".includes(value[0])) value = value.slice(1);
      if (value === ".inf") return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      if (value === ".nan") return NaN;
      const result = sign * parseFloat(value);
      if (Number.isFinite(result) || YAML_FLOAT_SPECIAL_PATTERN$1.test(source)) return result;
      return NOT_RESOLVED;
    }
    function representYamlFloat$2(object) {
      if (isNaN(object)) return ".nan";
      if (object === Number.POSITIVE_INFINITY) return ".inf";
      if (object === Number.NEGATIVE_INFINITY) return "-.inf";
      if (Object.is(object, -0)) return "-0.0";
      const result = object.toString(10);
      return /^[-+]?[0-9]+e/.test(result) ? result.replace("e", ".e") : result;
    }
    var floatCoreTag = defineScalarTag("tag:yaml.org,2002:float", {
      implicit: true,
      implicitFirstChars: [
        "-",
        "+",
        ".",
        ..."0123456789"
      ],
      resolve: resolveYamlFloat$2,
      identify: (object) => typeof object === "number" && (!Number.isInteger(object) || Object.is(object, -0) || object.toString(10).indexOf("e") >= 0),
      represent: representYamlFloat$2
    });
    var YAML_FLOAT_IMPLICIT_PATTERN = /* @__PURE__ */ new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$");
    var YAML_FLOAT_EXPLICIT_PATTERN = /* @__PURE__ */ new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
    function resolveYamlFloat$1(source, isExplicit) {
      if (isExplicit) {
        if (!YAML_FLOAT_EXPLICIT_PATTERN.test(source)) return NOT_RESOLVED;
        let value = source.toLowerCase();
        const sign = value[0] === "-" ? -1 : 1;
        if ("+-".includes(value[0])) value = value.slice(1);
        if (value === ".inf") return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        if (value === ".nan") return NaN;
        const result2 = sign * parseFloat(value);
        return Number.isFinite(result2) ? result2 : NOT_RESOLVED;
      }
      if (!YAML_FLOAT_IMPLICIT_PATTERN.test(source)) return NOT_RESOLVED;
      const result = Number(source);
      if (Number.isFinite(result)) return result;
      return NOT_RESOLVED;
    }
    function representYamlFloat$1(object) {
      if (isNaN(object)) return ".nan";
      if (object === Number.POSITIVE_INFINITY) return ".inf";
      if (object === Number.NEGATIVE_INFINITY) return "-.inf";
      if (Object.is(object, -0)) return "-0.0";
      const result = object.toString(10);
      return /^[-+]?[0-9]+e/.test(result) ? result.replace("e", ".e") : result;
    }
    var floatJsonTag = defineScalarTag("tag:yaml.org,2002:float", {
      implicit: true,
      implicitFirstChars: ["-", ..."0123456789"],
      resolve: resolveYamlFloat$1,
      identify: (object) => typeof object === "number" && (!Number.isInteger(object) || Object.is(object, -0) || object.toString(10).indexOf("e") >= 0),
      represent: representYamlFloat$1
    });
    var YAML_FLOAT_PATTERN = /* @__PURE__ */ new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
    var YAML_FLOAT_SPECIAL_PATTERN = /* @__PURE__ */ new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
    function resolveYamlFloat(source) {
      if (!YAML_FLOAT_PATTERN.test(source)) return NOT_RESOLVED;
      let value = source.toLowerCase().replace(/_/g, "");
      const sign = value[0] === "-" ? -1 : 1;
      if ("+-".includes(value[0])) value = value.slice(1);
      if (value === ".inf") return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      if (value === ".nan") return NaN;
      let result = 0;
      if (value.includes(":")) {
        for (const part of value.split(":")) result = result * 60 + Number(part);
        result *= sign;
      } else result = sign * parseFloat(value);
      if (Number.isFinite(result) || YAML_FLOAT_SPECIAL_PATTERN.test(source)) return result;
      return NOT_RESOLVED;
    }
    function representYamlFloat(object) {
      if (isNaN(object)) return ".nan";
      if (object === Number.POSITIVE_INFINITY) return ".inf";
      if (object === Number.NEGATIVE_INFINITY) return "-.inf";
      if (Object.is(object, -0)) return "-0.0";
      const result = object.toString(10);
      return /^[-+]?[0-9]+e/.test(result) ? result.replace("e", ".e") : result;
    }
    var floatYaml11Tag = defineScalarTag("tag:yaml.org,2002:float", {
      implicit: true,
      implicitFirstChars: [
        "-",
        "+",
        ".",
        ..."0123456789"
      ],
      resolve: resolveYamlFloat,
      identify: (object) => typeof object === "number" && (!Number.isInteger(object) || Object.is(object, -0) || object.toString(10).indexOf("e") >= 0),
      represent: representYamlFloat
    });
    var mergeTag = defineScalarTag("tag:yaml.org,2002:merge", {
      implicit: true,
      implicitFirstChars: ["<"],
      resolve: (source, isExplicit) => {
        if (source === "<<" || isExplicit && source === "") return "<<";
        return NOT_RESOLVED;
      },
      identify: () => false
    });
    var BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;
    function resolveYamlBinary(source) {
      const input = source.replace(/\s/g, "");
      if (input.length % 4 !== 0 || !BASE64_PATTERN.test(input)) return NOT_RESOLVED;
      const binary = atob(input);
      const result = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index++) result[index] = binary.charCodeAt(index);
      return result;
    }
    function representYamlBinary(object) {
      let binary = "";
      for (let index = 0; index < object.length; index++) binary += String.fromCharCode(object[index]);
      return btoa(binary);
    }
    var binaryTag = defineScalarTag("tag:yaml.org,2002:binary", {
      resolve: resolveYamlBinary,
      identify: (object) => Object.prototype.toString.call(object) === "[object Uint8Array]",
      represent: representYamlBinary
    });
    var YAML_DATE_REGEXP = /* @__PURE__ */ new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$");
    var YAML_TIMESTAMP_REGEXP = /* @__PURE__ */ new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
    function makeUtcDate(year, month, day, hour = 0, minute = 0, second = 0, fraction = 0) {
      const date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
      date.setUTCFullYear(year, month, day);
      return date;
    }
    function resolveYamlTimestamp(source) {
      let match = YAML_DATE_REGEXP.exec(source);
      if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(source);
      if (match === null) return NOT_RESOLVED;
      const year = +match[1];
      const month = +match[2] - 1;
      const day = +match[3];
      if (!match[4]) {
        const date2 = makeUtcDate(year, month, day);
        if (date2.getUTCFullYear() !== year || date2.getUTCMonth() !== month || date2.getUTCDate() !== day) return NOT_RESOLVED;
        return date2;
      }
      const hour = +match[4];
      const minute = +match[5];
      const second = +match[6];
      let fraction = 0;
      if (hour > 23 || minute > 59 || second > 59) return NOT_RESOLVED;
      if (match[7]) {
        let value = match[7].slice(0, 3);
        while (value.length < 3) value += "0";
        fraction = +value;
      }
      const date = makeUtcDate(year, month, day, hour, minute, second, fraction);
      if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) return NOT_RESOLVED;
      if (match[9]) {
        const offsetHour = +match[10];
        const offsetMinute = +(match[11] || 0);
        if (offsetHour > 23 || offsetMinute > 59) return NOT_RESOLVED;
        const offset = (offsetHour * 60 + offsetMinute) * 6e4;
        date.setTime(date.getTime() - (match[9] === "-" ? -offset : offset));
      }
      return date;
    }
    var timestampTag = defineScalarTag("tag:yaml.org,2002:timestamp", {
      implicit: true,
      implicitFirstChars: [..."0123456789"],
      resolve: resolveYamlTimestamp,
      identify: (object) => object instanceof Date,
      represent: (object) => object.toISOString()
    });
    var seqTag = defineSequenceTag("tag:yaml.org,2002:seq", {
      create: () => [],
      addItem: (container, item) => {
        container.push(item);
      },
      identify: Array.isArray
    });
    function isPlainObject(data) {
      if (data === null || typeof data !== "object" || Array.isArray(data)) return false;
      const prototype = Object.getPrototypeOf(data);
      return prototype === null || prototype === Object.prototype;
    }
    function pick(object, keys) {
      const result = {};
      for (const key of keys) if (object[key] !== void 0) result[key] = object[key];
      return result;
    }
    var omapTag = defineSequenceTag("tag:yaml.org,2002:omap", {
      create: () => ({
        list: [],
        seen: /* @__PURE__ */ new Set()
      }),
      addItem: (carrier, item) => {
        let key;
        if (item instanceof Map) {
          if (item.size !== 1) return "cannot resolve an ordered map item";
          key = item.keys().next().value;
        } else if (isPlainObject(item)) {
          const itemKeys = Object.keys(item);
          if (itemKeys.length !== 1) return "cannot resolve an ordered map item";
          key = itemKeys[0];
        } else return "cannot resolve an ordered map item";
        if (carrier.seen.has(key)) return "duplicate key in ordered map";
        carrier.seen.add(key);
        carrier.list.push(item);
        return "";
      },
      finalize: (carrier) => carrier.list,
      identify: () => false
    });
    var pairsTag = defineSequenceTag("tag:yaml.org,2002:pairs", {
      create: () => [],
      addItem: (container, item) => {
        if (item instanceof Map) {
          if (item.size !== 1) return "cannot resolve a pairs item";
          container.push(item.entries().next().value);
          return "";
        }
        if (Object.prototype.toString.call(item) !== "[object Object]") return "cannot resolve a pairs item";
        const object = item;
        const keys = Object.keys(object);
        if (keys.length !== 1) return "cannot resolve a pairs item";
        container.push([keys[0], object[keys[0]]]);
        return "";
      },
      identify: () => false
    });
    var mapTag = defineMappingTag("tag:yaml.org,2002:map", {
      create: () => ({}),
      identify: isPlainObject,
      represent: (o) => {
        const map = /* @__PURE__ */ new Map();
        for (const key of Object.keys(o)) map.set(key, o[key]);
        return map;
      },
      addPair: (container, key, value) => {
        if (key !== null && typeof key === "object") return "object-based map does not support complex keys";
        const normalizedKey = String(key);
        if (normalizedKey === "__proto__") Object.defineProperty(container, normalizedKey, {
          value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        else container[normalizedKey] = value;
        return "";
      },
      has: (container, key) => {
        if (key !== null && typeof key === "object") return false;
        return Object.prototype.hasOwnProperty.call(container, String(key));
      },
      keys: (container) => Object.keys(container),
      get: (container, key) => {
        const normalizedKey = String(key);
        if (!Object.prototype.hasOwnProperty.call(container, normalizedKey)) return null;
        return container[normalizedKey];
      }
    });
    var setTag = defineMappingTag("tag:yaml.org,2002:set", {
      create: () => /* @__PURE__ */ new Set(),
      identify: (data) => data instanceof Set,
      represent: (data) => {
        const map = /* @__PURE__ */ new Map();
        for (const key of data) map.set(key, null);
        return map;
      },
      addPair: (container, key, value) => {
        if (value !== null) return "cannot resolve a set item";
        container.add(key);
        return "";
      },
      has: (container, key) => container.has(key),
      keys: (container) => container.keys(),
      get: () => null
    });
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    function toPrimitive(t, r) {
      if ("object" != _typeof(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function toPropertyKey(t) {
      var i = toPrimitive(t, "string");
      return "symbol" == _typeof(i) ? i : i + "";
    }
    function _defineProperty(e, r, t) {
      return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: true,
        configurable: true,
        writable: true
      }) : e[r] = t, e;
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread2(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function createTagDefinitionMap() {
      return {
        scalar: /* @__PURE__ */ Object.create(null),
        sequence: /* @__PURE__ */ Object.create(null),
        mapping: /* @__PURE__ */ Object.create(null)
      };
    }
    function createTagDefinitionListMap() {
      return {
        scalar: [],
        sequence: [],
        mapping: []
      };
    }
    function compileTags(tags) {
      const result = [];
      for (const tag of tags) {
        let index = result.length;
        for (let previousIndex = 0; previousIndex < result.length; previousIndex++) {
          const previous = result[previousIndex];
          if (previous.nodeKind === tag.nodeKind && previous.tagName === tag.tagName && previous.matchByTagPrefix === tag.matchByTagPrefix) {
            index = previousIndex;
            break;
          }
        }
        result[index] = tag;
      }
      return result;
    }
    var Schema = class Schema2 {
      constructor(tags) {
        _defineProperty(this, "tags", void 0);
        _defineProperty(
          this,
          /** @internal */
          "implicitScalarTags",
          void 0
        );
        _defineProperty(
          this,
          /**
          * Dispatch implicit scalar resolvers by `source.charAt(0)`. Each bucket holds
          * the resolvers that may match that key, in schema order; a key absent from
          * the map uses
          * {@link Schema.implicitScalarAnyFirstChar}
          * (resolvers that declared no first-char constraint, so they apply to any
          * first character).
          */
          "implicitScalarByFirstChar",
          void 0
        );
        _defineProperty(this, "implicitScalarAnyFirstChar", void 0);
        _defineProperty(
          this,
          /**
          * The default scalar tag (`!!str`), resolved once so the composer's fallback
          * for unresolved plain scalars avoids a keyed lookup per scalar.
          *
          * @internal
          */
          "defaultScalarTag",
          void 0
        );
        _defineProperty(
          this,
          /**
          * The default container tags (`!!seq` / `!!map`), used by the dumper: when a
          * value is identified by its default tag, the tag is implicit and not
          * printed. Undefined if the schema does not define them (then such values
          * can't be dumped).
          *
          * @internal
          */
          "defaultSequenceTag",
          void 0
        );
        _defineProperty(
          this,
          /** @internal */
          "defaultMappingTag",
          void 0
        );
        _defineProperty(this, "exact", void 0);
        _defineProperty(this, "prefix", void 0);
        const compiledTags = compileTags(tags);
        const implicitScalarTags = [];
        const exact = createTagDefinitionMap();
        const prefix = createTagDefinitionListMap();
        for (const tag of compiledTags) {
          if (tag.nodeKind === "scalar" && tag.implicit) {
            if (tag.matchByTagPrefix) throw new Error("Implicit scalar tags cannot match by tag prefix");
            implicitScalarTags.push(tag);
          }
          switch (tag.nodeKind) {
            case "scalar":
              if (tag.matchByTagPrefix) prefix.scalar.push(tag);
              else exact.scalar[tag.tagName] = tag;
              break;
            case "sequence":
              if (tag.matchByTagPrefix) prefix.sequence.push(tag);
              else exact.sequence[tag.tagName] = tag;
              break;
            case "mapping":
              if (tag.matchByTagPrefix) prefix.mapping.push(tag);
              else exact.mapping[tag.tagName] = tag;
          }
        }
        const implicitScalarAnyFirstChar = implicitScalarTags.filter((tag) => tag.implicitFirstChars === null);
        const keys = /* @__PURE__ */ new Set();
        for (const tag of implicitScalarTags) if (tag.implicitFirstChars !== null) for (const key of tag.implicitFirstChars) keys.add(key);
        const implicitScalarByFirstChar = /* @__PURE__ */ new Map();
        for (const key of keys) implicitScalarByFirstChar.set(key, implicitScalarTags.filter((tag) => tag.implicitFirstChars === null || tag.implicitFirstChars.indexOf(key) !== -1));
        const defaultScalarTag = exact.scalar["tag:yaml.org,2002:str"];
        if (!defaultScalarTag) throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");
        this.tags = compiledTags;
        this.implicitScalarTags = implicitScalarTags;
        this.implicitScalarByFirstChar = implicitScalarByFirstChar;
        this.implicitScalarAnyFirstChar = implicitScalarAnyFirstChar;
        this.defaultScalarTag = defaultScalarTag;
        this.defaultSequenceTag = exact.sequence["tag:yaml.org,2002:seq"];
        this.defaultMappingTag = exact.mapping["tag:yaml.org,2002:map"];
        this.exact = exact;
        this.prefix = prefix;
      }
      /** @internal */
      lookupScalarTag(tagName) {
        const exactTag = this.exact.scalar[tagName];
        if (exactTag) return exactTag;
        for (const tag of this.prefix.scalar) if (tagName.startsWith(tag.tagName)) return tag;
      }
      /** @internal */
      lookupSequenceTag(tagName) {
        const exactTag = this.exact.sequence[tagName];
        if (exactTag) return exactTag;
        for (const tag of this.prefix.sequence) if (tagName.startsWith(tag.tagName)) return tag;
      }
      /** @internal */
      lookupMappingTag(tagName) {
        const exactTag = this.exact.mapping[tagName];
        if (exactTag) return exactTag;
        for (const tag of this.prefix.mapping) if (tagName.startsWith(tag.tagName)) return tag;
      }
      /** @internal */
      resolveImplicitScalarTag(source) {
        var _this$implicitScalarB;
        const candidates = (_this$implicitScalarB = this.implicitScalarByFirstChar.get(source.charAt(0))) !== null && _this$implicitScalarB !== void 0 ? _this$implicitScalarB : this.implicitScalarAnyFirstChar;
        for (const tag2 of candidates) {
          const value = tag2.resolve(source, false, tag2.tagName);
          if (value !== NOT_RESOLVED) return {
            value,
            tag: tag2
          };
        }
        const tag = this.defaultScalarTag;
        return {
          value: tag.resolve(source, false, tag.tagName),
          tag
        };
      }
      /**
      * Creates a new schema with the specified tags added. If a tag already
      * exists, it is replaced by the specified tag.
      *
      * @example
      *
      * ```javascript
      * import { CORE_SCHEMA, mergeTag, realMapTag } from 'js-yaml'
      *
      * const schema = CORE_SCHEMA.withTags(mergeTag, realMapTag)
      * ```
      */
      withTags(...tags) {
        let flatTags = [];
        for (const tag of tags) flatTags = flatTags.concat(tag);
        return new Schema2([...this.tags, ...flatTags]);
      }
    };
    var FAILSAFE_SCHEMA = new Schema([
      strTag,
      seqTag,
      mapTag
    ]);
    var JSON_SCHEMA = new Schema([
      ...FAILSAFE_SCHEMA.tags,
      nullJsonTag,
      boolJsonTag,
      intJsonTag,
      floatJsonTag
    ]);
    var CORE_SCHEMA = new Schema([
      ...FAILSAFE_SCHEMA.tags,
      nullCoreTag,
      boolCoreTag,
      intCoreTag,
      floatCoreTag
    ]);
    var YAML11_SCHEMA = new Schema([
      ...FAILSAFE_SCHEMA.tags,
      nullYaml11Tag,
      boolYaml11Tag,
      intYaml11Tag,
      floatYaml11Tag,
      timestampTag,
      mergeTag,
      binaryTag,
      omapTag,
      pairsTag,
      setTag
    ]);
    var DUMP_SCHEMA = YAML11_SCHEMA.withTags(_objectSpread2(_objectSpread2({}, intYaml11Tag), {}, { resolve: (source, isExplicit, tagName) => {
      const result = intYaml11Tag.resolve(source, isExplicit, tagName);
      return result === NOT_RESOLVED ? intCoreTag.resolve(source, isExplicit, tagName) : result;
    } }), _objectSpread2(_objectSpread2({}, floatYaml11Tag), {}, { resolve: (source, isExplicit, tagName) => {
      const result = floatYaml11Tag.resolve(source, isExplicit, tagName);
      return result === NOT_RESOLVED ? floatCoreTag.resolve(source, isExplicit, tagName) : result;
    } }));
    var realMapTag = defineMappingTag("tag:yaml.org,2002:map", {
      create: () => /* @__PURE__ */ new Map(),
      addPair: (container, key, value) => {
        container.set(key, value);
        return "";
      },
      has: (container, key) => container.has(key),
      keys: (container) => container.keys(),
      get: (container, key) => container.get(key),
      identify: (data) => data instanceof Map || isPlainObject(data),
      represent: (data) => {
        if (data instanceof Map) return data;
        const map = /* @__PURE__ */ new Map();
        const obj = data;
        for (const key of Object.keys(obj)) map.set(key, obj[key]);
        return map;
      }
    });
    function normalizeKey(key) {
      if (Array.isArray(key)) {
        const array = Array.prototype.slice.call(key);
        for (let index = 0; index < array.length; index++) {
          if (Array.isArray(array[index])) return null;
          if (typeof array[index] === "object" && Object.prototype.toString.call(array[index]) === "[object Object]") array[index] = "[object Object]";
        }
        return String(array);
      }
      if (typeof key === "object" && Object.prototype.toString.call(key) === "[object Object]") return "[object Object]";
      return String(key);
    }
    var legacyMapTag = defineMappingTag("tag:yaml.org,2002:map", {
      create: () => ({}),
      identify: isPlainObject,
      represent: (o) => {
        const map = /* @__PURE__ */ new Map();
        for (const key of Object.keys(o)) map.set(key, o[key]);
        return map;
      },
      addPair: (container, key, value) => {
        const normalizedKey = normalizeKey(key);
        if (normalizedKey === null) return "nested arrays are not supported inside keys";
        if (normalizedKey === "__proto__") Object.defineProperty(container, normalizedKey, {
          value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        else container[normalizedKey] = value;
        return "";
      },
      has: (container, key) => {
        const normalizedKey = normalizeKey(key);
        return normalizedKey !== null && Object.prototype.hasOwnProperty.call(container, normalizedKey);
      },
      keys: (container) => Object.keys(container),
      get: (container, key) => {
        const normalizedKey = String(key);
        if (!Object.prototype.hasOwnProperty.call(container, normalizedKey)) return null;
        return container[normalizedKey];
      }
    });
    var DEFAULT_SNIPPET_OPTIONS = {
      maxLength: 79,
      indent: 1,
      linesBefore: 3,
      linesAfter: 2
    };
    function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
      let head = "";
      let tail = "";
      const maxHalfLength = Math.floor(maxLineLength / 2) - 1;
      if (position - lineStart > maxHalfLength) {
        head = " ... ";
        lineStart = position - maxHalfLength + head.length;
      }
      if (lineEnd - position > maxHalfLength) {
        tail = " ...";
        lineEnd = position + maxHalfLength - tail.length;
      }
      return {
        str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
        pos: position - lineStart + head.length
      };
    }
    function padStart(string, max) {
      return " ".repeat(Math.max(max - string.length, 0)) + string;
    }
    function makeSnippet(mark, options) {
      if (!mark.buffer) return null;
      const opts = _objectSpread2(_objectSpread2({}, DEFAULT_SNIPPET_OPTIONS), options);
      const re = /\r?\n|\r|\0/g;
      const lineStarts = [0];
      const lineEnds = [];
      let match;
      let foundLineNo = -1;
      while (match = re.exec(mark.buffer)) {
        lineEnds.push(match.index);
        lineStarts.push(match.index + match[0].length);
        if (mark.position <= match.index && foundLineNo < 0) foundLineNo = lineStarts.length - 2;
      }
      if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
      let result = "";
      const lineNoLength = Math.min(mark.line + opts.linesAfter, lineEnds.length).toString().length;
      const maxLineLength = opts.maxLength - (opts.indent + lineNoLength + 3);
      for (let i = 1; i <= opts.linesBefore; i++) {
        if (foundLineNo - i < 0) break;
        const line2 = getLine(mark.buffer, lineStarts[foundLineNo - i], lineEnds[foundLineNo - i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]), maxLineLength);
        result = `${" ".repeat(opts.indent)}${padStart((mark.line - i + 1).toString(), lineNoLength)} | ${line2.str}
${result}`;
      }
      const line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
      result += `${" ".repeat(opts.indent)}${padStart((mark.line + 1).toString(), lineNoLength)} | ${line.str}
`;
      result += `${"-".repeat(opts.indent + lineNoLength + 3 + line.pos)}^
`;
      for (let i = 1; i <= opts.linesAfter; i++) {
        if (foundLineNo + i >= lineEnds.length) break;
        const line2 = getLine(mark.buffer, lineStarts[foundLineNo + i], lineEnds[foundLineNo + i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]), maxLineLength);
        result += `${" ".repeat(opts.indent)}${padStart((mark.line + i + 1).toString(), lineNoLength)} | ${line2.str}
`;
      }
      return result.replace(/\n$/, "");
    }
    function formatError(exception, compact) {
      let where = "";
      if (!exception.mark) return exception.reason;
      if (exception.mark.name) where += `in "${exception.mark.name}" `;
      where += `(${exception.mark.line + 1}:${exception.mark.column + 1})`;
      if (!compact && exception.mark.snippet) where += `

${exception.mark.snippet}`;
      return `${exception.reason} ${where}`;
    }
    var YAMLException = class YAMLException2 extends Error {
      /**
      * Optional `mark` contains source snippet data. Usually, use
      * {@link YAMLException.throwAt} instead of passing it directly.
      */
      constructor(reason, mark) {
        super();
        _defineProperty(this, "reason", void 0);
        _defineProperty(this, "mark", void 0);
        this.name = "YAMLException";
        this.reason = reason;
        this.mark = mark;
        this.message = formatError(this, false);
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
      }
      /**
      * Returns the formatted error, omitting the source snippet in compact mode.
      */
      toString(compact) {
        return `${this.name}: ${formatError(this, compact)}`;
      }
      /**
      * Builds a YAMLException with a source snippet and throws it. `source` is
      * the raw input text; `position` is an offset into it.
      */
      static throwAt(source, position, message, filename = "") {
        let line = 0;
        let lineStart = 0;
        for (let index = 0; index < position; index++) {
          const ch = source.charCodeAt(index);
          if (ch === 10) {
            line++;
            lineStart = index + 1;
          } else if (ch === 13) {
            line++;
            if (source.charCodeAt(index + 1) === 10) index++;
            lineStart = index + 1;
          }
        }
        const mark = {
          name: filename,
          buffer: source,
          position,
          line,
          column: position - lineStart
        };
        mark.snippet = makeSnippet(mark);
        throw new YAMLException2(message, mark);
      }
    };
    var EVENT_ID = {
      DOCUMENT: 1,
      SEQUENCE: 2,
      MAPPING: 3,
      SCALAR: 4,
      ALIAS: 5,
      POP: 6
    };
    var SCALAR_STYLE = {
      PLAIN: 1,
      SINGLE_QUOTED: 2,
      DOUBLE_QUOTED: 3,
      LITERAL_BLOCK: 4,
      FOLDED_BLOCK: 5
    };
    var COLLECTION_STYLE = {
      BLOCK: 1,
      FLOW: 2
    };
    var CHOMPING_MODE = {
      CLIP: 1,
      STRIP: 2,
      KEEP: 3
    };
    var NO_RANGE$3 = -1;
    function simpleEscapeSequence(c) {
      switch (c) {
        case 48:
          return "\0";
        case 97:
          return "\x07";
        case 98:
          return "\b";
        case 116:
          return "	";
        case 9:
          return "	";
        case 110:
          return "\n";
        case 118:
          return "\v";
        case 102:
          return "\f";
        case 114:
          return "\r";
        case 101:
          return "\x1B";
        case 32:
          return " ";
        case 34:
          return '"';
        case 47:
          return "/";
        case 92:
          return "\\";
        case 78:
          return "\x85";
        case 95:
          return "\xA0";
        case 76:
          return "\u2028";
        case 80:
          return "\u2029";
        default:
          return "";
      }
    }
    var simpleEscapeCheck = new Array(256);
    var simpleEscapeMap = new Array(256);
    for (let i = 0; i < 256; i++) {
      simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
      simpleEscapeMap[i] = simpleEscapeSequence(i);
    }
    function charFromCodepoint(c) {
      if (c <= 65535) return String.fromCharCode(c);
      return String.fromCharCode((c - 65536 >> 10) + 55296, (c - 65536 & 1023) + 56320);
    }
    function fromHexCode$1(c) {
      if (c >= 48 && c <= 57) return c - 48;
      return (c | 32) - 97 + 10;
    }
    function escapedHexLen$1(c) {
      if (c === 120) return 2;
      if (c === 117) return 4;
      return 8;
    }
    function skipFoldedBreaks(input, position, end) {
      let breaks = 0;
      while (position < end) {
        const ch = input.charCodeAt(position);
        if (ch === 10) {
          breaks++;
          position++;
        } else if (ch === 13) {
          breaks++;
          position++;
          if (input.charCodeAt(position) === 10) position++;
        } else if (ch === 32 || ch === 9) position++;
        else break;
      }
      return {
        position,
        breaks
      };
    }
    function foldedBreaks(count) {
      if (count === 1) return " ";
      return "\n".repeat(count - 1);
    }
    function getPlainValue(input, start, end) {
      let result = "";
      let position = start;
      let captureStart = start;
      let captureEnd = start;
      while (position < end) {
        const ch = input.charCodeAt(position);
        if (ch === 10 || ch === 13) {
          result += input.slice(captureStart, captureEnd);
          const fold = skipFoldedBreaks(input, position, end);
          result += foldedBreaks(fold.breaks);
          position = captureStart = captureEnd = fold.position;
        } else {
          position++;
          if (ch !== 32 && ch !== 9) captureEnd = position;
        }
      }
      return result + input.slice(captureStart, captureEnd);
    }
    function getSingleQuotedValue(input, start, end) {
      let result = "";
      let position = start;
      let captureStart = start;
      let captureEnd = start;
      while (position < end) {
        const ch = input.charCodeAt(position);
        if (ch === 39) {
          result += input.slice(captureStart, position) + "'";
          position += 2;
          captureStart = captureEnd = position;
        } else if (ch === 10 || ch === 13) {
          result += input.slice(captureStart, captureEnd);
          const fold = skipFoldedBreaks(input, position, end);
          result += foldedBreaks(fold.breaks);
          position = captureStart = captureEnd = fold.position;
        } else {
          position++;
          if (ch !== 32 && ch !== 9) captureEnd = position;
        }
      }
      return result + input.slice(captureStart, end);
    }
    function getDoubleQuotedValue(input, start, end) {
      let result = "";
      let position = start;
      let captureStart = start;
      let captureEnd = start;
      while (position < end) {
        const ch = input.charCodeAt(position);
        if (ch === 92) {
          result += input.slice(captureStart, position);
          position++;
          const escaped = input.charCodeAt(position);
          if (escaped === 10 || escaped === 13) position = skipFoldedBreaks(input, position, end).position;
          else if (escaped < 256 && simpleEscapeCheck[escaped]) {
            result += simpleEscapeMap[escaped];
            position++;
          } else {
            let hexLength = escapedHexLen$1(escaped);
            let hexResult = 0;
            for (; hexLength > 0; hexLength--) {
              position++;
              const digit = fromHexCode$1(input.charCodeAt(position));
              hexResult = (hexResult << 4) + digit;
            }
            result += charFromCodepoint(hexResult);
            position++;
          }
          captureStart = captureEnd = position;
        } else if (ch === 10 || ch === 13) {
          result += input.slice(captureStart, captureEnd);
          const fold = skipFoldedBreaks(input, position, end);
          result += foldedBreaks(fold.breaks);
          position = captureStart = captureEnd = fold.position;
        } else {
          position++;
          if (ch !== 32 && ch !== 9) captureEnd = position;
        }
      }
      return result + input.slice(captureStart, end);
    }
    function getBlockValue(input, start, end, indent, chomping, folded) {
      const textIndent = indent < 0 ? 0 : indent;
      const region = input.slice(start, end).replace(/\r\n?/g, "\n");
      const lines = region === "" ? [] : (region.endsWith("\n") ? region.slice(0, -1) : region).split("\n");
      let result = "";
      let didReadContent = false;
      let emptyLines = 0;
      let atMoreIndented = false;
      for (const line of lines) {
        let column = 0;
        while (column < textIndent && line.charCodeAt(column) === 32) column++;
        if (indent < 0 || column >= line.length) {
          emptyLines++;
          continue;
        }
        const content = line.slice(textIndent);
        const first = content.charCodeAt(0);
        if (folded) {
          if (first === 32 || first === 9) {
            atMoreIndented = true;
            result += "\n".repeat(didReadContent ? 1 + emptyLines : emptyLines);
          } else if (atMoreIndented) {
            atMoreIndented = false;
            result += "\n".repeat(emptyLines + 1);
          } else if (emptyLines === 0) {
            if (didReadContent) result += " ";
          } else result += "\n".repeat(emptyLines);
        } else result += "\n".repeat(didReadContent ? 1 + emptyLines : emptyLines);
        result += content;
        didReadContent = true;
        emptyLines = 0;
      }
      if (chomping === CHOMPING_MODE.KEEP) result += "\n".repeat(didReadContent ? 1 + emptyLines : emptyLines);
      else if (chomping !== CHOMPING_MODE.STRIP) {
        if (didReadContent) result += "\n";
      }
      return result;
    }
    function getScalarValue(input, scalar) {
      if (scalar.valueStart === NO_RANGE$3) return "";
      const { valueStart, valueEnd } = scalar;
      if (scalar.fast) return input.slice(valueStart, valueEnd);
      switch (scalar.style) {
        case SCALAR_STYLE.SINGLE_QUOTED:
          return getSingleQuotedValue(input, valueStart, valueEnd);
        case SCALAR_STYLE.DOUBLE_QUOTED:
          return getDoubleQuotedValue(input, valueStart, valueEnd);
        case SCALAR_STYLE.LITERAL_BLOCK:
          return getBlockValue(input, valueStart, valueEnd, scalar.indent, scalar.chomping, false);
        case SCALAR_STYLE.FOLDED_BLOCK:
          return getBlockValue(input, valueStart, valueEnd, scalar.indent, scalar.chomping, true);
        default:
          return getPlainValue(input, valueStart, valueEnd);
      }
    }
    var DEFAULT_TAG_HANDLERS = Object.assign(/* @__PURE__ */ Object.create(null), {
      "!": "!",
      "!!": "tag:yaml.org,2002:"
    });
    var TAG_SUFFIX_CHARS = "-#;/?:@&=+$_.~*'()";
    var TAG_URI_CHARS = TAG_SUFFIX_CHARS + "!,[]";
    var HEX = "0123456789ABCDEF";
    function percentByte(byte) {
      return "%" + HEX[byte >> 4] + HEX[byte & 15];
    }
    function tagPercentEncode(source, isSuffix) {
      const allowed = isSuffix ? TAG_SUFFIX_CHARS : TAG_URI_CHARS;
      let result = "";
      for (let index = 0; index < source.length; index++) {
        let ch = source.charCodeAt(index);
        if (ch >= 48 && ch <= 57 || ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122 || allowed.includes(source[index])) {
          result += source[index];
          continue;
        }
        if (ch >= 55296 && ch <= 56319) ch = 65536 + ((ch & 1023) << 10) + (source.charCodeAt(++index) & 1023);
        if (ch < 128) result += percentByte(ch);
        else if (ch < 2048) result += percentByte(192 | ch >> 6) + percentByte(128 | ch & 63);
        else if (ch < 65536) result += percentByte(224 | ch >> 12) + percentByte(128 | ch >> 6 & 63) + percentByte(128 | ch & 63);
        else result += percentByte(240 | ch >> 18) + percentByte(128 | ch >> 12 & 63) + percentByte(128 | ch >> 6 & 63) + percentByte(128 | ch & 63);
      }
      return result;
    }
    function tagPercentDecode(source) {
      let result = "";
      let index = 0;
      while (index < source.length) {
        if (source.charCodeAt(index) !== 37) {
          result += source[index++];
          continue;
        }
        let ch = parseInt(source.slice(index + 1, index + 3), 16);
        index += 3;
        if (ch >= 192) {
          let remaining = ch < 224 ? 1 : ch < 240 ? 2 : 3;
          ch &= (1 << 6 - remaining) - 1;
          while (remaining-- > 0) {
            ch = ch << 6 | parseInt(source.slice(index + 1, index + 3), 16) & 63;
            index += 3;
          }
        }
        if (ch < 65536) result += String.fromCharCode(ch);
        else {
          ch -= 65536;
          result += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
        }
      }
      return result;
    }
    function tagNameFull(rawTag2, tagHandlers) {
      var _ref, _tagHandlers$handle;
      if (rawTag2.startsWith("!<") && rawTag2.endsWith(">")) return tagPercentDecode(rawTag2.slice(2, -1));
      const handleEnd = rawTag2.indexOf("!", 1);
      const handle = handleEnd === -1 ? "!" : rawTag2.slice(0, handleEnd + 1);
      return tagPercentDecode((_ref = (_tagHandlers$handle = tagHandlers === null || tagHandlers === void 0 ? void 0 : tagHandlers[handle]) !== null && _tagHandlers$handle !== void 0 ? _tagHandlers$handle : DEFAULT_TAG_HANDLERS[handle]) !== null && _ref !== void 0 ? _ref : handle) + tagPercentDecode(rawTag2.slice(handle.length));
    }
    function tagNameShort(fullTag) {
      let tag = fullTag;
      if (tag.charCodeAt(0) === 33) {
        tag = tag.slice(1);
        return `!${tagPercentEncode(tag, true)}`;
      }
      if (tag.slice(0, 18) === "tag:yaml.org,2002:") return `!!${tagPercentEncode(tag.slice(18), true)}`;
      return `!<${tagPercentEncode(tag, false)}>`;
    }
    var NO_RANGE$2 = -1;
    var MERGE_TAG_NAME = "tag:yaml.org,2002:merge";
    var DEFAULT_CONSTRUCTOR_OPTIONS = {
      filename: "",
      schema: CORE_SCHEMA,
      json: false,
      maxTotalMergeKeys: 1e4,
      maxAliases: -1
    };
    function eventPosition$1(event) {
      if ("tagStart" in event && event.tagStart !== NO_RANGE$2) return event.tagStart;
      if ("anchorStart" in event && event.anchorStart !== NO_RANGE$2) return event.anchorStart;
      if ("valueStart" in event && event.valueStart !== NO_RANGE$2) return event.valueStart;
      if ("start" in event) return event.start;
      return 0;
    }
    function throwError$1(state, message) {
      YAMLException.throwAt(state.source, state.position, message, state.filename);
    }
    function finalizeCollection(state, position, tag, carrier) {
      try {
        return tag.finalize(carrier);
      } catch (error) {
        if (error instanceof YAMLException) throw error;
        YAMLException.throwAt(state.source, position, error instanceof Error ? error.message : String(error), state.filename);
      }
    }
    function constructScalar(state, event) {
      const source = getScalarValue(state.source, event);
      const rawTag2 = event.tagStart === NO_RANGE$2 ? "" : state.source.slice(event.tagStart, event.tagEnd);
      const strTag2 = state.schema.defaultScalarTag;
      if (rawTag2 !== "") {
        var _state$schema$lookupM;
        if (rawTag2 === "!") return {
          value: source,
          tag: strTag2
        };
        const tagName = tagNameFull(rawTag2, state.tagHandlers);
        const scalarTag = state.schema.lookupScalarTag(tagName);
        if (scalarTag) {
          const result = scalarTag.resolve(source, true, tagName);
          if (result === NOT_RESOLVED) throwError$1(state, `cannot resolve a node with !<${tagName}> explicit tag`);
          return {
            value: result,
            tag: scalarTag
          };
        }
        const collectionTagDef = (_state$schema$lookupM = state.schema.lookupMappingTag(tagName)) !== null && _state$schema$lookupM !== void 0 ? _state$schema$lookupM : state.schema.lookupSequenceTag(tagName);
        if (collectionTagDef) {
          if (source !== "") throwError$1(state, `cannot resolve a node with !<${tagName}> explicit tag`);
          const carrier = collectionTagDef.create(tagName);
          return {
            value: collectionTagDef.carrierIsResult ? carrier : finalizeCollection(state, state.position, collectionTagDef, carrier),
            tag: collectionTagDef
          };
        }
        throwError$1(state, `unknown scalar tag !<${tagName}>`);
      }
      if (event.style === SCALAR_STYLE.PLAIN) return state.schema.resolveImplicitScalarTag(source);
      return {
        value: strTag2.resolve(source, false, strTag2.tagName),
        tag: strTag2
      };
    }
    function collectionTagName(state, event, defaultTagName) {
      const rawTag2 = event.tagStart === NO_RANGE$2 ? "" : state.source.slice(event.tagStart, event.tagEnd);
      return rawTag2 === "" || rawTag2 === "!" ? defaultTagName : tagNameFull(rawTag2, state.tagHandlers);
    }
    function isMappingTag(tag) {
      return tag.nodeKind === "mapping";
    }
    function chargeMergeWork(state) {
      state.totalMergeKeys++;
      if (state.maxTotalMergeKeys !== -1 && state.totalMergeKeys > state.maxTotalMergeKeys) throwError$1(state, `merge keys exceeded maxTotalMergeKeys (${state.maxTotalMergeKeys})`);
    }
    function mergeKeys(state, frame, source, sourceTag) {
      chargeMergeWork(state);
      for (const sourceKey of sourceTag.keys(source)) {
        var _frame$overridable;
        chargeMergeWork(state);
        if (frame.tag.has(frame.value, sourceKey)) continue;
        const err = frame.tag.addPair(frame.value, sourceKey, sourceTag.get(source, sourceKey));
        if (err) throwError$1(state, err);
        (_frame$overridable = frame.overridable) !== null && _frame$overridable !== void 0 || (frame.overridable = /* @__PURE__ */ new Set());
        frame.overridable.add(sourceKey);
      }
    }
    function mergeSource(state, frame, source, sourceTag) {
      state.position = frame.keyPosition;
      if (isMappingTag(sourceTag)) mergeKeys(state, frame, source, sourceTag);
      else if (sourceTag.nodeKind === "sequence" && Array.isArray(source)) {
        if (source.length > 100) throwError$1(state, "abnormal merge sequence size");
        for (const element of source) {
          const elementTag = state.nodeTags.get(element);
          if (!elementTag) throwError$1(state, "cannot merge mappings; the provided source object is unacceptable");
          mergeKeys(state, frame, element, elementTag);
        }
      } else throwError$1(state, "cannot merge mappings; the provided source object is unacceptable");
    }
    function addMappingValue(state, frame, key, value, tag) {
      var _frame$overridable2, _frame$overridable3;
      state.position = frame.keyPosition;
      if (frame.keyIsMerge) {
        mergeSource(state, frame, value, tag);
        return;
      }
      if (!state.json && frame.tag.has(frame.value, key) && !((_frame$overridable2 = frame.overridable) === null || _frame$overridable2 === void 0 ? void 0 : _frame$overridable2.has(key))) throwError$1(state, "duplicated mapping key");
      const err = frame.tag.addPair(frame.value, key, value);
      if (err) throwError$1(state, err);
      (_frame$overridable3 = frame.overridable) === null || _frame$overridable3 === void 0 || _frame$overridable3.delete(key);
    }
    function addValue(state, value, tag) {
      const frame = state.frames[state.frames.length - 1];
      if (frame.kind === "document") {
        frame.value = value;
        frame.hasValue = true;
      } else if (frame.kind === "sequence") {
        if (isMappingTag(tag)) state.nodeTags.set(value, tag);
        const err = frame.tag.addItem(frame.value, value, frame.index++);
        if (err) throwError$1(state, err);
      } else if (frame.hasKey) {
        const key = frame.key;
        frame.key = void 0;
        frame.hasKey = false;
        addMappingValue(state, frame, key, value, tag);
      } else {
        frame.key = value;
        frame.keyPosition = state.position;
        frame.hasKey = true;
        frame.keyIsMerge = tag.tagName === MERGE_TAG_NAME;
      }
    }
    function storeAnchor(state, event, value, tag, isValueFinal) {
      if (event.anchorStart !== NO_RANGE$2) {
        const anchor = {
          value,
          tag,
          isValueFinal
        };
        state.anchors.set(state.source.slice(event.anchorStart, event.anchorEnd), anchor);
        return anchor;
      }
      return null;
    }
    function constructFromEvents(events, options) {
      const state = _objectSpread2(_objectSpread2(_objectSpread2({}, DEFAULT_CONSTRUCTOR_OPTIONS), options), {}, {
        events,
        documents: [],
        eventIndex: 0,
        position: 0,
        frames: [],
        anchors: /* @__PURE__ */ new Map(),
        nodeTags: /* @__PURE__ */ new Map(),
        tagHandlers: /* @__PURE__ */ Object.create(null),
        totalMergeKeys: 0,
        aliasCount: 0
      });
      while (state.eventIndex < state.events.length) {
        const event = state.events[state.eventIndex++];
        state.position = eventPosition$1(event);
        switch (event.type) {
          case EVENT_ID.DOCUMENT:
            state.anchors = /* @__PURE__ */ new Map();
            state.nodeTags = /* @__PURE__ */ new Map();
            state.aliasCount = 0;
            state.tagHandlers = /* @__PURE__ */ Object.create(null);
            for (const directive of event.directives) if (directive.kind === "tag") state.tagHandlers[directive.handle] = directive.prefix;
            state.frames.push({
              kind: "document",
              position: state.position,
              value: void 0,
              hasValue: false
            });
            break;
          case EVENT_ID.SCALAR: {
            const { value, tag } = constructScalar(state, event);
            storeAnchor(state, event, value, tag, true);
            addValue(state, value, tag);
            break;
          }
          case EVENT_ID.SEQUENCE: {
            const tagName = collectionTagName(state, event, "tag:yaml.org,2002:seq");
            const tag = state.schema.lookupSequenceTag(tagName);
            if (!tag) throwError$1(state, `unknown sequence tag !<${tagName}>`);
            const value = tag.create(tagName);
            const anchor = storeAnchor(state, event, value, tag, tag.carrierIsResult);
            state.frames.push({
              kind: "sequence",
              position: state.position,
              value,
              tag,
              anchor,
              index: 0
            });
            break;
          }
          case EVENT_ID.MAPPING: {
            const tagName = collectionTagName(state, event, "tag:yaml.org,2002:map");
            const tag = state.schema.lookupMappingTag(tagName);
            if (!tag) throwError$1(state, `unknown mapping tag !<${tagName}>`);
            const value = tag.create(tagName);
            const anchor = storeAnchor(state, event, value, tag, tag.carrierIsResult);
            state.frames.push({
              kind: "mapping",
              position: state.position,
              value,
              tag,
              anchor,
              key: void 0,
              keyPosition: state.position,
              hasKey: false,
              keyIsMerge: false,
              overridable: null
            });
            break;
          }
          case EVENT_ID.ALIAS: {
            if (state.maxAliases !== -1 && ++state.aliasCount > state.maxAliases) throwError$1(state, `aliases exceeded maxAliases (${state.maxAliases})`);
            const name = state.source.slice(event.anchorStart, event.anchorEnd);
            const anchor = state.anchors.get(name);
            if (!anchor) throwError$1(state, `unidentified alias "${name}"`);
            if (!anchor.isValueFinal) throwError$1(state, `recursive alias "${name}" is not supported for tag ${anchor.tag.tagName} because it uses finalize()`);
            addValue(state, anchor.value, anchor.tag);
            break;
          }
          case EVENT_ID.POP: {
            const frame = state.frames.pop();
            if (frame.kind === "mapping" && frame.hasKey) {
              state.position = frame.keyPosition;
              throwError$1(state, "incomplete mapping pair in event stream");
            }
            if (frame.kind === "document") state.documents.push(frame.value);
            else {
              const value = frame.tag.carrierIsResult ? frame.value : finalizeCollection(state, frame.position, frame.tag, frame.value);
              if (frame.anchor) {
                frame.anchor.value = value;
                frame.anchor.isValueFinal = true;
              }
              addValue(state, value, frame.tag);
            }
            break;
          }
        }
      }
      return state.documents;
    }
    var NO_RANGE$1 = -1;
    var HAS_OWN = Object.prototype.hasOwnProperty;
    var CONTEXT_FLOW_IN = 1;
    var CONTEXT_FLOW_OUT = 2;
    var CONTEXT_BLOCK_IN = 3;
    var CONTEXT_BLOCK_OUT = 4;
    var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    var PATTERN_FLOW_INDICATORS = /[,\[\]{}]/;
    var PATTERN_TAG_HANDLE = /^(?:!|!!|![0-9A-Za-z-]+!)$/;
    var NS_URI_CHAR = String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`;
    var NS_TAG_CHAR = String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`;
    var PATTERN_TAG_URI = new RegExp(`^(?:${NS_URI_CHAR})*$`);
    var PATTERN_TAG_SUFFIX = new RegExp(`^(?:${NS_TAG_CHAR})+$`);
    var PATTERN_TAG_PREFIX = new RegExp(`^(?:!(?:${NS_URI_CHAR})*|${NS_TAG_CHAR}(?:${NS_URI_CHAR})*)$`);
    var DEFAULT_PARSER_OPTIONS = {
      filename: "",
      maxDepth: 100
    };
    function addDocumentEvent(state, explicitStart, explicitEnd) {
      state.events.push({
        type: EVENT_ID.DOCUMENT,
        explicitStart,
        explicitEnd,
        directives: state.directives
      });
    }
    function addSequenceEvent(state, start, anchorStart, anchorEnd, tagStart, tagEnd, style) {
      state.events.push({
        type: EVENT_ID.SEQUENCE,
        start,
        anchorStart,
        anchorEnd,
        tagStart,
        tagEnd,
        style
      });
    }
    function addMappingEvent(state, start, anchorStart, anchorEnd, tagStart, tagEnd, style) {
      state.events.push({
        type: EVENT_ID.MAPPING,
        start,
        anchorStart,
        anchorEnd,
        tagStart,
        tagEnd,
        style
      });
    }
    function insertFlowPairMappingEvent(state, snapshot) {
      state.events.splice(snapshot.eventsLength, 0, {
        type: EVENT_ID.MAPPING,
        start: snapshot.position,
        anchorStart: NO_RANGE$1,
        anchorEnd: NO_RANGE$1,
        tagStart: NO_RANGE$1,
        tagEnd: NO_RANGE$1,
        style: COLLECTION_STYLE.FLOW
      });
    }
    function addScalarEvent(state, valueStart, valueEnd, anchorStart, anchorEnd, tagStart, tagEnd, style, chomping = CHOMPING_MODE.CLIP, indent = -1, fast = false) {
      state.events.push({
        type: EVENT_ID.SCALAR,
        valueStart,
        valueEnd,
        anchorStart,
        anchorEnd,
        tagStart,
        tagEnd,
        style,
        chomping,
        indent,
        fast
      });
    }
    function addAliasEvent(state, anchorStart, anchorEnd) {
      state.events.push({
        type: EVENT_ID.ALIAS,
        anchorStart,
        anchorEnd
      });
    }
    function addPopEvent(state) {
      state.events.push({ type: EVENT_ID.POP });
    }
    function addEmptyScalarEvent(state) {
      addScalarEvent(state, NO_RANGE$1, NO_RANGE$1, NO_RANGE$1, NO_RANGE$1, NO_RANGE$1, NO_RANGE$1, SCALAR_STYLE.PLAIN);
    }
    function emptyProperties() {
      return {
        anchorStart: NO_RANGE$1,
        anchorEnd: NO_RANGE$1,
        tagStart: NO_RANGE$1,
        tagEnd: NO_RANGE$1
      };
    }
    function snapshotState(state) {
      return {
        position: state.position,
        line: state.line,
        lineStart: state.lineStart,
        lineIndent: state.lineIndent,
        firstTabInLine: state.firstTabInLine,
        eventsLength: state.events.length
      };
    }
    function restoreState(state, snapshot) {
      state.position = snapshot.position;
      state.line = snapshot.line;
      state.lineStart = snapshot.lineStart;
      state.lineIndent = snapshot.lineIndent;
      state.firstTabInLine = snapshot.firstTabInLine;
      state.events.length = snapshot.eventsLength;
    }
    function throwError(state, message) {
      YAMLException.throwAt(state.input.slice(0, state.length), state.position, message, state.filename);
    }
    function isEol(c) {
      return c === 10 || c === 13;
    }
    function isWhiteSpace(c) {
      return c === 9 || c === 32;
    }
    function isWsOrEol(c) {
      return isWhiteSpace(c) || isEol(c);
    }
    function isWsOrEolOrEnd(c) {
      return c === 0 || isWsOrEol(c);
    }
    function isFlowIndicator(c) {
      return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
    }
    function fromDecimalCode(c) {
      return c >= 48 && c <= 57 ? c - 48 : -1;
    }
    function fromHexCode(c) {
      if (c >= 48 && c <= 57) return c - 48;
      const lc = c | 32;
      if (lc >= 97 && lc <= 102) return lc - 97 + 10;
      return -1;
    }
    function escapedHexLen(c) {
      if (c === 120) return 2;
      if (c === 117) return 4;
      if (c === 85) return 8;
      return 0;
    }
    function isSimpleEscape(c) {
      return c === 48 || c === 97 || c === 98 || c === 116 || c === 9 || c === 110 || c === 118 || c === 102 || c === 114 || c === 101 || c === 32 || c === 34 || c === 47 || c === 92 || c === 78 || c === 95 || c === 76 || c === 80;
    }
    function consumeLineBreak(state) {
      if (state.input.charCodeAt(state.position) === 10) state.position++;
      else {
        state.position++;
        if (state.input.charCodeAt(state.position) === 10) state.position++;
      }
      state.line++;
      state.lineStart = state.position;
      state.lineIndent = 0;
      state.firstTabInLine = -1;
    }
    function skipSeparationSpace(state, allowComments) {
      let lineBreaks = 0;
      let ch = state.input.charCodeAt(state.position);
      let hasSeparation = state.position === state.lineStart || isWsOrEol(state.input.charCodeAt(state.position - 1));
      while (ch !== 0) {
        while (isWhiteSpace(ch)) {
          hasSeparation = true;
          if (ch === 9 && state.firstTabInLine === -1) state.firstTabInLine = state.position;
          ch = state.input.charCodeAt(++state.position);
        }
        if (allowComments && hasSeparation && ch === 35) do
          ch = state.input.charCodeAt(++state.position);
        while (!isEol(ch) && ch !== 0);
        if (!isEol(ch)) break;
        consumeLineBreak(state);
        lineBreaks++;
        hasSeparation = true;
        ch = state.input.charCodeAt(state.position);
        while (ch === 32) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
      }
      return lineBreaks;
    }
    function testDocumentSeparator(state, position = state.position) {
      const ch = state.input.charCodeAt(position);
      if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(position + 1) && ch === state.input.charCodeAt(position + 2)) {
        const following = state.input.charCodeAt(position + 3);
        return following === 0 || isWsOrEol(following);
      }
      return false;
    }
    function skipByteOrderMark(state) {
      if (state.position === state.lineStart && state.input.charCodeAt(state.position) === 65279) {
        state.position++;
        state.lineStart = state.position;
      }
    }
    function testDocumentBoundary(state) {
      if (state.position !== state.lineStart) return false;
      if (testDocumentSeparator(state)) return true;
      if (state.input.charCodeAt(state.position) !== 65279) return false;
      const snapshot = snapshotState(state);
      skipByteOrderMark(state);
      skipSeparationSpace(state, true);
      const ch = state.input.charCodeAt(state.position);
      const result = state.position === state.lineStart && (ch === 37 || ch === 45 && testDocumentSeparator(state));
      restoreState(state, snapshot);
      return result;
    }
    function skipUntilLineEnd(state) {
      let ch = state.input.charCodeAt(state.position);
      while (ch !== 0 && !isEol(ch)) ch = state.input.charCodeAt(++state.position);
    }
    function checkPrintable(state, start, end) {
      const match = PATTERN_NON_PRINTABLE.exec(state.input.slice(start, end));
      if (match !== null) {
        state.position = start + match.index + match[0].length - 1;
        throwError(state, "the stream contains non-printable characters");
      }
    }
    function readTagProperty(state, props, inFlow) {
      if (state.input.charCodeAt(state.position) !== 33) return false;
      if (props.tagStart !== NO_RANGE$1) throwError(state, "duplication of a tag property");
      const start = state.position;
      let isVerbatim = false;
      let isNamed = false;
      let tagHandle = "!";
      let ch = state.input.charCodeAt(++state.position);
      if (ch === 60) {
        isVerbatim = true;
        ch = state.input.charCodeAt(++state.position);
      } else if (ch === 33) {
        isNamed = true;
        tagHandle = "!!";
        ch = state.input.charCodeAt(++state.position);
      }
      let suffixStart = state.position;
      let tagName;
      if (isVerbatim) {
        while (ch !== 0 && ch !== 62) ch = state.input.charCodeAt(++state.position);
        if (ch !== 62) throwError(state, "unexpected end of the stream within a verbatim tag");
        tagName = state.input.slice(suffixStart, state.position);
        state.position++;
      } else {
        while (ch !== 0 && !isWsOrEol(ch) && !(inFlow && isFlowIndicator(ch))) {
          if (ch === 33) {
            if (!isNamed) {
              tagHandle = state.input.slice(suffixStart - 1, state.position + 1);
              if (!PATTERN_TAG_HANDLE.test(tagHandle)) throwError(state, "named tag handle cannot contain such characters");
              isNamed = true;
              suffixStart = state.position + 1;
            } else throwError(state, "tag suffix cannot contain exclamation marks");
          }
          ch = state.input.charCodeAt(++state.position);
        }
        tagName = state.input.slice(suffixStart, state.position);
        if (PATTERN_FLOW_INDICATORS.test(tagName)) throwError(state, "tag suffix cannot contain flow indicator characters");
      }
      if (tagName && !(isVerbatim ? PATTERN_TAG_URI.test(tagName) : PATTERN_TAG_SUFFIX.test(tagName))) throwError(state, `tag name cannot contain such characters: ${tagName}`);
      if (!isVerbatim && tagHandle !== "!" && tagHandle !== "!!" && !HAS_OWN.call(state.tagHandlers, tagHandle)) throwError(state, `undeclared tag handle "${tagHandle}"`);
      props.tagStart = start;
      props.tagEnd = state.position;
      return true;
    }
    function readAnchorProperty(state, props) {
      if (state.input.charCodeAt(state.position) !== 38) return false;
      if (props.anchorStart !== NO_RANGE$1) throwError(state, "duplication of an anchor property");
      state.position++;
      const start = state.position;
      while (state.input.charCodeAt(state.position) !== 0 && !isWsOrEol(state.input.charCodeAt(state.position)) && !isFlowIndicator(state.input.charCodeAt(state.position))) state.position++;
      if (state.position === start) throwError(state, "name of an anchor node must contain at least one character");
      props.anchorStart = start;
      props.anchorEnd = state.position;
      return true;
    }
    function readAlias(state, props) {
      if (state.input.charCodeAt(state.position) !== 42) return false;
      if (props.anchorStart !== NO_RANGE$1 || props.tagStart !== NO_RANGE$1) throwError(state, "alias node should not have any properties");
      state.position++;
      const start = state.position;
      while (state.input.charCodeAt(state.position) !== 0 && !isWsOrEol(state.input.charCodeAt(state.position)) && !isFlowIndicator(state.input.charCodeAt(state.position))) state.position++;
      if (state.position === start) throwError(state, "name of an alias node must contain at least one character");
      addAliasEvent(state, start, state.position);
      return true;
    }
    function readFlowScalarBreak(state, nodeIndent) {
      skipSeparationSpace(state, false);
      if (state.lineIndent < nodeIndent) throwError(state, "deficient indentation");
    }
    function readSingleQuotedScalar(state, nodeIndent, props) {
      if (state.input.charCodeAt(state.position) !== 39) return false;
      state.position++;
      const start = state.position;
      let simple = true;
      while (state.input.charCodeAt(state.position) !== 0) {
        const ch = state.input.charCodeAt(state.position);
        if (ch === 39) {
          if (state.input.charCodeAt(state.position + 1) === 39) {
            simple = false;
            state.position += 2;
            continue;
          }
          const end = state.position;
          state.position++;
          addScalarEvent(state, start, end, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, SCALAR_STYLE.SINGLE_QUOTED, CHOMPING_MODE.CLIP, -1, simple);
          return true;
        }
        if (isEol(ch)) {
          simple = false;
          readFlowScalarBreak(state, nodeIndent);
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) throwError(state, "unexpected end of the document within a single quoted scalar");
        else if (ch !== 9 && ch < 32) throwError(state, "expected valid JSON character");
        else state.position++;
      }
      throwError(state, "unexpected end of the stream within a single quoted scalar");
    }
    function readDoubleQuotedScalar(state, nodeIndent, props) {
      if (state.input.charCodeAt(state.position) !== 34) return false;
      state.position++;
      const start = state.position;
      let simple = true;
      while (state.input.charCodeAt(state.position) !== 0) {
        const ch = state.input.charCodeAt(state.position);
        if (ch === 34) {
          const end = state.position;
          state.position++;
          addScalarEvent(state, start, end, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, SCALAR_STYLE.DOUBLE_QUOTED, CHOMPING_MODE.CLIP, -1, simple);
          return true;
        }
        if (ch === 92) {
          simple = false;
          const escaped = state.input.charCodeAt(++state.position);
          if (isEol(escaped)) readFlowScalarBreak(state, nodeIndent);
          else if (isSimpleEscape(escaped)) state.position++;
          else {
            let hexLength = escapedHexLen(escaped);
            if (hexLength === 0) throwError(state, "unknown escape sequence");
            while (hexLength-- > 0) {
              state.position++;
              if (fromHexCode(state.input.charCodeAt(state.position)) < 0) throwError(state, "expected hexadecimal character");
            }
            state.position++;
          }
        } else if (isEol(ch)) {
          simple = false;
          readFlowScalarBreak(state, nodeIndent);
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) throwError(state, "unexpected end of the document within a double quoted scalar");
        else if (ch !== 9 && ch < 32) throwError(state, "expected valid JSON character");
        else state.position++;
      }
      throwError(state, "unexpected end of the stream within a double quoted scalar");
    }
    function readBlockScalar(state, parentIndent, props) {
      const ch = state.input.charCodeAt(state.position);
      let chomping = CHOMPING_MODE.CLIP;
      let indent = -1;
      let detectedIndent = false;
      if (ch !== 124 && ch !== 62) return false;
      const style = ch === 124 ? SCALAR_STYLE.LITERAL_BLOCK : SCALAR_STYLE.FOLDED_BLOCK;
      state.position++;
      while (state.input.charCodeAt(state.position) !== 0) {
        const current = state.input.charCodeAt(state.position);
        const digit = fromDecimalCode(current);
        if (current === 43 || current === 45) {
          if (chomping !== CHOMPING_MODE.CLIP) throwError(state, "repeat of a chomping mode identifier");
          chomping = current === 43 ? CHOMPING_MODE.KEEP : CHOMPING_MODE.STRIP;
          state.position++;
        } else if (digit >= 0) {
          if (digit === 0) throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
          if (detectedIndent) throwError(state, "repeat of an indentation width identifier");
          indent = parentIndent + digit - 1;
          detectedIndent = true;
          state.position++;
        } else break;
      }
      let hadWhitespace = false;
      while (isWhiteSpace(state.input.charCodeAt(state.position))) {
        hadWhitespace = true;
        state.position++;
      }
      if (hadWhitespace && state.input.charCodeAt(state.position) === 35) skipUntilLineEnd(state);
      if (isEol(state.input.charCodeAt(state.position))) consumeLineBreak(state);
      else if (state.input.charCodeAt(state.position) !== 0) throwError(state, "a line break is expected");
      let contentIndent = detectedIndent ? indent : -1;
      let maxLeadingIndent = 0;
      const valueStart = state.position;
      let valueEnd = state.position;
      while (state.input.charCodeAt(state.position) !== 0) {
        const linePosition = state.position;
        let column = 0;
        while (state.input.charCodeAt(linePosition + column) === 32) column++;
        const first = state.input.charCodeAt(linePosition + column);
        if (first === 0) {
          if (contentIndent >= 0) {
            if (column > contentIndent) valueEnd = linePosition + column;
          } else if (column > 0) valueEnd = linePosition + column;
          break;
        }
        if (testDocumentBoundary(state)) break;
        if (!detectedIndent && contentIndent === -1 && isEol(first)) maxLeadingIndent = Math.max(maxLeadingIndent, column);
        if (!detectedIndent && contentIndent === -1 && !isEol(first)) {
          if (first === 9 && column < parentIndent) {
            state.position = linePosition + column;
            throwError(state, "tab characters must not be used in indentation");
          }
          if (column >= parentIndent && column < maxLeadingIndent) {
            state.position = linePosition + column;
            throwError(state, "bad indentation of a mapping entry");
          }
        }
        if (contentIndent === -1 && first !== 0 && !isEol(first) && column < parentIndent) {
          state.lineIndent = column;
          state.position = linePosition + column;
          break;
        }
        if (!detectedIndent && first !== 0 && !isEol(first) && contentIndent === -1) contentIndent = column;
        const requiredIndent = contentIndent === -1 ? parentIndent + 1 : contentIndent;
        if (first !== 0 && !isEol(first) && column < requiredIndent) {
          state.lineIndent = column;
          state.position = linePosition + column;
          break;
        }
        skipUntilLineEnd(state);
        valueEnd = state.position;
        if (isEol(state.input.charCodeAt(state.position))) {
          consumeLineBreak(state);
          valueEnd = state.position;
        }
      }
      checkPrintable(state, valueStart, valueEnd);
      addScalarEvent(state, valueStart, valueEnd, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, style, chomping, contentIndent);
      return true;
    }
    function canStartPlainScalar(state, nodeContext) {
      const ch = state.input.charCodeAt(state.position);
      const inFlow = nodeContext === CONTEXT_FLOW_IN;
      if (ch === 0 || isWsOrEol(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96 || isFlowIndicator(ch)) return false;
      if (ch === 63 || ch === 45) {
        const following = state.input.charCodeAt(state.position + 1);
        if (isWsOrEolOrEnd(following) || inFlow && isFlowIndicator(following)) return false;
      }
      return true;
    }
    function readPlainScalar(state, nodeIndent, nodeContext, props) {
      if (!canStartPlainScalar(state, nodeContext)) return false;
      const start = state.position;
      let end = state.position;
      let ch = state.input.charCodeAt(state.position);
      const inFlow = nodeContext === CONTEXT_FLOW_IN;
      let multiline = false;
      while (ch !== 0) {
        if (testDocumentBoundary(state)) break;
        if (ch === 58) {
          const following = state.input.charCodeAt(state.position + 1);
          if (isWsOrEolOrEnd(following) || inFlow && isFlowIndicator(following)) break;
        } else if (ch === 35) {
          if (isWsOrEol(state.input.charCodeAt(state.position - 1))) break;
        } else if (inFlow && isFlowIndicator(ch)) break;
        else if (isEol(ch)) {
          const savedPosition = state.position;
          const savedLine = state.line;
          const savedLineStart = state.lineStart;
          const savedLineIndent = state.lineIndent;
          skipSeparationSpace(state, false);
          if (state.lineIndent >= nodeIndent) {
            multiline = true;
            ch = state.input.charCodeAt(state.position);
            continue;
          }
          state.position = savedPosition;
          state.line = savedLine;
          state.lineStart = savedLineStart;
          state.lineIndent = savedLineIndent;
          break;
        }
        if (!isWhiteSpace(ch)) end = state.position + 1;
        ch = state.input.charCodeAt(++state.position);
      }
      if (end === start) return false;
      checkPrintable(state, start, end);
      addScalarEvent(state, start, end, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, SCALAR_STYLE.PLAIN, CHOMPING_MODE.CLIP, -1, !multiline);
      return true;
    }
    function skipFlowSeparationSpace(state, nodeIndent) {
      const startLine = state.line;
      skipSeparationSpace(state, true);
      if (state.line > startLine && state.lineIndent < nodeIndent || state.firstTabInLine !== -1 && state.lineIndent < nodeIndent) throwError(state, "deficient indentation");
    }
    function readFlowCollection(state, nodeIndent, props) {
      const ch = state.input.charCodeAt(state.position);
      const isMapping = ch === 123;
      const start = state.position;
      let readNext = true;
      if (ch !== 91 && ch !== 123) return false;
      const terminator = isMapping ? 125 : 93;
      if (isMapping) addMappingEvent(state, start, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, COLLECTION_STYLE.FLOW);
      else addSequenceEvent(state, start, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, COLLECTION_STYLE.FLOW);
      state.position++;
      while (state.input.charCodeAt(state.position) !== 0) {
        skipFlowSeparationSpace(state, nodeIndent);
        let ch2 = state.input.charCodeAt(state.position);
        if (ch2 === terminator) {
          state.position++;
          addPopEvent(state);
          return true;
        } else if (!readNext) throwError(state, "missed comma between flow collection entries");
        else if (ch2 === 44) throwError(state, "expected the node content, but found ','");
        let isPair = false;
        let isExplicitPair = false;
        if (ch2 === 63 && isWsOrEol(state.input.charCodeAt(state.position + 1))) {
          isPair = isExplicitPair = true;
          state.position += 1;
          skipFlowSeparationSpace(state, nodeIndent);
        }
        const entryLine = state.line;
        const entryStart = snapshotState(state);
        const keyWasRead = parseNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        skipFlowSeparationSpace(state, nodeIndent);
        ch2 = state.input.charCodeAt(state.position);
        if ((isMapping || isExplicitPair || state.line === entryLine) && ch2 === 58) {
          isPair = true;
          state.position++;
          skipFlowSeparationSpace(state, nodeIndent);
          if (!isMapping) {
            insertFlowPairMappingEvent(state, entryStart);
            if (!keyWasRead) addEmptyScalarEvent(state);
          } else if (!keyWasRead) addEmptyScalarEvent(state);
          if (!parseNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true)) addEmptyScalarEvent(state);
          skipFlowSeparationSpace(state, nodeIndent);
          if (!isMapping) addPopEvent(state);
        } else if (isMapping && isPair) {
          if (!keyWasRead) addEmptyScalarEvent(state);
          addEmptyScalarEvent(state);
        } else if (isMapping) addEmptyScalarEvent(state);
        else if (isPair) {
          insertFlowPairMappingEvent(state, entryStart);
          if (!keyWasRead) addEmptyScalarEvent(state);
          addEmptyScalarEvent(state);
          addPopEvent(state);
        }
        ch2 = state.input.charCodeAt(state.position);
        if (ch2 === 44) {
          readNext = true;
          state.position++;
        } else readNext = false;
      }
      throwError(state, "unexpected end of the stream within a flow collection");
    }
    function readBlockSequence(state, nodeIndent, props) {
      if (state.firstTabInLine !== -1 || state.input.charCodeAt(state.position) !== 45 || !isWsOrEolOrEnd(state.input.charCodeAt(state.position + 1))) return false;
      addSequenceEvent(state, state.position, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, COLLECTION_STYLE.BLOCK);
      while (state.input.charCodeAt(state.position) === 45 && isWsOrEolOrEnd(state.input.charCodeAt(state.position + 1))) {
        if (state.firstTabInLine !== -1) {
          state.position = state.firstTabInLine;
          throwError(state, "tab characters must not be used in indentation");
        }
        const entryLine = state.line;
        state.position++;
        const hadBreak = skipSeparationSpace(state, true) > 0;
        if (state.firstTabInLine !== -1 && state.input.charCodeAt(state.position) === 45 && isWsOrEolOrEnd(state.input.charCodeAt(state.position + 1))) throwError(state, "bad indentation of a sequence entry");
        if (hadBreak && state.lineIndent <= nodeIndent) addEmptyScalarEvent(state);
        else parseNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
        skipSeparationSpace(state, true);
        if (state.lineIndent < nodeIndent || state.position >= state.length) break;
        if (state.lineIndent > nodeIndent) throwError(state, "bad indentation of a sequence entry");
        if (state.line === entryLine && state.input.charCodeAt(state.position) === 45 && isWsOrEolOrEnd(state.input.charCodeAt(state.position + 1))) throwError(state, "bad indentation of a sequence entry");
      }
      addPopEvent(state);
      return true;
    }
    function readBlockMapping(state, nodeIndent, flowIndent, props) {
      let atExplicitKey = false;
      let detected = false;
      let mappingOpened = false;
      let pendingExplicitKey = false;
      if (state.firstTabInLine !== -1) return false;
      let ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        if (!atExplicitKey && state.firstTabInLine !== -1) {
          state.position = state.firstTabInLine;
          throwError(state, "tab characters must not be used in indentation");
        }
        const following = state.input.charCodeAt(state.position + 1);
        const entryLine = state.line;
        if ((ch === 63 || ch === 58) && isWsOrEolOrEnd(following)) {
          if (!mappingOpened) {
            addMappingEvent(state, state.position, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, COLLECTION_STYLE.BLOCK);
            mappingOpened = true;
          }
          if (ch === 63) {
            if (atExplicitKey) addEmptyScalarEvent(state);
            detected = true;
            atExplicitKey = true;
          } else if (atExplicitKey) atExplicitKey = false;
          else {
            addEmptyScalarEvent(state);
            detected = true;
            atExplicitKey = false;
          }
          state.position += 1;
          pendingExplicitKey = true;
        } else {
          if (atExplicitKey) {
            addEmptyScalarEvent(state);
            atExplicitKey = false;
          }
          const beforeKey = snapshotState(state);
          if (!parseNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) break;
          if (state.line === entryLine) {
            ch = state.input.charCodeAt(state.position);
            while (isWhiteSpace(ch)) ch = state.input.charCodeAt(++state.position);
            if (ch === 58) {
              ch = state.input.charCodeAt(++state.position);
              if (!isWsOrEolOrEnd(ch)) throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
              if (!mappingOpened) {
                state.events.splice(beforeKey.eventsLength, 0, {
                  type: EVENT_ID.MAPPING,
                  start: beforeKey.position,
                  anchorStart: props.anchorStart,
                  anchorEnd: props.anchorEnd,
                  tagStart: props.tagStart,
                  tagEnd: props.tagEnd,
                  style: COLLECTION_STYLE.BLOCK
                });
                mappingOpened = true;
              }
              detected = true;
              atExplicitKey = false;
              pendingExplicitKey = false;
            } else if (detected) throwError(state, "expected ':' after a mapping key");
            else {
              if (props.anchorStart !== NO_RANGE$1 || props.tagStart !== NO_RANGE$1) {
                restoreState(state, beforeKey);
                return false;
              }
              return true;
            }
          } else if (detected) throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
          else {
            if (props.anchorStart !== NO_RANGE$1 || props.tagStart !== NO_RANGE$1) {
              restoreState(state, beforeKey);
              return false;
            }
            return true;
          }
        }
        if (parseNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, pendingExplicitKey)) pendingExplicitKey = false;
        if (!atExplicitKey) {
          if (pendingExplicitKey) {
            addEmptyScalarEvent(state);
            pendingExplicitKey = false;
          }
        }
        skipSeparationSpace(state, true);
        ch = state.input.charCodeAt(state.position);
        if ((state.line === entryLine || state.lineIndent > nodeIndent) && ch !== 0) throwError(state, "bad indentation of a mapping entry");
        else if (state.lineIndent < nodeIndent) break;
      }
      if (!detected) return false;
      if (atExplicitKey) addEmptyScalarEvent(state);
      if (mappingOpened) addPopEvent(state);
      return true;
    }
    function parseNode(state, parentIndent, nodeContext, allowToSeek, allowCompact, allowPropertyMapping = true) {
      if (state.depth >= state.maxDepth) throwError(state, `nesting exceeded maxDepth (${state.maxDepth})`);
      state.depth++;
      let indentStatus = 1;
      let atNewLine = false;
      let hasContent = false;
      let propertyStart = null;
      const props = emptyProperties();
      let allowBlockScalars = nodeContext === CONTEXT_BLOCK_OUT || nodeContext === CONTEXT_BLOCK_IN;
      let allowBlockCollections = allowBlockScalars;
      const allowBlockStyles = allowBlockScalars;
      if (allowToSeek && skipSeparationSpace(state, true)) {
        atNewLine = true;
        if (state.lineIndent > parentIndent) indentStatus = 1;
        else if (state.lineIndent === parentIndent) indentStatus = 0;
        else indentStatus = -1;
      }
      if (indentStatus === 1) while (true) {
        const ch = state.input.charCodeAt(state.position);
        const propertyState = snapshotState(state);
        if (atNewLine && indentStatus !== 1 && (ch === 33 || ch === 38)) break;
        if (atNewLine && allowBlockStyles && (props.tagStart !== NO_RANGE$1 || props.anchorStart !== NO_RANGE$1) && (ch === 33 || ch === 38)) {
          var _state$events$fallbac;
          const fallbackState = snapshotState(state);
          const flowIndent = parentIndent + 1;
          if (readBlockMapping(state, state.position - state.lineStart, flowIndent, props) && ((_state$events$fallbac = state.events[fallbackState.eventsLength]) === null || _state$events$fallbac === void 0 ? void 0 : _state$events$fallbac.type) === EVENT_ID.MAPPING) {
            state.depth--;
            return true;
          }
          restoreState(state, fallbackState);
        }
        if (atNewLine && (ch === 33 && props.tagStart !== NO_RANGE$1 || ch === 38 && props.anchorStart !== NO_RANGE$1)) break;
        if (!readTagProperty(state, props, nodeContext === CONTEXT_FLOW_IN) && !readAnchorProperty(state, props)) break;
        if (propertyStart === null) propertyStart = propertyState;
        if (skipSeparationSpace(state, true)) {
          atNewLine = true;
          allowBlockCollections = allowBlockStyles;
          if (state.lineIndent > parentIndent) indentStatus = 1;
          else if (state.lineIndent === parentIndent) indentStatus = 0;
          else indentStatus = -1;
        } else allowBlockCollections = false;
      }
      if (allowBlockCollections) allowBlockCollections = atNewLine || allowCompact;
      if (indentStatus === 1 || nodeContext === CONTEXT_BLOCK_OUT) {
        const flowIndent = nodeContext === CONTEXT_FLOW_IN || nodeContext === CONTEXT_FLOW_OUT ? parentIndent : parentIndent + 1;
        const blockIndent = state.position - state.lineStart;
        if (indentStatus === 1) {
          if (allowBlockCollections && (readBlockSequence(state, blockIndent, props) || readBlockMapping(state, blockIndent, flowIndent, props)) || readFlowCollection(state, flowIndent, props)) hasContent = true;
          else {
            const ch = state.input.charCodeAt(state.position);
            if (propertyStart !== null && allowPropertyMapping && allowBlockStyles && !allowBlockCollections && ch !== 124 && ch !== 62) {
              var _state$events$fallbac2;
              const fallbackState = snapshotState(state);
              const propertyIndent = propertyStart.position - propertyStart.lineStart;
              restoreState(state, propertyStart);
              if (readBlockMapping(state, propertyIndent, flowIndent, emptyProperties()) && ((_state$events$fallbac2 = state.events[fallbackState.eventsLength]) === null || _state$events$fallbac2 === void 0 ? void 0 : _state$events$fallbac2.type) === EVENT_ID.MAPPING) hasContent = true;
              else restoreState(state, fallbackState);
            }
            if (!hasContent && (allowBlockScalars && readBlockScalar(state, flowIndent, props) || readSingleQuotedScalar(state, flowIndent, props) || readDoubleQuotedScalar(state, flowIndent, props) || readAlias(state, props) || readPlainScalar(state, flowIndent, nodeContext, props))) hasContent = true;
          }
        } else if (indentStatus === 0) hasContent = allowBlockCollections && readBlockSequence(state, blockIndent, props);
      }
      allowBlockScalars = allowBlockScalars && !hasContent;
      if (!hasContent && (props.anchorStart !== NO_RANGE$1 || props.tagStart !== NO_RANGE$1 || allowBlockScalars)) {
        addScalarEvent(state, NO_RANGE$1, NO_RANGE$1, props.anchorStart, props.anchorEnd, props.tagStart, props.tagEnd, SCALAR_STYLE.PLAIN);
        hasContent = true;
      }
      state.depth--;
      return hasContent || props.anchorStart !== NO_RANGE$1 || props.tagStart !== NO_RANGE$1;
    }
    function readDirective(state) {
      if (state.lineIndent > 0 || state.input.charCodeAt(state.position) !== 37) return false;
      state.position++;
      const nameStart = state.position;
      while (state.input.charCodeAt(state.position) !== 0 && !isWsOrEol(state.input.charCodeAt(state.position))) state.position++;
      const name = state.input.slice(nameStart, state.position);
      const args = [];
      if (name.length === 0) throwError(state, "directive name must not be less than one character in length");
      while (state.input.charCodeAt(state.position) !== 0 && !isEol(state.input.charCodeAt(state.position))) {
        while (isWhiteSpace(state.input.charCodeAt(state.position))) state.position++;
        if (state.input.charCodeAt(state.position) === 35 || isEol(state.input.charCodeAt(state.position)) || state.input.charCodeAt(state.position) === 0) break;
        const start = state.position;
        while (state.input.charCodeAt(state.position) !== 0 && !isWsOrEol(state.input.charCodeAt(state.position))) state.position++;
        args.push(state.input.slice(start, state.position));
      }
      if (isEol(state.input.charCodeAt(state.position))) consumeLineBreak(state);
      if (name === "YAML") {
        if (state.directives.some((directive) => directive.kind === "yaml")) throwError(state, "duplication of %YAML directive");
        if (args.length !== 1) throwError(state, "YAML directive accepts exactly one argument");
        const match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
        if (match === null) throwError(state, "ill-formed argument of the YAML directive");
        if (parseInt(match[1], 10) !== 1) throwError(state, "unacceptable YAML version of the document");
        state.directives.push({
          kind: "yaml",
          version: args[0]
        });
      } else if (name === "TAG") {
        if (args.length !== 2) throwError(state, "TAG directive accepts exactly two arguments");
        const [handle, prefix] = args;
        if (!PATTERN_TAG_HANDLE.test(handle)) throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
        if (HAS_OWN.call(state.tagHandlers, handle)) throwError(state, `there is a previously declared suffix for "${handle}" tag handle`);
        if (!PATTERN_TAG_PREFIX.test(prefix)) throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
        state.tagHandlers[handle] = prefix;
        state.directives.push({
          kind: "tag",
          handle,
          prefix
        });
      }
      return true;
    }
    function readDocument(state) {
      state.directives = [];
      state.tagHandlers = /* @__PURE__ */ Object.create(null);
      let hasDirectives = false;
      skipSeparationSpace(state, true);
      while (readDirective(state)) {
        hasDirectives = true;
        skipSeparationSpace(state, true);
      }
      let explicitStart = false;
      let explicitEnd = false;
      let allowCompact = true;
      if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45 && isWsOrEolOrEnd(state.input.charCodeAt(state.position + 3))) {
        explicitStart = true;
        const markerLine = state.line;
        state.position += 3;
        skipSeparationSpace(state, true);
        allowCompact = state.line > markerLine;
      } else if (hasDirectives) throwError(state, "directives end mark is expected");
      const documentEventIndex = state.events.length;
      if (!explicitStart && state.position === state.lineStart && state.input.charCodeAt(state.position) === 46 && testDocumentSeparator(state)) {
        state.position += 3;
        skipSeparationSpace(state, true);
        return;
      }
      addDocumentEvent(state, explicitStart, false);
      if (!parseNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, allowCompact, allowCompact)) addEmptyScalarEvent(state);
      skipSeparationSpace(state, true);
      if (state.position === state.lineStart && testDocumentSeparator(state)) {
        explicitEnd = state.input.charCodeAt(state.position) === 46;
        if (explicitEnd) {
          const markerLine = state.line;
          state.position += 3;
          skipSeparationSpace(state, true);
          if (state.line === markerLine && state.position < state.length) throwError(state, "end of the stream or a document separator is expected");
        }
      }
      const documentEvent = state.events[documentEventIndex];
      if ((documentEvent === null || documentEvent === void 0 ? void 0 : documentEvent.type) === EVENT_ID.DOCUMENT) documentEvent.explicitEnd = explicitEnd;
      addPopEvent(state);
      if (!explicitEnd && state.position < state.length && !testDocumentBoundary(state)) throwError(state, "end of the stream or a document separator is expected");
    }
    function parseEvents(input, options) {
      const length = input.length;
      const state = _objectSpread2(_objectSpread2(_objectSpread2({}, DEFAULT_PARSER_OPTIONS), options), {}, {
        input: `${input}\0`,
        length,
        position: 0,
        line: 0,
        lineStart: 0,
        lineIndent: 0,
        firstTabInLine: -1,
        depth: 0,
        directives: [],
        tagHandlers: /* @__PURE__ */ Object.create(null),
        events: []
      });
      const nullpos = input.indexOf("\0");
      if (nullpos !== -1) YAMLException.throwAt(input, nullpos, "null byte is not allowed in input", state.filename);
      while (state.position < state.length) {
        skipByteOrderMark(state);
        skipSeparationSpace(state, true);
        if (state.position >= state.length) break;
        const documentStart = state.position;
        readDocument(state);
        if (state.position === documentStart)
          throwError(state, "can not read a document");
      }
      return state.events;
    }
    var DEFAULT_LOAD_OPTIONS = _objectSpread2(_objectSpread2({}, DEFAULT_PARSER_OPTIONS), DEFAULT_CONSTRUCTOR_OPTIONS);
    function loadDocuments(input, options = {}) {
      const opts = _objectSpread2(_objectSpread2({}, DEFAULT_LOAD_OPTIONS), options);
      const source = String(input);
      const PARSER_OPT_KEYS = Object.keys(DEFAULT_PARSER_OPTIONS);
      const CONSTRUCTOR_OPT_KEYS = Object.keys(DEFAULT_CONSTRUCTOR_OPTIONS);
      return constructFromEvents(parseEvents(source, pick(opts, PARSER_OPT_KEYS)), _objectSpread2(_objectSpread2({}, pick(opts, CONSTRUCTOR_OPT_KEYS)), {}, { source }));
    }
    function loadAll(input, iteratorOrOptions, options) {
      let iterator = null;
      if (typeof iteratorOrOptions === "function") iterator = iteratorOrOptions;
      else if (iteratorOrOptions !== null && typeof iteratorOrOptions === "object") options = iteratorOrOptions;
      const documents = loadDocuments(input, options);
      if (iterator === null) return documents;
      for (const document of documents) iterator(document);
    }
    function load(input, options) {
      const documents = loadDocuments(input, options);
      if (documents.length === 0) throw new YAMLException("expected a document, but the input is empty");
      if (documents.length === 1) return documents[0];
      throw new YAMLException("expected a single document in the stream, but found more");
    }
    var INVALID = /* @__PURE__ */ Symbol("INVALID");
    function buildRepresentTypes(schema) {
      const defaultTags = new Set([
        schema.defaultScalarTag,
        schema.defaultSequenceTag,
        schema.defaultMappingTag
      ].filter((t) => t !== void 0));
      const implicitScalars = schema.implicitScalarTags;
      const explicitTags = schema.tags.filter((t) => !(t.nodeKind === "scalar" && t.implicit) && !defaultTags.has(t));
      const defaultTagsLast = schema.tags.filter((t) => defaultTags.has(t));
      return [
        ...implicitScalars.map((tag) => ({
          tag,
          implicitTag: true
        })),
        ...explicitTags.map((tag) => ({
          tag,
          implicitTag: false
        })),
        ...defaultTagsLast.map((tag) => ({
          tag,
          implicitTag: true
        }))
      ];
    }
    function matchTag(state, object) {
      for (let index = 0, length = state.representTypes.length; index < length; index += 1) {
        const { tag, implicitTag } = state.representTypes[index];
        if (tag.identify(object)) {
          let tagName;
          if (tag.matchByTagPrefix) tagName = tag.representTagName(object);
          else tagName = tag.tagName;
          return {
            tag,
            tagName,
            implicitTag
          };
        }
      }
      return null;
    }
    function build(state, object) {
      if (!state.noRefs && object !== null && typeof object === "object") {
        const existing = state.refs.get(object);
        if (existing) {
          if (existing.anchor === void 0) existing.anchor = `ref_${state.refCounter++}`;
          return {
            kind: "alias",
            anchor: existing.anchor
          };
        }
      }
      const matched = matchTag(state, object);
      if (!matched) {
        if (object === void 0) return INVALID;
        if (state.skipInvalid) return INVALID;
        throw new YAMLException(`unacceptable kind of an object to dump ${Object.prototype.toString.call(object)}`);
      }
      const { tag, tagName, implicitTag } = matched;
      const nodeTagName = implicitTag ? tagName : tagNameShort(tagName);
      if (tag.nodeKind === "scalar") return {
        kind: "scalar",
        tag: nodeTagName,
        tagged: !implicitTag,
        style: SCALAR_STYLE.PLAIN,
        value: tag.represent(object)
      };
      if (tag.nodeKind === "sequence") {
        const container = tag.represent(object);
        const node2 = {
          kind: "sequence",
          tag: nodeTagName,
          tagged: !implicitTag,
          style: COLLECTION_STYLE.BLOCK,
          items: []
        };
        if (!state.noRefs) state.refs.set(object, node2);
        for (let index = 0, length = container.length; index < length; index += 1) {
          let item = build(state, container[index]);
          if (item === INVALID && container[index] === void 0) item = build(state, null);
          if (item === INVALID) continue;
          node2.items.push(item);
        }
        return node2;
      }
      const map = tag.represent(object);
      const node = {
        kind: "mapping",
        tag: nodeTagName,
        tagged: !implicitTag,
        style: COLLECTION_STYLE.BLOCK,
        items: []
      };
      if (!state.noRefs) state.refs.set(object, node);
      for (const [objectKey, objectValue] of map) {
        const key = build(state, objectKey);
        if (key === INVALID) continue;
        const value = build(state, objectValue);
        if (value === INVALID) continue;
        node.items.push({
          key,
          value
        });
      }
      return node;
    }
    function jsToAst(input, schema, options = {}) {
      var _options$noRefs, _options$skipInvalid;
      const root = build({
        representTypes: buildRepresentTypes(schema),
        noRefs: (_options$noRefs = options.noRefs) !== null && _options$noRefs !== void 0 ? _options$noRefs : false,
        skipInvalid: (_options$skipInvalid = options.skipInvalid) !== null && _options$skipInvalid !== void 0 ? _options$skipInvalid : false,
        refs: /* @__PURE__ */ new Map(),
        refCounter: 0
      }, input);
      return [{
        contents: root === INVALID ? null : root,
        directives: []
      }];
    }
    var VISIT_BREAK = /* @__PURE__ */ Symbol("visit:break");
    var VISIT_SKIP = /* @__PURE__ */ Symbol("visit:skip");
    function visitNode(node, visitor, ctx) {
      const control = visitor(node, ctx);
      if (control === VISIT_BREAK) return true;
      if (control === VISIT_SKIP) return false;
      const depth = ctx.depth + 1;
      switch (node.kind) {
        case "sequence":
          for (const item of node.items) if (visitNode(item, visitor, {
            depth,
            parent: node,
            isKey: false
          })) return true;
          break;
        case "mapping":
          for (const { key, value } of node.items) {
            if (visitNode(key, visitor, {
              depth,
              parent: node,
              isKey: true
            })) return true;
            if (visitNode(value, visitor, {
              depth,
              parent: node,
              isKey: false
            })) return true;
          }
      }
      return false;
    }
    function visit(documents, visitor) {
      for (const doc of documents) if (doc.contents && visitNode(doc.contents, visitor, {
        depth: 0,
        parent: null,
        isKey: false
      })) return;
    }
    function hasBit(mask, bit) {
      return (mask & 1 << bit) !== 0;
    }
    var DEFAULT_SCALAR_STYLE_RULES = {
      applyQuoteFlowKeysOption,
      doubleQuoteForInvisibles,
      doubleQuoteWhitespaceOnly,
      applyForceQuotesOption,
      tryLongOrMultilineAsBlock,
      quoteInvalidPlain,
      fallbackToDoubleQuoted
    };
    function _preferredQuotedStyle(layout) {
      if (layout.presenterOptions.quoteStyle === "single" && hasBit(layout.allowedStylesMask, SCALAR_STYLE.SINGLE_QUOTED)) return SCALAR_STYLE.SINGLE_QUOTED;
      return SCALAR_STYLE.DOUBLE_QUOTED;
    }
    function applyQuoteFlowKeysOption(layout) {
      if (!layout.presenterOptions.quoteFlowKeys) return;
      if (!layout.isKey || !layout.flowOnly || layout.style !== SCALAR_STYLE.PLAIN) return;
      layout.style = SCALAR_STYLE.DOUBLE_QUOTED;
    }
    function doubleQuoteForInvisibles(layout) {
      if (layout.style === SCALAR_STYLE.PLAIN && /[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(layout.node.value)) layout.style = SCALAR_STYLE.DOUBLE_QUOTED;
    }
    function doubleQuoteWhitespaceOnly(layout) {
      if (layout.style === SCALAR_STYLE.PLAIN && /^\s+$/.test(layout.node.value)) layout.style = SCALAR_STYLE.DOUBLE_QUOTED;
    }
    function applyForceQuotesOption(layout) {
      if (!layout.presenterOptions.forceQuotes) return;
      if (layout.isKey || layout.style !== SCALAR_STYLE.PLAIN) return;
      if (layout.node.tag !== layout.presenterOptions.schema.defaultScalarTag.tagName) return;
      layout.style = layout.node.value.includes("\n") ? SCALAR_STYLE.DOUBLE_QUOTED : _preferredQuotedStyle(layout);
    }
    function tryLongOrMultilineAsBlock(layout) {
      if (layout.style !== SCALAR_STYLE.PLAIN || layout.isKey) return;
      const value = layout.node.value;
      const multiline = value.indexOf("\n") !== -1;
      if (!hasBit(layout.allowedStylesMask, SCALAR_STYLE.LITERAL_BLOCK)) {
        if (multiline) layout.style = SCALAR_STYLE.DOUBLE_QUOTED;
        return;
      }
      const w = layout.presenterOptions.lineWidth;
      if (w === -1) {
        if (multiline) layout.style = SCALAR_STYLE.LITERAL_BLOCK;
        return;
      }
      const availableWidth = Math.max(Math.min(w, 40), w - layout.shiftOfContent);
      let position = 0;
      let shouldFold = false;
      while (position <= value.length) {
        let lineEnd = value.length;
        const nextLineBreak = value.indexOf("\n", position);
        if (nextLineBreak !== -1) lineEnd = nextLineBreak;
        const line = value.slice(position, lineEnd);
        if (line.length > availableWidth && line[0] !== " " && / [^ \t]/.test(line)) shouldFold = true;
        if (nextLineBreak === -1) break;
        position = nextLineBreak + 1;
      }
      if (shouldFold) layout.style = SCALAR_STYLE.FOLDED_BLOCK;
      else if (multiline) layout.style = SCALAR_STYLE.LITERAL_BLOCK;
    }
    function quoteInvalidPlain(layout) {
      if (layout.style === SCALAR_STYLE.PLAIN && !hasBit(layout.allowedStylesMask, SCALAR_STYLE.PLAIN)) layout.style = _preferredQuotedStyle(layout);
    }
    function fallbackToDoubleQuoted(layout) {
      if (!hasBit(layout.allowedStylesMask, layout.style)) layout.style = SCALAR_STYLE.DOUBLE_QUOTED;
    }
    function setBit(mask, bit) {
      return mask | 1 << bit;
    }
    var SRC_C_PRINTABLE = "[\\x09\\x0A\\x0D\\x20-\\x7E\\x85\\xA0-\\uD7FF\\uE000-\\uFFFD\\u{10000}-\\u{10FFFF}]";
    var SRC_B_CHAR = "[\\n\\r]";
    var SRC_C_BYTE_ORDER_MARK = "\\uFEFF";
    var SRC_S_WHITE = "[ \\t]";
    var SRC_NB_CHAR = `(?:(?!(?:${SRC_B_CHAR}|${SRC_C_BYTE_ORDER_MARK}))${SRC_C_PRINTABLE})`;
    var SRC_NS_CHAR = `(?:(?!${SRC_S_WHITE})${SRC_NB_CHAR})`;
    var SRC_NB_JSON = "[\\x09\\x20-\\uD7FF\\uE000-\\uFFFF\\u{10000}-\\u{10FFFF}]";
    var SRC_C_INDICATOR = "[-?:,\\[\\]{}#&*!|>'\"%@`]";
    var SRC_C_FLOW_INDICATOR = "[,\\[\\]{}]";
    var SRC_NS_PLAIN_SAFE_FLOW_OUT = SRC_NS_CHAR;
    var SRC_NS_PLAIN_SAFE_FLOW_IN = `(?:(?!${SRC_C_FLOW_INDICATOR})${SRC_NS_CHAR})`;
    var SRC_NS_PLAIN_FIRST_FLOW_OUT = `(?:(?:(?!${SRC_C_INDICATOR})${SRC_NS_CHAR})|[?:-](?=${SRC_NS_PLAIN_SAFE_FLOW_OUT}))`;
    var SRC_NS_PLAIN_FIRST_FLOW_IN = `(?:(?:(?!${SRC_C_INDICATOR})${SRC_NS_CHAR})|[?:-](?=${SRC_NS_PLAIN_SAFE_FLOW_IN}))`;
    var SRC_NS_PLAIN_CHAR_FLOW_OUT = `(?:(?:(?![:#])${SRC_NS_PLAIN_SAFE_FLOW_OUT})|:(?=${SRC_NS_PLAIN_SAFE_FLOW_OUT}))#*`;
    var SRC_NS_PLAIN_CHAR_FLOW_IN = `(?:(?:(?![:#])${SRC_NS_PLAIN_SAFE_FLOW_IN})|:(?=${SRC_NS_PLAIN_SAFE_FLOW_IN}))#*`;
    var SRC_NB_NS_PLAIN_IN_LINE_FLOW_OUT = `(?:${SRC_S_WHITE}*${SRC_NS_PLAIN_CHAR_FLOW_OUT})*`;
    var SRC_NB_NS_PLAIN_IN_LINE_FLOW_IN = `(?:${SRC_S_WHITE}*${SRC_NS_PLAIN_CHAR_FLOW_IN})*`;
    var SRC_NS_PLAIN_ONE_LINE_FLOW_OUT = `${SRC_NS_PLAIN_FIRST_FLOW_OUT}#*${SRC_NB_NS_PLAIN_IN_LINE_FLOW_OUT}`;
    var SRC_NS_PLAIN_ONE_LINE_FLOW_IN = `${SRC_NS_PLAIN_FIRST_FLOW_IN}#*${SRC_NB_NS_PLAIN_IN_LINE_FLOW_IN}`;
    var SRC_NS_PLAIN_ONE_LINE_BLOCK_KEY = SRC_NS_PLAIN_ONE_LINE_FLOW_OUT;
    var SRC_NS_PLAIN_ONE_LINE_FLOW_KEY = SRC_NS_PLAIN_ONE_LINE_FLOW_IN;
    var SRC_S_NS_PLAIN_NEXT_LINE_FLOW_OUT = `\\n+${SRC_NS_PLAIN_CHAR_FLOW_OUT}${SRC_NB_NS_PLAIN_IN_LINE_FLOW_OUT}`;
    var SRC_S_NS_PLAIN_NEXT_LINE_FLOW_IN = `\\n+${SRC_NS_PLAIN_CHAR_FLOW_IN}${SRC_NB_NS_PLAIN_IN_LINE_FLOW_IN}`;
    var SRC_NS_PLAIN_MULTI_LINE_FLOW_OUT = `${SRC_NS_PLAIN_ONE_LINE_FLOW_OUT}(?:${SRC_S_NS_PLAIN_NEXT_LINE_FLOW_OUT})*`;
    var SRC_NS_PLAIN_MULTI_LINE_FLOW_IN = `${SRC_NS_PLAIN_ONE_LINE_FLOW_IN}(?:${SRC_S_NS_PLAIN_NEXT_LINE_FLOW_IN})*`;
    var NS_PLAIN_FLOW_OUT = new RegExp(`^(?:${SRC_NS_PLAIN_MULTI_LINE_FLOW_OUT})$`, "u");
    var NS_PLAIN_FLOW_IN = new RegExp(`^(?:${SRC_NS_PLAIN_MULTI_LINE_FLOW_IN})$`, "u");
    var NS_PLAIN_BLOCK_KEY = new RegExp(`^(?:${SRC_NS_PLAIN_ONE_LINE_BLOCK_KEY})$`, "u");
    var NS_PLAIN_FLOW_KEY = new RegExp(`^(?:${SRC_NS_PLAIN_ONE_LINE_FLOW_KEY})$`, "u");
    var NB_SINGLE_ONE_LINE = new RegExp(`^(?:${SRC_NB_JSON})*$`, "u");
    var NB_SINGLE_MULTI_LINE = new RegExp(`^(?:${SRC_NB_JSON}|\\n)*$`, "u");
    var BLOCK_SCALAR_CONTENT = new RegExp(`^(?:${SRC_NB_CHAR}|\\n)*$`, "u");
    var C_FORBIDDEN_FIRST_LINE = /^(?:---|\.\.\.)(?=$|[ \t\n\r])/;
    var C_FORBIDDEN_CONTENT = /^(?:---|\.\.\.)(?=$|[ \t\n\r])/m;
    function canUsePlain(layout) {
      const str = layout.node.value;
      if (str !== "") {
        if (!(layout.isKey ? layout.flowOnly ? NS_PLAIN_FLOW_KEY : NS_PLAIN_BLOCK_KEY : layout.flowOnly ? NS_PLAIN_FLOW_IN : NS_PLAIN_FLOW_OUT).test(str)) return false;
        if (layout.shiftOfFirstLine === 0 && C_FORBIDDEN_FIRST_LINE.test(str)) return false;
        if (layout.shiftOfContent === 0) {
          const firstLineBreak = str.indexOf("\n");
          if (firstLineBreak !== -1) {
            const content = str.slice(firstLineBreak + 1);
            if (C_FORBIDDEN_CONTENT.test(content)) return false;
          }
        }
      }
      const resolvedTag = layout.presenterOptions.schema.resolveImplicitScalarTag(str).tag.tagName;
      if (!layout.node.tagged && resolvedTag !== layout.node.tag) return false;
      if (!layout.node.tagged && str === "=" && resolvedTag === layout.presenterOptions.schema.defaultScalarTag.tagName) return false;
      return true;
    }
    function canUseSingleQuoted(layout) {
      const str = layout.node.value;
      if (!(layout.isKey ? NB_SINGLE_ONE_LINE : NB_SINGLE_MULTI_LINE).test(str)) return false;
      if (/[ \t]\n|\n[ \t]/.test(str)) return false;
      if (!layout.isKey && layout.shiftOfContent === 0) {
        const firstLineBreak = str.indexOf("\n");
        if (firstLineBreak !== -1 && C_FORBIDDEN_CONTENT.test(str.slice(firstLineBreak + 1))) return false;
      }
      return true;
    }
    function canUseBlock(layout) {
      if (layout.flowOnly || !BLOCK_SCALAR_CONTENT.test(layout.node.value)) return false;
      const contentIndent = layout.shiftOfContent - layout.shiftOfParent;
      if (contentIndent < 1) return false;
      if (contentIndent > 9 && /^\n* /.test(layout.node.value)) return false;
      if (layout.shiftOfContent === 0 && C_FORBIDDEN_CONTENT.test(layout.node.value)) return false;
      return true;
    }
    function detectAllowedStyles(layout) {
      let mask = setBit(0, SCALAR_STYLE.DOUBLE_QUOTED);
      if (canUsePlain(layout)) mask = setBit(mask, SCALAR_STYLE.PLAIN);
      if (canUseSingleQuoted(layout)) mask = setBit(mask, SCALAR_STYLE.SINGLE_QUOTED);
      if (canUseBlock(layout)) mask = setBit(setBit(mask, SCALAR_STYLE.LITERAL_BLOCK), SCALAR_STYLE.FOLDED_BLOCK);
      layout.allowedStylesMask = mask;
    }
    function renderScalar(layout) {
      switch (layout.style) {
        case SCALAR_STYLE.PLAIN:
          return renderPlain(layout);
        case SCALAR_STYLE.SINGLE_QUOTED:
          return renderSingleQuoted(layout);
        case SCALAR_STYLE.LITERAL_BLOCK:
          return renderLiteralBlock(layout);
        case SCALAR_STYLE.FOLDED_BLOCK:
          return renderFoldedBlock(layout);
        case SCALAR_STYLE.DOUBLE_QUOTED:
          return renderDoubleQuoted(layout);
      }
    }
    function renderPlain(layout) {
      return encodeFlowBreaks(layout.node.value, layout.shiftOfContent);
    }
    function renderSingleQuoted(layout) {
      return `'${encodeFlowBreaks(layout.node.value, layout.shiftOfContent).replace(/'/g, "''")}'`;
    }
    function renderLiteralBlock(layout) {
      const value = layout.node.value;
      return "|" + blockHeader(value, layout.shiftOfParent, layout.shiftOfContent) + dropEndingNewline(indentString(value, layout.shiftOfContent));
    }
    function renderFoldedBlock(layout) {
      const value = layout.node.value;
      const w = layout.presenterOptions.lineWidth;
      let availableWidth = Infinity;
      if (w !== -1) availableWidth = Math.max(Math.min(w, 40), w - layout.shiftOfContent);
      return ">" + blockHeader(value, layout.shiftOfParent, layout.shiftOfContent) + dropEndingNewline(indentString(foldBlockScalar(value, availableWidth), layout.shiftOfContent));
    }
    function renderDoubleQuoted(layout) {
      return `"${escapeString(layout.node.value)}"`;
    }
    function encodeFlowBreaks(string, shiftOfContent) {
      let nextLF = string.indexOf("\n");
      if (nextLF === -1) return string;
      const pad = " ".repeat(shiftOfContent);
      let result = string.slice(0, nextLF);
      const lineRe = /(\n+)([^\n]*)/g;
      lineRe.lastIndex = nextLF;
      let match;
      while (match = lineRe.exec(string)) {
        const breaks = match[1].length;
        const line = match[2];
        result += "\n".repeat(breaks + 1) + pad + line;
      }
      return result;
    }
    function indentString(string, spaces) {
      const indent = " ".repeat(spaces);
      let position = 0;
      let result = "";
      const length = string.length;
      while (position < length) {
        let line;
        const next = string.indexOf("\n", position);
        if (next === -1) {
          line = string.slice(position);
          position = length;
        } else {
          line = string.slice(position, next + 1);
          position = next + 1;
        }
        if (line.length && line !== "\n") result += indent;
        result += line;
      }
      return result;
    }
    function needIndentIndicator(string) {
      return /^\n* /.test(string);
    }
    function blockHeader(string, shiftOfParent, shiftOfContent) {
      const indentIndicator = needIndentIndicator(string) ? String(shiftOfContent - shiftOfParent) : "";
      const clip = string[string.length - 1] === "\n";
      return `${indentIndicator}${clip && (string[string.length - 2] === "\n" || string === "\n") ? "+" : clip ? "" : "-"}
`;
    }
    function dropEndingNewline(string) {
      return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
    }
    function isMoreIndented(char) {
      return char === " " || char === "	";
    }
    function foldLine(line, width) {
      if (line === "" || isMoreIndented(line[0])) return line;
      const breakRe = / [^ \t]/g;
      let match;
      let start = 0;
      let end;
      let curr = 0;
      let next = 0;
      let result = "";
      while (match = breakRe.exec(line)) {
        next = match.index;
        if (next - start > width) {
          end = curr > start ? curr : next;
          result += `
${line.slice(start, end)}`;
          start = end + 1;
        }
        curr = next;
      }
      result += "\n";
      if (line.length - start > width && curr > start) result += `${line.slice(start, curr)}
${line.slice(curr + 1)}`;
      else result += line.slice(start);
      return result.slice(1);
    }
    function foldBlockScalar(string, width) {
      const lineRe = /(\n+)([^\n]*)/g;
      let nextLF = string.indexOf("\n");
      if (nextLF === -1) nextLF = string.length;
      lineRe.lastIndex = nextLF;
      let result = foldLine(string.slice(0, nextLF), width);
      let prevMoreIndented = string[0] === "\n" || isMoreIndented(string[0]);
      let moreIndented;
      let match;
      while (match = lineRe.exec(string)) {
        const prefix = match[1];
        const line = match[2];
        moreIndented = line !== "" && isMoreIndented(line[0]);
        result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
        prevMoreIndented = moreIndented;
      }
      return result;
    }
    var CHARACTERS_TO_ESCAPE = /["\\\x00-\x1F\x7F-\xA0\u2028\u2029\uD800-\uDFFF\uFEFF\uFFFE\uFFFF]/gu;
    function escapeCharacter(character) {
      switch (character) {
        case "\0":
          return "\\0";
        case "\x07":
          return "\\a";
        case "\b":
          return "\\b";
        case "	":
          return "\\t";
        case "\n":
          return "\\n";
        case "\v":
          return "\\v";
        case "\f":
          return "\\f";
        case "\r":
          return "\\r";
        case "\x1B":
          return "\\e";
        case '"':
          return '\\"';
        case "\\":
          return "\\\\";
        case "\x85":
          return "\\N";
        case "\xA0":
          return "\\_";
        case "\u2028":
          return "\\L";
        case "\u2029":
          return "\\P";
      }
      const code = character.charCodeAt(0);
      const hex = code.toString(16).toUpperCase();
      if (code <= 255) return `\\x${"0".repeat(2 - hex.length)}${hex}`;
      return `\\u${"0".repeat(4 - hex.length)}${hex}`;
    }
    function escapeString(string) {
      return string.replace(CHARACTERS_TO_ESCAPE, escapeCharacter);
    }
    var CHAR_LINE_FEED = 10;
    var DEFAULT_PRESENTER_OPTIONS = {
      indent: 2,
      seqNoIndent: false,
      seqInlineFirst: true,
      lineWidth: 80,
      flowBracketPadding: false,
      flowSkipCommaSpace: false,
      flowSkipColonSpace: false,
      quoteFlowKeys: false,
      quoteStyle: "single",
      forceQuotes: false,
      scalarStyleRules: Object.keys(DEFAULT_SCALAR_STYLE_RULES).map((name) => Reflect.get(DEFAULT_SCALAR_STYLE_RULES, name)),
      tagBeforeAnchor: false
    };
    function nodeTagShort(node) {
      return node.tagged ? node.tag : tagNameShort(node.tag);
    }
    function createPresenterState(options) {
      const opts = _objectSpread2(_objectSpread2({}, DEFAULT_PRESENTER_OPTIONS), options);
      if (opts.flowSkipColonSpace) opts.quoteFlowKeys = true;
      return _objectSpread2(_objectSpread2({}, opts), {}, {
        defaultScalarTagName: opts.schema.defaultScalarTag.tagName,
        openEnded: false
      });
    }
    function generateNextLine(state, level) {
      return `
${" ".repeat(state.indent * level)}`;
    }
    function scalarLayout(state, node, parent, level, isKey, flowOnly) {
      return {
        node,
        parent,
        level,
        isKey,
        flowOnly,
        shiftOfParent: level === 0 ? -1 : state.indent * (level - 1),
        shiftOfContent: state.indent * Math.max(1, level),
        shiftOfFirstLine: level === 0 ? 0 : state.indent * level,
        presenterOptions: state,
        allowedStylesMask: 0,
        style: node.style
      };
    }
    function writeFlowSequence(state, level, node) {
      let result = "";
      for (let index = 0, length = node.items.length; index < length; index += 1) {
        const item = writeNode(state, level, node.items[index], node, {}).text;
        if (index > 0) result += `,${!state.flowSkipCommaSpace ? " " : ""}`;
        result += item;
      }
      const pad = state.flowBracketPadding && node.items.length > 0 ? " " : "";
      return `[${pad}${result}${pad}]`;
    }
    function writeBlockSequence(state, level, node, compact) {
      let result = "";
      for (let index = 0, length = node.items.length; index < length; index += 1) {
        const item = writeNode(state, level + 1, node.items[index], node, {
          block: true,
          compact: state.seqInlineFirst,
          isblockseq: true
        }).text;
        if (!compact || result !== "") result += generateNextLine(state, level);
        if (item === "" || CHAR_LINE_FEED === item.charCodeAt(0)) result += "-";
        else result += "- ";
        result += item;
      }
      return result;
    }
    function writeFlowMapping(state, level, node) {
      let result = "";
      for (const { key, value } of node.items) {
        let pairBuffer = "";
        if (result !== "") pairBuffer += `,${!state.flowSkipCommaSpace ? " " : ""}`;
        const keyRender = writeNode(state, level, key, node, { iskey: true });
        const keyText = keyRender.text;
        const valueText = writeNode(state, level, value, node, {}).text;
        const sep = state.flowSkipColonSpace || valueText === "" ? "" : " ";
        const keyIsBareProps = key.kind === "scalar" && keyRender.noBody && (key.tagged || key.anchor !== void 0);
        const keyColonSep = key.kind === "alias" || keyIsBareProps ? " " : "";
        pairBuffer += `${keyText}${keyColonSep}:${sep}${valueText}`;
        result += pairBuffer;
      }
      const pad = state.flowBracketPadding && result !== "" ? " " : "";
      return `{${pad}${result}${pad}}`;
    }
    function writeBlockMapping(state, level, node, compact) {
      let result = "";
      for (let index = 0, length = node.items.length; index < length; index += 1) {
        let pairBuffer = "";
        if (!compact || result !== "") pairBuffer += generateNextLine(state, level);
        const { key, value } = node.items[index];
        const keyIsBlock = (key.kind === "mapping" || key.kind === "sequence") && key.style === COLLECTION_STYLE.BLOCK && key.items.length !== 0 || key.kind === "scalar" && (key.style === SCALAR_STYLE.LITERAL_BLOCK || key.style === SCALAR_STYLE.FOLDED_BLOCK);
        const keyRender = keyIsBlock ? writeNode(state, level + 1, key, node, {
          block: true,
          compact: true,
          isblockseq: !cannotBeCompact(state, key, level + 1)
        }) : writeNode(state, level + 1, key, node, {
          block: true,
          compact: true,
          iskey: true
        });
        const keyText = keyRender.text;
        const keyHasLineBreak = key.kind === "scalar" && key.value.indexOf("\n") !== -1;
        const keyIsTooLong = keyText.length > 1024 && /^[\s\S]{1025}/u.test(keyText);
        const explicitPair = keyIsBlock || keyHasLineBreak || keyIsTooLong;
        if (explicitPair) {
          if (keyText && CHAR_LINE_FEED === keyText.charCodeAt(0)) pairBuffer += "?";
          else pairBuffer += "? ";
        }
        pairBuffer += keyText;
        if (explicitPair) pairBuffer += generateNextLine(state, level);
        const valueText = writeNode(state, level + 1, value, node, {
          block: true,
          compact: explicitPair,
          isblockseq: explicitPair && !cannotBeCompact(state, value, level + 1)
        }).text;
        const keyIsBareProps = key.kind === "scalar" && keyRender.noBody && (key.tagged || key.anchor !== void 0);
        const keyColonSep = !explicitPair && (key.kind === "alias" || keyIsBareProps) ? " " : "";
        if (valueText === "" || CHAR_LINE_FEED === valueText.charCodeAt(0)) pairBuffer += `${keyColonSep}:`;
        else pairBuffer += `${keyColonSep}: `;
        pairBuffer += valueText;
        result += pairBuffer;
      }
      return result;
    }
    function cannotBeCompact(state, node, level) {
      if (node.kind === "alias") return true;
      return node.tagged || node.anchor !== void 0 || state.indent < 2 && level > 0;
    }
    function writeNode(state, level, node, parent, ctx) {
      var _ctx$compact;
      if (node.kind === "alias") {
        state.openEnded = false;
        return {
          text: `*${node.anchor}`,
          noBody: false
        };
      }
      const { block = false, iskey = false, isblockseq = false } = ctx;
      let compact = (_ctx$compact = ctx.compact) !== null && _ctx$compact !== void 0 ? _ctx$compact : false;
      const hasAnchor = node.anchor !== void 0;
      if (cannotBeCompact(state, node, level)) compact = false;
      let body;
      let shouldPrintTag = node.tagged;
      const useBlockCollection = block && (node.kind === "mapping" || node.kind === "sequence") && node.style === COLLECTION_STYLE.BLOCK && node.items.length !== 0;
      if (node.kind === "mapping") {
        if (useBlockCollection) body = writeBlockMapping(state, level, node, compact);
        else body = writeFlowMapping(state, level, node);
      } else if (node.kind === "sequence") {
        if (useBlockCollection) {
          if (state.seqNoIndent && !isblockseq && level > 0) body = writeBlockSequence(state, level - 1, node, compact);
          else body = writeBlockSequence(state, level, node, compact);
        } else body = writeFlowSequence(state, level, node);
      } else {
        const layout = scalarLayout(state, node, parent, level, iskey, !block);
        detectAllowedStyles(layout);
        for (const rule of state.scalarStyleRules) rule(layout);
        body = renderScalar(layout);
        state.openEnded = (layout.style === SCALAR_STYLE.LITERAL_BLOCK || layout.style === SCALAR_STYLE.FOLDED_BLOCK) && (node.value === "\n" || node.value.endsWith("\n\n"));
        shouldPrintTag = node.tagged || body === "" && layout.flowOnly && (parent === null || parent === void 0 ? void 0 : parent.kind) === "sequence" && !hasAnchor || layout.style !== SCALAR_STYLE.PLAIN && node.tag !== state.defaultScalarTagName;
      }
      if ((node.kind === "mapping" || node.kind === "sequence") && !useBlockCollection) state.openEnded = false;
      if (useBlockCollection && compact && level > 0 && state.indent > 2) body = `${" ".repeat(state.indent - 2)}${body}`;
      const noBody = body === "";
      let text = body;
      if (shouldPrintTag || hasAnchor) {
        const props = [];
        const tag = shouldPrintTag ? nodeTagShort(node) : null;
        const anchor = hasAnchor ? `&${node.anchor}` : null;
        if (state.tagBeforeAnchor) {
          if (tag !== null) props.push(tag);
          if (anchor !== null) props.push(anchor);
        } else {
          if (anchor !== null) props.push(anchor);
          if (tag !== null) props.push(tag);
        }
        const sep = body === "" || body.charCodeAt(0) === CHAR_LINE_FEED ? "" : " ";
        text = `${props.join(" ")}${sep}${body}`;
      }
      return {
        text,
        noBody
      };
    }
    function rootStartsOwnLine(node) {
      return (node.kind === "sequence" || node.kind === "mapping") && node.style === COLLECTION_STYLE.BLOCK && node.items.length !== 0 && !node.tagged && node.anchor === void 0;
    }
    function writeDocumentDirectives(doc) {
      let result = "";
      for (const directive of doc.directives) {
        if (directive.kind === "yaml") {
          result += `%YAML ${directive.version}
`;
          continue;
        }
        const { handle, prefix } = directive;
        result += `%TAG ${handle} ${prefix}
`;
      }
      return result;
    }
    function present(documents, options) {
      const state = createPresenterState(options);
      let result = "";
      let previousEnded = false;
      for (let index = 0; index < documents.length; index += 1) {
        const doc = documents[index];
        state.openEnded = false;
        const directives = writeDocumentDirectives(doc);
        const hasDirectives = directives !== "";
        const marker = doc.explicitStart || hasDirectives || index > 0 && !previousEnded;
        result += directives;
        if (doc.contents === null) {
          if (marker) result += "---\n";
        } else if (marker) {
          const body = writeNode(state, 0, doc.contents, null, {
            block: true,
            compact: true
          }).text;
          const sep = body === "" ? "" : hasDirectives || rootStartsOwnLine(doc.contents) ? "\n" : " ";
          result += `---${sep}${body}
`;
        } else result += writeNode(state, 0, doc.contents, null, {
          block: true,
          compact: true
        }).text + "\n";
        previousEnded = doc.explicitEnd || state.openEnded;
        if (previousEnded) result += "...\n";
      }
      return result;
    }
    var DEFAULT_DUMP_OPTIONS = _objectSpread2(_objectSpread2({}, DEFAULT_PRESENTER_OPTIONS), {}, {
      schema: DUMP_SCHEMA,
      skipInvalid: false,
      noRefs: false,
      flowLevel: -1,
      sortKeys: false,
      transform: () => {
      }
    });
    function defaultCompareFn(a, b) {
      const x = String(a);
      const y = String(b);
      if (x < y) return -1;
      if (x > y) return 1;
      return 0;
    }
    function dump(input, options = {}) {
      const opts = _objectSpread2(_objectSpread2({}, DEFAULT_DUMP_OPTIONS), options);
      const documents = jsToAst(input, opts.schema, {
        noRefs: opts.noRefs,
        skipInvalid: opts.skipInvalid
      });
      if (opts.flowLevel >= 0) visit(documents, (node, ctx) => {
        if (ctx.depth < opts.flowLevel) return;
        if (node.kind === "sequence" || node.kind === "mapping") node.style = COLLECTION_STYLE.FLOW;
        return VISIT_SKIP;
      });
      if (opts.sortKeys) {
        const compareFn = opts.sortKeys === true ? defaultCompareFn : opts.sortKeys;
        visit(documents, (node) => {
          if (node.kind !== "mapping") return;
          node.items.sort((a, b) => compareFn(a.key.kind === "scalar" ? a.key.value : "", b.key.kind === "scalar" ? b.key.value : ""));
        });
      }
      opts.transform(documents);
      return present(documents, _objectSpread2(_objectSpread2({}, pick(opts, Object.keys(DEFAULT_PRESENTER_OPTIONS))), {}, { schema: opts.schema }));
    }
    var NO_RANGE = -1;
    function eventPosition(event) {
      if ("tagStart" in event && event.tagStart !== NO_RANGE) return event.tagStart;
      if ("anchorStart" in event && event.anchorStart !== NO_RANGE) return event.anchorStart;
      if ("valueStart" in event && event.valueStart !== NO_RANGE) return event.valueStart;
      if ("start" in event) return event.start;
      return 0;
    }
    function rawTag(state, event) {
      return event.tagStart === NO_RANGE ? "" : state.source.slice(event.tagStart, event.tagEnd);
    }
    function anchorName(state, event) {
      return event.anchorStart === NO_RANGE ? void 0 : state.source.slice(event.anchorStart, event.anchorEnd);
    }
    function buildScalar(state, event) {
      const value = getScalarValue(state.source, event);
      const raw = rawTag(state, event);
      let tag;
      let tagged = false;
      if (raw !== "") {
        tagged = true;
        tag = raw;
      } else if (event.style === SCALAR_STYLE.PLAIN) tag = state.schema.resolveImplicitScalarTag(value).tag.tagName;
      else tag = state.schema.defaultScalarTag.tagName;
      return {
        kind: "scalar",
        tag,
        tagged,
        style: event.style,
        anchor: anchorName(state, event),
        value
      };
    }
    function buildCollection(state, event, defaultTagName) {
      const raw = rawTag(state, event);
      let tag;
      let tagged = false;
      if (raw === "") tag = defaultTagName;
      else {
        tag = raw;
        tagged = true;
      }
      return {
        tag,
        tagged,
        style: event.style,
        anchor: anchorName(state, event)
      };
    }
    function addNode(state, node) {
      const frame = state.frames[state.frames.length - 1];
      if (frame.kind === "document") frame.doc.contents = node;
      else if (frame.kind === "sequence") frame.node.items.push(node);
      else if (frame.key) {
        frame.node.items.push({
          key: frame.key,
          value: node
        });
        frame.key = null;
      } else frame.key = node;
    }
    function eventsToAst(events, options) {
      const state = {
        source: options.source,
        schema: options.schema,
        eventIndex: 0,
        position: 0,
        frames: [],
        documents: []
      };
      while (state.eventIndex < events.length) {
        const event = events[state.eventIndex++];
        state.position = eventPosition(event);
        switch (event.type) {
          case EVENT_ID.DOCUMENT: {
            const doc = {
              contents: null,
              explicitStart: event.explicitStart,
              explicitEnd: event.explicitEnd,
              directives: event.directives
            };
            state.frames.push({
              kind: "document",
              doc
            });
            break;
          }
          case EVENT_ID.SCALAR:
            addNode(state, buildScalar(state, event));
            break;
          case EVENT_ID.SEQUENCE: {
            const { tag, tagged, style, anchor } = buildCollection(state, event, "tag:yaml.org,2002:seq");
            const node = {
              kind: "sequence",
              tag,
              tagged,
              style,
              anchor,
              items: []
            };
            state.frames.push({
              kind: "sequence",
              node
            });
            break;
          }
          case EVENT_ID.MAPPING: {
            const { tag, tagged, style, anchor } = buildCollection(state, event, "tag:yaml.org,2002:map");
            const node = {
              kind: "mapping",
              tag,
              tagged,
              style,
              anchor,
              items: []
            };
            state.frames.push({
              kind: "mapping",
              node,
              key: null
            });
            break;
          }
          case EVENT_ID.ALIAS:
            addNode(state, {
              kind: "alias",
              anchor: state.source.slice(event.anchorStart, event.anchorEnd)
            });
            break;
          case EVENT_ID.POP: {
            const frame = state.frames.pop();
            if (frame.kind === "mapping" && frame.key) throw new Error("incomplete mapping pair in event stream");
            if (frame.kind === "document") state.documents.push(frame.doc);
            else addNode(state, frame.node);
            break;
          }
        }
      }
      return state.documents;
    }
    var EVENT_DOCUMENT = EVENT_ID.DOCUMENT;
    var EVENT_SEQUENCE = EVENT_ID.SEQUENCE;
    var EVENT_MAPPING = EVENT_ID.MAPPING;
    var EVENT_SCALAR = EVENT_ID.SCALAR;
    var EVENT_ALIAS = EVENT_ID.ALIAS;
    var EVENT_POP = EVENT_ID.POP;
    var SCALAR_STYLE_PLAIN = SCALAR_STYLE.PLAIN;
    var SCALAR_STYLE_SINGLE_QUOTED = SCALAR_STYLE.SINGLE_QUOTED;
    var SCALAR_STYLE_DOUBLE_QUOTED = SCALAR_STYLE.DOUBLE_QUOTED;
    var SCALAR_STYLE_LITERAL_BLOCK = SCALAR_STYLE.LITERAL_BLOCK;
    var SCALAR_STYLE_FOLDED_BLOCK = SCALAR_STYLE.FOLDED_BLOCK;
    var COLLECTION_STYLE_BLOCK = COLLECTION_STYLE.BLOCK;
    var COLLECTION_STYLE_FLOW = COLLECTION_STYLE.FLOW;
    var CHOMPING_CLIP = CHOMPING_MODE.CLIP;
    var CHOMPING_STRIP = CHOMPING_MODE.STRIP;
    var CHOMPING_KEEP = CHOMPING_MODE.KEEP;
    exports2.CHOMPING_CLIP = CHOMPING_CLIP;
    exports2.CHOMPING_KEEP = CHOMPING_KEEP;
    exports2.CHOMPING_MODE = CHOMPING_MODE;
    exports2.CHOMPING_STRIP = CHOMPING_STRIP;
    exports2.COLLECTION_STYLE = COLLECTION_STYLE;
    exports2.COLLECTION_STYLE_BLOCK = COLLECTION_STYLE_BLOCK;
    exports2.COLLECTION_STYLE_FLOW = COLLECTION_STYLE_FLOW;
    exports2.CORE_SCHEMA = CORE_SCHEMA;
    exports2.DEFAULT_SCALAR_STYLE_RULES = DEFAULT_SCALAR_STYLE_RULES;
    exports2.DUMP_SCHEMA = DUMP_SCHEMA;
    exports2.EVENT_ALIAS = EVENT_ALIAS;
    exports2.EVENT_DOCUMENT = EVENT_DOCUMENT;
    exports2.EVENT_ID = EVENT_ID;
    exports2.EVENT_MAPPING = EVENT_MAPPING;
    exports2.EVENT_POP = EVENT_POP;
    exports2.EVENT_SCALAR = EVENT_SCALAR;
    exports2.EVENT_SEQUENCE = EVENT_SEQUENCE;
    exports2.FAILSAFE_SCHEMA = FAILSAFE_SCHEMA;
    exports2.JSON_SCHEMA = JSON_SCHEMA;
    exports2.NOT_RESOLVED = NOT_RESOLVED;
    exports2.SCALAR_STYLE = SCALAR_STYLE;
    exports2.SCALAR_STYLE_DOUBLE_QUOTED = SCALAR_STYLE_DOUBLE_QUOTED;
    exports2.SCALAR_STYLE_FOLDED_BLOCK = SCALAR_STYLE_FOLDED_BLOCK;
    exports2.SCALAR_STYLE_LITERAL_BLOCK = SCALAR_STYLE_LITERAL_BLOCK;
    exports2.SCALAR_STYLE_PLAIN = SCALAR_STYLE_PLAIN;
    exports2.SCALAR_STYLE_SINGLE_QUOTED = SCALAR_STYLE_SINGLE_QUOTED;
    exports2.Schema = Schema;
    exports2.VISIT_BREAK = VISIT_BREAK;
    exports2.VISIT_SKIP = VISIT_SKIP;
    exports2.YAML11_SCHEMA = YAML11_SCHEMA;
    exports2.YAMLException = YAMLException;
    exports2.binaryTag = binaryTag;
    exports2.boolCoreTag = boolCoreTag;
    exports2.boolJsonTag = boolJsonTag;
    exports2.boolYaml11Tag = boolYaml11Tag;
    exports2.constructFromEvents = constructFromEvents;
    exports2.defineMappingTag = defineMappingTag;
    exports2.defineScalarTag = defineScalarTag;
    exports2.defineSequenceTag = defineSequenceTag;
    exports2.dump = dump;
    exports2.eventsToAst = eventsToAst;
    exports2.floatCoreTag = floatCoreTag;
    exports2.floatJsonTag = floatJsonTag;
    exports2.floatYaml11Tag = floatYaml11Tag;
    exports2.getScalarValue = getScalarValue;
    exports2.intCoreTag = intCoreTag;
    exports2.intJsonTag = intJsonTag;
    exports2.intYaml11Tag = intYaml11Tag;
    exports2.jsToAst = jsToAst;
    exports2.legacyMapTag = legacyMapTag;
    exports2.load = load;
    exports2.loadAll = loadAll;
    exports2.mapTag = mapTag;
    exports2.mergeTag = mergeTag;
    exports2.nullCoreTag = nullCoreTag;
    exports2.nullJsonTag = nullJsonTag;
    exports2.nullYaml11Tag = nullYaml11Tag;
    exports2.omapTag = omapTag;
    exports2.pairsTag = pairsTag;
    exports2.parseEvents = parseEvents;
    exports2.present = present;
    exports2.realMapTag = realMapTag;
    exports2.seqTag = seqTag;
    exports2.setTag = setTag;
    exports2.strTag = strTag;
    exports2.timestampTag = timestampTag;
    exports2.visit = visit;
  }
});

// node_modules/picomatch/lib/constants.js
var require_constants = __commonJS({
  "node_modules/picomatch/lib/constants.js"(exports2, module2) {
    "use strict";
    var WIN_SLASH = "\\\\/";
    var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
    var DEFAULT_MAX_EXTGLOB_RECURSION = 0;
    var DOT_LITERAL = "\\.";
    var PLUS_LITERAL = "\\+";
    var QMARK_LITERAL = "\\?";
    var SLASH_LITERAL = "\\/";
    var ONE_CHAR = "(?=.)";
    var QMARK = "[^/]";
    var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
    var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
    var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
    var NO_DOT = `(?!${DOT_LITERAL})`;
    var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
    var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
    var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
    var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
    var STAR = `${QMARK}*?`;
    var SEP = "/";
    var POSIX_CHARS = {
      DOT_LITERAL,
      PLUS_LITERAL,
      QMARK_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      QMARK,
      END_ANCHOR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR,
      SEP
    };
    var WINDOWS_CHARS = {
      ...POSIX_CHARS,
      SLASH_LITERAL: `[${WIN_SLASH}]`,
      QMARK: WIN_NO_SLASH,
      STAR: `${WIN_NO_SLASH}*?`,
      DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
      NO_DOT: `(?!${DOT_LITERAL})`,
      NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
      NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
      START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
      END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
      SEP: "\\"
    };
    var POSIX_REGEX_SOURCE = {
      __proto__: null,
      alnum: "a-zA-Z0-9",
      alpha: "a-zA-Z",
      ascii: "\\x00-\\x7F",
      blank: " \\t",
      cntrl: "\\x00-\\x1F\\x7F",
      digit: "0-9",
      graph: "\\x21-\\x7E",
      lower: "a-z",
      print: "\\x20-\\x7E ",
      punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
      space: " \\t\\r\\n\\v\\f",
      upper: "A-Z",
      word: "A-Za-z0-9_",
      xdigit: "A-Fa-f0-9"
    };
    module2.exports = {
      DEFAULT_MAX_EXTGLOB_RECURSION,
      MAX_LENGTH: 1024 * 64,
      POSIX_REGEX_SOURCE,
      // regular expressions
      REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
      REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
      REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
      REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
      REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
      REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
      // Replace globs with equivalent patterns to reduce parsing time.
      REPLACEMENTS: {
        __proto__: null,
        "***": "*",
        "**/**": "**",
        "**/**/**": "**"
      },
      // Digits
      CHAR_0: 48,
      /* 0 */
      CHAR_9: 57,
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: 65,
      /* A */
      CHAR_LOWERCASE_A: 97,
      /* a */
      CHAR_UPPERCASE_Z: 90,
      /* Z */
      CHAR_LOWERCASE_Z: 122,
      /* z */
      CHAR_LEFT_PARENTHESES: 40,
      /* ( */
      CHAR_RIGHT_PARENTHESES: 41,
      /* ) */
      CHAR_ASTERISK: 42,
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: 38,
      /* & */
      CHAR_AT: 64,
      /* @ */
      CHAR_BACKWARD_SLASH: 92,
      /* \ */
      CHAR_CARRIAGE_RETURN: 13,
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: 94,
      /* ^ */
      CHAR_COLON: 58,
      /* : */
      CHAR_COMMA: 44,
      /* , */
      CHAR_DOT: 46,
      /* . */
      CHAR_DOUBLE_QUOTE: 34,
      /* " */
      CHAR_EQUAL: 61,
      /* = */
      CHAR_EXCLAMATION_MARK: 33,
      /* ! */
      CHAR_FORM_FEED: 12,
      /* \f */
      CHAR_FORWARD_SLASH: 47,
      /* / */
      CHAR_GRAVE_ACCENT: 96,
      /* ` */
      CHAR_HASH: 35,
      /* # */
      CHAR_HYPHEN_MINUS: 45,
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: 60,
      /* < */
      CHAR_LEFT_CURLY_BRACE: 123,
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: 91,
      /* [ */
      CHAR_LINE_FEED: 10,
      /* \n */
      CHAR_NO_BREAK_SPACE: 160,
      /* \u00A0 */
      CHAR_PERCENT: 37,
      /* % */
      CHAR_PLUS: 43,
      /* + */
      CHAR_QUESTION_MARK: 63,
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: 62,
      /* > */
      CHAR_RIGHT_CURLY_BRACE: 125,
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: 93,
      /* ] */
      CHAR_SEMICOLON: 59,
      /* ; */
      CHAR_SINGLE_QUOTE: 39,
      /* ' */
      CHAR_SPACE: 32,
      /*   */
      CHAR_TAB: 9,
      /* \t */
      CHAR_UNDERSCORE: 95,
      /* _ */
      CHAR_VERTICAL_LINE: 124,
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
      /* \uFEFF */
      /**
       * Create EXTGLOB_CHARS
       */
      extglobChars(chars) {
        return {
          "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})` },
          "?": { type: "qmark", open: "(?:", close: ")?" },
          "+": { type: "plus", open: "(?:", close: ")+" },
          "*": { type: "star", open: "(?:", close: ")*" },
          "@": { type: "at", open: "(?:", close: ")" }
        };
      },
      /**
       * Create GLOB_CHARS
       */
      globChars(win32) {
        return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
      }
    };
  }
});

// node_modules/picomatch/lib/utils.js
var require_utils = __commonJS({
  "node_modules/picomatch/lib/utils.js"(exports2) {
    "use strict";
    var {
      REGEX_BACKSLASH,
      REGEX_REMOVE_BACKSLASH,
      REGEX_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_GLOBAL
    } = require_constants();
    exports2.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    exports2.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
    exports2.isRegexChar = (str) => str.length === 1 && exports2.hasRegexChars(str);
    exports2.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
    exports2.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
    exports2.isWindows = () => {
      if (typeof navigator !== "undefined" && navigator.platform) {
        const platform = navigator.platform.toLowerCase();
        return platform === "win32" || platform === "windows";
      }
      if (typeof process !== "undefined" && process.platform) {
        return process.platform === "win32";
      }
      return false;
    };
    exports2.removeBackslashes = (str) => {
      return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
        return match === "\\" ? "" : match;
      });
    };
    exports2.escapeLast = (input, char, lastIdx) => {
      const idx = input.lastIndexOf(char, lastIdx);
      if (idx === -1) return input;
      if (input[idx - 1] === "\\") return exports2.escapeLast(input, char, idx - 1);
      return `${input.slice(0, idx)}\\${input.slice(idx)}`;
    };
    exports2.removePrefix = (input, state = {}) => {
      let output = input;
      if (output.startsWith("./")) {
        output = output.slice(2);
        state.prefix = "./";
      }
      return output;
    };
    exports2.wrapOutput = (input, state = {}, options = {}) => {
      const prepend = options.contains ? "" : "^";
      const append = options.contains ? "" : "$";
      let output = `${prepend}(?:${input})${append}`;
      if (state.negated === true) {
        output = `(?:^(?!${output}).*$)`;
      }
      return output;
    };
    exports2.basename = (path, { windows } = {}) => {
      const segs = path.split(windows ? /[\\/]/ : "/");
      const last = segs[segs.length - 1];
      if (last === "") {
        return segs[segs.length - 2];
      }
      return last;
    };
  }
});

// node_modules/picomatch/lib/scan.js
var require_scan = __commonJS({
  "node_modules/picomatch/lib/scan.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    var {
      CHAR_ASTERISK,
      /* * */
      CHAR_AT,
      /* @ */
      CHAR_BACKWARD_SLASH,
      /* \ */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_EXCLAMATION_MARK,
      /* ! */
      CHAR_FORWARD_SLASH,
      /* / */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_PLUS,
      /* + */
      CHAR_QUESTION_MARK,
      /* ? */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_RIGHT_SQUARE_BRACKET
      /* ] */
    } = require_constants();
    var isPathSeparator = (code) => {
      return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
    };
    var depth = (token) => {
      if (token.isPrefix !== true) {
        token.depth = token.isGlobstar ? Infinity : 1;
      }
    };
    var scan = (input, options) => {
      const opts = options || {};
      const length = input.length - 1;
      const scanToEnd = opts.parts === true || opts.tokens === true || opts.scanToEnd === true;
      const slashes = [];
      const tokens = [];
      const parts = [];
      let str = input;
      let index = -1;
      let start = 0;
      let lastIndex = 0;
      let isBrace = false;
      let isBracket = false;
      let isGlob = false;
      let isExtglob = false;
      let isGlobstar = false;
      let braceEscaped = false;
      let backslashes = false;
      let negated = false;
      let negatedExtglob = false;
      let finished = false;
      let braces = 0;
      let prev;
      let code;
      let token = { value: "", depth: 0, isGlob: false };
      const eos = () => index >= length;
      const peek = () => str.charCodeAt(index + 1);
      const advance = () => {
        prev = code;
        return str.charCodeAt(++index);
      };
      while (index < length) {
        code = advance();
        let next;
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braceEscaped = true;
          }
          continue;
        }
        if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (code === CHAR_LEFT_CURLY_BRACE) {
              braces++;
              continue;
            }
            if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (braceEscaped !== true && code === CHAR_COMMA) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (code === CHAR_RIGHT_CURLY_BRACE) {
              braces--;
              if (braces === 0) {
                braceEscaped = false;
                isBrace = token.isBrace = true;
                finished = true;
                break;
              }
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_FORWARD_SLASH) {
          slashes.push(index);
          tokens.push(token);
          token = { value: "", depth: 0, isGlob: false };
          if (finished === true) continue;
          if (prev === CHAR_DOT && index === start + 1) {
            start += 2;
            continue;
          }
          lastIndex = index + 1;
          continue;
        }
        if (opts.noext !== true) {
          const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
          if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            isExtglob = token.isExtglob = true;
            finished = true;
            if (code === CHAR_EXCLAMATION_MARK && index === start) {
              negatedExtglob = true;
            }
            if (scanToEnd === true) {
              let parens = 0;
              while (eos() !== true && (code = advance())) {
                if (code === CHAR_BACKWARD_SLASH) {
                  backslashes = token.backslashes = true;
                  advance();
                  continue;
                }
                if (code === CHAR_LEFT_PARENTHESES) {
                  parens++;
                  continue;
                }
                if (code === CHAR_RIGHT_PARENTHESES && --parens === 0) {
                  finished = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
        }
        if (code === CHAR_ASTERISK) {
          if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_QUESTION_MARK) {
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_LEFT_SQUARE_BRACKET) {
          while (eos() !== true && (next = advance())) {
            if (next === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              isBracket = token.isBracket = true;
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
          negated = token.negated = true;
          start++;
          continue;
        }
        if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          if (scanToEnd === true) {
            let parens = 1;
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_BACKWARD_SLASH) {
                backslashes = token.backslashes = true;
                advance();
                continue;
              }
              if (code === CHAR_LEFT_PARENTHESES) {
                parens++;
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES && --parens === 0) {
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
        if (isGlob === true) {
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
      if (opts.noext === true) {
        isExtglob = false;
        isGlob = false;
      }
      let base = str;
      let prefix = "";
      let glob = "";
      if (start > 0) {
        prefix = str.slice(0, start);
        str = str.slice(start);
        lastIndex -= start;
      }
      if (base && isGlob === true && lastIndex > 0) {
        base = str.slice(0, lastIndex);
        glob = str.slice(lastIndex);
      } else if (isGlob === true) {
        base = "";
        glob = str;
      } else {
        base = str;
      }
      if (base && base !== "" && base !== "/" && base !== str) {
        if (isPathSeparator(base.charCodeAt(base.length - 1))) {
          base = base.slice(0, -1);
        }
      }
      if (opts.unescape === true) {
        if (glob) glob = utils.removeBackslashes(glob);
        if (base && backslashes === true) {
          base = utils.removeBackslashes(base);
        }
      }
      const state = {
        prefix,
        input,
        start,
        base,
        glob,
        isBrace,
        isBracket,
        isGlob,
        isExtglob,
        isGlobstar,
        negated,
        negatedExtglob
      };
      if (opts.tokens === true) {
        state.maxDepth = 0;
        if (!isPathSeparator(code)) {
          tokens.push(token);
        }
        state.tokens = tokens;
      }
      if (opts.parts === true || opts.tokens === true) {
        let prevIndex;
        for (let idx = 0; idx < slashes.length; idx++) {
          const n2 = prevIndex !== void 0 ? prevIndex + 1 : start;
          const i = slashes[idx];
          const value2 = input.slice(n2, i);
          if (opts.tokens) {
            if (idx === 0 && start !== 0) {
              tokens[idx].isPrefix = true;
              tokens[idx].value = prefix;
            } else {
              tokens[idx].value = value2;
            }
            depth(tokens[idx]);
            state.maxDepth += tokens[idx].depth;
          }
          if (i >= start) {
            parts.push(value2);
            prevIndex = i;
          }
        }
        const n = prevIndex !== void 0 ? prevIndex + 1 : start;
        const value = input.slice(n);
        parts.push(value);
        if (opts.tokens && prevIndex && prevIndex + 1 < input.length) {
          tokens[tokens.length - 1].value = value;
          depth(tokens[tokens.length - 1]);
          state.maxDepth += tokens[tokens.length - 1].depth;
        }
        state.slashes = slashes;
        state.parts = parts;
      }
      return state;
    };
    module2.exports = scan;
  }
});

// node_modules/picomatch/lib/parse.js
var require_parse = __commonJS({
  "node_modules/picomatch/lib/parse.js"(exports2, module2) {
    "use strict";
    var constants = require_constants();
    var utils = require_utils();
    var {
      MAX_LENGTH,
      POSIX_REGEX_SOURCE,
      REGEX_NON_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_BACKREF,
      REPLACEMENTS
    } = constants;
    var expandRange = (args, options) => {
      if (typeof options.expandRange === "function") {
        return options.expandRange(...args, options);
      }
      args.sort();
      const value = `[${args.join("-")}]`;
      try {
        new RegExp(value);
      } catch (ex) {
        return args.map((v) => utils.escapeRegex(v)).join("..");
      }
      return value;
    };
    var syntaxError = (type, char) => {
      return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };
    var splitTopLevel = (input) => {
      const parts = [];
      let bracket = 0;
      let paren = 0;
      let quote = 0;
      let value = "";
      let escaped = false;
      for (const ch of input) {
        if (escaped === true) {
          value += ch;
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          value += ch;
          escaped = true;
          continue;
        }
        if (ch === '"') {
          quote = quote === 1 ? 0 : 1;
          value += ch;
          continue;
        }
        if (quote === 0) {
          if (ch === "[") {
            bracket++;
          } else if (ch === "]" && bracket > 0) {
            bracket--;
          } else if (bracket === 0) {
            if (ch === "(") {
              paren++;
            } else if (ch === ")" && paren > 0) {
              paren--;
            } else if (ch === "|" && paren === 0) {
              parts.push(value);
              value = "";
              continue;
            }
          }
        }
        value += ch;
      }
      parts.push(value);
      return parts;
    };
    var isPlainBranch = (branch) => {
      let escaped = false;
      for (const ch of branch) {
        if (escaped === true) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (/[?*+@!()[\]{}]/.test(ch)) {
          return false;
        }
      }
      return true;
    };
    var normalizeSimpleBranch = (branch) => {
      let value = branch.trim();
      let changed = true;
      while (changed === true) {
        changed = false;
        if (/^@\([^\\()[\]{}|]+\)$/.test(value)) {
          value = value.slice(2, -1);
          changed = true;
        }
      }
      if (!isPlainBranch(value)) {
        return;
      }
      return value.replace(/\\(.)/g, "$1");
    };
    var hasRepeatedCharPrefixOverlap = (branches) => {
      const values = branches.map(normalizeSimpleBranch).filter(Boolean);
      for (let i = 0; i < values.length; i++) {
        for (let j = i + 1; j < values.length; j++) {
          const a = values[i];
          const b = values[j];
          const char = a[0];
          if (!char || a !== char.repeat(a.length) || b !== char.repeat(b.length)) {
            continue;
          }
          if (a === b || a.startsWith(b) || b.startsWith(a)) {
            return true;
          }
        }
      }
      return false;
    };
    var parseRepeatedExtglob = (pattern, requireEnd = true) => {
      if (pattern[0] !== "+" && pattern[0] !== "*" || pattern[1] !== "(") {
        return;
      }
      let bracket = 0;
      let paren = 0;
      let quote = 0;
      let escaped = false;
      for (let i = 1; i < pattern.length; i++) {
        const ch = pattern[i];
        if (escaped === true) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (ch === '"') {
          quote = quote === 1 ? 0 : 1;
          continue;
        }
        if (quote === 1) {
          continue;
        }
        if (ch === "[") {
          bracket++;
          continue;
        }
        if (ch === "]" && bracket > 0) {
          bracket--;
          continue;
        }
        if (bracket > 0) {
          continue;
        }
        if (ch === "(") {
          paren++;
          continue;
        }
        if (ch === ")") {
          paren--;
          if (paren === 0) {
            if (requireEnd === true && i !== pattern.length - 1) {
              return;
            }
            return {
              type: pattern[0],
              body: pattern.slice(2, i),
              end: i
            };
          }
        }
      }
    };
    var buildCharClassStar = (chars) => {
      const source = chars.length === 1 ? utils.escapeRegex(chars[0]) : `[${chars.map((ch) => utils.escapeRegex(ch)).join("")}]`;
      return `${source}*`;
    };
    var getStarExtglobSequenceChars = (pattern) => {
      let index = 0;
      const chars = [];
      while (index < pattern.length) {
        const match = parseRepeatedExtglob(pattern.slice(index), false);
        if (!match || match.type !== "*") {
          return;
        }
        const branches = splitTopLevel(match.body).map((branch2) => branch2.trim());
        if (branches.length !== 1) {
          return;
        }
        const branch = normalizeSimpleBranch(branches[0]);
        if (!branch || branch.length !== 1) {
          return;
        }
        chars.push(branch);
        index += match.end + 1;
      }
      if (chars.length < 1) {
        return;
      }
      return chars;
    };
    var repeatedExtglobRecursion = (pattern) => {
      let depth = 0;
      let value = pattern.trim();
      let match = parseRepeatedExtglob(value);
      while (match) {
        depth++;
        value = match.body.trim();
        match = parseRepeatedExtglob(value);
      }
      return depth;
    };
    var analyzeRepeatedExtglob = (body, options) => {
      if (options.maxExtglobRecursion === false) {
        return { risky: false };
      }
      const max = typeof options.maxExtglobRecursion === "number" ? options.maxExtglobRecursion : constants.DEFAULT_MAX_EXTGLOB_RECURSION;
      const branches = splitTopLevel(body).map((branch) => branch.trim());
      if (branches.length > 1) {
        if (branches.some((branch) => branch === "") || branches.some((branch) => /^[*?]+$/.test(branch)) || hasRepeatedCharPrefixOverlap(branches)) {
          return { risky: true };
        }
      }
      const safeChars = [];
      let sawStarSequence = false;
      let combinable = true;
      for (const branch of branches) {
        const chars = getStarExtglobSequenceChars(branch);
        if (chars) {
          sawStarSequence = true;
          safeChars.push(...chars);
          continue;
        }
        const literal = normalizeSimpleBranch(branch);
        if (literal && literal.length === 1) {
          safeChars.push(literal);
          continue;
        }
        combinable = false;
        if (repeatedExtglobRecursion(branch) > max) {
          return { risky: true };
        }
      }
      if (sawStarSequence) {
        return combinable ? { risky: true, safeOutput: buildCharClassStar([...new Set(safeChars)]) } : { risky: true };
      }
      return { risky: false };
    };
    var parse = (input, options) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      input = REPLACEMENTS[input] || input;
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      let len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      const bos = { type: "bos", value: "", output: opts.prepend || "" };
      const tokens = [bos];
      const capture = opts.capture ? "" : "?:";
      const PLATFORM_CHARS = constants.globChars(opts.windows);
      const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
      const {
        DOT_LITERAL,
        PLUS_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOT_SLASH,
        NO_DOTS_SLASH,
        QMARK,
        QMARK_NO_DOT,
        STAR,
        START_ANCHOR
      } = PLATFORM_CHARS;
      const globstar = (opts2) => {
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const nodot = opts.dot ? "" : NO_DOT;
      const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
      let star = opts.bash === true ? globstar(opts) : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      if (typeof opts.noext === "boolean") {
        opts.noextglob = opts.noext;
      }
      const state = {
        input,
        index: -1,
        start: 0,
        dot: opts.dot === true,
        consumed: "",
        output: "",
        prefix: "",
        backtrack: false,
        negated: false,
        brackets: 0,
        braces: 0,
        parens: 0,
        quotes: 0,
        globstar: false,
        tokens
      };
      input = utils.removePrefix(input, state);
      len = input.length;
      const extglobs = [];
      const braces = [];
      const stack = [];
      let prev = bos;
      let value;
      const eos = () => state.index === len - 1;
      const peek = state.peek = (n = 1) => input[state.index + n];
      const advance = state.advance = () => input[++state.index] || "";
      const remaining = () => input.slice(state.index + 1);
      const consume = (value2 = "", num = 0) => {
        state.consumed += value2;
        state.index += num;
      };
      const append = (token) => {
        state.output += token.output != null ? token.output : token.value;
        consume(token.value);
      };
      const negate = () => {
        let count = 1;
        while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
          advance();
          state.start++;
          count++;
        }
        if (count % 2 === 0) {
          return false;
        }
        state.negated = true;
        state.start++;
        return true;
      };
      const increment = (type) => {
        state[type]++;
        stack.push(type);
      };
      const decrement = (type) => {
        state[type]--;
        stack.pop();
      };
      const push = (tok) => {
        if (prev.type === "globstar") {
          const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
          const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
          if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
            state.output = state.output.slice(0, -prev.output.length);
            prev.type = "star";
            prev.value = "*";
            prev.output = star;
            state.output += prev.output;
          }
        }
        if (extglobs.length && tok.type !== "paren") {
          extglobs[extglobs.length - 1].inner += tok.value;
        }
        if (tok.value || tok.output) append(tok);
        if (prev && prev.type === "text" && tok.type === "text") {
          prev.output = (prev.output || prev.value) + tok.value;
          prev.value += tok.value;
          return;
        }
        tok.prev = prev;
        tokens.push(tok);
        prev = tok;
      };
      const extglobOpen = (type, value2) => {
        const token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
        token.prev = prev;
        token.parens = state.parens;
        token.output = state.output;
        token.startIndex = state.index;
        token.tokensIndex = tokens.length;
        const output = (opts.capture ? "(" : "") + token.open;
        increment("parens");
        push({ type, value: value2, output: state.output ? "" : ONE_CHAR });
        push({ type: "paren", extglob: true, value: advance(), output });
        extglobs.push(token);
      };
      const extglobClose = (token) => {
        const literal = input.slice(token.startIndex, state.index + 1);
        const body = input.slice(token.startIndex + 2, state.index);
        const analysis = analyzeRepeatedExtglob(body, opts);
        if ((token.type === "plus" || token.type === "star") && analysis.risky) {
          const safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : void 0;
          const open = tokens[token.tokensIndex];
          open.type = "text";
          open.value = literal;
          open.output = safeOutput || utils.escapeRegex(literal);
          for (let i = token.tokensIndex + 1; i < tokens.length; i++) {
            tokens[i].value = "";
            tokens[i].output = "";
            delete tokens[i].suffix;
          }
          state.output = token.output + open.output;
          state.backtrack = true;
          push({ type: "paren", extglob: true, value, output: "" });
          decrement("parens");
          return;
        }
        let output = token.close + (opts.capture ? ")" : "");
        let rest;
        if (token.type === "negate") {
          let extglobStar = star;
          if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
            extglobStar = globstar(opts);
          }
          if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
            output = token.close = `)$))${extglobStar}`;
          }
          if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
            const expression = parse(rest, { ...options, fastpaths: false }).output;
            output = token.close = `)${expression})${extglobStar})`;
          }
          if (token.prev.type === "bos") {
            state.negatedExtglob = true;
          }
        }
        push({ type: "paren", extglob: true, value, output });
        decrement("parens");
      };
      if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
        let backslashes = false;
        let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
          if (first === "\\") {
            backslashes = true;
            return m;
          }
          if (first === "?") {
            if (esc) {
              return esc + first + (rest ? QMARK.repeat(rest.length) : "");
            }
            if (index === 0) {
              return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
            }
            return QMARK.repeat(chars.length);
          }
          if (first === ".") {
            return DOT_LITERAL.repeat(chars.length);
          }
          if (first === "*") {
            if (esc) {
              return esc + first + (rest ? star : "");
            }
            return star;
          }
          return esc ? m : `\\${m}`;
        });
        if (backslashes === true) {
          if (opts.unescape === true) {
            output = output.replace(/\\/g, "");
          } else {
            output = output.replace(/\\+/g, (m) => {
              return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
            });
          }
        }
        if (output === input && opts.contains === true) {
          state.output = input;
          return state;
        }
        state.output = utils.wrapOutput(output, state, options);
        return state;
      }
      while (!eos()) {
        value = advance();
        if (value === "\0") {
          continue;
        }
        if (value === "\\") {
          const next = peek();
          if (next === "/" && opts.bash !== true) {
            continue;
          }
          if (next === "." || next === ";") {
            continue;
          }
          if (!next) {
            value += "\\";
            push({ type: "text", value });
            continue;
          }
          const match = /^\\+/.exec(remaining());
          let slashes = 0;
          if (match && match[0].length > 2) {
            slashes = match[0].length;
            state.index += slashes;
            if (slashes % 2 !== 0) {
              value += "\\";
            }
          }
          if (opts.unescape === true) {
            value = advance();
          } else {
            value += advance();
          }
          if (state.brackets === 0) {
            push({ type: "text", value });
            continue;
          }
        }
        if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
          if (opts.posix !== false && value === ":") {
            const inner = prev.value.slice(1);
            if (inner.includes("[")) {
              prev.posix = true;
              if (inner.includes(":")) {
                const idx = prev.value.lastIndexOf("[");
                const pre = prev.value.slice(0, idx);
                const rest2 = prev.value.slice(idx + 2);
                const posix = POSIX_REGEX_SOURCE[rest2];
                if (posix) {
                  prev.value = pre + posix;
                  state.backtrack = true;
                  advance();
                  if (!bos.output && tokens.indexOf(prev) === 1) {
                    bos.output = ONE_CHAR;
                  }
                  continue;
                }
              }
            }
          }
          if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
            value = `\\${value}`;
          }
          if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
            value = `\\${value}`;
          }
          if (opts.posix === true && value === "!" && prev.value === "[") {
            value = "^";
          }
          prev.value += value;
          append({ value });
          continue;
        }
        if (state.quotes === 1 && value !== '"') {
          value = utils.escapeRegex(value);
          prev.value += value;
          append({ value });
          continue;
        }
        if (value === '"') {
          state.quotes = state.quotes === 1 ? 0 : 1;
          if (opts.keepQuotes === true) {
            push({ type: "text", value });
          }
          continue;
        }
        if (value === "(") {
          increment("parens");
          push({ type: "paren", value });
          continue;
        }
        if (value === ")") {
          if (state.parens === 0 && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "("));
          }
          const extglob = extglobs[extglobs.length - 1];
          if (extglob && state.parens === extglob.parens + 1) {
            extglobClose(extglobs.pop());
            continue;
          }
          push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
          decrement("parens");
          continue;
        }
        if (value === "[") {
          if (opts.nobracket === true || !remaining().includes("]")) {
            if (opts.nobracket !== true && opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("closing", "]"));
            }
            value = `\\${value}`;
          } else {
            increment("brackets");
          }
          push({ type: "bracket", value });
          continue;
        }
        if (value === "]") {
          if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          if (state.brackets === 0) {
            if (opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("opening", "["));
            }
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          decrement("brackets");
          const prevValue = prev.value.slice(1);
          if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
            value = `/${value}`;
          }
          prev.value += value;
          append({ value });
          if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
            continue;
          }
          const escaped = utils.escapeRegex(prev.value);
          state.output = state.output.slice(0, -prev.value.length);
          if (opts.literalBrackets === true) {
            state.output += escaped;
            prev.value = escaped;
            continue;
          }
          prev.value = `(${capture}${escaped}|${prev.value})`;
          state.output += prev.value;
          continue;
        }
        if (value === "{" && opts.nobrace !== true) {
          increment("braces");
          const open = {
            type: "brace",
            value,
            output: "(",
            outputIndex: state.output.length,
            tokensIndex: state.tokens.length
          };
          braces.push(open);
          push(open);
          continue;
        }
        if (value === "}") {
          const brace = braces[braces.length - 1];
          if (opts.nobrace === true || !brace) {
            push({ type: "text", value, output: value });
            continue;
          }
          let output = ")";
          if (brace.dots === true) {
            const arr = tokens.slice();
            const range = [];
            for (let i = arr.length - 1; i >= 0; i--) {
              tokens.pop();
              if (arr[i].type === "brace") {
                break;
              }
              if (arr[i].type !== "dots") {
                range.unshift(arr[i].value);
              }
            }
            output = expandRange(range, opts);
            state.backtrack = true;
          }
          if (brace.comma !== true && brace.dots !== true) {
            const out = state.output.slice(0, brace.outputIndex);
            const toks = state.tokens.slice(brace.tokensIndex);
            brace.value = brace.output = "\\{";
            value = output = "\\}";
            state.output = out;
            for (const t of toks) {
              state.output += t.output || t.value;
            }
          }
          push({ type: "brace", value, output });
          decrement("braces");
          braces.pop();
          continue;
        }
        if (value === "|") {
          if (extglobs.length > 0) {
            extglobs[extglobs.length - 1].conditions++;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === ",") {
          let output = value;
          const brace = braces[braces.length - 1];
          if (brace && stack[stack.length - 1] === "braces") {
            brace.comma = true;
            output = "|";
          }
          push({ type: "comma", value, output });
          continue;
        }
        if (value === "/") {
          if (prev.type === "dot" && state.index === state.start + 1) {
            state.start = state.index + 1;
            state.consumed = "";
            state.output = "";
            tokens.pop();
            prev = bos;
            continue;
          }
          push({ type: "slash", value, output: SLASH_LITERAL });
          continue;
        }
        if (value === ".") {
          if (state.braces > 0 && prev.type === "dot") {
            if (prev.value === ".") prev.output = DOT_LITERAL;
            const brace = braces[braces.length - 1];
            prev.type = "dots";
            prev.output += value;
            prev.value += value;
            brace.dots = true;
            continue;
          }
          if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
            push({ type: "text", value, output: DOT_LITERAL });
            continue;
          }
          push({ type: "dot", value, output: DOT_LITERAL });
          continue;
        }
        if (value === "?") {
          const isGroup = prev && prev.value === "(";
          if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("qmark", value);
            continue;
          }
          if (prev && prev.type === "paren") {
            const next = peek();
            let output = value;
            if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
              output = `\\${value}`;
            }
            push({ type: "text", value, output });
            continue;
          }
          if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
            push({ type: "qmark", value, output: QMARK_NO_DOT });
            continue;
          }
          push({ type: "qmark", value, output: QMARK });
          continue;
        }
        if (value === "!") {
          if (opts.noextglob !== true && peek() === "(") {
            if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
              extglobOpen("negate", value);
              continue;
            }
          }
          if (opts.nonegate !== true && state.index === 0) {
            negate();
            continue;
          }
        }
        if (value === "+") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("plus", value);
            continue;
          }
          if (prev && prev.value === "(" || opts.regex === false) {
            push({ type: "plus", value, output: PLUS_LITERAL });
            continue;
          }
          if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
            push({ type: "plus", value });
            continue;
          }
          push({ type: "plus", value: PLUS_LITERAL });
          continue;
        }
        if (value === "@") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            push({ type: "at", extglob: true, value, output: "" });
            continue;
          }
          push({ type: "text", value });
          continue;
        }
        if (value !== "*") {
          if (value === "$" || value === "^") {
            value = `\\${value}`;
          }
          const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
          if (match) {
            value += match[0];
            state.index += match[0].length;
          }
          push({ type: "text", value });
          continue;
        }
        if (prev && (prev.type === "globstar" || prev.star === true)) {
          prev.type = "star";
          prev.star = true;
          prev.value += value;
          prev.output = star;
          state.backtrack = true;
          state.globstar = true;
          consume(value);
          continue;
        }
        let rest = remaining();
        if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
          extglobOpen("star", value);
          continue;
        }
        if (prev.type === "star") {
          if (opts.noglobstar === true) {
            consume(value);
            continue;
          }
          const prior = prev.prev;
          const before = prior.prev;
          const isStart = prior.type === "slash" || prior.type === "bos";
          const afterStar = before && (before.type === "star" || before.type === "globstar");
          if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
            push({ type: "star", value, output: "" });
            continue;
          }
          const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
          const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
          if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
            push({ type: "star", value, output: "" });
            continue;
          }
          while (rest.slice(0, 3) === "/**") {
            const after = input[state.index + 4];
            if (after && after !== "/") {
              break;
            }
            rest = rest.slice(3);
            consume("/**", 3);
          }
          const isEnd = eos() || state.parens > 0 && rest === ")".repeat(state.parens) && !extglobs.some((extglob) => extglob.type === "negate");
          if (prior.type === "bos" && eos()) {
            prev.type = "globstar";
            prev.value += value;
            prev.output = globstar(opts);
            state.output = prev.output;
            state.globstar = true;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && isEnd) {
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
            prev.value += value;
            state.globstar = true;
            state.output += prior.output + prev.output;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
            const end = rest[1] !== void 0 ? "|$" : "";
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
            prev.value += value;
            state.output += prior.output + prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          if (prior.type === "bos" && rest[0] === "/") {
            prev.type = "globstar";
            prev.value += value;
            prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
            state.output = prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "globstar";
          prev.output = globstar(opts);
          prev.value += value;
          state.output += prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        const token = { type: "star", value, output: star };
        if (opts.bash === true) {
          token.output = ".*?";
          if (prev.type === "bos" || prev.type === "slash") {
            token.output = nodot + token.output;
          }
          push(token);
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
          token.output = value;
          push(token);
          continue;
        }
        if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
          if (prev.type === "dot") {
            state.output += NO_DOT_SLASH;
            prev.output += NO_DOT_SLASH;
          } else if (opts.dot === true) {
            state.output += NO_DOTS_SLASH;
            prev.output += NO_DOTS_SLASH;
          } else {
            state.output += nodot;
            prev.output += nodot;
          }
          if (peek() !== "*") {
            state.output += ONE_CHAR;
            prev.output += ONE_CHAR;
          }
        }
        push(token);
      }
      while (state.brackets > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
        state.output = utils.escapeLast(state.output, "[");
        decrement("brackets");
      }
      while (state.parens > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
        state.output = utils.escapeLast(state.output, "(");
        decrement("parens");
      }
      while (state.braces > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
        state.output = utils.escapeLast(state.output, "{");
        decrement("braces");
      }
      if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
        push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
      }
      if (state.backtrack === true) {
        state.output = "";
        for (const token of state.tokens) {
          state.output += token.output != null ? token.output : token.value;
          if (token.suffix) {
            state.output += token.suffix;
          }
        }
      }
      return state;
    };
    parse.fastpaths = (input, options) => {
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      const len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      input = REPLACEMENTS[input] || input;
      const {
        DOT_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOTS,
        NO_DOTS_SLASH,
        STAR,
        START_ANCHOR
      } = constants.globChars(opts.windows);
      const nodot = opts.dot ? NO_DOTS : NO_DOT;
      const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
      const capture = opts.capture ? "" : "?:";
      const state = { negated: false, prefix: "" };
      let star = opts.bash === true ? ".*?" : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      const globstar = (opts2) => {
        if (opts2.noglobstar === true) return star;
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const create = (str) => {
        switch (str) {
          case "*":
            return `${nodot}${ONE_CHAR}${star}`;
          case ".*":
            return `${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*.*":
            return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*/*":
            return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
          case "**":
            return nodot + globstar(opts);
          case "**/*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
          case "**/*.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "**/.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
          default: {
            const match = /^(.*?)\.(\w+)$/.exec(str);
            if (!match) return;
            const source2 = create(match[1]);
            if (!source2) return;
            return source2 + DOT_LITERAL + match[2];
          }
        }
      };
      const output = utils.removePrefix(input, state);
      let source = create(output);
      if (source && opts.strictSlashes !== true) {
        source += `${SLASH_LITERAL}?`;
      }
      return source;
    };
    module2.exports = parse;
  }
});

// node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS({
  "node_modules/picomatch/lib/picomatch.js"(exports2, module2) {
    "use strict";
    var scan = require_scan();
    var parse = require_parse();
    var utils = require_utils();
    var constants = require_constants();
    var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
    var picomatch2 = (glob, options, returnState = false) => {
      if (Array.isArray(glob)) {
        const fns = glob.map((input) => picomatch2(input, options, returnState));
        const arrayMatcher = (str) => {
          for (const isMatch of fns) {
            const state2 = isMatch(str);
            if (state2) return state2;
          }
          return false;
        };
        return arrayMatcher;
      }
      const isState = isObject(glob) && glob.tokens && glob.input;
      if (glob === "" || typeof glob !== "string" && !isState) {
        throw new TypeError("Expected pattern to be a non-empty string");
      }
      const opts = options || {};
      const posix = opts.windows;
      const regex = isState ? picomatch2.compileRe(glob, options) : picomatch2.makeRe(glob, options, false, true);
      const state = regex.state;
      delete regex.state;
      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch2(opts.ignore, ignoreOpts, returnState);
      }
      const matcher = (input, returnObject = false) => {
        const { isMatch, match, output } = picomatch2.test(input, regex, options, { glob, posix });
        const result = { glob, state, regex, posix, input, output, match, isMatch };
        if (typeof opts.onResult === "function") {
          opts.onResult(result);
        }
        if (isMatch === false) {
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (isIgnored(input)) {
          if (typeof opts.onIgnore === "function") {
            opts.onIgnore(result);
          }
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (typeof opts.onMatch === "function") {
          opts.onMatch(result);
        }
        return returnObject ? result : true;
      };
      if (returnState) {
        matcher.state = state;
      }
      return matcher;
    };
    picomatch2.test = (input, regex, options, { glob, posix } = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected input to be a string");
      }
      if (input === "") {
        return { isMatch: false, output: "" };
      }
      const opts = options || {};
      const format = opts.format || (posix ? utils.toPosixSlashes : null);
      let match = input === glob;
      let output = match && format ? format(input) : input;
      if (match === false) {
        output = format ? format(input) : input;
        match = output === glob;
      }
      if (match === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) {
          match = picomatch2.matchBase(input, regex, options, posix);
        } else {
          match = regex.exec(output);
        }
      }
      return { isMatch: Boolean(match), match, output };
    };
    picomatch2.matchBase = (input, glob, options, posix = options && options.windows) => {
      const regex = glob instanceof RegExp ? glob : picomatch2.makeRe(glob, options);
      return regex.test(utils.basename(input, { windows: posix }));
    };
    picomatch2.isMatch = (str, patterns, options) => picomatch2(patterns, options)(str);
    picomatch2.parse = (pattern, options) => {
      if (Array.isArray(pattern)) return pattern.map((p) => picomatch2.parse(p, options));
      return parse(pattern, { ...options, fastpaths: false });
    };
    picomatch2.scan = (input, options) => scan(input, options);
    picomatch2.compileRe = (state, options, returnOutput = false, returnState = false) => {
      if (returnOutput === true) {
        return state.output;
      }
      const opts = options || {};
      const prepend = opts.contains ? "" : "^";
      const append = opts.contains ? "" : "$";
      let source = `${prepend}(?:${state.output})${append}`;
      if (state && state.negated === true) {
        source = `^(?!${source}).*$`;
      }
      const regex = picomatch2.toRegex(source, options);
      if (returnState === true) {
        regex.state = state;
      }
      return regex;
    };
    picomatch2.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
      if (!input || typeof input !== "string") {
        throw new TypeError("Expected a non-empty string");
      }
      let parsed = { negated: false, fastpaths: true };
      if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
        parsed.output = parse.fastpaths(input, options);
      }
      if (!parsed.output) {
        parsed = parse(input, options);
      }
      return picomatch2.compileRe(parsed, options, returnOutput, returnState);
    };
    picomatch2.toRegex = (source, options) => {
      try {
        const opts = options || {};
        return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
      } catch (err) {
        if (options && options.debug === true) throw err;
        return /$^/;
      }
    };
    picomatch2.constants = constants;
    module2.exports = picomatch2;
  }
});

// node_modules/picomatch/index.js
var require_picomatch2 = __commonJS({
  "node_modules/picomatch/index.js"(exports2, module2) {
    "use strict";
    var pico = require_picomatch();
    var utils = require_utils();
    function picomatch2(glob, options, returnState = false) {
      if (options && (options.windows === null || options.windows === void 0)) {
        options = { ...options, windows: utils.isWindows() };
      }
      return pico(glob, options, returnState);
    }
    Object.assign(picomatch2, pico);
    module2.exports = picomatch2;
  }
});

// src/index.cjs
var yaml = require_js_yaml_cjs();
var picomatch = require_picomatch2();
var SIZES = ["xs", "s", "m", "l", "xl"];
var DEFAULTS = {
  xs_label: "size/XS",
  xs_max_size: 15,
  s_label: "size/S",
  s_max_size: 100,
  m_label: "size/M",
  m_max_size: 500,
  l_label: "size/L",
  l_max_size: 1e3,
  xl_label: "size/XL",
  files_to_ignore: [],
  ignore_file_deletions: true,
  ignore_line_deletions: false,
  overwrite_other_size_labels: false,
  size_label_prefix: "size/",
  fail_if_xl: false,
  message_if_xl: "This PR has too many changes. Please make sure you are NOT addressing multiple issues with one PR.",
  dry_run: false
};
var DEFAULT_PATHS = [".github/size-labeler.yaml", ".github/size-labeler.yml"];
var COMMENT_MARKER = "<!-- tedilabs:github.pr.size-labeler:xl -->";
function parseConfig(text) {
  const documents = yaml.loadAll(text, { schema: yaml.JSON_SCHEMA });
  if (documents.length > 1) throw new Error("Size labeler configuration must contain only one YAML document.");
  const config = documents.length ? documents[0] : {};
  if (config === null || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("Size labeler configuration must be a YAML mapping.");
  }
  for (const key of Object.keys(config)) {
    if (!Object.hasOwn(DEFAULTS, key)) throw new Error(`Unknown configuration key: ${key}`);
  }
  return config;
}
function resolveOptions(inputs = {}, config = {}) {
  const options = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS)) {
    if (inputs[key] !== void 0 && (inputs[key] !== "" || ["message_if_xl", "files_to_ignore"].includes(key))) {
      options[key] = inputs[key];
    }
  }
  Object.assign(options, config);
  for (const [key, value] of Object.entries(DEFAULTS)) {
    if (typeof value === "boolean") {
      if (![true, false, "true", "false"].includes(options[key])) {
        throw new Error(`${key} must be true or false.`);
      }
      options[key] = options[key] === true || options[key] === "true";
    }
  }
  let previous = 0;
  const names = [];
  for (const size of SIZES) {
    const label = options[`${size}_label`];
    if (typeof label !== "string" || !label.trim() || label.length > 50) {
      throw new Error(`${size}_label must be a nonempty label of at most 50 characters.`);
    }
    names.push(label.toLowerCase());
    if (size === "xl") continue;
    const key = `${size}_max_size`;
    const raw = options[key];
    const limit = typeof raw === "number" || typeof raw === "string" && /^\d+$/.test(raw) ? Number(raw) : NaN;
    if (!Number.isSafeInteger(limit) || limit <= previous) {
      throw new Error("Size thresholds must be positive, strictly increasing integers.");
    }
    options[key] = limit;
    previous = limit;
  }
  if (new Set(names).size !== names.length) throw new Error("Size labels must be distinct (case-insensitive).");
  if (typeof options.size_label_prefix !== "string" || !options.size_label_prefix.trim()) {
    throw new Error("size_label_prefix must be a nonempty string.");
  }
  if (typeof options.message_if_xl !== "string") throw new Error("message_if_xl must be a string.");
  if (typeof options.files_to_ignore === "string") {
    options.files_to_ignore = (options.files_to_ignore.match(/"[^"]*"|'[^']*'|\S+/g) ?? []).map((pattern) => pattern.replace(/^(["'])(.*)\1$/, "$2"));
  }
  if (!Array.isArray(options.files_to_ignore) || options.files_to_ignore.some((p) => typeof p !== "string" || !p)) {
    throw new Error("files_to_ignore must be a string or a YAML list of nonempty glob patterns.");
  }
  return options;
}
async function loadConfig(github, repository, ref, explicitPath) {
  for (const path of explicitPath ? [explicitPath] : DEFAULT_PATHS) {
    let response;
    try {
      response = await github.rest.repos.getContent({ ...repository, ref, path });
    } catch (error) {
      if (error.status === 404 && !explicitPath) continue;
      throw error;
    }
    const file = response.data;
    if (file.type !== "file" || file.encoding !== "base64") {
      throw new Error(`Configuration must be a regular UTF-8 file smaller than 1 MB: ${path}`);
    }
    return { path, config: parseConfig(Buffer.from(file.content, "base64").toString("utf8")) };
  }
  return { path: "", config: {} };
}
function classify(lines, options) {
  return SIZES.find((size) => size === "xl" || lines < options[`${size}_max_size`]);
}
async function calculateSize(github, parameters, changedFiles, options) {
  const ignored = picomatch(options.files_to_ignore, { dot: true });
  let lines = 0;
  let files = 0;
  let seen = 0;
  for await (const page of github.paginate.iterator(github.rest.pulls.listFiles, { ...parameters, per_page: 100 })) {
    for (const file of page.data) {
      seen++;
      if (options.ignore_file_deletions && file.status === "removed" || ignored(file.filename)) continue;
      files++;
      lines += file.additions + (options.ignore_line_deletions ? 0 : file.deletions);
    }
  }
  const complete = seen === changedFiles;
  if (!complete && lines < options.l_max_size) {
    throw new Error(`Only ${seen} of ${changedFiles} changed files were returned; cannot assign an accurate size label.`);
  }
  return { lines, files, complete };
}
function labelChanges(existing, desired, options) {
  const managed = new Set(SIZES.map((size) => options[`${size}_label`].toLowerCase()));
  const prefix = options.size_label_prefix.toLowerCase();
  return {
    add: existing.some((name) => name.toLowerCase() === desired.toLowerCase()) ? [] : [desired],
    remove: existing.filter((name) => name.toLowerCase() !== desired.toLowerCase() && (managed.has(name.toLowerCase()) || options.overwrite_other_size_labels && name.toLowerCase().startsWith(prefix)))
  };
}
async function updateComment(github, parameters, message) {
  const body = `${COMMENT_MARKER}
${message}`;
  const { viewer } = await github.graphql("{ viewer { login } }");
  const comments = await github.paginate(github.rest.issues.listComments, { ...parameters, per_page: 100 });
  const existing = comments.find((comment) => comment.user?.login === viewer.login && comment.body?.startsWith(COMMENT_MARKER));
  if (!existing) {
    await github.rest.issues.createComment({ ...parameters, body });
  } else if (existing.body !== body) {
    await github.rest.issues.updateComment({ ...parameters, comment_id: existing.id, body });
  }
}
async function run({ github, context, core, inputs }) {
  const pull_number = Number(inputs.pr_number || context.payload.pull_request?.number);
  if (!Number.isSafeInteger(pull_number) || pull_number <= 0) {
    throw new Error("A pull request event or a positive pr_number input is required.");
  }
  const parameters = { ...context.repo, pull_number };
  const { data: pr } = await github.rest.pulls.get(parameters);
  const loaded = await loadConfig(github, context.repo, pr.base.sha, inputs.config_file);
  const options = resolveOptions(inputs, loaded.config);
  core.info(loaded.path ? `Configuration: ${loaded.path} at base ${pr.base.sha}` : "No configuration file; using action inputs.");
  const result = await calculateSize(github, parameters, pr.changed_files, options);
  const size = classify(result.lines, options);
  const label = options[`${size}_label`];
  core.info(`${result.complete ? "" : "At least "}${result.lines} changed lines in ${result.files} included files: ${label}`);
  if (!result.complete) core.warning("GitHub truncated the file list. Counts are lower bounds; the XL classification is certain.");
  const issue = { ...context.repo, issue_number: pull_number };
  const { data: latest } = await github.rest.pulls.get(parameters);
  if (latest.head.sha !== pr.head.sha || latest.base.sha !== pr.base.sha) {
    throw new Error("The PR changed during size calculation. Rerun the action for the current revision.");
  }
  const existing = await github.paginate(github.rest.issues.listLabelsOnIssue, { ...issue, per_page: 100 });
  const changes = labelChanges(existing.map((entry) => entry.name), label, options);
  const outputs = {
    size,
    label,
    changed_lines: result.lines,
    changed_files: result.files,
    count_complete: result.complete,
    config_file: loaded.path,
    added_labels: JSON.stringify(changes.add),
    removed_labels: JSON.stringify(changes.remove),
    dry_run: options.dry_run
  };
  for (const [key, value] of Object.entries(outputs)) core.setOutput(key, value);
  if (options.dry_run) {
    core.info(`Dry run: ${JSON.stringify(changes)}; no labels/comments changed and no XL failure enforced.`);
    return;
  }
  if (changes.add.length) await github.rest.issues.addLabels({ ...issue, labels: changes.add });
  for (const name of changes.remove) {
    try {
      await github.rest.issues.removeLabel({ ...issue, name });
    } catch (error) {
      if (error.status !== 404) throw error;
    }
  }
  if (size === "xl" && options.message_if_xl) await updateComment(github, issue, options.message_if_xl);
  if (size === "xl" && options.fail_if_xl) core.setFailed("The PR reaches the XL size threshold.");
}
module.exports = { DEFAULTS, parseConfig, resolveOptions, loadConfig, classify, calculateSize, labelChanges, run };
