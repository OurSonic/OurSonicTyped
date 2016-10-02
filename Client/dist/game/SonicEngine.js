/// <reference path="../../typings/keyboardjs.d.ts" />
/// <reference path="../../typings/socket.io-client.d.ts" />
System.register(["../common/CanvasInformation", "./SonicManager", "../common/Enums", "../common/Utils", "./sonic/Sonic", "../common/Help"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CanvasInformation_1, SonicManager_1, Enums_1, Utils_1, Sonic_1, Help_1;
    var SonicEngine;
    return {
        setters:[
            function (CanvasInformation_1_1) {
                CanvasInformation_1 = CanvasInformation_1_1;
            },
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            },
            function (Enums_1_1) {
                Enums_1 = Enums_1_1;
            },
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (Sonic_1_1) {
                Sonic_1 = Sonic_1_1;
            },
            function (Help_1_1) {
                Help_1 = Help_1_1;
            }],
        execute: function() {
            /*class _Point {
                constructor(public x:number, public y:number) {
                }
            }
            class _Line {
                constructor(public p1:_Point, public p2:_Point) {
                }
            }*/
            SonicEngine = (function () {
                function SonicEngine() {
                    var _this = this;
                    this.wideScreen = true;
                    this.fullscreenMode = false;
                    this.gameGoodWidth = 0;
                    this.canvasWidth = 0;
                    this.canvasHeight = 0;
                    SonicEngine.instance = this;
                    var gameCanvasName = "gameLayer";
                    this.gameCanvas = CanvasInformation_1.CanvasInformation.CreateFromElement(document.getElementById(gameCanvasName), 0, 0, true);
                    this.canvasWidth = 0;
                    this.canvasHeight = 0;
                    this.bindInput();
                    this.fullscreenMode = true;
                    window.addEventListener("resize", function (e) { return _this.resizeCanvas(true); });
                    jQuery(document).resize(function (e) { return _this.resizeCanvas(true); });
                    this.sonicManager = new SonicManager_1.SonicManager(this, this.gameCanvas, function () { return _this.resizeCanvas(true); });
                    this.sonicManager.indexedPalette = 0;
                    window.setInterval(function () { return _this.sonicManager.tick(); }, 1000 / 60);
                    window.setInterval(function () { return _this.GameDraw(); }, 1000 / 60);
                    this.resizeCanvas(true);
                    //        this.startThing();
                }
                /*
                    private startThing() {
                
                        let points:_Point[] = [];
                        let lines:{p1:_Point,p2:_Point}[] = [];
                
                        for (var i = 0; i < 5000; i++) {
                            points.push(new _Point(Math.random() * 1000 | 0, Math.random() * 1000 | 0));
                        }
                
                        let allPoints:_Point[] = points.slice();
                
                        let nextPoint = allPoints[0];
                        allPoints.splice(0, 1);
                
                        while (allPoints.length > 0) {
                            let closest = this.closests(nextPoint, allPoints);
                            lines.push(new _Line(nextPoint, closest));
                            allPoints.splice(allPoints.indexOf(closest), 1);
                            nextPoint = closest;
                        }
                
                
                  /*      while (allPoints.length > 0) {
                            let closest = allPoints[0];
                            lines.push(new _Line(nextPoint, closest));
                            allPoints.splice(allPoints.indexOf(closest), 1);
                            nextPoint = closest;
                        }#1#
                
                
                        lines.push(new _Line(nextPoint, lines[0].p1));
                        let dist = this.distance(lines);
                        this.draw(points, lines, dist);
                
                        let count = 0;
                        let md = setInterval(()=> {
                            count++;
                            if (count > 1000000) {
                                clearInterval(md);
                                console.log('done');
                
                                return;
                            }
                            for (let j = 0; j < 100; j++) {
                                var p1 = (Math.random() * points.length | 0);
                                var p2 = (Math.random() * points.length | 0);
                                if (p1 == p2)return;
                
                                var nLines = this.swap(lines, points[p1], points[p2]);
                                var nDist = this.distance(nLines);
                                if (nDist < dist) {
                                    dist=nDist;
                                    lines = nLines;
                                    console.log('swap');
                                    this.draw(points, lines, dist);
                                }
                            }
                        }, 1);
                
                
                    }
                
                    private swap(lines:_Line[], p1:_Point, p2:_Point):_Line[] {
                        var nLines = lines.slice();
                        for (var i = 0; i < nLines.length; i++) {
                            var line = nLines[i];
                            if (line.p1 == p1) {
                                line.p1 = p2;
                            } else if (line.p1 == p2) {
                                line.p1 = p1;
                            }
                
                            if (line.p2 == p1) {
                                line.p2 = p2;
                            } else if (line.p2 == p2) {
                                line.p2 = p1;
                            }
                        }
                        return nLines;
                    }
                
                
                    private closests(me:_Point, points:_Point[]):_Point {
                        var distance = 1000000000;
                        let good:_Point;
                        for (var j = 0; j < points.length; j++) {
                            var point = points[j];
                            var dis = this.pointDistance(me, point);
                            if (dis < distance) {
                                distance = dis;
                                good = points[j];
                            }
                        }
                        return good;
                    }
                
                    private pointDistance(p1:_Point, p2:_Point):number {
                        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
                    }
                
                    private distance(lines:_Line[]):number {
                        let dist = 0;
                        for (var i = 0; i < lines.length; i++) {
                            var line = lines[i];
                            dist += this.pointDistance(line.p1, line.p2);
                        }
                        return dist;
                    }
                
                    private draw(points:_Point[], lines:_Line[], dist:number) {
                        this.gameCanvas.canvas.width = this.gameCanvas.canvas.width;
                        this.gameCanvas.Context.save();
                        this.gameCanvas.Context.scale(1.5,1.5);
                        this.gameCanvas.Context.fillStyle = 'white';
                        for (var i = 0; i < points.length; i++) {
                            var point = points[i];
                            this.gameCanvas.Context.fillRect(point.x - 5, point.y - 5, 10, 10);
                        }
                
                        this.gameCanvas.Context.strokeStyle = 'red';
                        this.gameCanvas.Context.lineWidth = 3;
                        for (var i = 0; i < lines.length; i++) {
                            var line = lines[i];
                            this.gameCanvas.Context.moveTo(line.p1.x, line.p1.y);
                            this.gameCanvas.Context.lineTo(line.p2.x, line.p2.y);
                            this.gameCanvas.Context.stroke();
                        }
                        this.gameCanvas.Context.fillText(dist.toString(), 0, 30);
                        this.gameCanvas.Context.restore();
                
                    }*/
                SonicEngine.prototype.bindInput = function () {
                    var _this = this;
                    this.gameCanvas.domCanvas.mousedown(function (e) { return _this.canvasOnClick(e); });
                    this.gameCanvas.domCanvas.mouseup(function (e) { return _this.canvasMouseUp(e); });
                    this.gameCanvas.domCanvas.mousemove(function (e) { return _this.canvasMouseMove(e); });
                    this.gameCanvas.domCanvas.bind("touchstart", function (e) { return _this.canvasOnClick(e); });
                    this.gameCanvas.domCanvas.bind("touchend", function (e) { return _this.canvasMouseUp(e); });
                    this.gameCanvas.domCanvas.bind("touchmove", function (e) { return _this.canvasMouseMove(e); });
                    this.gameCanvas.domCanvas.bind("contextmenu", function (e) { return e.preventDefault(); });
                    keyboardJS.bind("f", function () {
                        _this.sonicManager.showHeightMap = !_this.sonicManager.showHeightMap;
                    }, function () {
                    });
                    keyboardJS.bind("o", function () {
                        if (_this.sonicManager.currentGameState == Enums_1.GameState.Playing)
                            _this.sonicManager.inHaltMode = !_this.sonicManager.inHaltMode;
                    }, function () {
                    });
                    keyboardJS.bind("1", function () {
                        _this.sonicManager.indexedPalette++;
                        _this.sonicManager.clearCache();
                    }, function () {
                    });
                    keyboardJS.bind("2", function () {
                        _this.sonicManager.pixelScale += 1;
                        if (_this.sonicManager.pixelScale == 5)
                            _this.sonicManager.pixelScale = 1;
                    }, function () {
                    });
                    keyboardJS.bind("q", function () {
                        _this.runGame();
                    }, function () {
                    });
                    keyboardJS.bind("p", function () {
                        if (_this.sonicManager.currentGameState == Enums_1.GameState.Playing)
                            if (_this.sonicManager.inHaltMode)
                                _this.sonicManager.waitingForTickContinue = false;
                    }, function () {
                    });
                    keyboardJS.bind("h", function () {
                        if (_this.sonicManager.currentGameState == Enums_1.GameState.Playing)
                            _this.sonicManager.sonicToon.hit(_this.sonicManager.sonicToon.x, _this.sonicManager.sonicToon.y);
                    }, function () {
                    });
                    keyboardJS.bind("u", function () {
                        _this.wideScreen = !_this.wideScreen;
                        _this.resizeCanvas(true);
                    }, function () {
                    });
                    keyboardJS.bind("c", function () {
                        if (_this.sonicManager.currentGameState == Enums_1.GameState.Playing)
                            _this.sonicManager.sonicToon.debug();
                    }, function () {
                    });
                    keyboardJS.bind("up", function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_1.GameState.Playing:
                                _this.sonicManager.sonicToon.pressUp();
                                break;
                            case Enums_1.GameState.Editing:
                                _this.sonicManager.windowLocation.y -= 128;
                                _this.sonicManager.bigWindowLocation.y -= 128;
                                break;
                        }
                    }, function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_1.GameState.Playing:
                                _this.sonicManager.sonicToon.releaseUp();
                                break;
                            case Enums_1.GameState.Editing:
                                break;
                        }
                    });
                    keyboardJS.bind("down", function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_1.GameState.Playing:
                                _this.sonicManager.sonicToon.pressCrouch();
                                break;
                            case Enums_1.GameState.Editing:
                                _this.sonicManager.windowLocation.y += 128;
                                _this.sonicManager.bigWindowLocation.y += 128;
                                break;
                        }
                    }, function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_1.GameState.Playing:
                                _this.sonicManager.sonicToon.releaseCrouch();
                                break;
                            case Enums_1.GameState.Editing:
                                break;
                        }
                    });
                    keyboardJS.bind("left", function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_1.GameState.Playing:
                                _this.sonicManager.sonicToon.pressLeft();
                                break;
                            case Enums_1.GameState.Editing:
                                _this.sonicManager.windowLocation.x -= 128;
                                _this.sonicManager.bigWindowLocation.x -= 128;
                                break;
                        }
                    }, function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_1.GameState.Playing:
                                _this.sonicManager.sonicToon.releaseLeft();
                                break;
                            case Enums_1.GameState.Editing:
                                break;
                        }
                    });
                    keyboardJS.bind("right", function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_1.GameState.Playing:
                                _this.sonicManager.sonicToon.pressRight();
                                break;
                            case Enums_1.GameState.Editing:
                                _this.sonicManager.windowLocation.x += 128;
                                _this.sonicManager.bigWindowLocation.x += 128;
                                break;
                        }
                    }, function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_1.GameState.Playing:
                                _this.sonicManager.sonicToon.releaseRight();
                                break;
                            case Enums_1.GameState.Editing:
                                break;
                        }
                    });
                    keyboardJS.bind("space", function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_1.GameState.Playing:
                                _this.sonicManager.sonicToon.pressJump();
                                break;
                            case Enums_1.GameState.Editing:
                                break;
                        }
                    }, function () {
                        switch (_this.sonicManager.currentGameState) {
                            case Enums_1.GameState.Playing:
                                _this.sonicManager.sonicToon.releaseJump();
                                break;
                            case Enums_1.GameState.Editing:
                                break;
                        }
                    });
                    keyboardJS.bind("e", function () {
                        _this.sonicManager.sonicLevel.curHeightMap = !_this.sonicManager.sonicLevel.curHeightMap;
                    }, function () {
                    });
                };
                SonicEngine.prototype.LoadLevel = function (data) {
                    var l = JSON.parse(Help_1.Help.decodeString(data));
                    SonicEngine.instance.RunSonic(l);
                };
                SonicEngine.prototype.RunSonic = function (level) {
                    this.sonicManager.clearCache();
                    this.sonicManager.Load(level);
                    this.sonicManager.windowLocation.x = 0;
                    this.sonicManager.windowLocation.y = 0;
                    this.sonicManager.bigWindowLocation.x = (this.sonicManager.windowLocation.x - this.sonicManager.windowLocation.Width * 0.2) | 0;
                    this.sonicManager.bigWindowLocation.y = (this.sonicManager.windowLocation.y - this.sonicManager.windowLocation.Height * 0.2) | 0;
                    this.sonicManager.bigWindowLocation.Width = (this.sonicManager.windowLocation.Width * 1.8) | 0;
                    this.sonicManager.bigWindowLocation.Height = (this.sonicManager.windowLocation.Height * 1.8) | 0;
                    var dl = Help_1.Help.getQueryString();
                    this.sonicManager.currentGameState = Enums_1.GameState.Editing;
                    if (dl["run"]) {
                        this.runGame();
                    }
                    this.sonicManager.cacheTiles();
                    this.runGame();
                };
                SonicEngine.prototype.runGame = function () {
                    var sonicManager = SonicManager_1.SonicManager.instance;
                    switch (sonicManager.currentGameState) {
                        case Enums_1.GameState.Playing:
                            sonicManager.currentGameState = Enums_1.GameState.Editing;
                            sonicManager.scale = new Utils_1.Point(1, 1);
                            sonicManager.windowLocation = Help_1.Help.defaultWindowLocation(sonicManager.currentGameState, sonicManager.scale);
                            sonicManager.sonicToon = null;
                            break;
                        case Enums_1.GameState.Editing:
                            sonicManager.currentGameState = Enums_1.GameState.Playing;
                            sonicManager.scale = new Utils_1.Point(2, 2);
                            sonicManager.windowLocation = Help_1.Help.defaultWindowLocation(sonicManager.currentGameState, sonicManager.scale);
                            sonicManager.sonicToon = new Sonic_1.Sonic();
                            break;
                    }
                    sonicManager.DestroyCanvases();
                    sonicManager.ResetCanvases();
                };
                SonicEngine.prototype.canvasMouseMove = function (queryEvent) {
                    queryEvent.preventDefault();
                    this.sonicManager.mouseMove(queryEvent);
                };
                SonicEngine.prototype.canvasOnClick = function (queryEvent) {
                    queryEvent.preventDefault();
                    this.sonicManager.onClick(queryEvent);
                };
                SonicEngine.prototype.canvasMouseUp = function (queryEvent) {
                    queryEvent.preventDefault();
                    this.sonicManager.mouseUp(queryEvent);
                };
                SonicEngine.prototype.resizeCanvas = function (resetOverride) {
                    this.canvasWidth = $(window).width();
                    this.canvasHeight = $(window).height();
                    this.sonicManager.windowLocation = Help_1.Help.defaultWindowLocation(this.sonicManager.currentGameState, this.sonicManager.scale);
                    var wide = new Utils_1.DoublePoint((this.canvasWidth / 320 / this.sonicManager.scale.x), (this.canvasHeight / 224 / this.sonicManager.scale.y));
                    var even = new Utils_1.DoublePoint(Math.min((this.canvasWidth / 320 / this.sonicManager.scale.x), (this.canvasHeight / 224 / this.sonicManager.scale.y)), Math.min((this.canvasWidth / 320 / this.sonicManager.scale.x), (this.canvasHeight / 224 / this.sonicManager.scale.y)));
                    this.sonicManager.realScale = !this.fullscreenMode ? new Utils_1.DoublePoint(1, 1) : (this.wideScreen ? wide : even);
                    if (resetOverride || this.sonicManager.overrideRealScale == null)
                        this.sonicManager.overrideRealScale = Utils_1.DoublePoint.create(this.sonicManager.realScale);
                    else
                        this.sonicManager.realScale = Utils_1.DoublePoint.create(this.sonicManager.overrideRealScale);
                    this.gameCanvas.domCanvas.attr("width", (this.sonicManager.windowLocation.Width * (this.sonicManager.currentGameState === Enums_1.GameState.Playing ? this.sonicManager.scale.x * this.sonicManager.realScale.x : 1)).toString());
                    this.gameCanvas.domCanvas.attr("height", (this.sonicManager.windowLocation.Height * (this.sonicManager.currentGameState === Enums_1.GameState.Playing ? this.sonicManager.scale.y * this.sonicManager.realScale.y : 1)).toString());
                    this.gameGoodWidth = (this.sonicManager.windowLocation.Width * (this.sonicManager.currentGameState == Enums_1.GameState.Playing ? this.sonicManager.scale.x * this.sonicManager.realScale.x : 1));
                    var screenOffset = this.sonicManager.currentGameState == Enums_1.GameState.Playing ? new Utils_1.DoublePoint(((this.canvasWidth / 2 - this.sonicManager.windowLocation.Width * this.sonicManager.scale.x * this.sonicManager.realScale.x / 2)), (this.canvasHeight / 2 - this.sonicManager.windowLocation.Height * this.sonicManager.scale.y * this.sonicManager.realScale.y / 2)) : new Utils_1.DoublePoint(0, 0);
                    this.gameCanvas.domCanvas.css("left", screenOffset.x + 'px');
                    this.gameCanvas.domCanvas.css("top", screenOffset.y + 'px');
                    this.sonicManager.DestroyCanvases();
                    this.sonicManager.ResetCanvases();
                };
                SonicEngine.prototype.clear = function (canv) {
                    canv.domCanvas[0].width = this.gameGoodWidth;
                    this.gameCanvas.Context.mozImageSmoothingEnabled = false; /// future
                    this.gameCanvas.Context.msImageSmoothingEnabled = false; /// future
                    this.gameCanvas.Context.imageSmoothingEnabled = false; /// future
                    this.gameCanvas.Context.imageSmoothingEnabled = false;
                };
                SonicEngine.prototype.GameDraw = function () {
                    this.sonicManager.MainDraw(this.gameCanvas);
                };
                return SonicEngine;
            }());
            exports_1("SonicEngine", SonicEngine);
        }
    }
});
//# sourceMappingURL=SonicEngine.js.map