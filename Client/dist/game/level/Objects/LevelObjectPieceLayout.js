System.register(["../../SonicManager", "../../../common/Utils"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SonicManager_1, Utils_1;
    var LevelObjectPieceLayout;
    return {
        setters:[
            function (SonicManager_1_1) {
                SonicManager_1 = SonicManager_1_1;
            },
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            }],
        execute: function() {
            LevelObjectPieceLayout = (function () {
                function LevelObjectPieceLayout(name) {
                    this.name = name;
                    this.width = 350;
                    this.height = 280;
                    this.pieces = new Array();
                }
                LevelObjectPieceLayout.prototype.Update = function () {
                    for (var _i = 0, _a = SonicManager_1.SonicManager.instance.sonicLevel.Objects; _i < _a.length; _i++) {
                        var t = _a[_i];
                        t.Reset();
                    }
                };
                LevelObjectPieceLayout.prototype.DrawUI = function (canvas, showImages, selectedPieceIndex, levelObject) {
                    canvas.save();
                    if (!showImages) {
                        canvas.strokeStyle = "#000000";
                        canvas.lineWidth = 2;
                        canvas.beginPath();
                        canvas.moveTo(-1000, 0);
                        canvas.lineTo(1000, 0);
                        canvas.closePath();
                        canvas.stroke();
                        canvas.beginPath();
                        canvas.moveTo(0, -1000);
                        canvas.lineTo(0, 1000);
                        canvas.closePath();
                        canvas.stroke();
                        for (var i = 1; i < this.pieces.length; i++) {
                            var j = this.pieces[i];
                            canvas.beginPath();
                            canvas.moveTo(j.X, j.Y);
                            canvas.lineTo(this.pieces[i - 1].X, this.pieces[i - 1].Y);
                            canvas.stroke();
                        }
                    }
                    for (var _i = 0, _a = this.pieces; _i < _a.length; _i++) {
                        var levelObjectPieceLayoutPiece = _a[_i];
                        if (showImages) {
                            var piece = levelObject.Pieces[levelObjectPieceLayoutPiece.PieceIndex];
                            var asset = levelObject.Assets[piece.assetIndex];
                            if (asset.frames.length > 0) {
                                var frm = asset.frames[0];
                                frm.DrawUI(canvas, new Utils_1.Point(levelObjectPieceLayoutPiece.X - frm.offsetX, levelObjectPieceLayoutPiece.Y - frm.offsetY), false, false, false, false, piece.xflip, piece.yflip);
                            }
                        }
                        else {
                            var drawRadial = void 0;
                            drawRadial = SonicManager_1.SonicManager.instance.mainCanvas.Context.createRadialGradient(0, 0, 0, 10, 10, 50);
                            drawRadial.addColorStop(0, "white");
                            if (selectedPieceIndex == levelObjectPieceLayoutPiece.PieceIndex)
                                drawRadial.addColorStop(1, "yellow");
                            else
                                drawRadial.addColorStop(1, "red");
                            canvas.fillStyle = drawRadial;
                            canvas.beginPath();
                            canvas.arc(levelObjectPieceLayoutPiece.X, levelObjectPieceLayoutPiece.Y, 10, 0, Math.PI * 2, true);
                            canvas.closePath();
                            canvas.fill();
                        }
                    }
                    canvas.restore();
                };
                LevelObjectPieceLayout.prototype.Draw = function (canvas, x, y, framework, instance, showHeightMap) {
                    for (var _i = 0, _a = instance.Pieces; _i < _a.length; _i++) {
                        var j = _a[_i];
                        if (!j.visible)
                            continue;
                        var piece = framework.Pieces[j.pieceIndex];
                        var asset = framework.Assets[piece.assetIndex];
                        if (asset.frames.length > 0) {
                            var frm = asset.frames[j.frameIndex];
                            frm.DrawUI(canvas, new Utils_1.Point((x) - (frm.offsetX), (y) - (frm.offsetY)), false, showHeightMap, showHeightMap, false, instance.Xflip !== !!piece.xflip, instance.Yflip !== !!piece.yflip);
                        }
                    }
                };
                LevelObjectPieceLayout.prototype.GetRectangle = function (levelObject) {
                    var left = 100000000;
                    var top = 100000000;
                    var right = -100000000;
                    var bottom = -100000000;
                    for (var _i = 0, _a = this.pieces; _i < _a.length; _i++) {
                        var levelObjectPieceLayoutPiece = _a[_i];
                        var piece = levelObject.Pieces[levelObjectPieceLayoutPiece.PieceIndex];
                        var asset = levelObject.Assets[piece.assetIndex];
                        var frame = asset.frames[piece.frameIndex];
                        var pieceX = levelObjectPieceLayoutPiece.X - frame.offsetX;
                        var pieceY = levelObjectPieceLayoutPiece.Y - frame.offsetY;
                        var pieceWidth = frame.width;
                        var pieceHeight = frame.height;
                        if (pieceX < left) {
                            left = pieceX;
                        }
                        if (pieceY < top) {
                            top = pieceY;
                        }
                        if (pieceX + pieceWidth > right) {
                            right = pieceX + pieceWidth;
                        }
                        if (pieceY + pieceHeight > bottom) {
                            bottom = pieceY + pieceHeight;
                        }
                    }
                    return new Utils_1.Rectangle(left, top, right - left, bottom - top);
                };
                return LevelObjectPieceLayout;
            }());
            exports_1("LevelObjectPieceLayout", LevelObjectPieceLayout);
        }
    }
});
