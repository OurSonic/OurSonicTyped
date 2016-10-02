System.register(["../../../common/Utils", "../../SonicManager", "../../../common/CanvasInformation", "../../../common/Enums"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utils_1, SonicManager_1, CanvasInformation_1, Enums_1;
    var TileChunk, TileChunkDebugDrawOptions, ChunkLayer, PaletteAnimationCanvasFrames, PaletteAnimationCanvasFrame, TileAnimationCanvasFrames, TileAnimationCanvasFrame;
    return {
        setters:[
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            },
            function (CanvasInformation_1_1) {
                CanvasInformation_1 = CanvasInformation_1_1;
            },
            function (Enums_1_1) {
                Enums_1 = Enums_1_1;
            }],
        execute: function() {
            TileChunk = (function () {
                function TileChunk() {
                    this.myLocalPoint = new Utils_1.Point(0, 0);
                    this.IsOnlyBackground = null;
                }
                TileChunk.prototype.GetTilePieceAt = function (x, y, large) {
                    return this.GetTilePieceInfo(x, y, large).GetTilePiece();
                };
                TileChunk.prototype.SetTilePieceAt = function (x, y, tp, large) {
                    if (this.GetTilePieceInfo(x, y, large).SetTilePiece(tp))
                        this.clearCache();
                };
                TileChunk.prototype.GetTilePieceInfo = function (x, y, large) {
                    if (large) {
                        return this.TilePieces[(x / TileChunk.TilePiecesSquareSize) | 0][(y / TileChunk.TilePiecesSquareSize) | 0];
                    }
                    else {
                        return this.TilePieces[x][y];
                    }
                };
                TileChunk.prototype.onlyBackground = function () {
                    if (!this.IsOnlyBackground) {
                        for (var _i = 0, _a = this.EachPiece(); _i < _a.length; _i++) {
                            var tilePiece = _a[_i];
                            if (!tilePiece.OnlyBackground())
                                return (this.IsOnlyBackground = false);
                        }
                        this.IsOnlyBackground = true;
                        return this.IsOnlyBackground;
                    }
                    return this.IsOnlyBackground;
                };
                TileChunk.prototype.OnlyForeground = function () {
                    if (!this.IsOnlyForeground) {
                        for (var _i = 0, _a = this.EachPiece(); _i < _a.length; _i++) {
                            var tilePiece = _a[_i];
                            if (!tilePiece.OnlyForeground()) {
                                return (this.IsOnlyForeground = false);
                            }
                        }
                        this.IsOnlyForeground = true;
                        return this.IsOnlyForeground;
                    }
                    return this.IsOnlyForeground;
                };
                TileChunk.prototype.isEmpty = function () {
                    if (!this.Empty) {
                        for (var _i = 0, _a = this.EachPiece(); _i < _a.length; _i++) {
                            var tilePiece = _a[_i];
                            if (tilePiece.Index != 0) {
                                return (this.Empty = false);
                            }
                        }
                        this.Empty = true;
                    }
                    return this.Empty;
                };
                TileChunk.prototype.EachPiece = function () {
                    var __result = [];
                    for (var pieceY = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
                        for (var pieceX = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                            var tilePiece = this.TilePieces[pieceX][pieceY].GetTilePiece();
                            if (tilePiece != null) {
                                __result.push(tilePiece);
                            }
                        }
                    }
                    return __result;
                };
                TileChunk.prototype.hasPixelAnimations = function () {
                    return this.getAllPaletteAnimationIndexes().length > 0;
                };
                TileChunk.prototype.HasTileAnimations = function () {
                    return this.getAllTileAnimationIndexes().length > 0;
                };
                TileChunk.prototype.getAllPaletteAnimationIndexes = function () {
                    if (this.paletteAnimationIndexes == null) {
                        this.paletteAnimationIndexes = [];
                        for (var _i = 0, _a = this.EachPiece(); _i < _a.length; _i++) {
                            var tilePiece = _a[_i];
                            if (tilePiece.AnimatedPaletteIndexes == null)
                                continue;
                            for (var _b = 0, _c = tilePiece.AnimatedPaletteIndexes; _b < _c.length; _b++) {
                                var animatedPaletteIndex = _c[_b];
                                if (this.paletteAnimationIndexes.indexOf(animatedPaletteIndex) == -1) {
                                    this.paletteAnimationIndexes.push(animatedPaletteIndex);
                                }
                            }
                        }
                    }
                    return this.paletteAnimationIndexes;
                };
                TileChunk.prototype.getAllTileAnimationIndexes = function () {
                    if (this.tileAnimationIndexes == null) {
                        this.tileAnimationIndexes = [];
                        for (var _i = 0, _a = this.EachPiece(); _i < _a.length; _i++) {
                            var tilePiece = _a[_i];
                            for (var _b = 0, _c = tilePiece.Tiles; _b < _c.length; _b++) {
                                var tileInfo = _c[_b];
                                var tile = tileInfo.GetTile();
                                if (tile == null)
                                    continue;
                                if (tile.animatedTileIndexes == null)
                                    continue;
                                for (var _d = 0, _e = tile.animatedTileIndexes; _d < _e.length; _d++) {
                                    var animatedTileIndex = _e[_d];
                                    if (this.tileAnimationIndexes.indexOf(animatedTileIndex) == -1) {
                                        this.tileAnimationIndexes.push(animatedTileIndex);
                                    }
                                }
                            }
                        }
                    }
                    return this.tileAnimationIndexes;
                };
                TileChunk.prototype.neverAnimates = function () {
                    return !(this.HasTileAnimations() || this.hasPixelAnimations());
                };
                TileChunk.prototype.draw = function (canvas, position, layer) {
                    canvas.save();
                    {
                        canvas.drawImage(this.baseCanvasCache[layer].canvas, position.x, position.y);
                        if (this.hasPixelAnimations()) {
                            var paletteAnimationCanvases = this.paletteAnimationCanvasesCache[layer];
                            for (var _i = 0, _a = this.getAllPaletteAnimationIndexes(); _i < _a.length; _i++) {
                                var paletteAnimationIndex = _a[_i];
                                var paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex];
                                if (paletteAnimationCanvasFrames == null)
                                    continue;
                                var currentFrame = SonicManager_1.SonicManager.instance.tilePaletteAnimationManager.getCurrentFrame(paletteAnimationIndex);
                                this.currentPaletteAnimationFrameIndexCache[paletteAnimationIndex] = currentFrame.FrameIndex;
                                var paletteAnimationCanvasFrame = paletteAnimationCanvasFrames.frames[currentFrame.FrameIndex];
                                var canvasLayerToDraw = paletteAnimationCanvasFrame.canvas.canvas;
                                canvas.drawImage(canvasLayerToDraw, position.x + paletteAnimationCanvasFrames.position.x, position.y + paletteAnimationCanvasFrames.position.y);
                            }
                        }
                        if (this.HasTileAnimations()) {
                            var tileAnimationCanvases = this.tileAnimationCanvasesCache[layer];
                            for (var _b = 0, _c = this.getAllTileAnimationIndexes(); _b < _c.length; _b++) {
                                var tileAnimationIndex = _c[_b];
                                var tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex];
                                if (tileAnimationCanvasFrames == null)
                                    continue;
                                var currentFrame = SonicManager_1.SonicManager.instance.tileAnimationManager.getCurrentFrame(tileAnimationIndex);
                                this.currentTileAnimationFrameIndexCache[tileAnimationIndex] = currentFrame.frameIndex;
                                var tileAnimationCanvasFrame = tileAnimationCanvasFrames.frames[currentFrame.frameIndex];
                                var canvasLayerToDraw = tileAnimationCanvasFrame.canvas.canvas;
                                canvas.drawImage(canvasLayerToDraw, position.x + tileAnimationCanvasFrames.position.x, position.y + tileAnimationCanvasFrames.position.y);
                            }
                        }
                    }
                    canvas.restore();
                };
                TileChunk.prototype.drawTilePiecesAnimatedPalette = function (canvas, layer, piecesSquareSize, animatedPaletteIndex) {
                    for (var pieceY = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
                        for (var pieceX = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                            var pieceInfo = this.TilePieces[pieceX][pieceY];
                            var piece = pieceInfo.GetTilePiece();
                            if (piece == null)
                                continue;
                            if (piece.AnimatedPaletteIndexes.indexOf(animatedPaletteIndex) == -1)
                                continue;
                            if (layer == Enums_1.ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                                continue;
                            this.myLocalPoint.x = pieceX * piecesSquareSize;
                            this.myLocalPoint.y = pieceY * piecesSquareSize;
                            piece.DrawAnimatedPalette(canvas, this.myLocalPoint, layer, pieceInfo.XFlip, pieceInfo.YFlip, animatedPaletteIndex);
                        }
                    }
                };
                TileChunk.prototype.drawTilePiecesAnimatedTile = function (canvas, layer, piecesSquareSize, animatedTileIndex) {
                    for (var pieceY = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
                        for (var pieceX = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                            var pieceInfo = this.TilePieces[pieceX][pieceY];
                            var piece = pieceInfo.GetTilePiece();
                            if (piece == null)
                                continue;
                            if (piece.AnimatedTileIndexes.indexOf(animatedTileIndex) == -1)
                                continue;
                            if (layer == Enums_1.ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                                continue;
                            this.myLocalPoint.x = pieceX * piecesSquareSize;
                            this.myLocalPoint.y = pieceY * piecesSquareSize;
                            piece.DrawAnimatedTile(canvas, this.myLocalPoint, layer, pieceInfo.XFlip, pieceInfo.YFlip, animatedTileIndex);
                        }
                    }
                };
                TileChunk.prototype.drawTilePiecesBase = function (canvas, layer, piecesSquareSize) {
                    for (var pieceY = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
                        for (var pieceX = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                            var pieceInfo = this.TilePieces[pieceX][pieceY];
                            var piece = pieceInfo.GetTilePiece();
                            if (piece == null)
                                continue;
                            if (layer == Enums_1.ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                                continue;
                            this.myLocalPoint.x = pieceX * piecesSquareSize;
                            this.myLocalPoint.y = pieceY * piecesSquareSize;
                            piece.DrawBase(canvas, this.myLocalPoint, layer, pieceInfo.XFlip, pieceInfo.YFlip);
                        }
                    }
                };
                /*cache */
                TileChunk.prototype.clearCache = function () {
                    this.initCache();
                    this.warmCache();
                };
                TileChunk.prototype.initCache = function () {
                    this.baseCanvasCache = new ChunkLayer();
                    this.paletteAnimationCanvasesCache = new ChunkLayer();
                    this.tileAnimationCanvasesCache = new ChunkLayer();
                    this.tileAnimationCanvasesCache[Enums_1.ChunkLayerState.Low] = {};
                    this.tileAnimationCanvasesCache[Enums_1.ChunkLayerState.High] = {};
                    this.paletteAnimationCanvasesCache[Enums_1.ChunkLayerState.Low] = {};
                    this.paletteAnimationCanvasesCache[Enums_1.ChunkLayerState.High] = {};
                    this.currentTileAnimationFrameIndexCache = [];
                    this.currentPaletteAnimationFrameIndexCache = [];
                };
                TileChunk.prototype.warmCache = function () {
                    this.cacheBase(Enums_1.ChunkLayerState.Low);
                    this.cacheBase(Enums_1.ChunkLayerState.High);
                    if (this.hasPixelAnimations()) {
                        this.cachePaletteAnimation(Enums_1.ChunkLayerState.Low);
                        this.cachePaletteAnimation(Enums_1.ChunkLayerState.High);
                    }
                    if (this.HasTileAnimations()) {
                        this.cacheTileAnimation(Enums_1.ChunkLayerState.Low);
                        this.cacheTileAnimation(Enums_1.ChunkLayerState.High);
                    }
                };
                TileChunk.prototype.cacheBase = function (layer) {
                    if (layer == Enums_1.ChunkLayerState.Low ? (this.OnlyForeground()) : (this.onlyBackground()))
                        return;
                    this.baseCanvasCache[layer] = CanvasInformation_1.CanvasInformation.create(TileChunk.TilePieceSideLength * TileChunk.TilePiecesSquareSize, TileChunk.TilePieceSideLength * TileChunk.TilePiecesSquareSize, false);
                    this.drawTilePiecesBase(this.baseCanvasCache[layer].Context, layer, TileChunk.TilePiecesSquareSize);
                };
                TileChunk.prototype.cachePaletteAnimation = function (layer) {
                    var paletteAnimationCanvases = this.paletteAnimationCanvasesCache[layer];
                    for (var _i = 0, _a = this.getAllPaletteAnimationIndexes(); _i < _a.length; _i++) {
                        var paletteAnimationIndex = _a[_i];
                        var rect = this.getAnimationPaletteSurfaceInformation(paletteAnimationIndex, layer);
                        if (rect == null) {
                            continue;
                        }
                        var paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex] = new PaletteAnimationCanvasFrames(paletteAnimationIndex);
                        var tilePaletteAnimation = SonicManager_1.SonicManager.instance.tilePaletteAnimationManager.Animations[paletteAnimationIndex];
                        paletteAnimationCanvasFrames.position = new Utils_1.Point(rect.x * TileChunk.TilePiecesSquareSize, rect.y * TileChunk.TilePiecesSquareSize);
                        for (var _b = 0, _c = tilePaletteAnimation.Frames; _b < _c.length; _b++) {
                            var currentFrame = _c[_b];
                            tilePaletteAnimation.CurrentFrame = currentFrame.FrameIndex;
                            var paletteAnimationCanvasFrame = paletteAnimationCanvasFrames.frames[currentFrame.FrameIndex] = new PaletteAnimationCanvasFrame();
                            currentFrame.SetPalette();
                            var tilePaletteCanvas = CanvasInformation_1.CanvasInformation.create(rect.Width * TileChunk.TilePiecesSquareSize, rect.Height * TileChunk.TilePiecesSquareSize, false);
                            paletteAnimationCanvasFrame.canvas = tilePaletteCanvas;
                            paletteAnimationCanvasFrame.canvas.Context.save();
                            paletteAnimationCanvasFrame.canvas.Context.translate(-rect.x * TileChunk.TilePiecesSquareSize, -rect.y * TileChunk.TilePiecesSquareSize);
                            this.drawTilePiecesAnimatedPalette(tilePaletteCanvas.Context, layer, TileChunk.TilePiecesSquareSize, paletteAnimationIndex);
                            paletteAnimationCanvasFrame.canvas.Context.restore();
                            currentFrame.ClearPalette();
                        }
                        tilePaletteAnimation.CurrentFrame = 0;
                    }
                };
                TileChunk.prototype.cacheTileAnimation = function (layer) {
                    var tileAnimationCanvases = this.tileAnimationCanvasesCache[layer];
                    for (var _i = 0, _a = this.getAllTileAnimationIndexes(); _i < _a.length; _i++) {
                        var tileAnimationIndex = _a[_i];
                        var rect = this.getAnimationTileSurfaceInformation(tileAnimationIndex, layer);
                        if (rect == null) {
                            continue;
                        }
                        var tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex] = new TileAnimationCanvasFrames(tileAnimationIndex);
                        var tileAnimation = SonicManager_1.SonicManager.instance.tileAnimationManager.Animations[tileAnimationIndex];
                        tileAnimationCanvasFrames.position = new Utils_1.Point(rect.x * TileChunk.TilePiecesSquareSize, rect.y * TileChunk.TilePiecesSquareSize);
                        for (var _b = 0, _c = tileAnimation.frames; _b < _c.length; _b++) {
                            var currentFrame = _c[_b];
                            var tileAnimationCanvasFrame = tileAnimationCanvasFrames.frames[currentFrame.frameIndex] = new TileAnimationCanvasFrame();
                            var tileTileCanvas = CanvasInformation_1.CanvasInformation.create(rect.Width * TileChunk.TilePiecesSquareSize, rect.Height * TileChunk.TilePiecesSquareSize, false);
                            tileAnimationCanvasFrame.canvas = tileTileCanvas;
                            tileAnimation.currentFrame = currentFrame.frameIndex;
                            tileAnimationCanvasFrame.canvas.Context.save();
                            tileAnimationCanvasFrame.canvas.Context.translate(-rect.x * TileChunk.TilePiecesSquareSize, -rect.y * TileChunk.TilePiecesSquareSize);
                            this.drawTilePiecesAnimatedTile(tileTileCanvas.Context, layer, TileChunk.TilePiecesSquareSize, tileAnimationIndex);
                            tileAnimationCanvasFrame.canvas.Context.restore();
                        }
                        tileAnimation.currentFrame = 0;
                    }
                };
                TileChunk.prototype.getAnimationTileSurfaceInformation = function (tileAnimationIndex, layer) {
                    var lowestX = 10000000;
                    var highestX = -10000000;
                    var lowestY = 10000000;
                    var highestY = -10000000;
                    for (var pieceY = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
                        for (var pieceX = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                            var pieceInfo = this.TilePieces[pieceX][pieceY];
                            var piece = pieceInfo.GetTilePiece();
                            if (piece == null)
                                continue;
                            if (layer == Enums_1.ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                                continue;
                            if (piece.AnimatedTileIndexes.indexOf(tileAnimationIndex) == -1)
                                continue;
                            if (pieceX < lowestX)
                                lowestX = pieceX;
                            if (pieceX > highestX)
                                highestX = pieceX;
                            if (pieceY < lowestY)
                                lowestY = pieceY;
                            if (pieceY > highestY)
                                highestY = pieceY;
                        }
                    }
                    if (lowestX == 10000000)
                        return null;
                    return new Utils_1.Rectangle(lowestX, lowestY, highestX - lowestX + 1, highestY - lowestY + 1);
                };
                TileChunk.prototype.getAnimationPaletteSurfaceInformation = function (paletteAnimationIndex, layer) {
                    var lowestX = 10000000;
                    var highestX = -10000000;
                    var lowestY = 10000000;
                    var highestY = -10000000;
                    for (var pieceY = 0; pieceY < TileChunk.TilePieceSideLength; pieceY++) {
                        for (var pieceX = 0; pieceX < TileChunk.TilePieceSideLength; pieceX++) {
                            var piece = this.TilePieces[pieceX][pieceY].GetTilePiece();
                            if (piece == null)
                                continue;
                            if (layer == Enums_1.ChunkLayerState.Low ? (piece.OnlyForeground()) : (piece.OnlyBackground()))
                                continue;
                            if (piece.AnimatedPaletteIndexes.indexOf(paletteAnimationIndex) == -1)
                                continue;
                            if (pieceX < lowestX)
                                lowestX = pieceX;
                            if (pieceX > highestX)
                                highestX = pieceX;
                            if (pieceY < lowestY)
                                lowestY = pieceY;
                            if (pieceY > highestY)
                                highestY = pieceY;
                        }
                    }
                    if (lowestX == 10000000)
                        return null;
                    return new Utils_1.Rectangle(lowestX, lowestY, highestX - lowestX + 1, highestY - lowestY + 1);
                };
                /*debug*/
                TileChunk.prototype.DrawAnimationDebug = function (canvas, position, layer, debugDrawOptions) {
                    if (debugDrawOptions == null)
                        return;
                    canvas.save();
                    canvas.fillStyle = "White";
                    canvas.textBaseline = "top";
                    {
                        var yOffset = layer == Enums_1.ChunkLayerState.Low ? 0 : 64;
                        if (debugDrawOptions.showBaseData) {
                            canvas.fillText("Base", position.x + 0, position.y + yOffset);
                        }
                        if (debugDrawOptions.showPaletteAnimationData) {
                            if (this.hasPixelAnimations()) {
                                var paletteAnimationCanvases = this.paletteAnimationCanvasesCache[layer];
                                for (var _i = 0, _a = this.getAllPaletteAnimationIndexes(); _i < _a.length; _i++) {
                                    var paletteAnimationIndex = _a[_i];
                                    var paletteAnimationCanvasFrames = paletteAnimationCanvases[paletteAnimationIndex];
                                    if (paletteAnimationCanvasFrames == null)
                                        continue;
                                    var currentFrame = SonicManager_1.SonicManager.instance.tilePaletteAnimationManager.getCurrentFrame(paletteAnimationIndex);
                                    canvas.fillText("Palette " + paletteAnimationIndex + "-" + currentFrame.FrameIndex, position.x + 25, position.y + yOffset + (paletteAnimationIndex * 13));
                                }
                            }
                        }
                        if (debugDrawOptions.showTileAnimationData) {
                            if (this.HasTileAnimations()) {
                                var tileAnimationCanvases = this.tileAnimationCanvasesCache[layer];
                                for (var _b = 0, _c = this.getAllTileAnimationIndexes(); _b < _c.length; _b++) {
                                    var tileAnimationIndex = _c[_b];
                                    var tileAnimationCanvasFrames = tileAnimationCanvases[tileAnimationIndex];
                                    if (tileAnimationCanvasFrames == null)
                                        continue;
                                    var currentFrame = SonicManager_1.SonicManager.instance.tileAnimationManager.getCurrentFrame(tileAnimationIndex);
                                    canvas.fillText("Tile " + tileAnimationIndex + "-" + currentFrame.frameIndex, position.x + 75, position.y + yOffset + (tileAnimationIndex * 13));
                                }
                            }
                        }
                    }
                    if (debugDrawOptions.putlineChunk) {
                        canvas.strokeStyle = "black";
                        canvas.strokeRect(position.x, position.y, 128, 128);
                    }
                    if (debugDrawOptions.outlineTiles) {
                        canvas.strokeStyle = "green";
                        for (var x = 0; x < TileChunk.TileSideLength; x++) {
                            for (var y = 0; y < TileChunk.TileSideLength; y++) {
                                canvas.strokeRect(position.x + (x * TileChunk.TileSquareSize), position.y + (y * TileChunk.TileSquareSize), TileChunk.TileSquareSize, TileChunk.TileSquareSize);
                            }
                        }
                    }
                    if (debugDrawOptions.outlineTilePieces) {
                        canvas.strokeStyle = "purple";
                        for (var x = 0; x < TileChunk.TilePieceSideLength; x++) {
                            for (var y = 0; y < TileChunk.TilePieceSideLength; y++) {
                                canvas.strokeRect(position.x + (x * TileChunk.TilePiecesSquareSize), position.y + (y * TileChunk.TilePiecesSquareSize), TileChunk.TilePiecesSquareSize, TileChunk.TilePiecesSquareSize);
                            }
                        }
                    }
                    if (debugDrawOptions.outlineTile != null) {
                    }
                    if (debugDrawOptions.outlineTilePiece != null) {
                        canvas.strokeStyle = "yellow";
                        for (var x = 0; x < TileChunk.TilePieceSideLength; x++) {
                            for (var y = 0; y < TileChunk.TilePieceSideLength; y++) {
                                var tilePieceInfo = this.GetTilePieceInfo(x, y, false);
                                if (tilePieceInfo == null)
                                    continue;
                                var tilePiece = tilePieceInfo.GetTilePiece();
                                if (tilePiece == null)
                                    continue;
                                if (tilePiece.Index == debugDrawOptions.outlineTilePiece.Block) {
                                    canvas.strokeRect(position.x + (x * TileChunk.TilePiecesSquareSize), position.y + (y * TileChunk.TilePiecesSquareSize), TileChunk.TilePiecesSquareSize, TileChunk.TilePiecesSquareSize);
                                }
                            }
                        }
                    }
                    canvas.restore();
                };
                TileChunk.prototype.Debug_DrawCache = function () {
                    var numWide = 10;
                    var numOfChunks = 0;
                    for (var i = 0; i < 2; i++) {
                        var chunkLayer = i;
                        if (this.baseCanvasCache[chunkLayer] != null)
                            numOfChunks++;
                        for (var paletteAnimationCanvasCache in this.paletteAnimationCanvasesCache[chunkLayer]) {
                            for (var frame in this.paletteAnimationCanvasesCache[chunkLayer][paletteAnimationCanvasCache].frames) {
                                numOfChunks++;
                            }
                        }
                        for (var tileAnimationCanvasCache in this.tileAnimationCanvasesCache[chunkLayer]) {
                            for (var frame in this.tileAnimationCanvasesCache[chunkLayer][tileAnimationCanvasCache].frames) {
                                numOfChunks++;
                            }
                        }
                    }
                    var canvas = CanvasInformation_1.CanvasInformation.create((numWide * 128), (Math.ceil(numOfChunks / numWide) | 0) * 128, false);
                    canvas.Context.fillStyle = "#111111";
                    canvas.Context.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);
                    numOfChunks = 0;
                    canvas.Context.strokeStyle = "#FFFFFF";
                    canvas.Context.lineWidth = 4;
                    for (var i = 0; i < 2; i++) {
                        var chunkLayer = i;
                        canvas.Context.strokeStyle = chunkLayer == Enums_1.ChunkLayerState.Low ? "Green" : "Yellow";
                        if (this.baseCanvasCache[chunkLayer] != null) {
                            var context = canvas.Context;
                            context.save();
                            var x = ((numOfChunks % numWide) * 128) | 0;
                            var y = (Math.floor(numOfChunks / numWide) | 0) * 128;
                            context.translate(x, y);
                            canvas.Context.fillStyle = chunkLayer == Enums_1.ChunkLayerState.Low ? "#333333" : "#777777";
                            context.fillRect(0, 0, 128, 128);
                            context.drawImage(this.baseCanvasCache[chunkLayer].canvas, 0, 0);
                            context.strokeRect(0, 0, 128, 128);
                            context.restore();
                            numOfChunks++;
                        }
                        canvas.Context.strokeStyle = chunkLayer == Enums_1.ChunkLayerState.Low ? "pink" : "purple";
                        for (var paletteAnimationCanvasCache in this.paletteAnimationCanvasesCache[chunkLayer]) {
                            var m = this.paletteAnimationCanvasesCache[chunkLayer][paletteAnimationCanvasCache];
                            for (var f in m.frames) {
                                var frame = m.frames[f];
                                var context = canvas.Context;
                                context.save();
                                var x = ((numOfChunks % numWide) * 128) | 0;
                                var y = (Math.floor(numOfChunks / numWide) | 0) * 128;
                                context.translate(x, y);
                                canvas.Context.fillStyle = chunkLayer == Enums_1.ChunkLayerState.Low ? "#333333" : "#777777";
                                context.fillRect(0, 0, 128, 128);
                                context.drawImage(frame.canvas.canvas, m.position.x, m.position.y);
                                context.strokeRect(0, 0, 128, 128);
                                context.restore();
                                numOfChunks++;
                            }
                        }
                        canvas.Context.strokeStyle = chunkLayer == Enums_1.ChunkLayerState.Low ? "red" : "orange";
                        for (var tileAnimationCanvasCache in this.tileAnimationCanvasesCache[chunkLayer]) {
                            var m = this.tileAnimationCanvasesCache[chunkLayer][tileAnimationCanvasCache];
                            for (var f in m.frames) {
                                var frame = m.frames[f];
                                var context = canvas.Context;
                                context.save();
                                var x = ((numOfChunks % numWide) * 128) | 0;
                                var y = (Math.floor(numOfChunks / numWide) | 0) * 128;
                                context.translate(x, y);
                                canvas.Context.fillStyle = chunkLayer == Enums_1.ChunkLayerState.Low ? "#333333" : "#777777";
                                context.fillRect(0, 0, 128, 128);
                                context.drawImage(frame.canvas.canvas, m.position.y, m.position.y);
                                context.strokeRect(0, 0, 128, 128);
                                context.restore();
                                numOfChunks++;
                            }
                        }
                    }
                    canvas.Context.strokeStyle = "blue";
                    canvas.Context.strokeRect(0, 0, canvas.canvas.width, canvas.canvas.height);
                    canvas.Context.fillStyle = "white";
                    canvas.Context.font = "20px bold";
                    canvas.Context.fillText("Number Of Chunks: " + numOfChunks, 50, 50);
                    return canvas;
                };
                TileChunk.TilePiecesSquareSize = 16;
                TileChunk.TileSquareSize = 8;
                TileChunk.Size = TileChunk.TilePiecesSquareSize * TileChunk.TilePieceSideLength;
                TileChunk.TilePieceSideLength = 8;
                TileChunk.TileSideLength = 16;
                return TileChunk;
            }());
            exports_1("TileChunk", TileChunk);
            TileChunkDebugDrawOptions = (function () {
                function TileChunkDebugDrawOptions() {
                }
                return TileChunkDebugDrawOptions;
            }());
            exports_1("TileChunkDebugDrawOptions", TileChunkDebugDrawOptions);
            ChunkLayer = (function () {
                function ChunkLayer() {
                }
                return ChunkLayer;
            }());
            exports_1("ChunkLayer", ChunkLayer);
            PaletteAnimationCanvasFrames = (function () {
                function PaletteAnimationCanvasFrames(paletteAnimationIndex) {
                    this.paletteAnimationIndex = paletteAnimationIndex;
                    this.frames = {};
                }
                return PaletteAnimationCanvasFrames;
            }());
            exports_1("PaletteAnimationCanvasFrames", PaletteAnimationCanvasFrames);
            PaletteAnimationCanvasFrame = (function () {
                function PaletteAnimationCanvasFrame() {
                }
                return PaletteAnimationCanvasFrame;
            }());
            exports_1("PaletteAnimationCanvasFrame", PaletteAnimationCanvasFrame);
            TileAnimationCanvasFrames = (function () {
                function TileAnimationCanvasFrames(tileAnimationIndex) {
                    this.tileAnimationIndex = tileAnimationIndex;
                    this.frames = {};
                }
                return TileAnimationCanvasFrames;
            }());
            exports_1("TileAnimationCanvasFrames", TileAnimationCanvasFrames);
            TileAnimationCanvasFrame = (function () {
                function TileAnimationCanvasFrame() {
                }
                return TileAnimationCanvasFrame;
            }());
            exports_1("TileAnimationCanvasFrame", TileAnimationCanvasFrame);
        }
    }
});
