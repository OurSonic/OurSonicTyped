/// <reference path="../../typings/keyboardjs.d.ts" />
/// <reference path="../../typings/socket.io-client.d.ts" />


import {CanvasInformation} from "../common/CanvasInformation";
import {SonicManager} from "./SonicManager";
import {GameState} from "../common/Enums";
import {Point, DoublePoint} from "../common/Utils";
import {Sonic} from "./sonic/Sonic";
import {SLData} from "../SLData";
import {Help} from "../common/Help";

export class SonicEngine {
    private wideScreen:boolean = true;
    public client:SocketIOClient.Socket;
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
        window.setInterval(() => this.sonicManager.Tick(), 1000 / 60);
        window.setInterval(() => this.GameDraw(), 1000 / 60);
        this.resizeCanvas(true);
    }

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
                window.doIt += 1;
                if (window.doIt == 5)window.doIt = 1;
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
                    this.sonicManager.sonicToon.Hit(this.sonicManager.sonicToon.x, this.sonicManager.sonicToon.y);
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
                    this.sonicManager.sonicToon.Debug();
            },
            () => {

            });
        keyboardJS.bind("up",
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.PressUp();
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
                        this.sonicManager.sonicToon.ReleaseUp();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("down",
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.PressCrouch();
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
                        this.sonicManager.sonicToon.ReleaseCrouch();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("left",
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.PressLeft();
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
                        this.sonicManager.sonicToon.ReleaseLeft();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("right",
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.PressRight();
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
                        this.sonicManager.sonicToon.ReleaseRight();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("space",
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.PressJump();
                        break;
                    case GameState.Editing:
                        break;
                }
            },
            () => {
                switch (this.sonicManager.currentGameState) {
                    case GameState.Playing:
                        this.sonicManager.sonicToon.ReleaseJump();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("e",
            () => {
                this.sonicManager.sonicLevel.CurHeightMap = !this.sonicManager.sonicLevel.CurHeightMap;
            },
            () => {

            });




        this.client = io.connect("159.203.118.77:8998");
        // this.client.emit("LoadLevel.Request", {Data: 'Angel Island Zone Act 1'});
        this.client.on("LoadLevel.Response",
            data => {
                this.LoadLevel(data.Data);
            });
        this.client.on("GetObjects.Response", data => {
            this.sonicManager.loadObjects(data.Data);
        });
    }

    LoadLevel(data:string):void {
        let l = JSON.parse(Help.decodeString(data));
        SonicEngine.instance.RunSonic(l);
    }


    public RunSonic(level:SLData):void {
        this.sonicManager.clearCache();
        this.sonicManager.Load(level);
        this.sonicManager.windowLocation.x = 0;
        this.sonicManager.windowLocation.y = 0;
        this.sonicManager.bigWindowLocation.x = (this.sonicManager.windowLocation.x - this.sonicManager.windowLocation.Width * 0.2) | 0;
        this.sonicManager.bigWindowLocation.y = (this.sonicManager.windowLocation.y - this.sonicManager.windowLocation.Height * 0.2) | 0;
        this.sonicManager.bigWindowLocation.Width = (this.sonicManager.windowLocation.Width * 1.8) | 0;
        this.sonicManager.bigWindowLocation.Height = (this.sonicManager.windowLocation.Height * 1.8) | 0;
        let dl = Help.getQueryString();
        if (dl["run"]) {
            if (this.sonicManager.currentGameState == GameState.Playing)
                this.runGame();
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
        this.sonicManager.OnClick(queryEvent);
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
            (this.sonicManager.windowLocation.Width * (this.sonicManager.currentGameState == GameState.Playing ? this.sonicManager.scale.x * this.sonicManager.realScale.x : 1)).toString());
        this.gameCanvas.domCanvas.attr("height",
            (this.sonicManager.windowLocation.Height * (this.sonicManager.currentGameState == GameState.Playing ? this.sonicManager.scale.y * this.sonicManager.realScale.y : 1)).toString());
        this.gameGoodWidth = <number>(this.sonicManager.windowLocation.Width * (this.sonicManager.currentGameState == GameState.Playing ? this.sonicManager.scale.x * this.sonicManager.realScale.x : 1));
        let screenOffset = this.sonicManager.currentGameState == GameState.Playing ? new DoublePoint(((this.canvasWidth / 2 - this.sonicManager.windowLocation.Width * this.sonicManager.scale.x * this.sonicManager.realScale.x / 2)),
            (this.canvasHeight / 2 - this.sonicManager.windowLocation.Height * this.sonicManager.scale.y * this.sonicManager.realScale.y / 2)) : new DoublePoint(0, 0);
        this.gameCanvas.domCanvas.css("left", screenOffset.x + 'px');
        this.gameCanvas.domCanvas.css("top", screenOffset.y + 'px');
        this.sonicManager.DestroyCanvases();
        this.sonicManager.ResetCanvases();
    }

    public Clear(canv:CanvasInformation):void {
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