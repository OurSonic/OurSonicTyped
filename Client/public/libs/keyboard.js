!function (e) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else { var f; "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), f.keyboardJS = e() } }(function () {
    var define, module, exports; return (function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++) s(r[o]); return s })({
        1: [function (require, module, exports) {

            var Keyboard = require('./lib/keyboard');
            var Locale = require('./lib/locale');
            var KeyCombo = require('./lib/key-combo');

            var keyboard = new Keyboard();

            keyboard.setLocale('us', require('./locales/us'));

            exports = module.exports = keyboard;
            exports.Keyboard = Keyboard;
            exports.Locale = Locale;
            exports.KeyCombo = KeyCombo;

        }, { "./lib/key-combo": 2, "./lib/keyboard": 3, "./lib/locale": 4, "./locales/us": 5 }], 2: [function (require, module, exports) {

            function KeyCombo(keyComboStr) {
                this.sourceStr = keyComboStr;
                this.subCombos = KeyCombo.parseComboStr(keyComboStr);
                this.keyNames = this.subCombos.reduce(function (memo, nextSubCombo) {
                    return memo.concat(nextSubCombo);
                });
            }

            // TODO: Add support for key combo sequences
            KeyCombo.sequenceDeliminator = '>>';
            KeyCombo.comboDeliminator = '>';
            KeyCombo.keyDeliminator = '+';

            KeyCombo.parseComboStr = function (keyComboStr) {
                var subComboStrs = KeyCombo._splitStr(keyComboStr, KeyCombo.comboDeliminator);
                var combo = [];

                for (var i = 0 ; i < subComboStrs.length; i += 1) {
                    combo.push(KeyCombo._splitStr(subComboStrs[i], KeyCombo.keyDeliminator));
                }
                return combo;
            };

            KeyCombo.prototype.check = function (pressedKeyNames) {
                var startingKeyNameIndex = 0;
                for (var i = 0; i < this.subCombos.length; i += 1) {
                    startingKeyNameIndex = this._checkSubCombo(
                      this.subCombos[i],
                      startingKeyNameIndex,
                      pressedKeyNames
                    );
                    if (startingKeyNameIndex === -1) { return false; }
                }
                return true;
            };

            KeyCombo.prototype.isEqual = function (otherKeyCombo) {
                if (
                  !otherKeyCombo ||
                  typeof otherKeyCombo !== 'string' &&
                  typeof otherKeyCombo !== 'object'
                ) { return false; }

                if (typeof otherKeyCombo === 'string') {
                    otherKeyCombo = new KeyCombo(otherKeyCombo);
                }

                if (this.subCombos.length !== otherKeyCombo.subCombos.length) {
                    return false;
                }
                for (var i = 0; i < this.subCombos.length; i += 1) {
                    if (this.subCombos[i].length !== otherKeyCombo.subCombos[i].length) {
                        return false;
                    }
                }

                for (var i = 0; i < this.subCombos.length; i += 1) {
                    var subCombo = this.subCombos[i];
                    var otherSubCombo = otherKeyCombo.subCombos[i].slice(0);

                    for (var j = 0; j < subCombo.length; j += 1) {
                        var keyName = subCombo[j];
                        var index = otherSubCombo.indexOf(keyName);

                        if (index > -1) {
                            otherSubCombo.splice(index, 1);
                        }
                    }
                    if (otherSubCombo.length !== 0) {
                        return false;
                    }
                }

                return true;
            };

            KeyCombo._splitStr = function (str, deliminator) {
                var s = str;
                var d = deliminator;
                var c = '';
                var ca = [];

                for (var ci = 0; ci < s.length; ci += 1) {
                    if (ci > 0 && s[ci] === d && s[ci - 1] !== '\\') {
                        ca.push(c.trim());
                        c = '';
                        ci += 1;
                    }
                    c += s[ci];
                }
                if (c) { ca.push(c.trim()); }

                return ca;
            };

            KeyCombo.prototype._checkSubCombo = function (subCombo, startingKeyNameIndex, pressedKeyNames) {
                subCombo = subCombo.slice(0);
                pressedKeyNames = pressedKeyNames.slice(startingKeyNameIndex);

                var endIndex = startingKeyNameIndex;
                for (var i = 0; i < subCombo.length; i += 1) {

                    var keyName = subCombo[i];
                    if (keyName[0] === '\\') {
                        var escapedKeyName = keyName.slice(1);
                        if (
                          escapedKeyName === KeyCombo.comboDeliminator ||
                          escapedKeyName === KeyCombo.keyDeliminator
                        ) {
                            keyName = escapedKeyName;
                        }
                    }

                    var index = pressedKeyNames.indexOf(keyName);
                    if (index > -1) {
                        subCombo.splice(i, 1);
                        i -= 1;
                        if (index > endIndex) {
                            endIndex = index;
                        }
                        if (subCombo.length === 0) {
                            return endIndex;
                        }
                    }
                }
                return -1;
            };


            module.exports = KeyCombo;

        }, {}], 3: [function (require, module, exports) {
            (function (global) {

                var Locale = require('./locale');
                var KeyCombo = require('./key-combo');


                function Keyboard(targetWindow, targetElement, platform, userAgent) {
                    this._locale = null;
                    this._currentContext = null;
                    this._contexts = {};
                    this._listeners = [];
                    this._appliedListeners = [];
                    this._locales = {};
                    this._targetElement = null;
                    this._targetWindow = null;
                    this._targetPlatform = '';
                    this._targetUserAgent = '';
                    this._isModernBrowser = false;
                    this._targetKeyDownBinding = null;
                    this._targetKeyUpBinding = null;
                    this._targetResetBinding = null;
                    this._paused = false;

                    this.setContext('global');
                    this.watch(targetWindow, targetElement, platform, userAgent);
                }

                Keyboard.prototype.setLocale = function (localeName, localeBuilder) {
                    var locale = null;
                    if (typeof localeName === 'string') {

                        if (localeBuilder) {
                            locale = new Locale(localeName);
                            localeBuilder(locale, this._targetPlatform, this._targetUserAgent);
                        } else {
                            locale = this._locales[localeName] || null;
                        }
                    } else {
                        locale = localeName;
                        localeName = locale._localeName;
                    }

                    this._locale = locale;
                    this._locales[localeName] = locale;
                    if (locale) {
                        this._locale.pressedKeys = locale.pressedKeys;
                    }
                };

                Keyboard.prototype.getLocale = function (localName) {
                    localName || (localName = this._locale.localeName);
                    return this._locales[localName] || null;
                };

                Keyboard.prototype.bind = function (keyComboStr, pressHandler, releaseHandler, preventRepeatByDefault) {
                    if (keyComboStr === null || typeof keyComboStr === 'function') {
                        preventRepeatByDefault = releaseHandler;
                        releaseHandler = pressHandler;
                        pressHandler = keyComboStr;
                        keyComboStr = null;
                    }

                    if (
                      keyComboStr &&
                      typeof keyComboStr === 'object' &&
                      typeof keyComboStr.length === 'number'
                    ) {
                        for (var i = 0; i < keyComboStr.length; i += 1) {
                            this.bind(keyComboStr[i], pressHandler, releaseHandler);
                        }
                        return;
                    }

                    this._listeners.push({
                        keyCombo: keyComboStr ? new KeyCombo(keyComboStr) : null,
                        pressHandler: pressHandler || null,
                        releaseHandler: releaseHandler || null,
                        preventRepeat: preventRepeatByDefault || false,
                        preventRepeatByDefault: preventRepeatByDefault || false
                    });
                };
                Keyboard.prototype.addListener = Keyboard.prototype.bind;
                Keyboard.prototype.on = Keyboard.prototype.bind;

                Keyboard.prototype.unbind = function (keyComboStr, pressHandler, releaseHandler) {
                    if (keyComboStr === null || typeof keyComboStr === 'function') {
                        releaseHandler = pressHandler;
                        pressHandler = keyComboStr;
                        keyComboStr = null;
                    }

                    if (
                      keyComboStr &&
                      typeof keyComboStr === 'object' &&
                      typeof keyComboStr.length === 'number'
                    ) {
                        for (var i = 0; i < keyComboStr.length; i += 1) {
                            this.unbind(keyComboStr[i], pressHandler, releaseHandler);
                        }
                        return;
                    }

                    for (var i = 0; i < this._listeners.length; i += 1) {
                        var listener = this._listeners[i];

                        var comboMatches = !keyComboStr && !listener.keyCombo ||
                                                    listener.keyCombo.isEqual(keyComboStr);
                        var pressHandlerMatches = !pressHandler && !releaseHandler ||
                                                    !pressHandler && !listener.pressHandler ||
                                                    pressHandler === listener.pressHandler;
                        var releaseHandlerMatches = !pressHandler && !releaseHandler ||
                                                    !releaseHandler && !listener.releaseHandler ||
                                                    releaseHandler === listener.releaseHandler;

                        if (comboMatches && pressHandlerMatches && releaseHandlerMatches) {
                            this._listeners.splice(i, 1);
                            i -= 1;
                        }
                    }
                };
                Keyboard.prototype.removeListener = Keyboard.prototype.unbind;
                Keyboard.prototype.off = Keyboard.prototype.unbind;

                Keyboard.prototype.setContext = function (contextName) {
                    if (this._locale) { this.releaseAllKeys(); }

                    if (!this._contexts[contextName]) {
                        this._contexts[contextName] = [];
                    }
                    this._listeners = this._contexts[contextName];
                    this._currentContext = contextName;
                };

                Keyboard.prototype.getContext = function () {
                    return this._currentContext;
                };

                Keyboard.prototype.watch = function (targetWindow, targetElement, targetPlatform, targetUserAgent) {
                    var _this = this;

                    this.stop();

                    targetWindow && targetWindow !== null || (targetWindow = global);

                    if (typeof targetWindow.nodeType === 'number') {
                        targetUserAgent = targetPlatform;
                        targetPlatform = targetElement;
                        targetElement = targetWindow;
                        targetWindow = global;
                    }

                    var userAgent = targetWindow.navigator && targetWindow.navigator.userAgent || '';
                    var platform = targetWindow.navigator && targetWindow.navigator.platform || '';

                    targetElement && targetElement !== null || (targetElement = targetWindow.document);
                    targetPlatform && targetPlatform !== null || (targetPlatform = platform);
                    targetUserAgent && targetUserAgent !== null || (targetUserAgent = userAgent);

                    this._isModernBrowser = !!targetWindow.addEventListener;
                    this._targetKeyDownBinding = function (event) {
                        _this.pressKey(event.keyCode, event);
                    };
                    this._targetKeyUpBinding = function (event) {
                        _this.releaseKey(event.keyCode, event);
                    };
                    this._targetResetBinding = function (event) {
                        _this.releaseAllKeys(event)
                    };

                    this._bindEvent(targetElement, 'keydown', this._targetKeyDownBinding);
                    this._bindEvent(targetElement, 'keyup', this._targetKeyUpBinding);
                    this._bindEvent(targetWindow, 'focus', this._targetResetBinding);
                    this._bindEvent(targetWindow, 'blur', this._targetResetBinding);

                    this._targetElement = targetElement;
                    this._targetWindow = targetWindow;
                    this._targetPlatform = targetPlatform;
                    this._targetUserAgent = targetUserAgent;
                };

                Keyboard.prototype.stop = function () {
                    var _this = this;

                    if (!this._targetElement || !this._targetWindow) { return; }

                    this._unbindEvent(this._targetElement, 'keydown', this._targetKeyDownBinding);
                    this._unbindEvent(this._targetElement, 'keyup', this._targetKeyUpBinding);
                    this._unbindEvent(this._targetWindow, 'focus', this._targetResetBinding);
                    this._unbindEvent(this._targetWindow, 'blur', this._targetResetBinding);

                    this._targetWindow = null;
                    this._targetElement = null;
                };

                Keyboard.prototype.pressKey = function (keyCode, event) {
                    if (this._paused) { return; }
                    if (!this._locale) { throw new Error('Locale not set'); }

                    this._locale.pressKey(keyCode);
                    this._applyBindings(event);
                };

                Keyboard.prototype.releaseKey = function (keyCode, event) {
                    if (this._paused) { return; }
                    if (!this._locale) { throw new Error('Locale not set'); }

                    this._locale.releaseKey(keyCode);
                    this._clearBindings(event);
                };

                Keyboard.prototype.releaseAllKeys = function (event) {
                    if (this._paused) { return; }
                    if (!this._locale) { throw new Error('Locale not set'); }

                    this._locale.pressedKeys.length = 0;
                    this._clearBindings(event);
                };

                Keyboard.prototype.pause = function () {
                    if (this._paused) { return; }
                    if (this._locale) { this.releaseAllKeys(); }
                    this._paused = true;
                };

                Keyboard.prototype.resume = function () {
                    this._paused = false;
                };

                Keyboard.prototype.reset = function () {
                    this.releaseAllKeys();
                    this._listeners.length = 0;
                };

                Keyboard.prototype._bindEvent = function (targetElement, eventName, handler) {
                    return this._isModernBrowser ?
                      targetElement.addEventListener(eventName, handler, false) :
                      targetElement.attachEvent('on' + eventName, handler);
                };

                Keyboard.prototype._unbindEvent = function (targetElement, eventName, handler) {
                    return this._isModernBrowser ?
                      targetElement.removeEventListener(eventName, handler, false) :
                      targetElement.detachEvent('on' + eventName, handler);
                };

                Keyboard.prototype._getGroupedListeners = function () {
                    var listenerGroups = [];
                    var listenerGroupMap = [];

                    var listeners = this._listeners;
                    if (this._currentContext !== 'global') {
                        listeners = [].concat(listeners, this._contexts.global);
                    }

                    listeners.sort(function (a, b) {
                        return a.keyCombo.keyNames.length < b.keyCombo.keyNames.length;
                    }).forEach(function (l) {
                        var mapIndex = -1;
                        for (var i = 0; i < listenerGroupMap.length; i += 1) {
                            if (listenerGroupMap[i].isEqual(l.keyCombo)) {
                                mapIndex = i;
                            }
                        }
                        if (mapIndex === -1) {
                            mapIndex = listenerGroupMap.length;
                            listenerGroupMap.push(l.keyCombo);
                        }
                        if (!listenerGroups[mapIndex]) {
                            listenerGroups[mapIndex] = [];
                        }
                        listenerGroups[mapIndex].push(l);
                    });
                    return listenerGroups;
                };

                Keyboard.prototype._applyBindings = function (event) {
                    var preventRepeat = false;

                    event || (event = {});
                    event.preventRepeat = function () { preventRepeat = true; };
                    event.pressedKeys = this._locale.pressedKeys.slice(0);

                    var pressedKeys = this._locale.pressedKeys.slice(0);
                    var listenerGroups = this._getGroupedListeners();


                    for (var i = 0; i < listenerGroups.length; i += 1) {
                        var listeners = listenerGroups[i];
                        var keyCombo = listeners[0].keyCombo;

                        if (keyCombo === null || keyCombo.check(pressedKeys)) {
                            for (var j = 0; j < listeners.length; j += 1) {
                                var listener = listeners[j];

                                if (keyCombo === null) {
                                    listener = {
                                        keyCombo: new KeyCombo(pressedKeys.join('+')),
                                        pressHandler: listener.pressHandler,
                                        releaseHandler: listener.releaseHandler,
                                        preventRepeat: listener.preventRepeat,
                                        preventRepeatByDefault: listener.preventRepeatByDefault
                                    };
                                }

                                if (listener.pressHandler && !listener.preventRepeat) {
                                    listener.pressHandler.call(this, event);
                                    if (preventRepeat) {
                                        listener.preventRepeat = preventRepeat;
                                        preventRepeat = false;
                                    }
                                }

                                if (listener.releaseHandler && this._appliedListeners.indexOf(listener) === -1) {
                                    this._appliedListeners.push(listener);
                                }
                            }

                            if (keyCombo) {
                                for (var j = 0; j < keyCombo.keyNames.length; j += 1) {
                                    var index = pressedKeys.indexOf(keyCombo.keyNames[j]);
                                    if (index !== -1) {
                                        pressedKeys.splice(index, 1);
                                        j -= 1;
                                    }
                                }
                            }
                        }
                    }
                };

                Keyboard.prototype._clearBindings = function (event) {
                    event || (event = {});

                    for (var i = 0; i < this._appliedListeners.length; i += 1) {
                        var listener = this._appliedListeners[i];
                        var keyCombo = listener.keyCombo;
                        if (keyCombo === null || !keyCombo.check(this._locale.pressedKeys)) {
                            listener.preventRepeat = listener.preventRepeatByDefault;
                            listener.releaseHandler.call(this, event);
                            this._appliedListeners.splice(i, 1);
                            i -= 1;
                        }
                    }
                };

                module.exports = Keyboard;

            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
            //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9rZXlib2FyZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIlxudmFyIExvY2FsZSA9IHJlcXVpcmUoJy4vbG9jYWxlJyk7XG52YXIgS2V5Q29tYm8gPSByZXF1aXJlKCcuL2tleS1jb21ibycpO1xuXG5cbmZ1bmN0aW9uIEtleWJvYXJkKHRhcmdldFdpbmRvdywgdGFyZ2V0RWxlbWVudCwgcGxhdGZvcm0sIHVzZXJBZ2VudCkge1xuICB0aGlzLl9sb2NhbGUgICAgICAgICAgICAgICA9IG51bGw7XG4gIHRoaXMuX2N1cnJlbnRDb250ZXh0ICAgICAgID0gbnVsbDtcbiAgdGhpcy5fY29udGV4dHMgICAgICAgICAgICAgPSB7fTtcbiAgdGhpcy5fbGlzdGVuZXJzICAgICAgICAgICAgPSBbXTtcbiAgdGhpcy5fYXBwbGllZExpc3RlbmVycyAgICAgPSBbXTtcbiAgdGhpcy5fbG9jYWxlcyAgICAgICAgICAgICAgPSB7fTtcbiAgdGhpcy5fdGFyZ2V0RWxlbWVudCAgICAgICAgPSBudWxsO1xuICB0aGlzLl90YXJnZXRXaW5kb3cgICAgICAgICA9IG51bGw7XG4gIHRoaXMuX3RhcmdldFBsYXRmb3JtICAgICAgID0gJyc7XG4gIHRoaXMuX3RhcmdldFVzZXJBZ2VudCAgICAgID0gJyc7XG4gIHRoaXMuX2lzTW9kZXJuQnJvd3NlciAgICAgID0gZmFsc2U7XG4gIHRoaXMuX3RhcmdldEtleURvd25CaW5kaW5nID0gbnVsbDtcbiAgdGhpcy5fdGFyZ2V0S2V5VXBCaW5kaW5nICAgPSBudWxsO1xuICB0aGlzLl90YXJnZXRSZXNldEJpbmRpbmcgICA9IG51bGw7XG4gIHRoaXMuX3BhdXNlZCAgICAgICAgICAgICAgID0gZmFsc2U7XG5cbiAgdGhpcy5zZXRDb250ZXh0KCdnbG9iYWwnKTtcbiAgdGhpcy53YXRjaCh0YXJnZXRXaW5kb3csIHRhcmdldEVsZW1lbnQsIHBsYXRmb3JtLCB1c2VyQWdlbnQpO1xufVxuXG5LZXlib2FyZC5wcm90b3R5cGUuc2V0TG9jYWxlID0gZnVuY3Rpb24obG9jYWxlTmFtZSwgbG9jYWxlQnVpbGRlcikge1xuICB2YXIgbG9jYWxlID0gbnVsbDtcbiAgaWYgKHR5cGVvZiBsb2NhbGVOYW1lID09PSAnc3RyaW5nJykge1xuXG4gICAgaWYgKGxvY2FsZUJ1aWxkZXIpIHtcbiAgICAgIGxvY2FsZSA9IG5ldyBMb2NhbGUobG9jYWxlTmFtZSk7XG4gICAgICBsb2NhbGVCdWlsZGVyKGxvY2FsZSwgdGhpcy5fdGFyZ2V0UGxhdGZvcm0sIHRoaXMuX3RhcmdldFVzZXJBZ2VudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2FsZSA9IHRoaXMuX2xvY2FsZXNbbG9jYWxlTmFtZV0gfHwgbnVsbDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxlICAgICA9IGxvY2FsZU5hbWU7XG4gICAgbG9jYWxlTmFtZSA9IGxvY2FsZS5fbG9jYWxlTmFtZTtcbiAgfVxuXG4gIHRoaXMuX2xvY2FsZSAgICAgICAgICAgICAgPSBsb2NhbGU7XG4gIHRoaXMuX2xvY2FsZXNbbG9jYWxlTmFtZV0gPSBsb2NhbGU7XG4gIGlmIChsb2NhbGUpIHtcbiAgICB0aGlzLl9sb2NhbGUucHJlc3NlZEtleXMgPSBsb2NhbGUucHJlc3NlZEtleXM7XG4gIH1cbn07XG5cbktleWJvYXJkLnByb3RvdHlwZS5nZXRMb2NhbGUgPSBmdW5jdGlvbihsb2NhbE5hbWUpIHtcbiAgbG9jYWxOYW1lIHx8IChsb2NhbE5hbWUgPSB0aGlzLl9sb2NhbGUubG9jYWxlTmFtZSk7XG4gIHJldHVybiB0aGlzLl9sb2NhbGVzW2xvY2FsTmFtZV0gfHwgbnVsbDtcbn07XG5cbktleWJvYXJkLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oa2V5Q29tYm9TdHIsIHByZXNzSGFuZGxlciwgcmVsZWFzZUhhbmRsZXIsIHByZXZlbnRSZXBlYXRCeURlZmF1bHQpIHtcbiAgaWYgKGtleUNvbWJvU3RyID09PSBudWxsIHx8IHR5cGVvZiBrZXlDb21ib1N0ciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHByZXZlbnRSZXBlYXRCeURlZmF1bHQgPSByZWxlYXNlSGFuZGxlcjtcbiAgICByZWxlYXNlSGFuZGxlciAgICAgICAgID0gcHJlc3NIYW5kbGVyO1xuICAgIHByZXNzSGFuZGxlciAgICAgICAgICAgPSBrZXlDb21ib1N0cjtcbiAgICBrZXlDb21ib1N0ciAgICAgICAgICAgID0gbnVsbDtcbiAgfVxuXG4gIGlmIChcbiAgICBrZXlDb21ib1N0ciAmJlxuICAgIHR5cGVvZiBrZXlDb21ib1N0ciA9PT0gJ29iamVjdCcgJiZcbiAgICB0eXBlb2Yga2V5Q29tYm9TdHIubGVuZ3RoID09PSAnbnVtYmVyJ1xuICApIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleUNvbWJvU3RyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICB0aGlzLmJpbmQoa2V5Q29tYm9TdHJbaV0sIHByZXNzSGFuZGxlciwgcmVsZWFzZUhhbmRsZXIpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLl9saXN0ZW5lcnMucHVzaCh7XG4gICAga2V5Q29tYm8gICAgICAgICAgICAgICA6IGtleUNvbWJvU3RyID8gbmV3IEtleUNvbWJvKGtleUNvbWJvU3RyKSA6IG51bGwsXG4gICAgcHJlc3NIYW5kbGVyICAgICAgICAgICA6IHByZXNzSGFuZGxlciAgICAgICAgICAgfHwgbnVsbCxcbiAgICByZWxlYXNlSGFuZGxlciAgICAgICAgIDogcmVsZWFzZUhhbmRsZXIgICAgICAgICB8fCBudWxsLFxuICAgIHByZXZlbnRSZXBlYXQgICAgICAgICAgOiBwcmV2ZW50UmVwZWF0QnlEZWZhdWx0IHx8IGZhbHNlLFxuICAgIHByZXZlbnRSZXBlYXRCeURlZmF1bHQgOiBwcmV2ZW50UmVwZWF0QnlEZWZhdWx0IHx8IGZhbHNlXG4gIH0pO1xufTtcbktleWJvYXJkLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IEtleWJvYXJkLnByb3RvdHlwZS5iaW5kO1xuS2V5Ym9hcmQucHJvdG90eXBlLm9uICAgICAgICAgID0gS2V5Ym9hcmQucHJvdG90eXBlLmJpbmQ7XG5cbktleWJvYXJkLnByb3RvdHlwZS51bmJpbmQgPSBmdW5jdGlvbihrZXlDb21ib1N0ciwgcHJlc3NIYW5kbGVyLCByZWxlYXNlSGFuZGxlcikge1xuICBpZiAoa2V5Q29tYm9TdHIgPT09IG51bGwgfHwgdHlwZW9mIGtleUNvbWJvU3RyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmVsZWFzZUhhbmRsZXIgPSBwcmVzc0hhbmRsZXI7XG4gICAgcHJlc3NIYW5kbGVyICAgPSBrZXlDb21ib1N0cjtcbiAgICBrZXlDb21ib1N0ciA9IG51bGw7XG4gIH1cblxuICBpZiAoXG4gICAga2V5Q29tYm9TdHIgJiZcbiAgICB0eXBlb2Yga2V5Q29tYm9TdHIgPT09ICdvYmplY3QnICYmXG4gICAgdHlwZW9mIGtleUNvbWJvU3RyLmxlbmd0aCA9PT0gJ251bWJlcidcbiAgKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlDb21ib1N0ci5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgdGhpcy51bmJpbmQoa2V5Q29tYm9TdHJbaV0sIHByZXNzSGFuZGxlciwgcmVsZWFzZUhhbmRsZXIpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2xpc3RlbmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIHZhciBsaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVyc1tpXTtcblxuICAgIHZhciBjb21ib01hdGNoZXMgICAgICAgICAgPSAha2V5Q29tYm9TdHIgJiYgIWxpc3RlbmVyLmtleUNvbWJvIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmtleUNvbWJvLmlzRXF1YWwoa2V5Q29tYm9TdHIpO1xuICAgIHZhciBwcmVzc0hhbmRsZXJNYXRjaGVzICAgPSAhcHJlc3NIYW5kbGVyICYmICFyZWxlYXNlSGFuZGxlciB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhcHJlc3NIYW5kbGVyICYmICFsaXN0ZW5lci5wcmVzc0hhbmRsZXIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlc3NIYW5kbGVyID09PSBsaXN0ZW5lci5wcmVzc0hhbmRsZXI7XG4gICAgdmFyIHJlbGVhc2VIYW5kbGVyTWF0Y2hlcyA9ICFwcmVzc0hhbmRsZXIgJiYgIXJlbGVhc2VIYW5kbGVyIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFyZWxlYXNlSGFuZGxlciAmJiAhbGlzdGVuZXIucmVsZWFzZUhhbmRsZXIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsZWFzZUhhbmRsZXIgPT09IGxpc3RlbmVyLnJlbGVhc2VIYW5kbGVyO1xuXG4gICAgaWYgKGNvbWJvTWF0Y2hlcyAmJiBwcmVzc0hhbmRsZXJNYXRjaGVzICYmIHJlbGVhc2VIYW5kbGVyTWF0Y2hlcykge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShpLCAxKTtcbiAgICAgIGkgLT0gMTtcbiAgICB9XG4gIH1cbn07XG5LZXlib2FyZC5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBLZXlib2FyZC5wcm90b3R5cGUudW5iaW5kO1xuS2V5Ym9hcmQucHJvdG90eXBlLm9mZiAgICAgICAgICAgID0gS2V5Ym9hcmQucHJvdG90eXBlLnVuYmluZDtcblxuS2V5Ym9hcmQucHJvdG90eXBlLnNldENvbnRleHQgPSBmdW5jdGlvbihjb250ZXh0TmFtZSkge1xuICBpZih0aGlzLl9sb2NhbGUpIHsgdGhpcy5yZWxlYXNlQWxsS2V5cygpOyB9XG5cbiAgaWYgKCF0aGlzLl9jb250ZXh0c1tjb250ZXh0TmFtZV0pIHtcbiAgICB0aGlzLl9jb250ZXh0c1tjb250ZXh0TmFtZV0gPSBbXTtcbiAgfVxuICB0aGlzLl9saXN0ZW5lcnMgICAgICA9IHRoaXMuX2NvbnRleHRzW2NvbnRleHROYW1lXTtcbiAgdGhpcy5fY3VycmVudENvbnRleHQgPSBjb250ZXh0TmFtZTtcbn07XG5cbktleWJvYXJkLnByb3RvdHlwZS5nZXRDb250ZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9jdXJyZW50Q29udGV4dDtcbn07XG5cbktleWJvYXJkLnByb3RvdHlwZS53YXRjaCA9IGZ1bmN0aW9uKHRhcmdldFdpbmRvdywgdGFyZ2V0RWxlbWVudCwgdGFyZ2V0UGxhdGZvcm0sIHRhcmdldFVzZXJBZ2VudCkge1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIHRoaXMuc3RvcCgpO1xuXG4gIHRhcmdldFdpbmRvdyAmJiB0YXJnZXRXaW5kb3cgIT09IG51bGwgfHwgKHRhcmdldFdpbmRvdyA9IGdsb2JhbCk7XG5cbiAgaWYgKHR5cGVvZiB0YXJnZXRXaW5kb3cubm9kZVR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgdGFyZ2V0VXNlckFnZW50ID0gdGFyZ2V0UGxhdGZvcm07XG4gICAgdGFyZ2V0UGxhdGZvcm0gID0gdGFyZ2V0RWxlbWVudDtcbiAgICB0YXJnZXRFbGVtZW50ICAgPSB0YXJnZXRXaW5kb3c7XG4gICAgdGFyZ2V0V2luZG93ICAgID0gZ2xvYmFsO1xuICB9XG5cbiAgdmFyIHVzZXJBZ2VudCA9IHRhcmdldFdpbmRvdy5uYXZpZ2F0b3IgJiYgdGFyZ2V0V2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQgfHwgJyc7XG4gIHZhciBwbGF0Zm9ybSAgPSB0YXJnZXRXaW5kb3cubmF2aWdhdG9yICYmIHRhcmdldFdpbmRvdy5uYXZpZ2F0b3IucGxhdGZvcm0gIHx8ICcnO1xuXG4gIHRhcmdldEVsZW1lbnQgICAmJiB0YXJnZXRFbGVtZW50ICAgIT09IG51bGwgfHwgKHRhcmdldEVsZW1lbnQgICA9IHRhcmdldFdpbmRvdy5kb2N1bWVudCk7XG4gIHRhcmdldFBsYXRmb3JtICAmJiB0YXJnZXRQbGF0Zm9ybSAgIT09IG51bGwgfHwgKHRhcmdldFBsYXRmb3JtICA9IHBsYXRmb3JtKTtcbiAgdGFyZ2V0VXNlckFnZW50ICYmIHRhcmdldFVzZXJBZ2VudCAhPT0gbnVsbCB8fCAodGFyZ2V0VXNlckFnZW50ID0gdXNlckFnZW50KTtcblxuICB0aGlzLl9pc01vZGVybkJyb3dzZXIgPSAhIXRhcmdldFdpbmRvdy5hZGRFdmVudExpc3RlbmVyO1xuICB0aGlzLl90YXJnZXRLZXlEb3duQmluZGluZyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgX3RoaXMucHJlc3NLZXkoZXZlbnQua2V5Q29kZSwgZXZlbnQpO1xuICB9O1xuICB0aGlzLl90YXJnZXRLZXlVcEJpbmRpbmcgPSBmdW5jdGlvbihldmVudCkge1xuICAgIF90aGlzLnJlbGVhc2VLZXkoZXZlbnQua2V5Q29kZSwgZXZlbnQpO1xuICB9O1xuICB0aGlzLl90YXJnZXRSZXNldEJpbmRpbmcgPSBmdW5jdGlvbihldmVudCkge1xuICAgIF90aGlzLnJlbGVhc2VBbGxLZXlzKGV2ZW50KVxuICB9O1xuXG4gIHRoaXMuX2JpbmRFdmVudCh0YXJnZXRFbGVtZW50LCAna2V5ZG93bicsIHRoaXMuX3RhcmdldEtleURvd25CaW5kaW5nKTtcbiAgdGhpcy5fYmluZEV2ZW50KHRhcmdldEVsZW1lbnQsICdrZXl1cCcsICAgdGhpcy5fdGFyZ2V0S2V5VXBCaW5kaW5nKTtcbiAgdGhpcy5fYmluZEV2ZW50KHRhcmdldFdpbmRvdywgICdmb2N1cycsICAgdGhpcy5fdGFyZ2V0UmVzZXRCaW5kaW5nKTtcbiAgdGhpcy5fYmluZEV2ZW50KHRhcmdldFdpbmRvdywgICdibHVyJywgICAgdGhpcy5fdGFyZ2V0UmVzZXRCaW5kaW5nKTtcblxuICB0aGlzLl90YXJnZXRFbGVtZW50ICAgPSB0YXJnZXRFbGVtZW50O1xuICB0aGlzLl90YXJnZXRXaW5kb3cgICAgPSB0YXJnZXRXaW5kb3c7XG4gIHRoaXMuX3RhcmdldFBsYXRmb3JtICA9IHRhcmdldFBsYXRmb3JtO1xuICB0aGlzLl90YXJnZXRVc2VyQWdlbnQgPSB0YXJnZXRVc2VyQWdlbnQ7XG59O1xuXG5LZXlib2FyZC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIGlmICghdGhpcy5fdGFyZ2V0RWxlbWVudCB8fCAhdGhpcy5fdGFyZ2V0V2luZG93KSB7IHJldHVybjsgfVxuXG4gIHRoaXMuX3VuYmluZEV2ZW50KHRoaXMuX3RhcmdldEVsZW1lbnQsICdrZXlkb3duJywgdGhpcy5fdGFyZ2V0S2V5RG93bkJpbmRpbmcpO1xuICB0aGlzLl91bmJpbmRFdmVudCh0aGlzLl90YXJnZXRFbGVtZW50LCAna2V5dXAnLCAgIHRoaXMuX3RhcmdldEtleVVwQmluZGluZyk7XG4gIHRoaXMuX3VuYmluZEV2ZW50KHRoaXMuX3RhcmdldFdpbmRvdywgICdmb2N1cycsICAgdGhpcy5fdGFyZ2V0UmVzZXRCaW5kaW5nKTtcbiAgdGhpcy5fdW5iaW5kRXZlbnQodGhpcy5fdGFyZ2V0V2luZG93LCAgJ2JsdXInLCAgICB0aGlzLl90YXJnZXRSZXNldEJpbmRpbmcpO1xuXG4gIHRoaXMuX3RhcmdldFdpbmRvdyAgPSBudWxsO1xuICB0aGlzLl90YXJnZXRFbGVtZW50ID0gbnVsbDtcbn07XG5cbktleWJvYXJkLnByb3RvdHlwZS5wcmVzc0tleSA9IGZ1bmN0aW9uKGtleUNvZGUsIGV2ZW50KSB7XG4gIGlmICh0aGlzLl9wYXVzZWQpIHsgcmV0dXJuOyB9XG4gIGlmICghdGhpcy5fbG9jYWxlKSB7IHRocm93IG5ldyBFcnJvcignTG9jYWxlIG5vdCBzZXQnKTsgfVxuXG4gIHRoaXMuX2xvY2FsZS5wcmVzc0tleShrZXlDb2RlKTtcbiAgdGhpcy5fYXBwbHlCaW5kaW5ncyhldmVudCk7XG59O1xuXG5LZXlib2FyZC5wcm90b3R5cGUucmVsZWFzZUtleSA9IGZ1bmN0aW9uKGtleUNvZGUsIGV2ZW50KSB7XG4gIGlmICh0aGlzLl9wYXVzZWQpIHsgcmV0dXJuOyB9XG4gIGlmICghdGhpcy5fbG9jYWxlKSB7IHRocm93IG5ldyBFcnJvcignTG9jYWxlIG5vdCBzZXQnKTsgfVxuXG4gIHRoaXMuX2xvY2FsZS5yZWxlYXNlS2V5KGtleUNvZGUpO1xuICB0aGlzLl9jbGVhckJpbmRpbmdzKGV2ZW50KTtcbn07XG5cbktleWJvYXJkLnByb3RvdHlwZS5yZWxlYXNlQWxsS2V5cyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGlmICh0aGlzLl9wYXVzZWQpIHsgcmV0dXJuOyB9XG4gIGlmICghdGhpcy5fbG9jYWxlKSB7IHRocm93IG5ldyBFcnJvcignTG9jYWxlIG5vdCBzZXQnKTsgfVxuXG4gIHRoaXMuX2xvY2FsZS5wcmVzc2VkS2V5cy5sZW5ndGggPSAwO1xuICB0aGlzLl9jbGVhckJpbmRpbmdzKGV2ZW50KTtcbn07XG5cbktleWJvYXJkLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5fcGF1c2VkKSB7IHJldHVybjsgfVxuICBpZiAodGhpcy5fbG9jYWxlKSB7IHRoaXMucmVsZWFzZUFsbEtleXMoKTsgfVxuICB0aGlzLl9wYXVzZWQgPSB0cnVlO1xufTtcblxuS2V5Ym9hcmQucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9wYXVzZWQgPSBmYWxzZTtcbn07XG5cbktleWJvYXJkLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnJlbGVhc2VBbGxLZXlzKCk7XG4gIHRoaXMuX2xpc3RlbmVycy5sZW5ndGggPSAwO1xufTtcblxuS2V5Ym9hcmQucHJvdG90eXBlLl9iaW5kRXZlbnQgPSBmdW5jdGlvbih0YXJnZXRFbGVtZW50LCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgcmV0dXJuIHRoaXMuX2lzTW9kZXJuQnJvd3NlciA/XG4gICAgdGFyZ2V0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgZmFsc2UpIDpcbiAgICB0YXJnZXRFbGVtZW50LmF0dGFjaEV2ZW50KCdvbicgKyBldmVudE5hbWUsIGhhbmRsZXIpO1xufTtcblxuS2V5Ym9hcmQucHJvdG90eXBlLl91bmJpbmRFdmVudCA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQsIGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICByZXR1cm4gdGhpcy5faXNNb2Rlcm5Ccm93c2VyID9cbiAgICB0YXJnZXRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBmYWxzZSkgOlxuICAgIHRhcmdldEVsZW1lbnQuZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50TmFtZSwgaGFuZGxlcik7XG59O1xuXG5LZXlib2FyZC5wcm90b3R5cGUuX2dldEdyb3VwZWRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGxpc3RlbmVyR3JvdXBzICAgPSBbXTtcbiAgdmFyIGxpc3RlbmVyR3JvdXBNYXAgPSBbXTtcblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xuICBpZiAodGhpcy5fY3VycmVudENvbnRleHQgIT09ICdnbG9iYWwnKSB7XG4gICAgbGlzdGVuZXJzID0gW10uY29uY2F0KGxpc3RlbmVycywgdGhpcy5fY29udGV4dHMuZ2xvYmFsKTtcbiAgfVxuXG4gIGxpc3RlbmVycy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYS5rZXlDb21iby5rZXlOYW1lcy5sZW5ndGggPCBiLmtleUNvbWJvLmtleU5hbWVzLmxlbmd0aDtcbiAgfSkuZm9yRWFjaChmdW5jdGlvbihsKSB7XG4gICAgdmFyIG1hcEluZGV4ID0gLTE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lckdyb3VwTWFwLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAobGlzdGVuZXJHcm91cE1hcFtpXS5pc0VxdWFsKGwua2V5Q29tYm8pKSB7XG4gICAgICAgIG1hcEluZGV4ID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1hcEluZGV4ID09PSAtMSkge1xuICAgICAgbWFwSW5kZXggPSBsaXN0ZW5lckdyb3VwTWFwLmxlbmd0aDtcbiAgICAgIGxpc3RlbmVyR3JvdXBNYXAucHVzaChsLmtleUNvbWJvKTtcbiAgICB9XG4gICAgaWYgKCFsaXN0ZW5lckdyb3Vwc1ttYXBJbmRleF0pIHtcbiAgICAgIGxpc3RlbmVyR3JvdXBzW21hcEluZGV4XSA9IFtdO1xuICAgIH1cbiAgICBsaXN0ZW5lckdyb3Vwc1ttYXBJbmRleF0ucHVzaChsKTtcbiAgfSk7XG4gIHJldHVybiBsaXN0ZW5lckdyb3Vwcztcbn07XG5cbktleWJvYXJkLnByb3RvdHlwZS5fYXBwbHlCaW5kaW5ncyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIHZhciBwcmV2ZW50UmVwZWF0ID0gZmFsc2U7XG5cbiAgZXZlbnQgfHwgKGV2ZW50ID0ge30pO1xuICBldmVudC5wcmV2ZW50UmVwZWF0ID0gZnVuY3Rpb24oKSB7IHByZXZlbnRSZXBlYXQgPSB0cnVlOyB9O1xuICBldmVudC5wcmVzc2VkS2V5cyAgID0gdGhpcy5fbG9jYWxlLnByZXNzZWRLZXlzLnNsaWNlKDApO1xuXG4gIHZhciBwcmVzc2VkS2V5cyAgICA9IHRoaXMuX2xvY2FsZS5wcmVzc2VkS2V5cy5zbGljZSgwKTtcbiAgdmFyIGxpc3RlbmVyR3JvdXBzID0gdGhpcy5fZ2V0R3JvdXBlZExpc3RlbmVycygpO1xuXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lckdyb3Vwcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIHZhciBsaXN0ZW5lcnMgPSBsaXN0ZW5lckdyb3Vwc1tpXTtcbiAgICB2YXIga2V5Q29tYm8gID0gbGlzdGVuZXJzWzBdLmtleUNvbWJvO1xuXG4gICAgaWYgKGtleUNvbWJvID09PSBudWxsIHx8IGtleUNvbWJvLmNoZWNrKHByZXNzZWRLZXlzKSkge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsaXN0ZW5lcnMubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gbGlzdGVuZXJzW2pdO1xuXG4gICAgICAgIGlmIChrZXlDb21ibyA9PT0gbnVsbCkge1xuICAgICAgICAgIGxpc3RlbmVyID0ge1xuICAgICAgICAgICAga2V5Q29tYm8gICAgICAgICAgICAgICA6IG5ldyBLZXlDb21ibyhwcmVzc2VkS2V5cy5qb2luKCcrJykpLFxuICAgICAgICAgICAgcHJlc3NIYW5kbGVyICAgICAgICAgICA6IGxpc3RlbmVyLnByZXNzSGFuZGxlcixcbiAgICAgICAgICAgIHJlbGVhc2VIYW5kbGVyICAgICAgICAgOiBsaXN0ZW5lci5yZWxlYXNlSGFuZGxlcixcbiAgICAgICAgICAgIHByZXZlbnRSZXBlYXQgICAgICAgICAgOiBsaXN0ZW5lci5wcmV2ZW50UmVwZWF0LFxuICAgICAgICAgICAgcHJldmVudFJlcGVhdEJ5RGVmYXVsdCA6IGxpc3RlbmVyLnByZXZlbnRSZXBlYXRCeURlZmF1bHRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3RlbmVyLnByZXNzSGFuZGxlciAmJiAhbGlzdGVuZXIucHJldmVudFJlcGVhdCkge1xuICAgICAgICAgIGxpc3RlbmVyLnByZXNzSGFuZGxlci5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgICAgICBpZiAocHJldmVudFJlcGVhdCkge1xuICAgICAgICAgICAgbGlzdGVuZXIucHJldmVudFJlcGVhdCA9IHByZXZlbnRSZXBlYXQ7XG4gICAgICAgICAgICBwcmV2ZW50UmVwZWF0ICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3RlbmVyLnJlbGVhc2VIYW5kbGVyICYmIHRoaXMuX2FwcGxpZWRMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgICAgICAgdGhpcy5fYXBwbGllZExpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoa2V5Q29tYm8pIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBrZXlDb21iby5rZXlOYW1lcy5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgIHZhciBpbmRleCA9IHByZXNzZWRLZXlzLmluZGV4T2Yoa2V5Q29tYm8ua2V5TmFtZXNbal0pO1xuICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHByZXNzZWRLZXlzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICBqIC09IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5LZXlib2FyZC5wcm90b3R5cGUuX2NsZWFyQmluZGluZ3MgPSBmdW5jdGlvbihldmVudCkge1xuICBldmVudCB8fCAoZXZlbnQgPSB7fSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9hcHBsaWVkTGlzdGVuZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgdmFyIGxpc3RlbmVyID0gdGhpcy5fYXBwbGllZExpc3RlbmVyc1tpXTtcbiAgICB2YXIga2V5Q29tYm8gPSBsaXN0ZW5lci5rZXlDb21ibztcbiAgICBpZiAoa2V5Q29tYm8gPT09IG51bGwgfHwgIWtleUNvbWJvLmNoZWNrKHRoaXMuX2xvY2FsZS5wcmVzc2VkS2V5cykpIHtcbiAgICAgIGxpc3RlbmVyLnByZXZlbnRSZXBlYXQgPSBsaXN0ZW5lci5wcmV2ZW50UmVwZWF0QnlEZWZhdWx0O1xuICAgICAgbGlzdGVuZXIucmVsZWFzZUhhbmRsZXIuY2FsbCh0aGlzLCBldmVudCk7XG4gICAgICB0aGlzLl9hcHBsaWVkTGlzdGVuZXJzLnNwbGljZShpLCAxKTtcbiAgICAgIGkgLT0gMTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5Ym9hcmQ7XG4iXX0=
        }, { "./key-combo": 2, "./locale": 4 }], 4: [function (require, module, exports) {

            var KeyCombo = require('./key-combo');


            function Locale(name) {
                this.localeName = name;
                this.pressedKeys = [];
                this._appliedMacros = [];
                this._keyMap = {};
                this._killKeyCodes = [];
                this._macros = [];
            }

            Locale.prototype.bindKeyCode = function (keyCode, keyNames) {
                if (typeof keyNames === 'string') {
                    keyNames = [keyNames];
                }

                this._keyMap[keyCode] = keyNames;
            };

            Locale.prototype.bindMacro = function (keyComboStr, keyNames) {
                if (typeof keyNames === 'string') {
                    keyNames = [keyNames];
                }

                var handler = null;
                if (typeof keyNames === 'function') {
                    handler = keyNames;
                    keyNames = null;
                }

                var macro = {
                    keyCombo: new KeyCombo(keyComboStr),
                    keyNames: keyNames,
                    handler: handler
                };

                this._macros.push(macro);
            };

            Locale.prototype.getKeyCodes = function (keyName) {
                var keyCodes = [];
                for (var keyCode in this._keyMap) {
                    var index = this._keyMap[keyCode].indexOf(keyName);
                    if (index > -1) { keyCodes.push(keyCode | 0); }
                }
                return keyCodes;
            };

            Locale.prototype.getKeyNames = function (keyCode) {
                return this._keyMap[keyCode] || [];
            };

            Locale.prototype.setKillKey = function (keyCode) {
                if (typeof keyCode === 'string') {
                    var keyCodes = this.getKeyCodes(keyCode);
                    for (var i = 0; i < keyCodes.length; i += 1) {
                        this.setKillKey(keyCodes[i]);
                    }
                    return;
                }

                this._killKeyCodes.push(keyCode);
            };

            Locale.prototype.pressKey = function (keyCode) {
                if (typeof keyCode === 'string') {
                    var keyCodes = this.getKeyCodes(keyCode);
                    for (var i = 0; i < keyCodes.length; i += 1) {
                        this.pressKey(keyCodes[i]);
                    }
                    return;
                }

                var keyNames = this.getKeyNames(keyCode);
                for (var i = 0; i < keyNames.length; i += 1) {
                    if (this.pressedKeys.indexOf(keyNames[i]) === -1) {
                        this.pressedKeys.push(keyNames[i]);
                    }
                }

                this._applyMacros();
            };

            Locale.prototype.releaseKey = function (keyCode) {
                if (typeof keyCode === 'string') {
                    var keyCodes = this.getKeyCodes(keyCode);
                    for (var i = 0; i < keyCodes.length; i += 1) {
                        this.releaseKey(keyCodes[i]);
                    }
                }

                else {
                    var keyNames = this.getKeyNames(keyCode);
                    var killKeyCodeIndex = this._killKeyCodes.indexOf(keyCode);

                    if (killKeyCodeIndex > -1) {
                        this.pressedKeys.length = 0;
                    } else {
                        for (var i = 0; i < keyNames.length; i += 1) {
                            var index = this.pressedKeys.indexOf(keyNames[i]);
                            if (index > -1) {
                                this.pressedKeys.splice(index, 1);
                            }
                        }
                    }

                    this._clearMacros();
                }
            };

            Locale.prototype._applyMacros = function () {
                var macros = this._macros.slice(0);
                for (var i = 0; i < macros.length; i += 1) {
                    var macro = macros[i];
                    if (macro.keyCombo.check(this.pressedKeys)) {
                        if (macro.handler) {
                            macro.keyNames = macro.handler(this.pressedKeys);
                        }
                        for (var j = 0; j < macro.keyNames.length; j += 1) {
                            if (this.pressedKeys.indexOf(macro.keyNames[j]) === -1) {
                                this.pressedKeys.push(macro.keyNames[j]);
                            }
                        }
                        this._appliedMacros.push(macro);
                    }
                }
            };

            Locale.prototype._clearMacros = function () {
                for (var i = 0; i < this._appliedMacros.length; i += 1) {
                    var macro = this._appliedMacros[i];
                    if (!macro.keyCombo.check(this.pressedKeys)) {
                        for (var j = 0; j < macro.keyNames.length; j += 1) {
                            var index = this.pressedKeys.indexOf(macro.keyNames[j]);
                            if (index > -1) {
                                this.pressedKeys.splice(index, 1);
                            }
                        }
                        if (macro.handler) {
                            macro.keyNames = null;
                        }
                        this._appliedMacros.splice(i, 1);
                        i -= 1;
                    }
                }
            };


            module.exports = Locale;

        }, { "./key-combo": 2 }], 5: [function (require, module, exports) {

            module.exports = function (locale, platform, userAgent) {

                // general
                locale.bindKeyCode(3, ['cancel']);
                locale.bindKeyCode(8, ['backspace']);
                locale.bindKeyCode(9, ['tab']);
                locale.bindKeyCode(12, ['clear']);
                locale.bindKeyCode(13, ['enter']);
                locale.bindKeyCode(16, ['shift']);
                locale.bindKeyCode(17, ['ctrl']);
                locale.bindKeyCode(18, ['alt', 'menu']);
                locale.bindKeyCode(19, ['pause', 'break']);
                locale.bindKeyCode(20, ['capslock']);
                locale.bindKeyCode(27, ['escape', 'esc']);
                locale.bindKeyCode(32, ['space', 'spacebar']);
                locale.bindKeyCode(33, ['pageup']);
                locale.bindKeyCode(34, ['pagedown']);
                locale.bindKeyCode(35, ['end']);
                locale.bindKeyCode(36, ['home']);
                locale.bindKeyCode(37, ['left']);
                locale.bindKeyCode(38, ['up']);
                locale.bindKeyCode(39, ['right']);
                locale.bindKeyCode(40, ['down']);
                locale.bindKeyCode(41, ['select']);
                locale.bindKeyCode(42, ['printscreen']);
                locale.bindKeyCode(43, ['execute']);
                locale.bindKeyCode(44, ['snapshot']);
                locale.bindKeyCode(45, ['insert', 'ins']);
                locale.bindKeyCode(46, ['delete', 'del']);
                locale.bindKeyCode(47, ['help']);
                locale.bindKeyCode(145, ['scrolllock', 'scroll']);
                locale.bindKeyCode(187, ['equal', 'equalsign', '=']);
                locale.bindKeyCode(188, ['comma', ',']);
                locale.bindKeyCode(190, ['period', '.']);
                locale.bindKeyCode(191, ['slash', 'forwardslash', '/']);
                locale.bindKeyCode(192, ['graveaccent', '`']);
                locale.bindKeyCode(219, ['openbracket', '[']);
                locale.bindKeyCode(220, ['backslash', '\\']);
                locale.bindKeyCode(221, ['closebracket', ']']);
                locale.bindKeyCode(222, ['apostrophe', '\'']);

                // 0-9
                locale.bindKeyCode(48, ['zero', '0']);
                locale.bindKeyCode(49, ['one', '1']);
                locale.bindKeyCode(50, ['two', '2']);
                locale.bindKeyCode(51, ['three', '3']);
                locale.bindKeyCode(52, ['four', '4']);
                locale.bindKeyCode(53, ['five', '5']);
                locale.bindKeyCode(54, ['six', '6']);
                locale.bindKeyCode(55, ['seven', '7']);
                locale.bindKeyCode(56, ['eight', '8']);
                locale.bindKeyCode(57, ['nine', '9']);

                // numpad
                locale.bindKeyCode(96, ['numzero', 'num0']);
                locale.bindKeyCode(97, ['numone', 'num1']);
                locale.bindKeyCode(98, ['numtwo', 'num2']);
                locale.bindKeyCode(99, ['numthree', 'num3']);
                locale.bindKeyCode(100, ['numfour', 'num4']);
                locale.bindKeyCode(101, ['numfive', 'num5']);
                locale.bindKeyCode(102, ['numsix', 'num6']);
                locale.bindKeyCode(103, ['numseven', 'num7']);
                locale.bindKeyCode(104, ['numeight', 'num8']);
                locale.bindKeyCode(105, ['numnine', 'num9']);
                locale.bindKeyCode(106, ['nummultiply', 'num*']);
                locale.bindKeyCode(107, ['numadd', 'num+']);
                locale.bindKeyCode(108, ['numenter']);
                locale.bindKeyCode(109, ['numsubtract', 'num-']);
                locale.bindKeyCode(110, ['numdecimal', 'num.']);
                locale.bindKeyCode(111, ['numdivide', 'num/']);
                locale.bindKeyCode(144, ['numlock', 'num']);

                // function keys
                locale.bindKeyCode(112, ['f1']);
                locale.bindKeyCode(113, ['f2']);
                locale.bindKeyCode(114, ['f3']);
                locale.bindKeyCode(115, ['f4']);
                locale.bindKeyCode(116, ['f5']);
                locale.bindKeyCode(117, ['f6']);
                locale.bindKeyCode(118, ['f7']);
                locale.bindKeyCode(119, ['f8']);
                locale.bindKeyCode(120, ['f9']);
                locale.bindKeyCode(121, ['f10']);
                locale.bindKeyCode(122, ['f11']);
                locale.bindKeyCode(123, ['f12']);

                // secondary key symbols
                locale.bindMacro('shift + `', ['tilde', '~']);
                locale.bindMacro('shift + 1', ['exclamation', 'exclamationpoint', '!']);
                locale.bindMacro('shift + 2', ['at', '@']);
                locale.bindMacro('shift + 3', ['number', '#']);
                locale.bindMacro('shift + 4', ['dollar', 'dollars', 'dollarsign', '$']);
                locale.bindMacro('shift + 5', ['percent', '%']);
                locale.bindMacro('shift + 6', ['caret', '^']);
                locale.bindMacro('shift + 7', ['ampersand', 'and', '&']);
                locale.bindMacro('shift + 8', ['asterisk', '*']);
                locale.bindMacro('shift + 9', ['openparen', '(']);
                locale.bindMacro('shift + 0', ['closeparen', ')']);
                locale.bindMacro('shift + -', ['underscore', '_']);
                locale.bindMacro('shift + =', ['plus', '+']);
                locale.bindMacro('shift + [', ['opencurlybrace', 'opencurlybracket', '{']);
                locale.bindMacro('shift + ]', ['closecurlybrace', 'closecurlybracket', '}']);
                locale.bindMacro('shift + \\', ['verticalbar', '|']);
                locale.bindMacro('shift + ;', ['colon', ':']);
                locale.bindMacro('shift + \'', ['quotationmark', '\'']);
                locale.bindMacro('shift + !,', ['openanglebracket', '<']);
                locale.bindMacro('shift + .', ['closeanglebracket', '>']);
                locale.bindMacro('shift + /', ['questionmark', '?']);

                //a-z and A-Z
                for (var keyCode = 65; keyCode <= 90; keyCode += 1) {
                    var keyName = String.fromCharCode(keyCode + 32);
                    var capitalKeyName = String.fromCharCode(keyCode);
                    locale.bindKeyCode(keyCode, keyName);
                    locale.bindMacro('shift + ' + keyName, capitalKeyName);
                    locale.bindMacro('capslock + ' + keyName, capitalKeyName);
                }

                // browser caveats
                var semicolonKeyCode = userAgent.match('Firefox') ? 59 : 186;
                var dashKeyCode = userAgent.match('Firefox') ? 173 : 189;
                var leftCommandKeyCode;
                var rightCommandKeyCode;
                if (platform.match('Mac') && (userAgent.match('Safari') || userAgent.match('Chrome'))) {
                    leftCommandKeyCode = 91;
                    rightCommandKeyCode = 93;
                } else if (platform.match('Mac') && userAgent.match('Opera')) {
                    leftCommandKeyCode = 17;
                    rightCommandKeyCode = 17;
                } else if (platform.match('Mac') && userAgent.match('Firefox')) {
                    leftCommandKeyCode = 224;
                    rightCommandKeyCode = 224;
                }
                locale.bindKeyCode(semicolonKeyCode, ['semicolon', ';']);
                locale.bindKeyCode(dashKeyCode, ['dash', '-']);
                locale.bindKeyCode(leftCommandKeyCode, ['command', 'windows', 'win', 'super', 'leftcommand', 'leftwindows', 'leftwin', 'leftsuper']);
                locale.bindKeyCode(rightCommandKeyCode, ['command', 'windows', 'win', 'super', 'rightcommand', 'rightwindows', 'rightwin', 'rightsuper']);

                // kill keys
                locale.setKillKey('command');
            };

        }, {}]
    }, {}, [1])(1)
});
 