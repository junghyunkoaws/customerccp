/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/sprintf-js/src/sprintf.js":
/*!************************************************!*\
  !*** ./node_modules/sprintf-js/src/sprintf.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

    var __WEBPACK_AMD_DEFINE_RESULT__;/* global window, exports, define */

    !function() {
        'use strict'
    
        var re = {
            not_string: /[^s]/,
            not_bool: /[^t]/,
            not_type: /[^T]/,
            not_primitive: /[^v]/,
            number: /[diefg]/,
            numeric_arg: /[bcdiefguxX]/,
            json: /[j]/,
            not_json: /[^j]/,
            text: /^[^\x25]+/,
            modulo: /^\x25{2}/,
            placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
            key: /^([a-z_][a-z_\d]*)/i,
            key_access: /^\.([a-z_][a-z_\d]*)/i,
            index_access: /^\[(\d+)\]/,
            sign: /^[+-]/
        }
    
        function sprintf(key) {
            // `arguments` is not an array, but should be fine for this call
            return sprintf_format(sprintf_parse(key), arguments)
        }
    
        function vsprintf(fmt, argv) {
            return sprintf.apply(null, [fmt].concat(argv || []))
        }
    
        function sprintf_format(parse_tree, argv) {
            var cursor = 1, tree_length = parse_tree.length, arg, output = '', i, k, ph, pad, pad_character, pad_length, is_positive, sign
            for (i = 0; i < tree_length; i++) {
                if (typeof parse_tree[i] === 'string') {
                    output += parse_tree[i]
                }
                else if (typeof parse_tree[i] === 'object') {
                    ph = parse_tree[i] // convenience purposes only
                    if (ph.keys) { // keyword argument
                        arg = argv[cursor]
                        for (k = 0; k < ph.keys.length; k++) {
                            if (arg == undefined) {
                                throw new Error(sprintf('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k-1]))
                            }
                            arg = arg[ph.keys[k]]
                        }
                    }
                    else if (ph.param_no) { // positional argument (explicit)
                        arg = argv[ph.param_no]
                    }
                    else { // positional argument (implicit)
                        arg = argv[cursor++]
                    }
    
                    if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {
                        arg = arg()
                    }
    
                    if (re.numeric_arg.test(ph.type) && (typeof arg !== 'number' && isNaN(arg))) {
                        throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg))
                    }
    
                    if (re.number.test(ph.type)) {
                        is_positive = arg >= 0
                    }
    
                    switch (ph.type) {
                        case 'b':
                            arg = parseInt(arg, 10).toString(2)
                            break
                        case 'c':
                            arg = String.fromCharCode(parseInt(arg, 10))
                            break
                        case 'd':
                        case 'i':
                            arg = parseInt(arg, 10)
                            break
                        case 'j':
                            arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0)
                            break
                        case 'e':
                            arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential()
                            break
                        case 'f':
                            arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg)
                            break
                        case 'g':
                            arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg)
                            break
                        case 'o':
                            arg = (parseInt(arg, 10) >>> 0).toString(8)
                            break
                        case 's':
                            arg = String(arg)
                            arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                            break
                        case 't':
                            arg = String(!!arg)
                            arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                            break
                        case 'T':
                            arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()
                            arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                            break
                        case 'u':
                            arg = parseInt(arg, 10) >>> 0
                            break
                        case 'v':
                            arg = arg.valueOf()
                            arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                            break
                        case 'x':
                            arg = (parseInt(arg, 10) >>> 0).toString(16)
                            break
                        case 'X':
                            arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase()
                            break
                    }
                    if (re.json.test(ph.type)) {
                        output += arg
                    }
                    else {
                        if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
                            sign = is_positive ? '+' : '-'
                            arg = arg.toString().replace(re.sign, '')
                        }
                        else {
                            sign = ''
                        }
                        pad_character = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' '
                        pad_length = ph.width - (sign + arg).length
                        pad = ph.width ? (pad_length > 0 ? pad_character.repeat(pad_length) : '') : ''
                        output += ph.align ? sign + arg + pad : (pad_character === '0' ? sign + pad + arg : pad + sign + arg)
                    }
                }
            }
            return output
        }
    
        var sprintf_cache = Object.create(null)
    
        function sprintf_parse(fmt) {
            if (sprintf_cache[fmt]) {
                return sprintf_cache[fmt]
            }
    
            var _fmt = fmt, match, parse_tree = [], arg_names = 0
            while (_fmt) {
                if ((match = re.text.exec(_fmt)) !== null) {
                    parse_tree.push(match[0])
                }
                else if ((match = re.modulo.exec(_fmt)) !== null) {
                    parse_tree.push('%')
                }
                else if ((match = re.placeholder.exec(_fmt)) !== null) {
                    if (match[2]) {
                        arg_names |= 1
                        var field_list = [], replacement_field = match[2], field_match = []
                        if ((field_match = re.key.exec(replacement_field)) !== null) {
                            field_list.push(field_match[1])
                            while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                                if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                    field_list.push(field_match[1])
                                }
                                else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                    field_list.push(field_match[1])
                                }
                                else {
                                    throw new SyntaxError('[sprintf] failed to parse named argument key')
                                }
                            }
                        }
                        else {
                            throw new SyntaxError('[sprintf] failed to parse named argument key')
                        }
                        match[2] = field_list
                    }
                    else {
                        arg_names |= 2
                    }
                    if (arg_names === 3) {
                        throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported')
                    }
    
                    parse_tree.push(
                        {
                            placeholder: match[0],
                            param_no:    match[1],
                            keys:        match[2],
                            sign:        match[3],
                            pad_char:    match[4],
                            align:       match[5],
                            width:       match[6],
                            precision:   match[7],
                            type:        match[8]
                        }
                    )
                }
                else {
                    throw new SyntaxError('[sprintf] unexpected placeholder')
                }
                _fmt = _fmt.substring(match[0].length)
            }
            return sprintf_cache[fmt] = parse_tree
        }
    
        /**
         * export to either browser or node.js
         */
        /* eslint-disable quote-props */
        if (true) {
            exports['sprintf'] = sprintf
            exports['vsprintf'] = vsprintf
        }
        if (typeof window !== 'undefined') {
            window['sprintf'] = sprintf
            window['vsprintf'] = vsprintf
    
            if (true) {
                !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
                    return {
                        'sprintf': sprintf,
                        'vsprintf': vsprintf
                    }
                }).call(exports, __webpack_require__, exports, module),
                    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
            }
        }
        /* eslint-enable quote-props */
    }(); // eslint-disable-line
    
    
    /***/ }),
    
    /***/ "./node_modules/webpack/buildin/global.js":
    /*!***********************************!*\
      !*** (webpack)/buildin/global.js ***!
      \***********************************/
    /*! no static exports found */
    /***/ (function(module, exports) {
    
    var g;
    
    // This works in non-strict mode
    g = (function() {
        return this;
    })();
    
    try {
        // This works if eval is allowed (see CSP)
        g = g || new Function("return this")();
    } catch (e) {
        // This works if the window reference is available
        if (typeof window === "object") g = window;
    }
    
    // g can still be undefined, but nothing to do about it...
    // We return undefined, instead of nothing here, so it's
    // easier to handle this case. if(!global) { ...}
    
    module.exports = g;
    
    
    /***/ }),
    
    /***/ "./node_modules/webpack/buildin/module.js":
    /*!***********************************!*\
      !*** (webpack)/buildin/module.js ***!
      \***********************************/
    /*! no static exports found */
    /***/ (function(module, exports) {
    
    module.exports = function(module) {
        if (!module.webpackPolyfill) {
            module.deprecate = function() {};
            module.paths = [];
            // module.parent = undefined by default
            if (!module.children) module.children = [];
            Object.defineProperty(module, "loaded", {
                enumerable: true,
                get: function() {
                    return module.l;
                }
            });
            Object.defineProperty(module, "id", {
                enumerable: true,
                get: function() {
                    return module.i;
                }
            });
            module.webpackPolyfill = 1;
        }
        return module;
    };
    
    
    /***/ }),
    
    /***/ "./src/client/XmlHttpClient.js":
    /*!*************************************!*\
      !*** ./src/client/XmlHttpClient.js ***!
      \*************************************/
    /*! exports provided: makeHttpRequest */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeHttpRequest", function() { return makeHttpRequest; });
    var makeHttpRequest = function makeHttpRequest(obj, success, failure) {
      var xhr = new XMLHttpRequest();
      xhr.open(obj.method || "GET", obj.url);
    
      if (obj.headers) {
        Object.keys(obj.headers).forEach(function (key) {
          xhr.setRequestHeader(key, obj.headers[key]);
        });
      }
    
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          success(xhr);
        } else {
          failure(xhr);
        }
      };
    
      xhr.onerror = function () {
        return failure(xhr);
      };
    
      xhr.send(obj.body);
    };
    
    
    
    /***/ }),
    
    /***/ "./src/client/client.js":
    /*!******************************!*\
      !*** ./src/client/client.js ***!
      \******************************/
    /*! exports provided: ChatClientFactory */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatClientFactory", function() { return ChatClientFactory; });
    /* harmony import */ var _core_exceptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/exceptions */ "./src/core/exceptions.js");
    /* harmony import */ var _XmlHttpClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./XmlHttpClient */ "./src/client/XmlHttpClient.js");
    /* harmony import */ var _globalConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../globalConfig */ "./src/globalConfig.js");
    /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
    /* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../log */ "./src/log.js");
    function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }
    
    function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
    
    function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
    
    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    
    
    
    
    
    
    
    var ChatClientFactoryImpl =
    /*#__PURE__*/
    function () {
      function ChatClientFactoryImpl() {
        _classCallCheck(this, ChatClientFactoryImpl);
    
        this.clientCache = {};
      }
    
      _createClass(ChatClientFactoryImpl, [{
        key: "getCachedClient",
        value: function getCachedClient(optionsInput) {
          var options = Object.assign({}, optionsInput);
          var region = optionsInput.region || _globalConfig__WEBPACK_IMPORTED_MODULE_2__["GlobalConfig"].getRegion() || _constants__WEBPACK_IMPORTED_MODULE_3__["REGIONS"].pdx;
          options.region = region;
    
          if (this.clientCache[region]) {
            return this.clientCache[region];
          }
    
          var client = this._createClient(options);
    
          this.clientCache[region] = client;
          return client;
        }
      }, {
        key: "_createClient",
        value: function _createClient(options) {
          var region = options.region;
          var endpointOverride = _globalConfig__WEBPACK_IMPORTED_MODULE_2__["GlobalConfig"].getEndpointOverride();
          var stageConfig = _constants__WEBPACK_IMPORTED_MODULE_3__["REGION_CONFIG"][region];
    
          if (endpointOverride) {
            stageConfig.invokeUrl = endpointOverride;
          }
    
          return new HttpChatClient({
            stageConfig: stageConfig
          });
        }
      }]);
    
      return ChatClientFactoryImpl;
    }();
    /*eslint-disable*/
    
    
    var ChatClient =
    /*#__PURE__*/
    function () {
      function ChatClient() {
        _classCallCheck(this, ChatClient);
      }
    
      _createClass(ChatClient, [{
        key: "sendMessage",
        value: function sendMessage(participantToken, message, type) {
          throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("sendTextMessage in ChatClient");
        }
      }, {
        key: "disconnectChat",
        value: function disconnectChat(participantToken) {
          throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("disconnectChat in ChatClient");
        }
      }, {
        key: "sendEvent",
        value: function sendEvent(eventType, messageIds, visibility, persistence) {
          throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("sendEvent in ChatClient");
        }
      }, {
        key: "createConnectionDetails",
        value: function createConnectionDetails(participantToken) {
          throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("reconnectChat in ChatClient");
        }
      }]);
    
      return ChatClient;
    }();
    /*eslint-enable*/
    
    
    var createDefaultHeaders = function createDefaultHeaders() {
      return {
        "Content-Type": "application/json",
        Accept: "application/json"
      };
    };
    
    var HttpChatClient =
    /*#__PURE__*/
    function (_ChatClient) {
      _inherits(HttpChatClient, _ChatClient);
    
      function HttpChatClient(args) {
        var _this;
    
        _classCallCheck(this, HttpChatClient);
    
        _this = _possibleConstructorReturn(this, _getPrototypeOf(HttpChatClient).call(this));
        _this.invokeUrl = args.stageConfig.invokeUrl;
        _this.callHttpClient = _XmlHttpClient__WEBPACK_IMPORTED_MODULE_1__["makeHttpRequest"];
        _this.logger = _log__WEBPACK_IMPORTED_MODULE_4__["LogManager"].getLogger({
          prefix: "ChatClient"
        });
        return _this;
      }
    
      _createClass(HttpChatClient, [{
        key: "sendMessage",
        value: function sendMessage(connectionToken, message, type) {
          console.log(type);
          var body = {
            Message: {
              ContentType: _constants__WEBPACK_IMPORTED_MODULE_3__["CONTENT_TYPE"].textPlain,
              Content: message,
              Persistence: _constants__WEBPACK_IMPORTED_MODULE_3__["MESSAGE_PERSISTENCE"].PERSISTED
            }
          };
          var requestInput = {
            method: _constants__WEBPACK_IMPORTED_MODULE_3__["HTTP_METHODS"].POST,
            headers: {},
            url: this.invokeUrl + _constants__WEBPACK_IMPORTED_MODULE_3__["RESOURCE_PATH"].MESSAGE,
            body: body
          };
          requestInput.headers[_constants__WEBPACK_IMPORTED_MODULE_3__["CONNECTION_TOKEN_KEY"]] = connectionToken;
          return this._callHttpClient(requestInput);
        }
      }, {
        key: "getTranscript",
        value: function getTranscript(connectionToken, args) {
          var requestInput = {
            method: _constants__WEBPACK_IMPORTED_MODULE_3__["HTTP_METHODS"].POST,
            headers: {},
            url: this.invokeUrl + _constants__WEBPACK_IMPORTED_MODULE_3__["RESOURCE_PATH"].TRANSCRIPT,
            body: args
          };
          requestInput.headers[_constants__WEBPACK_IMPORTED_MODULE_3__["CONNECTION_TOKEN_KEY"]] = connectionToken;
          return this._callHttpClient(requestInput);
        }
      }, {
        key: "sendEvent",
        value: function sendEvent(connectionToken, eventType, messageIds, visibility, persistence) {
          console.log(messageIds);
          console.log(persistence);
          var body = {
            ParticipantEvent: {
              Visibility: visibility,
              ParticipantEventType: eventType
            }
          };
          var requestInput = {
            method: _constants__WEBPACK_IMPORTED_MODULE_3__["HTTP_METHODS"].POST,
            headers: {},
            url: this.invokeUrl + _constants__WEBPACK_IMPORTED_MODULE_3__["RESOURCE_PATH"].EVENT,
            body: body
          };
          requestInput.headers[_constants__WEBPACK_IMPORTED_MODULE_3__["CONNECTION_TOKEN_KEY"]] = connectionToken;
          return this._callHttpClient(requestInput);
        }
      }, {
        key: "disconnectChat",
        value: function disconnectChat(connectionToken) {
          var requestInput = {
            method: _constants__WEBPACK_IMPORTED_MODULE_3__["HTTP_METHODS"].POST,
            headers: {},
            url: this.invokeUrl + _constants__WEBPACK_IMPORTED_MODULE_3__["RESOURCE_PATH"].DISCONNECT,
            body: {}
          };
          requestInput.headers[_constants__WEBPACK_IMPORTED_MODULE_3__["CONNECTION_TOKEN_KEY"]] = connectionToken;
          return this._callHttpClient(requestInput);
        }
      }, {
        key: "createConnectionDetails",
        value: function createConnectionDetails(participantToken) {
          var requestInput = {
            method: _constants__WEBPACK_IMPORTED_MODULE_3__["HTTP_METHODS"].POST,
            headers: {},
            url: this.invokeUrl + _constants__WEBPACK_IMPORTED_MODULE_3__["RESOURCE_PATH"].CONNECTION_DETAILS,
            body: {}
          };
          requestInput.headers[_constants__WEBPACK_IMPORTED_MODULE_3__["PARTICIPANT_TOKEN_KEY"]] = participantToken;
          return this._callHttpClient(requestInput);
        }
      }, {
        key: "_callHttpClient",
        value: function _callHttpClient(requestInput) {
          var self = this;
          requestInput.headers = Object.assign(createDefaultHeaders(), requestInput.headers);
          requestInput.body = JSON.stringify(requestInput.body);
          return new Promise(function (resolve, reject) {
            var success = function success(request) {
              var responseObject = {};
              responseObject.data = JSON.parse(request.responseText);
              resolve(responseObject);
            };
    
            var failure = function failure(request) {
              var errorObject = {};
              errorObject.statusText = request.statusText;
    
              try {
                errorObject.error = JSON.parse(request.responseText);
              } catch (e) {
                self.logger.warn("invalid json error from server");
                errorObject.error = null;
              }
    
              reject(errorObject);
            };
    
            self.callHttpClient(requestInput, success, failure);
          });
        }
      }]);
    
      return HttpChatClient;
    }(ChatClient);
    
    var ChatClientFactory = new ChatClientFactoryImpl();
    
    
    /***/ }),
    
    /***/ "./src/constants.js":
    /*!**************************!*\
      !*** ./src/constants.js ***!
      \**************************/
    /*! exports provided: CHAT_CONFIGURATIONS, CONNECTION_TOKEN_KEY, PARTICIPANT_TOKEN_KEY, RESOURCE_PATH, HTTP_METHODS, MESSAGE_PERSISTENCE, CONTENT_TYPE, VISIBILITY, PERSISTENCE, REGION_CONFIG, MQTT_CONSTANTS, SESSION_TYPES, CHAT_EVENTS, TRANSCRIPT_DEFAULT_PARAMS, LOGS_DESTINATION, REGIONS */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHAT_CONFIGURATIONS", function() { return CHAT_CONFIGURATIONS; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONNECTION_TOKEN_KEY", function() { return CONNECTION_TOKEN_KEY; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PARTICIPANT_TOKEN_KEY", function() { return PARTICIPANT_TOKEN_KEY; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RESOURCE_PATH", function() { return RESOURCE_PATH; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HTTP_METHODS", function() { return HTTP_METHODS; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MESSAGE_PERSISTENCE", function() { return MESSAGE_PERSISTENCE; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONTENT_TYPE", function() { return CONTENT_TYPE; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VISIBILITY", function() { return VISIBILITY; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PERSISTENCE", function() { return PERSISTENCE; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGION_CONFIG", function() { return REGION_CONFIG; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MQTT_CONSTANTS", function() { return MQTT_CONSTANTS; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SESSION_TYPES", function() { return SESSION_TYPES; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHAT_EVENTS", function() { return CHAT_EVENTS; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TRANSCRIPT_DEFAULT_PARAMS", function() { return TRANSCRIPT_DEFAULT_PARAMS; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGS_DESTINATION", function() { return LOGS_DESTINATION; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGIONS", function() { return REGIONS; });
    /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
     //Placeholder
    
    var CHAT_CONFIGURATIONS = {
      CONCURRENT_CHATS: 10
    };
    var CONNECTION_TOKEN_KEY = "x-amzn-connect-connection-token";
    var PARTICIPANT_TOKEN_KEY = "x-amzn-connect-participant-token";
    var RESOURCE_PATH = {
      MESSAGE: "/contact/chat/participant/message",
      TRANSCRIPT: "/contact/chat/participant/transcript",
      EVENT: "/contact/chat/participant/event",
      DISCONNECT: "/contact/chat/participant/disconnect",
      CONNECTION_DETAILS: "/contact/chat/participant/connection-details"
    };
    var HTTP_METHODS = {
      POST: "post"
    };
    var MESSAGE_PERSISTENCE = {
      PERSISTED: "PERSISTED",
      NON_PERSISTED: "NON_PERSISTED"
    };
    var CONTENT_TYPE = {
      textPlain: "text/plain"
    };
    var VISIBILITY = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].makeEnum(["ALL", "MANAGER", "AGENT", "CUSTOMER", "THIRDPARTY"]);
    var PERSISTENCE = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].makeEnum(["PERSISTED", "NON_PERSISTED"]);
    var REGION_CONFIG = {
      "us-west-2": {
        invokeUrl: "https://eap1w93j0k.execute-api.us-west-2.amazonaws.com/prod"
      },
      "us-east-1": {
        invokeUrl: "https://4agcjusx3k.execute-api.us-east-1.amazonaws.com/prod"
      },
      "ap-southeast-2": {
        invokeUrl: "https://v4u8oq0cve.execute-api.ap-southeast-2.amazonaws.com/prod"
      },
      "ap-northeast-1": {
        invokeUrl: "https://3fidunfyz7.execute-api.ap-northeast-1.amazonaws.com/prod"
      },
      "eu-central-1": {
        invokeUrl: "https://1gynaarm3e.execute-api.eu-central-1.amazonaws.com/prod"
      }
    };
    var MQTT_CONSTANTS = {
      KEEP_ALIVE: 30,
      CONNECT_TIMEOUT: 60
    };
    var SESSION_TYPES = {
      AGENT: "AGENT",
      CUSTOMER: "CUSTOMER"
    };
    var CHAT_EVENTS = {
      INCOMING_MESSAGE: "INCOMING_MESSAGE",
      INCOMING_TYPING: "INCOMING_TYPING",
      CONNECTION_ESTABLISHED: "CONNECTION_ESTABLISHED",
      CONNECTION_BROKEN: "CONNECTION_BROKEN"
    };
    var TRANSCRIPT_DEFAULT_PARAMS = {
      MAX_RESULTS: 15,
      SORT_KEY: "ASCENDING",
      SCAN_DIRECTION: "BACKWARD"
    };
    var LOGS_DESTINATION = {
      NULL: "NULL",
      CLIENT_LOGGER: "CLIENT_LOGGER",
      DEBUG: "DEBUG"
    };
    var REGIONS = {
      pdx: "us-west-2",
      iad: "us-east-1",
      syd: "ap-southeast-2",
      nrt: "ap-northeast-1",
      fra: "eu-central-1"
    };
    
    /***/ }),
    
    /***/ "./src/core/chatArgsValidator.js":
    /*!***************************************!*\
      !*** ./src/core/chatArgsValidator.js ***!
      \***************************************/
    /*! exports provided: ChatServiceArgsValidator */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatServiceArgsValidator", function() { return ChatServiceArgsValidator; });
    /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.js");
    /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
    /* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./exceptions */ "./src/core/exceptions.js");
    function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }
    
    function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
    
    function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
    
    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    
    
    
    
    
    var ChatControllerArgsValidator =
    /*#__PURE__*/
    function () {
      function ChatControllerArgsValidator() {
        _classCallCheck(this, ChatControllerArgsValidator);
      }
    
      _createClass(ChatControllerArgsValidator, [{
        key: "validateNewControllerDetails",
    
        /*eslint-disable no-unused-vars*/
        value: function validateNewControllerDetails(chatDetails) {
          return true;
        }
        /*eslint-enable no-unused-vars*/
    
      }, {
        key: "validateSendMessage",
        value: function validateSendMessage(message, type) {
          if (!_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isString(message)) {
            _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsObject(message, "message");
          }
    
          _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsEnum(type, Object.values(_constants__WEBPACK_IMPORTED_MODULE_1__["CONTENT_TYPE"]), "type");
        }
        /*eslint-disable no-unused-vars*/
    
      }, {
        key: "validateConnectChat",
        value: function validateConnectChat(args) {
          return true;
        }
        /*eslint-enable no-unused-vars*/
    
      }, {
        key: "validateLogger",
        value: function validateLogger(logger) {
          _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsObject(logger, "logger");
          ["debug", "info", "warn", "error"].forEach(function (methodName) {
            if (!_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(logger[methodName])) {
              throw new _exceptions__WEBPACK_IMPORTED_MODULE_2__["IllegalArgumentException"](methodName + " should be a valid function on the passed logger object!");
            }
          });
        }
      }, {
        key: "validateSendEvent",
        value: function validateSendEvent(args) {
          _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsNonEmptyString(args.eventType, "eventType");
    
          if (args.messageIds !== undefined) {
            _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsList(args.messageIds);
          }
    
          if (args.visibility !== undefined) {
            _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsEnum(args.visibility, Object.values(_constants__WEBPACK_IMPORTED_MODULE_1__["VISIBILITY"]), "visibility");
          }
    
          if (args.persistence !== undefined) {
            _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsEnum(args.persistence, Object.values(_constants__WEBPACK_IMPORTED_MODULE_1__["PERSISTENCE"]), "persistence");
          }
        } // TODO: Not sure about this API.
    
        /*eslint-disable no-unused-vars*/
    
      }, {
        key: "validateGetMessages",
        value: function validateGetMessages(args) {
          return true;
        }
        /*eslint-enable no-unused-vars*/
    
      }]);
    
      return ChatControllerArgsValidator;
    }();
    
    var ChatServiceArgsValidator =
    /*#__PURE__*/
    function (_ChatControllerArgsVa) {
      _inherits(ChatServiceArgsValidator, _ChatControllerArgsVa);
    
      function ChatServiceArgsValidator() {
        _classCallCheck(this, ChatServiceArgsValidator);
    
        return _possibleConstructorReturn(this, _getPrototypeOf(ChatServiceArgsValidator).apply(this, arguments));
      }
    
      _createClass(ChatServiceArgsValidator, [{
        key: "validateChatDetails",
        value: function validateChatDetails(chatDetails) {
          _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsObject(chatDetails, "chatDetails");
          _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsNonEmptyString(chatDetails.initialContactId, "chatDetails.initialContactId");
          _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsNonEmptyString(chatDetails.contactId, "chatDetails.contactId");
          _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsNonEmptyString(chatDetails.participantId, "chatDetails.participantId");
    
          if (chatDetails.connectionDetails) {
            _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsObject(chatDetails.connectionDetails, "chatDetails.connectionDetails");
            _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsNonEmptyString(chatDetails.connectionDetails.PreSignedConnectionUrl, "chatDetails.connectionDetails.PreSignedConnectionUrl");
            _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsNonEmptyString(chatDetails.connectionDetails.ConnectionId, "chatDetails.connectionDetails.ConnectionId");
            _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsNonEmptyString(chatDetails.connectionDetails.connectionToken, "chatDetails.connectionDetails.connectionToken");
          } else {
            _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertIsNonEmptyString(chatDetails.participantToken, "chatDetails.participantToken");
          }
        }
      }, {
        key: "validateInitiateChatResponse",
        value: function validateInitiateChatResponse() {
          return true;
        }
      }]);
    
      return ChatServiceArgsValidator;
    }(ChatControllerArgsValidator);
    
    
    
    /***/ }),
    
    /***/ "./src/core/chatController.js":
    /*!************************************!*\
      !*** ./src/core/chatController.js ***!
      \************************************/
    /*! exports provided: PersistentConnectionAndChatServiceController */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PersistentConnectionAndChatServiceController", function() { return PersistentConnectionAndChatServiceController; });
    /* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./exceptions */ "./src/core/exceptions.js");
    /* harmony import */ var _connectionHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connectionHelper */ "./src/core/connectionHelper.js");
    /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
    /* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../log */ "./src/log.js");
    function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }
    
    function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
    
    function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
    
    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    
    
    
    
    
    var NetworkLinkStatus = {
      NeverEstablished: "NeverEstablished",
      Establishing: "Establishing",
      Established: "Established",
      BrokenRetrying: "BrokenRetrying",
      Broken: "Broken"
    };
    /*eslint-disable no-unused-vars*/
    
    var ChatController =
    /*#__PURE__*/
    function () {
      function ChatController() {
        _classCallCheck(this, ChatController);
      }
    
      _createClass(ChatController, [{
        key: "sendTextMessage",
    
        /**
         *
         * @param {string} textMessage
         * @return a promise object with
         * success = {
         *  "statusCode": 200,
         *  "data": {
         *      "MessageId": <string>
         *      }
         *  }
         * error = {
         *  "statusCode": <errorStatusCode>,
         *  "exception": {} // some object...
         * }
         */
        value: function sendTextMessage(textMessage) {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("sendTextMessage in ChatController");
        }
        /**
         *
         * @param {*} args
         * @return Promise object with
         *      response = {
         *              "details": {}, // Implementation specific
         *              "initialContactId": <InitialContactId>,
         *              "contactId":  <contactId>,
         *              "connectSuccess": true
         *      }
         *      error = {
         *              "details": {}, // Implementation specific
         *              "initialContactId": <InitialContactId>,
         *              "contactId":  <contactId>,
         *              "connectSuccess": false
         *      }
         */
    
      }, {
        key: "establishNetworkLink",
        value: function establishNetworkLink(args) {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("connectChat in ChatController");
        }
        /**
         * @return null
         */
    
      }, {
        key: "disconnectParticipant",
        value: function disconnectParticipant() {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("endChat in ChatController");
        }
        /**
         *
         * @param {string} eventType
         * @return Promise object with
         *  success = {
         *      "statusCode": 200,
         *      "data": {} // empty object? TODO
         *  }
         *  error = {
         *      "statusCode": <errorCode>,
         *      "exception": {} // some object
         *  }
         */
    
      }, {
        key: "sendEvent",
        value: function sendEvent(eventType) {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("sendEvent in ChatController");
        }
        /**
         * @param {object} args //TODO
         * @return // TODO
         */
    
      }, {
        key: "getTranscript",
        value: function getTranscript(args) {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("getTranscript in ChatController");
        }
      }, {
        key: "getConnectionStatus",
        value: function getConnectionStatus() {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("getStatus in ChatController");
        }
      }]);
    
      return ChatController;
    }();
    /*eslint-enable no-unused-vars*/
    
    
    var PersistentConnectionAndChatServiceController =
    /*#__PURE__*/
    function (_ChatController) {
      _inherits(PersistentConnectionAndChatServiceController, _ChatController);
    
      function PersistentConnectionAndChatServiceController(args) {
        var _this;
    
        _classCallCheck(this, PersistentConnectionAndChatServiceController);
    
        _this = _possibleConstructorReturn(this, _getPrototypeOf(PersistentConnectionAndChatServiceController).call(this));
    
        _this.setArguments(args);
    
        return _this;
      }
    
      _createClass(PersistentConnectionAndChatServiceController, [{
        key: "setArguments",
        value: function setArguments(args) {
          var self = this;
          var prefix = "ContactId-" + args.chatDetails.contactId + ": ";
          this.logger = _log__WEBPACK_IMPORTED_MODULE_3__["LogManager"].getLogger({
            prefix: prefix
          });
          this.argsValidator = args.argsValidator;
          this.chatEventConstructor = args.chatEventConstructor;
          this.connectionDetails = args.chatDetails.connectionDetails;
          this.intialContactId = args.chatDetails.initialContactId;
          this.contactId = args.chatDetails.contactId;
          this.participantId = args.chatDetails.participantId;
          this.chatClient = args.chatClient;
          this.participantToken = args.chatDetails.participantToken;
    
          this.connectionHelperCallback = function (eventType, eventData) {
            return self._handleConnectionHelperEvents(eventType, eventData);
          };
    
          this._hasConnectionDetails = args.hasConnectionDetails;
          this.chatControllerFactory = args.chatControllerFactory;
    
          if (args.hasConnectionDetails) {
            this._setConnectionHelper(args.chatDetails.connectionDetails, args.chatDetails.contactId);
          }
    
          this._connectCalledAtleastOnce = false;
          this._everConnected = false;
          this.pubsub = args.pubsub;
          this._participantDisconnected = false;
        }
      }, {
        key: "_setConnectionHelper",
        value: function _setConnectionHelper(connectionDetails, contactId) {
          var connectionHelperProvider = this.chatControllerFactory.createConnectionHelperProvider(connectionDetails, contactId);
          this.connectionHelper = connectionHelperProvider(this.connectionHelperCallback);
        } // Do any clean up that needs to be done upon the participant being disconnected from the chat -
        // disconnected here means that the participant is no longer part of ther chat.
    
      }, {
        key: "cleanUpOnParticipantDisconnect",
        value: function cleanUpOnParticipantDisconnect() {
          this.pubsub.unsubscribeAll();
          this.connectionHelper && this.connectionHelper.cleanUpOnParticipantDisconnect();
        }
      }, {
        key: "subscribe",
        value: function subscribe(eventName, callback) {
          this.pubsub.subscribe(eventName, callback);
          this.logger.info("Subscribed successfully to eventName: ", eventName);
        }
      }, {
        key: "sendMessage",
        value: function sendMessage(args) {
          var self = this;
          var message = args.message;
          var type = args.type || _constants__WEBPACK_IMPORTED_MODULE_2__["CONTENT_TYPE"].textPlain;
          var metadata = args.metadata || null;
          self.argsValidator.validateSendMessage(message, type);
          var connectionToken = self.connectionDetails.connectionToken;
          return self.chatClient.sendMessage(connectionToken, message, type).then(function (response) {
            response.metadata = metadata;
            self.logger.debug("Successfully sent message, response: ", response, " request: ", args);
            return response;
          }, function (error) {
            error.metadata = metadata;
            self.logger.debug("Failed to send message, error: ", error, " request: ", args);
            return Promise.reject(error);
          });
        }
      }, {
        key: "sendEvent",
        value: function sendEvent(args) {
          var self = this;
          var metadata = args.metadata || null;
          self.argsValidator.validateSendEvent(args);
          var connectionToken = self.connectionDetails.connectionToken;
          var persistenceArgument = args.persistence || _constants__WEBPACK_IMPORTED_MODULE_2__["PERSISTENCE"].PERSISTED;
          var visibilityArgument = args.visibility || _constants__WEBPACK_IMPORTED_MODULE_2__["VISIBILITY"].ALL;
          return self.chatClient.sendEvent(connectionToken, args.eventType, args.messageIds, visibilityArgument, persistenceArgument).then(function (response) {
            response.metadata = metadata;
            self.logger.debug("Successfully sent event, response: ", response, " request: ", args);
            return response;
          }, function (error) {
            error.metadata = metadata;
            self.logger.debug("Failed to send event, error: ", error, " request: ", args);
            return Promise.reject(error);
          });
        }
      }, {
        key: "getTranscript",
        value: function getTranscript(inputArgs) {
          var self = this;
          var metadata = inputArgs.metadata || null;
          var args = {};
          args.IntialContactId = this.intialContactId;
          args.StartKey = inputArgs.StartKey || {};
          args.ScanDirection = inputArgs.ScanDirection || _constants__WEBPACK_IMPORTED_MODULE_2__["TRANSCRIPT_DEFAULT_PARAMS"].SCAN_DIRECTION;
          args.SortKey = inputArgs.SortKey || _constants__WEBPACK_IMPORTED_MODULE_2__["TRANSCRIPT_DEFAULT_PARAMS"].SORT_KEY;
          args.MaxResults = inputArgs.MaxResults || _constants__WEBPACK_IMPORTED_MODULE_2__["TRANSCRIPT_DEFAULT_PARAMS"].MAX_RESULTS;
    
          if (inputArgs.NextToken) {
            args.NextToken = inputArgs.NextToken;
          }
    
          var connectionToken = this.connectionDetails.connectionToken;
          return this.chatClient.getTranscript(connectionToken, args).then(function (response) {
            response.metadata = metadata;
            self.logger.debug("Successfully retrieved transcript, response: ", response, " request: ", args);
            return response;
          }, function (error) {
            error.metadata = metadata;
            self.logger.debug("Failed to retrieve transcript, error: ", error, " request: ", args);
            return Promise.reject(error);
          });
        }
      }, {
        key: "_handleConnectionHelperEvents",
        value: function _handleConnectionHelperEvents(eventType, eventData) {
          try {
            var chatEvent = this.chatEventConstructor.fromConnectionHelperEvent(eventType, eventData, this.getChatDetails(), this.logger);
          } catch (exc) {
            this.logger.error("Error occured while handling event from Connection. eventType and eventData: ", eventType, eventData, " Causing exception: ", exc);
            return;
          }
    
          this.logger.debug("Triggering event for subscribers:", chatEvent);
          this.pubsub.triggerAsync(chatEvent.type, chatEvent.data);
        }
      }, {
        key: "connect",
        value: function connect(inputArgs) {
          var self = this;
          var args = inputArgs || {};
          var metadata = args.metadata || null;
          this.argsValidator.validateConnectChat(args);
    
          if (self.getConnectionStatus() !== NetworkLinkStatus.Broken && self.getConnectionStatus() !== NetworkLinkStatus.NeverEstablished) {
            throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalStateException"]("Can call establishNetworkLink only when getConnectionStatus is Broken or NeverEstablished");
          }
    
          var _onSuccess = function _onSuccess(response) {
            return self._onConnectSuccess(response, metadata);
          };
    
          var _onFailure = function _onFailure(error) {
            return self._onConnectFailure(error, metadata);
          };
    
          self._connectCalledAtleastOnce = true;
    
          if (self._hasConnectionDetails) {
            return self.connectionHelper.start().then(_onSuccess, _onFailure);
          } else {
            return self._fetchConnectionDetails().then(function (connectionDetails) {
              self._setConnectionHelper(connectionDetails, self.contactId);
    
              self.connectionDetails = connectionDetails;
              self._hasConnectionDetails = true;
              return self.connectionHelper.start();
            }).then(_onSuccess, _onFailure);
          }
        }
      }, {
        key: "_onConnectSuccess",
        value: function _onConnectSuccess(response, metadata) {
          var self = this;
          self.logger.info("Connect successful!");
          var responseObject = {
            _debug: response,
            connectSuccess: true,
            connectCalled: true,
            metadata: metadata
          };
          var eventData = Object.assign({
            chatDetails: self.getChatDetails()
          }, responseObject);
          this.pubsub.triggerAsync(_constants__WEBPACK_IMPORTED_MODULE_2__["CHAT_EVENTS"].CONNECTION_ESTABLISHED, eventData);
          return responseObject;
        }
      }, {
        key: "_onConnectFailure",
        value: function _onConnectFailure(error, metadata) {
          var errorObject = {
            _debug: error,
            connectSuccess: false,
            connectCalled: true,
            metadata: metadata
          };
          this.logger.error("Connect Failed with data: ", errorObject);
          return Promise.reject(errorObject);
        }
      }, {
        key: "_fetchConnectionDetails",
        value: function _fetchConnectionDetails() {
          var self = this;
          return self.chatClient.createConnectionDetails(self.participantToken).then(function (response) {
            var connectionDetails = {};
            connectionDetails.ConnectionId = response.data.ConnectionId;
            connectionDetails.PreSignedConnectionUrl = response.data.PreSignedConnectionUrl;
            connectionDetails.connectionToken = response.data.ParticipantCredentials.ConnectionAuthenticationToken;
            return connectionDetails;
          }, function (error) {
            return Promise.reject({
              reason: "Failed to fetch connectionDetails",
              _debug: error
            });
          });
        }
      }, {
        key: "breakConnection",
        value: function breakConnection() {
          return this.connectionHelper.end();
        }
      }, {
        key: "disconnectParticipant",
        value: function disconnectParticipant() {
          var self = this;
          var connectionToken = self.connectionDetails.connectionToken;
          return self.chatClient.disconnectChat(connectionToken).then(function (response) {
            self.logger.info("disconnect participant successful");
            self._participantDisconnected = true;
            return response;
          }, function (error) {
            self.logger.error("disconnect participant failed with error: ", error);
            return Promise.reject(error);
          });
        }
      }, {
        key: "getChatDetails",
        value: function getChatDetails() {
          var self = this;
          return {
            intialContactId: self.intialContactId,
            contactId: self.contactId,
            participantId: self.participantId,
            participantToken: self.participantToken,
            connectionDetails: self.connectionDetails
          };
        }
      }, {
        key: "_convertConnectionHelperStatus",
        value: function _convertConnectionHelperStatus(connectionHelperStatus) {
          switch (connectionHelperStatus) {
            case _connectionHelper__WEBPACK_IMPORTED_MODULE_1__["ConnectionHelperStatus"].NeverStarted:
              return NetworkLinkStatus.NeverEstablished;
    
            case _connectionHelper__WEBPACK_IMPORTED_MODULE_1__["ConnectionHelperStatus"].Starting:
              return NetworkLinkStatus.Establishing;
    
            case _connectionHelper__WEBPACK_IMPORTED_MODULE_1__["ConnectionHelperStatus"].Ended:
              return NetworkLinkStatus.Broken;
    
            case _connectionHelper__WEBPACK_IMPORTED_MODULE_1__["ConnectionHelperStatus"].Connected:
              return NetworkLinkStatus.Established;
    
            case _connectionHelper__WEBPACK_IMPORTED_MODULE_1__["ConnectionHelperStatus"].DisconnectedReconnecting:
              return NetworkLinkStatus.BrokenRetrying;
          }
    
          self.logger.error("Reached invalid state. Unknown connectionHelperStatus: ", connectionHelperStatus);
        }
      }, {
        key: "getConnectionStatus",
        value: function getConnectionStatus() {
          var self = this;
    
          if (!self._hasConnectionDetails) {
            return NetworkLinkStatus.NeverEstablished;
          }
    
          return self._convertConnectionHelperStatus(self.connectionHelper.getStatus());
        }
      }]);
    
      return PersistentConnectionAndChatServiceController;
    }(ChatController);
    
    
    
    /***/ }),
    
    /***/ "./src/core/chatSession.js":
    /*!*********************************!*\
      !*** ./src/core/chatSession.js ***!
      \*********************************/
    /*! exports provided: ChatSessionObject */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatSessionObject", function() { return ChatSessionObject; });
    /* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./exceptions */ "./src/core/exceptions.js");
    /* harmony import */ var _client_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../client/client */ "./src/client/client.js");
    /* harmony import */ var _chatArgsValidator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chatArgsValidator */ "./src/core/chatArgsValidator.js");
    /* harmony import */ var _connectionManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./connectionManager */ "./src/core/connectionManager.js");
    /* harmony import */ var _connectionHelper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./connectionHelper */ "./src/core/connectionHelper.js");
    /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
    /* harmony import */ var _eventConstructor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./eventConstructor */ "./src/core/eventConstructor.js");
    /* harmony import */ var _eventbus__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./eventbus */ "./src/core/eventbus.js");
    /* harmony import */ var _globalConfig__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../globalConfig */ "./src/globalConfig.js");
    /* harmony import */ var _chatController__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./chatController */ "./src/core/chatController.js");
    /* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../log */ "./src/log.js");
    function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }
    
    function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
    
    function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
    
    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    
    
    
    
    
    
    
    
    
    
    
    
    
    var ChatSessionFactory =
    /*#__PURE__*/
    function () {
      function ChatSessionFactory() {
        _classCallCheck(this, ChatSessionFactory);
      }
    
      _createClass(ChatSessionFactory, [{
        key: "createAgentChatController",
    
        /*eslint-disable no-unused-vars*/
        value: function createAgentChatController(chatDetails, participantType) {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("createAgentChatController in ChatControllerFactory.");
        }
      }, {
        key: "createCustomerChatController",
        value: function createCustomerChatController(chatDetails, participantType) {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("createCustomerChatController in ChatControllerFactory.");
        }
      }, {
        key: "createConnectionHelperProvider",
        value: function createConnectionHelperProvider(connectionDetails) {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("createIncomingChatController in ChatControllerFactory");
        }
        /*eslint-enable no-unused-vars*/
    
      }]);
    
      return ChatSessionFactory;
    }();
    
    var PersistentConnectionAndChatServiceSessionFactory =
    /*#__PURE__*/
    function (_ChatSessionFactory) {
      _inherits(PersistentConnectionAndChatServiceSessionFactory, _ChatSessionFactory);
    
      function PersistentConnectionAndChatServiceSessionFactory() {
        var _this;
    
        _classCallCheck(this, PersistentConnectionAndChatServiceSessionFactory);
    
        _this = _possibleConstructorReturn(this, _getPrototypeOf(PersistentConnectionAndChatServiceSessionFactory).call(this));
        _this.argsValidator = new _chatArgsValidator__WEBPACK_IMPORTED_MODULE_2__["ChatServiceArgsValidator"]();
        _this.chatConnectionManager = new _connectionManager__WEBPACK_IMPORTED_MODULE_3__["ChatConnectionManager"]();
        _this.chatEventConstructor = new _eventConstructor__WEBPACK_IMPORTED_MODULE_6__["EventConstructor"]();
        return _this;
      }
    
      _createClass(PersistentConnectionAndChatServiceSessionFactory, [{
        key: "createAgentChatSession",
        value: function createAgentChatSession(chatDetails, options) {
          var chatController = this._createChatSession(chatDetails, options);
    
          return new AgentChatSession(chatController);
        }
      }, {
        key: "createCustomerChatSession",
        value: function createCustomerChatSession(chatDetails, options) {
          var chatController = this._createChatSession(chatDetails, options);
    
          return new CustomerChatSession(chatController);
        }
      }, {
        key: "_createChatSession",
        value: function _createChatSession(chatDetailsInput, options) {
          var chatDetails = this._normalizeChatDetails(chatDetailsInput);
    
          var hasConnectionDetails = false;
    
          if (chatDetails.connectionDetails) {
            hasConnectionDetails = true;
          }
    
          var args = {
            chatDetails: chatDetails,
            chatControllerFactory: this,
            chatEventConstructor: this.chatEventConstructor,
            pubsub: new _eventbus__WEBPACK_IMPORTED_MODULE_7__["EventBus"](),
            chatClient: _client_client__WEBPACK_IMPORTED_MODULE_1__["ChatClientFactory"].getCachedClient(options),
            argsValidator: this.argsValidator,
            hasConnectionDetails: hasConnectionDetails
          };
          return new _chatController__WEBPACK_IMPORTED_MODULE_9__["PersistentConnectionAndChatServiceController"](args);
        }
      }, {
        key: "_normalizeChatDetails",
        value: function _normalizeChatDetails(chatDetailsInput) {
          if (chatDetailsInput.ChatConnectionAttributes && chatDetailsInput.ChatConnectionAttributes.ParticipantCredentials) {
            this.argsValidator.validateInitiateChatResponse(chatDetailsInput);
            var chatDetails = {};
            var connectionDetails = {};
            connectionDetails.connectionToken = chatDetailsInput.ChatConnectionAttributes.ParticipantCredentials.ConnectionAuthenticationToken;
            connectionDetails.ConnectionId = chatDetailsInput.ChatConnectionAttributes.ConnectionId;
            connectionDetails.PreSignedConnectionUrl = chatDetailsInput.ChatConnectionAttributes.PreSignedConnectionUrl;
            chatDetails.connectionDetails = connectionDetails;
            chatDetails.participantId = chatDetailsInput.ParticipantId;
            chatDetails.contactId = chatDetailsInput.ContactId;
            chatDetails.initialContactId = chatDetailsInput.ContactId;
            return chatDetails;
          } else {
            this.argsValidator.validateChatDetails(chatDetailsInput);
            return chatDetailsInput;
          }
        }
      }, {
        key: "createConnectionHelperProvider",
        value: function createConnectionHelperProvider(connectionDetails, contactId) {
          //later return based on the type argument
          var connectionArgs = {
            preSignedUrl: connectionDetails.PreSignedConnectionUrl,
            connectionId: connectionDetails.ConnectionId,
            maxRetryTime: 120 // not used right now anyways.
    
          };
          var mqttConnectionProvider = this.chatConnectionManager.createNewMqttConnectionProvider(connectionArgs, "PahoMqttConnection");
          var args = {
            mqttConnectionProvider: mqttConnectionProvider,
            connectionDetails: {
              preSignedUrl: connectionDetails.PreSignedConnectionUrl,
              connectionId: connectionDetails.ConnectionId
            },
            contactId: contactId
          };
          return function (callback) {
            args.callback = callback;
            return new _connectionHelper__WEBPACK_IMPORTED_MODULE_4__["SoloChatConnectionMqttHelper"](args);
          };
        }
      }]);
    
      return PersistentConnectionAndChatServiceSessionFactory;
    }(ChatSessionFactory);
    
    var ChatSession =
    /*#__PURE__*/
    function () {
      function ChatSession(controller) {
        _classCallCheck(this, ChatSession);
    
        this.controller = controller;
      }
    
      _createClass(ChatSession, [{
        key: "onMessage",
        value: function onMessage(callback) {
          this.controller.subscribe(_constants__WEBPACK_IMPORTED_MODULE_5__["CHAT_EVENTS"].INCOMING_MESSAGE, callback);
        }
      }, {
        key: "onTyping",
        value: function onTyping(callback) {
          this.controller.subscribe(_constants__WEBPACK_IMPORTED_MODULE_5__["CHAT_EVENTS"].INCOMING_TYPING, callback);
        }
      }, {
        key: "onConnectionBroken",
        value: function onConnectionBroken(callback) {
          this.controller.subscribe(_constants__WEBPACK_IMPORTED_MODULE_5__["CHAT_EVENTS"].CONNECTION_BROKEN, callback);
        }
      }, {
        key: "onConnectionEstablished",
        value: function onConnectionEstablished(callback) {
          this.controller.subscribe(_constants__WEBPACK_IMPORTED_MODULE_5__["CHAT_EVENTS"].CONNECTION_ESTABLISHED, callback);
        }
      }, {
        key: "sendMessage",
        value: function sendMessage(args) {
          return this.controller.sendMessage(args);
        }
      }, {
        key: "connect",
        value: function connect(args) {
          return this.controller.connect(args);
        }
      }, {
        key: "sendEvent",
        value: function sendEvent(args) {
          return this.controller.sendEvent(args);
        }
      }, {
        key: "getTranscript",
        value: function getTranscript(args) {
          return this.controller.getTranscript(args);
        }
      }, {
        key: "getConnectionStatus",
        value: function getConnectionStatus() {
          return this.controller.getConnectionStatus();
        }
      }, {
        key: "getChatDetails",
        value: function getChatDetails() {
          return this.controller.getChatDetails();
        }
      }]);
    
      return ChatSession;
    }();
    
    var AgentChatSession =
    /*#__PURE__*/
    function (_ChatSession) {
      _inherits(AgentChatSession, _ChatSession);
    
      function AgentChatSession(controller) {
        _classCallCheck(this, AgentChatSession);
    
        return _possibleConstructorReturn(this, _getPrototypeOf(AgentChatSession).call(this, controller));
      }
    
      _createClass(AgentChatSession, [{
        key: "cleanUpOnParticipantDisconnect",
        value: function cleanUpOnParticipantDisconnect() {
          return this.controller.cleanUpOnParticipantDisconnect();
        }
      }]);
    
      return AgentChatSession;
    }(ChatSession);
    
    var CustomerChatSession =
    /*#__PURE__*/
    function (_ChatSession2) {
      _inherits(CustomerChatSession, _ChatSession2);
    
      function CustomerChatSession(controller) {
        _classCallCheck(this, CustomerChatSession);
    
        return _possibleConstructorReturn(this, _getPrototypeOf(CustomerChatSession).call(this, controller));
      }
    
      _createClass(CustomerChatSession, [{
        key: "disconnectParticipant",
        value: function disconnectParticipant() {
          var self = this;
          return this.controller.disconnectParticipant().then(function (response) {
            self.controller.cleanUpOnParticipantDisconnect();
            self.controller.breakConnection();
            return response;
          });
        }
      }]);
    
      return CustomerChatSession;
    }(ChatSession);
    
    var CHAT_SESSION_FACTORY = new PersistentConnectionAndChatServiceSessionFactory();
    
    var setGlobalConfig = function setGlobalConfig(config) {
      var loggerConfig = config.loggerConfig;
      _globalConfig__WEBPACK_IMPORTED_MODULE_8__["GlobalConfig"].update(config);
      _log__WEBPACK_IMPORTED_MODULE_10__["LogManager"].updateLoggerConfig(loggerConfig);
    };
    
    var ChatSessionConstructor = function ChatSessionConstructor(args) {
      var options = args.options || {};
      var type = args.type || _constants__WEBPACK_IMPORTED_MODULE_5__["SESSION_TYPES"].AGENT;
    
      if (type === _constants__WEBPACK_IMPORTED_MODULE_5__["SESSION_TYPES"].AGENT) {
        return CHAT_SESSION_FACTORY.createAgentChatSession(args.chatDetails, options);
      } else if (type === _constants__WEBPACK_IMPORTED_MODULE_5__["SESSION_TYPES"].CUSTOMER) {
        return CHAT_SESSION_FACTORY.createCustomerChatSession(args.chatDetails, options);
      } else {
        throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentException"]("Unkown value for session type, Allowed values are: " + Object.values(_constants__WEBPACK_IMPORTED_MODULE_5__["SESSION_TYPES"]), type);
      }
    };
    
    var ChatSessionObject = {
      create: ChatSessionConstructor,
      setGlobalConfig: setGlobalConfig
    };
    
    
    /***/ }),
    
    /***/ "./src/core/connectionHelper.js":
    /*!**************************************!*\
      !*** ./src/core/connectionHelper.js ***!
      \**************************************/
    /*! exports provided: SoloChatConnectionMqttHelper, ConnectionHelperEvents, ConnectionHelperStatus */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoloChatConnectionMqttHelper", function() { return SoloChatConnectionMqttHelper; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionHelperEvents", function() { return ConnectionHelperEvents; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionHelperStatus", function() { return ConnectionHelperStatus; });
    /* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./exceptions */ "./src/core/exceptions.js");
    /* harmony import */ var _connectionManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connectionManager */ "./src/core/connectionManager.js");
    /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
    /* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../log */ "./src/log.js");
    function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }
    
    function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
    
    function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
    
    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    
    
    
    
    
    /**
     * This class is used for establishing a connection for the chat.
     * The object of this class can only be started once and can only be closed once.
     * If the connection fails to establish, or if it ends abruptly due to
     *  downstream issues, or it is ended explicitly by calling end()
     *  then this object can no longer be used. A new object must be created to call start again.
     * start() attempts to start a connection.
     */
    
    /*eslint-disable no-unused-vars*/
    
    var ConnectionHelper =
    /*#__PURE__*/
    function () {
      function ConnectionHelper() {
        _classCallCheck(this, ConnectionHelper);
      }
    
      _createClass(ConnectionHelper, [{
        key: "start",
    
        /**
         *   returns Promise object with
         *       response = {
         *         connectSuccess: true,
         *         details: {} // Implementation specific
         *       };
         *       error = {
         *         connectSuccess: false,
         *         reason: "" // Implementation specific
         *         details: {} // Implementation specific
         *       };
         */
        value: function start(args) {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("start in ConnectionHelper");
        }
      }, {
        key: "end",
        value: function end() {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("end in ConnectionHelper");
        }
      }]);
    
      return ConnectionHelper;
    }();
    /*eslint-enable no-unused-vars*/
    
    
    var ConnectionHelperStatus = {
      NeverStarted: "NeverStarted",
      Starting: "Starting",
      Connected: "Connected",
      DisconnectedReconnecting: "DisconnectedReconnecting",
      Ended: "Ended"
    };
    var ConnectionHelperEvents = {
      Ended: "Ended",
      // event data is: {reason: ...}
      DisconnectedReconnecting: "DisconnectedReconnecting",
      // event data is: {reason: ...}
      Reconnected: "Reconnected",
      // event data is: {}
      IncomingMessage: "IncomingMessage" // event data is: {payloadString: ...}
    
    };
    /*
    This implementation assumes that it has its own MQTT client 
    which has never been connected and will not be shared with anyone.
    */
    // TODO - below can be changed with Promise Chaining.
    
    var SoloChatConnectionMqttHelper =
    /*#__PURE__*/
    function (_ConnectionHelper) {
      _inherits(SoloChatConnectionMqttHelper, _ConnectionHelper);
    
      function SoloChatConnectionMqttHelper(args) {
        var _this;
    
        _classCallCheck(this, SoloChatConnectionMqttHelper);
    
        _this = _possibleConstructorReturn(this, _getPrototypeOf(SoloChatConnectionMqttHelper).call(this));
        var prefix = "ContactId-" + args.contactId + ": ";
        _this.logger = _log__WEBPACK_IMPORTED_MODULE_3__["LogManager"].getLogger({
          prefix: prefix
        });
        _this.preSignedUrl = args.connectionDetails.preSignedUrl;
        _this.topic = args.connectionDetails.connectionId;
        _this.considerParticipantAsDisconnected = false;
        _this.iotConnection = args.mqttConnectionProvider(function (eventType, eventData) {
          return _this._handleIotEvent(eventType, eventData);
        });
    
        if (_this.iotConnection.getStatus() !== _connectionManager__WEBPACK_IMPORTED_MODULE_1__["MqttConnectionStatus"].NeverConnected) {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentException"]("iotConnection is expected to be in NeverConnected state but is not")();
        }
    
        _this.chatControllerCallback = args.callback;
        _this.status = ConnectionHelperStatus.NeverStarted;
        return _this;
      } // Add any functionality that you want this to do,
      // if the participant is to be considered as disconnected.
      // disconnect here means that the participant is no longer part of ther chat.
      // it is independent of the actual websocket connection being connected or not.
      // participant can no longer send and recieve messages to the backend.
    
    
      _createClass(SoloChatConnectionMqttHelper, [{
        key: "cleanUpOnParticipantDisconnect",
        value: function cleanUpOnParticipantDisconnect() {
          // Right now, nothing depends on this field.
          // However in future we might prevent retires on connection if this field is set to true.
          this.considerParticipantAsDisconnected = true;
        }
      }, {
        key: "start",
        value: function start() {
          if (this.status !== ConnectionHelperStatus.NeverStarted) {
            throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalStateException"]("Connection helper started twice!!");
          }
    
          var self = this;
          this.status = ConnectionHelperStatus.Starting;
          return new Promise(self._createStartPromise());
        }
      }, {
        key: "_createStartPromise",
        value: function _createStartPromise() {
          var self = this;
          return function (resovle, reject) {
            self._connect(resovle, reject);
          };
        }
      }, {
        key: "_connect",
        value: function _connect(resolve, reject) {
          var self = this;
          var connectOptions = {
            useSSL: true,
            keepAliveInterval: _constants__WEBPACK_IMPORTED_MODULE_2__["MQTT_CONSTANTS"].KEEP_ALIVE,
            reconnect: false,
            mqttVersion: 4,
            timeout: _constants__WEBPACK_IMPORTED_MODULE_2__["MQTT_CONSTANTS"].CONNECT_TIMEOUT
          };
          self.iotConnection.connect(connectOptions).then(function (response) {
            self._postConnect(resolve, reject, response);
          }).catch(function (error) {
            self._connectFailed(reject, error);
          });
        }
      }, {
        key: "_postConnect",
        value: function _postConnect(resolve, reject, connectResponse) {
          this._subscribe(resolve, reject, connectResponse);
        }
      }, {
        key: "_connectFailed",
        value: function _connectFailed(reject, connectError) {
          var error = {
            connectSuccess: false,
            reason: "ConnectionToBrokerFailed",
            details: connectError
          };
          this.status = ConnectionHelperStatus.Ended;
          reject(error);
        }
        /*eslint-disable no-unused-vars*/
    
      }, {
        key: "_subscribe",
        value: function _subscribe(resolve, reject, connectResponse) {
          /*eslint-enable no-unused-vars*/
          var self = this;
          var subscribeOptions = {
            qos: 1
          };
          self.iotConnection.subscribe(self.topic, subscribeOptions).then(function (response) {
            self._postSubscribe(resolve, response);
          }).catch(function (error) {
            self._subscribeFailed(reject, error);
          });
        }
      }, {
        key: "_postSubscribe",
        value: function _postSubscribe(resolve, subscribeResponse) {
          var response = {
            details: subscribeResponse,
            connectSuccess: true
          };
          this.status = ConnectionHelperStatus.Connected;
          resolve(response);
        }
      }, {
        key: "_subscribeFailed",
        value: function _subscribeFailed(reject, subscribeError) {
          var error = {
            connectSuccess: false,
            details: subscribeError,
            reason: "SubscribtionToTopicFailed"
          };
          var self = this;
          self.status = ConnectionHelperStatus.Ended;
          self.iotConnection.disconnect();
          reject(error);
        }
      }, {
        key: "_handleIotEvent",
        value: function _handleIotEvent(eventType, eventData) {
          switch (eventType) {
            case _connectionManager__WEBPACK_IMPORTED_MODULE_1__["MqttEvents"].MESSAGE:
              this.logger.debug("Received incoming data", eventData.payloadString);
              this.chatControllerCallback(ConnectionHelperEvents.IncomingMessage, eventData);
              break;
    
            case _connectionManager__WEBPACK_IMPORTED_MODULE_1__["MqttEvents"].DISCONNECTED_RETRYING:
              console.log("ERROR. Received unexpected event DISCONNECTED_RETRYING");
              break;
    
            case _connectionManager__WEBPACK_IMPORTED_MODULE_1__["MqttEvents"].DISCONNECTED:
              this.status = ConnectionHelperStatus.Ended;
              this.chatControllerCallback(ConnectionHelperEvents.Ended, eventData);
              break;
    
            case _connectionManager__WEBPACK_IMPORTED_MODULE_1__["MqttEvents"].RECONNECTED:
              console.log("ERROR. Received unexpected event DISCONNECTED_RETRYING");
              break;
          }
        }
      }, {
        key: "end",
        value: function end() {
          this.status = ConnectionHelperStatus.Ended; // Do we explicitly have to unsubscribe before disconnecting MQTT?
    
          this.iotConnection.disconnect();
        }
      }, {
        key: "getStatus",
        value: function getStatus() {
          return this.status;
        }
      }]);
    
      return SoloChatConnectionMqttHelper;
    }(ConnectionHelper);
    
    
    
    /***/ }),
    
    /***/ "./src/core/connectionManager.js":
    /*!***************************************!*\
      !*** ./src/core/connectionManager.js ***!
      \***************************************/
    /*! exports provided: ChatConnectionManager, MqttEvents, MqttConnectionStatus */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatConnectionManager", function() { return ChatConnectionManager; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MqttEvents", function() { return MqttEvents; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MqttConnectionStatus", function() { return MqttConnectionStatus; });
    /* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./exceptions */ "./src/core/exceptions.js");
    /* harmony import */ var _paho_mqtt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../paho-mqtt */ "./src/paho-mqtt.js");
    /* harmony import */ var _paho_mqtt__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_paho_mqtt__WEBPACK_IMPORTED_MODULE_1__);
    function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }
    
    function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
    
    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    
    
    
    
    var ChatConnectionManager =
    /*#__PURE__*/
    function () {
      function ChatConnectionManager() {
        _classCallCheck(this, ChatConnectionManager);
      }
    
      _createClass(ChatConnectionManager, [{
        key: "createNewMqttConnectionProvider",
        value: function createNewMqttConnectionProvider(connectionArgs, type) {
          switch (type) {
            case "PahoMqttConnection":
              return function (callback) {
                connectionArgs.callback = callback;
                return new PahoMqttConnection(connectionArgs);
              };
          }
    
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentException"]("type in ChatConnectionManager.createNewMqttConnectionProvider", type);
        }
      }]);
    
      return ChatConnectionManager;
    }(); // What is the expectation from this class?
    // This should provide an interface for connecting + subscribing && disconnecting + unsubscribing to endpoint + topic.
    // This class should call back
    
    /*eslint-disable no-unused-vars*/
    
    
    var MQTTClient =
    /*#__PURE__*/
    function () {
      function MQTTClient() {
        _classCallCheck(this, MQTTClient);
      }
    
      _createClass(MQTTClient, [{
        key: "connect",
    
        /**
         * @param connectionOptions (object) -
         *      connectOptions.useSSL - if present and true, use an SSL Websocket connection.
         *      connectOptions.keepAliveInterval - the server disconnects this client if there is no activity for this number of seconds.
         *      connectOptions.reconnect - Sets whether the client will automatically attempt to reconnect
         *      connectOptions.mqttVersion - The version of MQTT to use to connect to the MQTT Broker.
         *      connectOptions.timeout - If the connect has not succeeded within this number of seconds, it is deemed to have failed.
         *
         * @returns a Promise object -
         *      response = {}
         *      error = {"reason": {} // Implementation specific
         *          }
         */
        value: function connect(connectOptions) {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("connect in IotClient");
        }
      }, {
        key: "disconnect",
        value: function disconnect() {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("connect in IotClient");
        }
        /**
         * @param subscribeOptions (object) -
         *      subscribeOptions.qos - the maiximum qos of any publications sent as a result of making this subscription.
         *      connectOptions.timeout - which, if present, determines the number of seconds after which the onFailure calback is called.
         *          The presence of a timeout does not prevent the onSuccess callback from being called when the subscribe completes.
         *
         * @returns a Promise object -
         *      response = {"topic": <string>,
         *                  "qos": qos,
         *      }
         *      error = {"topic": <string>,
         *          "error": {} // Implementation specific
         *      }
         */
    
      }, {
        key: "subscribe",
        value: function subscribe(topic, subscribeOptions) {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("connect in IotClient");
        }
        /**
         * @param subscribeOptions (object) -
         *      connectOptions.timeout - which, if present, determines the number of seconds after which the onFailure callback is called.
         *          The presence of a timeout does not prevent the onSuccess callback from being called when the unsubscribe completes.
         *
         * @returns a Promise object -
         *      response = {"topic": <string>,
         *                  "qos": qos,
         *      }
         *      error = {"topic": <string>,
         *          "error": {} // Implementation specific
         *      }
         *
         */
    
      }, {
        key: "unsubscribe",
        value: function unsubscribe(topic, unsubscribeOptions) {
          throw new _exceptions__WEBPACK_IMPORTED_MODULE_0__["UnImplementedMethodException"]("connect in IotClient");
        }
      }]);
    
      return MQTTClient;
    }();
    /*eslint-enable no-unused-vars*/
    
    
    var MqttConnectionStatus = Object.freeze({
      NeverConnected: "NeverConnected",
      Connecting: "Connecting",
      Connected: "Connected",
      DisconnectedRetrying: "DisconnectedRetrying",
      Disconnected: "Disconnected",
      Reconnecting: "Reconnecting"
    });
    var MqttEvents = Object.freeze({
      MESSAGE: "Message",
      // topic, qos, payloadString
      DISCONNECTED_RETRYING: "DisconnectedRetrying",
      // reason: pahoObject
      DISCONNECTED: "Disconnected",
      // reason: pahoObject/ "TimeOutInReconnect"
      RECONNECTED: "ReconnectSuccess"
    }); // {}
    
    var PahoMqttConnection =
    /*#__PURE__*/
    function (_MQTTClient) {
      _inherits(PahoMqttConnection, _MQTTClient);
    
      function PahoMqttConnection(args) {
        var _this;
    
        _classCallCheck(this, PahoMqttConnection);
    
        _this = _possibleConstructorReturn(this, _getPrototypeOf(PahoMqttConnection).call(this));
        _this.preSignedUrl = args.preSignedUrl;
        _this.connectionId = args.connectionId;
        _this.status = MqttConnectionStatus.NeverConnected;
        _this.pahoClient = new _paho_mqtt__WEBPACK_IMPORTED_MODULE_1___default.a.Client(_this.preSignedUrl, _this.connectionId);
    
        var self = _assertThisInitialized(_assertThisInitialized(_this));
    
        _this.pahoClient.onMessageArrived = function (message) {
          self._messageArrivedCallback(message);
        };
    
        _this.pahoClient.onConnectionLost = function (data) {
          self._connectionLostCallBack(data);
        };
    
        _this.pahoClient.onMessageArrived = function (message) {
          self._messageArrivedCallback(message);
        };
    
        _this.callback = args.callback;
        _this.killReconnect = null;
        _this.maxRetryTime = args.maxRetryTime;
        _this.neverConnected = true;
        _this._subscribedTopics = [];
        return _this;
      }
    
      _createClass(PahoMqttConnection, [{
        key: "connect",
        value: function connect(connectOptions) {
          var self = this;
          return new Promise(function (resolve, reject) {
            connectOptions.onSuccess = function (response) {
              self.neverConnected = false;
              var oldStatus = self.status;
    
              self._onConnectSuccess(response);
    
              resolve({});
    
              if (oldStatus === MqttConnectionStatus.DisconnectedRetrying) {
                self.callback(MqttEvents.RECONNECTED, {});
              }
            };
    
            connectOptions.onFailure = function (error) {
              var errorDetails = {
                reason: error
              };
    
              self._onConnectFailure(errorDetails);
    
              reject(errorDetails);
            };
    
            self.status = MqttConnectionStatus.Connecting;
            self.pahoClient.connect(connectOptions);
          });
        }
      }, {
        key: "_connectionLostCallBack",
        value: function _connectionLostCallBack(error) {
          var data = {
            reason: error
          };
          this._subscribedTopics = [];
    
          if (this.status === MqttConnectionStatus.Disconnected) {
            return;
          }
    
          if (data.reason.reconnect) {
            this.status = MqttConnectionStatus.DisconnectedRetrying;
            this.callback(MqttEvents.DISCONNECTED_RETRYING, data);
            this.killReconnect = this._scheduleReconnectKilling();
            return;
          } else {
            this.status = MqttConnectionStatus.Disconnected;
            this.callback(MqttEvents.DISCONNECTED, data);
          }
        }
      }, {
        key: "_messageArrivedCallback",
        value: function _messageArrivedCallback(message) {
          var incomingMessage = {
            topic: message.topic,
            qos: message.qos,
            payloadString: message.payloadString
          };
          this.callback(MqttEvents.MESSAGE, incomingMessage);
        }
        /*eslint-disable no-unused-vars*/
    
      }, {
        key: "_onConnectSuccess",
        value: function _onConnectSuccess(response) {
          /*eslint-enable no-unused-vars*/
          if (this.killReconnect !== null) {
            clearTimeout(this.killReconnect);
            this.killReconnect = null;
          }
    
          this.status = MqttConnectionStatus.Connected;
        }
        /*eslint-disable no-unused-vars*/
    
      }, {
        key: "_onConnectFailure",
        value: function _onConnectFailure(error) {
          /*eslint-enable no-unused-vars*/
          var self = this;
    
          if (self.neverConnected) {
            self.status = MqttConnectionStatus.NeverConnected;
          } else {
            self.status = MqttConnectionStatus.Disconnected;
          }
        }
      }, {
        key: "_scheduleReconnectKilling",
        value: function _scheduleReconnectKilling() {
          var self = this;
          return setTimeout(function () {
            self.disconnect();
            self.callback(MqttEvents.DISCONNECTED, {
              reason: "TimeoutInReconnect"
            });
          }, self.maxRetryTime * 1000);
        }
      }, {
        key: "disconnect",
        value: function disconnect() {
          this._subscribedTopics = [];
          this.status = MqttConnectionStatus.Disconnected;
          this.pahoClient.disconnect();
        }
      }, {
        key: "subscribe",
        value: function subscribe(topic, subscribeOptions) {
          // should we check if this topic is already subscribed?
          // NO, leave this behaviour to PAHO - whatever PAHO does
          // in case of duplicate subscribe - we will follow the same.
          var self = this;
          return new Promise(function (resolve, reject) {
            subscribeOptions.onSuccess = function (response) {
              self._subscribeSuccess(topic, response);
    
              var responseObject = {
                topic: topic,
                qos: response.grantedQos
              };
              resolve(responseObject);
            };
    
            subscribeOptions.onFailure = function (error) {
              var errorObject = {
                topic: topic,
                error: error
              };
              reject(errorObject);
            };
    
            self.pahoClient.subscribe(topic, subscribeOptions);
          });
        }
      }, {
        key: "_addToTopics",
        value: function _addToTopics(topic) {
          var self = this;
    
          if (self._subscribedTopics.indexOf(topic) >= 0) {
            return;
          }
    
          self._subscribedTopics.push(topic);
        }
        /*eslint-disable no-unused-vars*/
    
      }, {
        key: "_subscribeSuccess",
        value: function _subscribeSuccess(topic, response) {
          /*eslint-enable no-unused-vars*/
          this._addToTopics(topic);
        }
      }, {
        key: "getSubscribedTopics",
        value: function getSubscribedTopics() {
          return this._subscribedTopics.slice(0);
        }
      }, {
        key: "unsubscribe",
        value: function unsubscribe(topic, unsubscribeOptions) {
          // should we check if this topic is even subscribed?
          // NO, leave this behaviour to PAHO - whatever PAHO does
          // in case of unsubscribe of topics not event subscribed
          // - we will follow the same.
          var self = this;
          return new Promise(function (resolve, reject) {
            unsubscribeOptions.onSuccess = function (response) {
              var responseObject = {
                topic: topic,
                response: response
              };
    
              self._unsubscribeSuccess(topic, responseObject);
    
              resolve(responseObject);
            };
    
            unsubscribeOptions.onFailure = function (error) {
              var errorObject = {
                topic: topic,
                error: error
              };
              reject(errorObject);
            };
    
            self.pahoClient.unsubscribe(topic, unsubscribeOptions);
          });
        }
        /*eslint-disable no-unused-vars*/
    
      }, {
        key: "_unsubscribeSuccess",
        value: function _unsubscribeSuccess(topic, response) {
          /*eslint-enable no-unused-vars*/
          this._subscribedTopics = this._subscribedTopics.filter(function (t) {
            return t !== topic;
          });
        }
      }, {
        key: "getStatus",
        value: function getStatus() {
          return this.status;
        }
      }]);
    
      return PahoMqttConnection;
    }(MQTTClient);
    
    
    
    /***/ }),
    
    /***/ "./src/core/eventConstructor.js":
    /*!**************************************!*\
      !*** ./src/core/eventConstructor.js ***!
      \**************************************/
    /*! exports provided: EventConstructor */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventConstructor", function() { return EventConstructor; });
    /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
    /* harmony import */ var _connectionHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connectionHelper */ "./src/core/connectionHelper.js");
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    
    
    
    
    var EventConstructor =
    /*#__PURE__*/
    function () {
      function EventConstructor() {
        _classCallCheck(this, EventConstructor);
      }
    
      _createClass(EventConstructor, [{
        key: "fromConnectionHelperEvent",
        value: function fromConnectionHelperEvent(eventType, eventData, chatDetails) {
          var data = {
            data: eventData,
            chatDetails: chatDetails
          };
          var returnObject = {
            type: null,
            data: data
          };
    
          switch (eventType) {
            case _connectionHelper__WEBPACK_IMPORTED_MODULE_1__["ConnectionHelperEvents"].Ended:
              returnObject.data.retrying = false;
              returnObject.type = _constants__WEBPACK_IMPORTED_MODULE_0__["CHAT_EVENTS"].CONNECTION_BROKEN;
              return returnObject;
    
            case _connectionHelper__WEBPACK_IMPORTED_MODULE_1__["ConnectionHelperEvents"].DisconnectedReconnecting:
              returnObject.data.retrying = true;
              returnObject.type = _constants__WEBPACK_IMPORTED_MODULE_0__["CHAT_EVENTS"].CONNECTION_BROKEN;
              return returnObject;
    
            case _connectionHelper__WEBPACK_IMPORTED_MODULE_1__["ConnectionHelperEvents"].Reconnected:
              returnObject.data.connectCalled = false;
              returnObject.type = _constants__WEBPACK_IMPORTED_MODULE_0__["CHAT_EVENTS"].CONNECTION_ESTABLISHED;
              return returnObject;
    
            case _connectionHelper__WEBPACK_IMPORTED_MODULE_1__["ConnectionHelperEvents"].IncomingMessage:
              return this._fromIncomingData(eventData, chatDetails);
          }
        }
      }, {
        key: "_fromIncomingData",
        value: function _fromIncomingData(eventData, chatDetails) {
          var incomingData = JSON.parse(eventData.payloadString);
          var data = {
            data: incomingData,
            chatDetails: chatDetails
          };
          var returnObject = {
            type: null,
            data: data
          };
    
          switch (incomingData.Data.Type) {
            case "TYPING":
              returnObject.type = _constants__WEBPACK_IMPORTED_MODULE_0__["CHAT_EVENTS"].INCOMING_TYPING;
              return returnObject;
          } // TODO this is not right! We are returning
          // a MESSAGE event even though this could be a custom event,
          // should there be an exhaustive list of events like PARTICIPANT_JOINED
          // recognized as MESSAGE?
    
    
          returnObject.type = _constants__WEBPACK_IMPORTED_MODULE_0__["CHAT_EVENTS"].INCOMING_MESSAGE;
          return returnObject;
        }
      }]);
    
      return EventConstructor;
    }();
    
    
    
    /***/ }),
    
    /***/ "./src/core/eventbus.js":
    /*!******************************!*\
      !*** ./src/core/eventbus.js ***!
      \******************************/
    /*! exports provided: EventBus */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventBus", function() { return EventBus; });
    /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.js");
    
    var ALL_EVENTS = "<<all>>";
    /**
     * An object representing an event subscription in an EventBus.
     */
    
    var Subscription = function Subscription(subMap, eventName, f) {
      this.subMap = subMap;
      this.id = _utils__WEBPACK_IMPORTED_MODULE_0__["default"].randomId();
      this.eventName = eventName;
      this.f = f;
    };
    /**
     * Unsubscribe the handler of this subscription from the EventBus
     * from which it was created.
     */
    
    
    Subscription.prototype.unsubscribe = function () {
      this.subMap.unsubscribe(this.eventName, this.id);
    };
    /**
     * A map of event subscriptions, used by the EventBus.
     */
    
    
    var SubscriptionMap = function SubscriptionMap() {
      this.subIdMap = {};
      this.subEventNameMap = {};
    };
    /**
     * Add a subscription for the named event.  Creates a new Subscription
     * object and returns it.  This object can be used to unsubscribe.
     */
    
    
    SubscriptionMap.prototype.subscribe = function (eventName, f) {
      var sub = new Subscription(this, eventName, f);
      this.subIdMap[sub.id] = sub;
      var subList = this.subEventNameMap[eventName] || [];
      subList.push(sub);
      this.subEventNameMap[eventName] = subList;
    };
    /**
     * Unsubscribe a subscription matching the given event name and id.
     */
    
    
    SubscriptionMap.prototype.unsubscribe = function (eventName, subId) {
      if (_utils__WEBPACK_IMPORTED_MODULE_0__["default"].contains(this.subEventNameMap, eventName)) {
        this.subEventNameMap[eventName] = this.subEventNameMap[eventName].filter(function (s) {
          return s.id !== subId;
        });
    
        if (this.subEventNameMap[eventName].length < 1) {
          delete this.subEventNameMap[eventName];
        }
      }
    
      if (_utils__WEBPACK_IMPORTED_MODULE_0__["default"].contains(this.subIdMap, subId)) {
        delete this.subIdMap[subId];
      }
    };
    /**
     * Get a list of all subscriptions in the subscription map.
     */
    
    
    SubscriptionMap.prototype.getAllSubscriptions = function () {
      return _utils__WEBPACK_IMPORTED_MODULE_0__["default"].values(this.subEventNameMap).reduce(function (a, b) {
        return a.concat(b);
      }, []);
    };
    /**
     * Get a list of subscriptions for the given event name, or an empty
     * list if there are no subscriptions.
     */
    
    
    SubscriptionMap.prototype.getSubscriptions = function (eventName) {
      return this.subEventNameMap[eventName] || [];
    };
    /**
     * An object which maintains a map of subscriptions and serves as the
     * mechanism for triggering events to be handled by subscribers.
     */
    
    
    var EventBus = function EventBus(paramsIn) {
      var params = paramsIn || {};
      this.subMap = new SubscriptionMap();
      this.logEvents = params.logEvents || false;
    };
    /**
     * Subscribe to the named event.  Returns a new Subscription object
     * which can be used to unsubscribe.
     */
    
    
    EventBus.prototype.subscribe = function (eventName, f) {
      _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertNotNull(eventName, "eventName");
      _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertNotNull(f, "f");
      _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertTrue(_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(f), "f must be a function");
      return this.subMap.subscribe(eventName, f);
    };
    /**
     * Subscribe a function to be called on all events.
     */
    
    
    EventBus.prototype.subscribeAll = function (f) {
      _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertNotNull(f, "f");
      _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertTrue(_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(f), "f must be a function");
      return this.subMap.subscribe(ALL_EVENTS, f);
    };
    /**
     * Get a list of subscriptions for the given event name, or an empty
     * list if there are no subscriptions.
     */
    
    
    EventBus.prototype.getSubscriptions = function (eventName) {
      return this.subMap.getSubscriptions(eventName);
    };
    /**
     * Trigger the given event with the given data.  All methods subscribed
     * to this event will be called and are provided with the given arbitrary
     * data object and the name of the event, in that order.
     */
    
    
    EventBus.prototype.trigger = function (eventName, data) {
      _utils__WEBPACK_IMPORTED_MODULE_0__["default"].assertNotNull(eventName, "eventName");
      var self = this;
      var allEventSubs = this.subMap.getSubscriptions(ALL_EVENTS);
      var eventSubs = this.subMap.getSubscriptions(eventName); // if (this.logEvents && (eventName !== connect.EventType.LOG && eventName !== connect.EventType.MASTER_RESPONSE && eventName !== connect.EventType.API_METRIC)) {
      //    connect.getLog().trace("Publishing event: %s", eventName);
      // }
    
      allEventSubs.concat(eventSubs).forEach(function (sub) {
        try {
          sub.f(data || null, eventName, self);
        } catch (e) {//   connect
          //     .getLog()
          //     .error("'%s' event handler failed.", eventName)
          //     .withException(e);
        }
      });
    };
    /**
     * Trigger the given event with the given data.  All methods subscribed
     * to this event will be called and are provided with the given arbitrary
     * data object and the name of the event, in that order.
     */
    
    
    EventBus.prototype.triggerAsync = function (eventName, data) {
      var _this = this;
    
      setTimeout(function () {
        return _this.trigger(eventName, data);
      }, 0);
    };
    /**
     * Returns a closure which bridges an event from another EventBus to this bus.
     *
     * Usage:
     * conduit.onUpstream("MyEvent", bus.bridge());
     */
    
    
    EventBus.prototype.bridge = function () {
      var self = this;
      return function (data, event) {
        self.trigger(event, data);
      };
    };
    /**
     * Unsubscribe all events in the event bus.
     */
    
    
    EventBus.prototype.unsubscribeAll = function () {
      this.subMap.getAllSubscriptions().forEach(function (sub) {
        sub.unsubscribe();
      });
    };
    
    
    
    /***/ }),
    
    /***/ "./src/core/exceptions.js":
    /*!********************************!*\
      !*** ./src/core/exceptions.js ***!
      \********************************/
    /*! exports provided: UnImplementedMethodException, IllegalArgumentException, IllegalStateException, IllegalJsonException, ValueError */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnImplementedMethodException", function() { return UnImplementedMethodException; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IllegalArgumentException", function() { return IllegalArgumentException; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IllegalStateException", function() { return IllegalStateException; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IllegalJsonException", function() { return IllegalJsonException; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ValueError", function() { return ValueError; });
    function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }
    
    function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
    
    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }
    
    function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
    
    function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
    
    function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
    
    function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
    
    var ValueError =
    /*#__PURE__*/
    function (_Error) {
      _inherits(ValueError, _Error);
    
      function ValueError(message) {
        var _this;
    
        _classCallCheck(this, ValueError);
    
        _this = _possibleConstructorReturn(this, _getPrototypeOf(ValueError).call(this, message));
        _this.name = "ValueError";
        console.log("EXCEPTION: " + _this.name + " MESSAGE: " + _this.message);
        return _this;
      }
    
      return ValueError;
    }(_wrapNativeSuper(Error));
    
    var UnImplementedMethodException =
    /*#__PURE__*/
    function (_Error2) {
      _inherits(UnImplementedMethodException, _Error2);
    
      function UnImplementedMethodException(message) {
        var _this2;
    
        _classCallCheck(this, UnImplementedMethodException);
    
        _this2 = _possibleConstructorReturn(this, _getPrototypeOf(UnImplementedMethodException).call(this, message));
        _this2.name = "UnImplementedMethod";
        console.log("EXCEPTION: " + _this2.name + " MESSAGE: " + _this2.message);
        return _this2;
      }
    
      return UnImplementedMethodException;
    }(_wrapNativeSuper(Error));
    
    var IllegalArgumentException =
    /*#__PURE__*/
    function (_Error3) {
      _inherits(IllegalArgumentException, _Error3);
    
      function IllegalArgumentException(message, argument) {
        var _this3;
    
        _classCallCheck(this, IllegalArgumentException);
    
        _this3 = _possibleConstructorReturn(this, _getPrototypeOf(IllegalArgumentException).call(this, message));
        _this3.name = "IllegalArgument";
        _this3.argument = argument;
        console.log("EXCEPTION: " + _this3.name + " MESSAGE: " + _this3.message);
        return _this3;
      }
    
      return IllegalArgumentException;
    }(_wrapNativeSuper(Error));
    
    var IllegalStateException =
    /*#__PURE__*/
    function (_Error4) {
      _inherits(IllegalStateException, _Error4);
    
      function IllegalStateException(message) {
        var _this4;
    
        _classCallCheck(this, IllegalStateException);
    
        _this4 = _possibleConstructorReturn(this, _getPrototypeOf(IllegalStateException).call(this, message));
        _this4.name = "IllegalState";
        console.log("EXCEPTION: " + _this4.name + " MESSAGE: " + _this4.message);
        return _this4;
      }
    
      return IllegalStateException;
    }(_wrapNativeSuper(Error));
    
    var IllegalJsonException =
    /*#__PURE__*/
    function (_Error5) {
      _inherits(IllegalJsonException, _Error5);
    
      function IllegalJsonException(message, args) {
        var _this5;
    
        _classCallCheck(this, IllegalJsonException);
    
        _this5 = _possibleConstructorReturn(this, _getPrototypeOf(IllegalJsonException).call(this, message));
        _this5.name = "IllegalState";
        _this5.causeException = args.causeException;
        _this5.originalJsonString = args.originalJsonString;
        console.log("EXCEPTION: " + _this5.name + " MESSAGE: " + _this5.message + " cause: " + _this5.causeException);
        return _this5;
      }
    
      return IllegalJsonException;
    }(_wrapNativeSuper(Error));
    
    
    
    /***/ }),
    
    /***/ "./src/globalConfig.js":
    /*!*****************************!*\
      !*** ./src/globalConfig.js ***!
      \*****************************/
    /*! exports provided: GlobalConfig */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GlobalConfig", function() { return GlobalConfig; });
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    
    var GlobalConfigImpl =
    /*#__PURE__*/
    function () {
      function GlobalConfigImpl() {
        _classCallCheck(this, GlobalConfigImpl);
      }
    
      _createClass(GlobalConfigImpl, [{
        key: "update",
        value: function update(configInput) {
          var config = configInput || {};
          this.region = config.region || this.region;
          this.endpointOverride = config.endpoint || this.endpointOverride;
        }
      }, {
        key: "getRegion",
        value: function getRegion() {
          return this.region;
        }
      }, {
        key: "getEndpointOverride",
        value: function getEndpointOverride() {
          return this.endpointOverride;
        }
      }]);
    
      return GlobalConfigImpl;
    }();
    
    var GlobalConfig = new GlobalConfigImpl();
    
    
    /***/ }),
    
    /***/ "./src/index.js":
    /*!**********************!*\
      !*** ./src/index.js ***!
      \**********************/
    /*! exports provided: ChatSession, ChatEvents, SessionTypes */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatSession", function() { return ChatSession; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatEvents", function() { return ChatEvents; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SessionTypes", function() { return SessionTypes; });
    /* harmony import */ var _core_chatSession__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/chatSession */ "./src/core/chatSession.js");
    /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
    /*eslint no-unused-vars: "off"*/
    
    
    global.connect = global.connect || {};
    connect.ChatSession = _core_chatSession__WEBPACK_IMPORTED_MODULE_0__["ChatSessionObject"];
    connect.ChatEvents = _constants__WEBPACK_IMPORTED_MODULE_1__["CHAT_EVENTS"];
    connect.SessionTypes = _constants__WEBPACK_IMPORTED_MODULE_1__["SESSION_TYPES"];
    var ChatSession = _core_chatSession__WEBPACK_IMPORTED_MODULE_0__["ChatSessionObject"];
    var ChatEvents = _constants__WEBPACK_IMPORTED_MODULE_1__["CHAT_EVENTS"];
    var SessionTypes = _constants__WEBPACK_IMPORTED_MODULE_1__["SESSION_TYPES"];
    /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))
    
    /***/ }),
    
    /***/ "./src/log.js":
    /*!********************!*\
      !*** ./src/log.js ***!
      \********************/
    /*! exports provided: LogManager, Logger, LogLevel */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogManager", function() { return LogManager; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Logger", function() { return Logger; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogLevel", function() { return LogLevel; });
    /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
    /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
    function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }
    
    function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
    
    function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
    
    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }
    
    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    
    
    
    /*eslint-disable no-unused-vars*/
    
    var Logger =
    /*#__PURE__*/
    function () {
      function Logger() {
        _classCallCheck(this, Logger);
      }
    
      _createClass(Logger, [{
        key: "debug",
        value: function debug(data) {}
      }, {
        key: "info",
        value: function info(data) {}
      }, {
        key: "warn",
        value: function warn(data) {}
      }, {
        key: "error",
        value: function error(data) {}
      }]);
    
      return Logger;
    }();
    /*eslint-enable no-unused-vars*/
    
    
    var LogLevel = {
      DEBUG: 10,
      INFO: 20,
      WARN: 30,
      ERROR: 40
    };
    
    var LogManagerImpl =
    /*#__PURE__*/
    function () {
      function LogManagerImpl() {
        _classCallCheck(this, LogManagerImpl);
    
        this.updateLoggerConfig();
        this.consoleLoggerWrapper = createConsoleLogger();
      }
    
      _createClass(LogManagerImpl, [{
        key: "writeToClientLogger",
        value: function writeToClientLogger(level, logStatement) {
          if (!this.hasClientLogger()) {
            return;
          }
    
          switch (level) {
            case LogLevel.DEBUG:
              return this._clientLogger.debug(logStatement);
    
            case LogLevel.INFO:
              return this._clientLogger.info(logStatement);
    
            case LogLevel.WARN:
              return this._clientLogger.warn(logStatement);
    
            case LogLevel.ERROR:
              return this._clientLogger.error(logStatement);
          }
        }
      }, {
        key: "isLevelEnabled",
        value: function isLevelEnabled(level) {
          return level >= this._level;
        }
      }, {
        key: "hasClientLogger",
        value: function hasClientLogger() {
          return this._clientLogger !== null;
        }
      }, {
        key: "getLogger",
        value: function getLogger(options) {
          var prefix = options.prefix || "";
    
          if (this._logsDestination === _constants__WEBPACK_IMPORTED_MODULE_1__["LOGS_DESTINATION"].DEBUG) {
            return this.consoleLoggerWrapper;
          }
    
          return new LoggerWrapperImpl(prefix);
        }
      }, {
        key: "updateLoggerConfig",
        value: function updateLoggerConfig(inputConfig) {
          var config = inputConfig || {};
          this._level = config.level || LogLevel.INFO;
          this._clientLogger = config.logger || null;
          this._logsDestination = _constants__WEBPACK_IMPORTED_MODULE_1__["LOGS_DESTINATION"].NULL;
    
          if (config.debug) {
            this._logsDestination = _constants__WEBPACK_IMPORTED_MODULE_1__["LOGS_DESTINATION"].DEBUG;
          }
    
          if (config.logger) {
            this._logsDestination = _constants__WEBPACK_IMPORTED_MODULE_1__["LOGS_DESTINATION"].CLIENT_LOGGER;
          }
        }
      }]);
    
      return LogManagerImpl;
    }();
    
    var LoggerWrapper =
    /*#__PURE__*/
    function () {
      function LoggerWrapper() {
        _classCallCheck(this, LoggerWrapper);
      }
    
      _createClass(LoggerWrapper, [{
        key: "debug",
        value: function debug() {}
      }, {
        key: "info",
        value: function info() {}
      }, {
        key: "warn",
        value: function warn() {}
      }, {
        key: "error",
        value: function error() {}
      }]);
    
      return LoggerWrapper;
    }();
    
    var LoggerWrapperImpl =
    /*#__PURE__*/
    function (_LoggerWrapper) {
      _inherits(LoggerWrapperImpl, _LoggerWrapper);
    
      function LoggerWrapperImpl(prefix) {
        var _this;
    
        _classCallCheck(this, LoggerWrapperImpl);
    
        _this = _possibleConstructorReturn(this, _getPrototypeOf(LoggerWrapperImpl).call(this));
        _this.prefix = prefix || "";
        return _this;
      }
    
      _createClass(LoggerWrapperImpl, [{
        key: "debug",
        value: function debug() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
    
          this._log(LogLevel.DEBUG, args);
        }
      }, {
        key: "info",
        value: function info() {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
    
          this._log(LogLevel.INFO, args);
        }
      }, {
        key: "warn",
        value: function warn() {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }
    
          this._log(LogLevel.WARN, args);
        }
      }, {
        key: "error",
        value: function error() {
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }
    
          this._log(LogLevel.ERROR, args);
        }
      }, {
        key: "_shouldLog",
        value: function _shouldLog(level) {
          return LogManager.hasClientLogger() && LogManager.isLevelEnabled(level);
        }
      }, {
        key: "_writeToClientLogger",
        value: function _writeToClientLogger(level, logStatement) {
          LogManager.writeToClientLogger(level, logStatement);
        }
      }, {
        key: "_log",
        value: function _log(level, args) {
          if (this._shouldLog(level)) {
            var logStatement = this._convertToSingleStatement(args);
    
            this._writeToClientLogger(level, logStatement);
          }
        }
      }, {
        key: "_convertToSingleStatement",
        value: function _convertToSingleStatement(args) {
          var logStatement = "";
    
          if (this.prefix) {
            logStatement += this.prefix + " ";
          }
    
          for (var index = 0; index < args.length; index++) {
            var arg = args[index];
            logStatement += this._convertToString(arg) + " ";
          }
    
          return logStatement;
        }
      }, {
        key: "_convertToString",
        value: function _convertToString(arg) {
          try {
            if (!arg) {
              return "";
            }
    
            if (_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isString(arg)) {
              return arg;
            }
    
            if (_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(arg) && _utils__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(arg.toString)) {
              var toStringResult = arg.toString();
    
              if (toStringResult !== "[object Object]") {
                return toStringResult;
              }
            }
    
            return JSON.stringify(arg);
          } catch (error) {
            console.error("Error while converting argument to string", arg, error);
            return "";
          }
        }
      }]);
    
      return LoggerWrapperImpl;
    }(LoggerWrapper);
    
    var createConsoleLogger = function createConsoleLogger() {
      var logger = new LoggerWrapper();
      logger.debug = console.debug.bind(window.console);
      logger.info = console.info.bind(window.console);
      logger.warn = console.warn.bind(window.console);
      logger.error = console.error.bind(window.console);
      return logger;
    };
    
    var LogManager = new LogManagerImpl();
    
    
    /***/ }),
    
    /***/ "./src/paho-mqtt.js":
    /*!**************************!*\
      !*** ./src/paho-mqtt.js ***!
      \**************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {
    
    /* WEBPACK VAR INJECTION */(function(global, module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    /* eslint-disable */
    // Below is the Paho mqtt version 1.0.1
    // Please test properly if you change the version of this file.
    
    /*******************************************************************************
     * Copyright (c) 2013 IBM Corp.
     *
     * All rights reserved. This program and the accompanying materials
     * are made available under the terms of the Eclipse Public License v1.0
     * and Eclipse Distribution License v1.0 which accompany this distribution.
     *
     * The Eclipse Public License is available at
     *    http://www.eclipse.org/legal/epl-v10.html
     * and the Eclipse Distribution License is available at
     *   http://www.eclipse.org/org/documents/edl-v10.php.
     *
     * Contributors:
     *    Andrew Banks - initial API and implementation and initial documentation
     *******************************************************************************/
    // Only expose a single object name in the global namespace.
    // Everything must go through this module. Global Paho module
    // only has a single public function, client, which returns
    // a Paho client object given connection details.
    
    /**
     * Send and receive messages using web browsers.
     * <p>
     * This programming interface lets a JavaScript client application use the MQTT V3.1 or
     * V3.1.1 protocol to connect to an MQTT-supporting messaging server.
     *
     * The function supported includes:
     * <ol>
     * <li>Connecting to and disconnecting from a server. The server is identified by its host name and port number.
     * <li>Specifying options that relate to the communications link with the server,
     * for example the frequency of keep-alive heartbeats, and whether SSL/TLS is required.
     * <li>Subscribing to and receiving messages from MQTT Topics.
     * <li>Publishing messages to MQTT Topics.
     * </ol>
     * <p>
     * The API consists of two main objects:
     * <dl>
     * <dt><b>{@link Paho.Client}</b></dt>
     * <dd>This contains methods that provide the functionality of the API,
     * including provision of callbacks that notify the application when a message
     * arrives from or is delivered to the messaging server,
     * or when the status of its connection to the messaging server changes.</dd>
     * <dt><b>{@link Paho.Message}</b></dt>
     * <dd>This encapsulates the payload of the message along with various attributes
     * associated with its delivery, in particular the destination to which it has
     * been (or is about to be) sent.</dd>
     * </dl>
     * <p>
     * The programming interface validates parameters passed to it, and will throw
     * an Error containing an error message intended for developer use, if it detects
     * an error with any parameter.
     * <p>
     * Example:
     *
     * <code><pre>
    var client = new Paho.MQTT.Client(location.hostname, Number(location.port), "clientId");
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({onSuccess:onConnect});
    
    function onConnect() {
      // Once a connection has been made, make a subscription and send a message.
      console.log("onConnect");
      client.subscribe("/World");
      var message = new Paho.MQTT.Message("Hello");
      message.destinationName = "/World";
      client.send(message);
    };
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0)
        console.log("onConnectionLost:"+responseObject.errorMessage);
    };
    function onMessageArrived(message) {
      console.log("onMessageArrived:"+message.payloadString);
      client.disconnect();
    };
     * </pre></code>
     * @namespace Paho
     */
    
    /* jshint shadow:true */
    (function ExportLibrary(root, factory) {
      if (( false ? undefined : _typeof(exports)) === "object" && ( false ? undefined : _typeof(module)) === "object") {
        module.exports = factory();
      } else if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
                    __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
                    (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
                    __WEBPACK_AMD_DEFINE_FACTORY__),
                    __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
      } else {}
    })(this, function LibraryFactory() {
      var PahoMQTT = function (global) {
        // Private variables below, these are only visible inside the function closure
        // which is used to define the module.
        var version = "@VERSION@-@BUILDLEVEL@";
        /**
         * @private
         */
    
        var localStorage = global.localStorage || function () {
          var data = {};
          return {
            setItem: function setItem(key, item) {
              data[key] = item;
            },
            getItem: function getItem(key) {
              return data[key];
            },
            removeItem: function removeItem(key) {
              delete data[key];
            }
          };
        }();
        /**
         * Unique message type identifiers, with associated
         * associated integer values.
         * @private
         */
    
    
        var MESSAGE_TYPE = {
          CONNECT: 1,
          CONNACK: 2,
          PUBLISH: 3,
          PUBACK: 4,
          PUBREC: 5,
          PUBREL: 6,
          PUBCOMP: 7,
          SUBSCRIBE: 8,
          SUBACK: 9,
          UNSUBSCRIBE: 10,
          UNSUBACK: 11,
          PINGREQ: 12,
          PINGRESP: 13,
          DISCONNECT: 14
        }; // Collection of utility methods used to simplify module code
        // and promote the DRY pattern.
    
        /**
         * Validate an object's parameter names to ensure they
         * match a list of expected variables name for this option
         * type. Used to ensure option object passed into the API don't
         * contain erroneous parameters.
         * @param {Object} obj - User options object
         * @param {Object} keys - valid keys and types that may exist in obj.
         * @throws {Error} Invalid option parameter found.
         * @private
         */
    
        var validate = function validate(obj, keys) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              if (keys.hasOwnProperty(key)) {
                if (_typeof(obj[key]) !== keys[key]) throw new Error(format(ERROR.INVALID_TYPE, [_typeof(obj[key]), key]));
              } else {
                var errorStr = "Unknown property, " + key + ". Valid properties are:";
    
                for (var validKey in keys) {
                  if (keys.hasOwnProperty(validKey)) errorStr = errorStr + " " + validKey;
                }
    
                throw new Error(errorStr);
              }
            }
          }
        };
        /**
         * Return a new function which runs the user function bound
         * to a fixed scope.
         * @param {function} User function
         * @param {object} Function scope
         * @return {function} User function bound to another scope
         * @private
         */
    
    
        var scope = function scope(f, _scope) {
          return function () {
            return f.apply(_scope, arguments);
          };
        };
        /**
         * Unique message type identifiers, with associated
         * associated integer values.
         * @private
         */
    
    
        var ERROR = {
          OK: {
            code: 0,
            text: "AMQJSC0000I OK."
          },
          CONNECT_TIMEOUT: {
            code: 1,
            text: "AMQJSC0001E Connect timed out."
          },
          SUBSCRIBE_TIMEOUT: {
            code: 2,
            text: "AMQJS0002E Subscribe timed out."
          },
          UNSUBSCRIBE_TIMEOUT: {
            code: 3,
            text: "AMQJS0003E Unsubscribe timed out."
          },
          PING_TIMEOUT: {
            code: 4,
            text: "AMQJS0004E Ping timed out."
          },
          INTERNAL_ERROR: {
            code: 5,
            text: "AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}"
          },
          CONNACK_RETURNCODE: {
            code: 6,
            text: "AMQJS0006E Bad Connack return code:{0} {1}."
          },
          SOCKET_ERROR: {
            code: 7,
            text: "AMQJS0007E Socket error:{0}."
          },
          SOCKET_CLOSE: {
            code: 8,
            text: "AMQJS0008I Socket closed."
          },
          MALFORMED_UTF: {
            code: 9,
            text: "AMQJS0009E Malformed UTF data:{0} {1} {2}."
          },
          UNSUPPORTED: {
            code: 10,
            text: "AMQJS0010E {0} is not supported by this browser."
          },
          INVALID_STATE: {
            code: 11,
            text: "AMQJS0011E Invalid state {0}."
          },
          INVALID_TYPE: {
            code: 12,
            text: "AMQJS0012E Invalid type {0} for {1}."
          },
          INVALID_ARGUMENT: {
            code: 13,
            text: "AMQJS0013E Invalid argument {0} for {1}."
          },
          UNSUPPORTED_OPERATION: {
            code: 14,
            text: "AMQJS0014E Unsupported operation."
          },
          INVALID_STORED_DATA: {
            code: 15,
            text: "AMQJS0015E Invalid data in local storage key={0} value={1}."
          },
          INVALID_MQTT_MESSAGE_TYPE: {
            code: 16,
            text: "AMQJS0016E Invalid MQTT message type {0}."
          },
          MALFORMED_UNICODE: {
            code: 17,
            text: "AMQJS0017E Malformed Unicode string:{0} {1}."
          },
          BUFFER_FULL: {
            code: 18,
            text: "AMQJS0018E Message buffer is full, maximum buffer size: {0}."
          }
        };
        /** CONNACK RC Meaning. */
    
        var CONNACK_RC = {
          0: "Connection Accepted",
          1: "Connection Refused: unacceptable protocol version",
          2: "Connection Refused: identifier rejected",
          3: "Connection Refused: server unavailable",
          4: "Connection Refused: bad user name or password",
          5: "Connection Refused: not authorized"
        };
        /**
         * Format an error message text.
         * @private
         * @param {error} ERROR value above.
         * @param {substitutions} [array] substituted into the text.
         * @return the text with the substitutions made.
         */
    
        var format = function format(error, substitutions) {
          var text = error.text;
    
          if (substitutions) {
            var field, start;
    
            for (var i = 0; i < substitutions.length; i++) {
              field = "{" + i + "}";
              start = text.indexOf(field);
    
              if (start > 0) {
                var part1 = text.substring(0, start);
                var part2 = text.substring(start + field.length);
                text = part1 + substitutions[i] + part2;
              }
            }
          }
    
          return text;
        }; //MQTT protocol and version          6    M    Q    I    s    d    p    3
    
    
        var MqttProtoIdentifierv3 = [0x00, 0x06, 0x4d, 0x51, 0x49, 0x73, 0x64, 0x70, 0x03]; //MQTT proto/version for 311         4    M    Q    T    T    4
    
        var MqttProtoIdentifierv4 = [0x00, 0x04, 0x4d, 0x51, 0x54, 0x54, 0x04];
        /**
         * Construct an MQTT wire protocol message.
         * @param type MQTT packet type.
         * @param options optional wire message attributes.
         *
         * Optional properties
         *
         * messageIdentifier: message ID in the range [0..65535]
         * payloadMessage:	Application Message - PUBLISH only
         * connectStrings:	array of 0 or more Strings to be put into the CONNECT payload
         * topics:			array of strings (SUBSCRIBE, UNSUBSCRIBE)
         * requestQoS:		array of QoS values [0..2]
         *
         * "Flag" properties
         * cleanSession:	true if present / false if absent (CONNECT)
         * willMessage:  	true if present / false if absent (CONNECT)
         * isRetained:		true if present / false if absent (CONNECT)
         * userName:		true if present / false if absent (CONNECT)
         * password:		true if present / false if absent (CONNECT)
         * keepAliveInterval:	integer [0..65535]  (CONNECT)
         *
         * @private
         * @ignore
         */
    
        var WireMessage = function WireMessage(type, options) {
          this.type = type;
    
          for (var name in options) {
            if (options.hasOwnProperty(name)) {
              this[name] = options[name];
            }
          }
        };
    
        WireMessage.prototype.encode = function () {
          // Compute the first byte of the fixed header
          var first = (this.type & 0x0f) << 4;
          /*
           * Now calculate the length of the variable header + payload by adding up the lengths
           * of all the component parts
           */
    
          var remLength = 0;
          var topicStrLength = [];
          var destinationNameLength = 0;
          var willMessagePayloadBytes; // if the message contains a messageIdentifier then we need two bytes for that
    
          if (this.messageIdentifier !== undefined) remLength += 2;
    
          switch (this.type) {
            // If this a Connect then we need to include 12 bytes for its header
            case MESSAGE_TYPE.CONNECT:
              switch (this.mqttVersion) {
                case 3:
                  remLength += MqttProtoIdentifierv3.length + 3;
                  break;
    
                case 4:
                  remLength += MqttProtoIdentifierv4.length + 3;
                  break;
              }
    
              remLength += UTF8Length(this.clientId) + 2;
    
              if (this.willMessage !== undefined) {
                remLength += UTF8Length(this.willMessage.destinationName) + 2; // Will message is always a string, sent as UTF-8 characters with a preceding length.
    
                willMessagePayloadBytes = this.willMessage.payloadBytes;
                if (!(willMessagePayloadBytes instanceof Uint8Array)) willMessagePayloadBytes = new Uint8Array(payloadBytes);
                remLength += willMessagePayloadBytes.byteLength + 2;
              }
    
              if (this.userName !== undefined) remLength += UTF8Length(this.userName) + 2;
              if (this.password !== undefined) remLength += UTF8Length(this.password) + 2;
              break;
            // Subscribe, Unsubscribe can both contain topic strings
    
            case MESSAGE_TYPE.SUBSCRIBE:
              first |= 0x02; // Qos = 1;
    
              for (var i = 0; i < this.topics.length; i++) {
                topicStrLength[i] = UTF8Length(this.topics[i]);
                remLength += topicStrLength[i] + 2;
              }
    
              remLength += this.requestedQos.length; // 1 byte for each topic's Qos
              // QoS on Subscribe only
    
              break;
    
            case MESSAGE_TYPE.UNSUBSCRIBE:
              first |= 0x02; // Qos = 1;
    
              for (var i = 0; i < this.topics.length; i++) {
                topicStrLength[i] = UTF8Length(this.topics[i]);
                remLength += topicStrLength[i] + 2;
              }
    
              break;
    
            case MESSAGE_TYPE.PUBREL:
              first |= 0x02; // Qos = 1;
    
              break;
    
            case MESSAGE_TYPE.PUBLISH:
              if (this.payloadMessage.duplicate) first |= 0x08;
              first = first |= this.payloadMessage.qos << 1;
              if (this.payloadMessage.retained) first |= 0x01;
              destinationNameLength = UTF8Length(this.payloadMessage.destinationName);
              remLength += destinationNameLength + 2;
              var payloadBytes = this.payloadMessage.payloadBytes;
              remLength += payloadBytes.byteLength;
              if (payloadBytes instanceof ArrayBuffer) payloadBytes = new Uint8Array(payloadBytes);else if (!(payloadBytes instanceof Uint8Array)) payloadBytes = new Uint8Array(payloadBytes.buffer);
              break;
    
            case MESSAGE_TYPE.DISCONNECT:
              break;
    
            default:
              break;
          } // Now we can allocate a buffer for the message
    
    
          var mbi = encodeMBI(remLength); // Convert the length to MQTT MBI format
    
          var pos = mbi.length + 1; // Offset of start of variable header
    
          var buffer = new ArrayBuffer(remLength + pos);
          var byteStream = new Uint8Array(buffer); // view it as a sequence of bytes
          //Write the fixed header into the buffer
    
          byteStream[0] = first;
          byteStream.set(mbi, 1); // If this is a PUBLISH then the variable header starts with a topic
    
          if (this.type == MESSAGE_TYPE.PUBLISH) pos = writeString(this.payloadMessage.destinationName, destinationNameLength, byteStream, pos); // If this is a CONNECT then the variable header contains the protocol name/version, flags and keepalive time
          else if (this.type == MESSAGE_TYPE.CONNECT) {
              switch (this.mqttVersion) {
                case 3:
                  byteStream.set(MqttProtoIdentifierv3, pos);
                  pos += MqttProtoIdentifierv3.length;
                  break;
    
                case 4:
                  byteStream.set(MqttProtoIdentifierv4, pos);
                  pos += MqttProtoIdentifierv4.length;
                  break;
              }
    
              var connectFlags = 0;
              if (this.cleanSession) connectFlags = 0x02;
    
              if (this.willMessage !== undefined) {
                connectFlags |= 0x04;
                connectFlags |= this.willMessage.qos << 3;
    
                if (this.willMessage.retained) {
                  connectFlags |= 0x20;
                }
              }
    
              if (this.userName !== undefined) connectFlags |= 0x80;
              if (this.password !== undefined) connectFlags |= 0x40;
              byteStream[pos++] = connectFlags;
              pos = writeUint16(this.keepAliveInterval, byteStream, pos);
            } // Output the messageIdentifier - if there is one
    
          if (this.messageIdentifier !== undefined) pos = writeUint16(this.messageIdentifier, byteStream, pos);
    
          switch (this.type) {
            case MESSAGE_TYPE.CONNECT:
              pos = writeString(this.clientId, UTF8Length(this.clientId), byteStream, pos);
    
              if (this.willMessage !== undefined) {
                pos = writeString(this.willMessage.destinationName, UTF8Length(this.willMessage.destinationName), byteStream, pos);
                pos = writeUint16(willMessagePayloadBytes.byteLength, byteStream, pos);
                byteStream.set(willMessagePayloadBytes, pos);
                pos += willMessagePayloadBytes.byteLength;
              }
    
              if (this.userName !== undefined) pos = writeString(this.userName, UTF8Length(this.userName), byteStream, pos);
              if (this.password !== undefined) pos = writeString(this.password, UTF8Length(this.password), byteStream, pos);
              break;
    
            case MESSAGE_TYPE.PUBLISH:
              // PUBLISH has a text or binary payload, if text do not add a 2 byte length field, just the UTF characters.
              byteStream.set(payloadBytes, pos);
              break;
            //    	    case MESSAGE_TYPE.PUBREC:
            //    	    case MESSAGE_TYPE.PUBREL:
            //    	    case MESSAGE_TYPE.PUBCOMP:
            //    	    	break;
    
            case MESSAGE_TYPE.SUBSCRIBE:
              // SUBSCRIBE has a list of topic strings and request QoS
              for (var i = 0; i < this.topics.length; i++) {
                pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
                byteStream[pos++] = this.requestedQos[i];
              }
    
              break;
    
            case MESSAGE_TYPE.UNSUBSCRIBE:
              // UNSUBSCRIBE has a list of topic strings
              for (var i = 0; i < this.topics.length; i++) {
                pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
              }
    
              break;
    
            default: // Do nothing.
    
          }
    
          return buffer;
        };
    
        function decodeMessage(input, pos) {
          var startingPos = pos;
          var first = input[pos];
          var type = first >> 4;
          var messageInfo = first &= 0x0f;
          pos += 1; // Decode the remaining length (MBI format)
    
          var digit;
          var remLength = 0;
          var multiplier = 1;
    
          do {
            if (pos == input.length) {
              return [null, startingPos];
            }
    
            digit = input[pos++];
            remLength += (digit & 0x7f) * multiplier;
            multiplier *= 128;
          } while ((digit & 0x80) !== 0);
    
          var endPos = pos + remLength;
    
          if (endPos > input.length) {
            return [null, startingPos];
          }
    
          var wireMessage = new WireMessage(type);
    
          switch (type) {
            case MESSAGE_TYPE.CONNACK:
              var connectAcknowledgeFlags = input[pos++];
              if (connectAcknowledgeFlags & 0x01) wireMessage.sessionPresent = true;
              wireMessage.returnCode = input[pos++];
              break;
    
            case MESSAGE_TYPE.PUBLISH:
              var qos = messageInfo >> 1 & 0x03;
              var len = readUint16(input, pos);
              pos += 2;
              var topicName = parseUTF8(input, pos, len);
              pos += len; // If QoS 1 or 2 there will be a messageIdentifier
    
              if (qos > 0) {
                wireMessage.messageIdentifier = readUint16(input, pos);
                pos += 2;
              }
    
              var message = new Message(input.subarray(pos, endPos));
              if ((messageInfo & 0x01) == 0x01) message.retained = true;
              if ((messageInfo & 0x08) == 0x08) message.duplicate = true;
              message.qos = qos;
              message.destinationName = topicName;
              wireMessage.payloadMessage = message;
              break;
    
            case MESSAGE_TYPE.PUBACK:
            case MESSAGE_TYPE.PUBREC:
            case MESSAGE_TYPE.PUBREL:
            case MESSAGE_TYPE.PUBCOMP:
            case MESSAGE_TYPE.UNSUBACK:
              wireMessage.messageIdentifier = readUint16(input, pos);
              break;
    
            case MESSAGE_TYPE.SUBACK:
              wireMessage.messageIdentifier = readUint16(input, pos);
              pos += 2;
              wireMessage.returnCode = input.subarray(pos, endPos);
              break;
    
            default:
              break;
          }
    
          return [wireMessage, endPos];
        }
    
        function writeUint16(input, buffer, offset) {
          buffer[offset++] = input >> 8; //MSB
    
          buffer[offset++] = input % 256; //LSB
    
          return offset;
        }
    
        function writeString(input, utf8Length, buffer, offset) {
          offset = writeUint16(utf8Length, buffer, offset);
          stringToUTF8(input, buffer, offset);
          return offset + utf8Length;
        }
    
        function readUint16(buffer, offset) {
          return 256 * buffer[offset] + buffer[offset + 1];
        }
        /**
         * Encodes an MQTT Multi-Byte Integer
         * @private
         */
    
    
        function encodeMBI(number) {
          var output = new Array(1);
          var numBytes = 0;
    
          do {
            var digit = number % 128;
            number = number >> 7;
    
            if (number > 0) {
              digit |= 0x80;
            }
    
            output[numBytes++] = digit;
          } while (number > 0 && numBytes < 4);
    
          return output;
        }
        /**
         * Takes a String and calculates its length in bytes when encoded in UTF8.
         * @private
         */
    
    
        function UTF8Length(input) {
          var output = 0;
    
          for (var i = 0; i < input.length; i++) {
            var charCode = input.charCodeAt(i);
    
            if (charCode > 0x7ff) {
              // Surrogate pair means its a 4 byte character
              if (0xd800 <= charCode && charCode <= 0xdbff) {
                i++;
                output++;
              }
    
              output += 3;
            } else if (charCode > 0x7f) output += 2;else output++;
          }
    
          return output;
        }
        /**
         * Takes a String and writes it into an array as UTF8 encoded bytes.
         * @private
         */
    
    
        function stringToUTF8(input, output, start) {
          var pos = start;
    
          for (var i = 0; i < input.length; i++) {
            var charCode = input.charCodeAt(i); // Check for a surrogate pair.
    
            if (0xd800 <= charCode && charCode <= 0xdbff) {
              var lowCharCode = input.charCodeAt(++i);
    
              if (isNaN(lowCharCode)) {
                throw new Error(format(ERROR.MALFORMED_UNICODE, [charCode, lowCharCode]));
              }
    
              charCode = (charCode - 0xd800 << 10) + (lowCharCode - 0xdc00) + 0x10000;
            }
    
            if (charCode <= 0x7f) {
              output[pos++] = charCode;
            } else if (charCode <= 0x7ff) {
              output[pos++] = charCode >> 6 & 0x1f | 0xc0;
              output[pos++] = charCode & 0x3f | 0x80;
            } else if (charCode <= 0xffff) {
              output[pos++] = charCode >> 12 & 0x0f | 0xe0;
              output[pos++] = charCode >> 6 & 0x3f | 0x80;
              output[pos++] = charCode & 0x3f | 0x80;
            } else {
              output[pos++] = charCode >> 18 & 0x07 | 0xf0;
              output[pos++] = charCode >> 12 & 0x3f | 0x80;
              output[pos++] = charCode >> 6 & 0x3f | 0x80;
              output[pos++] = charCode & 0x3f | 0x80;
            }
          }
    
          return output;
        }
    
        function parseUTF8(input, offset, length) {
          var output = "";
          var utf16;
          var pos = offset;
    
          while (pos < offset + length) {
            var byte1 = input[pos++];
            if (byte1 < 128) utf16 = byte1;else {
              var byte2 = input[pos++] - 128;
              if (byte2 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), ""]));
              if (byte1 < 0xe0) // 2 byte character
                utf16 = 64 * (byte1 - 0xc0) + byte2;else {
                var byte3 = input[pos++] - 128;
                if (byte3 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16)]));
                if (byte1 < 0xf0) // 3 byte character
                  utf16 = 4096 * (byte1 - 0xe0) + 64 * byte2 + byte3;else {
                  var byte4 = input[pos++] - 128;
                  if (byte4 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
                  if (byte1 < 0xf8) // 4 byte character
                    utf16 = 262144 * (byte1 - 0xf0) + 4096 * byte2 + 64 * byte3 + byte4; // longer encodings are not supported
                  else throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
                }
              }
            }
    
            if (utf16 > 0xffff) {
              // 4 byte character - express as a surrogate pair
              utf16 -= 0x10000;
              output += String.fromCharCode(0xd800 + (utf16 >> 10)); // lead character
    
              utf16 = 0xdc00 + (utf16 & 0x3ff); // trail character
            }
    
            output += String.fromCharCode(utf16);
          }
    
          return output;
        }
        /**
         * Repeat keepalive requests, monitor responses.
         * @ignore
         */
    
    
        var Pinger = function Pinger(client, keepAliveInterval) {
          this._client = client;
          this._keepAliveInterval = keepAliveInterval * 1000;
          this.isReset = false;
          var pingReq = new WireMessage(MESSAGE_TYPE.PINGREQ).encode();
    
          var doTimeout = function doTimeout(pinger) {
            return function () {
              return doPing.apply(pinger);
            };
          };
          /** @ignore */
    
    
          var doPing = function doPing() {
            if (!this.isReset) {
              this._client._trace("Pinger.doPing", "Timed out");
    
              this._client._disconnected(ERROR.PING_TIMEOUT.code, format(ERROR.PING_TIMEOUT));
            } else {
              this.isReset = false;
    
              this._client._trace("Pinger.doPing", "send PINGREQ");
    
              this._client.socket.send(pingReq);
    
              this.timeout = setTimeout(doTimeout(this), this._keepAliveInterval);
            }
          };
    
          this.reset = function () {
            this.isReset = true;
            clearTimeout(this.timeout);
            if (this._keepAliveInterval > 0) this.timeout = setTimeout(doTimeout(this), this._keepAliveInterval);
          };
    
          this.cancel = function () {
            clearTimeout(this.timeout);
          };
        };
        /**
         * Monitor request completion.
         * @ignore
         */
    
    
        var Timeout = function Timeout(client, timeoutSeconds, action, args) {
          if (!timeoutSeconds) timeoutSeconds = 30;
    
          var doTimeout = function doTimeout(action, client, args) {
            return function () {
              return action.apply(client, args);
            };
          };
    
          this.timeout = setTimeout(doTimeout(action, client, args), timeoutSeconds * 1000);
    
          this.cancel = function () {
            clearTimeout(this.timeout);
          };
        };
        /**
         * Internal implementation of the Websockets MQTT V3.1 client.
         *
         * @name Paho.ClientImpl @constructor
         * @param {String} host the DNS nameof the webSocket host.
         * @param {Number} port the port number for that host.
         * @param {String} clientId the MQ client identifier.
         */
    
    
        var ClientImpl = function ClientImpl(uri, host, port, path, clientId) {
          // Check dependencies are satisfied in this browser.
          if (!("WebSocket" in global && global.WebSocket !== null)) {
            throw new Error(format(ERROR.UNSUPPORTED, ["WebSocket"]));
          }
    
          if (!("ArrayBuffer" in global && global.ArrayBuffer !== null)) {
            throw new Error(format(ERROR.UNSUPPORTED, ["ArrayBuffer"]));
          }
    
          this._trace("Paho.Client", uri, host, port, path, clientId);
    
          this.host = host;
          this.port = port;
          this.path = path;
          this.uri = uri;
          this.clientId = clientId;
          this._wsuri = null; // Local storagekeys are qualified with the following string.
          // The conditional inclusion of path in the key is for backward
          // compatibility to when the path was not configurable and assumed to
          // be /mqtt
    
          this._localKey = host + ":" + port + (path != "/mqtt" ? ":" + path : "") + ":" + clientId + ":"; // Create private instance-only message queue
          // Internal queue of messages to be sent, in sending order.
    
          this._msg_queue = [];
          this._buffered_msg_queue = []; // Messages we have sent and are expecting a response for, indexed by their respective message ids.
    
          this._sentMessages = {}; // Messages we have received and acknowleged and are expecting a confirm message for
          // indexed by their respective message ids.
    
          this._receivedMessages = {}; // Internal list of callbacks to be executed when messages
          // have been successfully sent over web socket, e.g. disconnect
          // when it doesn't have to wait for ACK, just message is dispatched.
    
          this._notify_msg_sent = {}; // Unique identifier for SEND messages, incrementing
          // counter as messages are sent.
    
          this._message_identifier = 1; // Used to determine the transmission sequence of stored sent messages.
    
          this._sequence = 0; // Load the local state, if any, from the saved version, only restore state relevant to this client.
    
          for (var key in localStorage) {
            if (key.indexOf("Sent:" + this._localKey) === 0 || key.indexOf("Received:" + this._localKey) === 0) this.restore(key);
          }
        }; // Messaging Client public instance members.
    
    
        ClientImpl.prototype.host = null;
        ClientImpl.prototype.port = null;
        ClientImpl.prototype.path = null;
        ClientImpl.prototype.uri = null;
        ClientImpl.prototype.clientId = null; // Messaging Client private instance members.
    
        ClientImpl.prototype.socket = null;
        /* true once we have received an acknowledgement to a CONNECT packet. */
    
        ClientImpl.prototype.connected = false;
        /* The largest message identifier allowed, may not be larger than 2**16 but
         * if set smaller reduces the maximum number of outbound messages allowed.
         */
    
        ClientImpl.prototype.maxMessageIdentifier = 65536;
        ClientImpl.prototype.connectOptions = null;
        ClientImpl.prototype.hostIndex = null;
        ClientImpl.prototype.onConnected = null;
        ClientImpl.prototype.onConnectionLost = null;
        ClientImpl.prototype.onMessageDelivered = null;
        ClientImpl.prototype.onMessageArrived = null;
        ClientImpl.prototype.traceFunction = null;
        ClientImpl.prototype._msg_queue = null;
        ClientImpl.prototype._buffered_msg_queue = null;
        ClientImpl.prototype._connectTimeout = null;
        /* The sendPinger monitors how long we allow before we send data to prove to the server that we are alive. */
    
        ClientImpl.prototype.sendPinger = null;
        /* The receivePinger monitors how long we allow before we require evidence that the server is alive. */
    
        ClientImpl.prototype.receivePinger = null;
        ClientImpl.prototype._reconnectInterval = 1; // Reconnect Delay, starts at 1 second
    
        ClientImpl.prototype._reconnecting = false;
        ClientImpl.prototype._reconnectTimeout = null;
        ClientImpl.prototype.disconnectedPublishing = false;
        ClientImpl.prototype.disconnectedBufferSize = 5000;
        ClientImpl.prototype.receiveBuffer = null;
        ClientImpl.prototype._traceBuffer = null;
        ClientImpl.prototype._MAX_TRACE_ENTRIES = 100;
    
        ClientImpl.prototype.connect = function (connectOptions) {
          var connectOptionsMasked = this._traceMask(connectOptions, "password");
    
          this._trace("Client.connect", connectOptionsMasked, this.socket, this.connected);
    
          if (this.connected) throw new Error(format(ERROR.INVALID_STATE, ["already connected"]));
          if (this.socket) throw new Error(format(ERROR.INVALID_STATE, ["already connected"]));
    
          if (this._reconnecting) {
            // connect() function is called while reconnect is in progress.
            // Terminate the auto reconnect process to use new connect options.
            this._reconnectTimeout.cancel();
    
            this._reconnectTimeout = null;
            this._reconnecting = false;
          }
    
          this.connectOptions = connectOptions;
          this._reconnectInterval = 1;
          this._reconnecting = false;
    
          if (connectOptions.uris) {
            this.hostIndex = 0;
    
            this._doConnect(connectOptions.uris[0]);
          } else {
            this._doConnect(this.uri);
          }
        };
    
        ClientImpl.prototype.subscribe = function (filter, subscribeOptions) {
          this._trace("Client.subscribe", filter, subscribeOptions);
    
          if (!this.connected) throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));
          var wireMessage = new WireMessage(MESSAGE_TYPE.SUBSCRIBE);
          wireMessage.topics = filter.constructor === Array ? filter : [filter];
          if (subscribeOptions.qos === undefined) subscribeOptions.qos = 0;
          wireMessage.requestedQos = [];
    
          for (var i = 0; i < wireMessage.topics.length; i++) {
            wireMessage.requestedQos[i] = subscribeOptions.qos;
          }
    
          if (subscribeOptions.onSuccess) {
            wireMessage.onSuccess = function (grantedQos) {
              subscribeOptions.onSuccess({
                invocationContext: subscribeOptions.invocationContext,
                grantedQos: grantedQos
              });
            };
          }
    
          if (subscribeOptions.onFailure) {
            wireMessage.onFailure = function (errorCode) {
              subscribeOptions.onFailure({
                invocationContext: subscribeOptions.invocationContext,
                errorCode: errorCode,
                errorMessage: format(errorCode)
              });
            };
          }
    
          if (subscribeOptions.timeout) {
            wireMessage.timeOut = new Timeout(this, subscribeOptions.timeout, subscribeOptions.onFailure, [{
              invocationContext: subscribeOptions.invocationContext,
              errorCode: ERROR.SUBSCRIBE_TIMEOUT.code,
              errorMessage: format(ERROR.SUBSCRIBE_TIMEOUT)
            }]);
          } // All subscriptions return a SUBACK.
    
    
          this._requires_ack(wireMessage);
    
          this._schedule_message(wireMessage);
        };
        /** @ignore */
    
    
        ClientImpl.prototype.unsubscribe = function (filter, unsubscribeOptions) {
          this._trace("Client.unsubscribe", filter, unsubscribeOptions);
    
          if (!this.connected) throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));
          var wireMessage = new WireMessage(MESSAGE_TYPE.UNSUBSCRIBE);
          wireMessage.topics = filter.constructor === Array ? filter : [filter];
    
          if (unsubscribeOptions.onSuccess) {
            wireMessage.callback = function () {
              unsubscribeOptions.onSuccess({
                invocationContext: unsubscribeOptions.invocationContext
              });
            };
          }
    
          if (unsubscribeOptions.timeout) {
            wireMessage.timeOut = new Timeout(this, unsubscribeOptions.timeout, unsubscribeOptions.onFailure, [{
              invocationContext: unsubscribeOptions.invocationContext,
              errorCode: ERROR.UNSUBSCRIBE_TIMEOUT.code,
              errorMessage: format(ERROR.UNSUBSCRIBE_TIMEOUT)
            }]);
          } // All unsubscribes return a SUBACK.
    
    
          this._requires_ack(wireMessage);
    
          this._schedule_message(wireMessage);
        };
    
        ClientImpl.prototype.send = function (message) {
          this._trace("Client.send", message);
    
          var wireMessage = new WireMessage(MESSAGE_TYPE.PUBLISH);
          wireMessage.payloadMessage = message;
    
          if (this.connected) {
            // Mark qos 1 & 2 message as "ACK required"
            // For qos 0 message, invoke onMessageDelivered callback if there is one.
            // Then schedule the message.
            if (message.qos > 0) {
              this._requires_ack(wireMessage);
            } else if (this.onMessageDelivered) {
              this._notify_msg_sent[wireMessage] = this.onMessageDelivered(wireMessage.payloadMessage);
            }
    
            this._schedule_message(wireMessage);
          } else {
            // Currently disconnected, will not schedule this message
            // Check if reconnecting is in progress and disconnected publish is enabled.
            if (this._reconnecting && this.disconnectedPublishing) {
              // Check the limit which include the "required ACK" messages
              var messageCount = Object.keys(this._sentMessages).length + this._buffered_msg_queue.length;
    
              if (messageCount > this.disconnectedBufferSize) {
                throw new Error(format(ERROR.BUFFER_FULL, [this.disconnectedBufferSize]));
              } else {
                if (message.qos > 0) {
                  // Mark this message as "ACK required"
                  this._requires_ack(wireMessage);
                } else {
                  wireMessage.sequence = ++this._sequence; // Add messages in fifo order to array, by adding to start
    
                  this._buffered_msg_queue.unshift(wireMessage);
                }
              }
            } else {
              throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));
            }
          }
        };
    
        ClientImpl.prototype.disconnect = function () {
          this._trace("Client.disconnect");
    
          if (this._reconnecting) {
            // disconnect() function is called while reconnect is in progress.
            // Terminate the auto reconnect process.
            this._reconnectTimeout.cancel();
    
            this._reconnectTimeout = null;
            this._reconnecting = false;
          }
    
          if (!this.socket) throw new Error(format(ERROR.INVALID_STATE, ["not connecting or connected"]));
          var wireMessage = new WireMessage(MESSAGE_TYPE.DISCONNECT); // Run the disconnected call back as soon as the message has been sent,
          // in case of a failure later on in the disconnect processing.
          // as a consequence, the _disconected call back may be run several times.
    
          this._notify_msg_sent[wireMessage] = scope(this._disconnected, this);
    
          this._schedule_message(wireMessage);
        };
    
        ClientImpl.prototype.getTraceLog = function () {
          if (this._traceBuffer !== null) {
            this._trace("Client.getTraceLog", new Date());
    
            this._trace("Client.getTraceLog in flight messages", this._sentMessages.length);
    
            for (var key in this._sentMessages) {
              this._trace("_sentMessages ", key, this._sentMessages[key]);
            }
    
            for (var key in this._receivedMessages) {
              this._trace("_receivedMessages ", key, this._receivedMessages[key]);
            }
    
            return this._traceBuffer;
          }
        };
    
        ClientImpl.prototype.startTrace = function () {
          if (this._traceBuffer === null) {
            this._traceBuffer = [];
          }
    
          this._trace("Client.startTrace", new Date(), version);
        };
    
        ClientImpl.prototype.stopTrace = function () {
          delete this._traceBuffer;
        };
    
        ClientImpl.prototype._doConnect = function (wsurl) {
          // When the socket is open, this client will send the CONNECT WireMessage using the saved parameters.
          if (this.connectOptions.useSSL) {
            var uriParts = wsurl.split(":");
            uriParts[0] = "wss";
            wsurl = uriParts.join(":");
          }
    
          this._wsuri = wsurl;
          this.connected = false;
    
          if (this.connectOptions.mqttVersion < 4) {
            this.socket = new WebSocket(wsurl, ["mqttv3.1"]);
          } else {
            this.socket = new WebSocket(wsurl, ["mqtt"]);
          }
    
          this.socket.binaryType = "arraybuffer";
          this.socket.onopen = scope(this._on_socket_open, this);
          this.socket.onmessage = scope(this._on_socket_message, this);
          this.socket.onerror = scope(this._on_socket_error, this);
          this.socket.onclose = scope(this._on_socket_close, this);
          this.sendPinger = new Pinger(this, this.connectOptions.keepAliveInterval);
          this.receivePinger = new Pinger(this, this.connectOptions.keepAliveInterval);
    
          if (this._connectTimeout) {
            this._connectTimeout.cancel();
    
            this._connectTimeout = null;
          }
    
          this._connectTimeout = new Timeout(this, this.connectOptions.timeout, this._disconnected, [ERROR.CONNECT_TIMEOUT.code, format(ERROR.CONNECT_TIMEOUT)]);
        }; // Schedule a new message to be sent over the WebSockets
        // connection. CONNECT messages cause WebSocket connection
        // to be started. All other messages are queued internally
        // until this has happened. When WS connection starts, process
        // all outstanding messages.
    
    
        ClientImpl.prototype._schedule_message = function (message) {
          // Add messages in fifo order to array, by adding to start
          this._msg_queue.unshift(message); // Process outstanding messages in the queue if we have an  open socket, and have received CONNACK.
    
    
          if (this.connected) {
            this._process_queue();
          }
        };
    
        ClientImpl.prototype.store = function (prefix, wireMessage) {
          var storedMessage = {
            type: wireMessage.type,
            messageIdentifier: wireMessage.messageIdentifier,
            version: 1
          };
    
          switch (wireMessage.type) {
            case MESSAGE_TYPE.PUBLISH:
              if (wireMessage.pubRecReceived) storedMessage.pubRecReceived = true; // Convert the payload to a hex string.
    
              storedMessage.payloadMessage = {};
              var hex = "";
              var messageBytes = wireMessage.payloadMessage.payloadBytes;
    
              for (var i = 0; i < messageBytes.length; i++) {
                if (messageBytes[i] <= 0xf) hex = hex + "0" + messageBytes[i].toString(16);else hex = hex + messageBytes[i].toString(16);
              }
    
              storedMessage.payloadMessage.payloadHex = hex;
              storedMessage.payloadMessage.qos = wireMessage.payloadMessage.qos;
              storedMessage.payloadMessage.destinationName = wireMessage.payloadMessage.destinationName;
              if (wireMessage.payloadMessage.duplicate) storedMessage.payloadMessage.duplicate = true;
              if (wireMessage.payloadMessage.retained) storedMessage.payloadMessage.retained = true; // Add a sequence number to sent messages.
    
              if (prefix.indexOf("Sent:") === 0) {
                if (wireMessage.sequence === undefined) wireMessage.sequence = ++this._sequence;
                storedMessage.sequence = wireMessage.sequence;
              }
    
              break;
    
            default:
              throw Error(format(ERROR.INVALID_STORED_DATA, [prefix + this._localKey + wireMessage.messageIdentifier, storedMessage]));
          }
    
          localStorage.setItem(prefix + this._localKey + wireMessage.messageIdentifier, JSON.stringify(storedMessage));
        };
    
        ClientImpl.prototype.restore = function (key) {
          var value = localStorage.getItem(key);
          var storedMessage = JSON.parse(value);
          var wireMessage = new WireMessage(storedMessage.type, storedMessage);
    
          switch (storedMessage.type) {
            case MESSAGE_TYPE.PUBLISH:
              // Replace the payload message with a Message object.
              var hex = storedMessage.payloadMessage.payloadHex;
              var buffer = new ArrayBuffer(hex.length / 2);
              var byteStream = new Uint8Array(buffer);
              var i = 0;
    
              while (hex.length >= 2) {
                var x = parseInt(hex.substring(0, 2), 16);
                hex = hex.substring(2, hex.length);
                byteStream[i++] = x;
              }
    
              var payloadMessage = new Message(byteStream);
              payloadMessage.qos = storedMessage.payloadMessage.qos;
              payloadMessage.destinationName = storedMessage.payloadMessage.destinationName;
              if (storedMessage.payloadMessage.duplicate) payloadMessage.duplicate = true;
              if (storedMessage.payloadMessage.retained) payloadMessage.retained = true;
              wireMessage.payloadMessage = payloadMessage;
              break;
    
            default:
              throw Error(format(ERROR.INVALID_STORED_DATA, [key, value]));
          }
    
          if (key.indexOf("Sent:" + this._localKey) === 0) {
            wireMessage.payloadMessage.duplicate = true;
            this._sentMessages[wireMessage.messageIdentifier] = wireMessage;
          } else if (key.indexOf("Received:" + this._localKey) === 0) {
            this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
          }
        };
    
        ClientImpl.prototype._process_queue = function () {
          var message = null; // Send all queued messages down socket connection
    
          while (message = this._msg_queue.pop()) {
            this._socket_send(message); // Notify listeners that message was successfully sent
    
    
            if (this._notify_msg_sent[message]) {
              this._notify_msg_sent[message]();
    
              delete this._notify_msg_sent[message];
            }
          }
        };
        /**
         * Expect an ACK response for this message. Add message to the set of in progress
         * messages and set an unused identifier in this message.
         * @ignore
         */
    
    
        ClientImpl.prototype._requires_ack = function (wireMessage) {
          var messageCount = Object.keys(this._sentMessages).length;
          if (messageCount > this.maxMessageIdentifier) throw Error("Too many messages:" + messageCount);
    
          while (this._sentMessages[this._message_identifier] !== undefined) {
            this._message_identifier++;
          }
    
          wireMessage.messageIdentifier = this._message_identifier;
          this._sentMessages[wireMessage.messageIdentifier] = wireMessage;
    
          if (wireMessage.type === MESSAGE_TYPE.PUBLISH) {
            this.store("Sent:", wireMessage);
          }
    
          if (this._message_identifier === this.maxMessageIdentifier) {
            this._message_identifier = 1;
          }
        };
        /**
         * Called when the underlying websocket has been opened.
         * @ignore
         */
    
    
        ClientImpl.prototype._on_socket_open = function () {
          // Create the CONNECT message object.
          var wireMessage = new WireMessage(MESSAGE_TYPE.CONNECT, this.connectOptions);
          wireMessage.clientId = this.clientId;
    
          this._socket_send(wireMessage);
        };
        /**
         * Called when the underlying websocket has received a complete packet.
         * @ignore
         */
    
    
        ClientImpl.prototype._on_socket_message = function (event) {
          this._trace("Client._on_socket_message", event.data);
    
          var messages = this._deframeMessages(event.data);
    
          for (var i = 0; i < messages.length; i += 1) {
            this._handleMessage(messages[i]);
          }
        };
    
        ClientImpl.prototype._deframeMessages = function (data) {
          var byteArray = new Uint8Array(data);
          var messages = [];
    
          if (this.receiveBuffer) {
            var newData = new Uint8Array(this.receiveBuffer.length + byteArray.length);
            newData.set(this.receiveBuffer);
            newData.set(byteArray, this.receiveBuffer.length);
            byteArray = newData;
            delete this.receiveBuffer;
          }
    
          try {
            var offset = 0;
    
            while (offset < byteArray.length) {
              var result = decodeMessage(byteArray, offset);
              var wireMessage = result[0];
              offset = result[1];
    
              if (wireMessage !== null) {
                messages.push(wireMessage);
              } else {
                break;
              }
            }
    
            if (offset < byteArray.length) {
              this.receiveBuffer = byteArray.subarray(offset);
            }
          } catch (error) {
            var errorStack = error.hasOwnProperty("stack") == "undefined" ? error.stack.toString() : "No Error Stack Available";
    
            this._disconnected(ERROR.INTERNAL_ERROR.code, format(ERROR.INTERNAL_ERROR, [error.message, errorStack]));
    
            return;
          }
    
          return messages;
        };
    
        ClientImpl.prototype._handleMessage = function (wireMessage) {
          this._trace("Client._handleMessage", wireMessage);
    
          try {
            switch (wireMessage.type) {
              case MESSAGE_TYPE.CONNACK:
                this._connectTimeout.cancel();
    
                if (this._reconnectTimeout) this._reconnectTimeout.cancel(); // If we have started using clean session then clear up the local state.
    
                if (this.connectOptions.cleanSession) {
                  for (var key in this._sentMessages) {
                    var sentMessage = this._sentMessages[key];
                    localStorage.removeItem("Sent:" + this._localKey + sentMessage.messageIdentifier);
                  }
    
                  this._sentMessages = {};
    
                  for (var key in this._receivedMessages) {
                    var receivedMessage = this._receivedMessages[key];
                    localStorage.removeItem("Received:" + this._localKey + receivedMessage.messageIdentifier);
                  }
    
                  this._receivedMessages = {};
                } // Client connected and ready for business.
    
    
                if (wireMessage.returnCode === 0) {
                  this.connected = true; // Jump to the end of the list of uris and stop looking for a good host.
    
                  if (this.connectOptions.uris) this.hostIndex = this.connectOptions.uris.length;
                } else {
                  this._disconnected(ERROR.CONNACK_RETURNCODE.code, format(ERROR.CONNACK_RETURNCODE, [wireMessage.returnCode, CONNACK_RC[wireMessage.returnCode]]));
    
                  break;
                } // Resend messages.
    
    
                var sequencedMessages = [];
    
                for (var msgId in this._sentMessages) {
                  if (this._sentMessages.hasOwnProperty(msgId)) sequencedMessages.push(this._sentMessages[msgId]);
                } // Also schedule qos 0 buffered messages if any
    
    
                if (this._buffered_msg_queue.length > 0) {
                  var msg = null;
    
                  while (msg = this._buffered_msg_queue.pop()) {
                    sequencedMessages.push(msg);
                    if (this.onMessageDelivered) this._notify_msg_sent[msg] = this.onMessageDelivered(msg.payloadMessage);
                  }
                } // Sort sentMessages into the original sent order.
    
    
                var sequencedMessages = sequencedMessages.sort(function (a, b) {
                  return a.sequence - b.sequence;
                });
    
                for (var i = 0, len = sequencedMessages.length; i < len; i++) {
                  var sentMessage = sequencedMessages[i];
    
                  if (sentMessage.type == MESSAGE_TYPE.PUBLISH && sentMessage.pubRecReceived) {
                    var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, {
                      messageIdentifier: sentMessage.messageIdentifier
                    });
    
                    this._schedule_message(pubRelMessage);
                  } else {
                    this._schedule_message(sentMessage);
                  }
                } // Execute the connectOptions.onSuccess callback if there is one.
                // Will also now return if this connection was the result of an automatic
                // reconnect and which URI was successfully connected to.
    
    
                if (this.connectOptions.onSuccess) {
                  this.connectOptions.onSuccess({
                    invocationContext: this.connectOptions.invocationContext
                  });
                }
    
                var reconnected = false;
    
                if (this._reconnecting) {
                  reconnected = true;
                  this._reconnectInterval = 1;
                  this._reconnecting = false;
                } // Execute the onConnected callback if there is one.
    
    
                this._connected(reconnected, this._wsuri); // Process all queued messages now that the connection is established.
    
    
                this._process_queue();
    
                break;
    
              case MESSAGE_TYPE.PUBLISH:
                this._receivePublish(wireMessage);
    
                break;
    
              case MESSAGE_TYPE.PUBACK:
                var sentMessage = this._sentMessages[wireMessage.messageIdentifier]; // If this is a re flow of a PUBACK after we have restarted receivedMessage will not exist.
    
                if (sentMessage) {
                  delete this._sentMessages[wireMessage.messageIdentifier];
                  localStorage.removeItem("Sent:" + this._localKey + wireMessage.messageIdentifier);
                  if (this.onMessageDelivered) this.onMessageDelivered(sentMessage.payloadMessage);
                }
    
                break;
    
              case MESSAGE_TYPE.PUBREC:
                var sentMessage = this._sentMessages[wireMessage.messageIdentifier]; // If this is a re flow of a PUBREC after we have restarted receivedMessage will not exist.
    
                if (sentMessage) {
                  sentMessage.pubRecReceived = true;
                  var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, {
                    messageIdentifier: wireMessage.messageIdentifier
                  });
                  this.store("Sent:", sentMessage);
    
                  this._schedule_message(pubRelMessage);
                }
    
                break;
    
              case MESSAGE_TYPE.PUBREL:
                var receivedMessage = this._receivedMessages[wireMessage.messageIdentifier];
                localStorage.removeItem("Received:" + this._localKey + wireMessage.messageIdentifier); // If this is a re flow of a PUBREL after we have restarted receivedMessage will not exist.
    
                if (receivedMessage) {
                  this._receiveMessage(receivedMessage);
    
                  delete this._receivedMessages[wireMessage.messageIdentifier];
                } // Always flow PubComp, we may have previously flowed PubComp but the server lost it and restarted.
    
    
                var pubCompMessage = new WireMessage(MESSAGE_TYPE.PUBCOMP, {
                  messageIdentifier: wireMessage.messageIdentifier
                });
    
                this._schedule_message(pubCompMessage);
    
                break;
    
              case MESSAGE_TYPE.PUBCOMP:
                var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
                delete this._sentMessages[wireMessage.messageIdentifier];
                localStorage.removeItem("Sent:" + this._localKey + wireMessage.messageIdentifier);
                if (this.onMessageDelivered) this.onMessageDelivered(sentMessage.payloadMessage);
                break;
    
              case MESSAGE_TYPE.SUBACK:
                var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
    
                if (sentMessage) {
                  if (sentMessage.timeOut) sentMessage.timeOut.cancel(); // This will need to be fixed when we add multiple topic support
    
                  if (wireMessage.returnCode[0] === 0x80) {
                    if (sentMessage.onFailure) {
                      sentMessage.onFailure(wireMessage.returnCode);
                    }
                  } else if (sentMessage.onSuccess) {
                    sentMessage.onSuccess(wireMessage.returnCode);
                  }
    
                  delete this._sentMessages[wireMessage.messageIdentifier];
                }
    
                break;
    
              case MESSAGE_TYPE.UNSUBACK:
                var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
    
                if (sentMessage) {
                  if (sentMessage.timeOut) sentMessage.timeOut.cancel();
    
                  if (sentMessage.callback) {
                    sentMessage.callback();
                  }
    
                  delete this._sentMessages[wireMessage.messageIdentifier];
                }
    
                break;
    
              case MESSAGE_TYPE.PINGRESP:
                /* The sendPinger or receivePinger may have sent a ping, the receivePinger has already been reset. */
                this.sendPinger.reset();
                break;
    
              case MESSAGE_TYPE.DISCONNECT:
                // Clients do not expect to receive disconnect packets.
                this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code, format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [wireMessage.type]));
    
                break;
    
              default:
                this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code, format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [wireMessage.type]));
    
            }
          } catch (error) {
            var errorStack = error.hasOwnProperty("stack") == "undefined" ? error.stack.toString() : "No Error Stack Available";
    
            this._disconnected(ERROR.INTERNAL_ERROR.code, format(ERROR.INTERNAL_ERROR, [error.message, errorStack]));
    
            return;
          }
        };
        /** @ignore */
    
    
        ClientImpl.prototype._on_socket_error = function (error) {
          if (!this._reconnecting) {
            this._disconnected(ERROR.SOCKET_ERROR.code, format(ERROR.SOCKET_ERROR, [error.data]));
          }
        };
        /** @ignore */
    
    
        ClientImpl.prototype._on_socket_close = function () {
          if (!this._reconnecting) {
            this._disconnected(ERROR.SOCKET_CLOSE.code, format(ERROR.SOCKET_CLOSE));
          }
        };
        /** @ignore */
    
    
        ClientImpl.prototype._socket_send = function (wireMessage) {
          if (wireMessage.type == 1) {
            var wireMessageMasked = this._traceMask(wireMessage, "password");
    
            this._trace("Client._socket_send", wireMessageMasked);
          } else this._trace("Client._socket_send", wireMessage);
    
          this.socket.send(wireMessage.encode());
          /* We have proved to the server we are alive. */
    
          this.sendPinger.reset();
        };
        /** @ignore */
    
    
        ClientImpl.prototype._receivePublish = function (wireMessage) {
          switch (wireMessage.payloadMessage.qos) {
            case "undefined":
            case 0:
              this._receiveMessage(wireMessage);
    
              break;
    
            case 1:
              var pubAckMessage = new WireMessage(MESSAGE_TYPE.PUBACK, {
                messageIdentifier: wireMessage.messageIdentifier
              });
    
              this._schedule_message(pubAckMessage);
    
              this._receiveMessage(wireMessage);
    
              break;
    
            case 2:
              this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
              this.store("Received:", wireMessage);
              var pubRecMessage = new WireMessage(MESSAGE_TYPE.PUBREC, {
                messageIdentifier: wireMessage.messageIdentifier
              });
    
              this._schedule_message(pubRecMessage);
    
              break;
    
            default:
              throw Error("Invaild qos=" + wireMessage.payloadMessage.qos);
          }
        };
        /** @ignore */
    
    
        ClientImpl.prototype._receiveMessage = function (wireMessage) {
          if (this.onMessageArrived) {
            this.onMessageArrived(wireMessage.payloadMessage);
          }
        };
        /**
         * Client has connected.
         * @param {reconnect} [boolean] indicate if this was a result of reconnect operation.
         * @param {uri} [string] fully qualified WebSocket URI of the server.
         */
    
    
        ClientImpl.prototype._connected = function (reconnect, uri) {
          // Execute the onConnected callback if there is one.
          if (this.onConnected) this.onConnected(reconnect, uri);
        };
        /**
         * Attempts to reconnect the client to the server.
         * For each reconnect attempt, will double the reconnect interval
         * up to 128 seconds.
         */
    
    
        ClientImpl.prototype._reconnect = function () {
          this._trace("Client._reconnect");
    
          if (!this.connected) {
            this._reconnecting = true;
            this.sendPinger.cancel();
            this.receivePinger.cancel();
            if (this._reconnectInterval < 128) this._reconnectInterval = this._reconnectInterval * 2;
    
            if (this.connectOptions.uris) {
              this.hostIndex = 0;
    
              this._doConnect(this.connectOptions.uris[0]);
            } else {
              this._doConnect(this.uri);
            }
          }
        };
        /**
         * Client has disconnected either at its own request or because the server
         * or network disconnected it. Remove all non-durable state.
         * @param {errorCode} [number] the error number.
         * @param {errorText} [string] the error text.
         * @ignore
         */
    
    
        ClientImpl.prototype._disconnected = function (errorCode, errorText) {
          this._trace("Client._disconnected", errorCode, errorText);
    
          if (errorCode !== undefined && this._reconnecting) {
            //Continue automatic reconnect process
            this._reconnectTimeout = new Timeout(this, this._reconnectInterval, this._reconnect);
            return;
          }
    
          this.sendPinger.cancel();
          this.receivePinger.cancel();
    
          if (this._connectTimeout) {
            this._connectTimeout.cancel();
    
            this._connectTimeout = null;
          } // Clear message buffers.
    
    
          this._msg_queue = [];
          this._buffered_msg_queue = [];
          this._notify_msg_sent = {};
    
          if (this.socket) {
            // Cancel all socket callbacks so that they cannot be driven again by this socket.
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onerror = null;
            this.socket.onclose = null;
            if (this.socket.readyState === 1) this.socket.close();
            delete this.socket;
          }
    
          if (this.connectOptions.uris && this.hostIndex < this.connectOptions.uris.length - 1) {
            // Try the next host.
            this.hostIndex++;
    
            this._doConnect(this.connectOptions.uris[this.hostIndex]);
          } else {
            if (errorCode === undefined) {
              errorCode = ERROR.OK.code;
              errorText = format(ERROR.OK);
            } // Run any application callbacks last as they may attempt to reconnect and hence create a new socket.
    
    
            if (this.connected) {
              this.connected = false; // Execute the connectionLostCallback if there is one, and we were connected.
    
              if (this.onConnectionLost) {
                this.onConnectionLost({
                  errorCode: errorCode,
                  errorMessage: errorText,
                  reconnect: this.connectOptions.reconnect,
                  uri: this._wsuri
                });
              }
    
              if (errorCode !== ERROR.OK.code && this.connectOptions.reconnect) {
                // Start automatic reconnect process for the very first time since last successful connect.
                this._reconnectInterval = 1;
    
                this._reconnect();
    
                return;
              }
            } else {
              // Otherwise we never had a connection, so indicate that the connect has failed.
              if (this.connectOptions.mqttVersion === 4 && this.connectOptions.mqttVersionExplicit === false) {
                this._trace("Failed to connect V4, dropping back to V3");
    
                this.connectOptions.mqttVersion = 3;
    
                if (this.connectOptions.uris) {
                  this.hostIndex = 0;
    
                  this._doConnect(this.connectOptions.uris[0]);
                } else {
                  this._doConnect(this.uri);
                }
              } else if (this.connectOptions.onFailure) {
                this.connectOptions.onFailure({
                  invocationContext: this.connectOptions.invocationContext,
                  errorCode: errorCode,
                  errorMessage: errorText
                });
              }
            }
          }
        };
        /** @ignore */
    
    
        ClientImpl.prototype._trace = function () {
          // Pass trace message back to client's callback function
          if (this.traceFunction) {
            var args = Array.prototype.slice.call(arguments);
    
            for (var i in args) {
              if (typeof args[i] !== "undefined") args.splice(i, 1, JSON.stringify(args[i]));
            }
    
            var record = args.join("");
            this.traceFunction({
              severity: "Debug",
              message: record
            });
          } //buffer style trace
    
    
          if (this._traceBuffer !== null) {
            for (var i = 0, max = arguments.length; i < max; i++) {
              if (this._traceBuffer.length == this._MAX_TRACE_ENTRIES) {
                this._traceBuffer.shift();
              }
    
              if (i === 0) this._traceBuffer.push(arguments[i]);else if (typeof arguments[i] === "undefined") this._traceBuffer.push(arguments[i]);else this._traceBuffer.push("  " + JSON.stringify(arguments[i]));
            }
          }
        };
        /** @ignore */
    
    
        ClientImpl.prototype._traceMask = function (traceObject, masked) {
          var traceObjectMasked = {};
    
          for (var attr in traceObject) {
            if (traceObject.hasOwnProperty(attr)) {
              if (attr == masked) traceObjectMasked[attr] = "******";else traceObjectMasked[attr] = traceObject[attr];
            }
          }
    
          return traceObjectMasked;
        }; // ------------------------------------------------------------------------
        // Public Programming interface.
        // ------------------------------------------------------------------------
    
        /**
         * The JavaScript application communicates to the server using a {@link Paho.Client} object.
         * <p>
         * Most applications will create just one Client object and then call its connect() method,
         * however applications can create more than one Client object if they wish.
         * In this case the combination of host, port and clientId attributes must be different for each Client object.
         * <p>
         * The send, subscribe and unsubscribe methods are implemented as asynchronous JavaScript methods
         * (even though the underlying protocol exchange might be synchronous in nature).
         * This means they signal their completion by calling back to the application,
         * via Success or Failure callback functions provided by the application on the method in question.
         * Such callbacks are called at most once per method invocation and do not persist beyond the lifetime
         * of the script that made the invocation.
         * <p>
         * In contrast there are some callback functions, most notably <i>onMessageArrived</i>,
         * that are defined on the {@link Paho.Client} object.
         * These may get called multiple times, and aren't directly related to specific method invocations made by the client.
         *
         * @name Paho.Client
         *
         * @constructor
         *
         * @param {string} host - the address of the messaging server, as a fully qualified WebSocket URI, as a DNS name or dotted decimal IP address.
         * @param {number} port - the port number to connect to - only required if host is not a URI
         * @param {string} path - the path on the host to connect to - only used if host is not a URI. Default: '/mqtt'.
         * @param {string} clientId - the Messaging client identifier, between 1 and 23 characters in length.
         *
         * @property {string} host - <i>read only</i> the server's DNS hostname or dotted decimal IP address.
         * @property {number} port - <i>read only</i> the server's port.
         * @property {string} path - <i>read only</i> the server's path.
         * @property {string} clientId - <i>read only</i> used when connecting to the server.
         * @property {function} onConnectionLost - called when a connection has been lost.
         *                            after a connect() method has succeeded.
         *                            Establish the call back used when a connection has been lost. The connection may be
         *                            lost because the client initiates a disconnect or because the server or network
         *                            cause the client to be disconnected. The disconnect call back may be called without
         *                            the connectionComplete call back being invoked if, for example the client fails to
         *                            connect.
         *                            A single response object parameter is passed to the onConnectionLost callback containing the following fields:
         *                            <ol>
         *                            <li>errorCode
         *                            <li>errorMessage
         *                            </ol>
         * @property {function} onMessageDelivered - called when a message has been delivered.
         *                            All processing that this Client will ever do has been completed. So, for example,
         *                            in the case of a Qos=2 message sent by this client, the PubComp flow has been received from the server
         *                            and the message has been removed from persistent storage before this callback is invoked.
         *                            Parameters passed to the onMessageDelivered callback are:
         *                            <ol>
         *                            <li>{@link Paho.Message} that was delivered.
         *                            </ol>
         * @property {function} onMessageArrived - called when a message has arrived in this Paho.client.
         *                            Parameters passed to the onMessageArrived callback are:
         *                            <ol>
         *                            <li>{@link Paho.Message} that has arrived.
         *                            </ol>
         * @property {function} onConnected - called when a connection is successfully made to the server.
         *                                  after a connect() method.
         *                                  Parameters passed to the onConnected callback are:
         *                                  <ol>
         *                                  <li>reconnect (boolean) - If true, the connection was the result of a reconnect.</li>
         *                                  <li>URI (string) - The URI used to connect to the server.</li>
         *                                  </ol>
         * @property {boolean} disconnectedPublishing - if set, will enable disconnected publishing in
         *                                            in the event that the connection to the server is lost.
         * @property {number} disconnectedBufferSize - Used to set the maximum number of messages that the disconnected
         *                                             buffer will hold before rejecting new messages. Default size: 5000 messages
         * @property {function} trace - called whenever trace is called. TODO
         */
    
    
        var Client = function Client(host, port, path, clientId) {
          var uri;
          if (typeof host !== "string") throw new Error(format(ERROR.INVALID_TYPE, [_typeof(host), "host"]));
    
          if (arguments.length == 2) {
            // host: must be full ws:// uri
            // port: clientId
            clientId = port;
            uri = host;
            var match = uri.match(/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/);
    
            if (match) {
              host = match[4] || match[2];
              port = parseInt(match[7]);
              path = match[8];
            } else {
              throw new Error(format(ERROR.INVALID_ARGUMENT, [host, "host"]));
            }
          } else {
            if (arguments.length == 3) {
              clientId = path;
              path = "/mqtt";
            }
    
            if (typeof port !== "number" || port < 0) throw new Error(format(ERROR.INVALID_TYPE, [_typeof(port), "port"]));
            if (typeof path !== "string") throw new Error(format(ERROR.INVALID_TYPE, [_typeof(path), "path"]));
            var ipv6AddSBracket = host.indexOf(":") !== -1 && host.slice(0, 1) !== "[" && host.slice(-1) !== "]";
            uri = "ws://" + (ipv6AddSBracket ? "[" + host + "]" : host) + ":" + port + path;
          }
    
          var clientIdLength = 0;
    
          for (var i = 0; i < clientId.length; i++) {
            var charCode = clientId.charCodeAt(i);
    
            if (0xd800 <= charCode && charCode <= 0xdbff) {
              i++; // Surrogate pair.
            }
    
            clientIdLength++;
          }
    
          if (typeof clientId !== "string" || clientIdLength > 65535) throw new Error(format(ERROR.INVALID_ARGUMENT, [clientId, "clientId"]));
          var client = new ClientImpl(uri, host, port, path, clientId); //Public Properties
    
          Object.defineProperties(this, {
            host: {
              get: function get() {
                return host;
              },
              set: function set() {
                throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
              }
            },
            port: {
              get: function get() {
                return port;
              },
              set: function set() {
                throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
              }
            },
            path: {
              get: function get() {
                return path;
              },
              set: function set() {
                throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
              }
            },
            uri: {
              get: function get() {
                return uri;
              },
              set: function set() {
                throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
              }
            },
            clientId: {
              get: function get() {
                return client.clientId;
              },
              set: function set() {
                throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
              }
            },
            onConnected: {
              get: function get() {
                return client.onConnected;
              },
              set: function set(newOnConnected) {
                if (typeof newOnConnected === "function") client.onConnected = newOnConnected;else throw new Error(format(ERROR.INVALID_TYPE, [_typeof(newOnConnected), "onConnected"]));
              }
            },
            disconnectedPublishing: {
              get: function get() {
                return client.disconnectedPublishing;
              },
              set: function set(newDisconnectedPublishing) {
                client.disconnectedPublishing = newDisconnectedPublishing;
              }
            },
            disconnectedBufferSize: {
              get: function get() {
                return client.disconnectedBufferSize;
              },
              set: function set(newDisconnectedBufferSize) {
                client.disconnectedBufferSize = newDisconnectedBufferSize;
              }
            },
            onConnectionLost: {
              get: function get() {
                return client.onConnectionLost;
              },
              set: function set(newOnConnectionLost) {
                if (typeof newOnConnectionLost === "function") client.onConnectionLost = newOnConnectionLost;else throw new Error(format(ERROR.INVALID_TYPE, [_typeof(newOnConnectionLost), "onConnectionLost"]));
              }
            },
            onMessageDelivered: {
              get: function get() {
                return client.onMessageDelivered;
              },
              set: function set(newOnMessageDelivered) {
                if (typeof newOnMessageDelivered === "function") client.onMessageDelivered = newOnMessageDelivered;else throw new Error(format(ERROR.INVALID_TYPE, [_typeof(newOnMessageDelivered), "onMessageDelivered"]));
              }
            },
            onMessageArrived: {
              get: function get() {
                return client.onMessageArrived;
              },
              set: function set(newOnMessageArrived) {
                if (typeof newOnMessageArrived === "function") client.onMessageArrived = newOnMessageArrived;else throw new Error(format(ERROR.INVALID_TYPE, [_typeof(newOnMessageArrived), "onMessageArrived"]));
              }
            },
            trace: {
              get: function get() {
                return client.traceFunction;
              },
              set: function set(trace) {
                if (typeof trace === "function") {
                  client.traceFunction = trace;
                } else {
                  throw new Error(format(ERROR.INVALID_TYPE, [_typeof(trace), "onTrace"]));
                }
              }
            }
          });
          /**
           * Connect this Messaging client to its server.
           *
           * @name Paho.Client#connect
           * @function
           * @param {object} connectOptions - Attributes used with the connection.
           * @param {number} connectOptions.timeout - If the connect has not succeeded within this
           *                    number of seconds, it is deemed to have failed.
           *                    The default is 30 seconds.
           * @param {string} connectOptions.userName - Authentication username for this connection.
           * @param {string} connectOptions.password - Authentication password for this connection.
           * @param {Paho.Message} connectOptions.willMessage - sent by the server when the client
           *                    disconnects abnormally.
           * @param {number} connectOptions.keepAliveInterval - the server disconnects this client if
           *                    there is no activity for this number of seconds.
           *                    The default value of 60 seconds is assumed if not set.
           * @param {boolean} connectOptions.cleanSession - if true(default) the client and server
           *                    persistent state is deleted on successful connect.
           * @param {boolean} connectOptions.useSSL - if present and true, use an SSL Websocket connection.
           * @param {object} connectOptions.invocationContext - passed to the onSuccess callback or onFailure callback.
           * @param {function} connectOptions.onSuccess - called when the connect acknowledgement
           *                    has been received from the server.
           * A single response object parameter is passed to the onSuccess callback containing the following fields:
           * <ol>
           * <li>invocationContext as passed in to the onSuccess method in the connectOptions.
           * </ol>
           * @param {function} connectOptions.onFailure - called when the connect request has failed or timed out.
           * A single response object parameter is passed to the onFailure callback containing the following fields:
           * <ol>
           * <li>invocationContext as passed in to the onFailure method in the connectOptions.
           * <li>errorCode a number indicating the nature of the error.
           * <li>errorMessage text describing the error.
           * </ol>
           * @param {array} connectOptions.hosts - If present this contains either a set of hostnames or fully qualified
           * WebSocket URIs (ws://iot.eclipse.org:80/ws), that are tried in order in place
           * of the host and port paramater on the construtor. The hosts are tried one at at time in order until
           * one of then succeeds.
           * @param {array} connectOptions.ports - If present the set of ports matching the hosts. If hosts contains URIs, this property
           * is not used.
           * @param {boolean} connectOptions.reconnect - Sets whether the client will automatically attempt to reconnect
           * to the server if the connection is lost.
           *<ul>
           *<li>If set to false, the client will not attempt to automatically reconnect to the server in the event that the
           * connection is lost.</li>
           *<li>If set to true, in the event that the connection is lost, the client will attempt to reconnect to the server.
           * It will initially wait 1 second before it attempts to reconnect, for every failed reconnect attempt, the delay
           * will double until it is at 2 minutes at which point the delay will stay at 2 minutes.</li>
           *</ul>
           * @param {number} connectOptions.mqttVersion - The version of MQTT to use to connect to the MQTT Broker.
           *<ul>
           *<li>3 - MQTT V3.1</li>
           *<li>4 - MQTT V3.1.1</li>
           *</ul>
           * @param {boolean} connectOptions.mqttVersionExplicit - If set to true, will force the connection to use the
           * selected MQTT Version or will fail to connect.
           * @param {array} connectOptions.uris - If present, should contain a list of fully qualified WebSocket uris
           * (e.g. ws://iot.eclipse.org:80/ws), that are tried in order in place of the host and port parameter of the construtor.
           * The uris are tried one at a time in order until one of them succeeds. Do not use this in conjunction with hosts as
           * the hosts array will be converted to uris and will overwrite this property.
           * @throws {InvalidState} If the client is not in disconnected state. The client must have received connectionLost
           * or disconnected before calling connect for a second or subsequent time.
           */
    
          this.connect = function (connectOptions) {
            connectOptions = connectOptions || {};
            validate(connectOptions, {
              timeout: "number",
              userName: "string",
              password: "string",
              willMessage: "object",
              keepAliveInterval: "number",
              cleanSession: "boolean",
              useSSL: "boolean",
              invocationContext: "object",
              onSuccess: "function",
              onFailure: "function",
              hosts: "object",
              ports: "object",
              reconnect: "boolean",
              mqttVersion: "number",
              mqttVersionExplicit: "boolean",
              uris: "object"
            }); // If no keep alive interval is set, assume 60 seconds.
    
            if (connectOptions.keepAliveInterval === undefined) connectOptions.keepAliveInterval = 60;
    
            if (connectOptions.mqttVersion > 4 || connectOptions.mqttVersion < 3) {
              throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.mqttVersion, "connectOptions.mqttVersion"]));
            }
    
            if (connectOptions.mqttVersion === undefined) {
              connectOptions.mqttVersionExplicit = false;
              connectOptions.mqttVersion = 4;
            } else {
              connectOptions.mqttVersionExplicit = true;
            } //Check that if password is set, so is username
    
    
            if (connectOptions.password !== undefined && connectOptions.userName === undefined) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.password, "connectOptions.password"]));
    
            if (connectOptions.willMessage) {
              if (!(connectOptions.willMessage instanceof Message)) throw new Error(format(ERROR.INVALID_TYPE, [connectOptions.willMessage, "connectOptions.willMessage"])); // The will message must have a payload that can be represented as a string.
              // Cause the willMessage to throw an exception if this is not the case.
    
              connectOptions.willMessage.stringPayload = null;
              if (typeof connectOptions.willMessage.destinationName === "undefined") throw new Error(format(ERROR.INVALID_TYPE, [_typeof(connectOptions.willMessage.destinationName), "connectOptions.willMessage.destinationName"]));
            }
    
            if (typeof connectOptions.cleanSession === "undefined") connectOptions.cleanSession = true;
    
            if (connectOptions.hosts) {
              if (!(connectOptions.hosts instanceof Array)) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts, "connectOptions.hosts"]));
              if (connectOptions.hosts.length < 1) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts, "connectOptions.hosts"]));
              var usingURIs = false;
    
              for (var i = 0; i < connectOptions.hosts.length; i++) {
                if (typeof connectOptions.hosts[i] !== "string") throw new Error(format(ERROR.INVALID_TYPE, [_typeof(connectOptions.hosts[i]), "connectOptions.hosts[" + i + "]"]));
    
                if (/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/.test(connectOptions.hosts[i])) {
                  if (i === 0) {
                    usingURIs = true;
                  } else if (!usingURIs) {
                    throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts[i], "connectOptions.hosts[" + i + "]"]));
                  }
                } else if (usingURIs) {
                  throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts[i], "connectOptions.hosts[" + i + "]"]));
                }
              }
    
              if (!usingURIs) {
                if (!connectOptions.ports) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
                if (!(connectOptions.ports instanceof Array)) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
                if (connectOptions.hosts.length !== connectOptions.ports.length) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
                connectOptions.uris = [];
    
                for (var i = 0; i < connectOptions.hosts.length; i++) {
                  if (typeof connectOptions.ports[i] !== "number" || connectOptions.ports[i] < 0) throw new Error(format(ERROR.INVALID_TYPE, [_typeof(connectOptions.ports[i]), "connectOptions.ports[" + i + "]"]));
                  var host = connectOptions.hosts[i];
                  var port = connectOptions.ports[i];
                  var ipv6 = host.indexOf(":") !== -1;
                  uri = "ws://" + (ipv6 ? "[" + host + "]" : host) + ":" + port + path;
                  connectOptions.uris.push(uri);
                }
              } else {
                connectOptions.uris = connectOptions.hosts;
              }
            }
    
            client.connect(connectOptions);
          };
          /**
           * Subscribe for messages, request receipt of a copy of messages sent to the destinations described by the filter.
           *
           * @name Paho.Client#subscribe
           * @function
           * @param {string} filter describing the destinations to receive messages from.
           * <br>
           * @param {object} subscribeOptions - used to control the subscription
           *
           * @param {number} subscribeOptions.qos - the maximum qos of any publications sent
           *                                  as a result of making this subscription.
           * @param {object} subscribeOptions.invocationContext - passed to the onSuccess callback
           *                                  or onFailure callback.
           * @param {function} subscribeOptions.onSuccess - called when the subscribe acknowledgement
           *                                  has been received from the server.
           *                                  A single response object parameter is passed to the onSuccess callback containing the following fields:
           *                                  <ol>
           *                                  <li>invocationContext if set in the subscribeOptions.
           *                                  </ol>
           * @param {function} subscribeOptions.onFailure - called when the subscribe request has failed or timed out.
           *                                  A single response object parameter is passed to the onFailure callback containing the following fields:
           *                                  <ol>
           *                                  <li>invocationContext - if set in the subscribeOptions.
           *                                  <li>errorCode - a number indicating the nature of the error.
           *                                  <li>errorMessage - text describing the error.
           *                                  </ol>
           * @param {number} subscribeOptions.timeout - which, if present, determines the number of
           *                                  seconds after which the onFailure calback is called.
           *                                  The presence of a timeout does not prevent the onSuccess
           *                                  callback from being called when the subscribe completes.
           * @throws {InvalidState} if the client is not in connected state.
           */
    
    
          this.subscribe = function (filter, subscribeOptions) {
            if (typeof filter !== "string" && filter.constructor !== Array) throw new Error("Invalid argument:" + filter);
            subscribeOptions = subscribeOptions || {};
            validate(subscribeOptions, {
              qos: "number",
              invocationContext: "object",
              onSuccess: "function",
              onFailure: "function",
              timeout: "number"
            });
            if (subscribeOptions.timeout && !subscribeOptions.onFailure) throw new Error("subscribeOptions.timeout specified with no onFailure callback.");
            if (typeof subscribeOptions.qos !== "undefined" && !(subscribeOptions.qos === 0 || subscribeOptions.qos === 1 || subscribeOptions.qos === 2)) throw new Error(format(ERROR.INVALID_ARGUMENT, [subscribeOptions.qos, "subscribeOptions.qos"]));
            client.subscribe(filter, subscribeOptions);
          };
          /**
          * Unsubscribe for messages, stop receiving messages sent to destinations described by the filter.
          *
          * @name Paho.Client#unsubscribe
          * @function
          * @param {string} filter - describing the destinations to receive messages from.
          * @param {object} unsubscribeOptions - used to control the subscription
          * @param {object} unsubscribeOptions.invocationContext - passed to the onSuccess callback
                                or onFailure callback.
          * @param {function} unsubscribeOptions.onSuccess - called when the unsubscribe acknowledgement has been received from the server.
          *                                    A single response object parameter is passed to the
          *                                    onSuccess callback containing the following fields:
          *                                    <ol>
          *                                    <li>invocationContext - if set in the unsubscribeOptions.
          *                                    </ol>
          * @param {function} unsubscribeOptions.onFailure called when the unsubscribe request has failed or timed out.
          *                                    A single response object parameter is passed to the onFailure callback containing the following fields:
          *                                    <ol>
          *                                    <li>invocationContext - if set in the unsubscribeOptions.
          *                                    <li>errorCode - a number indicating the nature of the error.
          *                                    <li>errorMessage - text describing the error.
          *                                    </ol>
          * @param {number} unsubscribeOptions.timeout - which, if present, determines the number of seconds
          *                                    after which the onFailure callback is called. The presence of
          *                                    a timeout does not prevent the onSuccess callback from being
          *                                    called when the unsubscribe completes
          * @throws {InvalidState} if the client is not in connected state.
          */
    
    
          this.unsubscribe = function (filter, unsubscribeOptions) {
            if (typeof filter !== "string" && filter.constructor !== Array) throw new Error("Invalid argument:" + filter);
            unsubscribeOptions = unsubscribeOptions || {};
            validate(unsubscribeOptions, {
              invocationContext: "object",
              onSuccess: "function",
              onFailure: "function",
              timeout: "number"
            });
            if (unsubscribeOptions.timeout && !unsubscribeOptions.onFailure) throw new Error("unsubscribeOptions.timeout specified with no onFailure callback.");
            client.unsubscribe(filter, unsubscribeOptions);
          };
          /**
           * Send a message to the consumers of the destination in the Message.
           *
           * @name Paho.Client#send
           * @function
           * @param {string|Paho.Message} topic - <b>mandatory</b> The name of the destination to which the message is to be sent.
           * 					   - If it is the only parameter, used as Paho.Message object.
           * @param {String|ArrayBuffer} payload - The message data to be sent.
           * @param {number} qos The Quality of Service used to deliver the message.
           * 		<dl>
           * 			<dt>0 Best effort (default).
           *     			<dt>1 At least once.
           *     			<dt>2 Exactly once.
           * 		</dl>
           * @param {Boolean} retained If true, the message is to be retained by the server and delivered
           *                     to both current and future subscriptions.
           *                     If false the server only delivers the message to current subscribers, this is the default for new Messages.
           *                     A received message has the retained boolean set to true if the message was published
           *                     with the retained boolean set to true
           *                     and the subscrption was made after the message has been published.
           * @throws {InvalidState} if the client is not connected.
           */
    
    
          this.send = function (topic, payload, qos, retained) {
            var message;
    
            if (arguments.length === 0) {
              throw new Error("Invalid argument." + "length");
            } else if (arguments.length == 1) {
              if (!(topic instanceof Message) && typeof topic !== "string") throw new Error("Invalid argument:" + _typeof(topic));
              message = topic;
              if (typeof message.destinationName === "undefined") throw new Error(format(ERROR.INVALID_ARGUMENT, [message.destinationName, "Message.destinationName"]));
              client.send(message);
            } else {
              //parameter checking in Message object
              message = new Message(payload);
              message.destinationName = topic;
              if (arguments.length >= 3) message.qos = qos;
              if (arguments.length >= 4) message.retained = retained;
              client.send(message);
            }
          };
          /**
           * Publish a message to the consumers of the destination in the Message.
           * Synonym for Paho.Mqtt.Client#send
           *
           * @name Paho.Client#publish
           * @function
           * @param {string|Paho.Message} topic - <b>mandatory</b> The name of the topic to which the message is to be published.
           * 					   - If it is the only parameter, used as Paho.Message object.
           * @param {String|ArrayBuffer} payload - The message data to be published.
           * @param {number} qos The Quality of Service used to deliver the message.
           * 		<dl>
           * 			<dt>0 Best effort (default).
           *     			<dt>1 At least once.
           *     			<dt>2 Exactly once.
           * 		</dl>
           * @param {Boolean} retained If true, the message is to be retained by the server and delivered
           *                     to both current and future subscriptions.
           *                     If false the server only delivers the message to current subscribers, this is the default for new Messages.
           *                     A received message has the retained boolean set to true if the message was published
           *                     with the retained boolean set to true
           *                     and the subscrption was made after the message has been published.
           * @throws {InvalidState} if the client is not connected.
           */
    
    
          this.publish = function (topic, payload, qos, retained) {
            var message;
    
            if (arguments.length === 0) {
              throw new Error("Invalid argument." + "length");
            } else if (arguments.length == 1) {
              if (!(topic instanceof Message) && typeof topic !== "string") throw new Error("Invalid argument:" + _typeof(topic));
              message = topic;
              if (typeof message.destinationName === "undefined") throw new Error(format(ERROR.INVALID_ARGUMENT, [message.destinationName, "Message.destinationName"]));
              client.send(message);
            } else {
              //parameter checking in Message object
              message = new Message(payload);
              message.destinationName = topic;
              if (arguments.length >= 3) message.qos = qos;
              if (arguments.length >= 4) message.retained = retained;
              client.send(message);
            }
          };
          /**
           * Normal disconnect of this Messaging client from its server.
           *
           * @name Paho.Client#disconnect
           * @function
           * @throws {InvalidState} if the client is already disconnected.
           */
    
    
          this.disconnect = function () {
            client.disconnect();
          };
          /**
           * Get the contents of the trace log.
           *
           * @name Paho.Client#getTraceLog
           * @function
           * @return {Object[]} tracebuffer containing the time ordered trace records.
           */
    
    
          this.getTraceLog = function () {
            return client.getTraceLog();
          };
          /**
           * Start tracing.
           *
           * @name Paho.Client#startTrace
           * @function
           */
    
    
          this.startTrace = function () {
            client.startTrace();
          };
          /**
           * Stop tracing.
           *
           * @name Paho.Client#stopTrace
           * @function
           */
    
    
          this.stopTrace = function () {
            client.stopTrace();
          };
    
          this.isConnected = function () {
            return client.connected;
          };
        };
        /**
         * An application message, sent or received.
         * <p>
         * All attributes may be null, which implies the default values.
         *
         * @name Paho.Message
         * @constructor
         * @param {String|ArrayBuffer} payload The message data to be sent.
         * <p>
         * @property {string} payloadString <i>read only</i> The payload as a string if the payload consists of valid UTF-8 characters.
         * @property {ArrayBuffer} payloadBytes <i>read only</i> The payload as an ArrayBuffer.
         * <p>
         * @property {string} destinationName <b>mandatory</b> The name of the destination to which the message is to be sent
         *                    (for messages about to be sent) or the name of the destination from which the message has been received.
         *                    (for messages received by the onMessage function).
         * <p>
         * @property {number} qos The Quality of Service used to deliver the message.
         * <dl>
         *     <dt>0 Best effort (default).
         *     <dt>1 At least once.
         *     <dt>2 Exactly once.
         * </dl>
         * <p>
         * @property {Boolean} retained If true, the message is to be retained by the server and delivered
         *                     to both current and future subscriptions.
         *                     If false the server only delivers the message to current subscribers, this is the default for new Messages.
         *                     A received message has the retained boolean set to true if the message was published
         *                     with the retained boolean set to true
         *                     and the subscrption was made after the message has been published.
         * <p>
         * @property {Boolean} duplicate <i>read only</i> If true, this message might be a duplicate of one which has already been received.
         *                     This is only set on messages received from the server.
         *
         */
    
    
        var Message = function Message(newPayload) {
          var payload;
    
          if (typeof newPayload === "string" || newPayload instanceof ArrayBuffer || ArrayBuffer.isView(newPayload) && !(newPayload instanceof DataView)) {
            payload = newPayload;
          } else {
            throw format(ERROR.INVALID_ARGUMENT, [newPayload, "newPayload"]);
          }
    
          var destinationName;
          var qos = 0;
          var retained = false;
          var duplicate = false;
          Object.defineProperties(this, {
            payloadString: {
              enumerable: true,
              get: function get() {
                if (typeof payload === "string") return payload;else return parseUTF8(payload, 0, payload.length);
              }
            },
            payloadBytes: {
              enumerable: true,
              get: function get() {
                if (typeof payload === "string") {
                  var buffer = new ArrayBuffer(UTF8Length(payload));
                  var byteStream = new Uint8Array(buffer);
                  stringToUTF8(payload, byteStream, 0);
                  return byteStream;
                } else {
                  return payload;
                }
              }
            },
            destinationName: {
              enumerable: true,
              get: function get() {
                return destinationName;
              },
              set: function set(newDestinationName) {
                if (typeof newDestinationName === "string") destinationName = newDestinationName;else throw new Error(format(ERROR.INVALID_ARGUMENT, [newDestinationName, "newDestinationName"]));
              }
            },
            qos: {
              enumerable: true,
              get: function get() {
                return qos;
              },
              set: function set(newQos) {
                if (newQos === 0 || newQos === 1 || newQos === 2) qos = newQos;else throw new Error("Invalid argument:" + newQos);
              }
            },
            retained: {
              enumerable: true,
              get: function get() {
                return retained;
              },
              set: function set(newRetained) {
                if (typeof newRetained === "boolean") retained = newRetained;else throw new Error(format(ERROR.INVALID_ARGUMENT, [newRetained, "newRetained"]));
              }
            },
            topic: {
              enumerable: true,
              get: function get() {
                return destinationName;
              },
              set: function set(newTopic) {
                destinationName = newTopic;
              }
            },
            duplicate: {
              enumerable: true,
              get: function get() {
                return duplicate;
              },
              set: function set(newDuplicate) {
                duplicate = newDuplicate;
              }
            }
          });
        }; // Module contents.
    
    
        return {
          Client: Client,
          Message: Message
        }; // eslint-disable-next-line no-nested-ternary
      }(typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    
      return PahoMQTT;
    });
    /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))
    
    /***/ }),
    
    /***/ "./src/utils.js":
    /*!**********************!*\
      !*** ./src/utils.js ***!
      \**********************/
    /*! exports provided: default */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */ var _core_exceptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/exceptions */ "./src/core/exceptions.js");
    /* harmony import */ var sprintf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sprintf-js */ "./node_modules/sprintf-js/src/sprintf.js");
    /* harmony import */ var sprintf_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sprintf_js__WEBPACK_IMPORTED_MODULE_1__);
    function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    
    
    
    
    var Utils = {};
    /**
     * Asserts that a premise is true.
     */
    
    Utils.assertTrue = function (premise, message) {
      if (!premise) {
        throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["ValueError"](message);
      }
    };
    /**
     * Asserts that a value is not null or undefined.
     */
    
    
    Utils.assertNotNull = function (value, name) {
      Utils.assertTrue(value !== null && _typeof(value) !== undefined, Object(sprintf_js__WEBPACK_IMPORTED_MODULE_1__["sprintf"])("%s must be provided", name || "A value"));
      return value;
    };
    
    Utils.now = function () {
      return new Date().getTime();
    };
    
    Utils.isString = function (value) {
      return typeof value === "string";
    };
    /**
     * Generate a random ID consisting of the current timestamp
     * and a random base-36 number based on Math.random().
     */
    
    
    Utils.randomId = function () {
      return Object(sprintf_js__WEBPACK_IMPORTED_MODULE_1__["sprintf"])("%s-%s", Utils.now(), Math.random().toString(36).slice(2));
    };
    
    Utils.assertIsNonEmptyString = function (value, key) {
      if (!value || typeof value !== "string") {
        throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentException"](key + " is not a non-empty string!");
      }
    };
    
    Utils.assertIsList = function (value, key) {
      if (!Array.isArray(value)) {
        throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentException"](key + " is not an array");
      }
    };
    
    Utils.assertIsEnum = function (value, allowedValues, key) {
      var i;
    
      for (i = 0; i < allowedValues.length; i++) {
        if (allowedValues[i] === value) {
          return;
        }
      }
    
      throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentException"](key + " passed is not valid. " + "Allowed values are: " + allowedValues);
    };
    /**
     * Generate an enum from the given list of lower-case enum values,
     * where the enum keys will be upper case.
     *
     * Conversion from pascal case based on code from here:
     * http://stackoverflow.com/questions/30521224
     */
    
    
    Utils.makeEnum = function (values) {
      var enumObj = {};
      values.forEach(function (value) {
        var key = value.replace(/\.?([a-z]+)_?/g, function (x, y) {
          return y.toUpperCase() + "_";
        }).replace(/_$/, "");
        enumObj[key] = value;
      });
      return enumObj;
    };
    
    Utils.contains = function (obj, value) {
      if (obj instanceof Array) {
        return Utils.find(obj, function (v) {
          return v === value;
        }) !== null;
      } else {
        return value in obj;
      }
    };
    
    Utils.find = function (array, predicate) {
      for (var x = 0; x < array.length; x++) {
        if (predicate(array[x])) {
          return array[x];
        }
      }
    
      return null;
    };
    
    Utils.containsValue = function (obj, value) {
      if (obj instanceof Array) {
        return Utils.find(obj, function (v) {
          return v === value;
        }) !== null;
      } else {
        return Utils.find(Utils.values(obj), function (v) {
          return v === value;
        }) !== null;
      }
    };
    /**
     * Determine if the given value is a callable function type.
     * Borrowed from Underscore.js.
     */
    
    
    Utils.isFunction = function (obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    };
    /**
     * Get a list of values from a Javascript object used
     * as a hash map.
     */
    
    
    Utils.values = function (map) {
      var values = [];
      Utils.assertNotNull(map, "map");
    
      for (var k in map) {
        values.push(map[k]);
      }
    
      return values;
    };
    
    Utils.isObject = function (value) {
      return !(_typeof(value) !== "object" || value === null);
    };
    
    Utils.assertIsObject = function (value, key) {
      if (!Utils.isObject(value)) {
        throw new _core_exceptions__WEBPACK_IMPORTED_MODULE_0__["IllegalArgumentException"](key + " is not an object!");
      }
    };
    
    /* harmony default export */ __webpack_exports__["default"] = (Utils);
    
    /***/ })
    
    /******/ });
    //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NwcmludGYtanMvc3JjL3NwcmludGYuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvWG1sSHR0cENsaWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2NsaWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb3JlL2NoYXRBcmdzVmFsaWRhdG9yLmpzIiwid2VicGFjazovLy8uL3NyYy9jb3JlL2NoYXRDb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9jb3JlL2NoYXRTZXNzaW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9jb3JlL2Nvbm5lY3Rpb25IZWxwZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvcmUvY29ubmVjdGlvbk1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvcmUvZXZlbnRDb25zdHJ1Y3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS9ldmVudGJ1cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS9leGNlcHRpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9nbG9iYWxDb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9sb2cuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhaG8tbXF0dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMuanMiXSwibmFtZXMiOlsibWFrZUh0dHBSZXF1ZXN0Iiwib2JqIiwic3VjY2VzcyIsImZhaWx1cmUiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJtZXRob2QiLCJ1cmwiLCJoZWFkZXJzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJzZXRSZXF1ZXN0SGVhZGVyIiwib25sb2FkIiwic3RhdHVzIiwib25lcnJvciIsInNlbmQiLCJib2R5IiwiQ2hhdENsaWVudEZhY3RvcnlJbXBsIiwiY2xpZW50Q2FjaGUiLCJvcHRpb25zSW5wdXQiLCJvcHRpb25zIiwiYXNzaWduIiwicmVnaW9uIiwiR2xvYmFsQ29uZmlnIiwiZ2V0UmVnaW9uIiwiUkVHSU9OUyIsInBkeCIsImNsaWVudCIsIl9jcmVhdGVDbGllbnQiLCJlbmRwb2ludE92ZXJyaWRlIiwiZ2V0RW5kcG9pbnRPdmVycmlkZSIsInN0YWdlQ29uZmlnIiwiUkVHSU9OX0NPTkZJRyIsImludm9rZVVybCIsIkh0dHBDaGF0Q2xpZW50IiwiQ2hhdENsaWVudCIsInBhcnRpY2lwYW50VG9rZW4iLCJtZXNzYWdlIiwidHlwZSIsIlVuSW1wbGVtZW50ZWRNZXRob2RFeGNlcHRpb24iLCJldmVudFR5cGUiLCJtZXNzYWdlSWRzIiwidmlzaWJpbGl0eSIsInBlcnNpc3RlbmNlIiwiY3JlYXRlRGVmYXVsdEhlYWRlcnMiLCJBY2NlcHQiLCJhcmdzIiwiY2FsbEh0dHBDbGllbnQiLCJsb2dnZXIiLCJMb2dNYW5hZ2VyIiwiZ2V0TG9nZ2VyIiwicHJlZml4IiwiY29ubmVjdGlvblRva2VuIiwiY29uc29sZSIsImxvZyIsIk1lc3NhZ2UiLCJDb250ZW50VHlwZSIsIkNPTlRFTlRfVFlQRSIsInRleHRQbGFpbiIsIkNvbnRlbnQiLCJQZXJzaXN0ZW5jZSIsIk1FU1NBR0VfUEVSU0lTVEVOQ0UiLCJQRVJTSVNURUQiLCJyZXF1ZXN0SW5wdXQiLCJIVFRQX01FVEhPRFMiLCJQT1NUIiwiUkVTT1VSQ0VfUEFUSCIsIk1FU1NBR0UiLCJDT05ORUNUSU9OX1RPS0VOX0tFWSIsIl9jYWxsSHR0cENsaWVudCIsIlRSQU5TQ1JJUFQiLCJQYXJ0aWNpcGFudEV2ZW50IiwiVmlzaWJpbGl0eSIsIlBhcnRpY2lwYW50RXZlbnRUeXBlIiwiRVZFTlQiLCJESVNDT05ORUNUIiwiQ09OTkVDVElPTl9ERVRBSUxTIiwiUEFSVElDSVBBTlRfVE9LRU5fS0VZIiwic2VsZiIsIkpTT04iLCJzdHJpbmdpZnkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcXVlc3QiLCJyZXNwb25zZU9iamVjdCIsImRhdGEiLCJwYXJzZSIsInJlc3BvbnNlVGV4dCIsImVycm9yT2JqZWN0Iiwic3RhdHVzVGV4dCIsImVycm9yIiwiZSIsIndhcm4iLCJDaGF0Q2xpZW50RmFjdG9yeSIsIkNIQVRfQ09ORklHVVJBVElPTlMiLCJDT05DVVJSRU5UX0NIQVRTIiwiTk9OX1BFUlNJU1RFRCIsIlZJU0lCSUxJVFkiLCJVdGlscyIsIm1ha2VFbnVtIiwiUEVSU0lTVEVOQ0UiLCJNUVRUX0NPTlNUQU5UUyIsIktFRVBfQUxJVkUiLCJDT05ORUNUX1RJTUVPVVQiLCJTRVNTSU9OX1RZUEVTIiwiQUdFTlQiLCJDVVNUT01FUiIsIkNIQVRfRVZFTlRTIiwiSU5DT01JTkdfTUVTU0FHRSIsIklOQ09NSU5HX1RZUElORyIsIkNPTk5FQ1RJT05fRVNUQUJMSVNIRUQiLCJDT05ORUNUSU9OX0JST0tFTiIsIlRSQU5TQ1JJUFRfREVGQVVMVF9QQVJBTVMiLCJNQVhfUkVTVUxUUyIsIlNPUlRfS0VZIiwiU0NBTl9ESVJFQ1RJT04iLCJMT0dTX0RFU1RJTkFUSU9OIiwiTlVMTCIsIkNMSUVOVF9MT0dHRVIiLCJERUJVRyIsImlhZCIsInN5ZCIsIm5ydCIsImZyYSIsIkNoYXRDb250cm9sbGVyQXJnc1ZhbGlkYXRvciIsImNoYXREZXRhaWxzIiwiaXNTdHJpbmciLCJhc3NlcnRJc09iamVjdCIsImFzc2VydElzRW51bSIsInZhbHVlcyIsIm1ldGhvZE5hbWUiLCJpc0Z1bmN0aW9uIiwiSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9uIiwiYXNzZXJ0SXNOb25FbXB0eVN0cmluZyIsInVuZGVmaW5lZCIsImFzc2VydElzTGlzdCIsIkNoYXRTZXJ2aWNlQXJnc1ZhbGlkYXRvciIsImluaXRpYWxDb250YWN0SWQiLCJjb250YWN0SWQiLCJwYXJ0aWNpcGFudElkIiwiY29ubmVjdGlvbkRldGFpbHMiLCJQcmVTaWduZWRDb25uZWN0aW9uVXJsIiwiQ29ubmVjdGlvbklkIiwiTmV0d29ya0xpbmtTdGF0dXMiLCJOZXZlckVzdGFibGlzaGVkIiwiRXN0YWJsaXNoaW5nIiwiRXN0YWJsaXNoZWQiLCJCcm9rZW5SZXRyeWluZyIsIkJyb2tlbiIsIkNoYXRDb250cm9sbGVyIiwidGV4dE1lc3NhZ2UiLCJQZXJzaXN0ZW50Q29ubmVjdGlvbkFuZENoYXRTZXJ2aWNlQ29udHJvbGxlciIsInNldEFyZ3VtZW50cyIsImFyZ3NWYWxpZGF0b3IiLCJjaGF0RXZlbnRDb25zdHJ1Y3RvciIsImludGlhbENvbnRhY3RJZCIsImNoYXRDbGllbnQiLCJjb25uZWN0aW9uSGVscGVyQ2FsbGJhY2siLCJldmVudERhdGEiLCJfaGFuZGxlQ29ubmVjdGlvbkhlbHBlckV2ZW50cyIsIl9oYXNDb25uZWN0aW9uRGV0YWlscyIsImhhc0Nvbm5lY3Rpb25EZXRhaWxzIiwiY2hhdENvbnRyb2xsZXJGYWN0b3J5IiwiX3NldENvbm5lY3Rpb25IZWxwZXIiLCJfY29ubmVjdENhbGxlZEF0bGVhc3RPbmNlIiwiX2V2ZXJDb25uZWN0ZWQiLCJwdWJzdWIiLCJfcGFydGljaXBhbnREaXNjb25uZWN0ZWQiLCJjb25uZWN0aW9uSGVscGVyUHJvdmlkZXIiLCJjcmVhdGVDb25uZWN0aW9uSGVscGVyUHJvdmlkZXIiLCJjb25uZWN0aW9uSGVscGVyIiwidW5zdWJzY3JpYmVBbGwiLCJjbGVhblVwT25QYXJ0aWNpcGFudERpc2Nvbm5lY3QiLCJldmVudE5hbWUiLCJjYWxsYmFjayIsInN1YnNjcmliZSIsImluZm8iLCJtZXRhZGF0YSIsInZhbGlkYXRlU2VuZE1lc3NhZ2UiLCJzZW5kTWVzc2FnZSIsInRoZW4iLCJyZXNwb25zZSIsImRlYnVnIiwidmFsaWRhdGVTZW5kRXZlbnQiLCJwZXJzaXN0ZW5jZUFyZ3VtZW50IiwidmlzaWJpbGl0eUFyZ3VtZW50IiwiQUxMIiwic2VuZEV2ZW50IiwiaW5wdXRBcmdzIiwiSW50aWFsQ29udGFjdElkIiwiU3RhcnRLZXkiLCJTY2FuRGlyZWN0aW9uIiwiU29ydEtleSIsIk1heFJlc3VsdHMiLCJOZXh0VG9rZW4iLCJnZXRUcmFuc2NyaXB0IiwiY2hhdEV2ZW50IiwiZnJvbUNvbm5lY3Rpb25IZWxwZXJFdmVudCIsImdldENoYXREZXRhaWxzIiwiZXhjIiwidHJpZ2dlckFzeW5jIiwidmFsaWRhdGVDb25uZWN0Q2hhdCIsImdldENvbm5lY3Rpb25TdGF0dXMiLCJJbGxlZ2FsU3RhdGVFeGNlcHRpb24iLCJfb25TdWNjZXNzIiwiX29uQ29ubmVjdFN1Y2Nlc3MiLCJfb25GYWlsdXJlIiwiX29uQ29ubmVjdEZhaWx1cmUiLCJzdGFydCIsIl9mZXRjaENvbm5lY3Rpb25EZXRhaWxzIiwiX2RlYnVnIiwiY29ubmVjdFN1Y2Nlc3MiLCJjb25uZWN0Q2FsbGVkIiwiY3JlYXRlQ29ubmVjdGlvbkRldGFpbHMiLCJQYXJ0aWNpcGFudENyZWRlbnRpYWxzIiwiQ29ubmVjdGlvbkF1dGhlbnRpY2F0aW9uVG9rZW4iLCJyZWFzb24iLCJlbmQiLCJkaXNjb25uZWN0Q2hhdCIsImNvbm5lY3Rpb25IZWxwZXJTdGF0dXMiLCJDb25uZWN0aW9uSGVscGVyU3RhdHVzIiwiTmV2ZXJTdGFydGVkIiwiU3RhcnRpbmciLCJFbmRlZCIsIkNvbm5lY3RlZCIsIkRpc2Nvbm5lY3RlZFJlY29ubmVjdGluZyIsIl9jb252ZXJ0Q29ubmVjdGlvbkhlbHBlclN0YXR1cyIsImdldFN0YXR1cyIsIkNoYXRTZXNzaW9uRmFjdG9yeSIsInBhcnRpY2lwYW50VHlwZSIsIlBlcnNpc3RlbnRDb25uZWN0aW9uQW5kQ2hhdFNlcnZpY2VTZXNzaW9uRmFjdG9yeSIsImNoYXRDb25uZWN0aW9uTWFuYWdlciIsIkNoYXRDb25uZWN0aW9uTWFuYWdlciIsIkV2ZW50Q29uc3RydWN0b3IiLCJjaGF0Q29udHJvbGxlciIsIl9jcmVhdGVDaGF0U2Vzc2lvbiIsIkFnZW50Q2hhdFNlc3Npb24iLCJDdXN0b21lckNoYXRTZXNzaW9uIiwiY2hhdERldGFpbHNJbnB1dCIsIl9ub3JtYWxpemVDaGF0RGV0YWlscyIsIkV2ZW50QnVzIiwiZ2V0Q2FjaGVkQ2xpZW50IiwiQ2hhdENvbm5lY3Rpb25BdHRyaWJ1dGVzIiwidmFsaWRhdGVJbml0aWF0ZUNoYXRSZXNwb25zZSIsIlBhcnRpY2lwYW50SWQiLCJDb250YWN0SWQiLCJ2YWxpZGF0ZUNoYXREZXRhaWxzIiwiY29ubmVjdGlvbkFyZ3MiLCJwcmVTaWduZWRVcmwiLCJjb25uZWN0aW9uSWQiLCJtYXhSZXRyeVRpbWUiLCJtcXR0Q29ubmVjdGlvblByb3ZpZGVyIiwiY3JlYXRlTmV3TXF0dENvbm5lY3Rpb25Qcm92aWRlciIsIlNvbG9DaGF0Q29ubmVjdGlvbk1xdHRIZWxwZXIiLCJDaGF0U2Vzc2lvbiIsImNvbnRyb2xsZXIiLCJjb25uZWN0IiwiZGlzY29ubmVjdFBhcnRpY2lwYW50IiwiYnJlYWtDb25uZWN0aW9uIiwiQ0hBVF9TRVNTSU9OX0ZBQ1RPUlkiLCJzZXRHbG9iYWxDb25maWciLCJjb25maWciLCJsb2dnZXJDb25maWciLCJ1cGRhdGUiLCJ1cGRhdGVMb2dnZXJDb25maWciLCJDaGF0U2Vzc2lvbkNvbnN0cnVjdG9yIiwiY3JlYXRlQWdlbnRDaGF0U2Vzc2lvbiIsImNyZWF0ZUN1c3RvbWVyQ2hhdFNlc3Npb24iLCJDaGF0U2Vzc2lvbk9iamVjdCIsImNyZWF0ZSIsIkNvbm5lY3Rpb25IZWxwZXIiLCJDb25uZWN0aW9uSGVscGVyRXZlbnRzIiwiUmVjb25uZWN0ZWQiLCJJbmNvbWluZ01lc3NhZ2UiLCJ0b3BpYyIsImNvbnNpZGVyUGFydGljaXBhbnRBc0Rpc2Nvbm5lY3RlZCIsImlvdENvbm5lY3Rpb24iLCJfaGFuZGxlSW90RXZlbnQiLCJNcXR0Q29ubmVjdGlvblN0YXR1cyIsIk5ldmVyQ29ubmVjdGVkIiwiY2hhdENvbnRyb2xsZXJDYWxsYmFjayIsIl9jcmVhdGVTdGFydFByb21pc2UiLCJyZXNvdmxlIiwiX2Nvbm5lY3QiLCJjb25uZWN0T3B0aW9ucyIsInVzZVNTTCIsImtlZXBBbGl2ZUludGVydmFsIiwicmVjb25uZWN0IiwibXF0dFZlcnNpb24iLCJ0aW1lb3V0IiwiX3Bvc3RDb25uZWN0IiwiY2F0Y2giLCJfY29ubmVjdEZhaWxlZCIsImNvbm5lY3RSZXNwb25zZSIsIl9zdWJzY3JpYmUiLCJjb25uZWN0RXJyb3IiLCJkZXRhaWxzIiwic3Vic2NyaWJlT3B0aW9ucyIsInFvcyIsIl9wb3N0U3Vic2NyaWJlIiwiX3N1YnNjcmliZUZhaWxlZCIsInN1YnNjcmliZVJlc3BvbnNlIiwic3Vic2NyaWJlRXJyb3IiLCJkaXNjb25uZWN0IiwiTXF0dEV2ZW50cyIsInBheWxvYWRTdHJpbmciLCJESVNDT05ORUNURURfUkVUUllJTkciLCJESVNDT05ORUNURUQiLCJSRUNPTk5FQ1RFRCIsIlBhaG9NcXR0Q29ubmVjdGlvbiIsIk1RVFRDbGllbnQiLCJ1bnN1YnNjcmliZU9wdGlvbnMiLCJmcmVlemUiLCJDb25uZWN0aW5nIiwiRGlzY29ubmVjdGVkUmV0cnlpbmciLCJEaXNjb25uZWN0ZWQiLCJSZWNvbm5lY3RpbmciLCJwYWhvQ2xpZW50IiwiUGFobyIsIkNsaWVudCIsIm9uTWVzc2FnZUFycml2ZWQiLCJfbWVzc2FnZUFycml2ZWRDYWxsYmFjayIsIm9uQ29ubmVjdGlvbkxvc3QiLCJfY29ubmVjdGlvbkxvc3RDYWxsQmFjayIsImtpbGxSZWNvbm5lY3QiLCJuZXZlckNvbm5lY3RlZCIsIl9zdWJzY3JpYmVkVG9waWNzIiwib25TdWNjZXNzIiwib2xkU3RhdHVzIiwib25GYWlsdXJlIiwiZXJyb3JEZXRhaWxzIiwiX3NjaGVkdWxlUmVjb25uZWN0S2lsbGluZyIsImluY29taW5nTWVzc2FnZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJfc3Vic2NyaWJlU3VjY2VzcyIsImdyYW50ZWRRb3MiLCJpbmRleE9mIiwicHVzaCIsIl9hZGRUb1RvcGljcyIsInNsaWNlIiwiX3Vuc3Vic2NyaWJlU3VjY2VzcyIsInVuc3Vic2NyaWJlIiwiZmlsdGVyIiwidCIsInJldHVybk9iamVjdCIsInJldHJ5aW5nIiwiX2Zyb21JbmNvbWluZ0RhdGEiLCJpbmNvbWluZ0RhdGEiLCJEYXRhIiwiVHlwZSIsIkFMTF9FVkVOVFMiLCJTdWJzY3JpcHRpb24iLCJzdWJNYXAiLCJmIiwiaWQiLCJyYW5kb21JZCIsInByb3RvdHlwZSIsIlN1YnNjcmlwdGlvbk1hcCIsInN1YklkTWFwIiwic3ViRXZlbnROYW1lTWFwIiwic3ViIiwic3ViTGlzdCIsInN1YklkIiwiY29udGFpbnMiLCJzIiwibGVuZ3RoIiwiZ2V0QWxsU3Vic2NyaXB0aW9ucyIsInJlZHVjZSIsImEiLCJiIiwiY29uY2F0IiwiZ2V0U3Vic2NyaXB0aW9ucyIsInBhcmFtc0luIiwicGFyYW1zIiwibG9nRXZlbnRzIiwiYXNzZXJ0Tm90TnVsbCIsImFzc2VydFRydWUiLCJzdWJzY3JpYmVBbGwiLCJ0cmlnZ2VyIiwiYWxsRXZlbnRTdWJzIiwiZXZlbnRTdWJzIiwiYnJpZGdlIiwiZXZlbnQiLCJWYWx1ZUVycm9yIiwibmFtZSIsIkVycm9yIiwiYXJndW1lbnQiLCJJbGxlZ2FsSnNvbkV4Y2VwdGlvbiIsImNhdXNlRXhjZXB0aW9uIiwib3JpZ2luYWxKc29uU3RyaW5nIiwiR2xvYmFsQ29uZmlnSW1wbCIsImNvbmZpZ0lucHV0IiwiZW5kcG9pbnQiLCJnbG9iYWwiLCJDaGF0RXZlbnRzIiwiU2Vzc2lvblR5cGVzIiwiTG9nZ2VyIiwiTG9nTGV2ZWwiLCJJTkZPIiwiV0FSTiIsIkVSUk9SIiwiTG9nTWFuYWdlckltcGwiLCJjb25zb2xlTG9nZ2VyV3JhcHBlciIsImNyZWF0ZUNvbnNvbGVMb2dnZXIiLCJsZXZlbCIsImxvZ1N0YXRlbWVudCIsImhhc0NsaWVudExvZ2dlciIsIl9jbGllbnRMb2dnZXIiLCJfbGV2ZWwiLCJfbG9nc0Rlc3RpbmF0aW9uIiwiTG9nZ2VyV3JhcHBlckltcGwiLCJpbnB1dENvbmZpZyIsIkxvZ2dlcldyYXBwZXIiLCJfbG9nIiwiaXNMZXZlbEVuYWJsZWQiLCJ3cml0ZVRvQ2xpZW50TG9nZ2VyIiwiX3Nob3VsZExvZyIsIl9jb252ZXJ0VG9TaW5nbGVTdGF0ZW1lbnQiLCJfd3JpdGVUb0NsaWVudExvZ2dlciIsImluZGV4IiwiYXJnIiwiX2NvbnZlcnRUb1N0cmluZyIsImlzT2JqZWN0IiwidG9TdHJpbmciLCJ0b1N0cmluZ1Jlc3VsdCIsImJpbmQiLCJ3aW5kb3ciLCJFeHBvcnRMaWJyYXJ5Iiwicm9vdCIsImZhY3RvcnkiLCJleHBvcnRzIiwibW9kdWxlIiwiZGVmaW5lIiwiTGlicmFyeUZhY3RvcnkiLCJQYWhvTVFUVCIsInZlcnNpb24iLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiaXRlbSIsImdldEl0ZW0iLCJyZW1vdmVJdGVtIiwiTUVTU0FHRV9UWVBFIiwiQ09OTkVDVCIsIkNPTk5BQ0siLCJQVUJMSVNIIiwiUFVCQUNLIiwiUFVCUkVDIiwiUFVCUkVMIiwiUFVCQ09NUCIsIlNVQlNDUklCRSIsIlNVQkFDSyIsIlVOU1VCU0NSSUJFIiwiVU5TVUJBQ0siLCJQSU5HUkVRIiwiUElOR1JFU1AiLCJ2YWxpZGF0ZSIsImhhc093blByb3BlcnR5IiwiZm9ybWF0IiwiSU5WQUxJRF9UWVBFIiwiZXJyb3JTdHIiLCJ2YWxpZEtleSIsInNjb3BlIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJPSyIsImNvZGUiLCJ0ZXh0IiwiU1VCU0NSSUJFX1RJTUVPVVQiLCJVTlNVQlNDUklCRV9USU1FT1VUIiwiUElOR19USU1FT1VUIiwiSU5URVJOQUxfRVJST1IiLCJDT05OQUNLX1JFVFVSTkNPREUiLCJTT0NLRVRfRVJST1IiLCJTT0NLRVRfQ0xPU0UiLCJNQUxGT1JNRURfVVRGIiwiVU5TVVBQT1JURUQiLCJJTlZBTElEX1NUQVRFIiwiSU5WQUxJRF9BUkdVTUVOVCIsIlVOU1VQUE9SVEVEX09QRVJBVElPTiIsIklOVkFMSURfU1RPUkVEX0RBVEEiLCJJTlZBTElEX01RVFRfTUVTU0FHRV9UWVBFIiwiTUFMRk9STUVEX1VOSUNPREUiLCJCVUZGRVJfRlVMTCIsIkNPTk5BQ0tfUkMiLCJzdWJzdGl0dXRpb25zIiwiZmllbGQiLCJpIiwicGFydDEiLCJzdWJzdHJpbmciLCJwYXJ0MiIsIk1xdHRQcm90b0lkZW50aWZpZXJ2MyIsIk1xdHRQcm90b0lkZW50aWZpZXJ2NCIsIldpcmVNZXNzYWdlIiwiZW5jb2RlIiwiZmlyc3QiLCJyZW1MZW5ndGgiLCJ0b3BpY1N0ckxlbmd0aCIsImRlc3RpbmF0aW9uTmFtZUxlbmd0aCIsIndpbGxNZXNzYWdlUGF5bG9hZEJ5dGVzIiwibWVzc2FnZUlkZW50aWZpZXIiLCJVVEY4TGVuZ3RoIiwiY2xpZW50SWQiLCJ3aWxsTWVzc2FnZSIsImRlc3RpbmF0aW9uTmFtZSIsInBheWxvYWRCeXRlcyIsIlVpbnQ4QXJyYXkiLCJieXRlTGVuZ3RoIiwidXNlck5hbWUiLCJwYXNzd29yZCIsInRvcGljcyIsInJlcXVlc3RlZFFvcyIsInBheWxvYWRNZXNzYWdlIiwiZHVwbGljYXRlIiwicmV0YWluZWQiLCJBcnJheUJ1ZmZlciIsImJ1ZmZlciIsIm1iaSIsImVuY29kZU1CSSIsInBvcyIsImJ5dGVTdHJlYW0iLCJzZXQiLCJ3cml0ZVN0cmluZyIsImNvbm5lY3RGbGFncyIsImNsZWFuU2Vzc2lvbiIsIndyaXRlVWludDE2IiwiZGVjb2RlTWVzc2FnZSIsImlucHV0Iiwic3RhcnRpbmdQb3MiLCJtZXNzYWdlSW5mbyIsImRpZ2l0IiwibXVsdGlwbGllciIsImVuZFBvcyIsIndpcmVNZXNzYWdlIiwiY29ubmVjdEFja25vd2xlZGdlRmxhZ3MiLCJzZXNzaW9uUHJlc2VudCIsInJldHVybkNvZGUiLCJsZW4iLCJyZWFkVWludDE2IiwidG9waWNOYW1lIiwicGFyc2VVVEY4Iiwic3ViYXJyYXkiLCJvZmZzZXQiLCJ1dGY4TGVuZ3RoIiwic3RyaW5nVG9VVEY4IiwibnVtYmVyIiwib3V0cHV0IiwiQXJyYXkiLCJudW1CeXRlcyIsImNoYXJDb2RlIiwiY2hhckNvZGVBdCIsImxvd0NoYXJDb2RlIiwiaXNOYU4iLCJ1dGYxNiIsImJ5dGUxIiwiYnl0ZTIiLCJieXRlMyIsImJ5dGU0IiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiUGluZ2VyIiwiX2NsaWVudCIsIl9rZWVwQWxpdmVJbnRlcnZhbCIsImlzUmVzZXQiLCJwaW5nUmVxIiwiZG9UaW1lb3V0IiwicGluZ2VyIiwiZG9QaW5nIiwiX3RyYWNlIiwiX2Rpc2Nvbm5lY3RlZCIsInNvY2tldCIsInJlc2V0IiwiY2FuY2VsIiwiVGltZW91dCIsInRpbWVvdXRTZWNvbmRzIiwiYWN0aW9uIiwiQ2xpZW50SW1wbCIsInVyaSIsImhvc3QiLCJwb3J0IiwicGF0aCIsIldlYlNvY2tldCIsIl93c3VyaSIsIl9sb2NhbEtleSIsIl9tc2dfcXVldWUiLCJfYnVmZmVyZWRfbXNnX3F1ZXVlIiwiX3NlbnRNZXNzYWdlcyIsIl9yZWNlaXZlZE1lc3NhZ2VzIiwiX25vdGlmeV9tc2dfc2VudCIsIl9tZXNzYWdlX2lkZW50aWZpZXIiLCJfc2VxdWVuY2UiLCJyZXN0b3JlIiwiY29ubmVjdGVkIiwibWF4TWVzc2FnZUlkZW50aWZpZXIiLCJob3N0SW5kZXgiLCJvbkNvbm5lY3RlZCIsIm9uTWVzc2FnZURlbGl2ZXJlZCIsInRyYWNlRnVuY3Rpb24iLCJfY29ubmVjdFRpbWVvdXQiLCJzZW5kUGluZ2VyIiwicmVjZWl2ZVBpbmdlciIsIl9yZWNvbm5lY3RJbnRlcnZhbCIsIl9yZWNvbm5lY3RpbmciLCJfcmVjb25uZWN0VGltZW91dCIsImRpc2Nvbm5lY3RlZFB1Ymxpc2hpbmciLCJkaXNjb25uZWN0ZWRCdWZmZXJTaXplIiwicmVjZWl2ZUJ1ZmZlciIsIl90cmFjZUJ1ZmZlciIsIl9NQVhfVFJBQ0VfRU5UUklFUyIsImNvbm5lY3RPcHRpb25zTWFza2VkIiwiX3RyYWNlTWFzayIsInVyaXMiLCJfZG9Db25uZWN0IiwiY29uc3RydWN0b3IiLCJpbnZvY2F0aW9uQ29udGV4dCIsImVycm9yQ29kZSIsImVycm9yTWVzc2FnZSIsInRpbWVPdXQiLCJfcmVxdWlyZXNfYWNrIiwiX3NjaGVkdWxlX21lc3NhZ2UiLCJtZXNzYWdlQ291bnQiLCJzZXF1ZW5jZSIsInVuc2hpZnQiLCJnZXRUcmFjZUxvZyIsIkRhdGUiLCJzdGFydFRyYWNlIiwic3RvcFRyYWNlIiwid3N1cmwiLCJ1cmlQYXJ0cyIsInNwbGl0Iiwiam9pbiIsImJpbmFyeVR5cGUiLCJvbm9wZW4iLCJfb25fc29ja2V0X29wZW4iLCJvbm1lc3NhZ2UiLCJfb25fc29ja2V0X21lc3NhZ2UiLCJfb25fc29ja2V0X2Vycm9yIiwib25jbG9zZSIsIl9vbl9zb2NrZXRfY2xvc2UiLCJfcHJvY2Vzc19xdWV1ZSIsInN0b3JlIiwic3RvcmVkTWVzc2FnZSIsInB1YlJlY1JlY2VpdmVkIiwiaGV4IiwibWVzc2FnZUJ5dGVzIiwicGF5bG9hZEhleCIsInZhbHVlIiwieCIsInBhcnNlSW50IiwicG9wIiwiX3NvY2tldF9zZW5kIiwibWVzc2FnZXMiLCJfZGVmcmFtZU1lc3NhZ2VzIiwiX2hhbmRsZU1lc3NhZ2UiLCJieXRlQXJyYXkiLCJuZXdEYXRhIiwicmVzdWx0IiwiZXJyb3JTdGFjayIsInN0YWNrIiwic2VudE1lc3NhZ2UiLCJyZWNlaXZlZE1lc3NhZ2UiLCJzZXF1ZW5jZWRNZXNzYWdlcyIsIm1zZ0lkIiwibXNnIiwic29ydCIsInB1YlJlbE1lc3NhZ2UiLCJyZWNvbm5lY3RlZCIsIl9jb25uZWN0ZWQiLCJfcmVjZWl2ZVB1Ymxpc2giLCJfcmVjZWl2ZU1lc3NhZ2UiLCJwdWJDb21wTWVzc2FnZSIsIndpcmVNZXNzYWdlTWFza2VkIiwicHViQWNrTWVzc2FnZSIsInB1YlJlY01lc3NhZ2UiLCJfcmVjb25uZWN0IiwiZXJyb3JUZXh0IiwicmVhZHlTdGF0ZSIsImNsb3NlIiwibXF0dFZlcnNpb25FeHBsaWNpdCIsImNhbGwiLCJzcGxpY2UiLCJyZWNvcmQiLCJzZXZlcml0eSIsIm1heCIsInNoaWZ0IiwidHJhY2VPYmplY3QiLCJtYXNrZWQiLCJ0cmFjZU9iamVjdE1hc2tlZCIsImF0dHIiLCJtYXRjaCIsImlwdjZBZGRTQnJhY2tldCIsImNsaWVudElkTGVuZ3RoIiwiZGVmaW5lUHJvcGVydGllcyIsImdldCIsIm5ld09uQ29ubmVjdGVkIiwibmV3RGlzY29ubmVjdGVkUHVibGlzaGluZyIsIm5ld0Rpc2Nvbm5lY3RlZEJ1ZmZlclNpemUiLCJuZXdPbkNvbm5lY3Rpb25Mb3N0IiwibmV3T25NZXNzYWdlRGVsaXZlcmVkIiwibmV3T25NZXNzYWdlQXJyaXZlZCIsInRyYWNlIiwiaG9zdHMiLCJwb3J0cyIsInN0cmluZ1BheWxvYWQiLCJ1c2luZ1VSSXMiLCJ0ZXN0IiwiaXB2NiIsInBheWxvYWQiLCJwdWJsaXNoIiwiaXNDb25uZWN0ZWQiLCJuZXdQYXlsb2FkIiwiaXNWaWV3IiwiRGF0YVZpZXciLCJlbnVtZXJhYmxlIiwibmV3RGVzdGluYXRpb25OYW1lIiwibmV3UW9zIiwibmV3UmV0YWluZWQiLCJuZXdUb3BpYyIsIm5ld0R1cGxpY2F0ZSIsInByZW1pc2UiLCJzcHJpbnRmIiwibm93IiwiZ2V0VGltZSIsIk1hdGgiLCJyYW5kb20iLCJpc0FycmF5IiwiYWxsb3dlZFZhbHVlcyIsImVudW1PYmoiLCJyZXBsYWNlIiwieSIsInRvVXBwZXJDYXNlIiwiZmluZCIsInYiLCJhcnJheSIsInByZWRpY2F0ZSIsImNvbnRhaW5zVmFsdWUiLCJtYXAiLCJrIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxt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LEtBRkQsTUFFTyxJQUhUO0FBS0Q7QUFDRixDQWREO0FBZ0JBOzs7Ozs7QUFJQXBpQixLQUFLLENBQUNpQyxVQUFOLEdBQW1CLFVBQVN0SSxHQUFULEVBQWM7QUFDL0IsU0FBTyxDQUFDLEVBQUVBLEdBQUcsSUFBSUEsR0FBRyxDQUFDd21CLFdBQVgsSUFBMEJ4bUIsR0FBRyxDQUFDMHFCLElBQTlCLElBQXNDMXFCLEdBQUcsQ0FBQ2tkLEtBQTVDLENBQVI7QUFDRCxDQUZEO0FBSUE7Ozs7OztBQUlBN1csS0FBSyxDQUFDK0IsTUFBTixHQUFlLFVBQVMrbEIsR0FBVCxFQUFjO0FBQzNCLE1BQUkvbEIsTUFBTSxHQUFHLEVBQWI7QUFFQS9CLE9BQUssQ0FBQ3NSLGFBQU4sQ0FBb0J3VyxHQUFwQixFQUF5QixLQUF6Qjs7QUFFQSxPQUFLLElBQUlDLENBQVQsSUFBY0QsR0FBZCxFQUFtQjtBQUNqQi9sQixVQUFNLENBQUNpTixJQUFQLENBQVk4WSxHQUFHLENBQUNDLENBQUQsQ0FBZjtBQUNEOztBQUVELFNBQU9obUIsTUFBUDtBQUNELENBVkQ7O0FBWUEvQixLQUFLLENBQUNxVSxRQUFOLEdBQWlCLFVBQVMrTixLQUFULEVBQWdCO0FBQy9CLFNBQU8sRUFBRSxRQUFPQSxLQUFQLE1BQWlCLFFBQWpCLElBQTZCQSxLQUFLLEtBQUssSUFBekMsQ0FBUDtBQUNELENBRkQ7O0FBSUFwaUIsS0FBSyxDQUFDNkIsY0FBTixHQUF1QixVQUFTdWdCLEtBQVQsRUFBZ0I3bkIsR0FBaEIsRUFBcUI7QUFDMUMsTUFBSSxDQUFDeUYsS0FBSyxDQUFDcVUsUUFBTixDQUFlK04sS0FBZixDQUFMLEVBQTRCO0FBQzFCLFVBQU0sSUFBSWxnQix5RUFBSixDQUE2QjNILEdBQUcsR0FBRyxvQkFBbkMsQ0FBTjtBQUNEO0FBQ0YsQ0FKRDs7QUFNZXlGLG9FQUFmLEUiLCJmaWxlIjoiYW1hem9uLWNvbm5lY3QtY2hhdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiLyogZ2xvYmFsIHdpbmRvdywgZXhwb3J0cywgZGVmaW5lICovXG5cbiFmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCdcblxuICAgIHZhciByZSA9IHtcbiAgICAgICAgbm90X3N0cmluZzogL1tec10vLFxuICAgICAgICBub3RfYm9vbDogL1tedF0vLFxuICAgICAgICBub3RfdHlwZTogL1teVF0vLFxuICAgICAgICBub3RfcHJpbWl0aXZlOiAvW152XS8sXG4gICAgICAgIG51bWJlcjogL1tkaWVmZ10vLFxuICAgICAgICBudW1lcmljX2FyZzogL1tiY2RpZWZndXhYXS8sXG4gICAgICAgIGpzb246IC9bal0vLFxuICAgICAgICBub3RfanNvbjogL1teal0vLFxuICAgICAgICB0ZXh0OiAvXlteXFx4MjVdKy8sXG4gICAgICAgIG1vZHVsbzogL15cXHgyNXsyfS8sXG4gICAgICAgIHBsYWNlaG9sZGVyOiAvXlxceDI1KD86KFsxLTldXFxkKilcXCR8XFwoKFteKV0rKVxcKSk/KFxcKyk/KDB8J1teJF0pPygtKT8oXFxkKyk/KD86XFwuKFxcZCspKT8oW2ItZ2lqb3N0VHV2eFhdKS8sXG4gICAgICAgIGtleTogL14oW2Etel9dW2Etel9cXGRdKikvaSxcbiAgICAgICAga2V5X2FjY2VzczogL15cXC4oW2Etel9dW2Etel9cXGRdKikvaSxcbiAgICAgICAgaW5kZXhfYWNjZXNzOiAvXlxcWyhcXGQrKVxcXS8sXG4gICAgICAgIHNpZ246IC9eWystXS9cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzcHJpbnRmKGtleSkge1xuICAgICAgICAvLyBgYXJndW1lbnRzYCBpcyBub3QgYW4gYXJyYXksIGJ1dCBzaG91bGQgYmUgZmluZSBmb3IgdGhpcyBjYWxsXG4gICAgICAgIHJldHVybiBzcHJpbnRmX2Zvcm1hdChzcHJpbnRmX3BhcnNlKGtleSksIGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2c3ByaW50ZihmbXQsIGFyZ3YpIHtcbiAgICAgICAgcmV0dXJuIHNwcmludGYuYXBwbHkobnVsbCwgW2ZtdF0uY29uY2F0KGFyZ3YgfHwgW10pKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNwcmludGZfZm9ybWF0KHBhcnNlX3RyZWUsIGFyZ3YpIHtcbiAgICAgICAgdmFyIGN1cnNvciA9IDEsIHRyZWVfbGVuZ3RoID0gcGFyc2VfdHJlZS5sZW5ndGgsIGFyZywgb3V0cHV0ID0gJycsIGksIGssIHBoLCBwYWQsIHBhZF9jaGFyYWN0ZXIsIHBhZF9sZW5ndGgsIGlzX3Bvc2l0aXZlLCBzaWduXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0cmVlX2xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHBhcnNlX3RyZWVbaV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IHBhcnNlX3RyZWVbaV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwYXJzZV90cmVlW2ldID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHBoID0gcGFyc2VfdHJlZVtpXSAvLyBjb252ZW5pZW5jZSBwdXJwb3NlcyBvbmx5XG4gICAgICAgICAgICAgICAgaWYgKHBoLmtleXMpIHsgLy8ga2V5d29yZCBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcl1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IHBoLmtleXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmcgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHNwcmludGYoJ1tzcHJpbnRmXSBDYW5ub3QgYWNjZXNzIHByb3BlcnR5IFwiJXNcIiBvZiB1bmRlZmluZWQgdmFsdWUgXCIlc1wiJywgcGgua2V5c1trXSwgcGgua2V5c1trLTFdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ1twaC5rZXlzW2tdXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBoLnBhcmFtX25vKSB7IC8vIHBvc2l0aW9uYWwgYXJndW1lbnQgKGV4cGxpY2l0KVxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W3BoLnBhcmFtX25vXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoaW1wbGljaXQpXG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yKytdXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlLm5vdF90eXBlLnRlc3QocGgudHlwZSkgJiYgcmUubm90X3ByaW1pdGl2ZS50ZXN0KHBoLnR5cGUpICYmIGFyZyBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZygpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlLm51bWVyaWNfYXJnLnRlc3QocGgudHlwZSkgJiYgKHR5cGVvZiBhcmcgIT09ICdudW1iZXInICYmIGlzTmFOKGFyZykpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3Ioc3ByaW50ZignW3NwcmludGZdIGV4cGVjdGluZyBudW1iZXIgYnV0IGZvdW5kICVUJywgYXJnKSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmUubnVtYmVyLnRlc3QocGgudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNfcG9zaXRpdmUgPSBhcmcgPj0gMFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN3aXRjaCAocGgudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdiJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBhcnNlSW50KGFyZywgMTApLnRvU3RyaW5nKDIpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoYXJnLCAxMCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwYXJzZUludChhcmcsIDEwKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaic6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBKU09OLnN0cmluZ2lmeShhcmcsIG51bGwsIHBoLndpZHRoID8gcGFyc2VJbnQocGgud2lkdGgpIDogMClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2UnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGgucHJlY2lzaW9uID8gcGFyc2VGbG9hdChhcmcpLnRvRXhwb25lbnRpYWwocGgucHJlY2lzaW9uKSA6IHBhcnNlRmxvYXQoYXJnKS50b0V4cG9uZW50aWFsKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2YnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gcGgucHJlY2lzaW9uID8gcGFyc2VGbG9hdChhcmcpLnRvRml4ZWQocGgucHJlY2lzaW9uKSA6IHBhcnNlRmxvYXQoYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwaC5wcmVjaXNpb24gPyBTdHJpbmcoTnVtYmVyKGFyZy50b1ByZWNpc2lvbihwaC5wcmVjaXNpb24pKSkgOiBwYXJzZUZsb2F0KGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ28nOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBhcnNlSW50KGFyZywgMTApID4+PiAwKS50b1N0cmluZyg4KVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBTdHJpbmcoYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gU3RyaW5nKCEhYXJnKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKHBoLnByZWNpc2lvbiA/IGFyZy5zdWJzdHJpbmcoMCwgcGgucHJlY2lzaW9uKSA6IGFyZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwaC5wcmVjaXNpb24gPyBhcmcuc3Vic3RyaW5nKDAsIHBoLnByZWNpc2lvbikgOiBhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd1JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBhcnNlSW50KGFyZywgMTApID4+PiAwXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd2JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwaC5wcmVjaXNpb24gPyBhcmcuc3Vic3RyaW5nKDAsIHBoLnByZWNpc2lvbikgOiBhcmcpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwYXJzZUludChhcmcsIDEwKSA+Pj4gMCkudG9TdHJpbmcoMTYpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdYJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IChwYXJzZUludChhcmcsIDEwKSA+Pj4gMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZS5qc29uLnRlc3QocGgudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IGFyZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlLm51bWJlci50ZXN0KHBoLnR5cGUpICYmICghaXNfcG9zaXRpdmUgfHwgcGguc2lnbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ24gPSBpc19wb3NpdGl2ZSA/ICcrJyA6ICctJ1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKCkucmVwbGFjZShyZS5zaWduLCAnJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ24gPSAnJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhZF9jaGFyYWN0ZXIgPSBwaC5wYWRfY2hhciA/IHBoLnBhZF9jaGFyID09PSAnMCcgPyAnMCcgOiBwaC5wYWRfY2hhci5jaGFyQXQoMSkgOiAnICdcbiAgICAgICAgICAgICAgICAgICAgcGFkX2xlbmd0aCA9IHBoLndpZHRoIC0gKHNpZ24gKyBhcmcpLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICBwYWQgPSBwaC53aWR0aCA/IChwYWRfbGVuZ3RoID4gMCA/IHBhZF9jaGFyYWN0ZXIucmVwZWF0KHBhZF9sZW5ndGgpIDogJycpIDogJydcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHBoLmFsaWduID8gc2lnbiArIGFyZyArIHBhZCA6IChwYWRfY2hhcmFjdGVyID09PSAnMCcgPyBzaWduICsgcGFkICsgYXJnIDogcGFkICsgc2lnbiArIGFyZylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dFxuICAgIH1cblxuICAgIHZhciBzcHJpbnRmX2NhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG4gICAgZnVuY3Rpb24gc3ByaW50Zl9wYXJzZShmbXQpIHtcbiAgICAgICAgaWYgKHNwcmludGZfY2FjaGVbZm10XSkge1xuICAgICAgICAgICAgcmV0dXJuIHNwcmludGZfY2FjaGVbZm10XVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9mbXQgPSBmbXQsIG1hdGNoLCBwYXJzZV90cmVlID0gW10sIGFyZ19uYW1lcyA9IDBcbiAgICAgICAgd2hpbGUgKF9mbXQpIHtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSByZS50ZXh0LmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKG1hdGNoWzBdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gcmUubW9kdWxvLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKCclJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKChtYXRjaCA9IHJlLnBsYWNlaG9sZGVyLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAxXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZF9saXN0ID0gW10sIHJlcGxhY2VtZW50X2ZpZWxkID0gbWF0Y2hbMl0sIGZpZWxkX21hdGNoID0gW11cbiAgICAgICAgICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IHJlLmtleS5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICgocmVwbGFjZW1lbnRfZmllbGQgPSByZXBsYWNlbWVudF9maWVsZC5zdWJzdHJpbmcoZmllbGRfbWF0Y2hbMF0ubGVuZ3RoKSkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IHJlLmtleV9hY2Nlc3MuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoKGZpZWxkX21hdGNoID0gcmUuaW5kZXhfYWNjZXNzLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ1tzcHJpbnRmXSBmYWlsZWQgdG8gcGFyc2UgbmFtZWQgYXJndW1lbnQga2V5JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ1tzcHJpbnRmXSBmYWlsZWQgdG8gcGFyc2UgbmFtZWQgYXJndW1lbnQga2V5JylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBtYXRjaFsyXSA9IGZpZWxkX2xpc3RcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhcmdfbmFtZXMgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbc3ByaW50Zl0gbWl4aW5nIHBvc2l0aW9uYWwgYW5kIG5hbWVkIHBsYWNlaG9sZGVycyBpcyBub3QgKHlldCkgc3VwcG9ydGVkJylcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBtYXRjaFswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtX25vOiAgICBtYXRjaFsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXM6ICAgICAgICBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ246ICAgICAgICBtYXRjaFszXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZF9jaGFyOiAgICBtYXRjaFs0XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduOiAgICAgICBtYXRjaFs1XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAgICAgICBtYXRjaFs2XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpc2lvbjogICBtYXRjaFs3XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICAgICAgICBtYXRjaFs4XVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdbc3ByaW50Zl0gdW5leHBlY3RlZCBwbGFjZWhvbGRlcicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfZm10ID0gX2ZtdC5zdWJzdHJpbmcobWF0Y2hbMF0ubGVuZ3RoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcHJpbnRmX2NhY2hlW2ZtdF0gPSBwYXJzZV90cmVlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZXhwb3J0IHRvIGVpdGhlciBicm93c2VyIG9yIG5vZGUuanNcbiAgICAgKi9cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZXhwb3J0c1snc3ByaW50ZiddID0gc3ByaW50ZlxuICAgICAgICBleHBvcnRzWyd2c3ByaW50ZiddID0gdnNwcmludGZcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHdpbmRvd1snc3ByaW50ZiddID0gc3ByaW50ZlxuICAgICAgICB3aW5kb3dbJ3ZzcHJpbnRmJ10gPSB2c3ByaW50ZlxuXG4gICAgICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZVsnYW1kJ10pIHtcbiAgICAgICAgICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAnc3ByaW50Zic6IHNwcmludGYsXG4gICAgICAgICAgICAgICAgICAgICd2c3ByaW50Zic6IHZzcHJpbnRmXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiBlc2xpbnQtZW5hYmxlIHF1b3RlLXByb3BzICovXG59KCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiIsInZhciBnO1xuXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxuZyA9IChmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXM7XG59KSgpO1xuXG50cnkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcblx0ZyA9IGcgfHwgbmV3IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcbn0gY2F0Y2ggKGUpIHtcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcblx0aWYgKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpIGcgPSB3aW5kb3c7XG59XG5cbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XG5cbm1vZHVsZS5leHBvcnRzID0gZztcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdGlmICghbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxuXHRcdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImxvYWRlZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5sO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiaWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUuaTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcblx0fVxuXHRyZXR1cm4gbW9kdWxlO1xufTtcbiIsInZhciBtYWtlSHR0cFJlcXVlc3QgPSAob2JqLCBzdWNjZXNzLCBmYWlsdXJlKSA9PiB7XG4gIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgeGhyLm9wZW4ob2JqLm1ldGhvZCB8fCBcIkdFVFwiLCBvYmoudXJsKTtcbiAgaWYgKG9iai5oZWFkZXJzKSB7XG4gICAgT2JqZWN0LmtleXMob2JqLmhlYWRlcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgb2JqLmhlYWRlcnNba2V5XSk7XG4gICAgfSk7XG4gIH1cbiAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgc3VjY2Vzcyh4aHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmYWlsdXJlKHhocik7XG4gICAgfVxuICB9O1xuICB4aHIub25lcnJvciA9ICgpID0+IGZhaWx1cmUoeGhyKTtcbiAgeGhyLnNlbmQob2JqLmJvZHkpO1xufTtcblxuZXhwb3J0IHsgbWFrZUh0dHBSZXF1ZXN0IH07XG4iLCJpbXBvcnQgeyBVbkltcGxlbWVudGVkTWV0aG9kRXhjZXB0aW9uIH0gZnJvbSBcIi4uL2NvcmUvZXhjZXB0aW9uc1wiO1xuaW1wb3J0IHsgbWFrZUh0dHBSZXF1ZXN0IH0gZnJvbSBcIi4vWG1sSHR0cENsaWVudFwiO1xuaW1wb3J0IHsgR2xvYmFsQ29uZmlnIH0gZnJvbSBcIi4uL2dsb2JhbENvbmZpZ1wiO1xuaW1wb3J0IHtcbiAgUkVTT1VSQ0VfUEFUSCxcbiAgSFRUUF9NRVRIT0RTLFxuICBSRUdJT05fQ09ORklHLFxuICBDT05URU5UX1RZUEUsXG4gIE1FU1NBR0VfUEVSU0lTVEVOQ0UsXG4gIENPTk5FQ1RJT05fVE9LRU5fS0VZLFxuICBQQVJUSUNJUEFOVF9UT0tFTl9LRVksXG4gIFJFR0lPTlNcbn0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgTG9nTWFuYWdlciB9IGZyb20gXCIuLi9sb2dcIjtcblxuY2xhc3MgQ2hhdENsaWVudEZhY3RvcnlJbXBsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jbGllbnRDYWNoZSA9IHt9O1xuICB9XG5cbiAgZ2V0Q2FjaGVkQ2xpZW50KG9wdGlvbnNJbnB1dCkge1xuICAgIHZhciBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9uc0lucHV0KTtcbiAgICB2YXIgcmVnaW9uID0gb3B0aW9uc0lucHV0LnJlZ2lvbiB8fCBHbG9iYWxDb25maWcuZ2V0UmVnaW9uKCkgfHwgUkVHSU9OUy5wZHg7XG4gICAgb3B0aW9ucy5yZWdpb24gPSByZWdpb247XG4gICAgaWYgKHRoaXMuY2xpZW50Q2FjaGVbcmVnaW9uXSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xpZW50Q2FjaGVbcmVnaW9uXTtcbiAgICB9XG4gICAgdmFyIGNsaWVudCA9IHRoaXMuX2NyZWF0ZUNsaWVudChvcHRpb25zKTtcbiAgICB0aGlzLmNsaWVudENhY2hlW3JlZ2lvbl0gPSBjbGllbnQ7XG4gICAgcmV0dXJuIGNsaWVudDtcbiAgfVxuXG4gIF9jcmVhdGVDbGllbnQob3B0aW9ucykge1xuICAgIHZhciByZWdpb24gPSBvcHRpb25zLnJlZ2lvbjtcbiAgICB2YXIgZW5kcG9pbnRPdmVycmlkZSA9IEdsb2JhbENvbmZpZy5nZXRFbmRwb2ludE92ZXJyaWRlKCk7XG4gICAgdmFyIHN0YWdlQ29uZmlnID0gUkVHSU9OX0NPTkZJR1tyZWdpb25dO1xuICAgIGlmIChlbmRwb2ludE92ZXJyaWRlKSB7XG4gICAgICBzdGFnZUNvbmZpZy5pbnZva2VVcmwgPSBlbmRwb2ludE92ZXJyaWRlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEh0dHBDaGF0Q2xpZW50KHtcbiAgICAgIHN0YWdlQ29uZmlnOiBzdGFnZUNvbmZpZ1xuICAgIH0pO1xuICB9XG59XG5cbi8qZXNsaW50LWRpc2FibGUqL1xuY2xhc3MgQ2hhdENsaWVudCB7XG4gIHNlbmRNZXNzYWdlKHBhcnRpY2lwYW50VG9rZW4sIG1lc3NhZ2UsIHR5cGUpIHtcbiAgICB0aHJvdyBuZXcgVW5JbXBsZW1lbnRlZE1ldGhvZEV4Y2VwdGlvbihcInNlbmRUZXh0TWVzc2FnZSBpbiBDaGF0Q2xpZW50XCIpO1xuICB9XG5cbiAgZGlzY29ubmVjdENoYXQocGFydGljaXBhbnRUb2tlbikge1xuICAgIHRocm93IG5ldyBVbkltcGxlbWVudGVkTWV0aG9kRXhjZXB0aW9uKFwiZGlzY29ubmVjdENoYXQgaW4gQ2hhdENsaWVudFwiKTtcbiAgfVxuXG4gIHNlbmRFdmVudChldmVudFR5cGUsIG1lc3NhZ2VJZHMsIHZpc2liaWxpdHksIHBlcnNpc3RlbmNlKSB7XG4gICAgdGhyb3cgbmV3IFVuSW1wbGVtZW50ZWRNZXRob2RFeGNlcHRpb24oXCJzZW5kRXZlbnQgaW4gQ2hhdENsaWVudFwiKTtcbiAgfVxuXG4gIGNyZWF0ZUNvbm5lY3Rpb25EZXRhaWxzKHBhcnRpY2lwYW50VG9rZW4pIHtcbiAgICB0aHJvdyBuZXcgVW5JbXBsZW1lbnRlZE1ldGhvZEV4Y2VwdGlvbihcInJlY29ubmVjdENoYXQgaW4gQ2hhdENsaWVudFwiKTtcbiAgfVxufVxuLyplc2xpbnQtZW5hYmxlKi9cblxudmFyIGNyZWF0ZURlZmF1bHRIZWFkZXJzID0gKCkgPT4gKHtcbiAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCJcbn0pO1xuXG5jbGFzcyBIdHRwQ2hhdENsaWVudCBleHRlbmRzIENoYXRDbGllbnQge1xuICBjb25zdHJ1Y3RvcihhcmdzKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmludm9rZVVybCA9IGFyZ3Muc3RhZ2VDb25maWcuaW52b2tlVXJsO1xuICAgIHRoaXMuY2FsbEh0dHBDbGllbnQgPSBtYWtlSHR0cFJlcXVlc3Q7XG4gICAgdGhpcy5sb2dnZXIgPSBMb2dNYW5hZ2VyLmdldExvZ2dlcih7IHByZWZpeDogXCJDaGF0Q2xpZW50XCIgfSk7XG4gIH1cblxuICBzZW5kTWVzc2FnZShjb25uZWN0aW9uVG9rZW4sIG1lc3NhZ2UsIHR5cGUpIHtcbiAgICBjb25zb2xlLmxvZyh0eXBlKTtcbiAgICB2YXIgYm9keSA9IHtcbiAgICAgIE1lc3NhZ2U6IHtcbiAgICAgICAgQ29udGVudFR5cGU6IENPTlRFTlRfVFlQRS50ZXh0UGxhaW4sXG4gICAgICAgIENvbnRlbnQ6IG1lc3NhZ2UsXG4gICAgICAgIFBlcnNpc3RlbmNlOiBNRVNTQUdFX1BFUlNJU1RFTkNFLlBFUlNJU1RFRFxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIHJlcXVlc3RJbnB1dCA9IHtcbiAgICAgIG1ldGhvZDogSFRUUF9NRVRIT0RTLlBPU1QsXG4gICAgICBoZWFkZXJzOiB7fSxcbiAgICAgIHVybDogdGhpcy5pbnZva2VVcmwgKyBSRVNPVVJDRV9QQVRILk1FU1NBR0UsXG4gICAgICBib2R5OiBib2R5XG4gICAgfTtcbiAgICByZXF1ZXN0SW5wdXQuaGVhZGVyc1tDT05ORUNUSU9OX1RPS0VOX0tFWV0gPSBjb25uZWN0aW9uVG9rZW47XG4gICAgcmV0dXJuIHRoaXMuX2NhbGxIdHRwQ2xpZW50KHJlcXVlc3RJbnB1dCk7XG4gIH1cblxuICBnZXRUcmFuc2NyaXB0KGNvbm5lY3Rpb25Ub2tlbiwgYXJncykge1xuICAgIHZhciByZXF1ZXN0SW5wdXQgPSB7XG4gICAgICBtZXRob2Q6IEhUVFBfTUVUSE9EUy5QT1NULFxuICAgICAgaGVhZGVyczoge30sXG4gICAgICB1cmw6IHRoaXMuaW52b2tlVXJsICsgUkVTT1VSQ0VfUEFUSC5UUkFOU0NSSVBULFxuICAgICAgYm9keTogYXJnc1xuICAgIH07XG4gICAgcmVxdWVzdElucHV0LmhlYWRlcnNbQ09OTkVDVElPTl9UT0tFTl9LRVldID0gY29ubmVjdGlvblRva2VuO1xuICAgIHJldHVybiB0aGlzLl9jYWxsSHR0cENsaWVudChyZXF1ZXN0SW5wdXQpO1xuICB9XG5cbiAgc2VuZEV2ZW50KGNvbm5lY3Rpb25Ub2tlbiwgZXZlbnRUeXBlLCBtZXNzYWdlSWRzLCB2aXNpYmlsaXR5LCBwZXJzaXN0ZW5jZSkge1xuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2VJZHMpO1xuICAgIGNvbnNvbGUubG9nKHBlcnNpc3RlbmNlKTtcbiAgICB2YXIgYm9keSA9IHtcbiAgICAgIFBhcnRpY2lwYW50RXZlbnQ6IHtcbiAgICAgICAgVmlzaWJpbGl0eTogdmlzaWJpbGl0eSxcbiAgICAgICAgUGFydGljaXBhbnRFdmVudFR5cGU6IGV2ZW50VHlwZVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIHJlcXVlc3RJbnB1dCA9IHtcbiAgICAgIG1ldGhvZDogSFRUUF9NRVRIT0RTLlBPU1QsXG4gICAgICBoZWFkZXJzOiB7fSxcbiAgICAgIHVybDogdGhpcy5pbnZva2VVcmwgKyBSRVNPVVJDRV9QQVRILkVWRU5ULFxuICAgICAgYm9keTogYm9keVxuICAgIH07XG4gICAgcmVxdWVzdElucHV0LmhlYWRlcnNbQ09OTkVDVElPTl9UT0tFTl9LRVldID0gY29ubmVjdGlvblRva2VuO1xuICAgIHJldHVybiB0aGlzLl9jYWxsSHR0cENsaWVudChyZXF1ZXN0SW5wdXQpO1xuICB9XG5cbiAgZGlzY29ubmVjdENoYXQoY29ubmVjdGlvblRva2VuKSB7XG4gICAgdmFyIHJlcXVlc3RJbnB1dCA9IHtcbiAgICAgIG1ldGhvZDogSFRUUF9NRVRIT0RTLlBPU1QsXG4gICAgICBoZWFkZXJzOiB7fSxcbiAgICAgIHVybDogdGhpcy5pbnZva2VVcmwgKyBSRVNPVVJDRV9QQVRILkRJU0NPTk5FQ1QsXG4gICAgICBib2R5OiB7fVxuICAgIH07XG4gICAgcmVxdWVzdElucHV0LmhlYWRlcnNbQ09OTkVDVElPTl9UT0tFTl9LRVldID0gY29ubmVjdGlvblRva2VuO1xuICAgIHJldHVybiB0aGlzLl9jYWxsSHR0cENsaWVudChyZXF1ZXN0SW5wdXQpO1xuICB9XG5cbiAgY3JlYXRlQ29ubmVjdGlvbkRldGFpbHMocGFydGljaXBhbnRUb2tlbikge1xuICAgIHZhciByZXF1ZXN0SW5wdXQgPSB7XG4gICAgICBtZXRob2Q6IEhUVFBfTUVUSE9EUy5QT1NULFxuICAgICAgaGVhZGVyczoge30sXG4gICAgICB1cmw6IHRoaXMuaW52b2tlVXJsICsgUkVTT1VSQ0VfUEFUSC5DT05ORUNUSU9OX0RFVEFJTFMsXG4gICAgICBib2R5OiB7fVxuICAgIH07XG4gICAgcmVxdWVzdElucHV0LmhlYWRlcnNbUEFSVElDSVBBTlRfVE9LRU5fS0VZXSA9IHBhcnRpY2lwYW50VG9rZW47XG4gICAgcmV0dXJuIHRoaXMuX2NhbGxIdHRwQ2xpZW50KHJlcXVlc3RJbnB1dCk7XG4gIH1cblxuICBfY2FsbEh0dHBDbGllbnQocmVxdWVzdElucHV0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJlcXVlc3RJbnB1dC5oZWFkZXJzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIGNyZWF0ZURlZmF1bHRIZWFkZXJzKCksXG4gICAgICByZXF1ZXN0SW5wdXQuaGVhZGVyc1xuICAgICk7XG4gICAgcmVxdWVzdElucHV0LmJvZHkgPSBKU09OLnN0cmluZ2lmeShyZXF1ZXN0SW5wdXQuYm9keSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHN1Y2Nlc3MgPSByZXF1ZXN0ID0+IHtcbiAgICAgICAgdmFyIHJlc3BvbnNlT2JqZWN0ID0ge307XG4gICAgICAgIHJlc3BvbnNlT2JqZWN0LmRhdGEgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZU9iamVjdCk7XG4gICAgICB9O1xuICAgICAgdmFyIGZhaWx1cmUgPSByZXF1ZXN0ID0+IHtcbiAgICAgICAgdmFyIGVycm9yT2JqZWN0ID0ge307XG4gICAgICAgIGVycm9yT2JqZWN0LnN0YXR1c1RleHQgPSByZXF1ZXN0LnN0YXR1c1RleHQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXJyb3JPYmplY3QuZXJyb3IgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHNlbGYubG9nZ2VyLndhcm4oXCJpbnZhbGlkIGpzb24gZXJyb3IgZnJvbSBzZXJ2ZXJcIik7XG4gICAgICAgICAgZXJyb3JPYmplY3QuZXJyb3IgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJlamVjdChlcnJvck9iamVjdCk7XG4gICAgICB9O1xuICAgICAgc2VsZi5jYWxsSHR0cENsaWVudChyZXF1ZXN0SW5wdXQsIHN1Y2Nlc3MsIGZhaWx1cmUpO1xuICAgIH0pO1xuICB9XG59XG5cbnZhciBDaGF0Q2xpZW50RmFjdG9yeSA9IG5ldyBDaGF0Q2xpZW50RmFjdG9yeUltcGwoKTtcbmV4cG9ydCB7IENoYXRDbGllbnRGYWN0b3J5IH07XG4iLCJpbXBvcnQgVXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcbi8vUGxhY2Vob2xkZXJcbmV4cG9ydCBjb25zdCBDSEFUX0NPTkZJR1VSQVRJT05TID0ge1xuICBDT05DVVJSRU5UX0NIQVRTOiAxMFxufTtcblxuZXhwb3J0IGNvbnN0IENPTk5FQ1RJT05fVE9LRU5fS0VZID0gXCJ4LWFtem4tY29ubmVjdC1jb25uZWN0aW9uLXRva2VuXCI7XG5leHBvcnQgY29uc3QgUEFSVElDSVBBTlRfVE9LRU5fS0VZID0gXCJ4LWFtem4tY29ubmVjdC1wYXJ0aWNpcGFudC10b2tlblwiO1xuXG5leHBvcnQgY29uc3QgUkVTT1VSQ0VfUEFUSCA9IHtcbiAgTUVTU0FHRTogXCIvY29udGFjdC9jaGF0L3BhcnRpY2lwYW50L21lc3NhZ2VcIixcbiAgVFJBTlNDUklQVDogXCIvY29udGFjdC9jaGF0L3BhcnRpY2lwYW50L3RyYW5zY3JpcHRcIixcbiAgRVZFTlQ6IFwiL2NvbnRhY3QvY2hhdC9wYXJ0aWNpcGFudC9ldmVudFwiLFxuICBESVNDT05ORUNUOiBcIi9jb250YWN0L2NoYXQvcGFydGljaXBhbnQvZGlzY29ubmVjdFwiLFxuICBDT05ORUNUSU9OX0RFVEFJTFM6IFwiL2NvbnRhY3QvY2hhdC9wYXJ0aWNpcGFudC9jb25uZWN0aW9uLWRldGFpbHNcIlxufTtcblxuZXhwb3J0IGNvbnN0IEhUVFBfTUVUSE9EUyA9IHtcbiAgUE9TVDogXCJwb3N0XCJcbn07XG5cbmV4cG9ydCBjb25zdCBNRVNTQUdFX1BFUlNJU1RFTkNFID0ge1xuICBQRVJTSVNURUQ6IFwiUEVSU0lTVEVEXCIsXG4gIE5PTl9QRVJTSVNURUQ6IFwiTk9OX1BFUlNJU1RFRFwiXG59O1xuXG5leHBvcnQgY29uc3QgQ09OVEVOVF9UWVBFID0ge1xuICB0ZXh0UGxhaW46IFwidGV4dC9wbGFpblwiXG59O1xuXG5leHBvcnQgY29uc3QgVklTSUJJTElUWSA9IFV0aWxzLm1ha2VFbnVtKFtcbiAgXCJBTExcIixcbiAgXCJNQU5BR0VSXCIsXG4gIFwiQUdFTlRcIixcbiAgXCJDVVNUT01FUlwiLFxuICBcIlRISVJEUEFSVFlcIlxuXSk7XG5cbmV4cG9ydCBjb25zdCBQRVJTSVNURU5DRSA9IFV0aWxzLm1ha2VFbnVtKFtcIlBFUlNJU1RFRFwiLCBcIk5PTl9QRVJTSVNURURcIl0pO1xuXG5leHBvcnQgY29uc3QgUkVHSU9OX0NPTkZJRyA9IHtcbiAgXCJ1cy13ZXN0LTJcIjoge1xuICAgIGludm9rZVVybDogXCJodHRwczovL2VhcDF3OTNqMGsuZXhlY3V0ZS1hcGkudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vcHJvZFwiXG4gIH0sXG4gIFwidXMtZWFzdC0xXCI6IHtcbiAgICBpbnZva2VVcmw6IFwiaHR0cHM6Ly80YWdjanVzeDNrLmV4ZWN1dGUtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3Byb2RcIlxuICB9LFxuICBcImFwLXNvdXRoZWFzdC0yXCI6IHtcbiAgICBpbnZva2VVcmw6XG4gICAgICBcImh0dHBzOi8vdjR1OG9xMGN2ZS5leGVjdXRlLWFwaS5hcC1zb3V0aGVhc3QtMi5hbWF6b25hd3MuY29tL3Byb2RcIlxuICB9LFxuICBcImFwLW5vcnRoZWFzdC0xXCI6IHtcbiAgICBpbnZva2VVcmw6XG4gICAgICBcImh0dHBzOi8vM2ZpZHVuZnl6Ny5leGVjdXRlLWFwaS5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tL3Byb2RcIlxuICB9LFxuICBcImV1LWNlbnRyYWwtMVwiOiB7XG4gICAgaW52b2tlVXJsOiBcImh0dHBzOi8vMWd5bmFhcm0zZS5leGVjdXRlLWFwaS5ldS1jZW50cmFsLTEuYW1hem9uYXdzLmNvbS9wcm9kXCJcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IE1RVFRfQ09OU1RBTlRTID0ge1xuICBLRUVQX0FMSVZFOiAzMCxcbiAgQ09OTkVDVF9USU1FT1VUOiA2MFxufTtcblxuZXhwb3J0IGNvbnN0IFNFU1NJT05fVFlQRVMgPSB7XG4gIEFHRU5UOiBcIkFHRU5UXCIsXG4gIENVU1RPTUVSOiBcIkNVU1RPTUVSXCJcbn07XG5cbmV4cG9ydCBjb25zdCBDSEFUX0VWRU5UUyA9IHtcbiAgSU5DT01JTkdfTUVTU0FHRTogXCJJTkNPTUlOR19NRVNTQUdFXCIsXG4gIElOQ09NSU5HX1RZUElORzogXCJJTkNPTUlOR19UWVBJTkdcIixcbiAgQ09OTkVDVElPTl9FU1RBQkxJU0hFRDogXCJDT05ORUNUSU9OX0VTVEFCTElTSEVEXCIsXG4gIENPTk5FQ1RJT05fQlJPS0VOOiBcIkNPTk5FQ1RJT05fQlJPS0VOXCJcbn07XG5cbmV4cG9ydCBjb25zdCBUUkFOU0NSSVBUX0RFRkFVTFRfUEFSQU1TID0ge1xuICBNQVhfUkVTVUxUUzogMTUsXG4gIFNPUlRfS0VZOiBcIkFTQ0VORElOR1wiLFxuICBTQ0FOX0RJUkVDVElPTjogXCJCQUNLV0FSRFwiXG59O1xuXG5leHBvcnQgY29uc3QgTE9HU19ERVNUSU5BVElPTiA9IHtcbiAgTlVMTDogXCJOVUxMXCIsXG4gIENMSUVOVF9MT0dHRVI6IFwiQ0xJRU5UX0xPR0dFUlwiLFxuICBERUJVRzogXCJERUJVR1wiXG59O1xuXG5leHBvcnQgY29uc3QgUkVHSU9OUyA9IHtcbiAgcGR4OiBcInVzLXdlc3QtMlwiLFxuICBpYWQ6IFwidXMtZWFzdC0xXCIsXG4gIHN5ZDogXCJhcC1zb3V0aGVhc3QtMlwiLFxuICBucnQ6IFwiYXAtbm9ydGhlYXN0LTFcIixcbiAgZnJhOiBcImV1LWNlbnRyYWwtMVwiXG59O1xuIiwiaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlsc1wiO1xuaW1wb3J0IHsgQ09OVEVOVF9UWVBFLCBWSVNJQklMSVRZLCBQRVJTSVNURU5DRSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IElsbGVnYWxBcmd1bWVudEV4Y2VwdGlvbiB9IGZyb20gXCIuL2V4Y2VwdGlvbnNcIjtcblxuY2xhc3MgQ2hhdENvbnRyb2xsZXJBcmdzVmFsaWRhdG9yIHtcbiAgLyplc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyovXG4gIHZhbGlkYXRlTmV3Q29udHJvbGxlckRldGFpbHMoY2hhdERldGFpbHMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICAvKmVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMqL1xuXG4gIHZhbGlkYXRlU2VuZE1lc3NhZ2UobWVzc2FnZSwgdHlwZSkge1xuICAgIGlmICghVXRpbHMuaXNTdHJpbmcobWVzc2FnZSkpIHtcbiAgICAgIFV0aWxzLmFzc2VydElzT2JqZWN0KG1lc3NhZ2UsIFwibWVzc2FnZVwiKTtcbiAgICB9XG4gICAgVXRpbHMuYXNzZXJ0SXNFbnVtKHR5cGUsIE9iamVjdC52YWx1ZXMoQ09OVEVOVF9UWVBFKSwgXCJ0eXBlXCIpO1xuICB9XG5cbiAgLyplc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyovXG4gIHZhbGlkYXRlQ29ubmVjdENoYXQoYXJncykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIC8qZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyovXG5cbiAgdmFsaWRhdGVMb2dnZXIobG9nZ2VyKSB7XG4gICAgVXRpbHMuYXNzZXJ0SXNPYmplY3QobG9nZ2VyLCBcImxvZ2dlclwiKTtcbiAgICBbXCJkZWJ1Z1wiLCBcImluZm9cIiwgXCJ3YXJuXCIsIFwiZXJyb3JcIl0uZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICAgIGlmICghVXRpbHMuaXNGdW5jdGlvbihsb2dnZXJbbWV0aG9kTmFtZV0pKSB7XG4gICAgICAgIHRocm93IG5ldyBJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb24oXG4gICAgICAgICAgbWV0aG9kTmFtZSArXG4gICAgICAgICAgICBcIiBzaG91bGQgYmUgYSB2YWxpZCBmdW5jdGlvbiBvbiB0aGUgcGFzc2VkIGxvZ2dlciBvYmplY3QhXCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHZhbGlkYXRlU2VuZEV2ZW50KGFyZ3MpIHtcbiAgICBVdGlscy5hc3NlcnRJc05vbkVtcHR5U3RyaW5nKGFyZ3MuZXZlbnRUeXBlLCBcImV2ZW50VHlwZVwiKTtcbiAgICBpZiAoYXJncy5tZXNzYWdlSWRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIFV0aWxzLmFzc2VydElzTGlzdChhcmdzLm1lc3NhZ2VJZHMpO1xuICAgIH1cbiAgICBpZiAoYXJncy52aXNpYmlsaXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIFV0aWxzLmFzc2VydElzRW51bShcbiAgICAgICAgYXJncy52aXNpYmlsaXR5LFxuICAgICAgICBPYmplY3QudmFsdWVzKFZJU0lCSUxJVFkpLFxuICAgICAgICBcInZpc2liaWxpdHlcIlxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKGFyZ3MucGVyc2lzdGVuY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgVXRpbHMuYXNzZXJ0SXNFbnVtKFxuICAgICAgICBhcmdzLnBlcnNpc3RlbmNlLFxuICAgICAgICBPYmplY3QudmFsdWVzKFBFUlNJU1RFTkNFKSxcbiAgICAgICAgXCJwZXJzaXN0ZW5jZVwiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRPRE86IE5vdCBzdXJlIGFib3V0IHRoaXMgQVBJLlxuICAvKmVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzKi9cbiAgdmFsaWRhdGVHZXRNZXNzYWdlcyhhcmdzKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgLyplc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzKi9cbn1cblxuY2xhc3MgQ2hhdFNlcnZpY2VBcmdzVmFsaWRhdG9yIGV4dGVuZHMgQ2hhdENvbnRyb2xsZXJBcmdzVmFsaWRhdG9yIHtcbiAgdmFsaWRhdGVDaGF0RGV0YWlscyhjaGF0RGV0YWlscykge1xuICAgIFV0aWxzLmFzc2VydElzT2JqZWN0KGNoYXREZXRhaWxzLCBcImNoYXREZXRhaWxzXCIpO1xuICAgIFV0aWxzLmFzc2VydElzTm9uRW1wdHlTdHJpbmcoXG4gICAgICBjaGF0RGV0YWlscy5pbml0aWFsQ29udGFjdElkLFxuICAgICAgXCJjaGF0RGV0YWlscy5pbml0aWFsQ29udGFjdElkXCJcbiAgICApO1xuICAgIFV0aWxzLmFzc2VydElzTm9uRW1wdHlTdHJpbmcoXG4gICAgICBjaGF0RGV0YWlscy5jb250YWN0SWQsXG4gICAgICBcImNoYXREZXRhaWxzLmNvbnRhY3RJZFwiXG4gICAgKTtcbiAgICBVdGlscy5hc3NlcnRJc05vbkVtcHR5U3RyaW5nKFxuICAgICAgY2hhdERldGFpbHMucGFydGljaXBhbnRJZCxcbiAgICAgIFwiY2hhdERldGFpbHMucGFydGljaXBhbnRJZFwiXG4gICAgKTtcbiAgICBpZiAoY2hhdERldGFpbHMuY29ubmVjdGlvbkRldGFpbHMpIHtcbiAgICAgIFV0aWxzLmFzc2VydElzT2JqZWN0KFxuICAgICAgICBjaGF0RGV0YWlscy5jb25uZWN0aW9uRGV0YWlscyxcbiAgICAgICAgXCJjaGF0RGV0YWlscy5jb25uZWN0aW9uRGV0YWlsc1wiXG4gICAgICApO1xuICAgICAgVXRpbHMuYXNzZXJ0SXNOb25FbXB0eVN0cmluZyhcbiAgICAgICAgY2hhdERldGFpbHMuY29ubmVjdGlvbkRldGFpbHMuUHJlU2lnbmVkQ29ubmVjdGlvblVybCxcbiAgICAgICAgXCJjaGF0RGV0YWlscy5jb25uZWN0aW9uRGV0YWlscy5QcmVTaWduZWRDb25uZWN0aW9uVXJsXCJcbiAgICAgICk7XG4gICAgICBVdGlscy5hc3NlcnRJc05vbkVtcHR5U3RyaW5nKFxuICAgICAgICBjaGF0RGV0YWlscy5jb25uZWN0aW9uRGV0YWlscy5Db25uZWN0aW9uSWQsXG4gICAgICAgIFwiY2hhdERldGFpbHMuY29ubmVjdGlvbkRldGFpbHMuQ29ubmVjdGlvbklkXCJcbiAgICAgICk7XG4gICAgICBVdGlscy5hc3NlcnRJc05vbkVtcHR5U3RyaW5nKFxuICAgICAgICBjaGF0RGV0YWlscy5jb25uZWN0aW9uRGV0YWlscy5jb25uZWN0aW9uVG9rZW4sXG4gICAgICAgIFwiY2hhdERldGFpbHMuY29ubmVjdGlvbkRldGFpbHMuY29ubmVjdGlvblRva2VuXCJcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFV0aWxzLmFzc2VydElzTm9uRW1wdHlTdHJpbmcoXG4gICAgICAgIGNoYXREZXRhaWxzLnBhcnRpY2lwYW50VG9rZW4sXG4gICAgICAgIFwiY2hhdERldGFpbHMucGFydGljaXBhbnRUb2tlblwiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHZhbGlkYXRlSW5pdGlhdGVDaGF0UmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IHsgQ2hhdFNlcnZpY2VBcmdzVmFsaWRhdG9yIH07XG4iLCJpbXBvcnQge1xuICBVbkltcGxlbWVudGVkTWV0aG9kRXhjZXB0aW9uLFxuICBJbGxlZ2FsU3RhdGVFeGNlcHRpb25cbn0gZnJvbSBcIi4vZXhjZXB0aW9uc1wiO1xuaW1wb3J0IHsgQ29ubmVjdGlvbkhlbHBlclN0YXR1cyB9IGZyb20gXCIuL2Nvbm5lY3Rpb25IZWxwZXJcIjtcbmltcG9ydCB7XG4gIFBFUlNJU1RFTkNFLFxuICBWSVNJQklMSVRZLFxuICBDSEFUX0VWRU5UUyxcbiAgVFJBTlNDUklQVF9ERUZBVUxUX1BBUkFNUyxcbiAgQ09OVEVOVF9UWVBFXG59IGZyb20gXCIuLi9jb25zdGFudHNcIjtcblxuaW1wb3J0IHsgTG9nTWFuYWdlciB9IGZyb20gXCIuLi9sb2dcIjtcblxudmFyIE5ldHdvcmtMaW5rU3RhdHVzID0ge1xuICBOZXZlckVzdGFibGlzaGVkOiBcIk5ldmVyRXN0YWJsaXNoZWRcIixcbiAgRXN0YWJsaXNoaW5nOiBcIkVzdGFibGlzaGluZ1wiLFxuICBFc3RhYmxpc2hlZDogXCJFc3RhYmxpc2hlZFwiLFxuICBCcm9rZW5SZXRyeWluZzogXCJCcm9rZW5SZXRyeWluZ1wiLFxuICBCcm9rZW46IFwiQnJva2VuXCJcbn07XG5cbi8qZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMqL1xuY2xhc3MgQ2hhdENvbnRyb2xsZXIge1xuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRNZXNzYWdlXG4gICAqIEByZXR1cm4gYSBwcm9taXNlIG9iamVjdCB3aXRoXG4gICAqIHN1Y2Nlc3MgPSB7XG4gICAqICBcInN0YXR1c0NvZGVcIjogMjAwLFxuICAgKiAgXCJkYXRhXCI6IHtcbiAgICogICAgICBcIk1lc3NhZ2VJZFwiOiA8c3RyaW5nPlxuICAgKiAgICAgIH1cbiAgICogIH1cbiAgICogZXJyb3IgPSB7XG4gICAqICBcInN0YXR1c0NvZGVcIjogPGVycm9yU3RhdHVzQ29kZT4sXG4gICAqICBcImV4Y2VwdGlvblwiOiB7fSAvLyBzb21lIG9iamVjdC4uLlxuICAgKiB9XG4gICAqL1xuICBzZW5kVGV4dE1lc3NhZ2UodGV4dE1lc3NhZ2UpIHtcbiAgICB0aHJvdyBuZXcgVW5JbXBsZW1lbnRlZE1ldGhvZEV4Y2VwdGlvbihcInNlbmRUZXh0TWVzc2FnZSBpbiBDaGF0Q29udHJvbGxlclwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGFyZ3NcbiAgICogQHJldHVybiBQcm9taXNlIG9iamVjdCB3aXRoXG4gICAqICAgICAgcmVzcG9uc2UgPSB7XG4gICAqICAgICAgICAgICAgICBcImRldGFpbHNcIjoge30sIC8vIEltcGxlbWVudGF0aW9uIHNwZWNpZmljXG4gICAqICAgICAgICAgICAgICBcImluaXRpYWxDb250YWN0SWRcIjogPEluaXRpYWxDb250YWN0SWQ+LFxuICAgKiAgICAgICAgICAgICAgXCJjb250YWN0SWRcIjogIDxjb250YWN0SWQ+LFxuICAgKiAgICAgICAgICAgICAgXCJjb25uZWN0U3VjY2Vzc1wiOiB0cnVlXG4gICAqICAgICAgfVxuICAgKiAgICAgIGVycm9yID0ge1xuICAgKiAgICAgICAgICAgICAgXCJkZXRhaWxzXCI6IHt9LCAvLyBJbXBsZW1lbnRhdGlvbiBzcGVjaWZpY1xuICAgKiAgICAgICAgICAgICAgXCJpbml0aWFsQ29udGFjdElkXCI6IDxJbml0aWFsQ29udGFjdElkPixcbiAgICogICAgICAgICAgICAgIFwiY29udGFjdElkXCI6ICA8Y29udGFjdElkPixcbiAgICogICAgICAgICAgICAgIFwiY29ubmVjdFN1Y2Nlc3NcIjogZmFsc2VcbiAgICogICAgICB9XG4gICAqL1xuICBlc3RhYmxpc2hOZXR3b3JrTGluayhhcmdzKSB7XG4gICAgdGhyb3cgbmV3IFVuSW1wbGVtZW50ZWRNZXRob2RFeGNlcHRpb24oXCJjb25uZWN0Q2hhdCBpbiBDaGF0Q29udHJvbGxlclwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIG51bGxcbiAgICovXG4gIGRpc2Nvbm5lY3RQYXJ0aWNpcGFudCgpIHtcbiAgICB0aHJvdyBuZXcgVW5JbXBsZW1lbnRlZE1ldGhvZEV4Y2VwdGlvbihcImVuZENoYXQgaW4gQ2hhdENvbnRyb2xsZXJcIik7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZVxuICAgKiBAcmV0dXJuIFByb21pc2Ugb2JqZWN0IHdpdGhcbiAgICogIHN1Y2Nlc3MgPSB7XG4gICAqICAgICAgXCJzdGF0dXNDb2RlXCI6IDIwMCxcbiAgICogICAgICBcImRhdGFcIjoge30gLy8gZW1wdHkgb2JqZWN0PyBUT0RPXG4gICAqICB9XG4gICAqICBlcnJvciA9IHtcbiAgICogICAgICBcInN0YXR1c0NvZGVcIjogPGVycm9yQ29kZT4sXG4gICAqICAgICAgXCJleGNlcHRpb25cIjoge30gLy8gc29tZSBvYmplY3RcbiAgICogIH1cbiAgICovXG4gIHNlbmRFdmVudChldmVudFR5cGUpIHtcbiAgICB0aHJvdyBuZXcgVW5JbXBsZW1lbnRlZE1ldGhvZEV4Y2VwdGlvbihcInNlbmRFdmVudCBpbiBDaGF0Q29udHJvbGxlclwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge29iamVjdH0gYXJncyAvL1RPRE9cbiAgICogQHJldHVybiAvLyBUT0RPXG4gICAqL1xuICBnZXRUcmFuc2NyaXB0KGFyZ3MpIHtcbiAgICB0aHJvdyBuZXcgVW5JbXBsZW1lbnRlZE1ldGhvZEV4Y2VwdGlvbihcImdldFRyYW5zY3JpcHQgaW4gQ2hhdENvbnRyb2xsZXJcIik7XG4gIH1cblxuICBnZXRDb25uZWN0aW9uU3RhdHVzKCkge1xuICAgIHRocm93IG5ldyBVbkltcGxlbWVudGVkTWV0aG9kRXhjZXB0aW9uKFwiZ2V0U3RhdHVzIGluIENoYXRDb250cm9sbGVyXCIpO1xuICB9XG59XG4vKmVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMqL1xuXG5jbGFzcyBQZXJzaXN0ZW50Q29ubmVjdGlvbkFuZENoYXRTZXJ2aWNlQ29udHJvbGxlciBleHRlbmRzIENoYXRDb250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IoYXJncykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zZXRBcmd1bWVudHMoYXJncyk7XG4gIH1cblxuICBzZXRBcmd1bWVudHMoYXJncykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcHJlZml4ID0gXCJDb250YWN0SWQtXCIgKyBhcmdzLmNoYXREZXRhaWxzLmNvbnRhY3RJZCArIFwiOiBcIjtcbiAgICB0aGlzLmxvZ2dlciA9IExvZ01hbmFnZXIuZ2V0TG9nZ2VyKHtcbiAgICAgIHByZWZpeDogcHJlZml4XG4gICAgfSk7XG4gICAgdGhpcy5hcmdzVmFsaWRhdG9yID0gYXJncy5hcmdzVmFsaWRhdG9yO1xuICAgIHRoaXMuY2hhdEV2ZW50Q29uc3RydWN0b3IgPSBhcmdzLmNoYXRFdmVudENvbnN0cnVjdG9yO1xuICAgIHRoaXMuY29ubmVjdGlvbkRldGFpbHMgPSBhcmdzLmNoYXREZXRhaWxzLmNvbm5lY3Rpb25EZXRhaWxzO1xuICAgIHRoaXMuaW50aWFsQ29udGFjdElkID0gYXJncy5jaGF0RGV0YWlscy5pbml0aWFsQ29udGFjdElkO1xuICAgIHRoaXMuY29udGFjdElkID0gYXJncy5jaGF0RGV0YWlscy5jb250YWN0SWQ7XG4gICAgdGhpcy5wYXJ0aWNpcGFudElkID0gYXJncy5jaGF0RGV0YWlscy5wYXJ0aWNpcGFudElkO1xuICAgIHRoaXMuY2hhdENsaWVudCA9IGFyZ3MuY2hhdENsaWVudDtcbiAgICB0aGlzLnBhcnRpY2lwYW50VG9rZW4gPSBhcmdzLmNoYXREZXRhaWxzLnBhcnRpY2lwYW50VG9rZW47XG4gICAgdGhpcy5jb25uZWN0aW9uSGVscGVyQ2FsbGJhY2sgPSAoZXZlbnRUeXBlLCBldmVudERhdGEpID0+XG4gICAgICBzZWxmLl9oYW5kbGVDb25uZWN0aW9uSGVscGVyRXZlbnRzKGV2ZW50VHlwZSwgZXZlbnREYXRhKTtcbiAgICB0aGlzLl9oYXNDb25uZWN0aW9uRGV0YWlscyA9IGFyZ3MuaGFzQ29ubmVjdGlvbkRldGFpbHM7XG4gICAgdGhpcy5jaGF0Q29udHJvbGxlckZhY3RvcnkgPSBhcmdzLmNoYXRDb250cm9sbGVyRmFjdG9yeTtcbiAgICBpZiAoYXJncy5oYXNDb25uZWN0aW9uRGV0YWlscykge1xuICAgICAgdGhpcy5fc2V0Q29ubmVjdGlvbkhlbHBlcihcbiAgICAgICAgYXJncy5jaGF0RGV0YWlscy5jb25uZWN0aW9uRGV0YWlscyxcbiAgICAgICAgYXJncy5jaGF0RGV0YWlscy5jb250YWN0SWRcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuX2Nvbm5lY3RDYWxsZWRBdGxlYXN0T25jZSA9IGZhbHNlO1xuICAgIHRoaXMuX2V2ZXJDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnB1YnN1YiA9IGFyZ3MucHVic3ViO1xuICAgIHRoaXMuX3BhcnRpY2lwYW50RGlzY29ubmVjdGVkID0gZmFsc2U7XG4gIH1cblxuICBfc2V0Q29ubmVjdGlvbkhlbHBlcihjb25uZWN0aW9uRGV0YWlscywgY29udGFjdElkKSB7XG4gICAgdmFyIGNvbm5lY3Rpb25IZWxwZXJQcm92aWRlciA9IHRoaXMuY2hhdENvbnRyb2xsZXJGYWN0b3J5LmNyZWF0ZUNvbm5lY3Rpb25IZWxwZXJQcm92aWRlcihcbiAgICAgIGNvbm5lY3Rpb25EZXRhaWxzLFxuICAgICAgY29udGFjdElkXG4gICAgKTtcbiAgICB0aGlzLmNvbm5lY3Rpb25IZWxwZXIgPSBjb25uZWN0aW9uSGVscGVyUHJvdmlkZXIoXG4gICAgICB0aGlzLmNvbm5lY3Rpb25IZWxwZXJDYWxsYmFja1xuICAgICk7XG4gIH1cblxuICAvLyBEbyBhbnkgY2xlYW4gdXAgdGhhdCBuZWVkcyB0byBiZSBkb25lIHVwb24gdGhlIHBhcnRpY2lwYW50IGJlaW5nIGRpc2Nvbm5lY3RlZCBmcm9tIHRoZSBjaGF0IC1cbiAgLy8gZGlzY29ubmVjdGVkIGhlcmUgbWVhbnMgdGhhdCB0aGUgcGFydGljaXBhbnQgaXMgbm8gbG9uZ2VyIHBhcnQgb2YgdGhlciBjaGF0LlxuICBjbGVhblVwT25QYXJ0aWNpcGFudERpc2Nvbm5lY3QoKSB7XG4gICAgdGhpcy5wdWJzdWIudW5zdWJzY3JpYmVBbGwoKTtcbiAgICB0aGlzLmNvbm5lY3Rpb25IZWxwZXIgJiZcbiAgICAgIHRoaXMuY29ubmVjdGlvbkhlbHBlci5jbGVhblVwT25QYXJ0aWNpcGFudERpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIHN1YnNjcmliZShldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5wdWJzdWIuc3Vic2NyaWJlKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICAgIHRoaXMubG9nZ2VyLmluZm8oXCJTdWJzY3JpYmVkIHN1Y2Nlc3NmdWxseSB0byBldmVudE5hbWU6IFwiLCBldmVudE5hbWUpO1xuICB9XG5cbiAgc2VuZE1lc3NhZ2UoYXJncykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbWVzc2FnZSA9IGFyZ3MubWVzc2FnZTtcbiAgICB2YXIgdHlwZSA9IGFyZ3MudHlwZSB8fCBDT05URU5UX1RZUEUudGV4dFBsYWluO1xuICAgIHZhciBtZXRhZGF0YSA9IGFyZ3MubWV0YWRhdGEgfHwgbnVsbDtcbiAgICBzZWxmLmFyZ3NWYWxpZGF0b3IudmFsaWRhdGVTZW5kTWVzc2FnZShtZXNzYWdlLCB0eXBlKTtcbiAgICB2YXIgY29ubmVjdGlvblRva2VuID0gc2VsZi5jb25uZWN0aW9uRGV0YWlscy5jb25uZWN0aW9uVG9rZW47XG4gICAgcmV0dXJuIHNlbGYuY2hhdENsaWVudC5zZW5kTWVzc2FnZShjb25uZWN0aW9uVG9rZW4sIG1lc3NhZ2UsIHR5cGUpLnRoZW4oXG4gICAgICBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICByZXNwb25zZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICBzZWxmLmxvZ2dlci5kZWJ1ZyhcbiAgICAgICAgICBcIlN1Y2Nlc3NmdWxseSBzZW50IG1lc3NhZ2UsIHJlc3BvbnNlOiBcIixcbiAgICAgICAgICByZXNwb25zZSxcbiAgICAgICAgICBcIiByZXF1ZXN0OiBcIixcbiAgICAgICAgICBhcmdzXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBlcnJvci5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICBzZWxmLmxvZ2dlci5kZWJ1ZyhcbiAgICAgICAgICBcIkZhaWxlZCB0byBzZW5kIG1lc3NhZ2UsIGVycm9yOiBcIixcbiAgICAgICAgICBlcnJvcixcbiAgICAgICAgICBcIiByZXF1ZXN0OiBcIixcbiAgICAgICAgICBhcmdzXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHNlbmRFdmVudChhcmdzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBtZXRhZGF0YSA9IGFyZ3MubWV0YWRhdGEgfHwgbnVsbDtcbiAgICBzZWxmLmFyZ3NWYWxpZGF0b3IudmFsaWRhdGVTZW5kRXZlbnQoYXJncyk7XG4gICAgdmFyIGNvbm5lY3Rpb25Ub2tlbiA9IHNlbGYuY29ubmVjdGlvbkRldGFpbHMuY29ubmVjdGlvblRva2VuO1xuICAgIHZhciBwZXJzaXN0ZW5jZUFyZ3VtZW50ID0gYXJncy5wZXJzaXN0ZW5jZSB8fCBQRVJTSVNURU5DRS5QRVJTSVNURUQ7XG4gICAgdmFyIHZpc2liaWxpdHlBcmd1bWVudCA9IGFyZ3MudmlzaWJpbGl0eSB8fCBWSVNJQklMSVRZLkFMTDtcblxuICAgIHJldHVybiBzZWxmLmNoYXRDbGllbnRcbiAgICAgIC5zZW5kRXZlbnQoXG4gICAgICAgIGNvbm5lY3Rpb25Ub2tlbixcbiAgICAgICAgYXJncy5ldmVudFR5cGUsXG4gICAgICAgIGFyZ3MubWVzc2FnZUlkcyxcbiAgICAgICAgdmlzaWJpbGl0eUFyZ3VtZW50LFxuICAgICAgICBwZXJzaXN0ZW5jZUFyZ3VtZW50XG4gICAgICApXG4gICAgICAudGhlbihcbiAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICByZXNwb25zZS5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgIHNlbGYubG9nZ2VyLmRlYnVnKFxuICAgICAgICAgICAgXCJTdWNjZXNzZnVsbHkgc2VudCBldmVudCwgcmVzcG9uc2U6IFwiLFxuICAgICAgICAgICAgcmVzcG9uc2UsXG4gICAgICAgICAgICBcIiByZXF1ZXN0OiBcIixcbiAgICAgICAgICAgIGFyZ3NcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICBlcnJvci5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgIHNlbGYubG9nZ2VyLmRlYnVnKFxuICAgICAgICAgICAgXCJGYWlsZWQgdG8gc2VuZCBldmVudCwgZXJyb3I6IFwiLFxuICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICBcIiByZXF1ZXN0OiBcIixcbiAgICAgICAgICAgIGFyZ3NcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICk7XG4gIH1cblxuICBnZXRUcmFuc2NyaXB0KGlucHV0QXJncykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbWV0YWRhdGEgPSBpbnB1dEFyZ3MubWV0YWRhdGEgfHwgbnVsbDtcbiAgICB2YXIgYXJncyA9IHt9O1xuICAgIGFyZ3MuSW50aWFsQ29udGFjdElkID0gdGhpcy5pbnRpYWxDb250YWN0SWQ7XG4gICAgYXJncy5TdGFydEtleSA9IGlucHV0QXJncy5TdGFydEtleSB8fCB7fTtcbiAgICBhcmdzLlNjYW5EaXJlY3Rpb24gPVxuICAgICAgaW5wdXRBcmdzLlNjYW5EaXJlY3Rpb24gfHwgVFJBTlNDUklQVF9ERUZBVUxUX1BBUkFNUy5TQ0FOX0RJUkVDVElPTjtcbiAgICBhcmdzLlNvcnRLZXkgPSBpbnB1dEFyZ3MuU29ydEtleSB8fCBUUkFOU0NSSVBUX0RFRkFVTFRfUEFSQU1TLlNPUlRfS0VZO1xuICAgIGFyZ3MuTWF4UmVzdWx0cyA9XG4gICAgICBpbnB1dEFyZ3MuTWF4UmVzdWx0cyB8fCBUUkFOU0NSSVBUX0RFRkFVTFRfUEFSQU1TLk1BWF9SRVNVTFRTO1xuICAgIGlmIChpbnB1dEFyZ3MuTmV4dFRva2VuKSB7XG4gICAgICBhcmdzLk5leHRUb2tlbiA9IGlucHV0QXJncy5OZXh0VG9rZW47XG4gICAgfVxuICAgIHZhciBjb25uZWN0aW9uVG9rZW4gPSB0aGlzLmNvbm5lY3Rpb25EZXRhaWxzLmNvbm5lY3Rpb25Ub2tlbjtcbiAgICByZXR1cm4gdGhpcy5jaGF0Q2xpZW50LmdldFRyYW5zY3JpcHQoY29ubmVjdGlvblRva2VuLCBhcmdzKS50aGVuKFxuICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgcmVzcG9uc2UubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgc2VsZi5sb2dnZXIuZGVidWcoXG4gICAgICAgICAgXCJTdWNjZXNzZnVsbHkgcmV0cmlldmVkIHRyYW5zY3JpcHQsIHJlc3BvbnNlOiBcIixcbiAgICAgICAgICByZXNwb25zZSxcbiAgICAgICAgICBcIiByZXF1ZXN0OiBcIixcbiAgICAgICAgICBhcmdzXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBlcnJvci5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICBzZWxmLmxvZ2dlci5kZWJ1ZyhcbiAgICAgICAgICBcIkZhaWxlZCB0byByZXRyaWV2ZSB0cmFuc2NyaXB0LCBlcnJvcjogXCIsXG4gICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgXCIgcmVxdWVzdDogXCIsXG4gICAgICAgICAgYXJnc1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBfaGFuZGxlQ29ubmVjdGlvbkhlbHBlckV2ZW50cyhldmVudFR5cGUsIGV2ZW50RGF0YSkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgY2hhdEV2ZW50ID0gdGhpcy5jaGF0RXZlbnRDb25zdHJ1Y3Rvci5mcm9tQ29ubmVjdGlvbkhlbHBlckV2ZW50KFxuICAgICAgICBldmVudFR5cGUsXG4gICAgICAgIGV2ZW50RGF0YSxcbiAgICAgICAgdGhpcy5nZXRDaGF0RGV0YWlscygpLFxuICAgICAgICB0aGlzLmxvZ2dlclxuICAgICAgKTtcbiAgICB9IGNhdGNoIChleGMpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmVycm9yKFxuICAgICAgICBcIkVycm9yIG9jY3VyZWQgd2hpbGUgaGFuZGxpbmcgZXZlbnQgZnJvbSBDb25uZWN0aW9uLiBldmVudFR5cGUgYW5kIGV2ZW50RGF0YTogXCIsXG4gICAgICAgIGV2ZW50VHlwZSxcbiAgICAgICAgZXZlbnREYXRhLFxuICAgICAgICBcIiBDYXVzaW5nIGV4Y2VwdGlvbjogXCIsXG4gICAgICAgIGV4Y1xuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5sb2dnZXIuZGVidWcoXCJUcmlnZ2VyaW5nIGV2ZW50IGZvciBzdWJzY3JpYmVyczpcIiwgY2hhdEV2ZW50KTtcbiAgICB0aGlzLnB1YnN1Yi50cmlnZ2VyQXN5bmMoY2hhdEV2ZW50LnR5cGUsIGNoYXRFdmVudC5kYXRhKTtcbiAgfVxuXG4gIGNvbm5lY3QoaW5wdXRBcmdzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBhcmdzID0gaW5wdXRBcmdzIHx8IHt9O1xuICAgIHZhciBtZXRhZGF0YSA9IGFyZ3MubWV0YWRhdGEgfHwgbnVsbDtcbiAgICB0aGlzLmFyZ3NWYWxpZGF0b3IudmFsaWRhdGVDb25uZWN0Q2hhdChhcmdzKTtcbiAgICBpZiAoXG4gICAgICBzZWxmLmdldENvbm5lY3Rpb25TdGF0dXMoKSAhPT0gTmV0d29ya0xpbmtTdGF0dXMuQnJva2VuICYmXG4gICAgICBzZWxmLmdldENvbm5lY3Rpb25TdGF0dXMoKSAhPT0gTmV0d29ya0xpbmtTdGF0dXMuTmV2ZXJFc3RhYmxpc2hlZFxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IElsbGVnYWxTdGF0ZUV4Y2VwdGlvbihcbiAgICAgICAgXCJDYW4gY2FsbCBlc3RhYmxpc2hOZXR3b3JrTGluayBvbmx5IHdoZW4gZ2V0Q29ubmVjdGlvblN0YXR1cyBpcyBCcm9rZW4gb3IgTmV2ZXJFc3RhYmxpc2hlZFwiXG4gICAgICApO1xuICAgIH1cbiAgICB2YXIgX29uU3VjY2VzcyA9IHJlc3BvbnNlID0+IHNlbGYuX29uQ29ubmVjdFN1Y2Nlc3MocmVzcG9uc2UsIG1ldGFkYXRhKTtcbiAgICB2YXIgX29uRmFpbHVyZSA9IGVycm9yID0+IHNlbGYuX29uQ29ubmVjdEZhaWx1cmUoZXJyb3IsIG1ldGFkYXRhKTtcbiAgICBzZWxmLl9jb25uZWN0Q2FsbGVkQXRsZWFzdE9uY2UgPSB0cnVlO1xuICAgIGlmIChzZWxmLl9oYXNDb25uZWN0aW9uRGV0YWlscykge1xuICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbkhlbHBlci5zdGFydCgpLnRoZW4oX29uU3VjY2VzcywgX29uRmFpbHVyZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZWxmXG4gICAgICAgIC5fZmV0Y2hDb25uZWN0aW9uRGV0YWlscygpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGNvbm5lY3Rpb25EZXRhaWxzKSB7XG4gICAgICAgICAgc2VsZi5fc2V0Q29ubmVjdGlvbkhlbHBlcihjb25uZWN0aW9uRGV0YWlscywgc2VsZi5jb250YWN0SWQpO1xuICAgICAgICAgIHNlbGYuY29ubmVjdGlvbkRldGFpbHMgPSBjb25uZWN0aW9uRGV0YWlscztcbiAgICAgICAgICBzZWxmLl9oYXNDb25uZWN0aW9uRGV0YWlscyA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuY29ubmVjdGlvbkhlbHBlci5zdGFydCgpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihfb25TdWNjZXNzLCBfb25GYWlsdXJlKTtcbiAgICB9XG4gIH1cblxuICBfb25Db25uZWN0U3VjY2VzcyhyZXNwb25zZSwgbWV0YWRhdGEpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5sb2dnZXIuaW5mbyhcIkNvbm5lY3Qgc3VjY2Vzc2Z1bCFcIik7XG4gICAgdmFyIHJlc3BvbnNlT2JqZWN0ID0ge1xuICAgICAgX2RlYnVnOiByZXNwb25zZSxcbiAgICAgIGNvbm5lY3RTdWNjZXNzOiB0cnVlLFxuICAgICAgY29ubmVjdENhbGxlZDogdHJ1ZSxcbiAgICAgIG1ldGFkYXRhOiBtZXRhZGF0YVxuICAgIH07XG4gICAgdmFyIGV2ZW50RGF0YSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7XG4gICAgICAgIGNoYXREZXRhaWxzOiBzZWxmLmdldENoYXREZXRhaWxzKClcbiAgICAgIH0sXG4gICAgICByZXNwb25zZU9iamVjdFxuICAgICk7XG4gICAgdGhpcy5wdWJzdWIudHJpZ2dlckFzeW5jKENIQVRfRVZFTlRTLkNPTk5FQ1RJT05fRVNUQUJMSVNIRUQsIGV2ZW50RGF0YSk7XG4gICAgcmV0dXJuIHJlc3BvbnNlT2JqZWN0O1xuICB9XG5cbiAgX29uQ29ubmVjdEZhaWx1cmUoZXJyb3IsIG1ldGFkYXRhKSB7XG4gICAgdmFyIGVycm9yT2JqZWN0ID0ge1xuICAgICAgX2RlYnVnOiBlcnJvcixcbiAgICAgIGNvbm5lY3RTdWNjZXNzOiBmYWxzZSxcbiAgICAgIGNvbm5lY3RDYWxsZWQ6IHRydWUsXG4gICAgICBtZXRhZGF0YTogbWV0YWRhdGFcbiAgICB9O1xuICAgIHRoaXMubG9nZ2VyLmVycm9yKFwiQ29ubmVjdCBGYWlsZWQgd2l0aCBkYXRhOiBcIiwgZXJyb3JPYmplY3QpO1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvck9iamVjdCk7XG4gIH1cblxuICBfZmV0Y2hDb25uZWN0aW9uRGV0YWlscygpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHNlbGYuY2hhdENsaWVudC5jcmVhdGVDb25uZWN0aW9uRGV0YWlscyhzZWxmLnBhcnRpY2lwYW50VG9rZW4pLnRoZW4oXG4gICAgICBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICB2YXIgY29ubmVjdGlvbkRldGFpbHMgPSB7fTtcbiAgICAgICAgY29ubmVjdGlvbkRldGFpbHMuQ29ubmVjdGlvbklkID0gcmVzcG9uc2UuZGF0YS5Db25uZWN0aW9uSWQ7XG4gICAgICAgIGNvbm5lY3Rpb25EZXRhaWxzLlByZVNpZ25lZENvbm5lY3Rpb25VcmwgPVxuICAgICAgICAgIHJlc3BvbnNlLmRhdGEuUHJlU2lnbmVkQ29ubmVjdGlvblVybDtcbiAgICAgICAgY29ubmVjdGlvbkRldGFpbHMuY29ubmVjdGlvblRva2VuID1cbiAgICAgICAgICByZXNwb25zZS5kYXRhLlBhcnRpY2lwYW50Q3JlZGVudGlhbHMuQ29ubmVjdGlvbkF1dGhlbnRpY2F0aW9uVG9rZW47XG4gICAgICAgIHJldHVybiBjb25uZWN0aW9uRGV0YWlscztcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe1xuICAgICAgICAgIHJlYXNvbjogXCJGYWlsZWQgdG8gZmV0Y2ggY29ubmVjdGlvbkRldGFpbHNcIixcbiAgICAgICAgICBfZGVidWc6IGVycm9yXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBicmVha0Nvbm5lY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbkhlbHBlci5lbmQoKTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3RQYXJ0aWNpcGFudCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGNvbm5lY3Rpb25Ub2tlbiA9IHNlbGYuY29ubmVjdGlvbkRldGFpbHMuY29ubmVjdGlvblRva2VuO1xuICAgIHJldHVybiBzZWxmLmNoYXRDbGllbnQuZGlzY29ubmVjdENoYXQoY29ubmVjdGlvblRva2VuKS50aGVuKFxuICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgc2VsZi5sb2dnZXIuaW5mbyhcImRpc2Nvbm5lY3QgcGFydGljaXBhbnQgc3VjY2Vzc2Z1bFwiKTtcbiAgICAgICAgc2VsZi5fcGFydGljaXBhbnREaXNjb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgc2VsZi5sb2dnZXIuZXJyb3IoXCJkaXNjb25uZWN0IHBhcnRpY2lwYW50IGZhaWxlZCB3aXRoIGVycm9yOiBcIiwgZXJyb3IpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBnZXRDaGF0RGV0YWlscygpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludGlhbENvbnRhY3RJZDogc2VsZi5pbnRpYWxDb250YWN0SWQsXG4gICAgICBjb250YWN0SWQ6IHNlbGYuY29udGFjdElkLFxuICAgICAgcGFydGljaXBhbnRJZDogc2VsZi5wYXJ0aWNpcGFudElkLFxuICAgICAgcGFydGljaXBhbnRUb2tlbjogc2VsZi5wYXJ0aWNpcGFudFRva2VuLFxuICAgICAgY29ubmVjdGlvbkRldGFpbHM6IHNlbGYuY29ubmVjdGlvbkRldGFpbHNcbiAgICB9O1xuICB9XG5cbiAgX2NvbnZlcnRDb25uZWN0aW9uSGVscGVyU3RhdHVzKGNvbm5lY3Rpb25IZWxwZXJTdGF0dXMpIHtcbiAgICBzd2l0Y2ggKGNvbm5lY3Rpb25IZWxwZXJTdGF0dXMpIHtcbiAgICAgIGNhc2UgQ29ubmVjdGlvbkhlbHBlclN0YXR1cy5OZXZlclN0YXJ0ZWQ6XG4gICAgICAgIHJldHVybiBOZXR3b3JrTGlua1N0YXR1cy5OZXZlckVzdGFibGlzaGVkO1xuICAgICAgY2FzZSBDb25uZWN0aW9uSGVscGVyU3RhdHVzLlN0YXJ0aW5nOlxuICAgICAgICByZXR1cm4gTmV0d29ya0xpbmtTdGF0dXMuRXN0YWJsaXNoaW5nO1xuICAgICAgY2FzZSBDb25uZWN0aW9uSGVscGVyU3RhdHVzLkVuZGVkOlxuICAgICAgICByZXR1cm4gTmV0d29ya0xpbmtTdGF0dXMuQnJva2VuO1xuICAgICAgY2FzZSBDb25uZWN0aW9uSGVscGVyU3RhdHVzLkNvbm5lY3RlZDpcbiAgICAgICAgcmV0dXJuIE5ldHdvcmtMaW5rU3RhdHVzLkVzdGFibGlzaGVkO1xuICAgICAgY2FzZSBDb25uZWN0aW9uSGVscGVyU3RhdHVzLkRpc2Nvbm5lY3RlZFJlY29ubmVjdGluZzpcbiAgICAgICAgcmV0dXJuIE5ldHdvcmtMaW5rU3RhdHVzLkJyb2tlblJldHJ5aW5nO1xuICAgIH1cbiAgICBzZWxmLmxvZ2dlci5lcnJvcihcbiAgICAgIFwiUmVhY2hlZCBpbnZhbGlkIHN0YXRlLiBVbmtub3duIGNvbm5lY3Rpb25IZWxwZXJTdGF0dXM6IFwiLFxuICAgICAgY29ubmVjdGlvbkhlbHBlclN0YXR1c1xuICAgICk7XG4gIH1cblxuICBnZXRDb25uZWN0aW9uU3RhdHVzKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIXNlbGYuX2hhc0Nvbm5lY3Rpb25EZXRhaWxzKSB7XG4gICAgICByZXR1cm4gTmV0d29ya0xpbmtTdGF0dXMuTmV2ZXJFc3RhYmxpc2hlZDtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGYuX2NvbnZlcnRDb25uZWN0aW9uSGVscGVyU3RhdHVzKFxuICAgICAgc2VsZi5jb25uZWN0aW9uSGVscGVyLmdldFN0YXR1cygpXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgeyBQZXJzaXN0ZW50Q29ubmVjdGlvbkFuZENoYXRTZXJ2aWNlQ29udHJvbGxlciB9O1xuIiwiaW1wb3J0IHtcbiAgVW5JbXBsZW1lbnRlZE1ldGhvZEV4Y2VwdGlvbixcbiAgSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9uXG59IGZyb20gXCIuL2V4Y2VwdGlvbnNcIjtcbmltcG9ydCB7IENoYXRDbGllbnRGYWN0b3J5IH0gZnJvbSBcIi4uL2NsaWVudC9jbGllbnRcIjtcbmltcG9ydCB7IENoYXRTZXJ2aWNlQXJnc1ZhbGlkYXRvciB9IGZyb20gXCIuL2NoYXRBcmdzVmFsaWRhdG9yXCI7XG5pbXBvcnQgeyBDaGF0Q29ubmVjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi9jb25uZWN0aW9uTWFuYWdlclwiO1xuaW1wb3J0IHsgU29sb0NoYXRDb25uZWN0aW9uTXF0dEhlbHBlciB9IGZyb20gXCIuL2Nvbm5lY3Rpb25IZWxwZXJcIjtcbmltcG9ydCB7IFNFU1NJT05fVFlQRVMsIENIQVRfRVZFTlRTIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgRXZlbnRDb25zdHJ1Y3RvciB9IGZyb20gXCIuL2V2ZW50Q29uc3RydWN0b3JcIjtcbmltcG9ydCB7IEV2ZW50QnVzIH0gZnJvbSBcIi4vZXZlbnRidXNcIjtcbmltcG9ydCB7IEdsb2JhbENvbmZpZyB9IGZyb20gXCIuLi9nbG9iYWxDb25maWdcIjtcblxuaW1wb3J0IHsgUGVyc2lzdGVudENvbm5lY3Rpb25BbmRDaGF0U2VydmljZUNvbnRyb2xsZXIgfSBmcm9tIFwiLi9jaGF0Q29udHJvbGxlclwiO1xuaW1wb3J0IHsgTG9nTWFuYWdlciB9IGZyb20gXCIuLi9sb2dcIjtcblxuY2xhc3MgQ2hhdFNlc3Npb25GYWN0b3J5IHtcbiAgLyplc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyovXG5cbiAgY3JlYXRlQWdlbnRDaGF0Q29udHJvbGxlcihjaGF0RGV0YWlscywgcGFydGljaXBhbnRUeXBlKSB7XG4gICAgdGhyb3cgbmV3IFVuSW1wbGVtZW50ZWRNZXRob2RFeGNlcHRpb24oXG4gICAgICBcImNyZWF0ZUFnZW50Q2hhdENvbnRyb2xsZXIgaW4gQ2hhdENvbnRyb2xsZXJGYWN0b3J5LlwiXG4gICAgKTtcbiAgfVxuXG4gIGNyZWF0ZUN1c3RvbWVyQ2hhdENvbnRyb2xsZXIoY2hhdERldGFpbHMsIHBhcnRpY2lwYW50VHlwZSkge1xuICAgIHRocm93IG5ldyBVbkltcGxlbWVudGVkTWV0aG9kRXhjZXB0aW9uKFxuICAgICAgXCJjcmVhdGVDdXN0b21lckNoYXRDb250cm9sbGVyIGluIENoYXRDb250cm9sbGVyRmFjdG9yeS5cIlxuICAgICk7XG4gIH1cblxuICBjcmVhdGVDb25uZWN0aW9uSGVscGVyUHJvdmlkZXIoY29ubmVjdGlvbkRldGFpbHMpIHtcbiAgICB0aHJvdyBuZXcgVW5JbXBsZW1lbnRlZE1ldGhvZEV4Y2VwdGlvbihcbiAgICAgIFwiY3JlYXRlSW5jb21pbmdDaGF0Q29udHJvbGxlciBpbiBDaGF0Q29udHJvbGxlckZhY3RvcnlcIlxuICAgICk7XG4gIH1cbiAgLyplc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzKi9cbn1cblxuY2xhc3MgUGVyc2lzdGVudENvbm5lY3Rpb25BbmRDaGF0U2VydmljZVNlc3Npb25GYWN0b3J5IGV4dGVuZHMgQ2hhdFNlc3Npb25GYWN0b3J5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmFyZ3NWYWxpZGF0b3IgPSBuZXcgQ2hhdFNlcnZpY2VBcmdzVmFsaWRhdG9yKCk7XG4gICAgdGhpcy5jaGF0Q29ubmVjdGlvbk1hbmFnZXIgPSBuZXcgQ2hhdENvbm5lY3Rpb25NYW5hZ2VyKCk7XG4gICAgdGhpcy5jaGF0RXZlbnRDb25zdHJ1Y3RvciA9IG5ldyBFdmVudENvbnN0cnVjdG9yKCk7XG4gIH1cblxuICBjcmVhdGVBZ2VudENoYXRTZXNzaW9uKGNoYXREZXRhaWxzLCBvcHRpb25zKSB7XG4gICAgdmFyIGNoYXRDb250cm9sbGVyID0gdGhpcy5fY3JlYXRlQ2hhdFNlc3Npb24oY2hhdERldGFpbHMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBuZXcgQWdlbnRDaGF0U2Vzc2lvbihjaGF0Q29udHJvbGxlcik7XG4gIH1cblxuICBjcmVhdGVDdXN0b21lckNoYXRTZXNzaW9uKGNoYXREZXRhaWxzLCBvcHRpb25zKSB7XG4gICAgdmFyIGNoYXRDb250cm9sbGVyID0gdGhpcy5fY3JlYXRlQ2hhdFNlc3Npb24oY2hhdERldGFpbHMsIG9wdGlvbnMpO1xuICAgIHJldHVybiBuZXcgQ3VzdG9tZXJDaGF0U2Vzc2lvbihjaGF0Q29udHJvbGxlcik7XG4gIH1cblxuICBfY3JlYXRlQ2hhdFNlc3Npb24oY2hhdERldGFpbHNJbnB1dCwgb3B0aW9ucykge1xuICAgIHZhciBjaGF0RGV0YWlscyA9IHRoaXMuX25vcm1hbGl6ZUNoYXREZXRhaWxzKGNoYXREZXRhaWxzSW5wdXQpO1xuICAgIHZhciBoYXNDb25uZWN0aW9uRGV0YWlscyA9IGZhbHNlO1xuICAgIGlmIChjaGF0RGV0YWlscy5jb25uZWN0aW9uRGV0YWlscykge1xuICAgICAgaGFzQ29ubmVjdGlvbkRldGFpbHMgPSB0cnVlO1xuICAgIH1cbiAgICB2YXIgYXJncyA9IHtcbiAgICAgIGNoYXREZXRhaWxzOiBjaGF0RGV0YWlscyxcbiAgICAgIGNoYXRDb250cm9sbGVyRmFjdG9yeTogdGhpcyxcbiAgICAgIGNoYXRFdmVudENvbnN0cnVjdG9yOiB0aGlzLmNoYXRFdmVudENvbnN0cnVjdG9yLFxuICAgICAgcHVic3ViOiBuZXcgRXZlbnRCdXMoKSxcbiAgICAgIGNoYXRDbGllbnQ6IENoYXRDbGllbnRGYWN0b3J5LmdldENhY2hlZENsaWVudChvcHRpb25zKSxcbiAgICAgIGFyZ3NWYWxpZGF0b3I6IHRoaXMuYXJnc1ZhbGlkYXRvcixcbiAgICAgIGhhc0Nvbm5lY3Rpb25EZXRhaWxzOiBoYXNDb25uZWN0aW9uRGV0YWlsc1xuICAgIH07XG4gICAgcmV0dXJuIG5ldyBQZXJzaXN0ZW50Q29ubmVjdGlvbkFuZENoYXRTZXJ2aWNlQ29udHJvbGxlcihhcmdzKTtcbiAgfVxuXG4gIF9ub3JtYWxpemVDaGF0RGV0YWlscyhjaGF0RGV0YWlsc0lucHV0KSB7XG4gICAgaWYgKFxuICAgICAgY2hhdERldGFpbHNJbnB1dC5DaGF0Q29ubmVjdGlvbkF0dHJpYnV0ZXMgJiZcbiAgICAgIGNoYXREZXRhaWxzSW5wdXQuQ2hhdENvbm5lY3Rpb25BdHRyaWJ1dGVzLlBhcnRpY2lwYW50Q3JlZGVudGlhbHNcbiAgICApIHtcbiAgICAgIHRoaXMuYXJnc1ZhbGlkYXRvci52YWxpZGF0ZUluaXRpYXRlQ2hhdFJlc3BvbnNlKGNoYXREZXRhaWxzSW5wdXQpO1xuICAgICAgdmFyIGNoYXREZXRhaWxzID0ge307XG4gICAgICB2YXIgY29ubmVjdGlvbkRldGFpbHMgPSB7fTtcbiAgICAgIGNvbm5lY3Rpb25EZXRhaWxzLmNvbm5lY3Rpb25Ub2tlbiA9XG4gICAgICAgIGNoYXREZXRhaWxzSW5wdXQuQ2hhdENvbm5lY3Rpb25BdHRyaWJ1dGVzLlBhcnRpY2lwYW50Q3JlZGVudGlhbHMuQ29ubmVjdGlvbkF1dGhlbnRpY2F0aW9uVG9rZW47XG4gICAgICBjb25uZWN0aW9uRGV0YWlscy5Db25uZWN0aW9uSWQgPVxuICAgICAgICBjaGF0RGV0YWlsc0lucHV0LkNoYXRDb25uZWN0aW9uQXR0cmlidXRlcy5Db25uZWN0aW9uSWQ7XG4gICAgICBjb25uZWN0aW9uRGV0YWlscy5QcmVTaWduZWRDb25uZWN0aW9uVXJsID1cbiAgICAgICAgY2hhdERldGFpbHNJbnB1dC5DaGF0Q29ubmVjdGlvbkF0dHJpYnV0ZXMuUHJlU2lnbmVkQ29ubmVjdGlvblVybDtcbiAgICAgIGNoYXREZXRhaWxzLmNvbm5lY3Rpb25EZXRhaWxzID0gY29ubmVjdGlvbkRldGFpbHM7XG4gICAgICBjaGF0RGV0YWlscy5wYXJ0aWNpcGFudElkID0gY2hhdERldGFpbHNJbnB1dC5QYXJ0aWNpcGFudElkO1xuICAgICAgY2hhdERldGFpbHMuY29udGFjdElkID0gY2hhdERldGFpbHNJbnB1dC5Db250YWN0SWQ7XG4gICAgICBjaGF0RGV0YWlscy5pbml0aWFsQ29udGFjdElkID0gY2hhdERldGFpbHNJbnB1dC5Db250YWN0SWQ7XG4gICAgICByZXR1cm4gY2hhdERldGFpbHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXJnc1ZhbGlkYXRvci52YWxpZGF0ZUNoYXREZXRhaWxzKGNoYXREZXRhaWxzSW5wdXQpO1xuICAgICAgcmV0dXJuIGNoYXREZXRhaWxzSW5wdXQ7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlQ29ubmVjdGlvbkhlbHBlclByb3ZpZGVyKGNvbm5lY3Rpb25EZXRhaWxzLCBjb250YWN0SWQpIHtcbiAgICAvL2xhdGVyIHJldHVybiBiYXNlZCBvbiB0aGUgdHlwZSBhcmd1bWVudFxuICAgIHZhciBjb25uZWN0aW9uQXJncyA9IHtcbiAgICAgIHByZVNpZ25lZFVybDogY29ubmVjdGlvbkRldGFpbHMuUHJlU2lnbmVkQ29ubmVjdGlvblVybCxcbiAgICAgIGNvbm5lY3Rpb25JZDogY29ubmVjdGlvbkRldGFpbHMuQ29ubmVjdGlvbklkLFxuICAgICAgbWF4UmV0cnlUaW1lOiAxMjAgLy8gbm90IHVzZWQgcmlnaHQgbm93IGFueXdheXMuXG4gICAgfTtcbiAgICB2YXIgbXF0dENvbm5lY3Rpb25Qcm92aWRlciA9IHRoaXMuY2hhdENvbm5lY3Rpb25NYW5hZ2VyLmNyZWF0ZU5ld01xdHRDb25uZWN0aW9uUHJvdmlkZXIoXG4gICAgICBjb25uZWN0aW9uQXJncyxcbiAgICAgIFwiUGFob01xdHRDb25uZWN0aW9uXCJcbiAgICApO1xuICAgIHZhciBhcmdzID0ge1xuICAgICAgbXF0dENvbm5lY3Rpb25Qcm92aWRlcjogbXF0dENvbm5lY3Rpb25Qcm92aWRlcixcbiAgICAgIGNvbm5lY3Rpb25EZXRhaWxzOiB7XG4gICAgICAgIHByZVNpZ25lZFVybDogY29ubmVjdGlvbkRldGFpbHMuUHJlU2lnbmVkQ29ubmVjdGlvblVybCxcbiAgICAgICAgY29ubmVjdGlvbklkOiBjb25uZWN0aW9uRGV0YWlscy5Db25uZWN0aW9uSWRcbiAgICAgIH0sXG4gICAgICBjb250YWN0SWQ6IGNvbnRhY3RJZFxuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICBhcmdzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICByZXR1cm4gbmV3IFNvbG9DaGF0Q29ubmVjdGlvbk1xdHRIZWxwZXIoYXJncyk7XG4gICAgfTtcbiAgfVxufVxuXG5jbGFzcyBDaGF0U2Vzc2lvbiB7XG4gIGNvbnN0cnVjdG9yKGNvbnRyb2xsZXIpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuICB9XG5cbiAgb25NZXNzYWdlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnN1YnNjcmliZShDSEFUX0VWRU5UUy5JTkNPTUlOR19NRVNTQUdFLCBjYWxsYmFjayk7XG4gIH1cblxuICBvblR5cGluZyhjYWxsYmFjaykge1xuICAgIHRoaXMuY29udHJvbGxlci5zdWJzY3JpYmUoQ0hBVF9FVkVOVFMuSU5DT01JTkdfVFlQSU5HLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbkNvbm5lY3Rpb25Ccm9rZW4oY2FsbGJhY2spIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIuc3Vic2NyaWJlKENIQVRfRVZFTlRTLkNPTk5FQ1RJT05fQlJPS0VOLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbkNvbm5lY3Rpb25Fc3RhYmxpc2hlZChjYWxsYmFjaykge1xuICAgIHRoaXMuY29udHJvbGxlci5zdWJzY3JpYmUoQ0hBVF9FVkVOVFMuQ09OTkVDVElPTl9FU1RBQkxJU0hFRCwgY2FsbGJhY2spO1xuICB9XG5cbiAgc2VuZE1lc3NhZ2UoYXJncykge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIuc2VuZE1lc3NhZ2UoYXJncyk7XG4gIH1cblxuICBjb25uZWN0KGFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLmNvbm5lY3QoYXJncyk7XG4gIH1cblxuICBzZW5kRXZlbnQoYXJncykge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIuc2VuZEV2ZW50KGFyZ3MpO1xuICB9XG5cbiAgZ2V0VHJhbnNjcmlwdChhcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci5nZXRUcmFuc2NyaXB0KGFyZ3MpO1xuICB9XG5cbiAgZ2V0Q29ubmVjdGlvblN0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyLmdldENvbm5lY3Rpb25TdGF0dXMoKTtcbiAgfVxuXG4gIGdldENoYXREZXRhaWxzKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIuZ2V0Q2hhdERldGFpbHMoKTtcbiAgfVxufVxuXG5jbGFzcyBBZ2VudENoYXRTZXNzaW9uIGV4dGVuZHMgQ2hhdFNlc3Npb24ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyKSB7XG4gICAgc3VwZXIoY29udHJvbGxlcik7XG4gIH1cblxuICBjbGVhblVwT25QYXJ0aWNpcGFudERpc2Nvbm5lY3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlci5jbGVhblVwT25QYXJ0aWNpcGFudERpc2Nvbm5lY3QoKTtcbiAgfVxufVxuXG5jbGFzcyBDdXN0b21lckNoYXRTZXNzaW9uIGV4dGVuZHMgQ2hhdFNlc3Npb24ge1xuICBjb25zdHJ1Y3Rvcihjb250cm9sbGVyKSB7XG4gICAgc3VwZXIoY29udHJvbGxlcik7XG4gIH1cblxuICBkaXNjb25uZWN0UGFydGljaXBhbnQoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXIuZGlzY29ubmVjdFBhcnRpY2lwYW50KCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgc2VsZi5jb250cm9sbGVyLmNsZWFuVXBPblBhcnRpY2lwYW50RGlzY29ubmVjdCgpO1xuICAgICAgc2VsZi5jb250cm9sbGVyLmJyZWFrQ29ubmVjdGlvbigpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IENIQVRfU0VTU0lPTl9GQUNUT1JZID0gbmV3IFBlcnNpc3RlbnRDb25uZWN0aW9uQW5kQ2hhdFNlcnZpY2VTZXNzaW9uRmFjdG9yeSgpO1xuXG52YXIgc2V0R2xvYmFsQ29uZmlnID0gY29uZmlnID0+IHtcbiAgdmFyIGxvZ2dlckNvbmZpZyA9IGNvbmZpZy5sb2dnZXJDb25maWc7XG4gIEdsb2JhbENvbmZpZy51cGRhdGUoY29uZmlnKTtcbiAgTG9nTWFuYWdlci51cGRhdGVMb2dnZXJDb25maWcobG9nZ2VyQ29uZmlnKTtcbn07XG5cbnZhciBDaGF0U2Vzc2lvbkNvbnN0cnVjdG9yID0gYXJncyA9PiB7XG4gIHZhciBvcHRpb25zID0gYXJncy5vcHRpb25zIHx8IHt9O1xuICB2YXIgdHlwZSA9IGFyZ3MudHlwZSB8fCBTRVNTSU9OX1RZUEVTLkFHRU5UO1xuICBpZiAodHlwZSA9PT0gU0VTU0lPTl9UWVBFUy5BR0VOVCkge1xuICAgIHJldHVybiBDSEFUX1NFU1NJT05fRkFDVE9SWS5jcmVhdGVBZ2VudENoYXRTZXNzaW9uKFxuICAgICAgYXJncy5jaGF0RGV0YWlscyxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09IFNFU1NJT05fVFlQRVMuQ1VTVE9NRVIpIHtcbiAgICByZXR1cm4gQ0hBVF9TRVNTSU9OX0ZBQ1RPUlkuY3JlYXRlQ3VzdG9tZXJDaGF0U2Vzc2lvbihcbiAgICAgIGFyZ3MuY2hhdERldGFpbHMsXG4gICAgICBvcHRpb25zXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9uKFxuICAgICAgXCJVbmtvd24gdmFsdWUgZm9yIHNlc3Npb24gdHlwZSwgQWxsb3dlZCB2YWx1ZXMgYXJlOiBcIiArXG4gICAgICAgIE9iamVjdC52YWx1ZXMoU0VTU0lPTl9UWVBFUyksXG4gICAgICB0eXBlXG4gICAgKTtcbiAgfVxufTtcblxuY29uc3QgQ2hhdFNlc3Npb25PYmplY3QgPSB7XG4gIGNyZWF0ZTogQ2hhdFNlc3Npb25Db25zdHJ1Y3RvcixcbiAgc2V0R2xvYmFsQ29uZmlnOiBzZXRHbG9iYWxDb25maWdcbn07XG5cbmV4cG9ydCB7IENoYXRTZXNzaW9uT2JqZWN0IH07XG4iLCJpbXBvcnQge1xuICBVbkltcGxlbWVudGVkTWV0aG9kRXhjZXB0aW9uLFxuICBJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb24sXG4gIElsbGVnYWxTdGF0ZUV4Y2VwdGlvblxufSBmcm9tIFwiLi9leGNlcHRpb25zXCI7XG5pbXBvcnQgeyBNcXR0Q29ubmVjdGlvblN0YXR1cywgTXF0dEV2ZW50cyB9IGZyb20gXCIuL2Nvbm5lY3Rpb25NYW5hZ2VyXCI7XG5pbXBvcnQgeyBNUVRUX0NPTlNUQU5UUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IExvZ01hbmFnZXIgfSBmcm9tIFwiLi4vbG9nXCI7XG5cbi8qKlxuICogVGhpcyBjbGFzcyBpcyB1c2VkIGZvciBlc3RhYmxpc2hpbmcgYSBjb25uZWN0aW9uIGZvciB0aGUgY2hhdC5cbiAqIFRoZSBvYmplY3Qgb2YgdGhpcyBjbGFzcyBjYW4gb25seSBiZSBzdGFydGVkIG9uY2UgYW5kIGNhbiBvbmx5IGJlIGNsb3NlZCBvbmNlLlxuICogSWYgdGhlIGNvbm5lY3Rpb24gZmFpbHMgdG8gZXN0YWJsaXNoLCBvciBpZiBpdCBlbmRzIGFicnVwdGx5IGR1ZSB0b1xuICogIGRvd25zdHJlYW0gaXNzdWVzLCBvciBpdCBpcyBlbmRlZCBleHBsaWNpdGx5IGJ5IGNhbGxpbmcgZW5kKClcbiAqICB0aGVuIHRoaXMgb2JqZWN0IGNhbiBubyBsb25nZXIgYmUgdXNlZC4gQSBuZXcgb2JqZWN0IG11c3QgYmUgY3JlYXRlZCB0byBjYWxsIHN0YXJ0IGFnYWluLlxuICogc3RhcnQoKSBhdHRlbXB0cyB0byBzdGFydCBhIGNvbm5lY3Rpb24uXG4gKi9cbi8qZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMqL1xuY2xhc3MgQ29ubmVjdGlvbkhlbHBlciB7XG4gIC8qKlxuICAgKiAgIHJldHVybnMgUHJvbWlzZSBvYmplY3Qgd2l0aFxuICAgKiAgICAgICByZXNwb25zZSA9IHtcbiAgICogICAgICAgICBjb25uZWN0U3VjY2VzczogdHJ1ZSxcbiAgICogICAgICAgICBkZXRhaWxzOiB7fSAvLyBJbXBsZW1lbnRhdGlvbiBzcGVjaWZpY1xuICAgKiAgICAgICB9O1xuICAgKiAgICAgICBlcnJvciA9IHtcbiAgICogICAgICAgICBjb25uZWN0U3VjY2VzczogZmFsc2UsXG4gICAqICAgICAgICAgcmVhc29uOiBcIlwiIC8vIEltcGxlbWVudGF0aW9uIHNwZWNpZmljXG4gICAqICAgICAgICAgZGV0YWlsczoge30gLy8gSW1wbGVtZW50YXRpb24gc3BlY2lmaWNcbiAgICogICAgICAgfTtcbiAgICovXG4gIHN0YXJ0KGFyZ3MpIHtcbiAgICB0aHJvdyBuZXcgVW5JbXBsZW1lbnRlZE1ldGhvZEV4Y2VwdGlvbihcInN0YXJ0IGluIENvbm5lY3Rpb25IZWxwZXJcIik7XG4gIH1cblxuICBlbmQoKSB7XG4gICAgdGhyb3cgbmV3IFVuSW1wbGVtZW50ZWRNZXRob2RFeGNlcHRpb24oXCJlbmQgaW4gQ29ubmVjdGlvbkhlbHBlclwiKTtcbiAgfVxufVxuLyplc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzKi9cblxudmFyIENvbm5lY3Rpb25IZWxwZXJTdGF0dXMgPSB7XG4gIE5ldmVyU3RhcnRlZDogXCJOZXZlclN0YXJ0ZWRcIixcbiAgU3RhcnRpbmc6IFwiU3RhcnRpbmdcIixcbiAgQ29ubmVjdGVkOiBcIkNvbm5lY3RlZFwiLFxuICBEaXNjb25uZWN0ZWRSZWNvbm5lY3Rpbmc6IFwiRGlzY29ubmVjdGVkUmVjb25uZWN0aW5nXCIsXG4gIEVuZGVkOiBcIkVuZGVkXCJcbn07XG5cbnZhciBDb25uZWN0aW9uSGVscGVyRXZlbnRzID0ge1xuICBFbmRlZDogXCJFbmRlZFwiLCAvLyBldmVudCBkYXRhIGlzOiB7cmVhc29uOiAuLi59XG4gIERpc2Nvbm5lY3RlZFJlY29ubmVjdGluZzogXCJEaXNjb25uZWN0ZWRSZWNvbm5lY3RpbmdcIiwgLy8gZXZlbnQgZGF0YSBpczoge3JlYXNvbjogLi4ufVxuICBSZWNvbm5lY3RlZDogXCJSZWNvbm5lY3RlZFwiLCAvLyBldmVudCBkYXRhIGlzOiB7fVxuICBJbmNvbWluZ01lc3NhZ2U6IFwiSW5jb21pbmdNZXNzYWdlXCIgLy8gZXZlbnQgZGF0YSBpczoge3BheWxvYWRTdHJpbmc6IC4uLn1cbn07XG5cbi8qXG5UaGlzIGltcGxlbWVudGF0aW9uIGFzc3VtZXMgdGhhdCBpdCBoYXMgaXRzIG93biBNUVRUIGNsaWVudCBcbndoaWNoIGhhcyBuZXZlciBiZWVuIGNvbm5lY3RlZCBhbmQgd2lsbCBub3QgYmUgc2hhcmVkIHdpdGggYW55b25lLlxuKi9cbi8vIFRPRE8gLSBiZWxvdyBjYW4gYmUgY2hhbmdlZCB3aXRoIFByb21pc2UgQ2hhaW5pbmcuXG5jbGFzcyBTb2xvQ2hhdENvbm5lY3Rpb25NcXR0SGVscGVyIGV4dGVuZHMgQ29ubmVjdGlvbkhlbHBlciB7XG4gIGNvbnN0cnVjdG9yKGFyZ3MpIHtcbiAgICBzdXBlcigpO1xuICAgIHZhciBwcmVmaXggPSBcIkNvbnRhY3RJZC1cIiArIGFyZ3MuY29udGFjdElkICsgXCI6IFwiO1xuICAgIHRoaXMubG9nZ2VyID0gTG9nTWFuYWdlci5nZXRMb2dnZXIoe1xuICAgICAgcHJlZml4OiBwcmVmaXhcbiAgICB9KTtcbiAgICB0aGlzLnByZVNpZ25lZFVybCA9IGFyZ3MuY29ubmVjdGlvbkRldGFpbHMucHJlU2lnbmVkVXJsO1xuICAgIHRoaXMudG9waWMgPSBhcmdzLmNvbm5lY3Rpb25EZXRhaWxzLmNvbm5lY3Rpb25JZDtcbiAgICB0aGlzLmNvbnNpZGVyUGFydGljaXBhbnRBc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuaW90Q29ubmVjdGlvbiA9IGFyZ3MubXF0dENvbm5lY3Rpb25Qcm92aWRlcigoZXZlbnRUeXBlLCBldmVudERhdGEpID0+XG4gICAgICB0aGlzLl9oYW5kbGVJb3RFdmVudChldmVudFR5cGUsIGV2ZW50RGF0YSlcbiAgICApO1xuICAgIGlmIChcbiAgICAgIHRoaXMuaW90Q29ubmVjdGlvbi5nZXRTdGF0dXMoKSAhPT0gTXF0dENvbm5lY3Rpb25TdGF0dXMuTmV2ZXJDb25uZWN0ZWRcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb24oXG4gICAgICAgIFwiaW90Q29ubmVjdGlvbiBpcyBleHBlY3RlZCB0byBiZSBpbiBOZXZlckNvbm5lY3RlZCBzdGF0ZSBidXQgaXMgbm90XCJcbiAgICAgICkoKTtcbiAgICB9XG4gICAgdGhpcy5jaGF0Q29udHJvbGxlckNhbGxiYWNrID0gYXJncy5jYWxsYmFjaztcbiAgICB0aGlzLnN0YXR1cyA9IENvbm5lY3Rpb25IZWxwZXJTdGF0dXMuTmV2ZXJTdGFydGVkO1xuICB9XG5cbiAgLy8gQWRkIGFueSBmdW5jdGlvbmFsaXR5IHRoYXQgeW91IHdhbnQgdGhpcyB0byBkbyxcbiAgLy8gaWYgdGhlIHBhcnRpY2lwYW50IGlzIHRvIGJlIGNvbnNpZGVyZWQgYXMgZGlzY29ubmVjdGVkLlxuICAvLyBkaXNjb25uZWN0IGhlcmUgbWVhbnMgdGhhdCB0aGUgcGFydGljaXBhbnQgaXMgbm8gbG9uZ2VyIHBhcnQgb2YgdGhlciBjaGF0LlxuICAvLyBpdCBpcyBpbmRlcGVuZGVudCBvZiB0aGUgYWN0dWFsIHdlYnNvY2tldCBjb25uZWN0aW9uIGJlaW5nIGNvbm5lY3RlZCBvciBub3QuXG4gIC8vIHBhcnRpY2lwYW50IGNhbiBubyBsb25nZXIgc2VuZCBhbmQgcmVjaWV2ZSBtZXNzYWdlcyB0byB0aGUgYmFja2VuZC5cbiAgY2xlYW5VcE9uUGFydGljaXBhbnREaXNjb25uZWN0KCkge1xuICAgIC8vIFJpZ2h0IG5vdywgbm90aGluZyBkZXBlbmRzIG9uIHRoaXMgZmllbGQuXG4gICAgLy8gSG93ZXZlciBpbiBmdXR1cmUgd2UgbWlnaHQgcHJldmVudCByZXRpcmVzIG9uIGNvbm5lY3Rpb24gaWYgdGhpcyBmaWVsZCBpcyBzZXQgdG8gdHJ1ZS5cbiAgICB0aGlzLmNvbnNpZGVyUGFydGljaXBhbnRBc0Rpc2Nvbm5lY3RlZCA9IHRydWU7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAodGhpcy5zdGF0dXMgIT09IENvbm5lY3Rpb25IZWxwZXJTdGF0dXMuTmV2ZXJTdGFydGVkKSB7XG4gICAgICB0aHJvdyBuZXcgSWxsZWdhbFN0YXRlRXhjZXB0aW9uKFwiQ29ubmVjdGlvbiBoZWxwZXIgc3RhcnRlZCB0d2ljZSEhXCIpO1xuICAgIH1cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5zdGF0dXMgPSBDb25uZWN0aW9uSGVscGVyU3RhdHVzLlN0YXJ0aW5nO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShzZWxmLl9jcmVhdGVTdGFydFByb21pc2UoKSk7XG4gIH1cblxuICBfY3JlYXRlU3RhcnRQcm9taXNlKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gZnVuY3Rpb24ocmVzb3ZsZSwgcmVqZWN0KSB7XG4gICAgICBzZWxmLl9jb25uZWN0KHJlc292bGUsIHJlamVjdCk7XG4gICAgfTtcbiAgfVxuXG4gIF9jb25uZWN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY29ubmVjdE9wdGlvbnMgPSB7XG4gICAgICB1c2VTU0w6IHRydWUsXG4gICAgICBrZWVwQWxpdmVJbnRlcnZhbDogTVFUVF9DT05TVEFOVFMuS0VFUF9BTElWRSxcbiAgICAgIHJlY29ubmVjdDogZmFsc2UsXG4gICAgICBtcXR0VmVyc2lvbjogNCxcbiAgICAgIHRpbWVvdXQ6IE1RVFRfQ09OU1RBTlRTLkNPTk5FQ1RfVElNRU9VVFxuICAgIH07XG4gICAgc2VsZi5pb3RDb25uZWN0aW9uXG4gICAgICAuY29ubmVjdChjb25uZWN0T3B0aW9ucylcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHNlbGYuX3Bvc3RDb25uZWN0KHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBzZWxmLl9jb25uZWN0RmFpbGVkKHJlamVjdCwgZXJyb3IpO1xuICAgICAgfSk7XG4gIH1cblxuICBfcG9zdENvbm5lY3QocmVzb2x2ZSwgcmVqZWN0LCBjb25uZWN0UmVzcG9uc2UpIHtcbiAgICB0aGlzLl9zdWJzY3JpYmUocmVzb2x2ZSwgcmVqZWN0LCBjb25uZWN0UmVzcG9uc2UpO1xuICB9XG5cbiAgX2Nvbm5lY3RGYWlsZWQocmVqZWN0LCBjb25uZWN0RXJyb3IpIHtcbiAgICB2YXIgZXJyb3IgPSB7XG4gICAgICBjb25uZWN0U3VjY2VzczogZmFsc2UsXG4gICAgICByZWFzb246IFwiQ29ubmVjdGlvblRvQnJva2VyRmFpbGVkXCIsXG4gICAgICBkZXRhaWxzOiBjb25uZWN0RXJyb3JcbiAgICB9O1xuICAgIHRoaXMuc3RhdHVzID0gQ29ubmVjdGlvbkhlbHBlclN0YXR1cy5FbmRlZDtcbiAgICByZWplY3QoZXJyb3IpO1xuICB9XG5cbiAgLyplc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyovXG4gIF9zdWJzY3JpYmUocmVzb2x2ZSwgcmVqZWN0LCBjb25uZWN0UmVzcG9uc2UpIHtcbiAgICAvKmVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMqL1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgc3Vic2NyaWJlT3B0aW9ucyA9IHtcbiAgICAgIHFvczogMVxuICAgIH07XG4gICAgc2VsZi5pb3RDb25uZWN0aW9uXG4gICAgICAuc3Vic2NyaWJlKHNlbGYudG9waWMsIHN1YnNjcmliZU9wdGlvbnMpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBzZWxmLl9wb3N0U3Vic2NyaWJlKHJlc29sdmUsIHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgc2VsZi5fc3Vic2NyaWJlRmFpbGVkKHJlamVjdCwgZXJyb3IpO1xuICAgICAgfSk7XG4gIH1cblxuICBfcG9zdFN1YnNjcmliZShyZXNvbHZlLCBzdWJzY3JpYmVSZXNwb25zZSkge1xuICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgIGRldGFpbHM6IHN1YnNjcmliZVJlc3BvbnNlLFxuICAgICAgY29ubmVjdFN1Y2Nlc3M6IHRydWVcbiAgICB9O1xuICAgIHRoaXMuc3RhdHVzID0gQ29ubmVjdGlvbkhlbHBlclN0YXR1cy5Db25uZWN0ZWQ7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH1cblxuICBfc3Vic2NyaWJlRmFpbGVkKHJlamVjdCwgc3Vic2NyaWJlRXJyb3IpIHtcbiAgICB2YXIgZXJyb3IgPSB7XG4gICAgICBjb25uZWN0U3VjY2VzczogZmFsc2UsXG4gICAgICBkZXRhaWxzOiBzdWJzY3JpYmVFcnJvcixcbiAgICAgIHJlYXNvbjogXCJTdWJzY3JpYnRpb25Ub1RvcGljRmFpbGVkXCJcbiAgICB9O1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnN0YXR1cyA9IENvbm5lY3Rpb25IZWxwZXJTdGF0dXMuRW5kZWQ7XG4gICAgc2VsZi5pb3RDb25uZWN0aW9uLmRpc2Nvbm5lY3QoKTtcbiAgICByZWplY3QoZXJyb3IpO1xuICB9XG5cbiAgX2hhbmRsZUlvdEV2ZW50KGV2ZW50VHlwZSwgZXZlbnREYXRhKSB7XG4gICAgc3dpdGNoIChldmVudFR5cGUpIHtcbiAgICAgIGNhc2UgTXF0dEV2ZW50cy5NRVNTQUdFOlxuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhcIlJlY2VpdmVkIGluY29taW5nIGRhdGFcIiwgZXZlbnREYXRhLnBheWxvYWRTdHJpbmcpO1xuICAgICAgICB0aGlzLmNoYXRDb250cm9sbGVyQ2FsbGJhY2soXG4gICAgICAgICAgQ29ubmVjdGlvbkhlbHBlckV2ZW50cy5JbmNvbWluZ01lc3NhZ2UsXG4gICAgICAgICAgZXZlbnREYXRhXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBNcXR0RXZlbnRzLkRJU0NPTk5FQ1RFRF9SRVRSWUlORzpcbiAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUi4gUmVjZWl2ZWQgdW5leHBlY3RlZCBldmVudCBESVNDT05ORUNURURfUkVUUllJTkdcIik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBNcXR0RXZlbnRzLkRJU0NPTk5FQ1RFRDpcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBDb25uZWN0aW9uSGVscGVyU3RhdHVzLkVuZGVkO1xuICAgICAgICB0aGlzLmNoYXRDb250cm9sbGVyQ2FsbGJhY2soQ29ubmVjdGlvbkhlbHBlckV2ZW50cy5FbmRlZCwgZXZlbnREYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE1xdHRFdmVudHMuUkVDT05ORUNURUQ6XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1IuIFJlY2VpdmVkIHVuZXhwZWN0ZWQgZXZlbnQgRElTQ09OTkVDVEVEX1JFVFJZSU5HXCIpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBlbmQoKSB7XG4gICAgdGhpcy5zdGF0dXMgPSBDb25uZWN0aW9uSGVscGVyU3RhdHVzLkVuZGVkO1xuICAgIC8vIERvIHdlIGV4cGxpY2l0bHkgaGF2ZSB0byB1bnN1YnNjcmliZSBiZWZvcmUgZGlzY29ubmVjdGluZyBNUVRUP1xuICAgIHRoaXMuaW90Q29ubmVjdGlvbi5kaXNjb25uZWN0KCk7XG4gIH1cblxuICBnZXRTdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzO1xuICB9XG59XG5cbmV4cG9ydCB7XG4gIFNvbG9DaGF0Q29ubmVjdGlvbk1xdHRIZWxwZXIsXG4gIENvbm5lY3Rpb25IZWxwZXJFdmVudHMsXG4gIENvbm5lY3Rpb25IZWxwZXJTdGF0dXNcbn07XG4iLCJpbXBvcnQge1xuICBJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb24sXG4gIFVuSW1wbGVtZW50ZWRNZXRob2RFeGNlcHRpb25cbn0gZnJvbSBcIi4vZXhjZXB0aW9uc1wiO1xuXG5pbXBvcnQgUGFobyBmcm9tIFwiLi4vcGFoby1tcXR0XCI7XG5cbmNsYXNzIENoYXRDb25uZWN0aW9uTWFuYWdlciB7XG4gIGNyZWF0ZU5ld01xdHRDb25uZWN0aW9uUHJvdmlkZXIoY29ubmVjdGlvbkFyZ3MsIHR5cGUpIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgXCJQYWhvTXF0dENvbm5lY3Rpb25cIjpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY29ubmVjdGlvbkFyZ3MuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgICByZXR1cm4gbmV3IFBhaG9NcXR0Q29ubmVjdGlvbihjb25uZWN0aW9uQXJncyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHRocm93IG5ldyBJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb24oXG4gICAgICBcInR5cGUgaW4gQ2hhdENvbm5lY3Rpb25NYW5hZ2VyLmNyZWF0ZU5ld01xdHRDb25uZWN0aW9uUHJvdmlkZXJcIixcbiAgICAgIHR5cGVcbiAgICApO1xuICB9XG59XG5cbi8vIFdoYXQgaXMgdGhlIGV4cGVjdGF0aW9uIGZyb20gdGhpcyBjbGFzcz9cbi8vIFRoaXMgc2hvdWxkIHByb3ZpZGUgYW4gaW50ZXJmYWNlIGZvciBjb25uZWN0aW5nICsgc3Vic2NyaWJpbmcgJiYgZGlzY29ubmVjdGluZyArIHVuc3Vic2NyaWJpbmcgdG8gZW5kcG9pbnQgKyB0b3BpYy5cbi8vIFRoaXMgY2xhc3Mgc2hvdWxkIGNhbGwgYmFja1xuLyplc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyovXG5jbGFzcyBNUVRUQ2xpZW50IHtcbiAgLyoqXG4gICAqIEBwYXJhbSBjb25uZWN0aW9uT3B0aW9ucyAob2JqZWN0KSAtXG4gICAqICAgICAgY29ubmVjdE9wdGlvbnMudXNlU1NMIC0gaWYgcHJlc2VudCBhbmQgdHJ1ZSwgdXNlIGFuIFNTTCBXZWJzb2NrZXQgY29ubmVjdGlvbi5cbiAgICogICAgICBjb25uZWN0T3B0aW9ucy5rZWVwQWxpdmVJbnRlcnZhbCAtIHRoZSBzZXJ2ZXIgZGlzY29ubmVjdHMgdGhpcyBjbGllbnQgaWYgdGhlcmUgaXMgbm8gYWN0aXZpdHkgZm9yIHRoaXMgbnVtYmVyIG9mIHNlY29uZHMuXG4gICAqICAgICAgY29ubmVjdE9wdGlvbnMucmVjb25uZWN0IC0gU2V0cyB3aGV0aGVyIHRoZSBjbGllbnQgd2lsbCBhdXRvbWF0aWNhbGx5IGF0dGVtcHQgdG8gcmVjb25uZWN0XG4gICAqICAgICAgY29ubmVjdE9wdGlvbnMubXF0dFZlcnNpb24gLSBUaGUgdmVyc2lvbiBvZiBNUVRUIHRvIHVzZSB0byBjb25uZWN0IHRvIHRoZSBNUVRUIEJyb2tlci5cbiAgICogICAgICBjb25uZWN0T3B0aW9ucy50aW1lb3V0IC0gSWYgdGhlIGNvbm5lY3QgaGFzIG5vdCBzdWNjZWVkZWQgd2l0aGluIHRoaXMgbnVtYmVyIG9mIHNlY29uZHMsIGl0IGlzIGRlZW1lZCB0byBoYXZlIGZhaWxlZC5cbiAgICpcbiAgICogQHJldHVybnMgYSBQcm9taXNlIG9iamVjdCAtXG4gICAqICAgICAgcmVzcG9uc2UgPSB7fVxuICAgKiAgICAgIGVycm9yID0ge1wicmVhc29uXCI6IHt9IC8vIEltcGxlbWVudGF0aW9uIHNwZWNpZmljXG4gICAqICAgICAgICAgIH1cbiAgICovXG4gIGNvbm5lY3QoY29ubmVjdE9wdGlvbnMpIHtcbiAgICB0aHJvdyBuZXcgVW5JbXBsZW1lbnRlZE1ldGhvZEV4Y2VwdGlvbihcImNvbm5lY3QgaW4gSW90Q2xpZW50XCIpO1xuICB9XG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aHJvdyBuZXcgVW5JbXBsZW1lbnRlZE1ldGhvZEV4Y2VwdGlvbihcImNvbm5lY3QgaW4gSW90Q2xpZW50XCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBzdWJzY3JpYmVPcHRpb25zIChvYmplY3QpIC1cbiAgICogICAgICBzdWJzY3JpYmVPcHRpb25zLnFvcyAtIHRoZSBtYWl4aW11bSBxb3Mgb2YgYW55IHB1YmxpY2F0aW9ucyBzZW50IGFzIGEgcmVzdWx0IG9mIG1ha2luZyB0aGlzIHN1YnNjcmlwdGlvbi5cbiAgICogICAgICBjb25uZWN0T3B0aW9ucy50aW1lb3V0IC0gd2hpY2gsIGlmIHByZXNlbnQsIGRldGVybWluZXMgdGhlIG51bWJlciBvZiBzZWNvbmRzIGFmdGVyIHdoaWNoIHRoZSBvbkZhaWx1cmUgY2FsYmFjayBpcyBjYWxsZWQuXG4gICAqICAgICAgICAgIFRoZSBwcmVzZW5jZSBvZiBhIHRpbWVvdXQgZG9lcyBub3QgcHJldmVudCB0aGUgb25TdWNjZXNzIGNhbGxiYWNrIGZyb20gYmVpbmcgY2FsbGVkIHdoZW4gdGhlIHN1YnNjcmliZSBjb21wbGV0ZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIGEgUHJvbWlzZSBvYmplY3QgLVxuICAgKiAgICAgIHJlc3BvbnNlID0ge1widG9waWNcIjogPHN0cmluZz4sXG4gICAqICAgICAgICAgICAgICAgICAgXCJxb3NcIjogcW9zLFxuICAgKiAgICAgIH1cbiAgICogICAgICBlcnJvciA9IHtcInRvcGljXCI6IDxzdHJpbmc+LFxuICAgKiAgICAgICAgICBcImVycm9yXCI6IHt9IC8vIEltcGxlbWVudGF0aW9uIHNwZWNpZmljXG4gICAqICAgICAgfVxuICAgKi9cbiAgc3Vic2NyaWJlKHRvcGljLCBzdWJzY3JpYmVPcHRpb25zKSB7XG4gICAgdGhyb3cgbmV3IFVuSW1wbGVtZW50ZWRNZXRob2RFeGNlcHRpb24oXCJjb25uZWN0IGluIElvdENsaWVudFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gc3Vic2NyaWJlT3B0aW9ucyAob2JqZWN0KSAtXG4gICAqICAgICAgY29ubmVjdE9wdGlvbnMudGltZW91dCAtIHdoaWNoLCBpZiBwcmVzZW50LCBkZXRlcm1pbmVzIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBhZnRlciB3aGljaCB0aGUgb25GYWlsdXJlIGNhbGxiYWNrIGlzIGNhbGxlZC5cbiAgICogICAgICAgICAgVGhlIHByZXNlbmNlIG9mIGEgdGltZW91dCBkb2VzIG5vdCBwcmV2ZW50IHRoZSBvblN1Y2Nlc3MgY2FsbGJhY2sgZnJvbSBiZWluZyBjYWxsZWQgd2hlbiB0aGUgdW5zdWJzY3JpYmUgY29tcGxldGVzLlxuICAgKlxuICAgKiBAcmV0dXJucyBhIFByb21pc2Ugb2JqZWN0IC1cbiAgICogICAgICByZXNwb25zZSA9IHtcInRvcGljXCI6IDxzdHJpbmc+LFxuICAgKiAgICAgICAgICAgICAgICAgIFwicW9zXCI6IHFvcyxcbiAgICogICAgICB9XG4gICAqICAgICAgZXJyb3IgPSB7XCJ0b3BpY1wiOiA8c3RyaW5nPixcbiAgICogICAgICAgICAgXCJlcnJvclwiOiB7fSAvLyBJbXBsZW1lbnRhdGlvbiBzcGVjaWZpY1xuICAgKiAgICAgIH1cbiAgICpcbiAgICovXG4gIHVuc3Vic2NyaWJlKHRvcGljLCB1bnN1YnNjcmliZU9wdGlvbnMpIHtcbiAgICB0aHJvdyBuZXcgVW5JbXBsZW1lbnRlZE1ldGhvZEV4Y2VwdGlvbihcImNvbm5lY3QgaW4gSW90Q2xpZW50XCIpO1xuICB9XG59XG4vKmVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMqL1xuXG52YXIgTXF0dENvbm5lY3Rpb25TdGF0dXMgPSBPYmplY3QuZnJlZXplKHtcbiAgTmV2ZXJDb25uZWN0ZWQ6IFwiTmV2ZXJDb25uZWN0ZWRcIixcbiAgQ29ubmVjdGluZzogXCJDb25uZWN0aW5nXCIsXG4gIENvbm5lY3RlZDogXCJDb25uZWN0ZWRcIixcbiAgRGlzY29ubmVjdGVkUmV0cnlpbmc6IFwiRGlzY29ubmVjdGVkUmV0cnlpbmdcIixcbiAgRGlzY29ubmVjdGVkOiBcIkRpc2Nvbm5lY3RlZFwiLFxuICBSZWNvbm5lY3Rpbmc6IFwiUmVjb25uZWN0aW5nXCJcbn0pO1xuXG52YXIgTXF0dEV2ZW50cyA9IE9iamVjdC5mcmVlemUoe1xuICBNRVNTQUdFOiBcIk1lc3NhZ2VcIiwgLy8gdG9waWMsIHFvcywgcGF5bG9hZFN0cmluZ1xuICBESVNDT05ORUNURURfUkVUUllJTkc6IFwiRGlzY29ubmVjdGVkUmV0cnlpbmdcIiwgLy8gcmVhc29uOiBwYWhvT2JqZWN0XG4gIERJU0NPTk5FQ1RFRDogXCJEaXNjb25uZWN0ZWRcIiwgLy8gcmVhc29uOiBwYWhvT2JqZWN0LyBcIlRpbWVPdXRJblJlY29ubmVjdFwiXG4gIFJFQ09OTkVDVEVEOiBcIlJlY29ubmVjdFN1Y2Nlc3NcIlxufSk7IC8vIHt9XG5cbmNsYXNzIFBhaG9NcXR0Q29ubmVjdGlvbiBleHRlbmRzIE1RVFRDbGllbnQge1xuICBjb25zdHJ1Y3RvcihhcmdzKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnByZVNpZ25lZFVybCA9IGFyZ3MucHJlU2lnbmVkVXJsO1xuICAgIHRoaXMuY29ubmVjdGlvbklkID0gYXJncy5jb25uZWN0aW9uSWQ7XG4gICAgdGhpcy5zdGF0dXMgPSBNcXR0Q29ubmVjdGlvblN0YXR1cy5OZXZlckNvbm5lY3RlZDtcbiAgICB0aGlzLnBhaG9DbGllbnQgPSBuZXcgUGFoby5DbGllbnQodGhpcy5wcmVTaWduZWRVcmwsIHRoaXMuY29ubmVjdGlvbklkKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5wYWhvQ2xpZW50Lm9uTWVzc2FnZUFycml2ZWQgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICBzZWxmLl9tZXNzYWdlQXJyaXZlZENhbGxiYWNrKG1lc3NhZ2UpO1xuICAgIH07XG4gICAgdGhpcy5wYWhvQ2xpZW50Lm9uQ29ubmVjdGlvbkxvc3QgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBzZWxmLl9jb25uZWN0aW9uTG9zdENhbGxCYWNrKGRhdGEpO1xuICAgIH07XG4gICAgdGhpcy5wYWhvQ2xpZW50Lm9uTWVzc2FnZUFycml2ZWQgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICBzZWxmLl9tZXNzYWdlQXJyaXZlZENhbGxiYWNrKG1lc3NhZ2UpO1xuICAgIH07XG4gICAgdGhpcy5jYWxsYmFjayA9IGFyZ3MuY2FsbGJhY2s7XG4gICAgdGhpcy5raWxsUmVjb25uZWN0ID0gbnVsbDtcbiAgICB0aGlzLm1heFJldHJ5VGltZSA9IGFyZ3MubWF4UmV0cnlUaW1lO1xuICAgIHRoaXMubmV2ZXJDb25uZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMuX3N1YnNjcmliZWRUb3BpY3MgPSBbXTtcbiAgfVxuXG4gIGNvbm5lY3QoY29ubmVjdE9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgY29ubmVjdE9wdGlvbnMub25TdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgc2VsZi5uZXZlckNvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgb2xkU3RhdHVzID0gc2VsZi5zdGF0dXM7XG4gICAgICAgIHNlbGYuX29uQ29ubmVjdFN1Y2Nlc3MocmVzcG9uc2UpO1xuICAgICAgICByZXNvbHZlKHt9KTtcbiAgICAgICAgaWYgKG9sZFN0YXR1cyA9PT0gTXF0dENvbm5lY3Rpb25TdGF0dXMuRGlzY29ubmVjdGVkUmV0cnlpbmcpIHtcbiAgICAgICAgICBzZWxmLmNhbGxiYWNrKE1xdHRFdmVudHMuUkVDT05ORUNURUQsIHt9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbm5lY3RPcHRpb25zLm9uRmFpbHVyZSA9IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHZhciBlcnJvckRldGFpbHMgPSB7XG4gICAgICAgICAgcmVhc29uOiBlcnJvclxuICAgICAgICB9O1xuICAgICAgICBzZWxmLl9vbkNvbm5lY3RGYWlsdXJlKGVycm9yRGV0YWlscyk7XG4gICAgICAgIHJlamVjdChlcnJvckRldGFpbHMpO1xuICAgICAgfTtcbiAgICAgIHNlbGYuc3RhdHVzID0gTXF0dENvbm5lY3Rpb25TdGF0dXMuQ29ubmVjdGluZztcbiAgICAgIHNlbGYucGFob0NsaWVudC5jb25uZWN0KGNvbm5lY3RPcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9jb25uZWN0aW9uTG9zdENhbGxCYWNrKGVycm9yKSB7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICByZWFzb246IGVycm9yXG4gICAgfTtcbiAgICB0aGlzLl9zdWJzY3JpYmVkVG9waWNzID0gW107XG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBNcXR0Q29ubmVjdGlvblN0YXR1cy5EaXNjb25uZWN0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGRhdGEucmVhc29uLnJlY29ubmVjdCkge1xuICAgICAgdGhpcy5zdGF0dXMgPSBNcXR0Q29ubmVjdGlvblN0YXR1cy5EaXNjb25uZWN0ZWRSZXRyeWluZztcbiAgICAgIHRoaXMuY2FsbGJhY2soTXF0dEV2ZW50cy5ESVNDT05ORUNURURfUkVUUllJTkcsIGRhdGEpO1xuICAgICAgdGhpcy5raWxsUmVjb25uZWN0ID0gdGhpcy5fc2NoZWR1bGVSZWNvbm5lY3RLaWxsaW5nKCk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdHVzID0gTXF0dENvbm5lY3Rpb25TdGF0dXMuRGlzY29ubmVjdGVkO1xuICAgICAgdGhpcy5jYWxsYmFjayhNcXR0RXZlbnRzLkRJU0NPTk5FQ1RFRCwgZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgX21lc3NhZ2VBcnJpdmVkQ2FsbGJhY2sobWVzc2FnZSkge1xuICAgIHZhciBpbmNvbWluZ01lc3NhZ2UgPSB7XG4gICAgICB0b3BpYzogbWVzc2FnZS50b3BpYyxcbiAgICAgIHFvczogbWVzc2FnZS5xb3MsXG4gICAgICBwYXlsb2FkU3RyaW5nOiBtZXNzYWdlLnBheWxvYWRTdHJpbmdcbiAgICB9O1xuICAgIHRoaXMuY2FsbGJhY2soTXF0dEV2ZW50cy5NRVNTQUdFLCBpbmNvbWluZ01lc3NhZ2UpO1xuICB9XG5cbiAgLyplc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyovXG4gIF9vbkNvbm5lY3RTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgLyplc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzKi9cbiAgICBpZiAodGhpcy5raWxsUmVjb25uZWN0ICE9PSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5raWxsUmVjb25uZWN0KTtcbiAgICAgIHRoaXMua2lsbFJlY29ubmVjdCA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuc3RhdHVzID0gTXF0dENvbm5lY3Rpb25TdGF0dXMuQ29ubmVjdGVkO1xuICB9XG5cbiAgLyplc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyovXG4gIF9vbkNvbm5lY3RGYWlsdXJlKGVycm9yKSB7XG4gICAgLyplc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzKi9cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYubmV2ZXJDb25uZWN0ZWQpIHtcbiAgICAgIHNlbGYuc3RhdHVzID0gTXF0dENvbm5lY3Rpb25TdGF0dXMuTmV2ZXJDb25uZWN0ZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuc3RhdHVzID0gTXF0dENvbm5lY3Rpb25TdGF0dXMuRGlzY29ubmVjdGVkO1xuICAgIH1cbiAgfVxuXG4gIF9zY2hlZHVsZVJlY29ubmVjdEtpbGxpbmcoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5kaXNjb25uZWN0KCk7XG4gICAgICBzZWxmLmNhbGxiYWNrKE1xdHRFdmVudHMuRElTQ09OTkVDVEVELCB7IHJlYXNvbjogXCJUaW1lb3V0SW5SZWNvbm5lY3RcIiB9KTtcbiAgICB9LCBzZWxmLm1heFJldHJ5VGltZSAqIDEwMDApO1xuICB9XG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLl9zdWJzY3JpYmVkVG9waWNzID0gW107XG4gICAgdGhpcy5zdGF0dXMgPSBNcXR0Q29ubmVjdGlvblN0YXR1cy5EaXNjb25uZWN0ZWQ7XG4gICAgdGhpcy5wYWhvQ2xpZW50LmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIHN1YnNjcmliZSh0b3BpYywgc3Vic2NyaWJlT3B0aW9ucykge1xuICAgIC8vIHNob3VsZCB3ZSBjaGVjayBpZiB0aGlzIHRvcGljIGlzIGFscmVhZHkgc3Vic2NyaWJlZD9cbiAgICAvLyBOTywgbGVhdmUgdGhpcyBiZWhhdmlvdXIgdG8gUEFITyAtIHdoYXRldmVyIFBBSE8gZG9lc1xuICAgIC8vIGluIGNhc2Ugb2YgZHVwbGljYXRlIHN1YnNjcmliZSAtIHdlIHdpbGwgZm9sbG93IHRoZSBzYW1lLlxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBzdWJzY3JpYmVPcHRpb25zLm9uU3VjY2VzcyA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHNlbGYuX3N1YnNjcmliZVN1Y2Nlc3ModG9waWMsIHJlc3BvbnNlKTtcbiAgICAgICAgdmFyIHJlc3BvbnNlT2JqZWN0ID0ge1xuICAgICAgICAgIHRvcGljOiB0b3BpYyxcbiAgICAgICAgICBxb3M6IHJlc3BvbnNlLmdyYW50ZWRRb3NcbiAgICAgICAgfTtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZU9iamVjdCk7XG4gICAgICB9O1xuICAgICAgc3Vic2NyaWJlT3B0aW9ucy5vbkZhaWx1cmUgPSBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICB2YXIgZXJyb3JPYmplY3QgPSB7XG4gICAgICAgICAgdG9waWM6IHRvcGljLFxuICAgICAgICAgIGVycm9yOiBlcnJvclxuICAgICAgICB9O1xuICAgICAgICByZWplY3QoZXJyb3JPYmplY3QpO1xuICAgICAgfTtcbiAgICAgIHNlbGYucGFob0NsaWVudC5zdWJzY3JpYmUodG9waWMsIHN1YnNjcmliZU9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG5cbiAgX2FkZFRvVG9waWNzKHRvcGljKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLl9zdWJzY3JpYmVkVG9waWNzLmluZGV4T2YodG9waWMpID49IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2VsZi5fc3Vic2NyaWJlZFRvcGljcy5wdXNoKHRvcGljKTtcbiAgfVxuXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMqL1xuICBfc3Vic2NyaWJlU3VjY2Vzcyh0b3BpYywgcmVzcG9uc2UpIHtcbiAgICAvKmVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMqL1xuICAgIHRoaXMuX2FkZFRvVG9waWNzKHRvcGljKTtcbiAgfVxuXG4gIGdldFN1YnNjcmliZWRUb3BpY3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N1YnNjcmliZWRUb3BpY3Muc2xpY2UoMCk7XG4gIH1cblxuICB1bnN1YnNjcmliZSh0b3BpYywgdW5zdWJzY3JpYmVPcHRpb25zKSB7XG4gICAgLy8gc2hvdWxkIHdlIGNoZWNrIGlmIHRoaXMgdG9waWMgaXMgZXZlbiBzdWJzY3JpYmVkP1xuICAgIC8vIE5PLCBsZWF2ZSB0aGlzIGJlaGF2aW91ciB0byBQQUhPIC0gd2hhdGV2ZXIgUEFITyBkb2VzXG4gICAgLy8gaW4gY2FzZSBvZiB1bnN1YnNjcmliZSBvZiB0b3BpY3Mgbm90IGV2ZW50IHN1YnNjcmliZWRcbiAgICAvLyAtIHdlIHdpbGwgZm9sbG93IHRoZSBzYW1lLlxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB1bnN1YnNjcmliZU9wdGlvbnMub25TdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgdmFyIHJlc3BvbnNlT2JqZWN0ID0ge1xuICAgICAgICAgIHRvcGljOiB0b3BpYyxcbiAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2VcbiAgICAgICAgfTtcbiAgICAgICAgc2VsZi5fdW5zdWJzY3JpYmVTdWNjZXNzKHRvcGljLCByZXNwb25zZU9iamVjdCk7XG4gICAgICAgIHJlc29sdmUocmVzcG9uc2VPYmplY3QpO1xuICAgICAgfTtcbiAgICAgIHVuc3Vic2NyaWJlT3B0aW9ucy5vbkZhaWx1cmUgPSBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICB2YXIgZXJyb3JPYmplY3QgPSB7XG4gICAgICAgICAgdG9waWM6IHRvcGljLFxuICAgICAgICAgIGVycm9yOiBlcnJvclxuICAgICAgICB9O1xuICAgICAgICByZWplY3QoZXJyb3JPYmplY3QpO1xuICAgICAgfTtcbiAgICAgIHNlbGYucGFob0NsaWVudC51bnN1YnNjcmliZSh0b3BpYywgdW5zdWJzY3JpYmVPcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMqL1xuICBfdW5zdWJzY3JpYmVTdWNjZXNzKHRvcGljLCByZXNwb25zZSkge1xuICAgIC8qZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyovXG4gICAgdGhpcy5fc3Vic2NyaWJlZFRvcGljcyA9IHRoaXMuX3N1YnNjcmliZWRUb3BpY3MuZmlsdGVyKHQgPT4gdCAhPT0gdG9waWMpO1xuICB9XG5cbiAgZ2V0U3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cztcbiAgfVxufVxuXG5leHBvcnQgeyBDaGF0Q29ubmVjdGlvbk1hbmFnZXIsIE1xdHRFdmVudHMsIE1xdHRDb25uZWN0aW9uU3RhdHVzIH07XG4iLCJpbXBvcnQgeyBDSEFUX0VWRU5UUyB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IENvbm5lY3Rpb25IZWxwZXJFdmVudHMgfSBmcm9tIFwiLi9jb25uZWN0aW9uSGVscGVyXCI7XG5cbmNsYXNzIEV2ZW50Q29uc3RydWN0b3Ige1xuICBmcm9tQ29ubmVjdGlvbkhlbHBlckV2ZW50KGV2ZW50VHlwZSwgZXZlbnREYXRhLCBjaGF0RGV0YWlscykge1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgZGF0YTogZXZlbnREYXRhLFxuICAgICAgY2hhdERldGFpbHM6IGNoYXREZXRhaWxzXG4gICAgfTtcbiAgICB2YXIgcmV0dXJuT2JqZWN0ID0ge1xuICAgICAgdHlwZTogbnVsbCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9O1xuICAgIHN3aXRjaCAoZXZlbnRUeXBlKSB7XG4gICAgICBjYXNlIENvbm5lY3Rpb25IZWxwZXJFdmVudHMuRW5kZWQ6XG4gICAgICAgIHJldHVybk9iamVjdC5kYXRhLnJldHJ5aW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybk9iamVjdC50eXBlID0gQ0hBVF9FVkVOVFMuQ09OTkVDVElPTl9CUk9LRU47XG4gICAgICAgIHJldHVybiByZXR1cm5PYmplY3Q7XG4gICAgICBjYXNlIENvbm5lY3Rpb25IZWxwZXJFdmVudHMuRGlzY29ubmVjdGVkUmVjb25uZWN0aW5nOlxuICAgICAgICByZXR1cm5PYmplY3QuZGF0YS5yZXRyeWluZyA9IHRydWU7XG4gICAgICAgIHJldHVybk9iamVjdC50eXBlID0gQ0hBVF9FVkVOVFMuQ09OTkVDVElPTl9CUk9LRU47XG4gICAgICAgIHJldHVybiByZXR1cm5PYmplY3Q7XG4gICAgICBjYXNlIENvbm5lY3Rpb25IZWxwZXJFdmVudHMuUmVjb25uZWN0ZWQ6XG4gICAgICAgIHJldHVybk9iamVjdC5kYXRhLmNvbm5lY3RDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuT2JqZWN0LnR5cGUgPSBDSEFUX0VWRU5UUy5DT05ORUNUSU9OX0VTVEFCTElTSEVEO1xuICAgICAgICByZXR1cm4gcmV0dXJuT2JqZWN0O1xuICAgICAgY2FzZSBDb25uZWN0aW9uSGVscGVyRXZlbnRzLkluY29taW5nTWVzc2FnZTpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb21JbmNvbWluZ0RhdGEoZXZlbnREYXRhLCBjaGF0RGV0YWlscyk7XG4gICAgfVxuICB9XG5cbiAgX2Zyb21JbmNvbWluZ0RhdGEoZXZlbnREYXRhLCBjaGF0RGV0YWlscykge1xuICAgIHZhciBpbmNvbWluZ0RhdGEgPSBKU09OLnBhcnNlKGV2ZW50RGF0YS5wYXlsb2FkU3RyaW5nKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIGRhdGE6IGluY29taW5nRGF0YSxcbiAgICAgIGNoYXREZXRhaWxzOiBjaGF0RGV0YWlsc1xuICAgIH07XG4gICAgdmFyIHJldHVybk9iamVjdCA9IHtcbiAgICAgIHR5cGU6IG51bGwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfTtcbiAgICBzd2l0Y2ggKGluY29taW5nRGF0YS5EYXRhLlR5cGUpIHtcbiAgICAgIGNhc2UgXCJUWVBJTkdcIjpcbiAgICAgICAgcmV0dXJuT2JqZWN0LnR5cGUgPSBDSEFUX0VWRU5UUy5JTkNPTUlOR19UWVBJTkc7XG4gICAgICAgIHJldHVybiByZXR1cm5PYmplY3Q7XG4gICAgfVxuICAgIC8vIFRPRE8gdGhpcyBpcyBub3QgcmlnaHQhIFdlIGFyZSByZXR1cm5pbmdcbiAgICAvLyBhIE1FU1NBR0UgZXZlbnQgZXZlbiB0aG91Z2ggdGhpcyBjb3VsZCBiZSBhIGN1c3RvbSBldmVudCxcbiAgICAvLyBzaG91bGQgdGhlcmUgYmUgYW4gZXhoYXVzdGl2ZSBsaXN0IG9mIGV2ZW50cyBsaWtlIFBBUlRJQ0lQQU5UX0pPSU5FRFxuICAgIC8vIHJlY29nbml6ZWQgYXMgTUVTU0FHRT9cbiAgICByZXR1cm5PYmplY3QudHlwZSA9IENIQVRfRVZFTlRTLklOQ09NSU5HX01FU1NBR0U7XG4gICAgcmV0dXJuIHJldHVybk9iamVjdDtcbiAgfVxufVxuXG5leHBvcnQgeyBFdmVudENvbnN0cnVjdG9yIH07XG4iLCJpbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmNvbnN0IEFMTF9FVkVOVFMgPSBcIjw8YWxsPj5cIjtcblxuLyoqXG4gKiBBbiBvYmplY3QgcmVwcmVzZW50aW5nIGFuIGV2ZW50IHN1YnNjcmlwdGlvbiBpbiBhbiBFdmVudEJ1cy5cbiAqL1xudmFyIFN1YnNjcmlwdGlvbiA9IGZ1bmN0aW9uKHN1Yk1hcCwgZXZlbnROYW1lLCBmKSB7XG4gIHRoaXMuc3ViTWFwID0gc3ViTWFwO1xuICB0aGlzLmlkID0gVXRpbHMucmFuZG9tSWQoKTtcbiAgdGhpcy5ldmVudE5hbWUgPSBldmVudE5hbWU7XG4gIHRoaXMuZiA9IGY7XG59O1xuXG4vKipcbiAqIFVuc3Vic2NyaWJlIHRoZSBoYW5kbGVyIG9mIHRoaXMgc3Vic2NyaXB0aW9uIGZyb20gdGhlIEV2ZW50QnVzXG4gKiBmcm9tIHdoaWNoIGl0IHdhcyBjcmVhdGVkLlxuICovXG5TdWJzY3JpcHRpb24ucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3ViTWFwLnVuc3Vic2NyaWJlKHRoaXMuZXZlbnROYW1lLCB0aGlzLmlkKTtcbn07XG5cbi8qKlxuICogQSBtYXAgb2YgZXZlbnQgc3Vic2NyaXB0aW9ucywgdXNlZCBieSB0aGUgRXZlbnRCdXMuXG4gKi9cbnZhciBTdWJzY3JpcHRpb25NYXAgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zdWJJZE1hcCA9IHt9O1xuICB0aGlzLnN1YkV2ZW50TmFtZU1hcCA9IHt9O1xufTtcblxuLyoqXG4gKiBBZGQgYSBzdWJzY3JpcHRpb24gZm9yIHRoZSBuYW1lZCBldmVudC4gIENyZWF0ZXMgYSBuZXcgU3Vic2NyaXB0aW9uXG4gKiBvYmplY3QgYW5kIHJldHVybnMgaXQuICBUaGlzIG9iamVjdCBjYW4gYmUgdXNlZCB0byB1bnN1YnNjcmliZS5cbiAqL1xuU3Vic2NyaXB0aW9uTWFwLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbihldmVudE5hbWUsIGYpIHtcbiAgdmFyIHN1YiA9IG5ldyBTdWJzY3JpcHRpb24odGhpcywgZXZlbnROYW1lLCBmKTtcblxuICB0aGlzLnN1YklkTWFwW3N1Yi5pZF0gPSBzdWI7XG4gIHZhciBzdWJMaXN0ID0gdGhpcy5zdWJFdmVudE5hbWVNYXBbZXZlbnROYW1lXSB8fCBbXTtcbiAgc3ViTGlzdC5wdXNoKHN1Yik7XG4gIHRoaXMuc3ViRXZlbnROYW1lTWFwW2V2ZW50TmFtZV0gPSBzdWJMaXN0O1xufTtcblxuLyoqXG4gKiBVbnN1YnNjcmliZSBhIHN1YnNjcmlwdGlvbiBtYXRjaGluZyB0aGUgZ2l2ZW4gZXZlbnQgbmFtZSBhbmQgaWQuXG4gKi9cblN1YnNjcmlwdGlvbk1hcC5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbihldmVudE5hbWUsIHN1YklkKSB7XG4gIGlmIChVdGlscy5jb250YWlucyh0aGlzLnN1YkV2ZW50TmFtZU1hcCwgZXZlbnROYW1lKSkge1xuICAgIHRoaXMuc3ViRXZlbnROYW1lTWFwW2V2ZW50TmFtZV0gPSB0aGlzLnN1YkV2ZW50TmFtZU1hcFtldmVudE5hbWVdLmZpbHRlcihcbiAgICAgIGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHMuaWQgIT09IHN1YklkO1xuICAgICAgfVxuICAgICk7XG5cbiAgICBpZiAodGhpcy5zdWJFdmVudE5hbWVNYXBbZXZlbnROYW1lXS5sZW5ndGggPCAxKSB7XG4gICAgICBkZWxldGUgdGhpcy5zdWJFdmVudE5hbWVNYXBbZXZlbnROYW1lXTtcbiAgICB9XG4gIH1cblxuICBpZiAoVXRpbHMuY29udGFpbnModGhpcy5zdWJJZE1hcCwgc3ViSWQpKSB7XG4gICAgZGVsZXRlIHRoaXMuc3ViSWRNYXBbc3ViSWRdO1xuICB9XG59O1xuXG4vKipcbiAqIEdldCBhIGxpc3Qgb2YgYWxsIHN1YnNjcmlwdGlvbnMgaW4gdGhlIHN1YnNjcmlwdGlvbiBtYXAuXG4gKi9cblN1YnNjcmlwdGlvbk1hcC5wcm90b3R5cGUuZ2V0QWxsU3Vic2NyaXB0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gVXRpbHMudmFsdWVzKHRoaXMuc3ViRXZlbnROYW1lTWFwKS5yZWR1Y2UoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhLmNvbmNhdChiKTtcbiAgfSwgW10pO1xufTtcblxuLyoqXG4gKiBHZXQgYSBsaXN0IG9mIHN1YnNjcmlwdGlvbnMgZm9yIHRoZSBnaXZlbiBldmVudCBuYW1lLCBvciBhbiBlbXB0eVxuICogbGlzdCBpZiB0aGVyZSBhcmUgbm8gc3Vic2NyaXB0aW9ucy5cbiAqL1xuU3Vic2NyaXB0aW9uTWFwLnByb3RvdHlwZS5nZXRTdWJzY3JpcHRpb25zID0gZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gIHJldHVybiB0aGlzLnN1YkV2ZW50TmFtZU1hcFtldmVudE5hbWVdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBBbiBvYmplY3Qgd2hpY2ggbWFpbnRhaW5zIGEgbWFwIG9mIHN1YnNjcmlwdGlvbnMgYW5kIHNlcnZlcyBhcyB0aGVcbiAqIG1lY2hhbmlzbSBmb3IgdHJpZ2dlcmluZyBldmVudHMgdG8gYmUgaGFuZGxlZCBieSBzdWJzY3JpYmVycy5cbiAqL1xudmFyIEV2ZW50QnVzID0gZnVuY3Rpb24ocGFyYW1zSW4pIHtcbiAgdmFyIHBhcmFtcyA9IHBhcmFtc0luIHx8IHt9O1xuXG4gIHRoaXMuc3ViTWFwID0gbmV3IFN1YnNjcmlwdGlvbk1hcCgpO1xuICB0aGlzLmxvZ0V2ZW50cyA9IHBhcmFtcy5sb2dFdmVudHMgfHwgZmFsc2U7XG59O1xuXG4vKipcbiAqIFN1YnNjcmliZSB0byB0aGUgbmFtZWQgZXZlbnQuICBSZXR1cm5zIGEgbmV3IFN1YnNjcmlwdGlvbiBvYmplY3RcbiAqIHdoaWNoIGNhbiBiZSB1c2VkIHRvIHVuc3Vic2NyaWJlLlxuICovXG5FdmVudEJ1cy5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24oZXZlbnROYW1lLCBmKSB7XG4gIFV0aWxzLmFzc2VydE5vdE51bGwoZXZlbnROYW1lLCBcImV2ZW50TmFtZVwiKTtcbiAgVXRpbHMuYXNzZXJ0Tm90TnVsbChmLCBcImZcIik7XG4gIFV0aWxzLmFzc2VydFRydWUoVXRpbHMuaXNGdW5jdGlvbihmKSwgXCJmIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgcmV0dXJuIHRoaXMuc3ViTWFwLnN1YnNjcmliZShldmVudE5hbWUsIGYpO1xufTtcblxuLyoqXG4gKiBTdWJzY3JpYmUgYSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb24gYWxsIGV2ZW50cy5cbiAqL1xuRXZlbnRCdXMucHJvdG90eXBlLnN1YnNjcmliZUFsbCA9IGZ1bmN0aW9uKGYpIHtcbiAgVXRpbHMuYXNzZXJ0Tm90TnVsbChmLCBcImZcIik7XG4gIFV0aWxzLmFzc2VydFRydWUoVXRpbHMuaXNGdW5jdGlvbihmKSwgXCJmIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgcmV0dXJuIHRoaXMuc3ViTWFwLnN1YnNjcmliZShBTExfRVZFTlRTLCBmKTtcbn07XG5cbi8qKlxuICogR2V0IGEgbGlzdCBvZiBzdWJzY3JpcHRpb25zIGZvciB0aGUgZ2l2ZW4gZXZlbnQgbmFtZSwgb3IgYW4gZW1wdHlcbiAqIGxpc3QgaWYgdGhlcmUgYXJlIG5vIHN1YnNjcmlwdGlvbnMuXG4gKi9cbkV2ZW50QnVzLnByb3RvdHlwZS5nZXRTdWJzY3JpcHRpb25zID0gZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gIHJldHVybiB0aGlzLnN1Yk1hcC5nZXRTdWJzY3JpcHRpb25zKGV2ZW50TmFtZSk7XG59O1xuXG4vKipcbiAqIFRyaWdnZXIgdGhlIGdpdmVuIGV2ZW50IHdpdGggdGhlIGdpdmVuIGRhdGEuICBBbGwgbWV0aG9kcyBzdWJzY3JpYmVkXG4gKiB0byB0aGlzIGV2ZW50IHdpbGwgYmUgY2FsbGVkIGFuZCBhcmUgcHJvdmlkZWQgd2l0aCB0aGUgZ2l2ZW4gYXJiaXRyYXJ5XG4gKiBkYXRhIG9iamVjdCBhbmQgdGhlIG5hbWUgb2YgdGhlIGV2ZW50LCBpbiB0aGF0IG9yZGVyLlxuICovXG5FdmVudEJ1cy5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSkge1xuICBVdGlscy5hc3NlcnROb3ROdWxsKGV2ZW50TmFtZSwgXCJldmVudE5hbWVcIik7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGFsbEV2ZW50U3VicyA9IHRoaXMuc3ViTWFwLmdldFN1YnNjcmlwdGlvbnMoQUxMX0VWRU5UUyk7XG4gIHZhciBldmVudFN1YnMgPSB0aGlzLnN1Yk1hcC5nZXRTdWJzY3JpcHRpb25zKGV2ZW50TmFtZSk7XG5cbiAgLy8gaWYgKHRoaXMubG9nRXZlbnRzICYmIChldmVudE5hbWUgIT09IGNvbm5lY3QuRXZlbnRUeXBlLkxPRyAmJiBldmVudE5hbWUgIT09IGNvbm5lY3QuRXZlbnRUeXBlLk1BU1RFUl9SRVNQT05TRSAmJiBldmVudE5hbWUgIT09IGNvbm5lY3QuRXZlbnRUeXBlLkFQSV9NRVRSSUMpKSB7XG4gIC8vICAgIGNvbm5lY3QuZ2V0TG9nKCkudHJhY2UoXCJQdWJsaXNoaW5nIGV2ZW50OiAlc1wiLCBldmVudE5hbWUpO1xuICAvLyB9XG5cbiAgYWxsRXZlbnRTdWJzLmNvbmNhdChldmVudFN1YnMpLmZvckVhY2goZnVuY3Rpb24oc3ViKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN1Yi5mKGRhdGEgfHwgbnVsbCwgZXZlbnROYW1lLCBzZWxmKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyAgIGNvbm5lY3RcbiAgICAgIC8vICAgICAuZ2V0TG9nKClcbiAgICAgIC8vICAgICAuZXJyb3IoXCInJXMnIGV2ZW50IGhhbmRsZXIgZmFpbGVkLlwiLCBldmVudE5hbWUpXG4gICAgICAvLyAgICAgLndpdGhFeGNlcHRpb24oZSk7XG4gICAgfVxuICB9KTtcbn07XG5cbi8qKlxuICogVHJpZ2dlciB0aGUgZ2l2ZW4gZXZlbnQgd2l0aCB0aGUgZ2l2ZW4gZGF0YS4gIEFsbCBtZXRob2RzIHN1YnNjcmliZWRcbiAqIHRvIHRoaXMgZXZlbnQgd2lsbCBiZSBjYWxsZWQgYW5kIGFyZSBwcm92aWRlZCB3aXRoIHRoZSBnaXZlbiBhcmJpdHJhcnlcbiAqIGRhdGEgb2JqZWN0IGFuZCB0aGUgbmFtZSBvZiB0aGUgZXZlbnQsIGluIHRoYXQgb3JkZXIuXG4gKi9cbkV2ZW50QnVzLnByb3RvdHlwZS50cmlnZ2VyQXN5bmMgPSBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnRyaWdnZXIoZXZlbnROYW1lLCBkYXRhKSwgMCk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYSBjbG9zdXJlIHdoaWNoIGJyaWRnZXMgYW4gZXZlbnQgZnJvbSBhbm90aGVyIEV2ZW50QnVzIHRvIHRoaXMgYnVzLlxuICpcbiAqIFVzYWdlOlxuICogY29uZHVpdC5vblVwc3RyZWFtKFwiTXlFdmVudFwiLCBidXMuYnJpZGdlKCkpO1xuICovXG5FdmVudEJ1cy5wcm90b3R5cGUuYnJpZGdlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEsIGV2ZW50KSB7XG4gICAgc2VsZi50cmlnZ2VyKGV2ZW50LCBkYXRhKTtcbiAgfTtcbn07XG5cbi8qKlxuICogVW5zdWJzY3JpYmUgYWxsIGV2ZW50cyBpbiB0aGUgZXZlbnQgYnVzLlxuICovXG5FdmVudEJ1cy5wcm90b3R5cGUudW5zdWJzY3JpYmVBbGwgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zdWJNYXAuZ2V0QWxsU3Vic2NyaXB0aW9ucygpLmZvckVhY2goZnVuY3Rpb24oc3ViKSB7XG4gICAgc3ViLnVuc3Vic2NyaWJlKCk7XG4gIH0pO1xufTtcblxuZXhwb3J0IHsgRXZlbnRCdXMgfTtcbiIsImNsYXNzIFZhbHVlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLm5hbWUgPSBcIlZhbHVlRXJyb3JcIjtcbiAgICBjb25zb2xlLmxvZyhcIkVYQ0VQVElPTjogXCIgKyB0aGlzLm5hbWUgKyBcIiBNRVNTQUdFOiBcIiArIHRoaXMubWVzc2FnZSk7XG4gIH1cbn1cblxuY2xhc3MgVW5JbXBsZW1lbnRlZE1ldGhvZEV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubmFtZSA9IFwiVW5JbXBsZW1lbnRlZE1ldGhvZFwiO1xuICAgIGNvbnNvbGUubG9nKFwiRVhDRVBUSU9OOiBcIiArIHRoaXMubmFtZSArIFwiIE1FU1NBR0U6IFwiICsgdGhpcy5tZXNzYWdlKTtcbiAgfVxufVxuXG5jbGFzcyBJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb24gZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIGFyZ3VtZW50KSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5uYW1lID0gXCJJbGxlZ2FsQXJndW1lbnRcIjtcbiAgICB0aGlzLmFyZ3VtZW50ID0gYXJndW1lbnQ7XG4gICAgY29uc29sZS5sb2coXCJFWENFUFRJT046IFwiICsgdGhpcy5uYW1lICsgXCIgTUVTU0FHRTogXCIgKyB0aGlzLm1lc3NhZ2UpO1xuICB9XG59XG5cbmNsYXNzIElsbGVnYWxTdGF0ZUV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubmFtZSA9IFwiSWxsZWdhbFN0YXRlXCI7XG4gICAgY29uc29sZS5sb2coXCJFWENFUFRJT046IFwiICsgdGhpcy5uYW1lICsgXCIgTUVTU0FHRTogXCIgKyB0aGlzLm1lc3NhZ2UpO1xuICB9XG59XG5cbmNsYXNzIElsbGVnYWxKc29uRXhjZXB0aW9uIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBhcmdzKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5uYW1lID0gXCJJbGxlZ2FsU3RhdGVcIjtcbiAgICB0aGlzLmNhdXNlRXhjZXB0aW9uID0gYXJncy5jYXVzZUV4Y2VwdGlvbjtcbiAgICB0aGlzLm9yaWdpbmFsSnNvblN0cmluZyA9IGFyZ3Mub3JpZ2luYWxKc29uU3RyaW5nO1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgXCJFWENFUFRJT046IFwiICtcbiAgICAgICAgdGhpcy5uYW1lICtcbiAgICAgICAgXCIgTUVTU0FHRTogXCIgK1xuICAgICAgICB0aGlzLm1lc3NhZ2UgK1xuICAgICAgICBcIiBjYXVzZTogXCIgK1xuICAgICAgICB0aGlzLmNhdXNlRXhjZXB0aW9uXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQge1xuICBVbkltcGxlbWVudGVkTWV0aG9kRXhjZXB0aW9uLFxuICBJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb24sXG4gIElsbGVnYWxTdGF0ZUV4Y2VwdGlvbixcbiAgSWxsZWdhbEpzb25FeGNlcHRpb24sXG4gIFZhbHVlRXJyb3Jcbn07XG4iLCJjbGFzcyBHbG9iYWxDb25maWdJbXBsIHtcbiAgdXBkYXRlKGNvbmZpZ0lucHV0KSB7XG4gICAgdmFyIGNvbmZpZyA9IGNvbmZpZ0lucHV0IHx8IHt9O1xuICAgIHRoaXMucmVnaW9uID0gY29uZmlnLnJlZ2lvbiB8fCB0aGlzLnJlZ2lvbjtcbiAgICB0aGlzLmVuZHBvaW50T3ZlcnJpZGUgPSBjb25maWcuZW5kcG9pbnQgfHwgdGhpcy5lbmRwb2ludE92ZXJyaWRlO1xuICB9XG5cbiAgZ2V0UmVnaW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lvbjtcbiAgfVxuXG4gIGdldEVuZHBvaW50T3ZlcnJpZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5kcG9pbnRPdmVycmlkZTtcbiAgfVxufVxuXG5jb25zdCBHbG9iYWxDb25maWcgPSBuZXcgR2xvYmFsQ29uZmlnSW1wbCgpO1xuXG5leHBvcnQgeyBHbG9iYWxDb25maWcgfTtcbiIsIi8qZXNsaW50IG5vLXVudXNlZC12YXJzOiBcIm9mZlwiKi9cbmltcG9ydCB7IENoYXRTZXNzaW9uT2JqZWN0IH0gZnJvbSBcIi4vY29yZS9jaGF0U2Vzc2lvblwiO1xuaW1wb3J0IHsgQ0hBVF9FVkVOVFMsIFNFU1NJT05fVFlQRVMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcblxuZ2xvYmFsLmNvbm5lY3QgPSBnbG9iYWwuY29ubmVjdCB8fCB7fTtcbmNvbm5lY3QuQ2hhdFNlc3Npb24gPSBDaGF0U2Vzc2lvbk9iamVjdDtcbmNvbm5lY3QuQ2hhdEV2ZW50cyA9IENIQVRfRVZFTlRTO1xuY29ubmVjdC5TZXNzaW9uVHlwZXMgPSBTRVNTSU9OX1RZUEVTO1xuXG5leHBvcnQgY29uc3QgQ2hhdFNlc3Npb24gPSBDaGF0U2Vzc2lvbk9iamVjdDtcbmV4cG9ydCBjb25zdCBDaGF0RXZlbnRzID0gQ0hBVF9FVkVOVFM7XG5leHBvcnQgY29uc3QgU2Vzc2lvblR5cGVzID0gU0VTU0lPTl9UWVBFUztcbiIsImltcG9ydCBVdGlscyBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgTE9HU19ERVNUSU5BVElPTiB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuXG4vKmVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzKi9cbmNsYXNzIExvZ2dlciB7XG4gIGRlYnVnKGRhdGEpIHt9XG5cbiAgaW5mbyhkYXRhKSB7fVxuXG4gIHdhcm4oZGF0YSkge31cblxuICBlcnJvcihkYXRhKSB7fVxufVxuLyplc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzKi9cblxuY29uc3QgTG9nTGV2ZWwgPSB7XG4gIERFQlVHOiAxMCxcbiAgSU5GTzogMjAsXG4gIFdBUk46IDMwLFxuICBFUlJPUjogNDBcbn07XG5cbmNsYXNzIExvZ01hbmFnZXJJbXBsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy51cGRhdGVMb2dnZXJDb25maWcoKTtcbiAgICB0aGlzLmNvbnNvbGVMb2dnZXJXcmFwcGVyID0gY3JlYXRlQ29uc29sZUxvZ2dlcigpO1xuICB9XG5cbiAgd3JpdGVUb0NsaWVudExvZ2dlcihsZXZlbCwgbG9nU3RhdGVtZW50KSB7XG4gICAgaWYgKCF0aGlzLmhhc0NsaWVudExvZ2dlcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN3aXRjaCAobGV2ZWwpIHtcbiAgICAgIGNhc2UgTG9nTGV2ZWwuREVCVUc6XG4gICAgICAgIHJldHVybiB0aGlzLl9jbGllbnRMb2dnZXIuZGVidWcobG9nU3RhdGVtZW50KTtcbiAgICAgIGNhc2UgTG9nTGV2ZWwuSU5GTzpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudExvZ2dlci5pbmZvKGxvZ1N0YXRlbWVudCk7XG4gICAgICBjYXNlIExvZ0xldmVsLldBUk46XG4gICAgICAgIHJldHVybiB0aGlzLl9jbGllbnRMb2dnZXIud2Fybihsb2dTdGF0ZW1lbnQpO1xuICAgICAgY2FzZSBMb2dMZXZlbC5FUlJPUjpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudExvZ2dlci5lcnJvcihsb2dTdGF0ZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIGlzTGV2ZWxFbmFibGVkKGxldmVsKSB7XG4gICAgcmV0dXJuIGxldmVsID49IHRoaXMuX2xldmVsO1xuICB9XG5cbiAgaGFzQ2xpZW50TG9nZ2VyKCkge1xuICAgIHJldHVybiB0aGlzLl9jbGllbnRMb2dnZXIgIT09IG51bGw7XG4gIH1cblxuICBnZXRMb2dnZXIob3B0aW9ucykge1xuICAgIHZhciBwcmVmaXggPSBvcHRpb25zLnByZWZpeCB8fCBcIlwiO1xuICAgIGlmICh0aGlzLl9sb2dzRGVzdGluYXRpb24gPT09IExPR1NfREVTVElOQVRJT04uREVCVUcpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnNvbGVMb2dnZXJXcmFwcGVyO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IExvZ2dlcldyYXBwZXJJbXBsKHByZWZpeCk7XG4gIH1cblxuICB1cGRhdGVMb2dnZXJDb25maWcoaW5wdXRDb25maWcpIHtcbiAgICB2YXIgY29uZmlnID0gaW5wdXRDb25maWcgfHwge307XG4gICAgdGhpcy5fbGV2ZWwgPSBjb25maWcubGV2ZWwgfHwgTG9nTGV2ZWwuSU5GTztcbiAgICB0aGlzLl9jbGllbnRMb2dnZXIgPSBjb25maWcubG9nZ2VyIHx8IG51bGw7XG4gICAgdGhpcy5fbG9nc0Rlc3RpbmF0aW9uID0gTE9HU19ERVNUSU5BVElPTi5OVUxMO1xuICAgIGlmIChjb25maWcuZGVidWcpIHtcbiAgICAgIHRoaXMuX2xvZ3NEZXN0aW5hdGlvbiA9IExPR1NfREVTVElOQVRJT04uREVCVUc7XG4gICAgfVxuICAgIGlmIChjb25maWcubG9nZ2VyKSB7XG4gICAgICB0aGlzLl9sb2dzRGVzdGluYXRpb24gPSBMT0dTX0RFU1RJTkFUSU9OLkNMSUVOVF9MT0dHRVI7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIExvZ2dlcldyYXBwZXIge1xuICBkZWJ1ZygpIHt9XG5cbiAgaW5mbygpIHt9XG5cbiAgd2FybigpIHt9XG5cbiAgZXJyb3IoKSB7fVxufVxuXG5jbGFzcyBMb2dnZXJXcmFwcGVySW1wbCBleHRlbmRzIExvZ2dlcldyYXBwZXIge1xuICBjb25zdHJ1Y3RvcihwcmVmaXgpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4IHx8IFwiXCI7XG4gIH1cblxuICBkZWJ1ZyguLi5hcmdzKSB7XG4gICAgdGhpcy5fbG9nKExvZ0xldmVsLkRFQlVHLCBhcmdzKTtcbiAgfVxuXG4gIGluZm8oLi4uYXJncykge1xuICAgIHRoaXMuX2xvZyhMb2dMZXZlbC5JTkZPLCBhcmdzKTtcbiAgfVxuXG4gIHdhcm4oLi4uYXJncykge1xuICAgIHRoaXMuX2xvZyhMb2dMZXZlbC5XQVJOLCBhcmdzKTtcbiAgfVxuXG4gIGVycm9yKC4uLmFyZ3MpIHtcbiAgICB0aGlzLl9sb2coTG9nTGV2ZWwuRVJST1IsIGFyZ3MpO1xuICB9XG5cbiAgX3Nob3VsZExvZyhsZXZlbCkge1xuICAgIHJldHVybiBMb2dNYW5hZ2VyLmhhc0NsaWVudExvZ2dlcigpICYmIExvZ01hbmFnZXIuaXNMZXZlbEVuYWJsZWQobGV2ZWwpO1xuICB9XG5cbiAgX3dyaXRlVG9DbGllbnRMb2dnZXIobGV2ZWwsIGxvZ1N0YXRlbWVudCkge1xuICAgIExvZ01hbmFnZXIud3JpdGVUb0NsaWVudExvZ2dlcihsZXZlbCwgbG9nU3RhdGVtZW50KTtcbiAgfVxuXG4gIF9sb2cobGV2ZWwsIGFyZ3MpIHtcbiAgICBpZiAodGhpcy5fc2hvdWxkTG9nKGxldmVsKSkge1xuICAgICAgdmFyIGxvZ1N0YXRlbWVudCA9IHRoaXMuX2NvbnZlcnRUb1NpbmdsZVN0YXRlbWVudChhcmdzKTtcbiAgICAgIHRoaXMuX3dyaXRlVG9DbGllbnRMb2dnZXIobGV2ZWwsIGxvZ1N0YXRlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgX2NvbnZlcnRUb1NpbmdsZVN0YXRlbWVudChhcmdzKSB7XG4gICAgdmFyIGxvZ1N0YXRlbWVudCA9IFwiXCI7XG4gICAgaWYgKHRoaXMucHJlZml4KSB7XG4gICAgICBsb2dTdGF0ZW1lbnQgKz0gdGhpcy5wcmVmaXggKyBcIiBcIjtcbiAgICB9XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGFyZ3MubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJnc1tpbmRleF07XG4gICAgICBsb2dTdGF0ZW1lbnQgKz0gdGhpcy5fY29udmVydFRvU3RyaW5nKGFyZykgKyBcIiBcIjtcbiAgICB9XG4gICAgcmV0dXJuIGxvZ1N0YXRlbWVudDtcbiAgfVxuXG4gIF9jb252ZXJ0VG9TdHJpbmcoYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghYXJnKSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgfVxuICAgICAgaWYgKFV0aWxzLmlzU3RyaW5nKGFyZykpIHtcbiAgICAgICAgcmV0dXJuIGFyZztcbiAgICAgIH1cbiAgICAgIGlmIChVdGlscy5pc09iamVjdChhcmcpICYmIFV0aWxzLmlzRnVuY3Rpb24oYXJnLnRvU3RyaW5nKSkge1xuICAgICAgICB2YXIgdG9TdHJpbmdSZXN1bHQgPSBhcmcudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKHRvU3RyaW5nUmVzdWx0ICE9PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAgICAgICAgcmV0dXJuIHRvU3RyaW5nUmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHdoaWxlIGNvbnZlcnRpbmcgYXJndW1lbnQgdG8gc3RyaW5nXCIsIGFyZywgZXJyb3IpO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9XG59XG5cbnZhciBjcmVhdGVDb25zb2xlTG9nZ2VyID0gKCkgPT4ge1xuICB2YXIgbG9nZ2VyID0gbmV3IExvZ2dlcldyYXBwZXIoKTtcbiAgbG9nZ2VyLmRlYnVnID0gY29uc29sZS5kZWJ1Zy5iaW5kKHdpbmRvdy5jb25zb2xlKTtcbiAgbG9nZ2VyLmluZm8gPSBjb25zb2xlLmluZm8uYmluZCh3aW5kb3cuY29uc29sZSk7XG4gIGxvZ2dlci53YXJuID0gY29uc29sZS53YXJuLmJpbmQod2luZG93LmNvbnNvbGUpO1xuICBsb2dnZXIuZXJyb3IgPSBjb25zb2xlLmVycm9yLmJpbmQod2luZG93LmNvbnNvbGUpO1xuICByZXR1cm4gbG9nZ2VyO1xufTtcblxuY29uc3QgTG9nTWFuYWdlciA9IG5ldyBMb2dNYW5hZ2VySW1wbCgpO1xuXG5leHBvcnQgeyBMb2dNYW5hZ2VyLCBMb2dnZXIsIExvZ0xldmVsIH07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuLy8gQmVsb3cgaXMgdGhlIFBhaG8gbXF0dCB2ZXJzaW9uIDEuMC4xXG4vLyBQbGVhc2UgdGVzdCBwcm9wZXJseSBpZiB5b3UgY2hhbmdlIHRoZSB2ZXJzaW9uIG9mIHRoaXMgZmlsZS5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgSUJNIENvcnAuXG4gKlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC4gVGhpcyBwcm9ncmFtIGFuZCB0aGUgYWNjb21wYW55aW5nIG1hdGVyaWFsc1xuICogYXJlIG1hZGUgYXZhaWxhYmxlIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgRWNsaXBzZSBQdWJsaWMgTGljZW5zZSB2MS4wXG4gKiBhbmQgRWNsaXBzZSBEaXN0cmlidXRpb24gTGljZW5zZSB2MS4wIHdoaWNoIGFjY29tcGFueSB0aGlzIGRpc3RyaWJ1dGlvbi5cbiAqXG4gKiBUaGUgRWNsaXBzZSBQdWJsaWMgTGljZW5zZSBpcyBhdmFpbGFibGUgYXRcbiAqICAgIGh0dHA6Ly93d3cuZWNsaXBzZS5vcmcvbGVnYWwvZXBsLXYxMC5odG1sXG4gKiBhbmQgdGhlIEVjbGlwc2UgRGlzdHJpYnV0aW9uIExpY2Vuc2UgaXMgYXZhaWxhYmxlIGF0XG4gKiAgIGh0dHA6Ly93d3cuZWNsaXBzZS5vcmcvb3JnL2RvY3VtZW50cy9lZGwtdjEwLnBocC5cbiAqXG4gKiBDb250cmlidXRvcnM6XG4gKiAgICBBbmRyZXcgQmFua3MgLSBpbml0aWFsIEFQSSBhbmQgaW1wbGVtZW50YXRpb24gYW5kIGluaXRpYWwgZG9jdW1lbnRhdGlvblxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIE9ubHkgZXhwb3NlIGEgc2luZ2xlIG9iamVjdCBuYW1lIGluIHRoZSBnbG9iYWwgbmFtZXNwYWNlLlxuLy8gRXZlcnl0aGluZyBtdXN0IGdvIHRocm91Z2ggdGhpcyBtb2R1bGUuIEdsb2JhbCBQYWhvIG1vZHVsZVxuLy8gb25seSBoYXMgYSBzaW5nbGUgcHVibGljIGZ1bmN0aW9uLCBjbGllbnQsIHdoaWNoIHJldHVybnNcbi8vIGEgUGFobyBjbGllbnQgb2JqZWN0IGdpdmVuIGNvbm5lY3Rpb24gZGV0YWlscy5cblxuLyoqXG4gKiBTZW5kIGFuZCByZWNlaXZlIG1lc3NhZ2VzIHVzaW5nIHdlYiBicm93c2Vycy5cbiAqIDxwPlxuICogVGhpcyBwcm9ncmFtbWluZyBpbnRlcmZhY2UgbGV0cyBhIEphdmFTY3JpcHQgY2xpZW50IGFwcGxpY2F0aW9uIHVzZSB0aGUgTVFUVCBWMy4xIG9yXG4gKiBWMy4xLjEgcHJvdG9jb2wgdG8gY29ubmVjdCB0byBhbiBNUVRULXN1cHBvcnRpbmcgbWVzc2FnaW5nIHNlcnZlci5cbiAqXG4gKiBUaGUgZnVuY3Rpb24gc3VwcG9ydGVkIGluY2x1ZGVzOlxuICogPG9sPlxuICogPGxpPkNvbm5lY3RpbmcgdG8gYW5kIGRpc2Nvbm5lY3RpbmcgZnJvbSBhIHNlcnZlci4gVGhlIHNlcnZlciBpcyBpZGVudGlmaWVkIGJ5IGl0cyBob3N0IG5hbWUgYW5kIHBvcnQgbnVtYmVyLlxuICogPGxpPlNwZWNpZnlpbmcgb3B0aW9ucyB0aGF0IHJlbGF0ZSB0byB0aGUgY29tbXVuaWNhdGlvbnMgbGluayB3aXRoIHRoZSBzZXJ2ZXIsXG4gKiBmb3IgZXhhbXBsZSB0aGUgZnJlcXVlbmN5IG9mIGtlZXAtYWxpdmUgaGVhcnRiZWF0cywgYW5kIHdoZXRoZXIgU1NML1RMUyBpcyByZXF1aXJlZC5cbiAqIDxsaT5TdWJzY3JpYmluZyB0byBhbmQgcmVjZWl2aW5nIG1lc3NhZ2VzIGZyb20gTVFUVCBUb3BpY3MuXG4gKiA8bGk+UHVibGlzaGluZyBtZXNzYWdlcyB0byBNUVRUIFRvcGljcy5cbiAqIDwvb2w+XG4gKiA8cD5cbiAqIFRoZSBBUEkgY29uc2lzdHMgb2YgdHdvIG1haW4gb2JqZWN0czpcbiAqIDxkbD5cbiAqIDxkdD48Yj57QGxpbmsgUGFoby5DbGllbnR9PC9iPjwvZHQ+XG4gKiA8ZGQ+VGhpcyBjb250YWlucyBtZXRob2RzIHRoYXQgcHJvdmlkZSB0aGUgZnVuY3Rpb25hbGl0eSBvZiB0aGUgQVBJLFxuICogaW5jbHVkaW5nIHByb3Zpc2lvbiBvZiBjYWxsYmFja3MgdGhhdCBub3RpZnkgdGhlIGFwcGxpY2F0aW9uIHdoZW4gYSBtZXNzYWdlXG4gKiBhcnJpdmVzIGZyb20gb3IgaXMgZGVsaXZlcmVkIHRvIHRoZSBtZXNzYWdpbmcgc2VydmVyLFxuICogb3Igd2hlbiB0aGUgc3RhdHVzIG9mIGl0cyBjb25uZWN0aW9uIHRvIHRoZSBtZXNzYWdpbmcgc2VydmVyIGNoYW5nZXMuPC9kZD5cbiAqIDxkdD48Yj57QGxpbmsgUGFoby5NZXNzYWdlfTwvYj48L2R0PlxuICogPGRkPlRoaXMgZW5jYXBzdWxhdGVzIHRoZSBwYXlsb2FkIG9mIHRoZSBtZXNzYWdlIGFsb25nIHdpdGggdmFyaW91cyBhdHRyaWJ1dGVzXG4gKiBhc3NvY2lhdGVkIHdpdGggaXRzIGRlbGl2ZXJ5LCBpbiBwYXJ0aWN1bGFyIHRoZSBkZXN0aW5hdGlvbiB0byB3aGljaCBpdCBoYXNcbiAqIGJlZW4gKG9yIGlzIGFib3V0IHRvIGJlKSBzZW50LjwvZGQ+XG4gKiA8L2RsPlxuICogPHA+XG4gKiBUaGUgcHJvZ3JhbW1pbmcgaW50ZXJmYWNlIHZhbGlkYXRlcyBwYXJhbWV0ZXJzIHBhc3NlZCB0byBpdCwgYW5kIHdpbGwgdGhyb3dcbiAqIGFuIEVycm9yIGNvbnRhaW5pbmcgYW4gZXJyb3IgbWVzc2FnZSBpbnRlbmRlZCBmb3IgZGV2ZWxvcGVyIHVzZSwgaWYgaXQgZGV0ZWN0c1xuICogYW4gZXJyb3Igd2l0aCBhbnkgcGFyYW1ldGVyLlxuICogPHA+XG4gKiBFeGFtcGxlOlxuICpcbiAqIDxjb2RlPjxwcmU+XG52YXIgY2xpZW50ID0gbmV3IFBhaG8uTVFUVC5DbGllbnQobG9jYXRpb24uaG9zdG5hbWUsIE51bWJlcihsb2NhdGlvbi5wb3J0KSwgXCJjbGllbnRJZFwiKTtcbmNsaWVudC5vbkNvbm5lY3Rpb25Mb3N0ID0gb25Db25uZWN0aW9uTG9zdDtcbmNsaWVudC5vbk1lc3NhZ2VBcnJpdmVkID0gb25NZXNzYWdlQXJyaXZlZDtcbmNsaWVudC5jb25uZWN0KHtvblN1Y2Nlc3M6b25Db25uZWN0fSk7XG5cbmZ1bmN0aW9uIG9uQ29ubmVjdCgpIHtcbiAgLy8gT25jZSBhIGNvbm5lY3Rpb24gaGFzIGJlZW4gbWFkZSwgbWFrZSBhIHN1YnNjcmlwdGlvbiBhbmQgc2VuZCBhIG1lc3NhZ2UuXG4gIGNvbnNvbGUubG9nKFwib25Db25uZWN0XCIpO1xuICBjbGllbnQuc3Vic2NyaWJlKFwiL1dvcmxkXCIpO1xuICB2YXIgbWVzc2FnZSA9IG5ldyBQYWhvLk1RVFQuTWVzc2FnZShcIkhlbGxvXCIpO1xuICBtZXNzYWdlLmRlc3RpbmF0aW9uTmFtZSA9IFwiL1dvcmxkXCI7XG4gIGNsaWVudC5zZW5kKG1lc3NhZ2UpO1xufTtcbmZ1bmN0aW9uIG9uQ29ubmVjdGlvbkxvc3QocmVzcG9uc2VPYmplY3QpIHtcbiAgaWYgKHJlc3BvbnNlT2JqZWN0LmVycm9yQ29kZSAhPT0gMClcblx0Y29uc29sZS5sb2coXCJvbkNvbm5lY3Rpb25Mb3N0OlwiK3Jlc3BvbnNlT2JqZWN0LmVycm9yTWVzc2FnZSk7XG59O1xuZnVuY3Rpb24gb25NZXNzYWdlQXJyaXZlZChtZXNzYWdlKSB7XG4gIGNvbnNvbGUubG9nKFwib25NZXNzYWdlQXJyaXZlZDpcIittZXNzYWdlLnBheWxvYWRTdHJpbmcpO1xuICBjbGllbnQuZGlzY29ubmVjdCgpO1xufTtcbiAqIDwvcHJlPjwvY29kZT5cbiAqIEBuYW1lc3BhY2UgUGFob1xuICovXG5cbi8qIGpzaGludCBzaGFkb3c6dHJ1ZSAqL1xuKGZ1bmN0aW9uIEV4cG9ydExpYnJhcnkocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICAvL2lmICh0eXBlb2Ygcm9vdC5QYWhvID09PSBcInVuZGVmaW5lZFwiKXtcbiAgICAvL1x0cm9vdC5QYWhvID0ge307XG4gICAgLy99XG4gICAgcm9vdC5QYWhvID0gZmFjdG9yeSgpO1xuICB9XG59KSh0aGlzLCBmdW5jdGlvbiBMaWJyYXJ5RmFjdG9yeSgpIHtcbiAgdmFyIFBhaG9NUVRUID0gKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIC8vIFByaXZhdGUgdmFyaWFibGVzIGJlbG93LCB0aGVzZSBhcmUgb25seSB2aXNpYmxlIGluc2lkZSB0aGUgZnVuY3Rpb24gY2xvc3VyZVxuICAgIC8vIHdoaWNoIGlzIHVzZWQgdG8gZGVmaW5lIHRoZSBtb2R1bGUuXG4gICAgdmFyIHZlcnNpb24gPSBcIkBWRVJTSU9OQC1AQlVJTERMRVZFTEBcIjtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdmFyIGxvY2FsU3RvcmFnZSA9XG4gICAgICBnbG9iYWwubG9jYWxTdG9yYWdlIHx8XG4gICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRhID0ge307XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzZXRJdGVtOiBmdW5jdGlvbihrZXksIGl0ZW0pIHtcbiAgICAgICAgICAgIGRhdGFba2V5XSA9IGl0ZW07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXRJdGVtOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhW2tleV07XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZW1vdmVJdGVtOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkoKTtcblxuICAgIC8qKlxuICAgICAqIFVuaXF1ZSBtZXNzYWdlIHR5cGUgaWRlbnRpZmllcnMsIHdpdGggYXNzb2NpYXRlZFxuICAgICAqIGFzc29jaWF0ZWQgaW50ZWdlciB2YWx1ZXMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB2YXIgTUVTU0FHRV9UWVBFID0ge1xuICAgICAgQ09OTkVDVDogMSxcbiAgICAgIENPTk5BQ0s6IDIsXG4gICAgICBQVUJMSVNIOiAzLFxuICAgICAgUFVCQUNLOiA0LFxuICAgICAgUFVCUkVDOiA1LFxuICAgICAgUFVCUkVMOiA2LFxuICAgICAgUFVCQ09NUDogNyxcbiAgICAgIFNVQlNDUklCRTogOCxcbiAgICAgIFNVQkFDSzogOSxcbiAgICAgIFVOU1VCU0NSSUJFOiAxMCxcbiAgICAgIFVOU1VCQUNLOiAxMSxcbiAgICAgIFBJTkdSRVE6IDEyLFxuICAgICAgUElOR1JFU1A6IDEzLFxuICAgICAgRElTQ09OTkVDVDogMTRcbiAgICB9O1xuXG4gICAgLy8gQ29sbGVjdGlvbiBvZiB1dGlsaXR5IG1ldGhvZHMgdXNlZCB0byBzaW1wbGlmeSBtb2R1bGUgY29kZVxuICAgIC8vIGFuZCBwcm9tb3RlIHRoZSBEUlkgcGF0dGVybi5cblxuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlIGFuIG9iamVjdCdzIHBhcmFtZXRlciBuYW1lcyB0byBlbnN1cmUgdGhleVxuICAgICAqIG1hdGNoIGEgbGlzdCBvZiBleHBlY3RlZCB2YXJpYWJsZXMgbmFtZSBmb3IgdGhpcyBvcHRpb25cbiAgICAgKiB0eXBlLiBVc2VkIHRvIGVuc3VyZSBvcHRpb24gb2JqZWN0IHBhc3NlZCBpbnRvIHRoZSBBUEkgZG9uJ3RcbiAgICAgKiBjb250YWluIGVycm9uZW91cyBwYXJhbWV0ZXJzLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogLSBVc2VyIG9wdGlvbnMgb2JqZWN0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleXMgLSB2YWxpZCBrZXlzIGFuZCB0eXBlcyB0aGF0IG1heSBleGlzdCBpbiBvYmouXG4gICAgICogQHRocm93cyB7RXJyb3J9IEludmFsaWQgb3B0aW9uIHBhcmFtZXRlciBmb3VuZC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHZhciB2YWxpZGF0ZSA9IGZ1bmN0aW9uKG9iaiwga2V5cykge1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBpZiAoa2V5cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9ialtrZXldICE9PSBrZXlzW2tleV0pXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBmb3JtYXQoRVJST1IuSU5WQUxJRF9UWVBFLCBbdHlwZW9mIG9ialtrZXldLCBrZXldKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZXJyb3JTdHIgPVxuICAgICAgICAgICAgICBcIlVua25vd24gcHJvcGVydHksIFwiICsga2V5ICsgXCIuIFZhbGlkIHByb3BlcnRpZXMgYXJlOlwiO1xuICAgICAgICAgICAgZm9yICh2YXIgdmFsaWRLZXkgaW4ga2V5cylcbiAgICAgICAgICAgICAgaWYgKGtleXMuaGFzT3duUHJvcGVydHkodmFsaWRLZXkpKVxuICAgICAgICAgICAgICAgIGVycm9yU3RyID0gZXJyb3JTdHIgKyBcIiBcIiArIHZhbGlkS2V5O1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yU3RyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEgbmV3IGZ1bmN0aW9uIHdoaWNoIHJ1bnMgdGhlIHVzZXIgZnVuY3Rpb24gYm91bmRcbiAgICAgKiB0byBhIGZpeGVkIHNjb3BlLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFVzZXIgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gRnVuY3Rpb24gc2NvcGVcbiAgICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gVXNlciBmdW5jdGlvbiBib3VuZCB0byBhbm90aGVyIHNjb3BlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB2YXIgc2NvcGUgPSBmdW5jdGlvbihmLCBzY29wZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZi5hcHBseShzY29wZSwgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVuaXF1ZSBtZXNzYWdlIHR5cGUgaWRlbnRpZmllcnMsIHdpdGggYXNzb2NpYXRlZFxuICAgICAqIGFzc29jaWF0ZWQgaW50ZWdlciB2YWx1ZXMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB2YXIgRVJST1IgPSB7XG4gICAgICBPSzogeyBjb2RlOiAwLCB0ZXh0OiBcIkFNUUpTQzAwMDBJIE9LLlwiIH0sXG4gICAgICBDT05ORUNUX1RJTUVPVVQ6IHsgY29kZTogMSwgdGV4dDogXCJBTVFKU0MwMDAxRSBDb25uZWN0IHRpbWVkIG91dC5cIiB9LFxuICAgICAgU1VCU0NSSUJFX1RJTUVPVVQ6IHsgY29kZTogMiwgdGV4dDogXCJBTVFKUzAwMDJFIFN1YnNjcmliZSB0aW1lZCBvdXQuXCIgfSxcbiAgICAgIFVOU1VCU0NSSUJFX1RJTUVPVVQ6IHtcbiAgICAgICAgY29kZTogMyxcbiAgICAgICAgdGV4dDogXCJBTVFKUzAwMDNFIFVuc3Vic2NyaWJlIHRpbWVkIG91dC5cIlxuICAgICAgfSxcbiAgICAgIFBJTkdfVElNRU9VVDogeyBjb2RlOiA0LCB0ZXh0OiBcIkFNUUpTMDAwNEUgUGluZyB0aW1lZCBvdXQuXCIgfSxcbiAgICAgIElOVEVSTkFMX0VSUk9SOiB7XG4gICAgICAgIGNvZGU6IDUsXG4gICAgICAgIHRleHQ6IFwiQU1RSlMwMDA1RSBJbnRlcm5hbCBlcnJvci4gRXJyb3IgTWVzc2FnZTogezB9LCBTdGFjayB0cmFjZTogezF9XCJcbiAgICAgIH0sXG4gICAgICBDT05OQUNLX1JFVFVSTkNPREU6IHtcbiAgICAgICAgY29kZTogNixcbiAgICAgICAgdGV4dDogXCJBTVFKUzAwMDZFIEJhZCBDb25uYWNrIHJldHVybiBjb2RlOnswfSB7MX0uXCJcbiAgICAgIH0sXG4gICAgICBTT0NLRVRfRVJST1I6IHsgY29kZTogNywgdGV4dDogXCJBTVFKUzAwMDdFIFNvY2tldCBlcnJvcjp7MH0uXCIgfSxcbiAgICAgIFNPQ0tFVF9DTE9TRTogeyBjb2RlOiA4LCB0ZXh0OiBcIkFNUUpTMDAwOEkgU29ja2V0IGNsb3NlZC5cIiB9LFxuICAgICAgTUFMRk9STUVEX1VURjoge1xuICAgICAgICBjb2RlOiA5LFxuICAgICAgICB0ZXh0OiBcIkFNUUpTMDAwOUUgTWFsZm9ybWVkIFVURiBkYXRhOnswfSB7MX0gezJ9LlwiXG4gICAgICB9LFxuICAgICAgVU5TVVBQT1JURUQ6IHtcbiAgICAgICAgY29kZTogMTAsXG4gICAgICAgIHRleHQ6IFwiQU1RSlMwMDEwRSB7MH0gaXMgbm90IHN1cHBvcnRlZCBieSB0aGlzIGJyb3dzZXIuXCJcbiAgICAgIH0sXG4gICAgICBJTlZBTElEX1NUQVRFOiB7IGNvZGU6IDExLCB0ZXh0OiBcIkFNUUpTMDAxMUUgSW52YWxpZCBzdGF0ZSB7MH0uXCIgfSxcbiAgICAgIElOVkFMSURfVFlQRTogeyBjb2RlOiAxMiwgdGV4dDogXCJBTVFKUzAwMTJFIEludmFsaWQgdHlwZSB7MH0gZm9yIHsxfS5cIiB9LFxuICAgICAgSU5WQUxJRF9BUkdVTUVOVDoge1xuICAgICAgICBjb2RlOiAxMyxcbiAgICAgICAgdGV4dDogXCJBTVFKUzAwMTNFIEludmFsaWQgYXJndW1lbnQgezB9IGZvciB7MX0uXCJcbiAgICAgIH0sXG4gICAgICBVTlNVUFBPUlRFRF9PUEVSQVRJT046IHtcbiAgICAgICAgY29kZTogMTQsXG4gICAgICAgIHRleHQ6IFwiQU1RSlMwMDE0RSBVbnN1cHBvcnRlZCBvcGVyYXRpb24uXCJcbiAgICAgIH0sXG4gICAgICBJTlZBTElEX1NUT1JFRF9EQVRBOiB7XG4gICAgICAgIGNvZGU6IDE1LFxuICAgICAgICB0ZXh0OiBcIkFNUUpTMDAxNUUgSW52YWxpZCBkYXRhIGluIGxvY2FsIHN0b3JhZ2Uga2V5PXswfSB2YWx1ZT17MX0uXCJcbiAgICAgIH0sXG4gICAgICBJTlZBTElEX01RVFRfTUVTU0FHRV9UWVBFOiB7XG4gICAgICAgIGNvZGU6IDE2LFxuICAgICAgICB0ZXh0OiBcIkFNUUpTMDAxNkUgSW52YWxpZCBNUVRUIG1lc3NhZ2UgdHlwZSB7MH0uXCJcbiAgICAgIH0sXG4gICAgICBNQUxGT1JNRURfVU5JQ09ERToge1xuICAgICAgICBjb2RlOiAxNyxcbiAgICAgICAgdGV4dDogXCJBTVFKUzAwMTdFIE1hbGZvcm1lZCBVbmljb2RlIHN0cmluZzp7MH0gezF9LlwiXG4gICAgICB9LFxuICAgICAgQlVGRkVSX0ZVTEw6IHtcbiAgICAgICAgY29kZTogMTgsXG4gICAgICAgIHRleHQ6IFwiQU1RSlMwMDE4RSBNZXNzYWdlIGJ1ZmZlciBpcyBmdWxsLCBtYXhpbXVtIGJ1ZmZlciBzaXplOiB7MH0uXCJcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqIENPTk5BQ0sgUkMgTWVhbmluZy4gKi9cbiAgICB2YXIgQ09OTkFDS19SQyA9IHtcbiAgICAgIDA6IFwiQ29ubmVjdGlvbiBBY2NlcHRlZFwiLFxuICAgICAgMTogXCJDb25uZWN0aW9uIFJlZnVzZWQ6IHVuYWNjZXB0YWJsZSBwcm90b2NvbCB2ZXJzaW9uXCIsXG4gICAgICAyOiBcIkNvbm5lY3Rpb24gUmVmdXNlZDogaWRlbnRpZmllciByZWplY3RlZFwiLFxuICAgICAgMzogXCJDb25uZWN0aW9uIFJlZnVzZWQ6IHNlcnZlciB1bmF2YWlsYWJsZVwiLFxuICAgICAgNDogXCJDb25uZWN0aW9uIFJlZnVzZWQ6IGJhZCB1c2VyIG5hbWUgb3IgcGFzc3dvcmRcIixcbiAgICAgIDU6IFwiQ29ubmVjdGlvbiBSZWZ1c2VkOiBub3QgYXV0aG9yaXplZFwiXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZvcm1hdCBhbiBlcnJvciBtZXNzYWdlIHRleHQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge2Vycm9yfSBFUlJPUiB2YWx1ZSBhYm92ZS5cbiAgICAgKiBAcGFyYW0ge3N1YnN0aXR1dGlvbnN9IFthcnJheV0gc3Vic3RpdHV0ZWQgaW50byB0aGUgdGV4dC5cbiAgICAgKiBAcmV0dXJuIHRoZSB0ZXh0IHdpdGggdGhlIHN1YnN0aXR1dGlvbnMgbWFkZS5cbiAgICAgKi9cbiAgICB2YXIgZm9ybWF0ID0gZnVuY3Rpb24oZXJyb3IsIHN1YnN0aXR1dGlvbnMpIHtcbiAgICAgIHZhciB0ZXh0ID0gZXJyb3IudGV4dDtcbiAgICAgIGlmIChzdWJzdGl0dXRpb25zKSB7XG4gICAgICAgIHZhciBmaWVsZCwgc3RhcnQ7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic3RpdHV0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGZpZWxkID0gXCJ7XCIgKyBpICsgXCJ9XCI7XG4gICAgICAgICAgc3RhcnQgPSB0ZXh0LmluZGV4T2YoZmllbGQpO1xuICAgICAgICAgIGlmIChzdGFydCA+IDApIHtcbiAgICAgICAgICAgIHZhciBwYXJ0MSA9IHRleHQuc3Vic3RyaW5nKDAsIHN0YXJ0KTtcbiAgICAgICAgICAgIHZhciBwYXJ0MiA9IHRleHQuc3Vic3RyaW5nKHN0YXJ0ICsgZmllbGQubGVuZ3RoKTtcbiAgICAgICAgICAgIHRleHQgPSBwYXJ0MSArIHN1YnN0aXR1dGlvbnNbaV0gKyBwYXJ0MjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH07XG5cbiAgICAvL01RVFQgcHJvdG9jb2wgYW5kIHZlcnNpb24gICAgICAgICAgNiAgICBNICAgIFEgICAgSSAgICBzICAgIGQgICAgcCAgICAzXG4gICAgdmFyIE1xdHRQcm90b0lkZW50aWZpZXJ2MyA9IFtcbiAgICAgIDB4MDAsXG4gICAgICAweDA2LFxuICAgICAgMHg0ZCxcbiAgICAgIDB4NTEsXG4gICAgICAweDQ5LFxuICAgICAgMHg3MyxcbiAgICAgIDB4NjQsXG4gICAgICAweDcwLFxuICAgICAgMHgwM1xuICAgIF07XG4gICAgLy9NUVRUIHByb3RvL3ZlcnNpb24gZm9yIDMxMSAgICAgICAgIDQgICAgTSAgICBRICAgIFQgICAgVCAgICA0XG4gICAgdmFyIE1xdHRQcm90b0lkZW50aWZpZXJ2NCA9IFsweDAwLCAweDA0LCAweDRkLCAweDUxLCAweDU0LCAweDU0LCAweDA0XTtcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCBhbiBNUVRUIHdpcmUgcHJvdG9jb2wgbWVzc2FnZS5cbiAgICAgKiBAcGFyYW0gdHlwZSBNUVRUIHBhY2tldCB0eXBlLlxuICAgICAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbmFsIHdpcmUgbWVzc2FnZSBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogT3B0aW9uYWwgcHJvcGVydGllc1xuICAgICAqXG4gICAgICogbWVzc2FnZUlkZW50aWZpZXI6IG1lc3NhZ2UgSUQgaW4gdGhlIHJhbmdlIFswLi42NTUzNV1cbiAgICAgKiBwYXlsb2FkTWVzc2FnZTpcdEFwcGxpY2F0aW9uIE1lc3NhZ2UgLSBQVUJMSVNIIG9ubHlcbiAgICAgKiBjb25uZWN0U3RyaW5nczpcdGFycmF5IG9mIDAgb3IgbW9yZSBTdHJpbmdzIHRvIGJlIHB1dCBpbnRvIHRoZSBDT05ORUNUIHBheWxvYWRcbiAgICAgKiB0b3BpY3M6XHRcdFx0YXJyYXkgb2Ygc3RyaW5ncyAoU1VCU0NSSUJFLCBVTlNVQlNDUklCRSlcbiAgICAgKiByZXF1ZXN0UW9TOlx0XHRhcnJheSBvZiBRb1MgdmFsdWVzIFswLi4yXVxuICAgICAqXG4gICAgICogXCJGbGFnXCIgcHJvcGVydGllc1xuICAgICAqIGNsZWFuU2Vzc2lvbjpcdHRydWUgaWYgcHJlc2VudCAvIGZhbHNlIGlmIGFic2VudCAoQ09OTkVDVClcbiAgICAgKiB3aWxsTWVzc2FnZTogIFx0dHJ1ZSBpZiBwcmVzZW50IC8gZmFsc2UgaWYgYWJzZW50IChDT05ORUNUKVxuICAgICAqIGlzUmV0YWluZWQ6XHRcdHRydWUgaWYgcHJlc2VudCAvIGZhbHNlIGlmIGFic2VudCAoQ09OTkVDVClcbiAgICAgKiB1c2VyTmFtZTpcdFx0dHJ1ZSBpZiBwcmVzZW50IC8gZmFsc2UgaWYgYWJzZW50IChDT05ORUNUKVxuICAgICAqIHBhc3N3b3JkOlx0XHR0cnVlIGlmIHByZXNlbnQgLyBmYWxzZSBpZiBhYnNlbnQgKENPTk5FQ1QpXG4gICAgICoga2VlcEFsaXZlSW50ZXJ2YWw6XHRpbnRlZ2VyIFswLi42NTUzNV0gIChDT05ORUNUKVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgdmFyIFdpcmVNZXNzYWdlID0gZnVuY3Rpb24odHlwZSwgb3B0aW9ucykge1xuICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgIGZvciAodmFyIG5hbWUgaW4gb3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICAgIHRoaXNbbmFtZV0gPSBvcHRpb25zW25hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIFdpcmVNZXNzYWdlLnByb3RvdHlwZS5lbmNvZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIENvbXB1dGUgdGhlIGZpcnN0IGJ5dGUgb2YgdGhlIGZpeGVkIGhlYWRlclxuICAgICAgdmFyIGZpcnN0ID0gKHRoaXMudHlwZSAmIDB4MGYpIDw8IDQ7XG5cbiAgICAgIC8qXG4gICAgICAgKiBOb3cgY2FsY3VsYXRlIHRoZSBsZW5ndGggb2YgdGhlIHZhcmlhYmxlIGhlYWRlciArIHBheWxvYWQgYnkgYWRkaW5nIHVwIHRoZSBsZW5ndGhzXG4gICAgICAgKiBvZiBhbGwgdGhlIGNvbXBvbmVudCBwYXJ0c1xuICAgICAgICovXG5cbiAgICAgIHZhciByZW1MZW5ndGggPSAwO1xuICAgICAgdmFyIHRvcGljU3RyTGVuZ3RoID0gW107XG4gICAgICB2YXIgZGVzdGluYXRpb25OYW1lTGVuZ3RoID0gMDtcbiAgICAgIHZhciB3aWxsTWVzc2FnZVBheWxvYWRCeXRlcztcblxuICAgICAgLy8gaWYgdGhlIG1lc3NhZ2UgY29udGFpbnMgYSBtZXNzYWdlSWRlbnRpZmllciB0aGVuIHdlIG5lZWQgdHdvIGJ5dGVzIGZvciB0aGF0XG4gICAgICBpZiAodGhpcy5tZXNzYWdlSWRlbnRpZmllciAhPT0gdW5kZWZpbmVkKSByZW1MZW5ndGggKz0gMjtcblxuICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgLy8gSWYgdGhpcyBhIENvbm5lY3QgdGhlbiB3ZSBuZWVkIHRvIGluY2x1ZGUgMTIgYnl0ZXMgZm9yIGl0cyBoZWFkZXJcbiAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuQ09OTkVDVDpcbiAgICAgICAgICBzd2l0Y2ggKHRoaXMubXF0dFZlcnNpb24pIHtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgcmVtTGVuZ3RoICs9IE1xdHRQcm90b0lkZW50aWZpZXJ2My5sZW5ndGggKyAzO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgcmVtTGVuZ3RoICs9IE1xdHRQcm90b0lkZW50aWZpZXJ2NC5sZW5ndGggKyAzO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZW1MZW5ndGggKz0gVVRGOExlbmd0aCh0aGlzLmNsaWVudElkKSArIDI7XG4gICAgICAgICAgaWYgKHRoaXMud2lsbE1lc3NhZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmVtTGVuZ3RoICs9IFVURjhMZW5ndGgodGhpcy53aWxsTWVzc2FnZS5kZXN0aW5hdGlvbk5hbWUpICsgMjtcbiAgICAgICAgICAgIC8vIFdpbGwgbWVzc2FnZSBpcyBhbHdheXMgYSBzdHJpbmcsIHNlbnQgYXMgVVRGLTggY2hhcmFjdGVycyB3aXRoIGEgcHJlY2VkaW5nIGxlbmd0aC5cbiAgICAgICAgICAgIHdpbGxNZXNzYWdlUGF5bG9hZEJ5dGVzID0gdGhpcy53aWxsTWVzc2FnZS5wYXlsb2FkQnl0ZXM7XG4gICAgICAgICAgICBpZiAoISh3aWxsTWVzc2FnZVBheWxvYWRCeXRlcyBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpKVxuICAgICAgICAgICAgICB3aWxsTWVzc2FnZVBheWxvYWRCeXRlcyA9IG5ldyBVaW50OEFycmF5KHBheWxvYWRCeXRlcyk7XG4gICAgICAgICAgICByZW1MZW5ndGggKz0gd2lsbE1lc3NhZ2VQYXlsb2FkQnl0ZXMuYnl0ZUxlbmd0aCArIDI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLnVzZXJOYW1lICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZW1MZW5ndGggKz0gVVRGOExlbmd0aCh0aGlzLnVzZXJOYW1lKSArIDI7XG4gICAgICAgICAgaWYgKHRoaXMucGFzc3dvcmQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJlbUxlbmd0aCArPSBVVEY4TGVuZ3RoKHRoaXMucGFzc3dvcmQpICsgMjtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICAvLyBTdWJzY3JpYmUsIFVuc3Vic2NyaWJlIGNhbiBib3RoIGNvbnRhaW4gdG9waWMgc3RyaW5nc1xuICAgICAgICBjYXNlIE1FU1NBR0VfVFlQRS5TVUJTQ1JJQkU6XG4gICAgICAgICAgZmlyc3QgfD0gMHgwMjsgLy8gUW9zID0gMTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudG9waWNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b3BpY1N0ckxlbmd0aFtpXSA9IFVURjhMZW5ndGgodGhpcy50b3BpY3NbaV0pO1xuICAgICAgICAgICAgcmVtTGVuZ3RoICs9IHRvcGljU3RyTGVuZ3RoW2ldICsgMjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVtTGVuZ3RoICs9IHRoaXMucmVxdWVzdGVkUW9zLmxlbmd0aDsgLy8gMSBieXRlIGZvciBlYWNoIHRvcGljJ3MgUW9zXG4gICAgICAgICAgLy8gUW9TIG9uIFN1YnNjcmliZSBvbmx5XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuVU5TVUJTQ1JJQkU6XG4gICAgICAgICAgZmlyc3QgfD0gMHgwMjsgLy8gUW9zID0gMTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudG9waWNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b3BpY1N0ckxlbmd0aFtpXSA9IFVURjhMZW5ndGgodGhpcy50b3BpY3NbaV0pO1xuICAgICAgICAgICAgcmVtTGVuZ3RoICs9IHRvcGljU3RyTGVuZ3RoW2ldICsgMjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuUFVCUkVMOlxuICAgICAgICAgIGZpcnN0IHw9IDB4MDI7IC8vIFFvcyA9IDE7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuUFVCTElTSDpcbiAgICAgICAgICBpZiAodGhpcy5wYXlsb2FkTWVzc2FnZS5kdXBsaWNhdGUpIGZpcnN0IHw9IDB4MDg7XG4gICAgICAgICAgZmlyc3QgPSBmaXJzdCB8PSB0aGlzLnBheWxvYWRNZXNzYWdlLnFvcyA8PCAxO1xuICAgICAgICAgIGlmICh0aGlzLnBheWxvYWRNZXNzYWdlLnJldGFpbmVkKSBmaXJzdCB8PSAweDAxO1xuICAgICAgICAgIGRlc3RpbmF0aW9uTmFtZUxlbmd0aCA9IFVURjhMZW5ndGgoXG4gICAgICAgICAgICB0aGlzLnBheWxvYWRNZXNzYWdlLmRlc3RpbmF0aW9uTmFtZVxuICAgICAgICAgICk7XG4gICAgICAgICAgcmVtTGVuZ3RoICs9IGRlc3RpbmF0aW9uTmFtZUxlbmd0aCArIDI7XG4gICAgICAgICAgdmFyIHBheWxvYWRCeXRlcyA9IHRoaXMucGF5bG9hZE1lc3NhZ2UucGF5bG9hZEJ5dGVzO1xuICAgICAgICAgIHJlbUxlbmd0aCArPSBwYXlsb2FkQnl0ZXMuYnl0ZUxlbmd0aDtcbiAgICAgICAgICBpZiAocGF5bG9hZEJ5dGVzIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpXG4gICAgICAgICAgICBwYXlsb2FkQnl0ZXMgPSBuZXcgVWludDhBcnJheShwYXlsb2FkQnl0ZXMpO1xuICAgICAgICAgIGVsc2UgaWYgKCEocGF5bG9hZEJ5dGVzIGluc3RhbmNlb2YgVWludDhBcnJheSkpXG4gICAgICAgICAgICBwYXlsb2FkQnl0ZXMgPSBuZXcgVWludDhBcnJheShwYXlsb2FkQnl0ZXMuYnVmZmVyKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIE1FU1NBR0VfVFlQRS5ESVNDT05ORUNUOlxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdyB3ZSBjYW4gYWxsb2NhdGUgYSBidWZmZXIgZm9yIHRoZSBtZXNzYWdlXG5cbiAgICAgIHZhciBtYmkgPSBlbmNvZGVNQkkocmVtTGVuZ3RoKTsgLy8gQ29udmVydCB0aGUgbGVuZ3RoIHRvIE1RVFQgTUJJIGZvcm1hdFxuICAgICAgdmFyIHBvcyA9IG1iaS5sZW5ndGggKyAxOyAvLyBPZmZzZXQgb2Ygc3RhcnQgb2YgdmFyaWFibGUgaGVhZGVyXG4gICAgICB2YXIgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKHJlbUxlbmd0aCArIHBvcyk7XG4gICAgICB2YXIgYnl0ZVN0cmVhbSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7IC8vIHZpZXcgaXQgYXMgYSBzZXF1ZW5jZSBvZiBieXRlc1xuXG4gICAgICAvL1dyaXRlIHRoZSBmaXhlZCBoZWFkZXIgaW50byB0aGUgYnVmZmVyXG4gICAgICBieXRlU3RyZWFtWzBdID0gZmlyc3Q7XG4gICAgICBieXRlU3RyZWFtLnNldChtYmksIDEpO1xuXG4gICAgICAvLyBJZiB0aGlzIGlzIGEgUFVCTElTSCB0aGVuIHRoZSB2YXJpYWJsZSBoZWFkZXIgc3RhcnRzIHdpdGggYSB0b3BpY1xuICAgICAgaWYgKHRoaXMudHlwZSA9PSBNRVNTQUdFX1RZUEUuUFVCTElTSClcbiAgICAgICAgcG9zID0gd3JpdGVTdHJpbmcoXG4gICAgICAgICAgdGhpcy5wYXlsb2FkTWVzc2FnZS5kZXN0aW5hdGlvbk5hbWUsXG4gICAgICAgICAgZGVzdGluYXRpb25OYW1lTGVuZ3RoLFxuICAgICAgICAgIGJ5dGVTdHJlYW0sXG4gICAgICAgICAgcG9zXG4gICAgICAgICk7XG4gICAgICAvLyBJZiB0aGlzIGlzIGEgQ09OTkVDVCB0aGVuIHRoZSB2YXJpYWJsZSBoZWFkZXIgY29udGFpbnMgdGhlIHByb3RvY29sIG5hbWUvdmVyc2lvbiwgZmxhZ3MgYW5kIGtlZXBhbGl2ZSB0aW1lXG4gICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT0gTUVTU0FHRV9UWVBFLkNPTk5FQ1QpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm1xdHRWZXJzaW9uKSB7XG4gICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgYnl0ZVN0cmVhbS5zZXQoTXF0dFByb3RvSWRlbnRpZmllcnYzLCBwb3MpO1xuICAgICAgICAgICAgcG9zICs9IE1xdHRQcm90b0lkZW50aWZpZXJ2My5sZW5ndGg7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBieXRlU3RyZWFtLnNldChNcXR0UHJvdG9JZGVudGlmaWVydjQsIHBvcyk7XG4gICAgICAgICAgICBwb3MgKz0gTXF0dFByb3RvSWRlbnRpZmllcnY0Lmxlbmd0aDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb25uZWN0RmxhZ3MgPSAwO1xuICAgICAgICBpZiAodGhpcy5jbGVhblNlc3Npb24pIGNvbm5lY3RGbGFncyA9IDB4MDI7XG4gICAgICAgIGlmICh0aGlzLndpbGxNZXNzYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25uZWN0RmxhZ3MgfD0gMHgwNDtcbiAgICAgICAgICBjb25uZWN0RmxhZ3MgfD0gdGhpcy53aWxsTWVzc2FnZS5xb3MgPDwgMztcbiAgICAgICAgICBpZiAodGhpcy53aWxsTWVzc2FnZS5yZXRhaW5lZCkge1xuICAgICAgICAgICAgY29ubmVjdEZsYWdzIHw9IDB4MjA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnVzZXJOYW1lICE9PSB1bmRlZmluZWQpIGNvbm5lY3RGbGFncyB8PSAweDgwO1xuICAgICAgICBpZiAodGhpcy5wYXNzd29yZCAhPT0gdW5kZWZpbmVkKSBjb25uZWN0RmxhZ3MgfD0gMHg0MDtcbiAgICAgICAgYnl0ZVN0cmVhbVtwb3MrK10gPSBjb25uZWN0RmxhZ3M7XG4gICAgICAgIHBvcyA9IHdyaXRlVWludDE2KHRoaXMua2VlcEFsaXZlSW50ZXJ2YWwsIGJ5dGVTdHJlYW0sIHBvcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIE91dHB1dCB0aGUgbWVzc2FnZUlkZW50aWZpZXIgLSBpZiB0aGVyZSBpcyBvbmVcbiAgICAgIGlmICh0aGlzLm1lc3NhZ2VJZGVudGlmaWVyICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHBvcyA9IHdyaXRlVWludDE2KHRoaXMubWVzc2FnZUlkZW50aWZpZXIsIGJ5dGVTdHJlYW0sIHBvcyk7XG5cbiAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgIGNhc2UgTUVTU0FHRV9UWVBFLkNPTk5FQ1Q6XG4gICAgICAgICAgcG9zID0gd3JpdGVTdHJpbmcoXG4gICAgICAgICAgICB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgVVRGOExlbmd0aCh0aGlzLmNsaWVudElkKSxcbiAgICAgICAgICAgIGJ5dGVTdHJlYW0sXG4gICAgICAgICAgICBwb3NcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0aGlzLndpbGxNZXNzYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBvcyA9IHdyaXRlU3RyaW5nKFxuICAgICAgICAgICAgICB0aGlzLndpbGxNZXNzYWdlLmRlc3RpbmF0aW9uTmFtZSxcbiAgICAgICAgICAgICAgVVRGOExlbmd0aCh0aGlzLndpbGxNZXNzYWdlLmRlc3RpbmF0aW9uTmFtZSksXG4gICAgICAgICAgICAgIGJ5dGVTdHJlYW0sXG4gICAgICAgICAgICAgIHBvc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHBvcyA9IHdyaXRlVWludDE2KFxuICAgICAgICAgICAgICB3aWxsTWVzc2FnZVBheWxvYWRCeXRlcy5ieXRlTGVuZ3RoLFxuICAgICAgICAgICAgICBieXRlU3RyZWFtLFxuICAgICAgICAgICAgICBwb3NcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBieXRlU3RyZWFtLnNldCh3aWxsTWVzc2FnZVBheWxvYWRCeXRlcywgcG9zKTtcbiAgICAgICAgICAgIHBvcyArPSB3aWxsTWVzc2FnZVBheWxvYWRCeXRlcy5ieXRlTGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy51c2VyTmFtZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcG9zID0gd3JpdGVTdHJpbmcoXG4gICAgICAgICAgICAgIHRoaXMudXNlck5hbWUsXG4gICAgICAgICAgICAgIFVURjhMZW5ndGgodGhpcy51c2VyTmFtZSksXG4gICAgICAgICAgICAgIGJ5dGVTdHJlYW0sXG4gICAgICAgICAgICAgIHBvc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICBpZiAodGhpcy5wYXNzd29yZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcG9zID0gd3JpdGVTdHJpbmcoXG4gICAgICAgICAgICAgIHRoaXMucGFzc3dvcmQsXG4gICAgICAgICAgICAgIFVURjhMZW5ndGgodGhpcy5wYXNzd29yZCksXG4gICAgICAgICAgICAgIGJ5dGVTdHJlYW0sXG4gICAgICAgICAgICAgIHBvc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIE1FU1NBR0VfVFlQRS5QVUJMSVNIOlxuICAgICAgICAgIC8vIFBVQkxJU0ggaGFzIGEgdGV4dCBvciBiaW5hcnkgcGF5bG9hZCwgaWYgdGV4dCBkbyBub3QgYWRkIGEgMiBieXRlIGxlbmd0aCBmaWVsZCwganVzdCB0aGUgVVRGIGNoYXJhY3RlcnMuXG4gICAgICAgICAgYnl0ZVN0cmVhbS5zZXQocGF5bG9hZEJ5dGVzLCBwb3MpO1xuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgLy8gICAgXHQgICAgY2FzZSBNRVNTQUdFX1RZUEUuUFVCUkVDOlxuICAgICAgICAvLyAgICBcdCAgICBjYXNlIE1FU1NBR0VfVFlQRS5QVUJSRUw6XG4gICAgICAgIC8vICAgIFx0ICAgIGNhc2UgTUVTU0FHRV9UWVBFLlBVQkNPTVA6XG4gICAgICAgIC8vICAgIFx0ICAgIFx0YnJlYWs7XG5cbiAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuU1VCU0NSSUJFOlxuICAgICAgICAgIC8vIFNVQlNDUklCRSBoYXMgYSBsaXN0IG9mIHRvcGljIHN0cmluZ3MgYW5kIHJlcXVlc3QgUW9TXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRvcGljcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcG9zID0gd3JpdGVTdHJpbmcoXG4gICAgICAgICAgICAgIHRoaXMudG9waWNzW2ldLFxuICAgICAgICAgICAgICB0b3BpY1N0ckxlbmd0aFtpXSxcbiAgICAgICAgICAgICAgYnl0ZVN0cmVhbSxcbiAgICAgICAgICAgICAgcG9zXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYnl0ZVN0cmVhbVtwb3MrK10gPSB0aGlzLnJlcXVlc3RlZFFvc1tpXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuVU5TVUJTQ1JJQkU6XG4gICAgICAgICAgLy8gVU5TVUJTQ1JJQkUgaGFzIGEgbGlzdCBvZiB0b3BpYyBzdHJpbmdzXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRvcGljcy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIHBvcyA9IHdyaXRlU3RyaW5nKFxuICAgICAgICAgICAgICB0aGlzLnRvcGljc1tpXSxcbiAgICAgICAgICAgICAgdG9waWNTdHJMZW5ndGhbaV0sXG4gICAgICAgICAgICAgIGJ5dGVTdHJlYW0sXG4gICAgICAgICAgICAgIHBvc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBEbyBub3RoaW5nLlxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYnVmZmVyO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBkZWNvZGVNZXNzYWdlKGlucHV0LCBwb3MpIHtcbiAgICAgIHZhciBzdGFydGluZ1BvcyA9IHBvcztcbiAgICAgIHZhciBmaXJzdCA9IGlucHV0W3Bvc107XG4gICAgICB2YXIgdHlwZSA9IGZpcnN0ID4+IDQ7XG4gICAgICB2YXIgbWVzc2FnZUluZm8gPSAoZmlyc3QgJj0gMHgwZik7XG4gICAgICBwb3MgKz0gMTtcblxuICAgICAgLy8gRGVjb2RlIHRoZSByZW1haW5pbmcgbGVuZ3RoIChNQkkgZm9ybWF0KVxuXG4gICAgICB2YXIgZGlnaXQ7XG4gICAgICB2YXIgcmVtTGVuZ3RoID0gMDtcbiAgICAgIHZhciBtdWx0aXBsaWVyID0gMTtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKHBvcyA9PSBpbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gW251bGwsIHN0YXJ0aW5nUG9zXTtcbiAgICAgICAgfVxuICAgICAgICBkaWdpdCA9IGlucHV0W3BvcysrXTtcbiAgICAgICAgcmVtTGVuZ3RoICs9IChkaWdpdCAmIDB4N2YpICogbXVsdGlwbGllcjtcbiAgICAgICAgbXVsdGlwbGllciAqPSAxMjg7XG4gICAgICB9IHdoaWxlICgoZGlnaXQgJiAweDgwKSAhPT0gMCk7XG5cbiAgICAgIHZhciBlbmRQb3MgPSBwb3MgKyByZW1MZW5ndGg7XG4gICAgICBpZiAoZW5kUG9zID4gaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBbbnVsbCwgc3RhcnRpbmdQb3NdO1xuICAgICAgfVxuXG4gICAgICB2YXIgd2lyZU1lc3NhZ2UgPSBuZXcgV2lyZU1lc3NhZ2UodHlwZSk7XG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuQ09OTkFDSzpcbiAgICAgICAgICB2YXIgY29ubmVjdEFja25vd2xlZGdlRmxhZ3MgPSBpbnB1dFtwb3MrK107XG4gICAgICAgICAgaWYgKGNvbm5lY3RBY2tub3dsZWRnZUZsYWdzICYgMHgwMSkgd2lyZU1lc3NhZ2Uuc2Vzc2lvblByZXNlbnQgPSB0cnVlO1xuICAgICAgICAgIHdpcmVNZXNzYWdlLnJldHVybkNvZGUgPSBpbnB1dFtwb3MrK107XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuUFVCTElTSDpcbiAgICAgICAgICB2YXIgcW9zID0gKG1lc3NhZ2VJbmZvID4+IDEpICYgMHgwMztcblxuICAgICAgICAgIHZhciBsZW4gPSByZWFkVWludDE2KGlucHV0LCBwb3MpO1xuICAgICAgICAgIHBvcyArPSAyO1xuICAgICAgICAgIHZhciB0b3BpY05hbWUgPSBwYXJzZVVURjgoaW5wdXQsIHBvcywgbGVuKTtcbiAgICAgICAgICBwb3MgKz0gbGVuO1xuICAgICAgICAgIC8vIElmIFFvUyAxIG9yIDIgdGhlcmUgd2lsbCBiZSBhIG1lc3NhZ2VJZGVudGlmaWVyXG4gICAgICAgICAgaWYgKHFvcyA+IDApIHtcbiAgICAgICAgICAgIHdpcmVNZXNzYWdlLm1lc3NhZ2VJZGVudGlmaWVyID0gcmVhZFVpbnQxNihpbnB1dCwgcG9zKTtcbiAgICAgICAgICAgIHBvcyArPSAyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoaW5wdXQuc3ViYXJyYXkocG9zLCBlbmRQb3MpKTtcbiAgICAgICAgICBpZiAoKG1lc3NhZ2VJbmZvICYgMHgwMSkgPT0gMHgwMSkgbWVzc2FnZS5yZXRhaW5lZCA9IHRydWU7XG4gICAgICAgICAgaWYgKChtZXNzYWdlSW5mbyAmIDB4MDgpID09IDB4MDgpIG1lc3NhZ2UuZHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgICBtZXNzYWdlLnFvcyA9IHFvcztcbiAgICAgICAgICBtZXNzYWdlLmRlc3RpbmF0aW9uTmFtZSA9IHRvcGljTmFtZTtcbiAgICAgICAgICB3aXJlTWVzc2FnZS5wYXlsb2FkTWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuUFVCQUNLOlxuICAgICAgICBjYXNlIE1FU1NBR0VfVFlQRS5QVUJSRUM6XG4gICAgICAgIGNhc2UgTUVTU0FHRV9UWVBFLlBVQlJFTDpcbiAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuUFVCQ09NUDpcbiAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuVU5TVUJBQ0s6XG4gICAgICAgICAgd2lyZU1lc3NhZ2UubWVzc2FnZUlkZW50aWZpZXIgPSByZWFkVWludDE2KGlucHV0LCBwb3MpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgTUVTU0FHRV9UWVBFLlNVQkFDSzpcbiAgICAgICAgICB3aXJlTWVzc2FnZS5tZXNzYWdlSWRlbnRpZmllciA9IHJlYWRVaW50MTYoaW5wdXQsIHBvcyk7XG4gICAgICAgICAgcG9zICs9IDI7XG4gICAgICAgICAgd2lyZU1lc3NhZ2UucmV0dXJuQ29kZSA9IGlucHV0LnN1YmFycmF5KHBvcywgZW5kUG9zKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gW3dpcmVNZXNzYWdlLCBlbmRQb3NdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdyaXRlVWludDE2KGlucHV0LCBidWZmZXIsIG9mZnNldCkge1xuICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGlucHV0ID4+IDg7IC8vTVNCXG4gICAgICBidWZmZXJbb2Zmc2V0KytdID0gaW5wdXQgJSAyNTY7IC8vTFNCXG4gICAgICByZXR1cm4gb2Zmc2V0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdyaXRlU3RyaW5nKGlucHV0LCB1dGY4TGVuZ3RoLCBidWZmZXIsIG9mZnNldCkge1xuICAgICAgb2Zmc2V0ID0gd3JpdGVVaW50MTYodXRmOExlbmd0aCwgYnVmZmVyLCBvZmZzZXQpO1xuICAgICAgc3RyaW5nVG9VVEY4KGlucHV0LCBidWZmZXIsIG9mZnNldCk7XG4gICAgICByZXR1cm4gb2Zmc2V0ICsgdXRmOExlbmd0aDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWFkVWludDE2KGJ1ZmZlciwgb2Zmc2V0KSB7XG4gICAgICByZXR1cm4gMjU2ICogYnVmZmVyW29mZnNldF0gKyBidWZmZXJbb2Zmc2V0ICsgMV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW5jb2RlcyBhbiBNUVRUIE11bHRpLUJ5dGUgSW50ZWdlclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gZW5jb2RlTUJJKG51bWJlcikge1xuICAgICAgdmFyIG91dHB1dCA9IG5ldyBBcnJheSgxKTtcbiAgICAgIHZhciBudW1CeXRlcyA9IDA7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgdmFyIGRpZ2l0ID0gbnVtYmVyICUgMTI4O1xuICAgICAgICBudW1iZXIgPSBudW1iZXIgPj4gNztcbiAgICAgICAgaWYgKG51bWJlciA+IDApIHtcbiAgICAgICAgICBkaWdpdCB8PSAweDgwO1xuICAgICAgICB9XG4gICAgICAgIG91dHB1dFtudW1CeXRlcysrXSA9IGRpZ2l0O1xuICAgICAgfSB3aGlsZSAobnVtYmVyID4gMCAmJiBudW1CeXRlcyA8IDQpO1xuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRha2VzIGEgU3RyaW5nIGFuZCBjYWxjdWxhdGVzIGl0cyBsZW5ndGggaW4gYnl0ZXMgd2hlbiBlbmNvZGVkIGluIFVURjguXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBVVEY4TGVuZ3RoKGlucHV0KSB7XG4gICAgICB2YXIgb3V0cHV0ID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoYXJDb2RlID0gaW5wdXQuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNoYXJDb2RlID4gMHg3ZmYpIHtcbiAgICAgICAgICAvLyBTdXJyb2dhdGUgcGFpciBtZWFucyBpdHMgYSA0IGJ5dGUgY2hhcmFjdGVyXG4gICAgICAgICAgaWYgKDB4ZDgwMCA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8PSAweGRiZmYpIHtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIG91dHB1dCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvdXRwdXQgKz0gMztcbiAgICAgICAgfSBlbHNlIGlmIChjaGFyQ29kZSA+IDB4N2YpIG91dHB1dCArPSAyO1xuICAgICAgICBlbHNlIG91dHB1dCsrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhIFN0cmluZyBhbmQgd3JpdGVzIGl0IGludG8gYW4gYXJyYXkgYXMgVVRGOCBlbmNvZGVkIGJ5dGVzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3RyaW5nVG9VVEY4KGlucHV0LCBvdXRwdXQsIHN0YXJ0KSB7XG4gICAgICB2YXIgcG9zID0gc3RhcnQ7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGFyQ29kZSA9IGlucHV0LmNoYXJDb2RlQXQoaSk7XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIGEgc3Vycm9nYXRlIHBhaXIuXG4gICAgICAgIGlmICgweGQ4MDAgPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPD0gMHhkYmZmKSB7XG4gICAgICAgICAgdmFyIGxvd0NoYXJDb2RlID0gaW5wdXQuY2hhckNvZGVBdCgrK2kpO1xuICAgICAgICAgIGlmIChpc05hTihsb3dDaGFyQ29kZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgZm9ybWF0KEVSUk9SLk1BTEZPUk1FRF9VTklDT0RFLCBbY2hhckNvZGUsIGxvd0NoYXJDb2RlXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNoYXJDb2RlID1cbiAgICAgICAgICAgICgoY2hhckNvZGUgLSAweGQ4MDApIDw8IDEwKSArIChsb3dDaGFyQ29kZSAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoYXJDb2RlIDw9IDB4N2YpIHtcbiAgICAgICAgICBvdXRwdXRbcG9zKytdID0gY2hhckNvZGU7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhckNvZGUgPD0gMHg3ZmYpIHtcbiAgICAgICAgICBvdXRwdXRbcG9zKytdID0gKChjaGFyQ29kZSA+PiA2KSAmIDB4MWYpIHwgMHhjMDtcbiAgICAgICAgICBvdXRwdXRbcG9zKytdID0gKGNoYXJDb2RlICYgMHgzZikgfCAweDgwO1xuICAgICAgICB9IGVsc2UgaWYgKGNoYXJDb2RlIDw9IDB4ZmZmZikge1xuICAgICAgICAgIG91dHB1dFtwb3MrK10gPSAoKGNoYXJDb2RlID4+IDEyKSAmIDB4MGYpIHwgMHhlMDtcbiAgICAgICAgICBvdXRwdXRbcG9zKytdID0gKChjaGFyQ29kZSA+PiA2KSAmIDB4M2YpIHwgMHg4MDtcbiAgICAgICAgICBvdXRwdXRbcG9zKytdID0gKGNoYXJDb2RlICYgMHgzZikgfCAweDgwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dHB1dFtwb3MrK10gPSAoKGNoYXJDb2RlID4+IDE4KSAmIDB4MDcpIHwgMHhmMDtcbiAgICAgICAgICBvdXRwdXRbcG9zKytdID0gKChjaGFyQ29kZSA+PiAxMikgJiAweDNmKSB8IDB4ODA7XG4gICAgICAgICAgb3V0cHV0W3BvcysrXSA9ICgoY2hhckNvZGUgPj4gNikgJiAweDNmKSB8IDB4ODA7XG4gICAgICAgICAgb3V0cHV0W3BvcysrXSA9IChjaGFyQ29kZSAmIDB4M2YpIHwgMHg4MDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVVURjgoaW5wdXQsIG9mZnNldCwgbGVuZ3RoKSB7XG4gICAgICB2YXIgb3V0cHV0ID0gXCJcIjtcbiAgICAgIHZhciB1dGYxNjtcbiAgICAgIHZhciBwb3MgPSBvZmZzZXQ7XG5cbiAgICAgIHdoaWxlIChwb3MgPCBvZmZzZXQgKyBsZW5ndGgpIHtcbiAgICAgICAgdmFyIGJ5dGUxID0gaW5wdXRbcG9zKytdO1xuICAgICAgICBpZiAoYnl0ZTEgPCAxMjgpIHV0ZjE2ID0gYnl0ZTE7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhciBieXRlMiA9IGlucHV0W3BvcysrXSAtIDEyODtcbiAgICAgICAgICBpZiAoYnl0ZTIgPCAwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICBmb3JtYXQoRVJST1IuTUFMRk9STUVEX1VURiwgW1xuICAgICAgICAgICAgICAgIGJ5dGUxLnRvU3RyaW5nKDE2KSxcbiAgICAgICAgICAgICAgICBieXRlMi50b1N0cmluZygxNiksXG4gICAgICAgICAgICAgICAgXCJcIlxuICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoYnl0ZTEgPCAweGUwKVxuICAgICAgICAgICAgLy8gMiBieXRlIGNoYXJhY3RlclxuICAgICAgICAgICAgdXRmMTYgPSA2NCAqIChieXRlMSAtIDB4YzApICsgYnl0ZTI7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgYnl0ZTMgPSBpbnB1dFtwb3MrK10gLSAxMjg7XG4gICAgICAgICAgICBpZiAoYnl0ZTMgPCAwKVxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgZm9ybWF0KEVSUk9SLk1BTEZPUk1FRF9VVEYsIFtcbiAgICAgICAgICAgICAgICAgIGJ5dGUxLnRvU3RyaW5nKDE2KSxcbiAgICAgICAgICAgICAgICAgIGJ5dGUyLnRvU3RyaW5nKDE2KSxcbiAgICAgICAgICAgICAgICAgIGJ5dGUzLnRvU3RyaW5nKDE2KVxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoYnl0ZTEgPCAweGYwKVxuICAgICAgICAgICAgICAvLyAzIGJ5dGUgY2hhcmFjdGVyXG4gICAgICAgICAgICAgIHV0ZjE2ID0gNDA5NiAqIChieXRlMSAtIDB4ZTApICsgNjQgKiBieXRlMiArIGJ5dGUzO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHZhciBieXRlNCA9IGlucHV0W3BvcysrXSAtIDEyODtcbiAgICAgICAgICAgICAgaWYgKGJ5dGU0IDwgMClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICBmb3JtYXQoRVJST1IuTUFMRk9STUVEX1VURiwgW1xuICAgICAgICAgICAgICAgICAgICBieXRlMS50b1N0cmluZygxNiksXG4gICAgICAgICAgICAgICAgICAgIGJ5dGUyLnRvU3RyaW5nKDE2KSxcbiAgICAgICAgICAgICAgICAgICAgYnl0ZTMudG9TdHJpbmcoMTYpLFxuICAgICAgICAgICAgICAgICAgICBieXRlNC50b1N0cmluZygxNilcbiAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgaWYgKGJ5dGUxIDwgMHhmOClcbiAgICAgICAgICAgICAgICAvLyA0IGJ5dGUgY2hhcmFjdGVyXG4gICAgICAgICAgICAgICAgdXRmMTYgPVxuICAgICAgICAgICAgICAgICAgMjYyMTQ0ICogKGJ5dGUxIC0gMHhmMCkgKyA0MDk2ICogYnl0ZTIgKyA2NCAqIGJ5dGUzICsgYnl0ZTQ7XG4gICAgICAgICAgICAgIC8vIGxvbmdlciBlbmNvZGluZ3MgYXJlIG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgIGZvcm1hdChFUlJPUi5NQUxGT1JNRURfVVRGLCBbXG4gICAgICAgICAgICAgICAgICAgIGJ5dGUxLnRvU3RyaW5nKDE2KSxcbiAgICAgICAgICAgICAgICAgICAgYnl0ZTIudG9TdHJpbmcoMTYpLFxuICAgICAgICAgICAgICAgICAgICBieXRlMy50b1N0cmluZygxNiksXG4gICAgICAgICAgICAgICAgICAgIGJ5dGU0LnRvU3RyaW5nKDE2KVxuICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1dGYxNiA+IDB4ZmZmZikge1xuICAgICAgICAgIC8vIDQgYnl0ZSBjaGFyYWN0ZXIgLSBleHByZXNzIGFzIGEgc3Vycm9nYXRlIHBhaXJcbiAgICAgICAgICB1dGYxNiAtPSAweDEwMDAwO1xuICAgICAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZDgwMCArICh1dGYxNiA+PiAxMCkpOyAvLyBsZWFkIGNoYXJhY3RlclxuICAgICAgICAgIHV0ZjE2ID0gMHhkYzAwICsgKHV0ZjE2ICYgMHgzZmYpOyAvLyB0cmFpbCBjaGFyYWN0ZXJcbiAgICAgICAgfVxuICAgICAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSh1dGYxNik7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcGVhdCBrZWVwYWxpdmUgcmVxdWVzdHMsIG1vbml0b3IgcmVzcG9uc2VzLlxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICB2YXIgUGluZ2VyID0gZnVuY3Rpb24oY2xpZW50LCBrZWVwQWxpdmVJbnRlcnZhbCkge1xuICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xuICAgICAgdGhpcy5fa2VlcEFsaXZlSW50ZXJ2YWwgPSBrZWVwQWxpdmVJbnRlcnZhbCAqIDEwMDA7XG4gICAgICB0aGlzLmlzUmVzZXQgPSBmYWxzZTtcblxuICAgICAgdmFyIHBpbmdSZXEgPSBuZXcgV2lyZU1lc3NhZ2UoTUVTU0FHRV9UWVBFLlBJTkdSRVEpLmVuY29kZSgpO1xuXG4gICAgICB2YXIgZG9UaW1lb3V0ID0gZnVuY3Rpb24ocGluZ2VyKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZG9QaW5nLmFwcGx5KHBpbmdlcik7XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICAvKiogQGlnbm9yZSAqL1xuICAgICAgdmFyIGRvUGluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNSZXNldCkge1xuICAgICAgICAgIHRoaXMuX2NsaWVudC5fdHJhY2UoXCJQaW5nZXIuZG9QaW5nXCIsIFwiVGltZWQgb3V0XCIpO1xuICAgICAgICAgIHRoaXMuX2NsaWVudC5fZGlzY29ubmVjdGVkKFxuICAgICAgICAgICAgRVJST1IuUElOR19USU1FT1VULmNvZGUsXG4gICAgICAgICAgICBmb3JtYXQoRVJST1IuUElOR19USU1FT1VUKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5pc1Jlc2V0ID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5fY2xpZW50Ll90cmFjZShcIlBpbmdlci5kb1BpbmdcIiwgXCJzZW5kIFBJTkdSRVFcIik7XG4gICAgICAgICAgdGhpcy5fY2xpZW50LnNvY2tldC5zZW5kKHBpbmdSZXEpO1xuICAgICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoZG9UaW1lb3V0KHRoaXMpLCB0aGlzLl9rZWVwQWxpdmVJbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRoaXMucmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5pc1Jlc2V0ID0gdHJ1ZTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICAgIGlmICh0aGlzLl9rZWVwQWxpdmVJbnRlcnZhbCA+IDApXG4gICAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChkb1RpbWVvdXQodGhpcyksIHRoaXMuX2tlZXBBbGl2ZUludGVydmFsKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTW9uaXRvciByZXF1ZXN0IGNvbXBsZXRpb24uXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIHZhciBUaW1lb3V0ID0gZnVuY3Rpb24oY2xpZW50LCB0aW1lb3V0U2Vjb25kcywgYWN0aW9uLCBhcmdzKSB7XG4gICAgICBpZiAoIXRpbWVvdXRTZWNvbmRzKSB0aW1lb3V0U2Vjb25kcyA9IDMwO1xuXG4gICAgICB2YXIgZG9UaW1lb3V0ID0gZnVuY3Rpb24oYWN0aW9uLCBjbGllbnQsIGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBhY3Rpb24uYXBwbHkoY2xpZW50LCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KFxuICAgICAgICBkb1RpbWVvdXQoYWN0aW9uLCBjbGllbnQsIGFyZ3MpLFxuICAgICAgICB0aW1lb3V0U2Vjb25kcyAqIDEwMDBcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgdGhlIFdlYnNvY2tldHMgTVFUVCBWMy4xIGNsaWVudC5cbiAgICAgKlxuICAgICAqIEBuYW1lIFBhaG8uQ2xpZW50SW1wbCBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaG9zdCB0aGUgRE5TIG5hbWVvZiB0aGUgd2ViU29ja2V0IGhvc3QuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBvcnQgdGhlIHBvcnQgbnVtYmVyIGZvciB0aGF0IGhvc3QuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudElkIHRoZSBNUSBjbGllbnQgaWRlbnRpZmllci5cbiAgICAgKi9cbiAgICB2YXIgQ2xpZW50SW1wbCA9IGZ1bmN0aW9uKHVyaSwgaG9zdCwgcG9ydCwgcGF0aCwgY2xpZW50SWQpIHtcbiAgICAgIC8vIENoZWNrIGRlcGVuZGVuY2llcyBhcmUgc2F0aXNmaWVkIGluIHRoaXMgYnJvd3Nlci5cbiAgICAgIGlmICghKFwiV2ViU29ja2V0XCIgaW4gZ2xvYmFsICYmIGdsb2JhbC5XZWJTb2NrZXQgIT09IG51bGwpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoRVJST1IuVU5TVVBQT1JURUQsIFtcIldlYlNvY2tldFwiXSkpO1xuICAgICAgfVxuICAgICAgaWYgKCEoXCJBcnJheUJ1ZmZlclwiIGluIGdsb2JhbCAmJiBnbG9iYWwuQXJyYXlCdWZmZXIgIT09IG51bGwpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoRVJST1IuVU5TVVBQT1JURUQsIFtcIkFycmF5QnVmZmVyXCJdKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl90cmFjZShcIlBhaG8uQ2xpZW50XCIsIHVyaSwgaG9zdCwgcG9ydCwgcGF0aCwgY2xpZW50SWQpO1xuXG4gICAgICB0aGlzLmhvc3QgPSBob3N0O1xuICAgICAgdGhpcy5wb3J0ID0gcG9ydDtcbiAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgICB0aGlzLnVyaSA9IHVyaTtcbiAgICAgIHRoaXMuY2xpZW50SWQgPSBjbGllbnRJZDtcbiAgICAgIHRoaXMuX3dzdXJpID0gbnVsbDtcblxuICAgICAgLy8gTG9jYWwgc3RvcmFnZWtleXMgYXJlIHF1YWxpZmllZCB3aXRoIHRoZSBmb2xsb3dpbmcgc3RyaW5nLlxuICAgICAgLy8gVGhlIGNvbmRpdGlvbmFsIGluY2x1c2lvbiBvZiBwYXRoIGluIHRoZSBrZXkgaXMgZm9yIGJhY2t3YXJkXG4gICAgICAvLyBjb21wYXRpYmlsaXR5IHRvIHdoZW4gdGhlIHBhdGggd2FzIG5vdCBjb25maWd1cmFibGUgYW5kIGFzc3VtZWQgdG9cbiAgICAgIC8vIGJlIC9tcXR0XG4gICAgICB0aGlzLl9sb2NhbEtleSA9XG4gICAgICAgIGhvc3QgK1xuICAgICAgICBcIjpcIiArXG4gICAgICAgIHBvcnQgK1xuICAgICAgICAocGF0aCAhPSBcIi9tcXR0XCIgPyBcIjpcIiArIHBhdGggOiBcIlwiKSArXG4gICAgICAgIFwiOlwiICtcbiAgICAgICAgY2xpZW50SWQgK1xuICAgICAgICBcIjpcIjtcblxuICAgICAgLy8gQ3JlYXRlIHByaXZhdGUgaW5zdGFuY2Utb25seSBtZXNzYWdlIHF1ZXVlXG4gICAgICAvLyBJbnRlcm5hbCBxdWV1ZSBvZiBtZXNzYWdlcyB0byBiZSBzZW50LCBpbiBzZW5kaW5nIG9yZGVyLlxuICAgICAgdGhpcy5fbXNnX3F1ZXVlID0gW107XG4gICAgICB0aGlzLl9idWZmZXJlZF9tc2dfcXVldWUgPSBbXTtcblxuICAgICAgLy8gTWVzc2FnZXMgd2UgaGF2ZSBzZW50IGFuZCBhcmUgZXhwZWN0aW5nIGEgcmVzcG9uc2UgZm9yLCBpbmRleGVkIGJ5IHRoZWlyIHJlc3BlY3RpdmUgbWVzc2FnZSBpZHMuXG4gICAgICB0aGlzLl9zZW50TWVzc2FnZXMgPSB7fTtcblxuICAgICAgLy8gTWVzc2FnZXMgd2UgaGF2ZSByZWNlaXZlZCBhbmQgYWNrbm93bGVnZWQgYW5kIGFyZSBleHBlY3RpbmcgYSBjb25maXJtIG1lc3NhZ2UgZm9yXG4gICAgICAvLyBpbmRleGVkIGJ5IHRoZWlyIHJlc3BlY3RpdmUgbWVzc2FnZSBpZHMuXG4gICAgICB0aGlzLl9yZWNlaXZlZE1lc3NhZ2VzID0ge307XG5cbiAgICAgIC8vIEludGVybmFsIGxpc3Qgb2YgY2FsbGJhY2tzIHRvIGJlIGV4ZWN1dGVkIHdoZW4gbWVzc2FnZXNcbiAgICAgIC8vIGhhdmUgYmVlbiBzdWNjZXNzZnVsbHkgc2VudCBvdmVyIHdlYiBzb2NrZXQsIGUuZy4gZGlzY29ubmVjdFxuICAgICAgLy8gd2hlbiBpdCBkb2Vzbid0IGhhdmUgdG8gd2FpdCBmb3IgQUNLLCBqdXN0IG1lc3NhZ2UgaXMgZGlzcGF0Y2hlZC5cbiAgICAgIHRoaXMuX25vdGlmeV9tc2dfc2VudCA9IHt9O1xuXG4gICAgICAvLyBVbmlxdWUgaWRlbnRpZmllciBmb3IgU0VORCBtZXNzYWdlcywgaW5jcmVtZW50aW5nXG4gICAgICAvLyBjb3VudGVyIGFzIG1lc3NhZ2VzIGFyZSBzZW50LlxuICAgICAgdGhpcy5fbWVzc2FnZV9pZGVudGlmaWVyID0gMTtcblxuICAgICAgLy8gVXNlZCB0byBkZXRlcm1pbmUgdGhlIHRyYW5zbWlzc2lvbiBzZXF1ZW5jZSBvZiBzdG9yZWQgc2VudCBtZXNzYWdlcy5cbiAgICAgIHRoaXMuX3NlcXVlbmNlID0gMDtcblxuICAgICAgLy8gTG9hZCB0aGUgbG9jYWwgc3RhdGUsIGlmIGFueSwgZnJvbSB0aGUgc2F2ZWQgdmVyc2lvbiwgb25seSByZXN0b3JlIHN0YXRlIHJlbGV2YW50IHRvIHRoaXMgY2xpZW50LlxuICAgICAgZm9yICh2YXIga2V5IGluIGxvY2FsU3RvcmFnZSlcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGtleS5pbmRleE9mKFwiU2VudDpcIiArIHRoaXMuX2xvY2FsS2V5KSA9PT0gMCB8fFxuICAgICAgICAgIGtleS5pbmRleE9mKFwiUmVjZWl2ZWQ6XCIgKyB0aGlzLl9sb2NhbEtleSkgPT09IDBcbiAgICAgICAgKVxuICAgICAgICAgIHRoaXMucmVzdG9yZShrZXkpO1xuICAgIH07XG5cbiAgICAvLyBNZXNzYWdpbmcgQ2xpZW50IHB1YmxpYyBpbnN0YW5jZSBtZW1iZXJzLlxuICAgIENsaWVudEltcGwucHJvdG90eXBlLmhvc3QgPSBudWxsO1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLnBvcnQgPSBudWxsO1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLnBhdGggPSBudWxsO1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLnVyaSA9IG51bGw7XG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuY2xpZW50SWQgPSBudWxsO1xuXG4gICAgLy8gTWVzc2FnaW5nIENsaWVudCBwcml2YXRlIGluc3RhbmNlIG1lbWJlcnMuXG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuc29ja2V0ID0gbnVsbDtcbiAgICAvKiB0cnVlIG9uY2Ugd2UgaGF2ZSByZWNlaXZlZCBhbiBhY2tub3dsZWRnZW1lbnQgdG8gYSBDT05ORUNUIHBhY2tldC4gKi9cbiAgICBDbGllbnRJbXBsLnByb3RvdHlwZS5jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAvKiBUaGUgbGFyZ2VzdCBtZXNzYWdlIGlkZW50aWZpZXIgYWxsb3dlZCwgbWF5IG5vdCBiZSBsYXJnZXIgdGhhbiAyKioxNiBidXRcbiAgICAgKiBpZiBzZXQgc21hbGxlciByZWR1Y2VzIHRoZSBtYXhpbXVtIG51bWJlciBvZiBvdXRib3VuZCBtZXNzYWdlcyBhbGxvd2VkLlxuICAgICAqL1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLm1heE1lc3NhZ2VJZGVudGlmaWVyID0gNjU1MzY7XG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuY29ubmVjdE9wdGlvbnMgPSBudWxsO1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLmhvc3RJbmRleCA9IG51bGw7XG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUub25Db25uZWN0ZWQgPSBudWxsO1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLm9uQ29ubmVjdGlvbkxvc3QgPSBudWxsO1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLm9uTWVzc2FnZURlbGl2ZXJlZCA9IG51bGw7XG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUub25NZXNzYWdlQXJyaXZlZCA9IG51bGw7XG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUudHJhY2VGdW5jdGlvbiA9IG51bGw7XG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuX21zZ19xdWV1ZSA9IG51bGw7XG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuX2J1ZmZlcmVkX21zZ19xdWV1ZSA9IG51bGw7XG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuX2Nvbm5lY3RUaW1lb3V0ID0gbnVsbDtcbiAgICAvKiBUaGUgc2VuZFBpbmdlciBtb25pdG9ycyBob3cgbG9uZyB3ZSBhbGxvdyBiZWZvcmUgd2Ugc2VuZCBkYXRhIHRvIHByb3ZlIHRvIHRoZSBzZXJ2ZXIgdGhhdCB3ZSBhcmUgYWxpdmUuICovXG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuc2VuZFBpbmdlciA9IG51bGw7XG4gICAgLyogVGhlIHJlY2VpdmVQaW5nZXIgbW9uaXRvcnMgaG93IGxvbmcgd2UgYWxsb3cgYmVmb3JlIHdlIHJlcXVpcmUgZXZpZGVuY2UgdGhhdCB0aGUgc2VydmVyIGlzIGFsaXZlLiAqL1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLnJlY2VpdmVQaW5nZXIgPSBudWxsO1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLl9yZWNvbm5lY3RJbnRlcnZhbCA9IDE7IC8vIFJlY29ubmVjdCBEZWxheSwgc3RhcnRzIGF0IDEgc2Vjb25kXG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuX3JlY29ubmVjdGluZyA9IGZhbHNlO1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLl9yZWNvbm5lY3RUaW1lb3V0ID0gbnVsbDtcbiAgICBDbGllbnRJbXBsLnByb3RvdHlwZS5kaXNjb25uZWN0ZWRQdWJsaXNoaW5nID0gZmFsc2U7XG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuZGlzY29ubmVjdGVkQnVmZmVyU2l6ZSA9IDUwMDA7XG5cbiAgICBDbGllbnRJbXBsLnByb3RvdHlwZS5yZWNlaXZlQnVmZmVyID0gbnVsbDtcblxuICAgIENsaWVudEltcGwucHJvdG90eXBlLl90cmFjZUJ1ZmZlciA9IG51bGw7XG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuX01BWF9UUkFDRV9FTlRSSUVTID0gMTAwO1xuXG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKGNvbm5lY3RPcHRpb25zKSB7XG4gICAgICB2YXIgY29ubmVjdE9wdGlvbnNNYXNrZWQgPSB0aGlzLl90cmFjZU1hc2soY29ubmVjdE9wdGlvbnMsIFwicGFzc3dvcmRcIik7XG4gICAgICB0aGlzLl90cmFjZShcbiAgICAgICAgXCJDbGllbnQuY29ubmVjdFwiLFxuICAgICAgICBjb25uZWN0T3B0aW9uc01hc2tlZCxcbiAgICAgICAgdGhpcy5zb2NrZXQsXG4gICAgICAgIHRoaXMuY29ubmVjdGVkXG4gICAgICApO1xuXG4gICAgICBpZiAodGhpcy5jb25uZWN0ZWQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoRVJST1IuSU5WQUxJRF9TVEFURSwgW1wiYWxyZWFkeSBjb25uZWN0ZWRcIl0pKTtcbiAgICAgIGlmICh0aGlzLnNvY2tldClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZvcm1hdChFUlJPUi5JTlZBTElEX1NUQVRFLCBbXCJhbHJlYWR5IGNvbm5lY3RlZFwiXSkpO1xuXG4gICAgICBpZiAodGhpcy5fcmVjb25uZWN0aW5nKSB7XG4gICAgICAgIC8vIGNvbm5lY3QoKSBmdW5jdGlvbiBpcyBjYWxsZWQgd2hpbGUgcmVjb25uZWN0IGlzIGluIHByb2dyZXNzLlxuICAgICAgICAvLyBUZXJtaW5hdGUgdGhlIGF1dG8gcmVjb25uZWN0IHByb2Nlc3MgdG8gdXNlIG5ldyBjb25uZWN0IG9wdGlvbnMuXG4gICAgICAgIHRoaXMuX3JlY29ubmVjdFRpbWVvdXQuY2FuY2VsKCk7XG4gICAgICAgIHRoaXMuX3JlY29ubmVjdFRpbWVvdXQgPSBudWxsO1xuICAgICAgICB0aGlzLl9yZWNvbm5lY3RpbmcgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb25uZWN0T3B0aW9ucyA9IGNvbm5lY3RPcHRpb25zO1xuICAgICAgdGhpcy5fcmVjb25uZWN0SW50ZXJ2YWwgPSAxO1xuICAgICAgdGhpcy5fcmVjb25uZWN0aW5nID0gZmFsc2U7XG4gICAgICBpZiAoY29ubmVjdE9wdGlvbnMudXJpcykge1xuICAgICAgICB0aGlzLmhvc3RJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX2RvQ29ubmVjdChjb25uZWN0T3B0aW9ucy51cmlzWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RvQ29ubmVjdCh0aGlzLnVyaSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIENsaWVudEltcGwucHJvdG90eXBlLnN1YnNjcmliZSA9IGZ1bmN0aW9uKGZpbHRlciwgc3Vic2NyaWJlT3B0aW9ucykge1xuICAgICAgdGhpcy5fdHJhY2UoXCJDbGllbnQuc3Vic2NyaWJlXCIsIGZpbHRlciwgc3Vic2NyaWJlT3B0aW9ucyk7XG5cbiAgICAgIGlmICghdGhpcy5jb25uZWN0ZWQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoRVJST1IuSU5WQUxJRF9TVEFURSwgW1wibm90IGNvbm5lY3RlZFwiXSkpO1xuXG4gICAgICB2YXIgd2lyZU1lc3NhZ2UgPSBuZXcgV2lyZU1lc3NhZ2UoTUVTU0FHRV9UWVBFLlNVQlNDUklCRSk7XG4gICAgICB3aXJlTWVzc2FnZS50b3BpY3MgPSBmaWx0ZXIuY29uc3RydWN0b3IgPT09IEFycmF5ID8gZmlsdGVyIDogW2ZpbHRlcl07XG4gICAgICBpZiAoc3Vic2NyaWJlT3B0aW9ucy5xb3MgPT09IHVuZGVmaW5lZCkgc3Vic2NyaWJlT3B0aW9ucy5xb3MgPSAwO1xuICAgICAgd2lyZU1lc3NhZ2UucmVxdWVzdGVkUW9zID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpcmVNZXNzYWdlLnRvcGljcy5sZW5ndGg7IGkrKylcbiAgICAgICAgd2lyZU1lc3NhZ2UucmVxdWVzdGVkUW9zW2ldID0gc3Vic2NyaWJlT3B0aW9ucy5xb3M7XG5cbiAgICAgIGlmIChzdWJzY3JpYmVPcHRpb25zLm9uU3VjY2Vzcykge1xuICAgICAgICB3aXJlTWVzc2FnZS5vblN1Y2Nlc3MgPSBmdW5jdGlvbihncmFudGVkUW9zKSB7XG4gICAgICAgICAgc3Vic2NyaWJlT3B0aW9ucy5vblN1Y2Nlc3Moe1xuICAgICAgICAgICAgaW52b2NhdGlvbkNvbnRleHQ6IHN1YnNjcmliZU9wdGlvbnMuaW52b2NhdGlvbkNvbnRleHQsXG4gICAgICAgICAgICBncmFudGVkUW9zOiBncmFudGVkUW9zXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChzdWJzY3JpYmVPcHRpb25zLm9uRmFpbHVyZSkge1xuICAgICAgICB3aXJlTWVzc2FnZS5vbkZhaWx1cmUgPSBmdW5jdGlvbihlcnJvckNvZGUpIHtcbiAgICAgICAgICBzdWJzY3JpYmVPcHRpb25zLm9uRmFpbHVyZSh7XG4gICAgICAgICAgICBpbnZvY2F0aW9uQ29udGV4dDogc3Vic2NyaWJlT3B0aW9ucy5pbnZvY2F0aW9uQ29udGV4dCxcbiAgICAgICAgICAgIGVycm9yQ29kZTogZXJyb3JDb2RlLFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBmb3JtYXQoZXJyb3JDb2RlKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Vic2NyaWJlT3B0aW9ucy50aW1lb3V0KSB7XG4gICAgICAgIHdpcmVNZXNzYWdlLnRpbWVPdXQgPSBuZXcgVGltZW91dChcbiAgICAgICAgICB0aGlzLFxuICAgICAgICAgIHN1YnNjcmliZU9wdGlvbnMudGltZW91dCxcbiAgICAgICAgICBzdWJzY3JpYmVPcHRpb25zLm9uRmFpbHVyZSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGludm9jYXRpb25Db250ZXh0OiBzdWJzY3JpYmVPcHRpb25zLmludm9jYXRpb25Db250ZXh0LFxuICAgICAgICAgICAgICBlcnJvckNvZGU6IEVSUk9SLlNVQlNDUklCRV9USU1FT1VULmNvZGUsXG4gICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZm9ybWF0KEVSUk9SLlNVQlNDUklCRV9USU1FT1VUKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWxsIHN1YnNjcmlwdGlvbnMgcmV0dXJuIGEgU1VCQUNLLlxuICAgICAgdGhpcy5fcmVxdWlyZXNfYWNrKHdpcmVNZXNzYWdlKTtcbiAgICAgIHRoaXMuX3NjaGVkdWxlX21lc3NhZ2Uod2lyZU1lc3NhZ2UpO1xuICAgIH07XG5cbiAgICAvKiogQGlnbm9yZSAqL1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24oZmlsdGVyLCB1bnN1YnNjcmliZU9wdGlvbnMpIHtcbiAgICAgIHRoaXMuX3RyYWNlKFwiQ2xpZW50LnVuc3Vic2NyaWJlXCIsIGZpbHRlciwgdW5zdWJzY3JpYmVPcHRpb25zKTtcblxuICAgICAgaWYgKCF0aGlzLmNvbm5lY3RlZClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZvcm1hdChFUlJPUi5JTlZBTElEX1NUQVRFLCBbXCJub3QgY29ubmVjdGVkXCJdKSk7XG5cbiAgICAgIHZhciB3aXJlTWVzc2FnZSA9IG5ldyBXaXJlTWVzc2FnZShNRVNTQUdFX1RZUEUuVU5TVUJTQ1JJQkUpO1xuICAgICAgd2lyZU1lc3NhZ2UudG9waWNzID0gZmlsdGVyLmNvbnN0cnVjdG9yID09PSBBcnJheSA/IGZpbHRlciA6IFtmaWx0ZXJdO1xuXG4gICAgICBpZiAodW5zdWJzY3JpYmVPcHRpb25zLm9uU3VjY2Vzcykge1xuICAgICAgICB3aXJlTWVzc2FnZS5jYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHVuc3Vic2NyaWJlT3B0aW9ucy5vblN1Y2Nlc3Moe1xuICAgICAgICAgICAgaW52b2NhdGlvbkNvbnRleHQ6IHVuc3Vic2NyaWJlT3B0aW9ucy5pbnZvY2F0aW9uQ29udGV4dFxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKHVuc3Vic2NyaWJlT3B0aW9ucy50aW1lb3V0KSB7XG4gICAgICAgIHdpcmVNZXNzYWdlLnRpbWVPdXQgPSBuZXcgVGltZW91dChcbiAgICAgICAgICB0aGlzLFxuICAgICAgICAgIHVuc3Vic2NyaWJlT3B0aW9ucy50aW1lb3V0LFxuICAgICAgICAgIHVuc3Vic2NyaWJlT3B0aW9ucy5vbkZhaWx1cmUsXG4gICAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpbnZvY2F0aW9uQ29udGV4dDogdW5zdWJzY3JpYmVPcHRpb25zLmludm9jYXRpb25Db250ZXh0LFxuICAgICAgICAgICAgICBlcnJvckNvZGU6IEVSUk9SLlVOU1VCU0NSSUJFX1RJTUVPVVQuY29kZSxcbiAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBmb3JtYXQoRVJST1IuVU5TVUJTQ1JJQkVfVElNRU9VVClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFsbCB1bnN1YnNjcmliZXMgcmV0dXJuIGEgU1VCQUNLLlxuICAgICAgdGhpcy5fcmVxdWlyZXNfYWNrKHdpcmVNZXNzYWdlKTtcbiAgICAgIHRoaXMuX3NjaGVkdWxlX21lc3NhZ2Uod2lyZU1lc3NhZ2UpO1xuICAgIH07XG5cbiAgICBDbGllbnRJbXBsLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgdGhpcy5fdHJhY2UoXCJDbGllbnQuc2VuZFwiLCBtZXNzYWdlKTtcblxuICAgICAgdmFyIHdpcmVNZXNzYWdlID0gbmV3IFdpcmVNZXNzYWdlKE1FU1NBR0VfVFlQRS5QVUJMSVNIKTtcbiAgICAgIHdpcmVNZXNzYWdlLnBheWxvYWRNZXNzYWdlID0gbWVzc2FnZTtcblxuICAgICAgaWYgKHRoaXMuY29ubmVjdGVkKSB7XG4gICAgICAgIC8vIE1hcmsgcW9zIDEgJiAyIG1lc3NhZ2UgYXMgXCJBQ0sgcmVxdWlyZWRcIlxuICAgICAgICAvLyBGb3IgcW9zIDAgbWVzc2FnZSwgaW52b2tlIG9uTWVzc2FnZURlbGl2ZXJlZCBjYWxsYmFjayBpZiB0aGVyZSBpcyBvbmUuXG4gICAgICAgIC8vIFRoZW4gc2NoZWR1bGUgdGhlIG1lc3NhZ2UuXG4gICAgICAgIGlmIChtZXNzYWdlLnFvcyA+IDApIHtcbiAgICAgICAgICB0aGlzLl9yZXF1aXJlc19hY2sod2lyZU1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub25NZXNzYWdlRGVsaXZlcmVkKSB7XG4gICAgICAgICAgdGhpcy5fbm90aWZ5X21zZ19zZW50W3dpcmVNZXNzYWdlXSA9IHRoaXMub25NZXNzYWdlRGVsaXZlcmVkKFxuICAgICAgICAgICAgd2lyZU1lc3NhZ2UucGF5bG9hZE1lc3NhZ2VcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NjaGVkdWxlX21lc3NhZ2Uod2lyZU1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ3VycmVudGx5IGRpc2Nvbm5lY3RlZCwgd2lsbCBub3Qgc2NoZWR1bGUgdGhpcyBtZXNzYWdlXG4gICAgICAgIC8vIENoZWNrIGlmIHJlY29ubmVjdGluZyBpcyBpbiBwcm9ncmVzcyBhbmQgZGlzY29ubmVjdGVkIHB1Ymxpc2ggaXMgZW5hYmxlZC5cbiAgICAgICAgaWYgKHRoaXMuX3JlY29ubmVjdGluZyAmJiB0aGlzLmRpc2Nvbm5lY3RlZFB1Ymxpc2hpbmcpIHtcbiAgICAgICAgICAvLyBDaGVjayB0aGUgbGltaXQgd2hpY2ggaW5jbHVkZSB0aGUgXCJyZXF1aXJlZCBBQ0tcIiBtZXNzYWdlc1xuICAgICAgICAgIHZhciBtZXNzYWdlQ291bnQgPVxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fc2VudE1lc3NhZ2VzKS5sZW5ndGggK1xuICAgICAgICAgICAgdGhpcy5fYnVmZmVyZWRfbXNnX3F1ZXVlLmxlbmd0aDtcbiAgICAgICAgICBpZiAobWVzc2FnZUNvdW50ID4gdGhpcy5kaXNjb25uZWN0ZWRCdWZmZXJTaXplKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGZvcm1hdChFUlJPUi5CVUZGRVJfRlVMTCwgW3RoaXMuZGlzY29ubmVjdGVkQnVmZmVyU2l6ZV0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobWVzc2FnZS5xb3MgPiAwKSB7XG4gICAgICAgICAgICAgIC8vIE1hcmsgdGhpcyBtZXNzYWdlIGFzIFwiQUNLIHJlcXVpcmVkXCJcbiAgICAgICAgICAgICAgdGhpcy5fcmVxdWlyZXNfYWNrKHdpcmVNZXNzYWdlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHdpcmVNZXNzYWdlLnNlcXVlbmNlID0gKyt0aGlzLl9zZXF1ZW5jZTtcbiAgICAgICAgICAgICAgLy8gQWRkIG1lc3NhZ2VzIGluIGZpZm8gb3JkZXIgdG8gYXJyYXksIGJ5IGFkZGluZyB0byBzdGFydFxuICAgICAgICAgICAgICB0aGlzLl9idWZmZXJlZF9tc2dfcXVldWUudW5zaGlmdCh3aXJlTWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoRVJST1IuSU5WQUxJRF9TVEFURSwgW1wibm90IGNvbm5lY3RlZFwiXSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIENsaWVudEltcGwucHJvdG90eXBlLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX3RyYWNlKFwiQ2xpZW50LmRpc2Nvbm5lY3RcIik7XG5cbiAgICAgIGlmICh0aGlzLl9yZWNvbm5lY3RpbmcpIHtcbiAgICAgICAgLy8gZGlzY29ubmVjdCgpIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGlsZSByZWNvbm5lY3QgaXMgaW4gcHJvZ3Jlc3MuXG4gICAgICAgIC8vIFRlcm1pbmF0ZSB0aGUgYXV0byByZWNvbm5lY3QgcHJvY2Vzcy5cbiAgICAgICAgdGhpcy5fcmVjb25uZWN0VGltZW91dC5jYW5jZWwoKTtcbiAgICAgICAgdGhpcy5fcmVjb25uZWN0VGltZW91dCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3JlY29ubmVjdGluZyA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuc29ja2V0KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgZm9ybWF0KEVSUk9SLklOVkFMSURfU1RBVEUsIFtcIm5vdCBjb25uZWN0aW5nIG9yIGNvbm5lY3RlZFwiXSlcbiAgICAgICAgKTtcblxuICAgICAgdmFyIHdpcmVNZXNzYWdlID0gbmV3IFdpcmVNZXNzYWdlKE1FU1NBR0VfVFlQRS5ESVNDT05ORUNUKTtcblxuICAgICAgLy8gUnVuIHRoZSBkaXNjb25uZWN0ZWQgY2FsbCBiYWNrIGFzIHNvb24gYXMgdGhlIG1lc3NhZ2UgaGFzIGJlZW4gc2VudCxcbiAgICAgIC8vIGluIGNhc2Ugb2YgYSBmYWlsdXJlIGxhdGVyIG9uIGluIHRoZSBkaXNjb25uZWN0IHByb2Nlc3NpbmcuXG4gICAgICAvLyBhcyBhIGNvbnNlcXVlbmNlLCB0aGUgX2Rpc2NvbmVjdGVkIGNhbGwgYmFjayBtYXkgYmUgcnVuIHNldmVyYWwgdGltZXMuXG4gICAgICB0aGlzLl9ub3RpZnlfbXNnX3NlbnRbd2lyZU1lc3NhZ2VdID0gc2NvcGUodGhpcy5fZGlzY29ubmVjdGVkLCB0aGlzKTtcblxuICAgICAgdGhpcy5fc2NoZWR1bGVfbWVzc2FnZSh3aXJlTWVzc2FnZSk7XG4gICAgfTtcblxuICAgIENsaWVudEltcGwucHJvdG90eXBlLmdldFRyYWNlTG9nID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fdHJhY2VCdWZmZXIgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fdHJhY2UoXCJDbGllbnQuZ2V0VHJhY2VMb2dcIiwgbmV3IERhdGUoKSk7XG4gICAgICAgIHRoaXMuX3RyYWNlKFxuICAgICAgICAgIFwiQ2xpZW50LmdldFRyYWNlTG9nIGluIGZsaWdodCBtZXNzYWdlc1wiLFxuICAgICAgICAgIHRoaXMuX3NlbnRNZXNzYWdlcy5sZW5ndGhcbiAgICAgICAgKTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuX3NlbnRNZXNzYWdlcylcbiAgICAgICAgICB0aGlzLl90cmFjZShcIl9zZW50TWVzc2FnZXMgXCIsIGtleSwgdGhpcy5fc2VudE1lc3NhZ2VzW2tleV0pO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fcmVjZWl2ZWRNZXNzYWdlcylcbiAgICAgICAgICB0aGlzLl90cmFjZShcIl9yZWNlaXZlZE1lc3NhZ2VzIFwiLCBrZXksIHRoaXMuX3JlY2VpdmVkTWVzc2FnZXNba2V5XSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYWNlQnVmZmVyO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBDbGllbnRJbXBsLnByb3RvdHlwZS5zdGFydFRyYWNlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fdHJhY2VCdWZmZXIgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fdHJhY2VCdWZmZXIgPSBbXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3RyYWNlKFwiQ2xpZW50LnN0YXJ0VHJhY2VcIiwgbmV3IERhdGUoKSwgdmVyc2lvbik7XG4gICAgfTtcblxuICAgIENsaWVudEltcGwucHJvdG90eXBlLnN0b3BUcmFjZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgZGVsZXRlIHRoaXMuX3RyYWNlQnVmZmVyO1xuICAgIH07XG5cbiAgICBDbGllbnRJbXBsLnByb3RvdHlwZS5fZG9Db25uZWN0ID0gZnVuY3Rpb24od3N1cmwpIHtcbiAgICAgIC8vIFdoZW4gdGhlIHNvY2tldCBpcyBvcGVuLCB0aGlzIGNsaWVudCB3aWxsIHNlbmQgdGhlIENPTk5FQ1QgV2lyZU1lc3NhZ2UgdXNpbmcgdGhlIHNhdmVkIHBhcmFtZXRlcnMuXG4gICAgICBpZiAodGhpcy5jb25uZWN0T3B0aW9ucy51c2VTU0wpIHtcbiAgICAgICAgdmFyIHVyaVBhcnRzID0gd3N1cmwuc3BsaXQoXCI6XCIpO1xuICAgICAgICB1cmlQYXJ0c1swXSA9IFwid3NzXCI7XG4gICAgICAgIHdzdXJsID0gdXJpUGFydHMuam9pbihcIjpcIik7XG4gICAgICB9XG4gICAgICB0aGlzLl93c3VyaSA9IHdzdXJsO1xuICAgICAgdGhpcy5jb25uZWN0ZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMuY29ubmVjdE9wdGlvbnMubXF0dFZlcnNpb24gPCA0KSB7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldCh3c3VybCwgW1wibXF0dHYzLjFcIl0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHdzdXJsLCBbXCJtcXR0XCJdKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc29ja2V0LmJpbmFyeVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG4gICAgICB0aGlzLnNvY2tldC5vbm9wZW4gPSBzY29wZSh0aGlzLl9vbl9zb2NrZXRfb3BlbiwgdGhpcyk7XG4gICAgICB0aGlzLnNvY2tldC5vbm1lc3NhZ2UgPSBzY29wZSh0aGlzLl9vbl9zb2NrZXRfbWVzc2FnZSwgdGhpcyk7XG4gICAgICB0aGlzLnNvY2tldC5vbmVycm9yID0gc2NvcGUodGhpcy5fb25fc29ja2V0X2Vycm9yLCB0aGlzKTtcbiAgICAgIHRoaXMuc29ja2V0Lm9uY2xvc2UgPSBzY29wZSh0aGlzLl9vbl9zb2NrZXRfY2xvc2UsIHRoaXMpO1xuXG4gICAgICB0aGlzLnNlbmRQaW5nZXIgPSBuZXcgUGluZ2VyKHRoaXMsIHRoaXMuY29ubmVjdE9wdGlvbnMua2VlcEFsaXZlSW50ZXJ2YWwpO1xuICAgICAgdGhpcy5yZWNlaXZlUGluZ2VyID0gbmV3IFBpbmdlcihcbiAgICAgICAgdGhpcyxcbiAgICAgICAgdGhpcy5jb25uZWN0T3B0aW9ucy5rZWVwQWxpdmVJbnRlcnZhbFxuICAgICAgKTtcbiAgICAgIGlmICh0aGlzLl9jb25uZWN0VGltZW91dCkge1xuICAgICAgICB0aGlzLl9jb25uZWN0VGltZW91dC5jYW5jZWwoKTtcbiAgICAgICAgdGhpcy5fY29ubmVjdFRpbWVvdXQgPSBudWxsO1xuICAgICAgfVxuICAgICAgdGhpcy5fY29ubmVjdFRpbWVvdXQgPSBuZXcgVGltZW91dChcbiAgICAgICAgdGhpcyxcbiAgICAgICAgdGhpcy5jb25uZWN0T3B0aW9ucy50aW1lb3V0LFxuICAgICAgICB0aGlzLl9kaXNjb25uZWN0ZWQsXG4gICAgICAgIFtFUlJPUi5DT05ORUNUX1RJTUVPVVQuY29kZSwgZm9ybWF0KEVSUk9SLkNPTk5FQ1RfVElNRU9VVCldXG4gICAgICApO1xuICAgIH07XG5cbiAgICAvLyBTY2hlZHVsZSBhIG5ldyBtZXNzYWdlIHRvIGJlIHNlbnQgb3ZlciB0aGUgV2ViU29ja2V0c1xuICAgIC8vIGNvbm5lY3Rpb24uIENPTk5FQ1QgbWVzc2FnZXMgY2F1c2UgV2ViU29ja2V0IGNvbm5lY3Rpb25cbiAgICAvLyB0byBiZSBzdGFydGVkLiBBbGwgb3RoZXIgbWVzc2FnZXMgYXJlIHF1ZXVlZCBpbnRlcm5hbGx5XG4gICAgLy8gdW50aWwgdGhpcyBoYXMgaGFwcGVuZWQuIFdoZW4gV1MgY29ubmVjdGlvbiBzdGFydHMsIHByb2Nlc3NcbiAgICAvLyBhbGwgb3V0c3RhbmRpbmcgbWVzc2FnZXMuXG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuX3NjaGVkdWxlX21lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAvLyBBZGQgbWVzc2FnZXMgaW4gZmlmbyBvcmRlciB0byBhcnJheSwgYnkgYWRkaW5nIHRvIHN0YXJ0XG4gICAgICB0aGlzLl9tc2dfcXVldWUudW5zaGlmdChtZXNzYWdlKTtcbiAgICAgIC8vIFByb2Nlc3Mgb3V0c3RhbmRpbmcgbWVzc2FnZXMgaW4gdGhlIHF1ZXVlIGlmIHdlIGhhdmUgYW4gIG9wZW4gc29ja2V0LCBhbmQgaGF2ZSByZWNlaXZlZCBDT05OQUNLLlxuICAgICAgaWYgKHRoaXMuY29ubmVjdGVkKSB7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NfcXVldWUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuc3RvcmUgPSBmdW5jdGlvbihwcmVmaXgsIHdpcmVNZXNzYWdlKSB7XG4gICAgICB2YXIgc3RvcmVkTWVzc2FnZSA9IHtcbiAgICAgICAgdHlwZTogd2lyZU1lc3NhZ2UudHlwZSxcbiAgICAgICAgbWVzc2FnZUlkZW50aWZpZXI6IHdpcmVNZXNzYWdlLm1lc3NhZ2VJZGVudGlmaWVyLFxuICAgICAgICB2ZXJzaW9uOiAxXG4gICAgICB9O1xuXG4gICAgICBzd2l0Y2ggKHdpcmVNZXNzYWdlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuUFVCTElTSDpcbiAgICAgICAgICBpZiAod2lyZU1lc3NhZ2UucHViUmVjUmVjZWl2ZWQpIHN0b3JlZE1lc3NhZ2UucHViUmVjUmVjZWl2ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgLy8gQ29udmVydCB0aGUgcGF5bG9hZCB0byBhIGhleCBzdHJpbmcuXG4gICAgICAgICAgc3RvcmVkTWVzc2FnZS5wYXlsb2FkTWVzc2FnZSA9IHt9O1xuICAgICAgICAgIHZhciBoZXggPSBcIlwiO1xuICAgICAgICAgIHZhciBtZXNzYWdlQnl0ZXMgPSB3aXJlTWVzc2FnZS5wYXlsb2FkTWVzc2FnZS5wYXlsb2FkQnl0ZXM7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXNzYWdlQnl0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlQnl0ZXNbaV0gPD0gMHhmKVxuICAgICAgICAgICAgICBoZXggPSBoZXggKyBcIjBcIiArIG1lc3NhZ2VCeXRlc1tpXS50b1N0cmluZygxNik7XG4gICAgICAgICAgICBlbHNlIGhleCA9IGhleCArIG1lc3NhZ2VCeXRlc1tpXS50b1N0cmluZygxNik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0b3JlZE1lc3NhZ2UucGF5bG9hZE1lc3NhZ2UucGF5bG9hZEhleCA9IGhleDtcblxuICAgICAgICAgIHN0b3JlZE1lc3NhZ2UucGF5bG9hZE1lc3NhZ2UucW9zID0gd2lyZU1lc3NhZ2UucGF5bG9hZE1lc3NhZ2UucW9zO1xuICAgICAgICAgIHN0b3JlZE1lc3NhZ2UucGF5bG9hZE1lc3NhZ2UuZGVzdGluYXRpb25OYW1lID1cbiAgICAgICAgICAgIHdpcmVNZXNzYWdlLnBheWxvYWRNZXNzYWdlLmRlc3RpbmF0aW9uTmFtZTtcbiAgICAgICAgICBpZiAod2lyZU1lc3NhZ2UucGF5bG9hZE1lc3NhZ2UuZHVwbGljYXRlKVxuICAgICAgICAgICAgc3RvcmVkTWVzc2FnZS5wYXlsb2FkTWVzc2FnZS5kdXBsaWNhdGUgPSB0cnVlO1xuICAgICAgICAgIGlmICh3aXJlTWVzc2FnZS5wYXlsb2FkTWVzc2FnZS5yZXRhaW5lZClcbiAgICAgICAgICAgIHN0b3JlZE1lc3NhZ2UucGF5bG9hZE1lc3NhZ2UucmV0YWluZWQgPSB0cnVlO1xuXG4gICAgICAgICAgLy8gQWRkIGEgc2VxdWVuY2UgbnVtYmVyIHRvIHNlbnQgbWVzc2FnZXMuXG4gICAgICAgICAgaWYgKHByZWZpeC5pbmRleE9mKFwiU2VudDpcIikgPT09IDApIHtcbiAgICAgICAgICAgIGlmICh3aXJlTWVzc2FnZS5zZXF1ZW5jZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICB3aXJlTWVzc2FnZS5zZXF1ZW5jZSA9ICsrdGhpcy5fc2VxdWVuY2U7XG4gICAgICAgICAgICBzdG9yZWRNZXNzYWdlLnNlcXVlbmNlID0gd2lyZU1lc3NhZ2Uuc2VxdWVuY2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICBmb3JtYXQoRVJST1IuSU5WQUxJRF9TVE9SRURfREFUQSwgW1xuICAgICAgICAgICAgICBwcmVmaXggKyB0aGlzLl9sb2NhbEtleSArIHdpcmVNZXNzYWdlLm1lc3NhZ2VJZGVudGlmaWVyLFxuICAgICAgICAgICAgICBzdG9yZWRNZXNzYWdlXG4gICAgICAgICAgICBdKVxuICAgICAgICAgICk7XG4gICAgICB9XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgcHJlZml4ICsgdGhpcy5fbG9jYWxLZXkgKyB3aXJlTWVzc2FnZS5tZXNzYWdlSWRlbnRpZmllcixcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoc3RvcmVkTWVzc2FnZSlcbiAgICAgICk7XG4gICAgfTtcblxuICAgIENsaWVudEltcGwucHJvdG90eXBlLnJlc3RvcmUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICB2YXIgc3RvcmVkTWVzc2FnZSA9IEpTT04ucGFyc2UodmFsdWUpO1xuXG4gICAgICB2YXIgd2lyZU1lc3NhZ2UgPSBuZXcgV2lyZU1lc3NhZ2Uoc3RvcmVkTWVzc2FnZS50eXBlLCBzdG9yZWRNZXNzYWdlKTtcblxuICAgICAgc3dpdGNoIChzdG9yZWRNZXNzYWdlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuUFVCTElTSDpcbiAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBwYXlsb2FkIG1lc3NhZ2Ugd2l0aCBhIE1lc3NhZ2Ugb2JqZWN0LlxuICAgICAgICAgIHZhciBoZXggPSBzdG9yZWRNZXNzYWdlLnBheWxvYWRNZXNzYWdlLnBheWxvYWRIZXg7XG4gICAgICAgICAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihoZXgubGVuZ3RoIC8gMik7XG4gICAgICAgICAgdmFyIGJ5dGVTdHJlYW0gPSBuZXcgVWludDhBcnJheShidWZmZXIpO1xuICAgICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgICB3aGlsZSAoaGV4Lmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMCwgMiksIDE2KTtcbiAgICAgICAgICAgIGhleCA9IGhleC5zdWJzdHJpbmcoMiwgaGV4Lmxlbmd0aCk7XG4gICAgICAgICAgICBieXRlU3RyZWFtW2krK10gPSB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgcGF5bG9hZE1lc3NhZ2UgPSBuZXcgTWVzc2FnZShieXRlU3RyZWFtKTtcblxuICAgICAgICAgIHBheWxvYWRNZXNzYWdlLnFvcyA9IHN0b3JlZE1lc3NhZ2UucGF5bG9hZE1lc3NhZ2UucW9zO1xuICAgICAgICAgIHBheWxvYWRNZXNzYWdlLmRlc3RpbmF0aW9uTmFtZSA9XG4gICAgICAgICAgICBzdG9yZWRNZXNzYWdlLnBheWxvYWRNZXNzYWdlLmRlc3RpbmF0aW9uTmFtZTtcbiAgICAgICAgICBpZiAoc3RvcmVkTWVzc2FnZS5wYXlsb2FkTWVzc2FnZS5kdXBsaWNhdGUpXG4gICAgICAgICAgICBwYXlsb2FkTWVzc2FnZS5kdXBsaWNhdGUgPSB0cnVlO1xuICAgICAgICAgIGlmIChzdG9yZWRNZXNzYWdlLnBheWxvYWRNZXNzYWdlLnJldGFpbmVkKVxuICAgICAgICAgICAgcGF5bG9hZE1lc3NhZ2UucmV0YWluZWQgPSB0cnVlO1xuICAgICAgICAgIHdpcmVNZXNzYWdlLnBheWxvYWRNZXNzYWdlID0gcGF5bG9hZE1lc3NhZ2U7XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IEVycm9yKGZvcm1hdChFUlJPUi5JTlZBTElEX1NUT1JFRF9EQVRBLCBba2V5LCB2YWx1ZV0pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGtleS5pbmRleE9mKFwiU2VudDpcIiArIHRoaXMuX2xvY2FsS2V5KSA9PT0gMCkge1xuICAgICAgICB3aXJlTWVzc2FnZS5wYXlsb2FkTWVzc2FnZS5kdXBsaWNhdGUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9zZW50TWVzc2FnZXNbd2lyZU1lc3NhZ2UubWVzc2FnZUlkZW50aWZpZXJdID0gd2lyZU1lc3NhZ2U7XG4gICAgICB9IGVsc2UgaWYgKGtleS5pbmRleE9mKFwiUmVjZWl2ZWQ6XCIgKyB0aGlzLl9sb2NhbEtleSkgPT09IDApIHtcbiAgICAgICAgdGhpcy5fcmVjZWl2ZWRNZXNzYWdlc1t3aXJlTWVzc2FnZS5tZXNzYWdlSWRlbnRpZmllcl0gPSB3aXJlTWVzc2FnZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuX3Byb2Nlc3NfcXVldWUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtZXNzYWdlID0gbnVsbDtcblxuICAgICAgLy8gU2VuZCBhbGwgcXVldWVkIG1lc3NhZ2VzIGRvd24gc29ja2V0IGNvbm5lY3Rpb25cbiAgICAgIHdoaWxlICgobWVzc2FnZSA9IHRoaXMuX21zZ19xdWV1ZS5wb3AoKSkpIHtcbiAgICAgICAgdGhpcy5fc29ja2V0X3NlbmQobWVzc2FnZSk7XG4gICAgICAgIC8vIE5vdGlmeSBsaXN0ZW5lcnMgdGhhdCBtZXNzYWdlIHdhcyBzdWNjZXNzZnVsbHkgc2VudFxuICAgICAgICBpZiAodGhpcy5fbm90aWZ5X21zZ19zZW50W21lc3NhZ2VdKSB7XG4gICAgICAgICAgdGhpcy5fbm90aWZ5X21zZ19zZW50W21lc3NhZ2VdKCk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX25vdGlmeV9tc2dfc2VudFttZXNzYWdlXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeHBlY3QgYW4gQUNLIHJlc3BvbnNlIGZvciB0aGlzIG1lc3NhZ2UuIEFkZCBtZXNzYWdlIHRvIHRoZSBzZXQgb2YgaW4gcHJvZ3Jlc3NcbiAgICAgKiBtZXNzYWdlcyBhbmQgc2V0IGFuIHVudXNlZCBpZGVudGlmaWVyIGluIHRoaXMgbWVzc2FnZS5cbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuX3JlcXVpcmVzX2FjayA9IGZ1bmN0aW9uKHdpcmVNZXNzYWdlKSB7XG4gICAgICB2YXIgbWVzc2FnZUNvdW50ID0gT2JqZWN0LmtleXModGhpcy5fc2VudE1lc3NhZ2VzKS5sZW5ndGg7XG4gICAgICBpZiAobWVzc2FnZUNvdW50ID4gdGhpcy5tYXhNZXNzYWdlSWRlbnRpZmllcilcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJUb28gbWFueSBtZXNzYWdlczpcIiArIG1lc3NhZ2VDb3VudCk7XG5cbiAgICAgIHdoaWxlICh0aGlzLl9zZW50TWVzc2FnZXNbdGhpcy5fbWVzc2FnZV9pZGVudGlmaWVyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX21lc3NhZ2VfaWRlbnRpZmllcisrO1xuICAgICAgfVxuICAgICAgd2lyZU1lc3NhZ2UubWVzc2FnZUlkZW50aWZpZXIgPSB0aGlzLl9tZXNzYWdlX2lkZW50aWZpZXI7XG4gICAgICB0aGlzLl9zZW50TWVzc2FnZXNbd2lyZU1lc3NhZ2UubWVzc2FnZUlkZW50aWZpZXJdID0gd2lyZU1lc3NhZ2U7XG4gICAgICBpZiAod2lyZU1lc3NhZ2UudHlwZSA9PT0gTUVTU0FHRV9UWVBFLlBVQkxJU0gpIHtcbiAgICAgICAgdGhpcy5zdG9yZShcIlNlbnQ6XCIsIHdpcmVNZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9tZXNzYWdlX2lkZW50aWZpZXIgPT09IHRoaXMubWF4TWVzc2FnZUlkZW50aWZpZXIpIHtcbiAgICAgICAgdGhpcy5fbWVzc2FnZV9pZGVudGlmaWVyID0gMTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIHVuZGVybHlpbmcgd2Vic29ja2V0IGhhcyBiZWVuIG9wZW5lZC5cbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuX29uX3NvY2tldF9vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAvLyBDcmVhdGUgdGhlIENPTk5FQ1QgbWVzc2FnZSBvYmplY3QuXG4gICAgICB2YXIgd2lyZU1lc3NhZ2UgPSBuZXcgV2lyZU1lc3NhZ2UoXG4gICAgICAgIE1FU1NBR0VfVFlQRS5DT05ORUNULFxuICAgICAgICB0aGlzLmNvbm5lY3RPcHRpb25zXG4gICAgICApO1xuICAgICAgd2lyZU1lc3NhZ2UuY2xpZW50SWQgPSB0aGlzLmNsaWVudElkO1xuICAgICAgdGhpcy5fc29ja2V0X3NlbmQod2lyZU1lc3NhZ2UpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgdW5kZXJseWluZyB3ZWJzb2NrZXQgaGFzIHJlY2VpdmVkIGEgY29tcGxldGUgcGFja2V0LlxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBDbGllbnRJbXBsLnByb3RvdHlwZS5fb25fc29ja2V0X21lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgdGhpcy5fdHJhY2UoXCJDbGllbnQuX29uX3NvY2tldF9tZXNzYWdlXCIsIGV2ZW50LmRhdGEpO1xuICAgICAgdmFyIG1lc3NhZ2VzID0gdGhpcy5fZGVmcmFtZU1lc3NhZ2VzKGV2ZW50LmRhdGEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXNzYWdlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB0aGlzLl9oYW5kbGVNZXNzYWdlKG1lc3NhZ2VzW2ldKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuX2RlZnJhbWVNZXNzYWdlcyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZhciBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShkYXRhKTtcbiAgICAgIHZhciBtZXNzYWdlcyA9IFtdO1xuICAgICAgaWYgKHRoaXMucmVjZWl2ZUJ1ZmZlcikge1xuICAgICAgICB2YXIgbmV3RGF0YSA9IG5ldyBVaW50OEFycmF5KFxuICAgICAgICAgIHRoaXMucmVjZWl2ZUJ1ZmZlci5sZW5ndGggKyBieXRlQXJyYXkubGVuZ3RoXG4gICAgICAgICk7XG4gICAgICAgIG5ld0RhdGEuc2V0KHRoaXMucmVjZWl2ZUJ1ZmZlcik7XG4gICAgICAgIG5ld0RhdGEuc2V0KGJ5dGVBcnJheSwgdGhpcy5yZWNlaXZlQnVmZmVyLmxlbmd0aCk7XG4gICAgICAgIGJ5dGVBcnJheSA9IG5ld0RhdGE7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnJlY2VpdmVCdWZmZXI7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gMDtcbiAgICAgICAgd2hpbGUgKG9mZnNldCA8IGJ5dGVBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gZGVjb2RlTWVzc2FnZShieXRlQXJyYXksIG9mZnNldCk7XG4gICAgICAgICAgdmFyIHdpcmVNZXNzYWdlID0gcmVzdWx0WzBdO1xuICAgICAgICAgIG9mZnNldCA9IHJlc3VsdFsxXTtcbiAgICAgICAgICBpZiAod2lyZU1lc3NhZ2UgIT09IG51bGwpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2god2lyZU1lc3NhZ2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9mZnNldCA8IGJ5dGVBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVCdWZmZXIgPSBieXRlQXJyYXkuc3ViYXJyYXkob2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdmFyIGVycm9yU3RhY2sgPVxuICAgICAgICAgIGVycm9yLmhhc093blByb3BlcnR5KFwic3RhY2tcIikgPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgICAgICAgPyBlcnJvci5zdGFjay50b1N0cmluZygpXG4gICAgICAgICAgICA6IFwiTm8gRXJyb3IgU3RhY2sgQXZhaWxhYmxlXCI7XG4gICAgICAgIHRoaXMuX2Rpc2Nvbm5lY3RlZChcbiAgICAgICAgICBFUlJPUi5JTlRFUk5BTF9FUlJPUi5jb2RlLFxuICAgICAgICAgIGZvcm1hdChFUlJPUi5JTlRFUk5BTF9FUlJPUiwgW2Vycm9yLm1lc3NhZ2UsIGVycm9yU3RhY2tdKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gbWVzc2FnZXM7XG4gICAgfTtcblxuICAgIENsaWVudEltcGwucHJvdG90eXBlLl9oYW5kbGVNZXNzYWdlID0gZnVuY3Rpb24od2lyZU1lc3NhZ2UpIHtcbiAgICAgIHRoaXMuX3RyYWNlKFwiQ2xpZW50Ll9oYW5kbGVNZXNzYWdlXCIsIHdpcmVNZXNzYWdlKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgc3dpdGNoICh3aXJlTWVzc2FnZS50eXBlKSB7XG4gICAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuQ09OTkFDSzpcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RUaW1lb3V0LmNhbmNlbCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlY29ubmVjdFRpbWVvdXQpIHRoaXMuX3JlY29ubmVjdFRpbWVvdXQuY2FuY2VsKCk7XG5cbiAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgc3RhcnRlZCB1c2luZyBjbGVhbiBzZXNzaW9uIHRoZW4gY2xlYXIgdXAgdGhlIGxvY2FsIHN0YXRlLlxuICAgICAgICAgICAgaWYgKHRoaXMuY29ubmVjdE9wdGlvbnMuY2xlYW5TZXNzaW9uKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9zZW50TWVzc2FnZXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VudE1lc3NhZ2UgPSB0aGlzLl9zZW50TWVzc2FnZXNba2V5XTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcbiAgICAgICAgICAgICAgICAgIFwiU2VudDpcIiArIHRoaXMuX2xvY2FsS2V5ICsgc2VudE1lc3NhZ2UubWVzc2FnZUlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuX3NlbnRNZXNzYWdlcyA9IHt9O1xuXG4gICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9yZWNlaXZlZE1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlY2VpdmVkTWVzc2FnZSA9IHRoaXMuX3JlY2VpdmVkTWVzc2FnZXNba2V5XTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcbiAgICAgICAgICAgICAgICAgIFwiUmVjZWl2ZWQ6XCIgK1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2NhbEtleSArXG4gICAgICAgICAgICAgICAgICAgIHJlY2VpdmVkTWVzc2FnZS5tZXNzYWdlSWRlbnRpZmllclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5fcmVjZWl2ZWRNZXNzYWdlcyA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQ2xpZW50IGNvbm5lY3RlZCBhbmQgcmVhZHkgZm9yIGJ1c2luZXNzLlxuICAgICAgICAgICAgaWYgKHdpcmVNZXNzYWdlLnJldHVybkNvZGUgPT09IDApIHtcbiAgICAgICAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAvLyBKdW1wIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Qgb2YgdXJpcyBhbmQgc3RvcCBsb29raW5nIGZvciBhIGdvb2QgaG9zdC5cblxuICAgICAgICAgICAgICBpZiAodGhpcy5jb25uZWN0T3B0aW9ucy51cmlzKVxuICAgICAgICAgICAgICAgIHRoaXMuaG9zdEluZGV4ID0gdGhpcy5jb25uZWN0T3B0aW9ucy51cmlzLmxlbmd0aDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Rpc2Nvbm5lY3RlZChcbiAgICAgICAgICAgICAgICBFUlJPUi5DT05OQUNLX1JFVFVSTkNPREUuY29kZSxcbiAgICAgICAgICAgICAgICBmb3JtYXQoRVJST1IuQ09OTkFDS19SRVRVUk5DT0RFLCBbXG4gICAgICAgICAgICAgICAgICB3aXJlTWVzc2FnZS5yZXR1cm5Db2RlLFxuICAgICAgICAgICAgICAgICAgQ09OTkFDS19SQ1t3aXJlTWVzc2FnZS5yZXR1cm5Db2RlXVxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZXNlbmQgbWVzc2FnZXMuXG4gICAgICAgICAgICB2YXIgc2VxdWVuY2VkTWVzc2FnZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIG1zZ0lkIGluIHRoaXMuX3NlbnRNZXNzYWdlcykge1xuICAgICAgICAgICAgICBpZiAodGhpcy5fc2VudE1lc3NhZ2VzLmhhc093blByb3BlcnR5KG1zZ0lkKSlcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZWRNZXNzYWdlcy5wdXNoKHRoaXMuX3NlbnRNZXNzYWdlc1ttc2dJZF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBbHNvIHNjaGVkdWxlIHFvcyAwIGJ1ZmZlcmVkIG1lc3NhZ2VzIGlmIGFueVxuICAgICAgICAgICAgaWYgKHRoaXMuX2J1ZmZlcmVkX21zZ19xdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHZhciBtc2cgPSBudWxsO1xuICAgICAgICAgICAgICB3aGlsZSAoKG1zZyA9IHRoaXMuX2J1ZmZlcmVkX21zZ19xdWV1ZS5wb3AoKSkpIHtcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZWRNZXNzYWdlcy5wdXNoKG1zZyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub25NZXNzYWdlRGVsaXZlcmVkKVxuICAgICAgICAgICAgICAgICAgdGhpcy5fbm90aWZ5X21zZ19zZW50W21zZ10gPSB0aGlzLm9uTWVzc2FnZURlbGl2ZXJlZChcbiAgICAgICAgICAgICAgICAgICAgbXNnLnBheWxvYWRNZXNzYWdlXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNvcnQgc2VudE1lc3NhZ2VzIGludG8gdGhlIG9yaWdpbmFsIHNlbnQgb3JkZXIuXG4gICAgICAgICAgICB2YXIgc2VxdWVuY2VkTWVzc2FnZXMgPSBzZXF1ZW5jZWRNZXNzYWdlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGEuc2VxdWVuY2UgLSBiLnNlcXVlbmNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2VxdWVuY2VkTWVzc2FnZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIHNlbnRNZXNzYWdlID0gc2VxdWVuY2VkTWVzc2FnZXNbaV07XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBzZW50TWVzc2FnZS50eXBlID09IE1FU1NBR0VfVFlQRS5QVUJMSVNIICYmXG4gICAgICAgICAgICAgICAgc2VudE1lc3NhZ2UucHViUmVjUmVjZWl2ZWRcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdmFyIHB1YlJlbE1lc3NhZ2UgPSBuZXcgV2lyZU1lc3NhZ2UoTUVTU0FHRV9UWVBFLlBVQlJFTCwge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZUlkZW50aWZpZXI6IHNlbnRNZXNzYWdlLm1lc3NhZ2VJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVfbWVzc2FnZShwdWJSZWxNZXNzYWdlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zY2hlZHVsZV9tZXNzYWdlKHNlbnRNZXNzYWdlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFeGVjdXRlIHRoZSBjb25uZWN0T3B0aW9ucy5vblN1Y2Nlc3MgY2FsbGJhY2sgaWYgdGhlcmUgaXMgb25lLlxuICAgICAgICAgICAgLy8gV2lsbCBhbHNvIG5vdyByZXR1cm4gaWYgdGhpcyBjb25uZWN0aW9uIHdhcyB0aGUgcmVzdWx0IG9mIGFuIGF1dG9tYXRpY1xuICAgICAgICAgICAgLy8gcmVjb25uZWN0IGFuZCB3aGljaCBVUkkgd2FzIHN1Y2Nlc3NmdWxseSBjb25uZWN0ZWQgdG8uXG4gICAgICAgICAgICBpZiAodGhpcy5jb25uZWN0T3B0aW9ucy5vblN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgdGhpcy5jb25uZWN0T3B0aW9ucy5vblN1Y2Nlc3Moe1xuICAgICAgICAgICAgICAgIGludm9jYXRpb25Db250ZXh0OiB0aGlzLmNvbm5lY3RPcHRpb25zLmludm9jYXRpb25Db250ZXh0XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmVjb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWNvbm5lY3RpbmcpIHtcbiAgICAgICAgICAgICAgcmVjb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICB0aGlzLl9yZWNvbm5lY3RJbnRlcnZhbCA9IDE7XG4gICAgICAgICAgICAgIHRoaXMuX3JlY29ubmVjdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFeGVjdXRlIHRoZSBvbkNvbm5lY3RlZCBjYWxsYmFjayBpZiB0aGVyZSBpcyBvbmUuXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0ZWQocmVjb25uZWN0ZWQsIHRoaXMuX3dzdXJpKTtcblxuICAgICAgICAgICAgLy8gUHJvY2VzcyBhbGwgcXVldWVkIG1lc3NhZ2VzIG5vdyB0aGF0IHRoZSBjb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkLlxuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc19xdWV1ZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIE1FU1NBR0VfVFlQRS5QVUJMSVNIOlxuICAgICAgICAgICAgdGhpcy5fcmVjZWl2ZVB1Ymxpc2god2lyZU1lc3NhZ2UpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIE1FU1NBR0VfVFlQRS5QVUJBQ0s6XG4gICAgICAgICAgICB2YXIgc2VudE1lc3NhZ2UgPSB0aGlzLl9zZW50TWVzc2FnZXNbd2lyZU1lc3NhZ2UubWVzc2FnZUlkZW50aWZpZXJdO1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIHJlIGZsb3cgb2YgYSBQVUJBQ0sgYWZ0ZXIgd2UgaGF2ZSByZXN0YXJ0ZWQgcmVjZWl2ZWRNZXNzYWdlIHdpbGwgbm90IGV4aXN0LlxuICAgICAgICAgICAgaWYgKHNlbnRNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zZW50TWVzc2FnZXNbd2lyZU1lc3NhZ2UubWVzc2FnZUlkZW50aWZpZXJdO1xuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcbiAgICAgICAgICAgICAgICBcIlNlbnQ6XCIgKyB0aGlzLl9sb2NhbEtleSArIHdpcmVNZXNzYWdlLm1lc3NhZ2VJZGVudGlmaWVyXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZURlbGl2ZXJlZClcbiAgICAgICAgICAgICAgICB0aGlzLm9uTWVzc2FnZURlbGl2ZXJlZChzZW50TWVzc2FnZS5wYXlsb2FkTWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgTUVTU0FHRV9UWVBFLlBVQlJFQzpcbiAgICAgICAgICAgIHZhciBzZW50TWVzc2FnZSA9IHRoaXMuX3NlbnRNZXNzYWdlc1t3aXJlTWVzc2FnZS5tZXNzYWdlSWRlbnRpZmllcl07XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIGEgcmUgZmxvdyBvZiBhIFBVQlJFQyBhZnRlciB3ZSBoYXZlIHJlc3RhcnRlZCByZWNlaXZlZE1lc3NhZ2Ugd2lsbCBub3QgZXhpc3QuXG4gICAgICAgICAgICBpZiAoc2VudE1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgc2VudE1lc3NhZ2UucHViUmVjUmVjZWl2ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICB2YXIgcHViUmVsTWVzc2FnZSA9IG5ldyBXaXJlTWVzc2FnZShNRVNTQUdFX1RZUEUuUFVCUkVMLCB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkZW50aWZpZXI6IHdpcmVNZXNzYWdlLm1lc3NhZ2VJZGVudGlmaWVyXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB0aGlzLnN0b3JlKFwiU2VudDpcIiwgc2VudE1lc3NhZ2UpO1xuICAgICAgICAgICAgICB0aGlzLl9zY2hlZHVsZV9tZXNzYWdlKHB1YlJlbE1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIE1FU1NBR0VfVFlQRS5QVUJSRUw6XG4gICAgICAgICAgICB2YXIgcmVjZWl2ZWRNZXNzYWdlID0gdGhpcy5fcmVjZWl2ZWRNZXNzYWdlc1tcbiAgICAgICAgICAgICAgd2lyZU1lc3NhZ2UubWVzc2FnZUlkZW50aWZpZXJcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcbiAgICAgICAgICAgICAgXCJSZWNlaXZlZDpcIiArIHRoaXMuX2xvY2FsS2V5ICsgd2lyZU1lc3NhZ2UubWVzc2FnZUlkZW50aWZpZXJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIGEgcmUgZmxvdyBvZiBhIFBVQlJFTCBhZnRlciB3ZSBoYXZlIHJlc3RhcnRlZCByZWNlaXZlZE1lc3NhZ2Ugd2lsbCBub3QgZXhpc3QuXG4gICAgICAgICAgICBpZiAocmVjZWl2ZWRNZXNzYWdlKSB7XG4gICAgICAgICAgICAgIHRoaXMuX3JlY2VpdmVNZXNzYWdlKHJlY2VpdmVkTWVzc2FnZSk7XG4gICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9yZWNlaXZlZE1lc3NhZ2VzW3dpcmVNZXNzYWdlLm1lc3NhZ2VJZGVudGlmaWVyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEFsd2F5cyBmbG93IFB1YkNvbXAsIHdlIG1heSBoYXZlIHByZXZpb3VzbHkgZmxvd2VkIFB1YkNvbXAgYnV0IHRoZSBzZXJ2ZXIgbG9zdCBpdCBhbmQgcmVzdGFydGVkLlxuICAgICAgICAgICAgdmFyIHB1YkNvbXBNZXNzYWdlID0gbmV3IFdpcmVNZXNzYWdlKE1FU1NBR0VfVFlQRS5QVUJDT01QLCB7XG4gICAgICAgICAgICAgIG1lc3NhZ2VJZGVudGlmaWVyOiB3aXJlTWVzc2FnZS5tZXNzYWdlSWRlbnRpZmllclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZV9tZXNzYWdlKHB1YkNvbXBNZXNzYWdlKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIE1FU1NBR0VfVFlQRS5QVUJDT01QOlxuICAgICAgICAgICAgdmFyIHNlbnRNZXNzYWdlID0gdGhpcy5fc2VudE1lc3NhZ2VzW3dpcmVNZXNzYWdlLm1lc3NhZ2VJZGVudGlmaWVyXTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zZW50TWVzc2FnZXNbd2lyZU1lc3NhZ2UubWVzc2FnZUlkZW50aWZpZXJdO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXG4gICAgICAgICAgICAgIFwiU2VudDpcIiArIHRoaXMuX2xvY2FsS2V5ICsgd2lyZU1lc3NhZ2UubWVzc2FnZUlkZW50aWZpZXJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodGhpcy5vbk1lc3NhZ2VEZWxpdmVyZWQpXG4gICAgICAgICAgICAgIHRoaXMub25NZXNzYWdlRGVsaXZlcmVkKHNlbnRNZXNzYWdlLnBheWxvYWRNZXNzYWdlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuU1VCQUNLOlxuICAgICAgICAgICAgdmFyIHNlbnRNZXNzYWdlID0gdGhpcy5fc2VudE1lc3NhZ2VzW3dpcmVNZXNzYWdlLm1lc3NhZ2VJZGVudGlmaWVyXTtcbiAgICAgICAgICAgIGlmIChzZW50TWVzc2FnZSkge1xuICAgICAgICAgICAgICBpZiAoc2VudE1lc3NhZ2UudGltZU91dCkgc2VudE1lc3NhZ2UudGltZU91dC5jYW5jZWwoKTtcbiAgICAgICAgICAgICAgLy8gVGhpcyB3aWxsIG5lZWQgdG8gYmUgZml4ZWQgd2hlbiB3ZSBhZGQgbXVsdGlwbGUgdG9waWMgc3VwcG9ydFxuICAgICAgICAgICAgICBpZiAod2lyZU1lc3NhZ2UucmV0dXJuQ29kZVswXSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgICAgIGlmIChzZW50TWVzc2FnZS5vbkZhaWx1cmUpIHtcbiAgICAgICAgICAgICAgICAgIHNlbnRNZXNzYWdlLm9uRmFpbHVyZSh3aXJlTWVzc2FnZS5yZXR1cm5Db2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VudE1lc3NhZ2Uub25TdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgc2VudE1lc3NhZ2Uub25TdWNjZXNzKHdpcmVNZXNzYWdlLnJldHVybkNvZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zZW50TWVzc2FnZXNbd2lyZU1lc3NhZ2UubWVzc2FnZUlkZW50aWZpZXJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIE1FU1NBR0VfVFlQRS5VTlNVQkFDSzpcbiAgICAgICAgICAgIHZhciBzZW50TWVzc2FnZSA9IHRoaXMuX3NlbnRNZXNzYWdlc1t3aXJlTWVzc2FnZS5tZXNzYWdlSWRlbnRpZmllcl07XG4gICAgICAgICAgICBpZiAoc2VudE1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgaWYgKHNlbnRNZXNzYWdlLnRpbWVPdXQpIHNlbnRNZXNzYWdlLnRpbWVPdXQuY2FuY2VsKCk7XG4gICAgICAgICAgICAgIGlmIChzZW50TWVzc2FnZS5jYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHNlbnRNZXNzYWdlLmNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3NlbnRNZXNzYWdlc1t3aXJlTWVzc2FnZS5tZXNzYWdlSWRlbnRpZmllcl07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSBNRVNTQUdFX1RZUEUuUElOR1JFU1A6XG4gICAgICAgICAgICAvKiBUaGUgc2VuZFBpbmdlciBvciByZWNlaXZlUGluZ2VyIG1heSBoYXZlIHNlbnQgYSBwaW5nLCB0aGUgcmVjZWl2ZVBpbmdlciBoYXMgYWxyZWFkeSBiZWVuIHJlc2V0LiAqL1xuICAgICAgICAgICAgdGhpcy5zZW5kUGluZ2VyLnJlc2V0KCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgTUVTU0FHRV9UWVBFLkRJU0NPTk5FQ1Q6XG4gICAgICAgICAgICAvLyBDbGllbnRzIGRvIG5vdCBleHBlY3QgdG8gcmVjZWl2ZSBkaXNjb25uZWN0IHBhY2tldHMuXG4gICAgICAgICAgICB0aGlzLl9kaXNjb25uZWN0ZWQoXG4gICAgICAgICAgICAgIEVSUk9SLklOVkFMSURfTVFUVF9NRVNTQUdFX1RZUEUuY29kZSxcbiAgICAgICAgICAgICAgZm9ybWF0KEVSUk9SLklOVkFMSURfTVFUVF9NRVNTQUdFX1RZUEUsIFt3aXJlTWVzc2FnZS50eXBlXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLl9kaXNjb25uZWN0ZWQoXG4gICAgICAgICAgICAgIEVSUk9SLklOVkFMSURfTVFUVF9NRVNTQUdFX1RZUEUuY29kZSxcbiAgICAgICAgICAgICAgZm9ybWF0KEVSUk9SLklOVkFMSURfTVFUVF9NRVNTQUdFX1RZUEUsIFt3aXJlTWVzc2FnZS50eXBlXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHZhciBlcnJvclN0YWNrID1cbiAgICAgICAgICBlcnJvci5oYXNPd25Qcm9wZXJ0eShcInN0YWNrXCIpID09IFwidW5kZWZpbmVkXCJcbiAgICAgICAgICAgID8gZXJyb3Iuc3RhY2sudG9TdHJpbmcoKVxuICAgICAgICAgICAgOiBcIk5vIEVycm9yIFN0YWNrIEF2YWlsYWJsZVwiO1xuICAgICAgICB0aGlzLl9kaXNjb25uZWN0ZWQoXG4gICAgICAgICAgRVJST1IuSU5URVJOQUxfRVJST1IuY29kZSxcbiAgICAgICAgICBmb3JtYXQoRVJST1IuSU5URVJOQUxfRVJST1IsIFtlcnJvci5tZXNzYWdlLCBlcnJvclN0YWNrXSlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKiogQGlnbm9yZSAqL1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLl9vbl9zb2NrZXRfZXJyb3IgPSBmdW5jdGlvbihlcnJvcikge1xuICAgICAgaWYgKCF0aGlzLl9yZWNvbm5lY3RpbmcpIHtcbiAgICAgICAgdGhpcy5fZGlzY29ubmVjdGVkKFxuICAgICAgICAgIEVSUk9SLlNPQ0tFVF9FUlJPUi5jb2RlLFxuICAgICAgICAgIGZvcm1hdChFUlJPUi5TT0NLRVRfRVJST1IsIFtlcnJvci5kYXRhXSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqIEBpZ25vcmUgKi9cbiAgICBDbGllbnRJbXBsLnByb3RvdHlwZS5fb25fc29ja2V0X2Nsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMuX3JlY29ubmVjdGluZykge1xuICAgICAgICB0aGlzLl9kaXNjb25uZWN0ZWQoRVJST1IuU09DS0VUX0NMT1NFLmNvZGUsIGZvcm1hdChFUlJPUi5TT0NLRVRfQ0xPU0UpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqIEBpZ25vcmUgKi9cbiAgICBDbGllbnRJbXBsLnByb3RvdHlwZS5fc29ja2V0X3NlbmQgPSBmdW5jdGlvbih3aXJlTWVzc2FnZSkge1xuICAgICAgaWYgKHdpcmVNZXNzYWdlLnR5cGUgPT0gMSkge1xuICAgICAgICB2YXIgd2lyZU1lc3NhZ2VNYXNrZWQgPSB0aGlzLl90cmFjZU1hc2sod2lyZU1lc3NhZ2UsIFwicGFzc3dvcmRcIik7XG4gICAgICAgIHRoaXMuX3RyYWNlKFwiQ2xpZW50Ll9zb2NrZXRfc2VuZFwiLCB3aXJlTWVzc2FnZU1hc2tlZCk7XG4gICAgICB9IGVsc2UgdGhpcy5fdHJhY2UoXCJDbGllbnQuX3NvY2tldF9zZW5kXCIsIHdpcmVNZXNzYWdlKTtcblxuICAgICAgdGhpcy5zb2NrZXQuc2VuZCh3aXJlTWVzc2FnZS5lbmNvZGUoKSk7XG4gICAgICAvKiBXZSBoYXZlIHByb3ZlZCB0byB0aGUgc2VydmVyIHdlIGFyZSBhbGl2ZS4gKi9cbiAgICAgIHRoaXMuc2VuZFBpbmdlci5yZXNldCgpO1xuICAgIH07XG5cbiAgICAvKiogQGlnbm9yZSAqL1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLl9yZWNlaXZlUHVibGlzaCA9IGZ1bmN0aW9uKHdpcmVNZXNzYWdlKSB7XG4gICAgICBzd2l0Y2ggKHdpcmVNZXNzYWdlLnBheWxvYWRNZXNzYWdlLnFvcykge1xuICAgICAgICBjYXNlIFwidW5kZWZpbmVkXCI6XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICB0aGlzLl9yZWNlaXZlTWVzc2FnZSh3aXJlTWVzc2FnZSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHZhciBwdWJBY2tNZXNzYWdlID0gbmV3IFdpcmVNZXNzYWdlKE1FU1NBR0VfVFlQRS5QVUJBQ0ssIHtcbiAgICAgICAgICAgIG1lc3NhZ2VJZGVudGlmaWVyOiB3aXJlTWVzc2FnZS5tZXNzYWdlSWRlbnRpZmllclxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuX3NjaGVkdWxlX21lc3NhZ2UocHViQWNrTWVzc2FnZSk7XG4gICAgICAgICAgdGhpcy5fcmVjZWl2ZU1lc3NhZ2Uod2lyZU1lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0aGlzLl9yZWNlaXZlZE1lc3NhZ2VzW3dpcmVNZXNzYWdlLm1lc3NhZ2VJZGVudGlmaWVyXSA9IHdpcmVNZXNzYWdlO1xuICAgICAgICAgIHRoaXMuc3RvcmUoXCJSZWNlaXZlZDpcIiwgd2lyZU1lc3NhZ2UpO1xuICAgICAgICAgIHZhciBwdWJSZWNNZXNzYWdlID0gbmV3IFdpcmVNZXNzYWdlKE1FU1NBR0VfVFlQRS5QVUJSRUMsIHtcbiAgICAgICAgICAgIG1lc3NhZ2VJZGVudGlmaWVyOiB3aXJlTWVzc2FnZS5tZXNzYWdlSWRlbnRpZmllclxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuX3NjaGVkdWxlX21lc3NhZ2UocHViUmVjTWVzc2FnZSk7XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IEVycm9yKFwiSW52YWlsZCBxb3M9XCIgKyB3aXJlTWVzc2FnZS5wYXlsb2FkTWVzc2FnZS5xb3MpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKiogQGlnbm9yZSAqL1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLl9yZWNlaXZlTWVzc2FnZSA9IGZ1bmN0aW9uKHdpcmVNZXNzYWdlKSB7XG4gICAgICBpZiAodGhpcy5vbk1lc3NhZ2VBcnJpdmVkKSB7XG4gICAgICAgIHRoaXMub25NZXNzYWdlQXJyaXZlZCh3aXJlTWVzc2FnZS5wYXlsb2FkTWVzc2FnZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENsaWVudCBoYXMgY29ubmVjdGVkLlxuICAgICAqIEBwYXJhbSB7cmVjb25uZWN0fSBbYm9vbGVhbl0gaW5kaWNhdGUgaWYgdGhpcyB3YXMgYSByZXN1bHQgb2YgcmVjb25uZWN0IG9wZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0ge3VyaX0gW3N0cmluZ10gZnVsbHkgcXVhbGlmaWVkIFdlYlNvY2tldCBVUkkgb2YgdGhlIHNlcnZlci5cbiAgICAgKi9cbiAgICBDbGllbnRJbXBsLnByb3RvdHlwZS5fY29ubmVjdGVkID0gZnVuY3Rpb24ocmVjb25uZWN0LCB1cmkpIHtcbiAgICAgIC8vIEV4ZWN1dGUgdGhlIG9uQ29ubmVjdGVkIGNhbGxiYWNrIGlmIHRoZXJlIGlzIG9uZS5cbiAgICAgIGlmICh0aGlzLm9uQ29ubmVjdGVkKSB0aGlzLm9uQ29ubmVjdGVkKHJlY29ubmVjdCwgdXJpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gcmVjb25uZWN0IHRoZSBjbGllbnQgdG8gdGhlIHNlcnZlci5cbiAgICAgKiBGb3IgZWFjaCByZWNvbm5lY3QgYXR0ZW1wdCwgd2lsbCBkb3VibGUgdGhlIHJlY29ubmVjdCBpbnRlcnZhbFxuICAgICAqIHVwIHRvIDEyOCBzZWNvbmRzLlxuICAgICAqL1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLl9yZWNvbm5lY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX3RyYWNlKFwiQ2xpZW50Ll9yZWNvbm5lY3RcIik7XG4gICAgICBpZiAoIXRoaXMuY29ubmVjdGVkKSB7XG4gICAgICAgIHRoaXMuX3JlY29ubmVjdGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2VuZFBpbmdlci5jYW5jZWwoKTtcbiAgICAgICAgdGhpcy5yZWNlaXZlUGluZ2VyLmNhbmNlbCgpO1xuICAgICAgICBpZiAodGhpcy5fcmVjb25uZWN0SW50ZXJ2YWwgPCAxMjgpXG4gICAgICAgICAgdGhpcy5fcmVjb25uZWN0SW50ZXJ2YWwgPSB0aGlzLl9yZWNvbm5lY3RJbnRlcnZhbCAqIDI7XG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3RPcHRpb25zLnVyaXMpIHtcbiAgICAgICAgICB0aGlzLmhvc3RJbmRleCA9IDA7XG4gICAgICAgICAgdGhpcy5fZG9Db25uZWN0KHRoaXMuY29ubmVjdE9wdGlvbnMudXJpc1swXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZG9Db25uZWN0KHRoaXMudXJpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDbGllbnQgaGFzIGRpc2Nvbm5lY3RlZCBlaXRoZXIgYXQgaXRzIG93biByZXF1ZXN0IG9yIGJlY2F1c2UgdGhlIHNlcnZlclxuICAgICAqIG9yIG5ldHdvcmsgZGlzY29ubmVjdGVkIGl0LiBSZW1vdmUgYWxsIG5vbi1kdXJhYmxlIHN0YXRlLlxuICAgICAqIEBwYXJhbSB7ZXJyb3JDb2RlfSBbbnVtYmVyXSB0aGUgZXJyb3IgbnVtYmVyLlxuICAgICAqIEBwYXJhbSB7ZXJyb3JUZXh0fSBbc3RyaW5nXSB0aGUgZXJyb3IgdGV4dC5cbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgQ2xpZW50SW1wbC5wcm90b3R5cGUuX2Rpc2Nvbm5lY3RlZCA9IGZ1bmN0aW9uKGVycm9yQ29kZSwgZXJyb3JUZXh0KSB7XG4gICAgICB0aGlzLl90cmFjZShcIkNsaWVudC5fZGlzY29ubmVjdGVkXCIsIGVycm9yQ29kZSwgZXJyb3JUZXh0KTtcblxuICAgICAgaWYgKGVycm9yQ29kZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX3JlY29ubmVjdGluZykge1xuICAgICAgICAvL0NvbnRpbnVlIGF1dG9tYXRpYyByZWNvbm5lY3QgcHJvY2Vzc1xuICAgICAgICB0aGlzLl9yZWNvbm5lY3RUaW1lb3V0ID0gbmV3IFRpbWVvdXQoXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgICB0aGlzLl9yZWNvbm5lY3RJbnRlcnZhbCxcbiAgICAgICAgICB0aGlzLl9yZWNvbm5lY3RcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNlbmRQaW5nZXIuY2FuY2VsKCk7XG4gICAgICB0aGlzLnJlY2VpdmVQaW5nZXIuY2FuY2VsKCk7XG4gICAgICBpZiAodGhpcy5fY29ubmVjdFRpbWVvdXQpIHtcbiAgICAgICAgdGhpcy5fY29ubmVjdFRpbWVvdXQuY2FuY2VsKCk7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3RUaW1lb3V0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gQ2xlYXIgbWVzc2FnZSBidWZmZXJzLlxuICAgICAgdGhpcy5fbXNnX3F1ZXVlID0gW107XG4gICAgICB0aGlzLl9idWZmZXJlZF9tc2dfcXVldWUgPSBbXTtcbiAgICAgIHRoaXMuX25vdGlmeV9tc2dfc2VudCA9IHt9O1xuXG4gICAgICBpZiAodGhpcy5zb2NrZXQpIHtcbiAgICAgICAgLy8gQ2FuY2VsIGFsbCBzb2NrZXQgY2FsbGJhY2tzIHNvIHRoYXQgdGhleSBjYW5ub3QgYmUgZHJpdmVuIGFnYWluIGJ5IHRoaXMgc29ja2V0LlxuICAgICAgICB0aGlzLnNvY2tldC5vbm9wZW4gPSBudWxsO1xuICAgICAgICB0aGlzLnNvY2tldC5vbm1lc3NhZ2UgPSBudWxsO1xuICAgICAgICB0aGlzLnNvY2tldC5vbmVycm9yID0gbnVsbDtcbiAgICAgICAgdGhpcy5zb2NrZXQub25jbG9zZSA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSAxKSB0aGlzLnNvY2tldC5jbG9zZSgpO1xuICAgICAgICBkZWxldGUgdGhpcy5zb2NrZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5jb25uZWN0T3B0aW9ucy51cmlzICYmXG4gICAgICAgIHRoaXMuaG9zdEluZGV4IDwgdGhpcy5jb25uZWN0T3B0aW9ucy51cmlzLmxlbmd0aCAtIDFcbiAgICAgICkge1xuICAgICAgICAvLyBUcnkgdGhlIG5leHQgaG9zdC5cbiAgICAgICAgdGhpcy5ob3N0SW5kZXgrKztcbiAgICAgICAgdGhpcy5fZG9Db25uZWN0KHRoaXMuY29ubmVjdE9wdGlvbnMudXJpc1t0aGlzLmhvc3RJbmRleF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGVycm9yQ29kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZXJyb3JDb2RlID0gRVJST1IuT0suY29kZTtcbiAgICAgICAgICBlcnJvclRleHQgPSBmb3JtYXQoRVJST1IuT0spO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUnVuIGFueSBhcHBsaWNhdGlvbiBjYWxsYmFja3MgbGFzdCBhcyB0aGV5IG1heSBhdHRlbXB0IHRvIHJlY29ubmVjdCBhbmQgaGVuY2UgY3JlYXRlIGEgbmV3IHNvY2tldC5cbiAgICAgICAgaWYgKHRoaXMuY29ubmVjdGVkKSB7XG4gICAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAvLyBFeGVjdXRlIHRoZSBjb25uZWN0aW9uTG9zdENhbGxiYWNrIGlmIHRoZXJlIGlzIG9uZSwgYW5kIHdlIHdlcmUgY29ubmVjdGVkLlxuICAgICAgICAgIGlmICh0aGlzLm9uQ29ubmVjdGlvbkxvc3QpIHtcbiAgICAgICAgICAgIHRoaXMub25Db25uZWN0aW9uTG9zdCh7XG4gICAgICAgICAgICAgIGVycm9yQ29kZTogZXJyb3JDb2RlLFxuICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGVycm9yVGV4dCxcbiAgICAgICAgICAgICAgcmVjb25uZWN0OiB0aGlzLmNvbm5lY3RPcHRpb25zLnJlY29ubmVjdCxcbiAgICAgICAgICAgICAgdXJpOiB0aGlzLl93c3VyaVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChlcnJvckNvZGUgIT09IEVSUk9SLk9LLmNvZGUgJiYgdGhpcy5jb25uZWN0T3B0aW9ucy5yZWNvbm5lY3QpIHtcbiAgICAgICAgICAgIC8vIFN0YXJ0IGF1dG9tYXRpYyByZWNvbm5lY3QgcHJvY2VzcyBmb3IgdGhlIHZlcnkgZmlyc3QgdGltZSBzaW5jZSBsYXN0IHN1Y2Nlc3NmdWwgY29ubmVjdC5cbiAgICAgICAgICAgIHRoaXMuX3JlY29ubmVjdEludGVydmFsID0gMTtcbiAgICAgICAgICAgIHRoaXMuX3JlY29ubmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2Ugd2UgbmV2ZXIgaGFkIGEgY29ubmVjdGlvbiwgc28gaW5kaWNhdGUgdGhhdCB0aGUgY29ubmVjdCBoYXMgZmFpbGVkLlxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdE9wdGlvbnMubXF0dFZlcnNpb24gPT09IDQgJiZcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdE9wdGlvbnMubXF0dFZlcnNpb25FeHBsaWNpdCA9PT0gZmFsc2VcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuX3RyYWNlKFwiRmFpbGVkIHRvIGNvbm5lY3QgVjQsIGRyb3BwaW5nIGJhY2sgdG8gVjNcIik7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RPcHRpb25zLm1xdHRWZXJzaW9uID0gMztcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbm5lY3RPcHRpb25zLnVyaXMpIHtcbiAgICAgICAgICAgICAgdGhpcy5ob3N0SW5kZXggPSAwO1xuICAgICAgICAgICAgICB0aGlzLl9kb0Nvbm5lY3QodGhpcy5jb25uZWN0T3B0aW9ucy51cmlzWzBdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2RvQ29ubmVjdCh0aGlzLnVyaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbm5lY3RPcHRpb25zLm9uRmFpbHVyZSkge1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0T3B0aW9ucy5vbkZhaWx1cmUoe1xuICAgICAgICAgICAgICBpbnZvY2F0aW9uQ29udGV4dDogdGhpcy5jb25uZWN0T3B0aW9ucy5pbnZvY2F0aW9uQ29udGV4dCxcbiAgICAgICAgICAgICAgZXJyb3JDb2RlOiBlcnJvckNvZGUsXG4gICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZXJyb3JUZXh0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqIEBpZ25vcmUgKi9cbiAgICBDbGllbnRJbXBsLnByb3RvdHlwZS5fdHJhY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIFBhc3MgdHJhY2UgbWVzc2FnZSBiYWNrIHRvIGNsaWVudCdzIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICBpZiAodGhpcy50cmFjZUZ1bmN0aW9uKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBhcmdzKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBhcmdzW2ldICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgYXJncy5zcGxpY2UoaSwgMSwgSlNPTi5zdHJpbmdpZnkoYXJnc1tpXSkpO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZWNvcmQgPSBhcmdzLmpvaW4oXCJcIik7XG4gICAgICAgIHRoaXMudHJhY2VGdW5jdGlvbih7IHNldmVyaXR5OiBcIkRlYnVnXCIsIG1lc3NhZ2U6IHJlY29yZCB9KTtcbiAgICAgIH1cblxuICAgICAgLy9idWZmZXIgc3R5bGUgdHJhY2VcbiAgICAgIGlmICh0aGlzLl90cmFjZUJ1ZmZlciAhPT0gbnVsbCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbWF4ID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG1heDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX3RyYWNlQnVmZmVyLmxlbmd0aCA9PSB0aGlzLl9NQVhfVFJBQ0VfRU5UUklFUykge1xuICAgICAgICAgICAgdGhpcy5fdHJhY2VCdWZmZXIuc2hpZnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGkgPT09IDApIHRoaXMuX3RyYWNlQnVmZmVyLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnRzW2ldID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgdGhpcy5fdHJhY2VCdWZmZXIucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgICAgIGVsc2UgdGhpcy5fdHJhY2VCdWZmZXIucHVzaChcIiAgXCIgKyBKU09OLnN0cmluZ2lmeShhcmd1bWVudHNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKiogQGlnbm9yZSAqL1xuICAgIENsaWVudEltcGwucHJvdG90eXBlLl90cmFjZU1hc2sgPSBmdW5jdGlvbih0cmFjZU9iamVjdCwgbWFza2VkKSB7XG4gICAgICB2YXIgdHJhY2VPYmplY3RNYXNrZWQgPSB7fTtcbiAgICAgIGZvciAodmFyIGF0dHIgaW4gdHJhY2VPYmplY3QpIHtcbiAgICAgICAgaWYgKHRyYWNlT2JqZWN0Lmhhc093blByb3BlcnR5KGF0dHIpKSB7XG4gICAgICAgICAgaWYgKGF0dHIgPT0gbWFza2VkKSB0cmFjZU9iamVjdE1hc2tlZFthdHRyXSA9IFwiKioqKioqXCI7XG4gICAgICAgICAgZWxzZSB0cmFjZU9iamVjdE1hc2tlZFthdHRyXSA9IHRyYWNlT2JqZWN0W2F0dHJdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJhY2VPYmplY3RNYXNrZWQ7XG4gICAgfTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFB1YmxpYyBQcm9ncmFtbWluZyBpbnRlcmZhY2UuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSmF2YVNjcmlwdCBhcHBsaWNhdGlvbiBjb21tdW5pY2F0ZXMgdG8gdGhlIHNlcnZlciB1c2luZyBhIHtAbGluayBQYWhvLkNsaWVudH0gb2JqZWN0LlxuICAgICAqIDxwPlxuICAgICAqIE1vc3QgYXBwbGljYXRpb25zIHdpbGwgY3JlYXRlIGp1c3Qgb25lIENsaWVudCBvYmplY3QgYW5kIHRoZW4gY2FsbCBpdHMgY29ubmVjdCgpIG1ldGhvZCxcbiAgICAgKiBob3dldmVyIGFwcGxpY2F0aW9ucyBjYW4gY3JlYXRlIG1vcmUgdGhhbiBvbmUgQ2xpZW50IG9iamVjdCBpZiB0aGV5IHdpc2guXG4gICAgICogSW4gdGhpcyBjYXNlIHRoZSBjb21iaW5hdGlvbiBvZiBob3N0LCBwb3J0IGFuZCBjbGllbnRJZCBhdHRyaWJ1dGVzIG11c3QgYmUgZGlmZmVyZW50IGZvciBlYWNoIENsaWVudCBvYmplY3QuXG4gICAgICogPHA+XG4gICAgICogVGhlIHNlbmQsIHN1YnNjcmliZSBhbmQgdW5zdWJzY3JpYmUgbWV0aG9kcyBhcmUgaW1wbGVtZW50ZWQgYXMgYXN5bmNocm9ub3VzIEphdmFTY3JpcHQgbWV0aG9kc1xuICAgICAqIChldmVuIHRob3VnaCB0aGUgdW5kZXJseWluZyBwcm90b2NvbCBleGNoYW5nZSBtaWdodCBiZSBzeW5jaHJvbm91cyBpbiBuYXR1cmUpLlxuICAgICAqIFRoaXMgbWVhbnMgdGhleSBzaWduYWwgdGhlaXIgY29tcGxldGlvbiBieSBjYWxsaW5nIGJhY2sgdG8gdGhlIGFwcGxpY2F0aW9uLFxuICAgICAqIHZpYSBTdWNjZXNzIG9yIEZhaWx1cmUgY2FsbGJhY2sgZnVuY3Rpb25zIHByb3ZpZGVkIGJ5IHRoZSBhcHBsaWNhdGlvbiBvbiB0aGUgbWV0aG9kIGluIHF1ZXN0aW9uLlxuICAgICAqIFN1Y2ggY2FsbGJhY2tzIGFyZSBjYWxsZWQgYXQgbW9zdCBvbmNlIHBlciBtZXRob2QgaW52b2NhdGlvbiBhbmQgZG8gbm90IHBlcnNpc3QgYmV5b25kIHRoZSBsaWZldGltZVxuICAgICAqIG9mIHRoZSBzY3JpcHQgdGhhdCBtYWRlIHRoZSBpbnZvY2F0aW9uLlxuICAgICAqIDxwPlxuICAgICAqIEluIGNvbnRyYXN0IHRoZXJlIGFyZSBzb21lIGNhbGxiYWNrIGZ1bmN0aW9ucywgbW9zdCBub3RhYmx5IDxpPm9uTWVzc2FnZUFycml2ZWQ8L2k+LFxuICAgICAqIHRoYXQgYXJlIGRlZmluZWQgb24gdGhlIHtAbGluayBQYWhvLkNsaWVudH0gb2JqZWN0LlxuICAgICAqIFRoZXNlIG1heSBnZXQgY2FsbGVkIG11bHRpcGxlIHRpbWVzLCBhbmQgYXJlbid0IGRpcmVjdGx5IHJlbGF0ZWQgdG8gc3BlY2lmaWMgbWV0aG9kIGludm9jYXRpb25zIG1hZGUgYnkgdGhlIGNsaWVudC5cbiAgICAgKlxuICAgICAqIEBuYW1lIFBhaG8uQ2xpZW50XG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBob3N0IC0gdGhlIGFkZHJlc3Mgb2YgdGhlIG1lc3NhZ2luZyBzZXJ2ZXIsIGFzIGEgZnVsbHkgcXVhbGlmaWVkIFdlYlNvY2tldCBVUkksIGFzIGEgRE5TIG5hbWUgb3IgZG90dGVkIGRlY2ltYWwgSVAgYWRkcmVzcy5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9ydCAtIHRoZSBwb3J0IG51bWJlciB0byBjb25uZWN0IHRvIC0gb25seSByZXF1aXJlZCBpZiBob3N0IGlzIG5vdCBhIFVSSVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gdGhlIHBhdGggb24gdGhlIGhvc3QgdG8gY29ubmVjdCB0byAtIG9ubHkgdXNlZCBpZiBob3N0IGlzIG5vdCBhIFVSSS4gRGVmYXVsdDogJy9tcXR0Jy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2xpZW50SWQgLSB0aGUgTWVzc2FnaW5nIGNsaWVudCBpZGVudGlmaWVyLCBiZXR3ZWVuIDEgYW5kIDIzIGNoYXJhY3RlcnMgaW4gbGVuZ3RoLlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGhvc3QgLSA8aT5yZWFkIG9ubHk8L2k+IHRoZSBzZXJ2ZXIncyBETlMgaG9zdG5hbWUgb3IgZG90dGVkIGRlY2ltYWwgSVAgYWRkcmVzcy5cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gcG9ydCAtIDxpPnJlYWQgb25seTwvaT4gdGhlIHNlcnZlcidzIHBvcnQuXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHBhdGggLSA8aT5yZWFkIG9ubHk8L2k+IHRoZSBzZXJ2ZXIncyBwYXRoLlxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjbGllbnRJZCAtIDxpPnJlYWQgb25seTwvaT4gdXNlZCB3aGVuIGNvbm5lY3RpbmcgdG8gdGhlIHNlcnZlci5cbiAgICAgKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBvbkNvbm5lY3Rpb25Mb3N0IC0gY2FsbGVkIHdoZW4gYSBjb25uZWN0aW9uIGhhcyBiZWVuIGxvc3QuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXIgYSBjb25uZWN0KCkgbWV0aG9kIGhhcyBzdWNjZWVkZWQuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgRXN0YWJsaXNoIHRoZSBjYWxsIGJhY2sgdXNlZCB3aGVuIGEgY29ubmVjdGlvbiBoYXMgYmVlbiBsb3N0LiBUaGUgY29ubmVjdGlvbiBtYXkgYmVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb3N0IGJlY2F1c2UgdGhlIGNsaWVudCBpbml0aWF0ZXMgYSBkaXNjb25uZWN0IG9yIGJlY2F1c2UgdGhlIHNlcnZlciBvciBuZXR3b3JrXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F1c2UgdGhlIGNsaWVudCB0byBiZSBkaXNjb25uZWN0ZWQuIFRoZSBkaXNjb25uZWN0IGNhbGwgYmFjayBtYXkgYmUgY2FsbGVkIHdpdGhvdXRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY29ubmVjdGlvbkNvbXBsZXRlIGNhbGwgYmFjayBiZWluZyBpbnZva2VkIGlmLCBmb3IgZXhhbXBsZSB0aGUgY2xpZW50IGZhaWxzIHRvXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdC5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBIHNpbmdsZSByZXNwb25zZSBvYmplY3QgcGFyYW1ldGVyIGlzIHBhc3NlZCB0byB0aGUgb25Db25uZWN0aW9uTG9zdCBjYWxsYmFjayBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgZmllbGRzOlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvbD5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+ZXJyb3JDb2RlXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPmVycm9yTWVzc2FnZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb2w+XG4gICAgICogQHByb3BlcnR5IHtmdW5jdGlvbn0gb25NZXNzYWdlRGVsaXZlcmVkIC0gY2FsbGVkIHdoZW4gYSBtZXNzYWdlIGhhcyBiZWVuIGRlbGl2ZXJlZC5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBbGwgcHJvY2Vzc2luZyB0aGF0IHRoaXMgQ2xpZW50IHdpbGwgZXZlciBkbyBoYXMgYmVlbiBjb21wbGV0ZWQuIFNvLCBmb3IgZXhhbXBsZSxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbiB0aGUgY2FzZSBvZiBhIFFvcz0yIG1lc3NhZ2Ugc2VudCBieSB0aGlzIGNsaWVudCwgdGhlIFB1YkNvbXAgZmxvdyBoYXMgYmVlbiByZWNlaXZlZCBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgdGhlIG1lc3NhZ2UgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHBlcnNpc3RlbnQgc3RvcmFnZSBiZWZvcmUgdGhpcyBjYWxsYmFjayBpcyBpbnZva2VkLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhcmFtZXRlcnMgcGFzc2VkIHRvIHRoZSBvbk1lc3NhZ2VEZWxpdmVyZWQgY2FsbGJhY2sgYXJlOlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvbD5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+e0BsaW5rIFBhaG8uTWVzc2FnZX0gdGhhdCB3YXMgZGVsaXZlcmVkLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb2w+XG4gICAgICogQHByb3BlcnR5IHtmdW5jdGlvbn0gb25NZXNzYWdlQXJyaXZlZCAtIGNhbGxlZCB3aGVuIGEgbWVzc2FnZSBoYXMgYXJyaXZlZCBpbiB0aGlzIFBhaG8uY2xpZW50LlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhcmFtZXRlcnMgcGFzc2VkIHRvIHRoZSBvbk1lc3NhZ2VBcnJpdmVkIGNhbGxiYWNrIGFyZTpcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b2w+XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPntAbGluayBQYWhvLk1lc3NhZ2V9IHRoYXQgaGFzIGFycml2ZWQuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vbD5cbiAgICAgKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBvbkNvbm5lY3RlZCAtIGNhbGxlZCB3aGVuIGEgY29ubmVjdGlvbiBpcyBzdWNjZXNzZnVsbHkgbWFkZSB0byB0aGUgc2VydmVyLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyIGEgY29ubmVjdCgpIG1ldGhvZC5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXJhbWV0ZXJzIHBhc3NlZCB0byB0aGUgb25Db25uZWN0ZWQgY2FsbGJhY2sgYXJlOlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvbD5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+cmVjb25uZWN0IChib29sZWFuKSAtIElmIHRydWUsIHRoZSBjb25uZWN0aW9uIHdhcyB0aGUgcmVzdWx0IG9mIGEgcmVjb25uZWN0LjwvbGk+XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlVSSSAoc3RyaW5nKSAtIFRoZSBVUkkgdXNlZCB0byBjb25uZWN0IHRvIHRoZSBzZXJ2ZXIuPC9saT5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29sPlxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gZGlzY29ubmVjdGVkUHVibGlzaGluZyAtIGlmIHNldCwgd2lsbCBlbmFibGUgZGlzY29ubmVjdGVkIHB1Ymxpc2hpbmcgaW5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW4gdGhlIGV2ZW50IHRoYXQgdGhlIGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciBpcyBsb3N0LlxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkaXNjb25uZWN0ZWRCdWZmZXJTaXplIC0gVXNlZCB0byBzZXQgdGhlIG1heGltdW0gbnVtYmVyIG9mIG1lc3NhZ2VzIHRoYXQgdGhlIGRpc2Nvbm5lY3RlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyIHdpbGwgaG9sZCBiZWZvcmUgcmVqZWN0aW5nIG5ldyBtZXNzYWdlcy4gRGVmYXVsdCBzaXplOiA1MDAwIG1lc3NhZ2VzXG4gICAgICogQHByb3BlcnR5IHtmdW5jdGlvbn0gdHJhY2UgLSBjYWxsZWQgd2hlbmV2ZXIgdHJhY2UgaXMgY2FsbGVkLiBUT0RPXG4gICAgICovXG4gICAgdmFyIENsaWVudCA9IGZ1bmN0aW9uKGhvc3QsIHBvcnQsIHBhdGgsIGNsaWVudElkKSB7XG4gICAgICB2YXIgdXJpO1xuXG4gICAgICBpZiAodHlwZW9mIGhvc3QgIT09IFwic3RyaW5nXCIpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoRVJST1IuSU5WQUxJRF9UWVBFLCBbdHlwZW9mIGhvc3QsIFwiaG9zdFwiXSkpO1xuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XG4gICAgICAgIC8vIGhvc3Q6IG11c3QgYmUgZnVsbCB3czovLyB1cmlcbiAgICAgICAgLy8gcG9ydDogY2xpZW50SWRcbiAgICAgICAgY2xpZW50SWQgPSBwb3J0O1xuICAgICAgICB1cmkgPSBob3N0O1xuICAgICAgICB2YXIgbWF0Y2ggPSB1cmkubWF0Y2goXG4gICAgICAgICAgL14od3NzPyk6XFwvXFwvKChcXFsoLispXFxdKXwoW15cXC9dKz8pKSg6KFxcZCspKT8oXFwvLiopJC9cbiAgICAgICAgKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgaG9zdCA9IG1hdGNoWzRdIHx8IG1hdGNoWzJdO1xuICAgICAgICAgIHBvcnQgPSBwYXJzZUludChtYXRjaFs3XSk7XG4gICAgICAgICAgcGF0aCA9IG1hdGNoWzhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoRVJST1IuSU5WQUxJRF9BUkdVTUVOVCwgW2hvc3QsIFwiaG9zdFwiXSkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAzKSB7XG4gICAgICAgICAgY2xpZW50SWQgPSBwYXRoO1xuICAgICAgICAgIHBhdGggPSBcIi9tcXR0XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBwb3J0ICE9PSBcIm51bWJlclwiIHx8IHBvcnQgPCAwKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoRVJST1IuSU5WQUxJRF9UWVBFLCBbdHlwZW9mIHBvcnQsIFwicG9ydFwiXSkpO1xuICAgICAgICBpZiAodHlwZW9mIHBhdGggIT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZvcm1hdChFUlJPUi5JTlZBTElEX1RZUEUsIFt0eXBlb2YgcGF0aCwgXCJwYXRoXCJdKSk7XG5cbiAgICAgICAgdmFyIGlwdjZBZGRTQnJhY2tldCA9XG4gICAgICAgICAgaG9zdC5pbmRleE9mKFwiOlwiKSAhPT0gLTEgJiZcbiAgICAgICAgICBob3N0LnNsaWNlKDAsIDEpICE9PSBcIltcIiAmJlxuICAgICAgICAgIGhvc3Quc2xpY2UoLTEpICE9PSBcIl1cIjtcbiAgICAgICAgdXJpID1cbiAgICAgICAgICBcIndzOi8vXCIgK1xuICAgICAgICAgIChpcHY2QWRkU0JyYWNrZXQgPyBcIltcIiArIGhvc3QgKyBcIl1cIiA6IGhvc3QpICtcbiAgICAgICAgICBcIjpcIiArXG4gICAgICAgICAgcG9ydCArXG4gICAgICAgICAgcGF0aDtcbiAgICAgIH1cblxuICAgICAgdmFyIGNsaWVudElkTGVuZ3RoID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xpZW50SWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoYXJDb2RlID0gY2xpZW50SWQuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKDB4ZDgwMCA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8PSAweGRiZmYpIHtcbiAgICAgICAgICBpKys7IC8vIFN1cnJvZ2F0ZSBwYWlyLlxuICAgICAgICB9XG4gICAgICAgIGNsaWVudElkTGVuZ3RoKys7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGNsaWVudElkICE9PSBcInN0cmluZ1wiIHx8IGNsaWVudElkTGVuZ3RoID4gNjU1MzUpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoRVJST1IuSU5WQUxJRF9BUkdVTUVOVCwgW2NsaWVudElkLCBcImNsaWVudElkXCJdKSk7XG5cbiAgICAgIHZhciBjbGllbnQgPSBuZXcgQ2xpZW50SW1wbCh1cmksIGhvc3QsIHBvcnQsIHBhdGgsIGNsaWVudElkKTtcblxuICAgICAgLy9QdWJsaWMgUHJvcGVydGllc1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgICBob3N0OiB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBob3N0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoRVJST1IuVU5TVVBQT1JURURfT1BFUkFUSU9OKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwb3J0OiB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBwb3J0O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoRVJST1IuVU5TVVBQT1JURURfT1BFUkFUSU9OKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwYXRoOiB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoRVJST1IuVU5TVVBQT1JURURfT1BFUkFUSU9OKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB1cmk6IHtcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHVyaTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZm9ybWF0KEVSUk9SLlVOU1VQUE9SVEVEX09QRVJBVElPTikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2xpZW50SWQ6IHtcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNsaWVudC5jbGllbnRJZDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZm9ybWF0KEVSUk9SLlVOU1VQUE9SVEVEX09QRVJBVElPTikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25Db25uZWN0ZWQ6IHtcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNsaWVudC5vbkNvbm5lY3RlZDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldDogZnVuY3Rpb24obmV3T25Db25uZWN0ZWQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmV3T25Db25uZWN0ZWQgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgY2xpZW50Lm9uQ29ubmVjdGVkID0gbmV3T25Db25uZWN0ZWQ7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBmb3JtYXQoRVJST1IuSU5WQUxJRF9UWVBFLCBbXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgbmV3T25Db25uZWN0ZWQsXG4gICAgICAgICAgICAgICAgICBcIm9uQ29ubmVjdGVkXCJcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGlzY29ubmVjdGVkUHVibGlzaGluZzoge1xuICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2xpZW50LmRpc2Nvbm5lY3RlZFB1Ymxpc2hpbmc7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKG5ld0Rpc2Nvbm5lY3RlZFB1Ymxpc2hpbmcpIHtcbiAgICAgICAgICAgIGNsaWVudC5kaXNjb25uZWN0ZWRQdWJsaXNoaW5nID0gbmV3RGlzY29ubmVjdGVkUHVibGlzaGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGRpc2Nvbm5lY3RlZEJ1ZmZlclNpemU6IHtcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNsaWVudC5kaXNjb25uZWN0ZWRCdWZmZXJTaXplO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0OiBmdW5jdGlvbihuZXdEaXNjb25uZWN0ZWRCdWZmZXJTaXplKSB7XG4gICAgICAgICAgICBjbGllbnQuZGlzY29ubmVjdGVkQnVmZmVyU2l6ZSA9IG5ld0Rpc2Nvbm5lY3RlZEJ1ZmZlclNpemU7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvbkNvbm5lY3Rpb25Mb3N0OiB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjbGllbnQub25Db25uZWN0aW9uTG9zdDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldDogZnVuY3Rpb24obmV3T25Db25uZWN0aW9uTG9zdCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuZXdPbkNvbm5lY3Rpb25Mb3N0ID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgIGNsaWVudC5vbkNvbm5lY3Rpb25Mb3N0ID0gbmV3T25Db25uZWN0aW9uTG9zdDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGZvcm1hdChFUlJPUi5JTlZBTElEX1RZUEUsIFtcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiBuZXdPbkNvbm5lY3Rpb25Mb3N0LFxuICAgICAgICAgICAgICAgICAgXCJvbkNvbm5lY3Rpb25Mb3N0XCJcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25NZXNzYWdlRGVsaXZlcmVkOiB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjbGllbnQub25NZXNzYWdlRGVsaXZlcmVkO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0OiBmdW5jdGlvbihuZXdPbk1lc3NhZ2VEZWxpdmVyZWQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmV3T25NZXNzYWdlRGVsaXZlcmVkID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgIGNsaWVudC5vbk1lc3NhZ2VEZWxpdmVyZWQgPSBuZXdPbk1lc3NhZ2VEZWxpdmVyZWQ7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBmb3JtYXQoRVJST1IuSU5WQUxJRF9UWVBFLCBbXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgbmV3T25NZXNzYWdlRGVsaXZlcmVkLFxuICAgICAgICAgICAgICAgICAgXCJvbk1lc3NhZ2VEZWxpdmVyZWRcIlxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvbk1lc3NhZ2VBcnJpdmVkOiB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBjbGllbnQub25NZXNzYWdlQXJyaXZlZDtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldDogZnVuY3Rpb24obmV3T25NZXNzYWdlQXJyaXZlZCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuZXdPbk1lc3NhZ2VBcnJpdmVkID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgIGNsaWVudC5vbk1lc3NhZ2VBcnJpdmVkID0gbmV3T25NZXNzYWdlQXJyaXZlZDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGZvcm1hdChFUlJPUi5JTlZBTElEX1RZUEUsIFtcbiAgICAgICAgICAgICAgICAgIHR5cGVvZiBuZXdPbk1lc3NhZ2VBcnJpdmVkLFxuICAgICAgICAgICAgICAgICAgXCJvbk1lc3NhZ2VBcnJpdmVkXCJcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJhY2U6IHtcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNsaWVudC50cmFjZUZ1bmN0aW9uO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0OiBmdW5jdGlvbih0cmFjZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0cmFjZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIGNsaWVudC50cmFjZUZ1bmN0aW9uID0gdHJhY2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgZm9ybWF0KEVSUk9SLklOVkFMSURfVFlQRSwgW3R5cGVvZiB0cmFjZSwgXCJvblRyYWNlXCJdKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8qKlxuICAgICAgICogQ29ubmVjdCB0aGlzIE1lc3NhZ2luZyBjbGllbnQgdG8gaXRzIHNlcnZlci5cbiAgICAgICAqXG4gICAgICAgKiBAbmFtZSBQYWhvLkNsaWVudCNjb25uZWN0XG4gICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb25uZWN0T3B0aW9ucyAtIEF0dHJpYnV0ZXMgdXNlZCB3aXRoIHRoZSBjb25uZWN0aW9uLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbm5lY3RPcHRpb25zLnRpbWVvdXQgLSBJZiB0aGUgY29ubmVjdCBoYXMgbm90IHN1Y2NlZWRlZCB3aXRoaW4gdGhpc1xuICAgICAgICogICAgICAgICAgICAgICAgICAgIG51bWJlciBvZiBzZWNvbmRzLCBpdCBpcyBkZWVtZWQgdG8gaGF2ZSBmYWlsZWQuXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgVGhlIGRlZmF1bHQgaXMgMzAgc2Vjb25kcy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb25uZWN0T3B0aW9ucy51c2VyTmFtZSAtIEF1dGhlbnRpY2F0aW9uIHVzZXJuYW1lIGZvciB0aGlzIGNvbm5lY3Rpb24uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29ubmVjdE9wdGlvbnMucGFzc3dvcmQgLSBBdXRoZW50aWNhdGlvbiBwYXNzd29yZCBmb3IgdGhpcyBjb25uZWN0aW9uLlxuICAgICAgICogQHBhcmFtIHtQYWhvLk1lc3NhZ2V9IGNvbm5lY3RPcHRpb25zLndpbGxNZXNzYWdlIC0gc2VudCBieSB0aGUgc2VydmVyIHdoZW4gdGhlIGNsaWVudFxuICAgICAgICogICAgICAgICAgICAgICAgICAgIGRpc2Nvbm5lY3RzIGFibm9ybWFsbHkuXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gY29ubmVjdE9wdGlvbnMua2VlcEFsaXZlSW50ZXJ2YWwgLSB0aGUgc2VydmVyIGRpc2Nvbm5lY3RzIHRoaXMgY2xpZW50IGlmXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgdGhlcmUgaXMgbm8gYWN0aXZpdHkgZm9yIHRoaXMgbnVtYmVyIG9mIHNlY29uZHMuXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgVGhlIGRlZmF1bHQgdmFsdWUgb2YgNjAgc2Vjb25kcyBpcyBhc3N1bWVkIGlmIG5vdCBzZXQuXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbm5lY3RPcHRpb25zLmNsZWFuU2Vzc2lvbiAtIGlmIHRydWUoZGVmYXVsdCkgdGhlIGNsaWVudCBhbmQgc2VydmVyXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgcGVyc2lzdGVudCBzdGF0ZSBpcyBkZWxldGVkIG9uIHN1Y2Nlc3NmdWwgY29ubmVjdC5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29ubmVjdE9wdGlvbnMudXNlU1NMIC0gaWYgcHJlc2VudCBhbmQgdHJ1ZSwgdXNlIGFuIFNTTCBXZWJzb2NrZXQgY29ubmVjdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb25uZWN0T3B0aW9ucy5pbnZvY2F0aW9uQ29udGV4dCAtIHBhc3NlZCB0byB0aGUgb25TdWNjZXNzIGNhbGxiYWNrIG9yIG9uRmFpbHVyZSBjYWxsYmFjay5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbm5lY3RPcHRpb25zLm9uU3VjY2VzcyAtIGNhbGxlZCB3aGVuIHRoZSBjb25uZWN0IGFja25vd2xlZGdlbWVudFxuICAgICAgICogICAgICAgICAgICAgICAgICAgIGhhcyBiZWVuIHJlY2VpdmVkIGZyb20gdGhlIHNlcnZlci5cbiAgICAgICAqIEEgc2luZ2xlIHJlc3BvbnNlIG9iamVjdCBwYXJhbWV0ZXIgaXMgcGFzc2VkIHRvIHRoZSBvblN1Y2Nlc3MgY2FsbGJhY2sgY29udGFpbmluZyB0aGUgZm9sbG93aW5nIGZpZWxkczpcbiAgICAgICAqIDxvbD5cbiAgICAgICAqIDxsaT5pbnZvY2F0aW9uQ29udGV4dCBhcyBwYXNzZWQgaW4gdG8gdGhlIG9uU3VjY2VzcyBtZXRob2QgaW4gdGhlIGNvbm5lY3RPcHRpb25zLlxuICAgICAgICogPC9vbD5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbm5lY3RPcHRpb25zLm9uRmFpbHVyZSAtIGNhbGxlZCB3aGVuIHRoZSBjb25uZWN0IHJlcXVlc3QgaGFzIGZhaWxlZCBvciB0aW1lZCBvdXQuXG4gICAgICAgKiBBIHNpbmdsZSByZXNwb25zZSBvYmplY3QgcGFyYW1ldGVyIGlzIHBhc3NlZCB0byB0aGUgb25GYWlsdXJlIGNhbGxiYWNrIGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZyBmaWVsZHM6XG4gICAgICAgKiA8b2w+XG4gICAgICAgKiA8bGk+aW52b2NhdGlvbkNvbnRleHQgYXMgcGFzc2VkIGluIHRvIHRoZSBvbkZhaWx1cmUgbWV0aG9kIGluIHRoZSBjb25uZWN0T3B0aW9ucy5cbiAgICAgICAqIDxsaT5lcnJvckNvZGUgYSBudW1iZXIgaW5kaWNhdGluZyB0aGUgbmF0dXJlIG9mIHRoZSBlcnJvci5cbiAgICAgICAqIDxsaT5lcnJvck1lc3NhZ2UgdGV4dCBkZXNjcmliaW5nIHRoZSBlcnJvci5cbiAgICAgICAqIDwvb2w+XG4gICAgICAgKiBAcGFyYW0ge2FycmF5fSBjb25uZWN0T3B0aW9ucy5ob3N0cyAtIElmIHByZXNlbnQgdGhpcyBjb250YWlucyBlaXRoZXIgYSBzZXQgb2YgaG9zdG5hbWVzIG9yIGZ1bGx5IHF1YWxpZmllZFxuICAgICAgICogV2ViU29ja2V0IFVSSXMgKHdzOi8vaW90LmVjbGlwc2Uub3JnOjgwL3dzKSwgdGhhdCBhcmUgdHJpZWQgaW4gb3JkZXIgaW4gcGxhY2VcbiAgICAgICAqIG9mIHRoZSBob3N0IGFuZCBwb3J0IHBhcmFtYXRlciBvbiB0aGUgY29uc3RydXRvci4gVGhlIGhvc3RzIGFyZSB0cmllZCBvbmUgYXQgYXQgdGltZSBpbiBvcmRlciB1bnRpbFxuICAgICAgICogb25lIG9mIHRoZW4gc3VjY2VlZHMuXG4gICAgICAgKiBAcGFyYW0ge2FycmF5fSBjb25uZWN0T3B0aW9ucy5wb3J0cyAtIElmIHByZXNlbnQgdGhlIHNldCBvZiBwb3J0cyBtYXRjaGluZyB0aGUgaG9zdHMuIElmIGhvc3RzIGNvbnRhaW5zIFVSSXMsIHRoaXMgcHJvcGVydHlcbiAgICAgICAqIGlzIG5vdCB1c2VkLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBjb25uZWN0T3B0aW9ucy5yZWNvbm5lY3QgLSBTZXRzIHdoZXRoZXIgdGhlIGNsaWVudCB3aWxsIGF1dG9tYXRpY2FsbHkgYXR0ZW1wdCB0byByZWNvbm5lY3RcbiAgICAgICAqIHRvIHRoZSBzZXJ2ZXIgaWYgdGhlIGNvbm5lY3Rpb24gaXMgbG9zdC5cbiAgICAgICAqPHVsPlxuICAgICAgICo8bGk+SWYgc2V0IHRvIGZhbHNlLCB0aGUgY2xpZW50IHdpbGwgbm90IGF0dGVtcHQgdG8gYXV0b21hdGljYWxseSByZWNvbm5lY3QgdG8gdGhlIHNlcnZlciBpbiB0aGUgZXZlbnQgdGhhdCB0aGVcbiAgICAgICAqIGNvbm5lY3Rpb24gaXMgbG9zdC48L2xpPlxuICAgICAgICo8bGk+SWYgc2V0IHRvIHRydWUsIGluIHRoZSBldmVudCB0aGF0IHRoZSBjb25uZWN0aW9uIGlzIGxvc3QsIHRoZSBjbGllbnQgd2lsbCBhdHRlbXB0IHRvIHJlY29ubmVjdCB0byB0aGUgc2VydmVyLlxuICAgICAgICogSXQgd2lsbCBpbml0aWFsbHkgd2FpdCAxIHNlY29uZCBiZWZvcmUgaXQgYXR0ZW1wdHMgdG8gcmVjb25uZWN0LCBmb3IgZXZlcnkgZmFpbGVkIHJlY29ubmVjdCBhdHRlbXB0LCB0aGUgZGVsYXlcbiAgICAgICAqIHdpbGwgZG91YmxlIHVudGlsIGl0IGlzIGF0IDIgbWludXRlcyBhdCB3aGljaCBwb2ludCB0aGUgZGVsYXkgd2lsbCBzdGF5IGF0IDIgbWludXRlcy48L2xpPlxuICAgICAgICo8L3VsPlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbm5lY3RPcHRpb25zLm1xdHRWZXJzaW9uIC0gVGhlIHZlcnNpb24gb2YgTVFUVCB0byB1c2UgdG8gY29ubmVjdCB0byB0aGUgTVFUVCBCcm9rZXIuXG4gICAgICAgKjx1bD5cbiAgICAgICAqPGxpPjMgLSBNUVRUIFYzLjE8L2xpPlxuICAgICAgICo8bGk+NCAtIE1RVFQgVjMuMS4xPC9saT5cbiAgICAgICAqPC91bD5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29ubmVjdE9wdGlvbnMubXF0dFZlcnNpb25FeHBsaWNpdCAtIElmIHNldCB0byB0cnVlLCB3aWxsIGZvcmNlIHRoZSBjb25uZWN0aW9uIHRvIHVzZSB0aGVcbiAgICAgICAqIHNlbGVjdGVkIE1RVFQgVmVyc2lvbiBvciB3aWxsIGZhaWwgdG8gY29ubmVjdC5cbiAgICAgICAqIEBwYXJhbSB7YXJyYXl9IGNvbm5lY3RPcHRpb25zLnVyaXMgLSBJZiBwcmVzZW50LCBzaG91bGQgY29udGFpbiBhIGxpc3Qgb2YgZnVsbHkgcXVhbGlmaWVkIFdlYlNvY2tldCB1cmlzXG4gICAgICAgKiAoZS5nLiB3czovL2lvdC5lY2xpcHNlLm9yZzo4MC93cyksIHRoYXQgYXJlIHRyaWVkIGluIG9yZGVyIGluIHBsYWNlIG9mIHRoZSBob3N0IGFuZCBwb3J0IHBhcmFtZXRlciBvZiB0aGUgY29uc3RydXRvci5cbiAgICAgICAqIFRoZSB1cmlzIGFyZSB0cmllZCBvbmUgYXQgYSB0aW1lIGluIG9yZGVyIHVudGlsIG9uZSBvZiB0aGVtIHN1Y2NlZWRzLiBEbyBub3QgdXNlIHRoaXMgaW4gY29uanVuY3Rpb24gd2l0aCBob3N0cyBhc1xuICAgICAgICogdGhlIGhvc3RzIGFycmF5IHdpbGwgYmUgY29udmVydGVkIHRvIHVyaXMgYW5kIHdpbGwgb3ZlcndyaXRlIHRoaXMgcHJvcGVydHkuXG4gICAgICAgKiBAdGhyb3dzIHtJbnZhbGlkU3RhdGV9IElmIHRoZSBjbGllbnQgaXMgbm90IGluIGRpc2Nvbm5lY3RlZCBzdGF0ZS4gVGhlIGNsaWVudCBtdXN0IGhhdmUgcmVjZWl2ZWQgY29ubmVjdGlvbkxvc3RcbiAgICAgICAqIG9yIGRpc2Nvbm5lY3RlZCBiZWZvcmUgY2FsbGluZyBjb25uZWN0IGZvciBhIHNlY29uZCBvciBzdWJzZXF1ZW50IHRpbWUuXG4gICAgICAgKi9cbiAgICAgIHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uKGNvbm5lY3RPcHRpb25zKSB7XG4gICAgICAgIGNvbm5lY3RPcHRpb25zID0gY29ubmVjdE9wdGlvbnMgfHwge307XG4gICAgICAgIHZhbGlkYXRlKGNvbm5lY3RPcHRpb25zLCB7XG4gICAgICAgICAgdGltZW91dDogXCJudW1iZXJcIixcbiAgICAgICAgICB1c2VyTmFtZTogXCJzdHJpbmdcIixcbiAgICAgICAgICBwYXNzd29yZDogXCJzdHJpbmdcIixcbiAgICAgICAgICB3aWxsTWVzc2FnZTogXCJvYmplY3RcIixcbiAgICAgICAgICBrZWVwQWxpdmVJbnRlcnZhbDogXCJudW1iZXJcIixcbiAgICAgICAgICBjbGVhblNlc3Npb246IFwiYm9vbGVhblwiLFxuICAgICAgICAgIHVzZVNTTDogXCJib29sZWFuXCIsXG4gICAgICAgICAgaW52b2NhdGlvbkNvbnRleHQ6IFwib2JqZWN0XCIsXG4gICAgICAgICAgb25TdWNjZXNzOiBcImZ1bmN0aW9uXCIsXG4gICAgICAgICAgb25GYWlsdXJlOiBcImZ1bmN0aW9uXCIsXG4gICAgICAgICAgaG9zdHM6IFwib2JqZWN0XCIsXG4gICAgICAgICAgcG9ydHM6IFwib2JqZWN0XCIsXG4gICAgICAgICAgcmVjb25uZWN0OiBcImJvb2xlYW5cIixcbiAgICAgICAgICBtcXR0VmVyc2lvbjogXCJudW1iZXJcIixcbiAgICAgICAgICBtcXR0VmVyc2lvbkV4cGxpY2l0OiBcImJvb2xlYW5cIixcbiAgICAgICAgICB1cmlzOiBcIm9iamVjdFwiXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIElmIG5vIGtlZXAgYWxpdmUgaW50ZXJ2YWwgaXMgc2V0LCBhc3N1bWUgNjAgc2Vjb25kcy5cbiAgICAgICAgaWYgKGNvbm5lY3RPcHRpb25zLmtlZXBBbGl2ZUludGVydmFsID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgY29ubmVjdE9wdGlvbnMua2VlcEFsaXZlSW50ZXJ2YWwgPSA2MDtcblxuICAgICAgICBpZiAoY29ubmVjdE9wdGlvbnMubXF0dFZlcnNpb24gPiA0IHx8IGNvbm5lY3RPcHRpb25zLm1xdHRWZXJzaW9uIDwgMykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGZvcm1hdChFUlJPUi5JTlZBTElEX0FSR1VNRU5ULCBbXG4gICAgICAgICAgICAgIGNvbm5lY3RPcHRpb25zLm1xdHRWZXJzaW9uLFxuICAgICAgICAgICAgICBcImNvbm5lY3RPcHRpb25zLm1xdHRWZXJzaW9uXCJcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25uZWN0T3B0aW9ucy5tcXR0VmVyc2lvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29ubmVjdE9wdGlvbnMubXF0dFZlcnNpb25FeHBsaWNpdCA9IGZhbHNlO1xuICAgICAgICAgIGNvbm5lY3RPcHRpb25zLm1xdHRWZXJzaW9uID0gNDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25uZWN0T3B0aW9ucy5tcXR0VmVyc2lvbkV4cGxpY2l0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ2hlY2sgdGhhdCBpZiBwYXNzd29yZCBpcyBzZXQsIHNvIGlzIHVzZXJuYW1lXG4gICAgICAgIGlmIChcbiAgICAgICAgICBjb25uZWN0T3B0aW9ucy5wYXNzd29yZCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgY29ubmVjdE9wdGlvbnMudXNlck5hbWUgPT09IHVuZGVmaW5lZFxuICAgICAgICApXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgZm9ybWF0KEVSUk9SLklOVkFMSURfQVJHVU1FTlQsIFtcbiAgICAgICAgICAgICAgY29ubmVjdE9wdGlvbnMucGFzc3dvcmQsXG4gICAgICAgICAgICAgIFwiY29ubmVjdE9wdGlvbnMucGFzc3dvcmRcIlxuICAgICAgICAgICAgXSlcbiAgICAgICAgICApO1xuXG4gICAgICAgIGlmIChjb25uZWN0T3B0aW9ucy53aWxsTWVzc2FnZSkge1xuICAgICAgICAgIGlmICghKGNvbm5lY3RPcHRpb25zLndpbGxNZXNzYWdlIGluc3RhbmNlb2YgTWVzc2FnZSkpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGZvcm1hdChFUlJPUi5JTlZBTElEX1RZUEUsIFtcbiAgICAgICAgICAgICAgICBjb25uZWN0T3B0aW9ucy53aWxsTWVzc2FnZSxcbiAgICAgICAgICAgICAgICBcImNvbm5lY3RPcHRpb25zLndpbGxNZXNzYWdlXCJcbiAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgLy8gVGhlIHdpbGwgbWVzc2FnZSBtdXN0IGhhdmUgYSBwYXlsb2FkIHRoYXQgY2FuIGJlIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nLlxuICAgICAgICAgIC8vIENhdXNlIHRoZSB3aWxsTWVzc2FnZSB0byB0aHJvdyBhbiBleGNlcHRpb24gaWYgdGhpcyBpcyBub3QgdGhlIGNhc2UuXG4gICAgICAgICAgY29ubmVjdE9wdGlvbnMud2lsbE1lc3NhZ2Uuc3RyaW5nUGF5bG9hZCA9IG51bGw7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGNvbm5lY3RPcHRpb25zLndpbGxNZXNzYWdlLmRlc3RpbmF0aW9uTmFtZSA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgZm9ybWF0KEVSUk9SLklOVkFMSURfVFlQRSwgW1xuICAgICAgICAgICAgICAgIHR5cGVvZiBjb25uZWN0T3B0aW9ucy53aWxsTWVzc2FnZS5kZXN0aW5hdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgXCJjb25uZWN0T3B0aW9ucy53aWxsTWVzc2FnZS5kZXN0aW5hdGlvbk5hbWVcIlxuICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNvbm5lY3RPcHRpb25zLmNsZWFuU2Vzc2lvbiA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICBjb25uZWN0T3B0aW9ucy5jbGVhblNlc3Npb24gPSB0cnVlO1xuICAgICAgICBpZiAoY29ubmVjdE9wdGlvbnMuaG9zdHMpIHtcbiAgICAgICAgICBpZiAoIShjb25uZWN0T3B0aW9ucy5ob3N0cyBpbnN0YW5jZW9mIEFycmF5KSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgZm9ybWF0KEVSUk9SLklOVkFMSURfQVJHVU1FTlQsIFtcbiAgICAgICAgICAgICAgICBjb25uZWN0T3B0aW9ucy5ob3N0cyxcbiAgICAgICAgICAgICAgICBcImNvbm5lY3RPcHRpb25zLmhvc3RzXCJcbiAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKGNvbm5lY3RPcHRpb25zLmhvc3RzLmxlbmd0aCA8IDEpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGZvcm1hdChFUlJPUi5JTlZBTElEX0FSR1VNRU5ULCBbXG4gICAgICAgICAgICAgICAgY29ubmVjdE9wdGlvbnMuaG9zdHMsXG4gICAgICAgICAgICAgICAgXCJjb25uZWN0T3B0aW9ucy5ob3N0c1wiXG4gICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgdmFyIHVzaW5nVVJJcyA9IGZhbHNlO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29ubmVjdE9wdGlvbnMuaG9zdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29ubmVjdE9wdGlvbnMuaG9zdHNbaV0gIT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBmb3JtYXQoRVJST1IuSU5WQUxJRF9UWVBFLCBbXG4gICAgICAgICAgICAgICAgICB0eXBlb2YgY29ubmVjdE9wdGlvbnMuaG9zdHNbaV0sXG4gICAgICAgICAgICAgICAgICBcImNvbm5lY3RPcHRpb25zLmhvc3RzW1wiICsgaSArIFwiXVwiXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgL14od3NzPyk6XFwvXFwvKChcXFsoLispXFxdKXwoW15cXC9dKz8pKSg6KFxcZCspKT8oXFwvLiopJC8udGVzdChcbiAgICAgICAgICAgICAgICBjb25uZWN0T3B0aW9ucy5ob3N0c1tpXVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICB1c2luZ1VSSXMgPSB0cnVlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF1c2luZ1VSSXMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICBmb3JtYXQoRVJST1IuSU5WQUxJRF9BUkdVTUVOVCwgW1xuICAgICAgICAgICAgICAgICAgICBjb25uZWN0T3B0aW9ucy5ob3N0c1tpXSxcbiAgICAgICAgICAgICAgICAgICAgXCJjb25uZWN0T3B0aW9ucy5ob3N0c1tcIiArIGkgKyBcIl1cIlxuICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHVzaW5nVVJJcykge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgZm9ybWF0KEVSUk9SLklOVkFMSURfQVJHVU1FTlQsIFtcbiAgICAgICAgICAgICAgICAgIGNvbm5lY3RPcHRpb25zLmhvc3RzW2ldLFxuICAgICAgICAgICAgICAgICAgXCJjb25uZWN0T3B0aW9ucy5ob3N0c1tcIiArIGkgKyBcIl1cIlxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCF1c2luZ1VSSXMpIHtcbiAgICAgICAgICAgIGlmICghY29ubmVjdE9wdGlvbnMucG9ydHMpXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBmb3JtYXQoRVJST1IuSU5WQUxJRF9BUkdVTUVOVCwgW1xuICAgICAgICAgICAgICAgICAgY29ubmVjdE9wdGlvbnMucG9ydHMsXG4gICAgICAgICAgICAgICAgICBcImNvbm5lY3RPcHRpb25zLnBvcnRzXCJcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCEoY29ubmVjdE9wdGlvbnMucG9ydHMgaW5zdGFuY2VvZiBBcnJheSkpXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBmb3JtYXQoRVJST1IuSU5WQUxJRF9BUkdVTUVOVCwgW1xuICAgICAgICAgICAgICAgICAgY29ubmVjdE9wdGlvbnMucG9ydHMsXG4gICAgICAgICAgICAgICAgICBcImNvbm5lY3RPcHRpb25zLnBvcnRzXCJcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGNvbm5lY3RPcHRpb25zLmhvc3RzLmxlbmd0aCAhPT0gY29ubmVjdE9wdGlvbnMucG9ydHMubGVuZ3RoKVxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgZm9ybWF0KEVSUk9SLklOVkFMSURfQVJHVU1FTlQsIFtcbiAgICAgICAgICAgICAgICAgIGNvbm5lY3RPcHRpb25zLnBvcnRzLFxuICAgICAgICAgICAgICAgICAgXCJjb25uZWN0T3B0aW9ucy5wb3J0c1wiXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29ubmVjdE9wdGlvbnMudXJpcyA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbm5lY3RPcHRpb25zLmhvc3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0eXBlb2YgY29ubmVjdE9wdGlvbnMucG9ydHNbaV0gIT09IFwibnVtYmVyXCIgfHxcbiAgICAgICAgICAgICAgICBjb25uZWN0T3B0aW9ucy5wb3J0c1tpXSA8IDBcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgIGZvcm1hdChFUlJPUi5JTlZBTElEX1RZUEUsIFtcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGNvbm5lY3RPcHRpb25zLnBvcnRzW2ldLFxuICAgICAgICAgICAgICAgICAgICBcImNvbm5lY3RPcHRpb25zLnBvcnRzW1wiICsgaSArIFwiXVwiXG4gICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHZhciBob3N0ID0gY29ubmVjdE9wdGlvbnMuaG9zdHNbaV07XG4gICAgICAgICAgICAgIHZhciBwb3J0ID0gY29ubmVjdE9wdGlvbnMucG9ydHNbaV07XG5cbiAgICAgICAgICAgICAgdmFyIGlwdjYgPSBob3N0LmluZGV4T2YoXCI6XCIpICE9PSAtMTtcbiAgICAgICAgICAgICAgdXJpID1cbiAgICAgICAgICAgICAgICBcIndzOi8vXCIgKyAoaXB2NiA/IFwiW1wiICsgaG9zdCArIFwiXVwiIDogaG9zdCkgKyBcIjpcIiArIHBvcnQgKyBwYXRoO1xuICAgICAgICAgICAgICBjb25uZWN0T3B0aW9ucy51cmlzLnB1c2godXJpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29ubmVjdE9wdGlvbnMudXJpcyA9IGNvbm5lY3RPcHRpb25zLmhvc3RzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNsaWVudC5jb25uZWN0KGNvbm5lY3RPcHRpb25zKTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogU3Vic2NyaWJlIGZvciBtZXNzYWdlcywgcmVxdWVzdCByZWNlaXB0IG9mIGEgY29weSBvZiBtZXNzYWdlcyBzZW50IHRvIHRoZSBkZXN0aW5hdGlvbnMgZGVzY3JpYmVkIGJ5IHRoZSBmaWx0ZXIuXG4gICAgICAgKlxuICAgICAgICogQG5hbWUgUGFoby5DbGllbnQjc3Vic2NyaWJlXG4gICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWx0ZXIgZGVzY3JpYmluZyB0aGUgZGVzdGluYXRpb25zIHRvIHJlY2VpdmUgbWVzc2FnZXMgZnJvbS5cbiAgICAgICAqIDxicj5cbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdWJzY3JpYmVPcHRpb25zIC0gdXNlZCB0byBjb250cm9sIHRoZSBzdWJzY3JpcHRpb25cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gc3Vic2NyaWJlT3B0aW9ucy5xb3MgLSB0aGUgbWF4aW11bSBxb3Mgb2YgYW55IHB1YmxpY2F0aW9ucyBzZW50XG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcyBhIHJlc3VsdCBvZiBtYWtpbmcgdGhpcyBzdWJzY3JpcHRpb24uXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gc3Vic2NyaWJlT3B0aW9ucy5pbnZvY2F0aW9uQ29udGV4dCAtIHBhc3NlZCB0byB0aGUgb25TdWNjZXNzIGNhbGxiYWNrXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvciBvbkZhaWx1cmUgY2FsbGJhY2suXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdWJzY3JpYmVPcHRpb25zLm9uU3VjY2VzcyAtIGNhbGxlZCB3aGVuIHRoZSBzdWJzY3JpYmUgYWNrbm93bGVkZ2VtZW50XG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXMgYmVlbiByZWNlaXZlZCBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBIHNpbmdsZSByZXNwb25zZSBvYmplY3QgcGFyYW1ldGVyIGlzIHBhc3NlZCB0byB0aGUgb25TdWNjZXNzIGNhbGxiYWNrIGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZyBmaWVsZHM6XG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b2w+XG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+aW52b2NhdGlvbkNvbnRleHQgaWYgc2V0IGluIHRoZSBzdWJzY3JpYmVPcHRpb25zLlxuICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vbD5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1YnNjcmliZU9wdGlvbnMub25GYWlsdXJlIC0gY2FsbGVkIHdoZW4gdGhlIHN1YnNjcmliZSByZXF1ZXN0IGhhcyBmYWlsZWQgb3IgdGltZWQgb3V0LlxuICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQSBzaW5nbGUgcmVzcG9uc2Ugb2JqZWN0IHBhcmFtZXRlciBpcyBwYXNzZWQgdG8gdGhlIG9uRmFpbHVyZSBjYWxsYmFjayBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgZmllbGRzOlxuICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9sPlxuICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPmludm9jYXRpb25Db250ZXh0IC0gaWYgc2V0IGluIHRoZSBzdWJzY3JpYmVPcHRpb25zLlxuICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPmVycm9yQ29kZSAtIGEgbnVtYmVyIGluZGljYXRpbmcgdGhlIG5hdHVyZSBvZiB0aGUgZXJyb3IuXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+ZXJyb3JNZXNzYWdlIC0gdGV4dCBkZXNjcmliaW5nIHRoZSBlcnJvci5cbiAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb2w+XG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gc3Vic2NyaWJlT3B0aW9ucy50aW1lb3V0IC0gd2hpY2gsIGlmIHByZXNlbnQsIGRldGVybWluZXMgdGhlIG51bWJlciBvZlxuICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kcyBhZnRlciB3aGljaCB0aGUgb25GYWlsdXJlIGNhbGJhY2sgaXMgY2FsbGVkLlxuICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIHByZXNlbmNlIG9mIGEgdGltZW91dCBkb2VzIG5vdCBwcmV2ZW50IHRoZSBvblN1Y2Nlc3NcbiAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrIGZyb20gYmVpbmcgY2FsbGVkIHdoZW4gdGhlIHN1YnNjcmliZSBjb21wbGV0ZXMuXG4gICAgICAgKiBAdGhyb3dzIHtJbnZhbGlkU3RhdGV9IGlmIHRoZSBjbGllbnQgaXMgbm90IGluIGNvbm5lY3RlZCBzdGF0ZS5cbiAgICAgICAqL1xuICAgICAgdGhpcy5zdWJzY3JpYmUgPSBmdW5jdGlvbihmaWx0ZXIsIHN1YnNjcmliZU9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmaWx0ZXIgIT09IFwic3RyaW5nXCIgJiYgZmlsdGVyLmNvbnN0cnVjdG9yICE9PSBBcnJheSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGFyZ3VtZW50OlwiICsgZmlsdGVyKTtcbiAgICAgICAgc3Vic2NyaWJlT3B0aW9ucyA9IHN1YnNjcmliZU9wdGlvbnMgfHwge307XG4gICAgICAgIHZhbGlkYXRlKHN1YnNjcmliZU9wdGlvbnMsIHtcbiAgICAgICAgICBxb3M6IFwibnVtYmVyXCIsXG4gICAgICAgICAgaW52b2NhdGlvbkNvbnRleHQ6IFwib2JqZWN0XCIsXG4gICAgICAgICAgb25TdWNjZXNzOiBcImZ1bmN0aW9uXCIsXG4gICAgICAgICAgb25GYWlsdXJlOiBcImZ1bmN0aW9uXCIsXG4gICAgICAgICAgdGltZW91dDogXCJudW1iZXJcIlxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHN1YnNjcmliZU9wdGlvbnMudGltZW91dCAmJiAhc3Vic2NyaWJlT3B0aW9ucy5vbkZhaWx1cmUpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgXCJzdWJzY3JpYmVPcHRpb25zLnRpbWVvdXQgc3BlY2lmaWVkIHdpdGggbm8gb25GYWlsdXJlIGNhbGxiYWNrLlwiXG4gICAgICAgICAgKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHR5cGVvZiBzdWJzY3JpYmVPcHRpb25zLnFvcyAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICAgICEoXG4gICAgICAgICAgICBzdWJzY3JpYmVPcHRpb25zLnFvcyA9PT0gMCB8fFxuICAgICAgICAgICAgc3Vic2NyaWJlT3B0aW9ucy5xb3MgPT09IDEgfHxcbiAgICAgICAgICAgIHN1YnNjcmliZU9wdGlvbnMucW9zID09PSAyXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgZm9ybWF0KEVSUk9SLklOVkFMSURfQVJHVU1FTlQsIFtcbiAgICAgICAgICAgICAgc3Vic2NyaWJlT3B0aW9ucy5xb3MsXG4gICAgICAgICAgICAgIFwic3Vic2NyaWJlT3B0aW9ucy5xb3NcIlxuICAgICAgICAgICAgXSlcbiAgICAgICAgICApO1xuICAgICAgICBjbGllbnQuc3Vic2NyaWJlKGZpbHRlciwgc3Vic2NyaWJlT3B0aW9ucyk7XG4gICAgICB9O1xuXG4gICAgICAvKipcblx0XHQgKiBVbnN1YnNjcmliZSBmb3IgbWVzc2FnZXMsIHN0b3AgcmVjZWl2aW5nIG1lc3NhZ2VzIHNlbnQgdG8gZGVzdGluYXRpb25zIGRlc2NyaWJlZCBieSB0aGUgZmlsdGVyLlxuXHRcdCAqXG5cdFx0ICogQG5hbWUgUGFoby5DbGllbnQjdW5zdWJzY3JpYmVcblx0XHQgKiBAZnVuY3Rpb25cblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gZmlsdGVyIC0gZGVzY3JpYmluZyB0aGUgZGVzdGluYXRpb25zIHRvIHJlY2VpdmUgbWVzc2FnZXMgZnJvbS5cblx0XHQgKiBAcGFyYW0ge29iamVjdH0gdW5zdWJzY3JpYmVPcHRpb25zIC0gdXNlZCB0byBjb250cm9sIHRoZSBzdWJzY3JpcHRpb25cblx0XHQgKiBAcGFyYW0ge29iamVjdH0gdW5zdWJzY3JpYmVPcHRpb25zLmludm9jYXRpb25Db250ZXh0IC0gcGFzc2VkIHRvIHRoZSBvblN1Y2Nlc3MgY2FsbGJhY2tcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIG9yIG9uRmFpbHVyZSBjYWxsYmFjay5cblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9ufSB1bnN1YnNjcmliZU9wdGlvbnMub25TdWNjZXNzIC0gY2FsbGVkIHdoZW4gdGhlIHVuc3Vic2NyaWJlIGFja25vd2xlZGdlbWVudCBoYXMgYmVlbiByZWNlaXZlZCBmcm9tIHRoZSBzZXJ2ZXIuXG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBIHNpbmdsZSByZXNwb25zZSBvYmplY3QgcGFyYW1ldGVyIGlzIHBhc3NlZCB0byB0aGVcblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU3VjY2VzcyBjYWxsYmFjayBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgZmllbGRzOlxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9sPlxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPmludm9jYXRpb25Db250ZXh0IC0gaWYgc2V0IGluIHRoZSB1bnN1YnNjcmliZU9wdGlvbnMuXG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29sPlxuXHRcdCAqIEBwYXJhbSB7ZnVuY3Rpb259IHVuc3Vic2NyaWJlT3B0aW9ucy5vbkZhaWx1cmUgY2FsbGVkIHdoZW4gdGhlIHVuc3Vic2NyaWJlIHJlcXVlc3QgaGFzIGZhaWxlZCBvciB0aW1lZCBvdXQuXG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBIHNpbmdsZSByZXNwb25zZSBvYmplY3QgcGFyYW1ldGVyIGlzIHBhc3NlZCB0byB0aGUgb25GYWlsdXJlIGNhbGxiYWNrIGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZyBmaWVsZHM6XG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b2w+XG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+aW52b2NhdGlvbkNvbnRleHQgLSBpZiBzZXQgaW4gdGhlIHVuc3Vic2NyaWJlT3B0aW9ucy5cblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5lcnJvckNvZGUgLSBhIG51bWJlciBpbmRpY2F0aW5nIHRoZSBuYXR1cmUgb2YgdGhlIGVycm9yLlxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPmVycm9yTWVzc2FnZSAtIHRleHQgZGVzY3JpYmluZyB0aGUgZXJyb3IuXG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29sPlxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSB1bnN1YnNjcmliZU9wdGlvbnMudGltZW91dCAtIHdoaWNoLCBpZiBwcmVzZW50LCBkZXRlcm1pbmVzIHRoZSBudW1iZXIgb2Ygc2Vjb25kc1xuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXIgd2hpY2ggdGhlIG9uRmFpbHVyZSBjYWxsYmFjayBpcyBjYWxsZWQuIFRoZSBwcmVzZW5jZSBvZlxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYSB0aW1lb3V0IGRvZXMgbm90IHByZXZlbnQgdGhlIG9uU3VjY2VzcyBjYWxsYmFjayBmcm9tIGJlaW5nXG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsZWQgd2hlbiB0aGUgdW5zdWJzY3JpYmUgY29tcGxldGVzXG5cdFx0ICogQHRocm93cyB7SW52YWxpZFN0YXRlfSBpZiB0aGUgY2xpZW50IGlzIG5vdCBpbiBjb25uZWN0ZWQgc3RhdGUuXG5cdFx0ICovXG4gICAgICB0aGlzLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24oZmlsdGVyLCB1bnN1YnNjcmliZU9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmaWx0ZXIgIT09IFwic3RyaW5nXCIgJiYgZmlsdGVyLmNvbnN0cnVjdG9yICE9PSBBcnJheSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGFyZ3VtZW50OlwiICsgZmlsdGVyKTtcbiAgICAgICAgdW5zdWJzY3JpYmVPcHRpb25zID0gdW5zdWJzY3JpYmVPcHRpb25zIHx8IHt9O1xuICAgICAgICB2YWxpZGF0ZSh1bnN1YnNjcmliZU9wdGlvbnMsIHtcbiAgICAgICAgICBpbnZvY2F0aW9uQ29udGV4dDogXCJvYmplY3RcIixcbiAgICAgICAgICBvblN1Y2Nlc3M6IFwiZnVuY3Rpb25cIixcbiAgICAgICAgICBvbkZhaWx1cmU6IFwiZnVuY3Rpb25cIixcbiAgICAgICAgICB0aW1lb3V0OiBcIm51bWJlclwiXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodW5zdWJzY3JpYmVPcHRpb25zLnRpbWVvdXQgJiYgIXVuc3Vic2NyaWJlT3B0aW9ucy5vbkZhaWx1cmUpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgXCJ1bnN1YnNjcmliZU9wdGlvbnMudGltZW91dCBzcGVjaWZpZWQgd2l0aCBubyBvbkZhaWx1cmUgY2FsbGJhY2suXCJcbiAgICAgICAgICApO1xuICAgICAgICBjbGllbnQudW5zdWJzY3JpYmUoZmlsdGVyLCB1bnN1YnNjcmliZU9wdGlvbnMpO1xuICAgICAgfTtcblxuICAgICAgLyoqXG4gICAgICAgKiBTZW5kIGEgbWVzc2FnZSB0byB0aGUgY29uc3VtZXJzIG9mIHRoZSBkZXN0aW5hdGlvbiBpbiB0aGUgTWVzc2FnZS5cbiAgICAgICAqXG4gICAgICAgKiBAbmFtZSBQYWhvLkNsaWVudCNzZW5kXG4gICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfFBhaG8uTWVzc2FnZX0gdG9waWMgLSA8Yj5tYW5kYXRvcnk8L2I+IFRoZSBuYW1lIG9mIHRoZSBkZXN0aW5hdGlvbiB0byB3aGljaCB0aGUgbWVzc2FnZSBpcyB0byBiZSBzZW50LlxuICAgICAgICogXHRcdFx0XHRcdCAgIC0gSWYgaXQgaXMgdGhlIG9ubHkgcGFyYW1ldGVyLCB1c2VkIGFzIFBhaG8uTWVzc2FnZSBvYmplY3QuXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheUJ1ZmZlcn0gcGF5bG9hZCAtIFRoZSBtZXNzYWdlIGRhdGEgdG8gYmUgc2VudC5cbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBxb3MgVGhlIFF1YWxpdHkgb2YgU2VydmljZSB1c2VkIHRvIGRlbGl2ZXIgdGhlIG1lc3NhZ2UuXG4gICAgICAgKiBcdFx0PGRsPlxuICAgICAgICogXHRcdFx0PGR0PjAgQmVzdCBlZmZvcnQgKGRlZmF1bHQpLlxuICAgICAgICogICAgIFx0XHRcdDxkdD4xIEF0IGxlYXN0IG9uY2UuXG4gICAgICAgKiAgICAgXHRcdFx0PGR0PjIgRXhhY3RseSBvbmNlLlxuICAgICAgICogXHRcdDwvZGw+XG4gICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHJldGFpbmVkIElmIHRydWUsIHRoZSBtZXNzYWdlIGlzIHRvIGJlIHJldGFpbmVkIGJ5IHRoZSBzZXJ2ZXIgYW5kIGRlbGl2ZXJlZFxuICAgICAgICogICAgICAgICAgICAgICAgICAgICB0byBib3RoIGN1cnJlbnQgYW5kIGZ1dHVyZSBzdWJzY3JpcHRpb25zLlxuICAgICAgICogICAgICAgICAgICAgICAgICAgICBJZiBmYWxzZSB0aGUgc2VydmVyIG9ubHkgZGVsaXZlcnMgdGhlIG1lc3NhZ2UgdG8gY3VycmVudCBzdWJzY3JpYmVycywgdGhpcyBpcyB0aGUgZGVmYXVsdCBmb3IgbmV3IE1lc3NhZ2VzLlxuICAgICAgICogICAgICAgICAgICAgICAgICAgICBBIHJlY2VpdmVkIG1lc3NhZ2UgaGFzIHRoZSByZXRhaW5lZCBib29sZWFuIHNldCB0byB0cnVlIGlmIHRoZSBtZXNzYWdlIHdhcyBwdWJsaXNoZWRcbiAgICAgICAqICAgICAgICAgICAgICAgICAgICAgd2l0aCB0aGUgcmV0YWluZWQgYm9vbGVhbiBzZXQgdG8gdHJ1ZVxuICAgICAgICogICAgICAgICAgICAgICAgICAgICBhbmQgdGhlIHN1YnNjcnB0aW9uIHdhcyBtYWRlIGFmdGVyIHRoZSBtZXNzYWdlIGhhcyBiZWVuIHB1Ymxpc2hlZC5cbiAgICAgICAqIEB0aHJvd3Mge0ludmFsaWRTdGF0ZX0gaWYgdGhlIGNsaWVudCBpcyBub3QgY29ubmVjdGVkLlxuICAgICAgICovXG4gICAgICB0aGlzLnNlbmQgPSBmdW5jdGlvbih0b3BpYywgcGF5bG9hZCwgcW9zLCByZXRhaW5lZCkge1xuICAgICAgICB2YXIgbWVzc2FnZTtcblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYXJndW1lbnQuXCIgKyBcImxlbmd0aFwiKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICBpZiAoISh0b3BpYyBpbnN0YW5jZW9mIE1lc3NhZ2UpICYmIHR5cGVvZiB0b3BpYyAhPT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYXJndW1lbnQ6XCIgKyB0eXBlb2YgdG9waWMpO1xuXG4gICAgICAgICAgbWVzc2FnZSA9IHRvcGljO1xuICAgICAgICAgIGlmICh0eXBlb2YgbWVzc2FnZS5kZXN0aW5hdGlvbk5hbWUgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGZvcm1hdChFUlJPUi5JTlZBTElEX0FSR1VNRU5ULCBbXG4gICAgICAgICAgICAgICAgbWVzc2FnZS5kZXN0aW5hdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgXCJNZXNzYWdlLmRlc3RpbmF0aW9uTmFtZVwiXG4gICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgIGNsaWVudC5zZW5kKG1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vcGFyYW1ldGVyIGNoZWNraW5nIGluIE1lc3NhZ2Ugb2JqZWN0XG4gICAgICAgICAgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKHBheWxvYWQpO1xuICAgICAgICAgIG1lc3NhZ2UuZGVzdGluYXRpb25OYW1lID0gdG9waWM7XG4gICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgbWVzc2FnZS5xb3MgPSBxb3M7XG4gICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgbWVzc2FnZS5yZXRhaW5lZCA9IHJldGFpbmVkO1xuICAgICAgICAgIGNsaWVudC5zZW5kKG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIFB1Ymxpc2ggYSBtZXNzYWdlIHRvIHRoZSBjb25zdW1lcnMgb2YgdGhlIGRlc3RpbmF0aW9uIGluIHRoZSBNZXNzYWdlLlxuICAgICAgICogU3lub255bSBmb3IgUGFoby5NcXR0LkNsaWVudCNzZW5kXG4gICAgICAgKlxuICAgICAgICogQG5hbWUgUGFoby5DbGllbnQjcHVibGlzaFxuICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xQYWhvLk1lc3NhZ2V9IHRvcGljIC0gPGI+bWFuZGF0b3J5PC9iPiBUaGUgbmFtZSBvZiB0aGUgdG9waWMgdG8gd2hpY2ggdGhlIG1lc3NhZ2UgaXMgdG8gYmUgcHVibGlzaGVkLlxuICAgICAgICogXHRcdFx0XHRcdCAgIC0gSWYgaXQgaXMgdGhlIG9ubHkgcGFyYW1ldGVyLCB1c2VkIGFzIFBhaG8uTWVzc2FnZSBvYmplY3QuXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheUJ1ZmZlcn0gcGF5bG9hZCAtIFRoZSBtZXNzYWdlIGRhdGEgdG8gYmUgcHVibGlzaGVkLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHFvcyBUaGUgUXVhbGl0eSBvZiBTZXJ2aWNlIHVzZWQgdG8gZGVsaXZlciB0aGUgbWVzc2FnZS5cbiAgICAgICAqIFx0XHQ8ZGw+XG4gICAgICAgKiBcdFx0XHQ8ZHQ+MCBCZXN0IGVmZm9ydCAoZGVmYXVsdCkuXG4gICAgICAgKiAgICAgXHRcdFx0PGR0PjEgQXQgbGVhc3Qgb25jZS5cbiAgICAgICAqICAgICBcdFx0XHQ8ZHQ+MiBFeGFjdGx5IG9uY2UuXG4gICAgICAgKiBcdFx0PC9kbD5cbiAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcmV0YWluZWQgSWYgdHJ1ZSwgdGhlIG1lc3NhZ2UgaXMgdG8gYmUgcmV0YWluZWQgYnkgdGhlIHNlcnZlciBhbmQgZGVsaXZlcmVkXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgIHRvIGJvdGggY3VycmVudCBhbmQgZnV0dXJlIHN1YnNjcmlwdGlvbnMuXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgIElmIGZhbHNlIHRoZSBzZXJ2ZXIgb25seSBkZWxpdmVycyB0aGUgbWVzc2FnZSB0byBjdXJyZW50IHN1YnNjcmliZXJzLCB0aGlzIGlzIHRoZSBkZWZhdWx0IGZvciBuZXcgTWVzc2FnZXMuXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgIEEgcmVjZWl2ZWQgbWVzc2FnZSBoYXMgdGhlIHJldGFpbmVkIGJvb2xlYW4gc2V0IHRvIHRydWUgaWYgdGhlIG1lc3NhZ2Ugd2FzIHB1Ymxpc2hlZFxuICAgICAgICogICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSByZXRhaW5lZCBib29sZWFuIHNldCB0byB0cnVlXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgIGFuZCB0aGUgc3Vic2NycHRpb24gd2FzIG1hZGUgYWZ0ZXIgdGhlIG1lc3NhZ2UgaGFzIGJlZW4gcHVibGlzaGVkLlxuICAgICAgICogQHRocm93cyB7SW52YWxpZFN0YXRlfSBpZiB0aGUgY2xpZW50IGlzIG5vdCBjb25uZWN0ZWQuXG4gICAgICAgKi9cbiAgICAgIHRoaXMucHVibGlzaCA9IGZ1bmN0aW9uKHRvcGljLCBwYXlsb2FkLCBxb3MsIHJldGFpbmVkKSB7XG4gICAgICAgIHZhciBtZXNzYWdlO1xuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBhcmd1bWVudC5cIiArIFwibGVuZ3RoXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgIGlmICghKHRvcGljIGluc3RhbmNlb2YgTWVzc2FnZSkgJiYgdHlwZW9mIHRvcGljICE9PSBcInN0cmluZ1wiKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBhcmd1bWVudDpcIiArIHR5cGVvZiB0b3BpYyk7XG5cbiAgICAgICAgICBtZXNzYWdlID0gdG9waWM7XG4gICAgICAgICAgaWYgKHR5cGVvZiBtZXNzYWdlLmRlc3RpbmF0aW9uTmFtZSA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgZm9ybWF0KEVSUk9SLklOVkFMSURfQVJHVU1FTlQsIFtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLmRlc3RpbmF0aW9uTmFtZSxcbiAgICAgICAgICAgICAgICBcIk1lc3NhZ2UuZGVzdGluYXRpb25OYW1lXCJcbiAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgY2xpZW50LnNlbmQobWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9wYXJhbWV0ZXIgY2hlY2tpbmcgaW4gTWVzc2FnZSBvYmplY3RcbiAgICAgICAgICBtZXNzYWdlID0gbmV3IE1lc3NhZ2UocGF5bG9hZCk7XG4gICAgICAgICAgbWVzc2FnZS5kZXN0aW5hdGlvbk5hbWUgPSB0b3BpYztcbiAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBtZXNzYWdlLnFvcyA9IHFvcztcbiAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBtZXNzYWdlLnJldGFpbmVkID0gcmV0YWluZWQ7XG4gICAgICAgICAgY2xpZW50LnNlbmQobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogTm9ybWFsIGRpc2Nvbm5lY3Qgb2YgdGhpcyBNZXNzYWdpbmcgY2xpZW50IGZyb20gaXRzIHNlcnZlci5cbiAgICAgICAqXG4gICAgICAgKiBAbmFtZSBQYWhvLkNsaWVudCNkaXNjb25uZWN0XG4gICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAqIEB0aHJvd3Mge0ludmFsaWRTdGF0ZX0gaWYgdGhlIGNsaWVudCBpcyBhbHJlYWR5IGRpc2Nvbm5lY3RlZC5cbiAgICAgICAqL1xuICAgICAgdGhpcy5kaXNjb25uZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsaWVudC5kaXNjb25uZWN0KCk7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIEdldCB0aGUgY29udGVudHMgb2YgdGhlIHRyYWNlIGxvZy5cbiAgICAgICAqXG4gICAgICAgKiBAbmFtZSBQYWhvLkNsaWVudCNnZXRUcmFjZUxvZ1xuICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3RbXX0gdHJhY2VidWZmZXIgY29udGFpbmluZyB0aGUgdGltZSBvcmRlcmVkIHRyYWNlIHJlY29yZHMuXG4gICAgICAgKi9cbiAgICAgIHRoaXMuZ2V0VHJhY2VMb2cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNsaWVudC5nZXRUcmFjZUxvZygpO1xuICAgICAgfTtcblxuICAgICAgLyoqXG4gICAgICAgKiBTdGFydCB0cmFjaW5nLlxuICAgICAgICpcbiAgICAgICAqIEBuYW1lIFBhaG8uQ2xpZW50I3N0YXJ0VHJhY2VcbiAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICovXG4gICAgICB0aGlzLnN0YXJ0VHJhY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xpZW50LnN0YXJ0VHJhY2UoKTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogU3RvcCB0cmFjaW5nLlxuICAgICAgICpcbiAgICAgICAqIEBuYW1lIFBhaG8uQ2xpZW50I3N0b3BUcmFjZVxuICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc3RvcFRyYWNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsaWVudC5zdG9wVHJhY2UoKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNsaWVudC5jb25uZWN0ZWQ7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcHBsaWNhdGlvbiBtZXNzYWdlLCBzZW50IG9yIHJlY2VpdmVkLlxuICAgICAqIDxwPlxuICAgICAqIEFsbCBhdHRyaWJ1dGVzIG1heSBiZSBudWxsLCB3aGljaCBpbXBsaWVzIHRoZSBkZWZhdWx0IHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEBuYW1lIFBhaG8uTWVzc2FnZVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5QnVmZmVyfSBwYXlsb2FkIFRoZSBtZXNzYWdlIGRhdGEgdG8gYmUgc2VudC5cbiAgICAgKiA8cD5cbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gcGF5bG9hZFN0cmluZyA8aT5yZWFkIG9ubHk8L2k+IFRoZSBwYXlsb2FkIGFzIGEgc3RyaW5nIGlmIHRoZSBwYXlsb2FkIGNvbnNpc3RzIG9mIHZhbGlkIFVURi04IGNoYXJhY3RlcnMuXG4gICAgICogQHByb3BlcnR5IHtBcnJheUJ1ZmZlcn0gcGF5bG9hZEJ5dGVzIDxpPnJlYWQgb25seTwvaT4gVGhlIHBheWxvYWQgYXMgYW4gQXJyYXlCdWZmZXIuXG4gICAgICogPHA+XG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGRlc3RpbmF0aW9uTmFtZSA8Yj5tYW5kYXRvcnk8L2I+IFRoZSBuYW1lIG9mIHRoZSBkZXN0aW5hdGlvbiB0byB3aGljaCB0aGUgbWVzc2FnZSBpcyB0byBiZSBzZW50XG4gICAgICogICAgICAgICAgICAgICAgICAgIChmb3IgbWVzc2FnZXMgYWJvdXQgdG8gYmUgc2VudCkgb3IgdGhlIG5hbWUgb2YgdGhlIGRlc3RpbmF0aW9uIGZyb20gd2hpY2ggdGhlIG1lc3NhZ2UgaGFzIGJlZW4gcmVjZWl2ZWQuXG4gICAgICogICAgICAgICAgICAgICAgICAgIChmb3IgbWVzc2FnZXMgcmVjZWl2ZWQgYnkgdGhlIG9uTWVzc2FnZSBmdW5jdGlvbikuXG4gICAgICogPHA+XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHFvcyBUaGUgUXVhbGl0eSBvZiBTZXJ2aWNlIHVzZWQgdG8gZGVsaXZlciB0aGUgbWVzc2FnZS5cbiAgICAgKiA8ZGw+XG4gICAgICogICAgIDxkdD4wIEJlc3QgZWZmb3J0IChkZWZhdWx0KS5cbiAgICAgKiAgICAgPGR0PjEgQXQgbGVhc3Qgb25jZS5cbiAgICAgKiAgICAgPGR0PjIgRXhhY3RseSBvbmNlLlxuICAgICAqIDwvZGw+XG4gICAgICogPHA+XG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSByZXRhaW5lZCBJZiB0cnVlLCB0aGUgbWVzc2FnZSBpcyB0byBiZSByZXRhaW5lZCBieSB0aGUgc2VydmVyIGFuZCBkZWxpdmVyZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIHRvIGJvdGggY3VycmVudCBhbmQgZnV0dXJlIHN1YnNjcmlwdGlvbnMuXG4gICAgICogICAgICAgICAgICAgICAgICAgICBJZiBmYWxzZSB0aGUgc2VydmVyIG9ubHkgZGVsaXZlcnMgdGhlIG1lc3NhZ2UgdG8gY3VycmVudCBzdWJzY3JpYmVycywgdGhpcyBpcyB0aGUgZGVmYXVsdCBmb3IgbmV3IE1lc3NhZ2VzLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgQSByZWNlaXZlZCBtZXNzYWdlIGhhcyB0aGUgcmV0YWluZWQgYm9vbGVhbiBzZXQgdG8gdHJ1ZSBpZiB0aGUgbWVzc2FnZSB3YXMgcHVibGlzaGVkXG4gICAgICogICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSByZXRhaW5lZCBib29sZWFuIHNldCB0byB0cnVlXG4gICAgICogICAgICAgICAgICAgICAgICAgICBhbmQgdGhlIHN1YnNjcnB0aW9uIHdhcyBtYWRlIGFmdGVyIHRoZSBtZXNzYWdlIGhhcyBiZWVuIHB1Ymxpc2hlZC5cbiAgICAgKiA8cD5cbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGR1cGxpY2F0ZSA8aT5yZWFkIG9ubHk8L2k+IElmIHRydWUsIHRoaXMgbWVzc2FnZSBtaWdodCBiZSBhIGR1cGxpY2F0ZSBvZiBvbmUgd2hpY2ggaGFzIGFscmVhZHkgYmVlbiByZWNlaXZlZC5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIFRoaXMgaXMgb25seSBzZXQgb24gbWVzc2FnZXMgcmVjZWl2ZWQgZnJvbSB0aGUgc2VydmVyLlxuICAgICAqXG4gICAgICovXG4gICAgdmFyIE1lc3NhZ2UgPSBmdW5jdGlvbihuZXdQYXlsb2FkKSB7XG4gICAgICB2YXIgcGF5bG9hZDtcbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIG5ld1BheWxvYWQgPT09IFwic3RyaW5nXCIgfHxcbiAgICAgICAgbmV3UGF5bG9hZCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8XG4gICAgICAgIChBcnJheUJ1ZmZlci5pc1ZpZXcobmV3UGF5bG9hZCkgJiYgIShuZXdQYXlsb2FkIGluc3RhbmNlb2YgRGF0YVZpZXcpKVxuICAgICAgKSB7XG4gICAgICAgIHBheWxvYWQgPSBuZXdQYXlsb2FkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZm9ybWF0KEVSUk9SLklOVkFMSURfQVJHVU1FTlQsIFtuZXdQYXlsb2FkLCBcIm5ld1BheWxvYWRcIl0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGVzdGluYXRpb25OYW1lO1xuICAgICAgdmFyIHFvcyA9IDA7XG4gICAgICB2YXIgcmV0YWluZWQgPSBmYWxzZTtcbiAgICAgIHZhciBkdXBsaWNhdGUgPSBmYWxzZTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgICAgICBwYXlsb2FkU3RyaW5nOiB7XG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXlsb2FkID09PSBcInN0cmluZ1wiKSByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIHBhcnNlVVRGOChwYXlsb2FkLCAwLCBwYXlsb2FkLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwYXlsb2FkQnl0ZXM6IHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHBheWxvYWQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgdmFyIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihVVEY4TGVuZ3RoKHBheWxvYWQpKTtcbiAgICAgICAgICAgICAgdmFyIGJ5dGVTdHJlYW0gPSBuZXcgVWludDhBcnJheShidWZmZXIpO1xuICAgICAgICAgICAgICBzdHJpbmdUb1VURjgocGF5bG9hZCwgYnl0ZVN0cmVhbSwgMCk7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGJ5dGVTdHJlYW07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGRlc3RpbmF0aW9uTmFtZToge1xuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbk5hbWU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKG5ld0Rlc3RpbmF0aW9uTmFtZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuZXdEZXN0aW5hdGlvbk5hbWUgPT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uTmFtZSA9IG5ld0Rlc3RpbmF0aW9uTmFtZTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGZvcm1hdChFUlJPUi5JTlZBTElEX0FSR1VNRU5ULCBbXG4gICAgICAgICAgICAgICAgICBuZXdEZXN0aW5hdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICBcIm5ld0Rlc3RpbmF0aW9uTmFtZVwiXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHFvczoge1xuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBxb3M7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKG5ld1Fvcykge1xuICAgICAgICAgICAgaWYgKG5ld1FvcyA9PT0gMCB8fCBuZXdRb3MgPT09IDEgfHwgbmV3UW9zID09PSAyKSBxb3MgPSBuZXdRb3M7XG4gICAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYXJndW1lbnQ6XCIgKyBuZXdRb3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmV0YWluZWQ6IHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmV0YWluZWQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKG5ld1JldGFpbmVkKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG5ld1JldGFpbmVkID09PSBcImJvb2xlYW5cIikgcmV0YWluZWQgPSBuZXdSZXRhaW5lZDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGZvcm1hdChFUlJPUi5JTlZBTElEX0FSR1VNRU5ULCBbbmV3UmV0YWluZWQsIFwibmV3UmV0YWluZWRcIl0pXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0b3BpYzoge1xuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBkZXN0aW5hdGlvbk5hbWU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKG5ld1RvcGljKSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbk5hbWUgPSBuZXdUb3BpYztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGR1cGxpY2F0ZToge1xuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBkdXBsaWNhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKG5ld0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgZHVwbGljYXRlID0gbmV3RHVwbGljYXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIE1vZHVsZSBjb250ZW50cy5cbiAgICByZXR1cm4ge1xuICAgICAgQ2xpZW50OiBDbGllbnQsXG4gICAgICBNZXNzYWdlOiBNZXNzYWdlXG4gICAgfTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmVzdGVkLXRlcm5hcnlcbiAgfSkoXG4gICAgdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgPyBnbG9iYWxcbiAgICAgIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgID8gc2VsZlxuICAgICAgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiXG4gICAgICA/IHdpbmRvd1xuICAgICAgOiB7fVxuICApO1xuICByZXR1cm4gUGFob01RVFQ7XG59KTtcbiIsImltcG9ydCB7IElsbGVnYWxBcmd1bWVudEV4Y2VwdGlvbiB9IGZyb20gXCIuL2NvcmUvZXhjZXB0aW9uc1wiO1xuaW1wb3J0IHsgVmFsdWVFcnJvciB9IGZyb20gXCIuL2NvcmUvZXhjZXB0aW9uc1wiO1xuaW1wb3J0IHsgc3ByaW50ZiB9IGZyb20gXCJzcHJpbnRmLWpzXCI7XG5jb25zdCBVdGlscyA9IHt9O1xuXG4vKipcbiAqIEFzc2VydHMgdGhhdCBhIHByZW1pc2UgaXMgdHJ1ZS5cbiAqL1xuVXRpbHMuYXNzZXJ0VHJ1ZSA9IGZ1bmN0aW9uKHByZW1pc2UsIG1lc3NhZ2UpIHtcbiAgaWYgKCFwcmVtaXNlKSB7XG4gICAgdGhyb3cgbmV3IFZhbHVlRXJyb3IobWVzc2FnZSk7XG4gIH1cbn07XG5cbi8qKlxuICogQXNzZXJ0cyB0aGF0IGEgdmFsdWUgaXMgbm90IG51bGwgb3IgdW5kZWZpbmVkLlxuICovXG5VdGlscy5hc3NlcnROb3ROdWxsID0gZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgVXRpbHMuYXNzZXJ0VHJ1ZShcbiAgICB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgIT09IHVuZGVmaW5lZCxcbiAgICBzcHJpbnRmKFwiJXMgbXVzdCBiZSBwcm92aWRlZFwiLCBuYW1lIHx8IFwiQSB2YWx1ZVwiKVxuICApO1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5VdGlscy5ub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xufTtcblxuVXRpbHMuaXNTdHJpbmcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiO1xufTtcblxuLyoqXG4gKiBHZW5lcmF0ZSBhIHJhbmRvbSBJRCBjb25zaXN0aW5nIG9mIHRoZSBjdXJyZW50IHRpbWVzdGFtcFxuICogYW5kIGEgcmFuZG9tIGJhc2UtMzYgbnVtYmVyIGJhc2VkIG9uIE1hdGgucmFuZG9tKCkuXG4gKi9cblV0aWxzLnJhbmRvbUlkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBzcHJpbnRmKFxuICAgIFwiJXMtJXNcIixcbiAgICBVdGlscy5ub3coKSxcbiAgICBNYXRoLnJhbmRvbSgpXG4gICAgICAudG9TdHJpbmcoMzYpXG4gICAgICAuc2xpY2UoMilcbiAgKTtcbn07XG5cblV0aWxzLmFzc2VydElzTm9uRW1wdHlTdHJpbmcgPSBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gIGlmICghdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IElsbGVnYWxBcmd1bWVudEV4Y2VwdGlvbihrZXkgKyBcIiBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIVwiKTtcbiAgfVxufTtcblxuVXRpbHMuYXNzZXJ0SXNMaXN0ID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IElsbGVnYWxBcmd1bWVudEV4Y2VwdGlvbihrZXkgKyBcIiBpcyBub3QgYW4gYXJyYXlcIik7XG4gIH1cbn07XG5cblV0aWxzLmFzc2VydElzRW51bSA9IGZ1bmN0aW9uKHZhbHVlLCBhbGxvd2VkVmFsdWVzLCBrZXkpIHtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IDA7IGkgPCBhbGxvd2VkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGFsbG93ZWRWYWx1ZXNbaV0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb24oXG4gICAga2V5ICsgXCIgcGFzc2VkIGlzIG5vdCB2YWxpZC4gXCIgKyBcIkFsbG93ZWQgdmFsdWVzIGFyZTogXCIgKyBhbGxvd2VkVmFsdWVzXG4gICk7XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlIGFuIGVudW0gZnJvbSB0aGUgZ2l2ZW4gbGlzdCBvZiBsb3dlci1jYXNlIGVudW0gdmFsdWVzLFxuICogd2hlcmUgdGhlIGVudW0ga2V5cyB3aWxsIGJlIHVwcGVyIGNhc2UuXG4gKlxuICogQ29udmVyc2lvbiBmcm9tIHBhc2NhbCBjYXNlIGJhc2VkIG9uIGNvZGUgZnJvbSBoZXJlOlxuICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMDUyMTIyNFxuICovXG5VdGlscy5tYWtlRW51bSA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICB2YXIgZW51bU9iaiA9IHt9O1xuXG4gIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIGtleSA9IHZhbHVlXG4gICAgICAucmVwbGFjZSgvXFwuPyhbYS16XSspXz8vZywgZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICByZXR1cm4geS50b1VwcGVyQ2FzZSgpICsgXCJfXCI7XG4gICAgICB9KVxuICAgICAgLnJlcGxhY2UoL18kLywgXCJcIik7XG5cbiAgICBlbnVtT2JqW2tleV0gPSB2YWx1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGVudW1PYmo7XG59O1xuXG5VdGlscy5jb250YWlucyA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUpIHtcbiAgaWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFV0aWxzLmZpbmQob2JqLCBmdW5jdGlvbih2KSB7XG4gICAgICAgIHJldHVybiB2ID09PSB2YWx1ZTtcbiAgICAgIH0pICE9PSBudWxsXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsdWUgaW4gb2JqO1xuICB9XG59O1xuXG5VdGlscy5maW5kID0gZnVuY3Rpb24oYXJyYXksIHByZWRpY2F0ZSkge1xuICBmb3IgKHZhciB4ID0gMDsgeCA8IGFycmF5Lmxlbmd0aDsgeCsrKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVt4XSkpIHtcbiAgICAgIHJldHVybiBhcnJheVt4XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cblV0aWxzLmNvbnRhaW5zVmFsdWUgPSBmdW5jdGlvbihvYmosIHZhbHVlKSB7XG4gIGlmIChvYmogaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiAoXG4gICAgICBVdGlscy5maW5kKG9iaiwgZnVuY3Rpb24odikge1xuICAgICAgICByZXR1cm4gdiA9PT0gdmFsdWU7XG4gICAgICB9KSAhPT0gbnVsbFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFV0aWxzLmZpbmQoVXRpbHMudmFsdWVzKG9iaiksIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgcmV0dXJuIHYgPT09IHZhbHVlO1xuICAgICAgfSkgIT09IG51bGxcbiAgICApO1xuICB9XG59O1xuXG4vKipcbiAqIERldGVybWluZSBpZiB0aGUgZ2l2ZW4gdmFsdWUgaXMgYSBjYWxsYWJsZSBmdW5jdGlvbiB0eXBlLlxuICogQm9ycm93ZWQgZnJvbSBVbmRlcnNjb3JlLmpzLlxuICovXG5VdGlscy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiAhIShvYmogJiYgb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jYWxsICYmIG9iai5hcHBseSk7XG59O1xuXG4vKipcbiAqIEdldCBhIGxpc3Qgb2YgdmFsdWVzIGZyb20gYSBKYXZhc2NyaXB0IG9iamVjdCB1c2VkXG4gKiBhcyBhIGhhc2ggbWFwLlxuICovXG5VdGlscy52YWx1ZXMgPSBmdW5jdGlvbihtYXApIHtcbiAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gIFV0aWxzLmFzc2VydE5vdE51bGwobWFwLCBcIm1hcFwiKTtcblxuICBmb3IgKHZhciBrIGluIG1hcCkge1xuICAgIHZhbHVlcy5wdXNoKG1hcFtrXSk7XG4gIH1cblxuICByZXR1cm4gdmFsdWVzO1xufTtcblxuVXRpbHMuaXNPYmplY3QgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gISh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgfHwgdmFsdWUgPT09IG51bGwpO1xufTtcblxuVXRpbHMuYXNzZXJ0SXNPYmplY3QgPSBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gIGlmICghVXRpbHMuaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IElsbGVnYWxBcmd1bWVudEV4Y2VwdGlvbihrZXkgKyBcIiBpcyBub3QgYW4gb2JqZWN0IVwiKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgVXRpbHM7XG4iXSwic291cmNlUm9vdCI6IiJ9