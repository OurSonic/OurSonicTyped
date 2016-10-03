/// <reference path="../../typings/keyboardjs.d.ts" />
/// <reference path="../../typings/socket.io-client.d.ts" />


import {CanvasInformation} from "../common/CanvasInformation";
import {SonicManager} from "./SonicManager";
import {GameState} from "../common/Enums";
import {Point, DoublePoint} from "../common/Utils";
import {Sonic} from "./sonic/Sonic";
import {SLData} from "../SLData";
import {Help} from "../common/Help";

/*class _Point {
    constructor(public x:number, public y:number) {
    }
}
class _Line {
    constructor(public p1:_Point, public p2:_Point) {
    }
}*/

export class SonicEngine {
    private wideScreen:boolean = true;
    private fullscreenMode:boolean = false;
    private gameCanvas:CanvasInformation;
    private gameGoodWidth:number = 0;
    public canvasWidth:number = 0;
    public canvasHeight:number = 0;
    public sonicManager:SonicManager;
    public static instance:SonicEngine;

    constructor() {
        SonicEngine.instance = this;


        const gameCanvasName = "gameLayer";
        this.gameCanvas = CanvasInformation.CreateFromElement(<HTMLCanvasElement>document.getElementById(gameCanvasName), 0, 0, true);


        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.bindInput();
        this.fullscreenMode = true;
        window.addEventListener("resize", e => this.resizeCanvas(true));
        jQuery(document).resize(e => this.resizeCanvas(true));
        this.sonicManager = new SonicManager(this, this.gameCanvas, () => this.resizeCanvas(true));
        this.sonicManager.indexedPalette = 0;
         window.setInterval(() => this.sonicManager.tick(), 1000 / 60);
         window.setInterval(() => this.GameDraw(), 1000 / 60);
        this.resizeCanvas(true);
/*
        (<any>window).GameController.init({
            canvas:gameCanvasName,
            left: {
                type: 'joystick',
                position: {
                    bottom: '15%',
                    left: '15%'
                }
            },
            right: {
                position: {
                    right: '15%',
                    bottom: '15%'
                },
                type: 'buttons',
                buttons: [
                    {
                        label: 'jump',radius:'10%', fontSize: 13, touchStart:  ()=> {
                        // do something
                    }
                    },
                    false, false, false
                ]
            }
        });
*/


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

    private bindInput():void {
        this.gameCanvas.domCanvas.mousedown((e:JQueryEventObject) => this.canvasOnClick(e));
        this.gameCanvas.domCanvas.mouseup((e:JQueryEventObject) => this.canvasMouseUp(e));
        this.gameCanvas.domCanvas.mousemove((e:JQueryEventObject) => this.canvasMouseMove(e));
        this.gameCanvas.domCanvas.bind("touchstart", (e:JQueryEventObject) => this.canvasOnClick(e));
        this.gameCanvas.domCanvas.bind("touchend", (e:JQueryEventObject) => this.canvasMouseUp(e));
        this.gameCanvas.domCanvas.bind("touchmove", (e:JQueryEventObject) => this.canvasMouseMove(e));
        this.gameCanvas.domCanvas.bind("contextmenu", (e) => e.preventDefault());
        keyboardJS.bind("f",
            () => {
                this.sonicManager.showHeightMap = !this.sonicManager.showHeightMap;
            },
            () => {

            });
        keyboardJS.bind("o",
            () => {
                if (this.sonicManager.currentGameState == GameState.Playing)
                    this.sonicManager.inHaltMode = !this.sonicManager.inHaltMode;
            },
            () => {

            });

        keyboardJS.bind("1",
            () => {
                this.sonicManager.indexedPalette++;
                this.sonicManager.clearCache();
            },
            () => {

            });
        keyboardJS.bind("2",
            () => {
                this.sonicManager.pixelScale += 1;
                if (this.sonicManager.pixelScale == 5)this.sonicManager.pixelScale = 1;
            },
            () => {

            });
        keyboardJS.bind("q",
            () => {
                this.runGame();
            },
            () => {

            });
        keyboardJS.bind("p",
            () => {
                if (this.sonicManager.currentGameState == GameState.Playing)
                    if (this.sonicManager.inHaltMode)
                        this.sonicManager.waitingForTickContinue = false;
            },
            () => {

            });
        keyboardJS.bind("h",
            () => {
                if (this.sonicManager.currentGameState == GameState.Playing)
                    this.sonicManager.sonicToon.hit(this.sonicManager.sonicToon.x, this.sonicManager.sonicToon.y);
            },
            () => {

            });
        keyboardJS.bind("u",
            () => {
                this.wideScreen = !this.wideScreen;
                this.resizeCanvas(true);
            },
            () => {

            });
        keyboardJS.bind("c",
            () => {
                if (this.sonicManager.currentGameState == GameState.Playing)
                    this.sonicManager.sonicToon.debug();
            },
            () => {

            });
        keyboardJS.bind("up",
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.pressUp();
                        break;
                    case GameState.Editing:
                        this.sonicManager.windowLocation.y -= 128;
                        this.sonicManager.bigWindowLocation.y -= 128;
                        break;
                }
            },
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.releaseUp();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("down",
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.pressCrouch();
                        break;
                    case GameState.Editing:
                        this.sonicManager.windowLocation.y += 128;
                        this.sonicManager.bigWindowLocation.y += 128;
                        break;
                }
            },
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.releaseCrouch();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("left",
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.pressLeft();
                        break;
                    case GameState.Editing:
                        this.sonicManager.windowLocation.x -= 128;
                        this.sonicManager.bigWindowLocation.x -= 128;
                        break;
                }
            },
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.releaseLeft();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("right",
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.pressRight();
                        break;
                    case GameState.Editing:
                        this.sonicManager.windowLocation.x += 128;
                        this.sonicManager.bigWindowLocation.x += 128;
                        break;
                }
            },
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.releaseRight();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("space",
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.pressJump();
                        break;
                    case GameState.Editing:
                        break;
                }
            },
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.releaseJump();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("e",
            () => {
                this.sonicManager.sonicLevel.curHeightMap = !this.sonicManager.sonicLevel.curHeightMap;
            },
            () => {

            });

    }

    LoadLevel(data:string):void {
        let l = JSON.parse(Help.decodeString(data));
        SonicEngine.instance.RunSonic(l);
    }


    public RunSonic(level: SLData): void {
        this.sonicManager.clearCache();
        this.sonicManager.Load(level);
        this.sonicManager.windowLocation.x = 0;
        this.sonicManager.windowLocation.y = 0;
        this.sonicManager.bigWindowLocation.x = (this.sonicManager.windowLocation.x - this.sonicManager.windowLocation.width * 0.2) | 0;
        this.sonicManager.bigWindowLocation.y = (this.sonicManager.windowLocation.y - this.sonicManager.windowLocation.height * 0.2) | 0;
        this.sonicManager.bigWindowLocation.width = (this.sonicManager.windowLocation.width * 1.8) | 0;
        this.sonicManager.bigWindowLocation.height = (this.sonicManager.windowLocation.height * 1.8) | 0;
        let dl = Help.getQueryString();
        this.sonicManager.currentGameState = GameState.Editing;
        if (dl["run"]) {
            this.runGame();
        }
        this.sonicManager.cacheTiles();
        this.runGame();
    }

    public runGame():void {
        let sonicManager = SonicManager.instance;
        switch (sonicManager.currentGameState) {
            case GameState.Playing:
                sonicManager.currentGameState = GameState.Editing;
                sonicManager.scale = new Point(1, 1);
                sonicManager.windowLocation = Help.defaultWindowLocation(sonicManager.currentGameState, sonicManager.scale);
                sonicManager.sonicToon = null;
                break;
            case GameState.Editing:
                sonicManager.currentGameState = GameState.Playing;
                sonicManager.scale = new Point(2, 2);
                sonicManager.windowLocation = Help.defaultWindowLocation(sonicManager.currentGameState, sonicManager.scale);
                sonicManager.sonicToon = new Sonic();
                break;
        }
        sonicManager.DestroyCanvases();
        sonicManager.ResetCanvases();
    }

    private canvasMouseMove(queryEvent:JQueryEventObject):void {
        queryEvent.preventDefault();
        this.sonicManager.mouseMove(queryEvent);
    }

    private canvasOnClick(queryEvent:JQueryEventObject):void {
        queryEvent.preventDefault();
        this.sonicManager.onClick(queryEvent);
    }

    private canvasMouseUp(queryEvent:JQueryEventObject):void {
        queryEvent.preventDefault();
        this.sonicManager.mouseUp(queryEvent);
    }

    public resizeCanvas(resetOverride:boolean):void {
        this.canvasWidth = $(window).width();
        this.canvasHeight = $(window).height();
        this.sonicManager.windowLocation = Help.defaultWindowLocation(this.sonicManager.currentGameState, this.sonicManager.scale);
        let wide = new DoublePoint((this.canvasWidth / 320 / this.sonicManager.scale.x), (this.canvasHeight / 224 / this.sonicManager.scale.y));
        let even = new DoublePoint(Math.min((this.canvasWidth / 320 / this.sonicManager.scale.x), (this.canvasHeight / 224 / this.sonicManager.scale.y)), Math.min((this.canvasWidth / 320 / this.sonicManager.scale.x), (this.canvasHeight / 224 / this.sonicManager.scale.y)));
        this.sonicManager.realScale = !this.fullscreenMode ? new DoublePoint(1, 1) : (this.wideScreen ? wide : even);
        if (resetOverride || this.sonicManager.overrideRealScale == null)
            this.sonicManager.overrideRealScale = DoublePoint.create(this.sonicManager.realScale);
        else this.sonicManager.realScale = DoublePoint.create(this.sonicManager.overrideRealScale);
        this.gameCanvas.domCanvas.attr("width",
            (this.sonicManager.windowLocation.width * (this.sonicManager.currentGameState === GameState.Playing ? this.sonicManager.scale.x * this.sonicManager.realScale.x : 1)).toString());
        this.gameCanvas.domCanvas.attr("height",
            (this.sonicManager.windowLocation.height * (this.sonicManager.currentGameState === GameState.Playing ? this.sonicManager.scale.y * this.sonicManager.realScale.y : 1)).toString());
        this.gameGoodWidth = <number>(this.sonicManager.windowLocation.width * (this.sonicManager.currentGameState == GameState.Playing ? this.sonicManager.scale.x * this.sonicManager.realScale.x : 1));
        let screenOffset = this.sonicManager.currentGameState == GameState.Playing ? new DoublePoint(((this.canvasWidth / 2 - this.sonicManager.windowLocation.width * this.sonicManager.scale.x * this.sonicManager.realScale.x / 2)),
            (this.canvasHeight / 2 - this.sonicManager.windowLocation.height * this.sonicManager.scale.y * this.sonicManager.realScale.y / 2)) : new DoublePoint(0, 0);
        this.gameCanvas.domCanvas.css("left", screenOffset.x + 'px');
        this.gameCanvas.domCanvas.css("top", screenOffset.y + 'px');
        this.sonicManager.DestroyCanvases();
        this.sonicManager.ResetCanvases();
    }

    public clear(canv:CanvasInformation):void {
        (<any>canv.domCanvas[0]).width = this.gameGoodWidth;
        (<any>this.gameCanvas.Context).mozImageSmoothingEnabled = false; /// future
        (<any>this.gameCanvas.Context).msImageSmoothingEnabled = false; /// future
        (<any>this.gameCanvas.Context).imageSmoothingEnabled = false; /// future
        (<any>this.gameCanvas.Context).imageSmoothingEnabled = false;
    }

    public GameDraw():void {
        this.sonicManager.MainDraw(this.gameCanvas);
    }

}