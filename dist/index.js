"use strict";

require("core-js/modules/es.symbol.description.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
const minWidth = 380,
  startHeight = 640,
  defaultSettings = {
    resize: false,
    closeButton: false,
    mobileWidth: 650,
    canOpenNewWindows: true
  };
var _messageCallbacks = /*#__PURE__*/new WeakMap();
var _width = /*#__PURE__*/new WeakMap();
var _height = /*#__PURE__*/new WeakMap();
var _style = /*#__PURE__*/new WeakMap();
var _initialized = /*#__PURE__*/new WeakMap();
var _initStyles = /*#__PURE__*/new WeakMap();
var _applyStyles = /*#__PURE__*/new WeakMap();
var _handleMessages = /*#__PURE__*/new WeakMap();
var _messageHandler = /*#__PURE__*/new WeakMap();
class MetaRIBBITConnect {
  constructor(_ref) {
    let {
      token,
      language = 'en',
      width = minWidth,
      settings,
      inline,
      fullscreen = false,
      environment = 'Production',
      environmentOverrideURL
    } = _ref;
    _defineProperty(this, "settings", {});
    _defineProperty(this, "CONNECTEvents", ['launch', 'exit', 'complete', 'bankLoginSelected', 'manualEnrollmentSelected', 'noAccountsFound', 'bankNotFound', 'bankLogin', 'bankManual', 'linkOpen']);
    _classPrivateFieldInitSpec(this, _messageCallbacks, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _width, {
      writable: true,
      value: minWidth
    });
    _classPrivateFieldInitSpec(this, _height, {
      writable: true,
      value: startHeight
    });
    _classPrivateFieldInitSpec(this, _style, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(this, _initialized, {
      writable: true,
      value: false
    });
    _defineProperty(this, "initFrame", () => {
      _classPrivateFieldSet(this, _initialized, true);
      const iFrame = document.createElement('iframe');
      //const server = 'https://localhost:44345'

      let server = '';
      if (!this.environmentOverrideURL) {
        switch (this.environment) {
          case 'Production':
            server = 'https://portal.ribbit.ai';
            break;
          case 'Development':
            server = 'https://playground.ribbit.ai';
            break;
          case 'Test':
            server = 'https://test.ribbit.ai';
            break;
          case 'Staging':
            server = 'https://test.ribbit.ai';
            break;
        }
      } else {
        server = this.environmentOverrideURL;
      }
      this.iFrameMessageKey = new Date().getTime() + '';
      iFrame.setAttribute('src', server + '/CONNECT/Frame?token=' + this.token + '&language=' + this.language + '&messagekey=' + this.iFrameMessageKey);
      iFrame.id = this.id;
      this.iFrame = iFrame;
      this.updateClassName();
      _classPrivateFieldGet(this, _handleMessages).call(this);
      _classPrivateFieldGet(this, _initStyles).call(this);
      _classPrivateFieldGet(this, _applyStyles).call(this);
      window.addEventListener('resize', e => {
        let isMobile = window.innerWidth <= this.settings.mobileWidth;
        this.sendMessage('resize', {
          width: window.innerWidth,
          height: window.innerHeight
        });
        if (isMobile != this.isMobile) {
          this.isMobile = isMobile;
          this.sendMessage('isMobile', this.isMobile);
          this.updateClassName();
        }
      }, true);
    });
    _defineProperty(this, "onCallbacks", []);
    _defineProperty(this, "on", (eventName, callback) => {
      this.onCallbacks.push({
        eventName,
        callback
      });
    });
    _defineProperty(this, "updateClassName", () => {
      this.iFrame.className = 'RIBBIT-iFrame' + (this.isMobile || this.fullscreen ? ' RIBBIT-iFrame-mobile' : '') + (this.fullscreen ? ' RIBBIT-iFrame-fullscreen' : '');
    });
    _classPrivateFieldInitSpec(this, _initStyles, {
      writable: true,
      value: () => {
        _classPrivateFieldSet(this, _style, document.createElement('style'));
        _classPrivateFieldGet(this, _style).type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(_classPrivateFieldGet(this, _style));
      }
    });
    _classPrivateFieldInitSpec(this, _applyStyles, {
      writable: true,
      value: () => {
        const css = "\n            #".concat(this.id, " {\n                ").concat(_classPrivateFieldGet(this, _height) ? 'height: ' + _classPrivateFieldGet(this, _height) + 'px;' : '', "\n                width: ").concat(_classPrivateFieldGet(this, _width), "px;\n            }\n        ");
        if (_classPrivateFieldGet(this, _style).styleSheet) {
          _classPrivateFieldGet(this, _style).styleSheet.cssText = css;
        } else {
          _classPrivateFieldGet(this, _style).innerHTML = '';
          _classPrivateFieldGet(this, _style).appendChild(document.createTextNode(css));
        }
      }
    });
    _defineProperty(this, "sendMessage", (functionName, message) => {
      let frame = document.getElementById(this.id);
      if (!frame) return;
      frame.contentWindow.postMessage({
        'function': functionName,
        message
      }, "*");
    });
    _classPrivateFieldInitSpec(this, _handleMessages, {
      writable: true,
      value: () => {
        window.removeEventListener("message", _classPrivateFieldGet(this, _messageHandler));
        window.addEventListener("message", _classPrivateFieldGet(this, _messageHandler), false);
      }
    });
    _classPrivateFieldInitSpec(this, _messageHandler, {
      writable: true,
      value: e => {
        const functionName = e.data.function,
          message = e.data.message,
          key = e.data.key;
        if (!functionName) return;
        if (key !== this.iFrameMessageKey) return;
        switch (functionName) {
          case 'heightChange':
            if (this.settings.resize == false) return;
            _classPrivateFieldSet(this, _height, message);
            _classPrivateFieldGet(this, _applyStyles).call(this);
            break;
          case 'openLink':
            if (this.settings.canOpenNewWindows) window.open(message, '_blank').focus();else this.onCallbacks.filter(x => x.eventName == 'linkOpen').map(x => x.callback(message));
            break;
          case 'CONNECTEvent':
            _classPrivateFieldGet(this, _messageCallbacks).map(f => f(functionName, message));
            this.onCallbacks.filter(x => x.eventName == message.name).map(x => x.callback(message));
            break;
          case 'environmentCheck':
            this.sendMessage('isMobile', window.innerWidth <= this.settings.mobileWidth);
            this.sendMessage('isInline', this.isInline);
            break;
          case 'startupParams':
            this.sendMessage('startupParams', {
              token: this.token,
              settings: this.settings,
              isMobile: this.isMobile,
              isInline: this.isInline,
              fullscreen: this.fullscreen,
              language: this.language,
              environment: this.environment,
              environmentOverrideURL: this.environmentOverrideURL
            });
            break;
        }
      }
    });
    _defineProperty(this, "onMessage", callback => {
      // outside event
      _classPrivateFieldGet(this, _messageCallbacks).push(callback);
    });
    this.token = token;
    this.id = 'RIBBIT-' + this.token;
    this.settings = _objectSpread(_objectSpread({}, defaultSettings), settings);
    _classPrivateFieldSet(this, _width, width > minWidth ? width : minWidth);
    _classPrivateFieldSet(this, _height, Math.min(640, window.innerHeight * .9));
    this.isMobile = window.innerWidth <= this.settings.mobileWidth;
    this.isInline = inline === true ? true : false;
    this.fullscreen = fullscreen;
    this.language = language;
    this.environment = environment;
    this.environmentOverrideURL = environmentOverrideURL;
    //if(!settings || settings.resize == null) this.settings.resize = this.isInline

    if (!_classPrivateFieldGet(this, _initialized)) this.initFrame();
    this.sendMessage('isMobile', this.isMobile);
    this.sendMessage('isInline', this.isInline);
    _classPrivateFieldGet(this, _applyStyles).call(this);
  }
}
exports.default = MetaRIBBITConnect;