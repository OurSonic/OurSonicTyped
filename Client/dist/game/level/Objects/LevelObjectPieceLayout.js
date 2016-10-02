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
                    this.pieces = [];
                }
                LevelObjectPieceLayout.prototype.update = function () {
                    for (var _i = 0, _a = SonicManager_1.SonicManager.instance.sonicLevel.objects; _i < _a.length; _i++) {
                        var t = _a[_i];
                        t.reset();
                    }
                };
                LevelObjectPieceLayout.prototype.drawUI = function (canvas, showImages, selectedPieceIndex, levelObject) {
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
                            canvas.moveTo(j.x, j.y);
                            canvas.lineTo(this.pieces[i - 1].x, this.pieces[i - 1].y);
                            canvas.stroke();
                        }
                    }
                    for (var _i = 0, _a = this.pieces; _i < _a.length; _i++) {
                        var levelObjectPieceLayoutPiece = _a[_i];
                        if (showImages) {
                            var piece = levelObject.pieces[levelObjectPieceLayoutPiece.pieceIndex];
                            var asset = levelObject.assets[piece.assetIndex];
                            if (asset.frames.length > 0) {
                                var frm = asset.frames[0];
                                frm.drawUI(canvas, new Utils_1.Point(levelObjectPieceLayoutPiece.x - frm.offsetX, levelObjectPieceLayoutPiece.y - frm.offsetY), false, false, false, false, piece.xflip, piece.yflip);
                            }
                        }
                        else {
                            var drawRadial = void 0;
                            drawRadial = SonicManager_1.SonicManager.instance.mainCanvas.Context.createRadialGradient(0, 0, 0, 10, 10, 50);
                            drawRadial.addColorStop(0, "white");
                            if (selectedPieceIndex == levelObjectPieceLayoutPiece.pieceIndex)
                                drawRadial.addColorStop(1, "yellow");
                            else
                                drawRadial.addColorStop(1, "red");
                            canvas.fillStyle = drawRadial;
                            canvas.beginPath();
                            canvas.arc(levelObjectPieceLayoutPiece.x, levelObjectPieceLayoutPiece.y, 10, 0, Math.PI * 2, true);
                            canvas.closePath();
                            canvas.fill();
                        }
                    }
                    canvas.restore();
                };
                LevelObjectPieceLayout.prototype.draw = function (canvas, x, y, framework, instance, showHeightMap) {
                    for (var _i = 0, _a = instance.pieces; _i < _a.length; _i++) {
                        var j = _a[_i];
                        if (!j.visible)
                            continue;
                        var piece = framework.pieces[j.pieceIndex];
                        var asset = framework.assets[piece.assetIndex];
                        if (asset.frames.length > 0) {
                            var frm = asset.frames[j.frameIndex];
                            frm.drawUI(canvas, new Utils_1.Point((x) - (frm.offsetX) + j.x, (y) - (frm.offsetY) + j.y), false, showHeightMap, showHeightMap, false, instance.xflip !== !!piece.xflip, instance.yflip !== !!piece.yflip);
                        }
                    }
                };
                LevelObjectPieceLayout.prototype.getRectangle = function (levelObject) {
                    var left = 100000000;
                    var top = 100000000;
                    var right = -100000000;
                    var bottom = -100000000;
                    for (var _i = 0, _a = this.pieces; _i < _a.length; _i++) {
                        var levelObjectPieceLayoutPiece = _a[_i];
                        var piece = levelObject.pieces[levelObjectPieceLayoutPiece.pieceIndex];
                        var asset = levelObject.assets[piece.assetIndex];
                        var frame = asset.frames[piece.frameIndex];
                        var pieceX = levelObjectPieceLayoutPiece.x - frame.offsetX;
                        var pieceY = levelObjectPieceLayoutPiece.y - frame.offsetY;
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
//# sourceMappingURL=LevelObjectPieceLayout.js.map