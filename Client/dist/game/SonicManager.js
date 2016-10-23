System.register(["../common/Utils", "../common/CanvasInformation", "../common/Enums", "../common/Help", "./level/HeightMap", "./level/Objects/ObjectManager", "./SonicLevel", "./level/Objects/LevelObjectInfo", "./level/Ring", "./level/SpriteCache", "./level/Animations/TileAnimationData", "./level/Tiles/TilePaletteAnimationManager", "./level/Tiles/TileAnimationManager", "./level/Tiles/TileChunk", "../common/SpriteLoader", "./level/Objects/LevelObject", "./level/Objects/LevelObjectData", "./level/Tiles/Tile", "./level/Tiles/TilePiece", "./level/Tiles/TileInfo", "./level/Tiles/TilePieceInfo"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utils_1, CanvasInformation_1, Enums_1, Help_1, HeightMap_1, ObjectManager_1, SonicLevel_1, LevelObjectInfo_1, Ring_1, SpriteCache_1, TileAnimationData_1, TilePaletteAnimationManager_1, TileAnimationManager_1, TileChunk_1, SpriteLoader_1, LevelObject_1, LevelObjectData_1, Tile_1, TilePiece_1, TileInfo_1, TilePieceInfo_1;
    var SonicManager, PixelScaleManager;
    return {
        setters:[
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (CanvasInformation_1_1) {
                CanvasInformation_1 = CanvasInformation_1_1;
            },
            function (Enums_1_1) {
                Enums_1 = Enums_1_1;
            },
            function (Help_1_1) {
                Help_1 = Help_1_1;
            },
            function (HeightMap_1_1) {
                HeightMap_1 = HeightMap_1_1;
            },
            function (ObjectManager_1_1) {
                ObjectManager_1 = ObjectManager_1_1;
            },
            function (SonicLevel_1_1) {
                SonicLevel_1 = SonicLevel_1_1;
            },
            function (LevelObjectInfo_1_1) {
                LevelObjectInfo_1 = LevelObjectInfo_1_1;
            },
            function (Ring_1_1) {
                Ring_1 = Ring_1_1;
            },
            function (SpriteCache_1_1) {
                SpriteCache_1 = SpriteCache_1_1;
            },
            function (TileAnimationData_1_1) {
                TileAnimationData_1 = TileAnimationData_1_1;
            },
            function (TilePaletteAnimationManager_1_1) {
                TilePaletteAnimationManager_1 = TilePaletteAnimationManager_1_1;
            },
            function (TileAnimationManager_1_1) {
                TileAnimationManager_1 = TileAnimationManager_1_1;
            },
            function (TileChunk_1_1) {
                TileChunk_1 = TileChunk_1_1;
            },
            function (SpriteLoader_1_1) {
                SpriteLoader_1 = SpriteLoader_1_1;
            },
            function (LevelObject_1_1) {
                LevelObject_1 = LevelObject_1_1;
            },
            function (LevelObjectData_1_1) {
                LevelObjectData_1 = LevelObjectData_1_1;
            },
            function (Tile_1_1) {
                Tile_1 = Tile_1_1;
            },
            function (TilePiece_1_1) {
                TilePiece_1 = TilePiece_1_1;
            },
            function (TileInfo_1_1) {
                TileInfo_1 = TileInfo_1_1;
            },
            function (TilePieceInfo_1_1) {
                TilePieceInfo_1 = TilePieceInfo_1_1;
            }],
        execute: function() {
            SonicManager = (function () {
                function SonicManager(engine, lowTileCanvas, spriteCanvas, highTileCanvas, resize) {
                    var _this = this;
                    this.sonicSprites = {};
                    this.pixelScale = 0;
                    this.pixelScaleManager = new PixelScaleManager();
                    SonicManager.instance = this;
                    this.lowTileCanvas = lowTileCanvas;
                    this.spriteCanvas = spriteCanvas;
                    this.highTileCanvas = highTileCanvas;
                    window.OurSonic = { SonicManager: { instance: SonicManager.instance }, SonicEngine: engine };
                    this.engine = engine;
                    this.engine.canvasWidth = $(window).width();
                    this.engine.canvasHeight = $(window).height();
                    this.lowTileCanvas.domCanvas[0].setAttribute("width", "320");
                    this.lowTileCanvas.domCanvas[0].setAttribute("height", "240");
                    this.spriteCanvas.domCanvas[0].setAttribute("width", "320");
                    this.spriteCanvas.domCanvas[0].setAttribute("height", "240");
                    this.highTileCanvas.domCanvas[0].setAttribute("width", "320");
                    this.highTileCanvas.domCanvas[0].setAttribute("height", "240");
                    jQuery.getJSON("assets/content/sprites/sonic.js", function (data) {
                        _this.sonicSprites = data;
                    });
                    this.objectManager = new ObjectManager_1.ObjectManager(this);
                    this.objectManager.Init();
                    var scl = 2;
                    this.scale = new Utils_1.Point(scl, scl);
                    this.realScale = new Utils_1.DoublePoint(1, 1);
                    this.windowLocation = Help_1.Help.defaultWindowLocation(Enums_1.GameState.Editing, this.scale);
                    this.bigWindowLocation = Help_1.Help.defaultWindowLocation(Enums_1.GameState.Editing, this.scale);
                    this.bigWindowLocation.width = (this.bigWindowLocation.width * 1.8) | 0;
                    this.bigWindowLocation.height = (this.bigWindowLocation.height * 1.8) | 0;
                    this.tileAnimations = [];
                    this.animationInstances = [];
                    this.showHeightMap = false;
                    this.goodRing = new Ring_1.Ring(false);
                    this.activeRings = [];
                    this.forceResize = resize;
                    this.background = null;
                    this.currentGameState = Enums_1.GameState.Editing;
                    this.clickState = Enums_1.ClickState.PlaceChunk;
                    this.tickCount = 0;
                    this.drawTickCount = 0;
                    this.inHaltMode = false;
                    this.waitingForTickContinue = false;
                    this.waitingForDrawContinue = false;
                    this.tileChunkDebugDrawOptions = new TileChunk_1.TileChunkDebugDrawOptions();
                    /*
                    this.tileChunkDebugDrawOptions.outlineTilePieces=true;
                    this.tileChunkDebugDrawOptions.putlineChunk=true;
                     this.tileChunkDebugDrawOptions.outlineTiles=true;
                     */
                }
                SonicManager.prototype.onClick = function (event) {
                    this.clicking = true;
                    if (this.effectClick(event))
                        return true;
                    return false;
                };
                SonicManager.prototype.effectClick = function (event) {
                    if (!this.sonicLevel)
                        return;
                    var e = new Utils_1.Point((event.clientX / this.scale.x / this.realScale.x + this.windowLocation.x), (event.clientY / this.scale.y / this.realScale.y + this.windowLocation.y));
                    var ey;
                    var ex;
                    if (event.ctrlKey) {
                        ex = e.x / 128 | 0;
                        ey = e.y / 128 | 0;
                        var ch = this.sonicLevel.getChunkAt(ex, ey);
                        //            if (this.UIManager.UIManagerAreas.TilePieceArea != null)
                        //                ch.SetTilePieceAt(e.X - ex * 128, e.Y - ey * 128, this.UIManager.UIManagerAreas.TilePieceArea.Data, true);
                        return true;
                    }
                    if (event.shiftKey) {
                        ex = e.x / 128 | 0;
                        ey = e.y / 128 | 0;
                        var ch = this.sonicLevel.getChunkAt(ex, ey);
                        //            if (this.UIManager.UIManagerAreas.TileChunkArea != null)
                        //                this.SonicLevel.SetChunkAt(ex, ey, this.UIManager.UIManagerAreas.TileChunkArea.Data);
                        return true;
                    }
                    if (event.button === 0) {
                        switch (this.clickState) {
                            case Enums_1.ClickState.Dragging:
                                return true;
                            case Enums_1.ClickState.PlaceChunk: {
                                ex = e.x / 128 | 0;
                                ey = e.y / 128 | 0;
                                var ch = this.sonicLevel.getChunkAt(ex, ey);
                                var tp = ch.getTilePieceAt(e.x - ex * 128, e.y - ey * 128, true);
                                var dontClear = false;
                                //                    if (this.UIManager.UIManagerAreas.TileChunkArea != null) {
                                //                        if (this.UIManager.UIManagerAreas.TileChunkArea.Data == ch)
                                //                            dontClear = true;
                                //                        this.UIManager.UIManagerAreas.TileChunkArea.Data = ch;
                                //                    }
                                //                    if (this.UIManager.UIManagerAreas.TilePieceArea != null) {
                                //                        if (this.UIManager.UIManagerAreas.TilePieceArea.Data != tp)
                                //                            dontClear = true;
                                //                        this.UIManager.UIManagerAreas.TilePieceArea.Data = tp;
                                //                    }
                                // this.clearCache();
                                return true;
                            }
                            case Enums_1.ClickState.PlaceRing:
                                ex = e.x;
                                ey = e.y;
                                this.sonicLevel.rings.push(Help_1.Help.merge(new Ring_1.Ring(true), { X: ex, Y: ey }));
                                return true;
                            case Enums_1.ClickState.PlaceObject: {
                                ex = e.x;
                                ey = e.y;
                                var pos = new Utils_1.Point(ex, ey);
                                for (var _i = 0, _a = this.sonicLevel.objects; _i < _a.length; _i++) {
                                    var o = _a[_i];
                                    if (Utils_1.IntersectingRectangle.IntersectsRect(o.getRect(), pos))
                                        alert("Object Data: " + Help_1.Help.stringify(o));
                                }
                                return true;
                            }
                        }
                    }
                    return false;
                };
                SonicManager.prototype.tickObjects = function () {
                    var localPoint = new Utils_1.Point(0, 0);
                    this.inFocusObjects = [];
                    var levelObjectInfos = this.sonicLevel.objects;
                    for (var _i = 0, levelObjectInfos_1 = levelObjectInfos; _i < levelObjectInfos_1.length; _i++) {
                        var obj = levelObjectInfos_1[_i];
                        localPoint.x = obj.x | 0;
                        localPoint.y = obj.y | 0;
                        if (this.bigWindowLocation.Intersects(localPoint)) {
                            this.inFocusObjects.push(obj);
                            obj.tick(obj, this.sonicLevel, this.sonicToon);
                        }
                    }
                    //        if (this.UIManager.UIManagerAreas.LiveObjectsArea != null)
                    //            this.UIManager.UIManagerAreas.LiveObjectsArea.Data.Populate(this.InFocusObjects);
                    for (var _a = 0, _b = this.animationInstances; _a < _b.length; _a++) {
                        var animationInstance = _b[_a];
                        animationInstance.Tick();
                    }
                };
                SonicManager.prototype.tick = function () {
                    if (this.loading)
                        return;
                    if (this.currentGameState === Enums_1.GameState.Playing) {
                        if (this.inHaltMode) {
                            if (this.waitingForTickContinue)
                                return;
                        }
                        this.tickCount++;
                        this.tickObjects();
                        this.sonicToon.ticking = true;
                        try {
                            this.sonicToon.tick(this.sonicLevel);
                        }
                        finally {
                            this.sonicToon.ticking = false;
                        }
                        if (this.inHaltMode) {
                            if (this.waitingForTickContinue)
                                return;
                            this.waitingForTickContinue = true;
                            this.waitingForDrawContinue = false;
                        }
                    }
                };
                SonicManager.prototype.preloadSprites = function (completed, update) {
                    var _this = this;
                    if (this.spriteCache != null) {
                        completed();
                        return;
                    }
                    this.spriteCache = this.spriteCache != null ? this.spriteCache : new SpriteCache_1.SpriteCache();
                    var ci = this.spriteCache.Rings;
                    var spriteLocations = new Array();
                    for (var j = 0; j < 4; j++) {
                        spriteLocations.push("assets/sprites/ring" + j + ".png");
                        this.imageLength++;
                    }
                    var ind_ = this.spriteCache.Indexes;
                    this.spriteLoader = new SpriteLoader_1.SpriteLoader(completed, update);
                    if (ci.length == 0) {
                        var spriteStep = this.spriteLoader.AddStep("Sprites", function (i, done) {
                            Help_1.Help.loadSprite(spriteLocations[i], function (jd) {
                                ci[i] = CanvasInformation_1.CanvasInformation.create(jd.width, jd.height, false);
                                ci[i].Context.drawImage(jd, 0, 0);
                                done();
                            });
                        }, function () {
                            ind_.Sprites++;
                            if (ind_.Sprites == 4)
                                return true;
                            return false;
                        }, false);
                        for (var i = 0; i < spriteLocations.length; i++) {
                            this.spriteLoader.AddIterationToStep(spriteStep, i);
                        }
                    }
                    var cci = this.spriteCache.SonicSprites;
                    if (Object.keys(cci).length == 0) {
                        var sonicStep = this.spriteLoader.AddStep("Sonic Sprites", function (sp, done) {
                            for (var sonicSprite in _this.sonicSprites) {
                                cci[sonicSprite] = Help_1.Help.scaleCsImage(_this.sonicSprites[sonicSprite], new Utils_1.Point(1, 1), function (ec) {
                                });
                            }
                            done();
                        }, function () { return true; }, false);
                        this.spriteLoader.AddIterationToStep(sonicStep, 0);
                    }
                };
                SonicManager.prototype.MainDraw = function () {
                    if (this.inHaltMode)
                        if (this.drawHaltMode(this.highTileCanvas.Context))
                            return;
                    this.engine.clear();
                    if (this.sonicLevel == null)
                        return;
                    this.highTileCanvas.Context.save();
                    var localPoint = new Utils_1.Point(0, 0);
                    this.drawTickCount++;
                    if (this.spriteLoader && !this.spriteLoader.Tick() || this.loading) {
                        SonicManager.drawLoading(this.highTileCanvas.Context);
                        this.highTileCanvas.Context.restore();
                        return;
                    }
                    this.updatePositions();
                    var w1 = (this.windowLocation.width / 128 | 0) + 2;
                    var h1 = (this.windowLocation.height / 128 | 0) + 2;
                    if (this.currentGameState == Enums_1.GameState.Editing) {
                        w1 += 1;
                        h1 += 1;
                        w1 /= this.scale.x;
                        h1 /= this.scale.y;
                    }
                    var offs = SonicManager.getOffs(w1, h1);
                    this.tilePaletteAnimationManager.TickAnimatedPalettes();
                    this.tileAnimationManager.TickAnimatedTiles();
                    var fxP = ((this.windowLocation.x) / 128) | 0;
                    var fyP = ((this.windowLocation.y) / 128) | 0;
                    this.ResetCanvases();
                    var zero = new Utils_1.Point(0, 0);
                    if (this.background) {
                        var wOffset = this.windowLocation.x;
                        var bw = this.background.Width;
                        var movex = (wOffset / bw) * bw;
                        localPoint.x = -this.windowLocation.x + movex;
                        localPoint.y = -this.windowLocation.y / 4;
                        this.background.Draw(this.lowTileCanvas.Context, localPoint, wOffset);
                        localPoint.x = -this.windowLocation.x + movex + this.background.Width;
                        localPoint.y = -this.windowLocation.y / 4;
                        this.background.Draw(this.lowTileCanvas.Context, localPoint, wOffset);
                    }
                    this.drawLowChunks(this.lowTileCanvas.Context, zero, offs, fyP, fxP);
                    if (this.showHeightMap)
                        this.drawHighChunks(this.lowTileCanvas.Context, fxP, fyP, offs, zero);
                    this.drawObjects(this.spriteCanvas.Context, zero);
                    this.drawAnimations(this.spriteCanvas.Context);
                    this.drawRings(this.spriteCanvas.Context, zero);
                    this.drawSonic(this.spriteCanvas.Context);
                    if (!this.showHeightMap)
                        this.drawHighChunks(this.highTileCanvas.Context, fxP, fyP, offs, zero);
                    this.drawDebugTextChunks(this.highTileCanvas.Context, fxP, fyP, offs, zero);
                    //        this.lowChunkCanvas.Context.OffsetPixelsForWater();
                    //        this.highChuckCanvas.Context.OffsetPixelsForWater();
                    // this.drawCanveses(context, localPoint);
                    this.highTileCanvas.Context.restore();
                    /*      if (this.currentGameState === GameState.Playing)
                     this.sonicToon.drawUI(context, new Point(this.screenOffset.x, this.screenOffset.y));
                     */
                };
                SonicManager.prototype.drawCanveses = function (canvas, localPoint) {
                    /*
                     if (this.pixelScale > 0) {
                     canvas.drawImage(((this.lowTileCanvas.canvas)), localPoint.x, localPoint.y);
                     canvas.drawImage(((this.son.canvas)), localPoint.x, localPoint.y);
                     canvas.drawImage(((this.highChuckCanvas.canvas)), localPoint.x, localPoint.y);
            
                     //this.shadePixels(canvas);
            
                     var imageData = this.pixelScaleManager.scale(canvas, this.pixelScale - 1, this.windowLocation.width, this.windowLocation.height);
                     var pixelScale = this.pixelScaleManager.getPixelScale(this.pixelScale - 1);
                     canvas.scale(pixelScale.x, pixelScale.y);
            
                     canvas.scale(this.realScale.x, this.realScale.y);
                     canvas.scale(this.scale.x, this.scale.y);
            
                     canvas.drawImage(imageData, localPoint.x, localPoint.y);
                     } else {
                     canvas.scale(this.realScale.x, this.realScale.y);
                     canvas.scale(this.scale.x, this.scale.y);
                     //this.shadePixels(canvas);
                     canvas.drawImage(((this.lowChunkCanvas.canvas)), localPoint.x, localPoint.y);
                     canvas.drawImage(((this.sonicCanvas.canvas)), localPoint.x, localPoint.y);
                     canvas.drawImage(((this.highChuckCanvas.canvas)), localPoint.x, localPoint.y);
            
                     }
                     */
                };
                SonicManager.prototype.shadePixels = function (canvas) {
                    var img = canvas.getImageData(0, 0, this.windowLocation.width, this.windowLocation.height);
                    var arr = img.data;
                    var newArr = PixelScaleManager.cachedArray(this.windowLocation.width * this.windowLocation.height);
                    for (var i = 0; i < arr.length; i += 4) {
                        this.transform(arr, newArr, i, this.windowLocation.width, this.windowLocation.height);
                    }
                    img.data.set(newArr);
                    canvas.putImageData(img, 0, 0);
                };
                SonicManager.prototype.transform = function (arr, arr2, i, width, height) {
                    var x = i / 4 % width | 0;
                    var y = i / 4 / width | 0;
                    var top = PixelScaleManager._top(x - 1, y, width, height);
                    var bottom = PixelScaleManager._bottom(x + 1, y, width, height);
                    arr2[i] = 127;
                    arr2[i + 1] = 127;
                    arr2[i + 2] = 127;
                    arr2[i] -= arr[top];
                    arr2[i + 1] -= arr[top + 1];
                    arr2[i + 2] -= arr[top + 2];
                    arr2[i] += arr[bottom];
                    arr2[i + 1] += arr[bottom + 1];
                    arr2[i + 2] += arr[bottom + 2];
                    var m = (arr2[i] + arr2[i + 1] + arr2[i + 2]) / 3 | 0;
                    arr2[i] = m;
                    arr2[i + 1] = m;
                    arr2[i + 2] = m;
                };
                SonicManager.prototype.ResetCanvases = function () {
                    this.spriteCanvas.Context.clearRect(0, 0, 320, 240);
                    this.highTileCanvas.Context.clearRect(0, 0, 320, 240);
                    this.lowTileCanvas.Context.clearRect(0, 0, 320, 240);
                };
                /*
                 public DestroyCanvases(): void {
                 this.lowChunkCanvas = null;
                 this.sonicCanvas = null;
                 this.highChuckCanvas = null;
                 }
                 */
                SonicManager.getOffs = function (w1, h1) {
                    var hash = (w1 + 1) * (h1 + 1);
                    if (SonicManager._cachedOffs[hash])
                        return SonicManager._cachedOffs[hash];
                    var offs = new Array(0);
                    var ca = 0;
                    for (var y = -1; y < h1; y++)
                        for (var x = -1; x < w1; x++)
                            offs[ca++] = (new Utils_1.Point(x, y));
                    return SonicManager._cachedOffs[hash] = offs;
                };
                SonicManager.prototype.updatePositions = function () {
                    /*this.screenOffset.x = 0;
                     this.screenOffset.y = 0;*/
                    if (this.currentGameState == Enums_1.GameState.Playing)
                        this.updatePositionsForPlaying();
                };
                SonicManager.prototype.updatePositionsForPlaying = function () {
                    // canvas.scale(this.realScale.x, this.realScale.y);
                    if (this.sonicToon.ticking) {
                        while (true) {
                            if (this.sonicToon.ticking)
                                break;
                        }
                    }
                    // canvas.translate(this.screenOffset.x, this.screenOffset.y);
                    this.windowLocation.x = (this.sonicToon.x) - this.windowLocation.width / 2;
                    this.windowLocation.y = (this.sonicToon.y) - this.windowLocation.height / 2;
                    this.bigWindowLocation.x = (this.sonicToon.x) - this.bigWindowLocation.width / 2;
                    this.bigWindowLocation.y = (this.sonicToon.y) - this.bigWindowLocation.height / 2;
                    this.bigWindowLocation.x = (this.bigWindowLocation.x - this.windowLocation.width * 0.2);
                    this.bigWindowLocation.y = (this.bigWindowLocation.y - this.windowLocation.height * 0.2);
                    this.bigWindowLocation.width = (this.windowLocation.width * 1.8);
                    this.bigWindowLocation.height = (this.windowLocation.height * 1.8);
                };
                SonicManager.drawLoading = function (canvas) {
                    canvas.fillStyle = "white";
                    canvas.fillText("loading...   ", 95, 95);
                    canvas.restore();
                };
                SonicManager.prototype.drawHaltMode = function (canvas) {
                    canvas.fillStyle = "white";
                    canvas.font = "21pt arial bold";
                    canvas.fillText("HALT MODE\r\n Press: P to step\r\n        O to resume", 10, 120);
                    if (this.waitingForDrawContinue)
                        return true;
                    else
                        this.waitingForDrawContinue = true;
                    return false;
                };
                SonicManager.prototype.drawLowChunks = function (canvas, localPoint, offs, fyP, fxP) {
                    for (var _i = 0, offs_1 = offs; _i < offs_1.length; _i++) {
                        var off = offs_1[_i];
                        var _xP = fxP + off.x;
                        var _yP = fyP + off.y;
                        var _xPreal = fxP + off.x;
                        var _yPreal = fyP + off.y;
                        _xP = Help_1.Help.mod(_xP, this.sonicLevel.levelWidth);
                        _yP = Help_1.Help.mod(_yP, this.sonicLevel.levelHeight);
                        var chunk = this.sonicLevel.getChunkAt(_xP, _yP);
                        if (chunk == null)
                            continue;
                        localPoint.x = (_xPreal * 128) - this.windowLocation.x | 0;
                        localPoint.y = (_yPreal * 128) - this.windowLocation.y | 0;
                        if (!chunk.isEmpty() && !chunk.OnlyForeground())
                            chunk.draw(canvas, localPoint, Enums_1.ChunkLayerState.Low);
                    }
                };
                SonicManager.prototype.drawHighChunks = function (canvas, fxP, fyP, offs, localPoint) {
                    var m = [];
                    for (var _i = 0, offs_2 = offs; _i < offs_2.length; _i++) {
                        var off = offs_2[_i];
                        var _xP = fxP + off.x;
                        var _yP = fyP + off.y;
                        var _xPreal = fxP + off.x;
                        var _yPreal = fyP + off.y;
                        _xP = Help_1.Help.mod(_xP, this.sonicLevel.levelWidth);
                        _yP = Help_1.Help.mod(_yP, this.sonicLevel.levelHeight);
                        var chunk = this.sonicLevel.getChunkAt(_xP, _yP);
                        if (chunk == null)
                            continue;
                        localPoint.x = (_xPreal * 128) - this.windowLocation.x | 0;
                        localPoint.y = (_yPreal * 128) - this.windowLocation.y | 0;
                        if (!chunk.isEmpty() && !chunk.onlyBackground()) {
                            m.push(localPoint.x + " " + localPoint.y);
                            chunk.draw(canvas, localPoint, Enums_1.ChunkLayerState.High);
                        }
                        if (this.showHeightMap) {
                            var fd = this.spriteCache.HeightMapChunks[(this.sonicLevel.curHeightMap ? 1 : 2) + " " + chunk.Index];
                            if (fd == null) {
                                fd = this.cacheHeightMapForChunk(chunk);
                            }
                            canvas.drawImage(fd.canvas, localPoint.x, localPoint.y);
                        }
                        if (this.currentGameState == Enums_1.GameState.Editing) {
                            canvas.strokeStyle = "#DD0033";
                            canvas.lineWidth = 3;
                            canvas.strokeRect(localPoint.x, localPoint.y, 128, 128);
                        }
                    }
                };
                SonicManager.prototype.drawDebugTextChunks = function (canvas, fxP, fyP, offs, localPoint) {
                    for (var _i = 0, offs_3 = offs; _i < offs_3.length; _i++) {
                        var off = offs_3[_i];
                        var _xP = fxP + off.x;
                        var _yP = fyP + off.y;
                        var _xPreal = fxP + off.x;
                        var _yPreal = fyP + off.y;
                        _xP = Help_1.Help.mod(_xP, this.sonicLevel.levelWidth);
                        _yP = Help_1.Help.mod(_yP, this.sonicLevel.levelHeight);
                        var chunk = this.sonicLevel.getChunkAt(_xP, _yP);
                        if (chunk == null)
                            continue;
                        localPoint.x = (_xPreal * 128) - this.windowLocation.x;
                        localPoint.y = (_yPreal * 128) - this.windowLocation.y;
                        if (!chunk.isEmpty() && !chunk.OnlyForeground())
                            chunk.DrawAnimationDebug(canvas, localPoint, Enums_1.ChunkLayerState.Low, this.tileChunkDebugDrawOptions);
                        if (!chunk.isEmpty() && !chunk.onlyBackground())
                            chunk.DrawAnimationDebug(canvas, localPoint, Enums_1.ChunkLayerState.High, this.tileChunkDebugDrawOptions);
                    }
                };
                SonicManager.prototype.cacheHeightMapForChunk = function (chunk) {
                    var md = chunk;
                    var posj1 = new Utils_1.Point(0, 0);
                    var canv = CanvasInformation_1.CanvasInformation.create(128, 128, false);
                    var ctx = canv.Context;
                    // this.engine.clear(canv);
                    for (var _y = 0; _y < 8; _y++) {
                        for (var _x = 0; _x < 8; _x++) {
                            var tp = md.TilePieces[_x][_y];
                            var solid = (this.sonicLevel.curHeightMap ? tp.Solid1 : tp.Solid2);
                            var hd = this.sonicLevel.curHeightMap ? tp.getLayer1HeightMaps() : tp.getLayer2HeightMaps();
                            var __x = _x;
                            var __y = _y;
                            var vangle = 0;
                            var posm = new Utils_1.Point(posj1.x + (__x * 16), posj1.y + (__y * 16));
                            if (!hd)
                                continue;
                            vangle = this.sonicLevel.curHeightMap ? tp.getLayer1Angles() : tp.getLayer2Angles();
                            hd.draw(ctx, posm, tp.XFlip, tp.YFlip, solid, vangle);
                        }
                    }
                    return this.spriteCache.HeightMapChunks[(this.sonicLevel.curHeightMap ? 1 : 2) + " " + md.Index] = canv;
                };
                SonicManager.prototype.drawSonic = function (canvas) {
                    if (this.currentGameState == Enums_1.GameState.Playing) {
                        this.sonicToon.draw(canvas);
                    }
                };
                SonicManager.prototype.drawRings = function (canvas, localPoint) {
                    for (var index = 0; index < this.sonicLevel.rings.length; index++) {
                        var r = this.sonicLevel.rings[index];
                        switch (this.currentGameState) {
                            case Enums_1.GameState.Playing:
                                if (!this.sonicToon.obtainedRing[index]) {
                                    if (this.bigWindowLocation.Intersects(r))
                                        this.goodRing.Draw(canvas, r.Negate(this.windowLocation.x | 0, this.windowLocation.y | 0));
                                }
                                break;
                            case Enums_1.GameState.Editing:
                                if (this.bigWindowLocation.Intersects(r))
                                    this.goodRing.Draw(canvas, r.Negate(this.windowLocation.x | 0, this.windowLocation.y | 0));
                                break;
                        }
                    }
                    switch (this.currentGameState) {
                        case Enums_1.GameState.Playing:
                            for (var i = this.activeRings.length - 1; i >= 0; i--) {
                                var ac = this.activeRings[i];
                                localPoint.x = ac.x - this.windowLocation.x | 0;
                                localPoint.y = ac.y - this.windowLocation.y | 0;
                                ac.Draw(canvas, localPoint);
                                if (ac.TickCount > 256)
                                    this.activeRings.splice(i, 1);
                            }
                            break;
                        case Enums_1.GameState.Editing:
                            break;
                    }
                };
                SonicManager.prototype.drawAnimations = function (canvas) {
                    for (var _i = 0, _a = this.animationInstances; _i < _a.length; _i++) {
                        var ano = _a[_i];
                        ano.Draw(canvas, -this.windowLocation.x | 0, -this.windowLocation.y | 0);
                    }
                };
                SonicManager.prototype.drawObjects = function (canvas, localPoint) {
                    var levelObjectInfos = this.sonicLevel.objects;
                    for (var _i = 0, levelObjectInfos_2 = levelObjectInfos; _i < levelObjectInfos_2.length; _i++) {
                        var o = levelObjectInfos_2[_i];
                        localPoint.x = o.x;
                        localPoint.y = o.y;
                        if (o.dead || this.bigWindowLocation.Intersects(localPoint)) {
                            o.draw(canvas, ((localPoint.x - this.windowLocation.x)) | 0, ((localPoint.y - this.windowLocation.y)) | 0, this.showHeightMap);
                        }
                    }
                };
                SonicManager.prototype.containsAnimatedTile = function (tile, sonLevel) {
                    for (var _i = 0, _a = sonLevel.tileAnimations; _i < _a.length; _i++) {
                        var an = _a[_i];
                        var anin = an.AnimationTileIndex;
                        var num = an.NumberOfTiles;
                        if (tile >= anin && tile < anin + num)
                            return an;
                    }
                    return null;
                };
                SonicManager.prototype.clearCache = function () {
                    if (this.spriteCache != null)
                        this.spriteCache.ClearCache();
                    if (this.sonicLevel != null)
                        this.sonicLevel.clearCache();
                    if (this.tilePaletteAnimationManager != null)
                        this.tilePaletteAnimationManager.ClearCache();
                    if (this.tileAnimationManager != null)
                        this.tileAnimationManager.ClearCache();
                };
                SonicManager.prototype.mouseUp = function (queryEvent) {
                    this.clicking = false;
                    return false;
                };
                SonicManager.prototype.mouseMove = function (queryEvent) {
                    if (this.clicking)
                        if (this.effectClick(queryEvent))
                            return true;
                    return false;
                };
                SonicManager.prototype.ReplaceMagic = function () {
                    this.Replace(new Utils_1.Rectangle(0, 0, 15, 30), new Utils_1.Point(712, 40));
                };
                SonicManager.prototype.Replace = function (from, to) {
                    var _this = this;
                    var _loop_1 = function(y) {
                        var curY = y;
                        window.setTimeout(function () {
                            for (var x = 0; x < from.Width; x++) {
                                var toChunkX = (to.x + x) / 8;
                                var toChunkY = (to.y + curY) / 8;
                                var tochunk = _this.sonicLevel.getChunkAt(toChunkX, toChunkY);
                                tochunk.clearCache();
                                var totp = tochunk.TilePieces[(to.x + x) - toChunkX * 8][(to.y + curY) - toChunkY * 8];
                                tochunk.IsOnlyBackground = null;
                                tochunk.IsOnlyForeground = null;
                                var fromChunkX = (from.x + x) / 8 | 0;
                                var fromChunkY = (from.y + curY) / 8 | 0;
                                var fromchunk = _this.sonicLevel.getChunkAt(fromChunkX, fromChunkY);
                                fromchunk.clearCache();
                                fromchunk.IsOnlyBackground = null;
                                fromchunk.IsOnlyForeground = null;
                                var fromtp = fromchunk.TilePieces[(from.x + x) - fromChunkX * 8][(from.y + curY) - fromChunkY * 8];
                                tochunk.TilePieces[(to.x + x) - toChunkX * 8][(to.y + curY) - toChunkY * 8] = fromtp;
                                fromchunk.TilePieces[(from.x + x) - fromChunkX * 8][(from.y + curY) - fromChunkY * 8] = totp;
                            }
                        }, (from.Height - y) * 50);
                    };
                    for (var y = from.Height; y >= 0; y--) {
                        _loop_1(y);
                    }
                };
                SonicManager.prototype.cacheTiles = function () {
                    console.time("tileCache");
                    this.tilePaletteAnimationManager = new TilePaletteAnimationManager_1.TilePaletteAnimationManager(this);
                    this.tileAnimationManager = new TileAnimationManager_1.TileAnimationManager(this);
                    for (var _i = 0, _a = this.sonicLevel.tileChunks; _i < _a.length; _i++) {
                        var chunk = _a[_i];
                        chunk.initCache();
                        chunk.warmCache();
                    }
                    console.timeEnd("tileCache");
                    //this.debugDraw();
                };
                SonicManager.prototype.debugDraw = function () {
                    var numWide = 10;
                    var dropOffIndex = 0;
                    var pieces = new Array();
                    while (true) {
                        var debugCanvases = new Array();
                        var totalHeight = 0;
                        var broke = false;
                        for (var index = dropOffIndex; index < this.sonicLevel.tileChunks.length; index++) {
                            var chunk = this.sonicLevel.tileChunks[index];
                            var canvasCache = chunk.Debug_DrawCache();
                            totalHeight += canvasCache.canvas.height;
                            debugCanvases.push(canvasCache);
                            if (totalHeight > 10000) {
                                dropOffIndex = index + 1;
                                broke = true;
                                break;
                            }
                        }
                        var bigOne = CanvasInformation_1.CanvasInformation.create(numWide * 128, totalHeight, false);
                        var currentPosition = 0;
                        for (var index = 0; index < debugCanvases.length; index++) {
                            var canvasInformation = debugCanvases[index];
                            bigOne.Context.drawImage(canvasInformation.canvas, 0, currentPosition);
                            currentPosition += canvasInformation.canvas.height;
                        }
                        pieces.push(bigOne.canvas.toDataURL());
                        if (!broke)
                            break;
                    }
                    var str = "<html><body>";
                    for (var _i = 0, pieces_1 = pieces; _i < pieces_1.length; _i++) {
                        var piece = pieces_1[_i];
                        str += "<img src=\"" + piece + "\"/>\n";
                    }
                    str += "</body></html>";
                    var tx = document.createElement("textarea");
                    tx.style.position = "absolute";
                    tx.value = str;
                    document.body.appendChild(tx);
                };
                SonicManager.prototype.loadObjects = function (objects) {
                    this.cachedObjects = {};
                    var _loop_2 = function() {
                        var o = t.key;
                        if (this_1.cachedObjects[o]) {
                            t.setObjectData(this_1.cachedObjects[o]);
                            return "continue";
                        }
                        var d = objects.filter(function (p) { return p.key == o; })[0];
                        if (!d) {
                            t.setObjectData(new LevelObject_1.LevelObject(o));
                            return "continue";
                        }
                        var dat = void 0;
                        if (d.value.length == 0)
                            dat = new LevelObjectData_1.LevelObjectData();
                        else
                            dat = JSON.parse(d.value);
                        var dr = ObjectManager_1.ObjectManager.ExtendObject(dat);
                        this_1.cachedObjects[o] = dr;
                        t.setObjectData(dr);
                    };
                    var this_1 = this;
                    for (var _i = 0, _a = this.sonicLevel.objects; _i < _a.length; _i++) {
                        var t = _a[_i];
                        var state_2 = _loop_2();
                        if (state_2 === "continue") continue;
                    }
                };
                SonicManager.prototype.downloadObjects = function (objects) {
                    var _this = this;
                    $.getJSON('https://api.oursonic.org/objects?object-keys=' + objects.join('~')).then(function (data) {
                        console.log(data);
                        _this.loadObjects(data);
                    });
                };
                SonicManager.prototype.Load = function (sonicLevel) {
                    var _this = this;
                    this.loading = true;
                    this.sonicLevel = new SonicLevel_1.SonicLevel();
                    for (var n = 0; n < sonicLevel.Rings.length; n++) {
                        this.sonicLevel.rings[n] = new Ring_1.Ring(true);
                        this.sonicLevel.rings[n].x = sonicLevel.Rings[n].X;
                        this.sonicLevel.rings[n].y = sonicLevel.Rings[n].Y;
                    }
                    this.sonicLevel.levelWidth = sonicLevel.ForegroundWidth;
                    this.sonicLevel.levelHeight = sonicLevel.ForegroundHeight;
                    this.sonicLevel.chunkMap = sonicLevel.Foreground;
                    this.sonicLevel.bgChunkMap = sonicLevel.Background;
                    for (var l = 0; l < sonicLevel.Objects.length; l++) {
                        this.sonicLevel.objects[l] = new LevelObjectInfo_1.LevelObjectInfo(sonicLevel.Objects[l]);
                        this.sonicLevel.objects[l].index = l;
                    }
                    var objectKeys = new Array();
                    this.sonicLevel.objects.forEach(function (t) {
                        var o = t.key;
                        if (objectKeys.filter(function (p) { return p != o; }).length == objectKeys.length)
                            objectKeys.push(o);
                    });
                    this.downloadObjects(objectKeys);
                    for (var j = 0; j < sonicLevel.Tiles.length; j++) {
                        var fc = sonicLevel.Tiles[j];
                        var tiles = fc;
                        var mj = new Array();
                        for (var i = 0; i < tiles.length; i++) {
                            var value = sonicLevel.Tiles[j][i];
                            mj.push((value >> 4));
                            mj.push((value & 0xF));
                        }
                        var mfc = new Array(8);
                        for (var o = 0; o < 8; o++) {
                            mfc[o] = new Array(8);
                        }
                        for (var n = 0; n < mj.length; n++) {
                            mfc[n % 8][n / 8 | 0] = mj[n];
                        }
                        this.sonicLevel.tiles[j] = new Tile_1.Tile(mfc);
                        this.sonicLevel.tiles[j].index = j;
                    }
                    var acs = this.sonicLevel.animatedChunks = new Array();
                    if (sonicLevel.AnimatedFiles) {
                        this.sonicLevel.animatedTileFiles = new Array(sonicLevel.AnimatedFiles.length);
                        for (var animatedFileIndex = 0; animatedFileIndex < sonicLevel.AnimatedFiles.length; animatedFileIndex++) {
                            var animatedFile = sonicLevel.AnimatedFiles[animatedFileIndex];
                            this.sonicLevel.animatedTileFiles[animatedFileIndex] = new Array(animatedFile.length);
                            for (var filePiece = 0; filePiece < animatedFile.length; filePiece++) {
                                var c = animatedFile[filePiece];
                                var tiles = c;
                                var mjc = new Array();
                                for (var l = 0; l < tiles.length; l++) {
                                    var value = animatedFile[filePiece][l];
                                    mjc.push((value >> 4));
                                    mjc.push((value & 0xF));
                                }
                                var mfc = new Array(8);
                                for (var o = 0; o < 8; o++) {
                                    mfc[o] = new Array(8);
                                }
                                for (var n = 0; n < mjc.length; n++) {
                                    mfc[n % 8][n / 8 | 0] = mjc[n];
                                }
                                var tile = new Tile_1.Tile(mfc);
                                tile.isTileAnimated = true;
                                tile.index = filePiece * 10000 + animatedFileIndex;
                                this.sonicLevel.animatedTileFiles[animatedFileIndex][filePiece] = tile;
                            }
                        }
                    }
                    for (var j = 0; j < sonicLevel.Blocks.length; j++) {
                        var fc = sonicLevel.Blocks[j];
                        var mj = new TilePiece_1.TilePiece();
                        mj.Index = j;
                        mj.Tiles = new Array();
                        for (var p = 0; p < fc.length; p++) {
                            mj.Tiles.push(Help_1.Help.merge(new TileInfo_1.TileInfo(), {
                                _Tile: fc[p].Tile,
                                Index: p,
                                Palette: fc[p].Palette,
                                Priority: fc[p].Priority,
                                XFlip: fc[p].XFlip,
                                YFlip: fc[p].YFlip
                            }));
                        }
                        mj.Init();
                        this.sonicLevel.tilePieces[j] = mj;
                    }
                    this.sonicLevel.angles = sonicLevel.Angles;
                    this.sonicLevel.tileAnimations = sonicLevel.Animations.map(function (a) { return Help_1.Help.merge(new TileAnimationData_1.TileAnimationData(), {
                        AnimationTileFile: a.AnimationFile,
                        AnimationTileIndex: a.AnimationTileIndex,
                        AutomatedTiming: a.AutomatedTiming,
                        NumberOfTiles: a.NumberOfTiles,
                        DataFrames: a.Frames.map(function (b) { return Help_1.Help.merge(new TileAnimationData_1.TileAnimationDataFrame(), {
                            Ticks: b.Ticks,
                            StartingTileIndex: b.StartingTileIndex
                        }); }).slice(0)
                    }); });
                    this.sonicLevel.collisionIndexes1 = sonicLevel.CollisionIndexes1;
                    this.sonicLevel.collisionIndexes2 = sonicLevel.CollisionIndexes2;
                    for (var i = 0; i < sonicLevel.HeightMaps.length; i++) {
                        /* let b1 = true;
                         let b2 = true;
                         for (let m: number = 0; m < sonicLevel.HeightMaps[i].length; m++) {
                             if (b1 && sonicLevel.HeightMaps[i][m] !== 0)
                                 b1 = false;
                             if (b2 && sonicLevel.HeightMaps[i][m] !== 16)
                                 b2 = false;
                         }
                         if (b1) {
                             this.sonicLevel.heightMaps[i] = HeightMap.fullHeight(false);
                         }
                         else if (b2) {
                             this.sonicLevel.heightMaps[i] = HeightMap.fullHeight(true);
                         }*/
                        this.sonicLevel.heightMaps[i] = new HeightMap_1.HeightMap(sonicLevel.HeightMaps[i], i);
                    }
                    for (var j = 0; j < sonicLevel.Chunks.length; j++) {
                        var fc = sonicLevel.Chunks[j];
                        var mj = new TileChunk_1.TileChunk();
                        mj.Index = j;
                        mj.TilePieces = new Array(8);
                        for (var i = 0; i < 8; i++) {
                            mj.TilePieces[i] = new Array(8);
                        }
                        for (var p = 0; p < fc.length; p++) {
                            mj.TilePieces[p % 8][(p / 8) | 0] = Help_1.Help.merge(new TilePieceInfo_1.TilePieceInfo(), {
                                Index: p,
                                Block: fc[p].Block,
                                Solid1: fc[p].Solid1,
                                Solid2: fc[p].Solid2,
                                XFlip: fc[p].XFlip,
                                YFlip: fc[p].YFlip
                            });
                        }
                        this.sonicLevel.tileChunks[j] = mj;
                        mj.TileAnimations = {};
                        for (var tpX = 0; tpX < mj.TilePieces.length; tpX++) {
                            for (var tpY = 0; tpY < mj.TilePieces[tpX].length; tpY++) {
                                var pm = mj.TilePieces[tpX][tpY].getTilePiece();
                                if (pm != null) {
                                    for (var _i = 0, _a = pm.Tiles; _i < _a.length; _i++) {
                                        var mjc = _a[_i];
                                        var fa = this.containsAnimatedTile(mjc._Tile, this.sonicLevel);
                                        if (fa) {
                                            mj.TileAnimations[tpY * 8 + tpX] = fa;
                                            acs[j] = mj;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.sonicLevel.palette = sonicLevel.Palette.map(function (a) { return a.map(function (b) { return "#" + b; }); });
                    this.sonicLevel.startPositions = sonicLevel.StartPositions.map(function (a) { return new Utils_1.Point(a.X, a.Y); });
                    this.sonicLevel.animatedPalettes = new Array();
                    if (sonicLevel.PaletteItems.length > 0) {
                        for (var k = 0; k < sonicLevel.PaletteItems[0].length; k++) {
                            var pal = sonicLevel.PaletteItems[0][k];
                            this.sonicLevel.animatedPalettes.push(Help_1.Help.merge(new SonicLevel_1.PaletteItem(), {
                                Palette: eval(pal.Palette).map(function (b) { return "#" + b; }),
                                SkipIndex: pal.SkipIndex,
                                TotalLength: pal.TotalLength,
                                Pieces: pal.Pieces.map(function (a) { return Help_1.Help.merge(new SonicLevel_1.PaletteItemPieces(), {
                                    PaletteIndex: a.PaletteIndex,
                                    PaletteMultiply: a.PaletteMultiply,
                                    PaletteOffset: a.PaletteOffset
                                }); })
                            }));
                        }
                    }
                    for (var _b = 0, _c = this.sonicLevel.tilePieces; _b < _c.length; _b++) {
                        var tilePiece = _c[_b];
                        tilePiece.AnimatedPaletteIndexes = new Array();
                        tilePiece.AnimatedTileIndexes = new Array();
                        if (this.sonicLevel.animatedPalettes.length > 0) {
                            for (var _d = 0, _e = tilePiece.Tiles; _d < _e.length; _d++) {
                                var mj = _e[_d];
                                var tile = mj.GetTile();
                                if (tile) {
                                    tile.animatedPaletteIndexes = new Array();
                                    var pl = tile.GetAllPaletteIndexes();
                                    tile.paletteIndexesToBeAnimated = {};
                                    tile.animatedTileIndexes = new Array();
                                    for (var tileAnimationIndex = 0; tileAnimationIndex < this.sonicLevel.tileAnimations.length; tileAnimationIndex++) {
                                        var tileAnimationData = this.sonicLevel.tileAnimations[tileAnimationIndex];
                                        var anin = tileAnimationData.AnimationTileIndex;
                                        var num = tileAnimationData.NumberOfTiles;
                                        if (tile.index >= anin && tile.index < anin + num) {
                                            tilePiece.AnimatedTileIndexes.push(tileAnimationIndex);
                                            tile.animatedTileIndexes.push(tileAnimationIndex);
                                        }
                                    }
                                    for (var animatedPaletteIndex = 0; animatedPaletteIndex < this.sonicLevel.animatedPalettes.length; animatedPaletteIndex++) {
                                        var pal = this.sonicLevel.animatedPalettes[animatedPaletteIndex];
                                        tile.paletteIndexesToBeAnimated[animatedPaletteIndex] = new Array();
                                        var _loop_3 = function(mjce) {
                                            var mje1 = mjce;
                                            if (mj.Palette == mje1.PaletteIndex) {
                                                if (pl.filter(function (j) { return j == (mje1.PaletteOffset / 2 | 0) || j == (mje1.PaletteOffset / 2 | 0) + 1; }).length > 0) {
                                                    tilePiece.AnimatedPaletteIndexes.push(animatedPaletteIndex);
                                                    tile.animatedPaletteIndexes.push(animatedPaletteIndex);
                                                    for (var _f = 0, pl_1 = pl; _f < pl_1.length; _f++) {
                                                        var pIndex = pl_1[_f];
                                                        if (pIndex == (mje1.PaletteOffset / 2 | 0) || pIndex == (mje1.PaletteOffset / 2 | 0) + 1) {
                                                            tile.paletteIndexesToBeAnimated[animatedPaletteIndex].push(pIndex);
                                                        }
                                                    }
                                                }
                                            }
                                        };
                                        for (var _g = 0, _h = pal.Pieces; _g < _h.length; _g++) {
                                            var mjce = _h[_g];
                                            _loop_3(mjce);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    var finished = (function () {
                        _this.loading = false;
                    });
                    this.preloadSprites(function () {
                        finished();
                        _this.forceResize();
                    }, function (s) {
                    });
                    this.forceResize();
                    this.onLevelLoad && this.onLevelLoad(this.sonicLevel);
                };
                SonicManager._cachedOffs = {};
                return SonicManager;
            }());
            exports_1("SonicManager", SonicManager);
            PixelScaleManager = (function () {
                function PixelScaleManager() {
                    this.cachedImageDatas = {};
                    this.cachedCanvases = {};
                    this.cached32BitArrays = {};
                    this.cachedPosLookups = {};
                }
                PixelScaleManager.prototype.scale = function (context, pixelScale, width, height) {
                    if (pixelScale == 0)
                        return context.canvas;
                    var startingPixelScale = pixelScale;
                    var imageData = context.getImageData(0, 0, width, height).data;
                    while (pixelScale > 0) {
                        var nScale = Math.pow(2, (startingPixelScale - pixelScale));
                        imageData = this.scaleIt(imageData, width * nScale, height * nScale);
                        pixelScale--;
                    }
                    var f = Math.pow(2, startingPixelScale);
                    var largeImageData = this.cachedImageData(context, width * f, height * f);
                    largeImageData.data.set(imageData);
                    var newC = this.cachedCanvas(largeImageData.width, largeImageData.height);
                    newC.context.putImageData(largeImageData, 0, 0);
                    return newC.canvas;
                };
                PixelScaleManager.prototype.getPixelScale = function (pixelScale) {
                    var nScale = Math.pow(2, pixelScale);
                    return { x: 1 / nScale, y: 1 / nScale };
                };
                PixelScaleManager.prototype.scaleIt = function (pixels_, width, height) {
                    var width2 = width * 2;
                    var height2 = height * 2;
                    var pixels2_ = PixelScaleManager.cachedArray(width2 * height2);
                    var posLookup = this.getPosLookup(width, height);
                    var colsLookup = this.getColsLookup(pixels_, width, height);
                    var cc = 0;
                    for (var y = 0; y < height; y++) {
                        for (var x = 0; x < width; x++) {
                            var Bid = posLookup.top[cc];
                            var Did = posLookup.left[cc];
                            var Eid = posLookup.middle[cc];
                            var Fid = posLookup.right[cc];
                            var Hid = posLookup.bottom[cc];
                            cc++;
                            /*
                             var B = (((pixels_[Bid] << 8) + pixels_[Bid + 1]) << 8) + pixels_[Bid + 2];
                             var D = (((pixels_[Did] << 8) + pixels_[Did + 1]) << 8) + pixels_[Did + 2];
                             var F = (((pixels_[Fid] << 8) + pixels_[Fid + 1]) << 8) + pixels_[Fid + 2];
                             var H = (((pixels_[Hid] << 8) + pixels_[Hid + 1]) << 8) + pixels_[Hid + 2];
                             */
                            var B = colsLookup[Bid];
                            var D = colsLookup[Did];
                            var F = colsLookup[Fid];
                            var H = colsLookup[Hid];
                            var E0, E1, E2, E3;
                            if (B !== (H) && D !== (F)) {
                                E0 = D == (B) ? Did : Eid;
                                E1 = B == (F) ? Fid : Eid;
                                E2 = D == (H) ? Did : Eid;
                                E3 = H == (F) ? Fid : Eid;
                            }
                            else {
                                E0 = Eid;
                                E1 = Eid;
                                E2 = Eid;
                                E3 = Eid;
                            }
                            var tl = (((y * 2) * width2 + (x * 2)) * 4);
                            var tr = (((y * 2) * width2 + (x * 2 + 1)) * 4);
                            var bl = (((y * 2 + 1) * width2 + (x * 2)) * 4);
                            var br = (((y * 2 + 1) * width2 + (x * 2 + 1)) * 4);
                            pixels2_[tl] = pixels_[E0];
                            pixels2_[tr] = pixels_[E1];
                            pixels2_[bl] = pixels_[E2];
                            pixels2_[br] = pixels_[E3];
                            pixels2_[tl + 1] = pixels_[E0 + 1];
                            pixels2_[tr + 1] = pixels_[E1 + 1];
                            pixels2_[bl + 1] = pixels_[E2 + 1];
                            pixels2_[br + 1] = pixels_[E3 + 1];
                            pixels2_[tl + 2] = pixels_[E0 + 2];
                            pixels2_[tr + 2] = pixels_[E1 + 2];
                            pixels2_[bl + 2] = pixels_[E2 + 2];
                            pixels2_[br + 2] = pixels_[E3 + 2];
                        }
                    }
                    return pixels2_;
                };
                PixelScaleManager.prototype.getPosLookup = function (width, height) {
                    var posLookup = this.cachedPosLookups[width * height];
                    if (posLookup)
                        return posLookup;
                    posLookup = this.cachedPosLookups[width * height] = {
                        left: new Uint32Array(width * height),
                        right: new Uint32Array(width * height),
                        top: new Uint32Array(width * height),
                        bottom: new Uint32Array(width * height),
                        middle: new Uint32Array(width * height)
                    };
                    var cc = 0;
                    for (var y = 0; y < height; y++) {
                        for (var x = 0; x < width; x++) {
                            posLookup.top[cc] = PixelScaleManager._top(x, y, width, height);
                            posLookup.left[cc] = PixelScaleManager._left(x, y, width, height);
                            posLookup.middle[cc] = ((y) * width + (x)) * 4;
                            posLookup.right[cc] = PixelScaleManager._right(x, y, width, height);
                            posLookup.bottom[cc] = PixelScaleManager._bottom(x, y, width, height);
                            cc++;
                        }
                    }
                    return posLookup;
                };
                PixelScaleManager.prototype.getColsLookup = function (imageData, width, height) {
                    var cols = this.cached32BitArray(width * height * 4);
                    var pixels_ = imageData;
                    var cc = 0;
                    for (var y = 0; y < height; y++) {
                        for (var x = 0; x < width; x++) {
                            cols[cc] = (((pixels_[(y * width + x) * 4] << 8) + pixels_[(y * width + x) * 4 + 1]) << 8) + pixels_[(y * width + x) * 4 + 2];
                            cc += 4;
                        }
                    }
                    return cols;
                };
                PixelScaleManager._top = function (x, y, width, height) {
                    if (y <= 0)
                        return ((y) * width + (x)) * 4;
                    else
                        return ((y - 1) * width + (x)) * 4;
                };
                PixelScaleManager._left = function (x, y, width, height) {
                    if (x <= 0)
                        return ((y) * width + (x)) * 4;
                    else
                        return ((y) * width + (x - 1)) * 4;
                };
                PixelScaleManager._right = function (x, y, width, height) {
                    if (x + 1 >= width)
                        return ((y) * width + (x)) * 4;
                    else
                        return ((y) * width + (x + 1)) * 4;
                };
                PixelScaleManager._bottom = function (x, y, width, height) {
                    if (y + 1 >= height)
                        return ((y) * width + (x)) * 4;
                    else
                        return ((y + 1) * width + (x)) * 4;
                };
                PixelScaleManager.prototype.cachedImageData = function (canvas, width, height) {
                    var s = ((width) + " " + (height));
                    if (this.cachedImageDatas[s]) {
                        return this.cachedImageDatas[s];
                    }
                    return this.cachedImageDatas[s] = canvas.createImageData(width, height);
                };
                ;
                PixelScaleManager.prototype.cachedCanvas = function (width, height) {
                    var s = (width + " " + height);
                    var tempCnv = this.cachedCanvases[s];
                    if (tempCnv) {
                        return tempCnv;
                    }
                    var newCanvas = document.createElement('canvas');
                    newCanvas.width = width;
                    newCanvas.height = height;
                    var newContext = newCanvas.getContext('2d');
                    newContext.mozImageSmoothingEnabled = false; /// future
                    newContext.msImageSmoothingEnabled = false; /// future
                    newContext.imageSmoothingEnabled = false; /// future
                    return this.cachedCanvases[s] = {
                        canvas: newCanvas,
                        context: newContext
                    };
                };
                PixelScaleManager.cachedArray = function (size) {
                    var tmp = PixelScaleManager.cachedArrays[size];
                    if (tmp) {
                        return tmp;
                    }
                    tmp = PixelScaleManager.cachedArrays[size] = new Uint8ClampedArray(size * 4);
                    for (var s = 0; s < size * 4; s++) {
                        tmp[s] = 255;
                    }
                    return tmp;
                };
                PixelScaleManager.prototype.cached32BitArray = function (size) {
                    var tmp = this.cached32BitArrays[size];
                    if (tmp) {
                        return tmp;
                    }
                    return this.cached32BitArrays[size] = new Uint32Array(size);
                };
                PixelScaleManager.cachedArrays = {};
                return PixelScaleManager;
            }());
        }
    }
});
//# sourceMappingURL=SonicManager.js.map