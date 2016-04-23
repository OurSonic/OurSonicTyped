/// <reference path="../../typings/keyboardjs.d.ts" />


import {CanvasInformation} from "../Common/CanvasInformation";
import {SonicManager} from "./SonicManager";
import {GameState} from "../Common/Enums";
import {Point, IntersectingRectangle, DoublePoint } from "../Common/Utils";
import {Sonic} from "./Sonic/Sonic";
import {SLData } from "../SLData";
import {Help} from "../Common/Help";

export class SonicEngine {
    private WideScreen: boolean = true;
    //    public client: SocketIOClient;
    private fullscreenMode: boolean;
    private gameCanvas: CanvasInformation;
    private gameGoodWidth: number;
    public canvasWidth: number;
    public canvasHeight: number;
    public sonicManager: SonicManager;
    public static Instance: SonicEngine;
    constructor() {
        SonicEngine.Instance = this;

        const gameCanvasName = "gameLayer";
        this.gameCanvas = CanvasInformation.CreateFromElement(<HTMLCanvasElement>document.getElementById(gameCanvasName), 0, 0, true);

        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.bindInput();
        this.fullscreenMode = true;
        window.addEventListener("resize", e => this.resizeCanvas(true));
        jQuery(document).resize(e => this.resizeCanvas(true));
        this.sonicManager = new SonicManager(this, this.gameCanvas, () => this.resizeCanvas(true));
        this.sonicManager.IndexedPalette = 0;
        window.setInterval(() => this.sonicManager.Tick(), 1000 / 60);
        window.setInterval(() => this.GameDraw(), 1000 / 60);
        this.resizeCanvas(true);
    }
    private bindInput(): void {
        this.gameCanvas.DomCanvas.mousedown((e: JQueryEventObject) => this.canvasOnClick(e));
        this.gameCanvas.DomCanvas.mouseup((e: JQueryEventObject) => this.canvasMouseUp(e));
        this.gameCanvas.DomCanvas.mousemove((e: JQueryEventObject)=>this.canvasMouseMove(e));
        this.gameCanvas.DomCanvas.bind("touchstart", (e: JQueryEventObject) => this.canvasOnClick(e));
        this.gameCanvas.DomCanvas.bind("touchend", (e: JQueryEventObject) => this.canvasMouseUp(e));
        this.gameCanvas.DomCanvas.bind("touchmove", (e: JQueryEventObject) => this.canvasMouseMove(e));
        this.gameCanvas.DomCanvas.bind("contextmenu", (e) => e.preventDefault());
        keyboardJS.bind("f",
            () => {
                this.sonicManager.ShowHeightMap = !this.sonicManager.ShowHeightMap;
            },
            () => {

            });
        keyboardJS.bind("o",
            () => {
                if (this.sonicManager.CurrentGameState == GameState.Playing)
                    this.sonicManager.InHaltMode = !this.sonicManager.InHaltMode;
            },
            () => {

            });

        keyboardJS.bind("1",
            () => {
                this.sonicManager.IndexedPalette++;
                this.sonicManager.ClearCache();
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
                if (this.sonicManager.CurrentGameState == GameState.Playing)
                    if (this.sonicManager.InHaltMode)
                        this.sonicManager.waitingForTickContinue = false;
            },
            () => {

            });
        keyboardJS.bind("h",
            () => {
                if (this.sonicManager.CurrentGameState == GameState.Playing)
                    this.sonicManager.SonicToon.Hit(this.sonicManager.SonicToon.X, this.sonicManager.SonicToon.Y);
            },
            () => {

            });
        keyboardJS.bind("u",
            () => {
                this.WideScreen = !this.WideScreen;
                this.resizeCanvas(true);
            },
            () => {

            });
        keyboardJS.bind("c",
            () => {
                if (this.sonicManager.CurrentGameState == GameState.Playing)
                    this.sonicManager.SonicToon.Debug();
            },
            () => {

            });
        keyboardJS.bind("up",
            () => {
                switch (this.sonicManager.CurrentGameState) {
                    case GameState.Playing:
                        this.sonicManager.SonicToon.PressUp();
                        break;
                    case GameState.Editing:
                        this.sonicManager.WindowLocation.Y -= 128;
                        this.sonicManager.BigWindowLocation.Y -= 128;
                        break;
                }
            },
            () => {
                switch (this.sonicManager.CurrentGameState) {
                    case GameState.Playing:
                        this.sonicManager.SonicToon.ReleaseUp();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("down",
            () => {
                switch (this.sonicManager.CurrentGameState) {
                    case GameState.Playing:
                        this.sonicManager.SonicToon.PressCrouch();
                        break;
                    case GameState.Editing:
                        this.sonicManager.WindowLocation.Y += 128;
                        this.sonicManager.BigWindowLocation.Y += 128;
                        break;
                }
            },
            () => {
                switch (this.sonicManager.CurrentGameState) {
                    case GameState.Playing:
                        this.sonicManager.SonicToon.ReleaseCrouch();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("left",
            () => {
                switch (this.sonicManager.CurrentGameState) {
                    case GameState.Playing:
                        this.sonicManager.SonicToon.PressLeft();
                        break;
                    case GameState.Editing:
                        this.sonicManager.WindowLocation.X -= 128;
                        this.sonicManager.BigWindowLocation.X -= 128;
                        break;
                }
            },
            () => {
                switch (this.sonicManager.CurrentGameState) {
                    case GameState.Playing:
                        this.sonicManager.SonicToon.ReleaseLeft();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("right",
            () => {
                switch (this.sonicManager.CurrentGameState) {
                    case GameState.Playing:
                        this.sonicManager.SonicToon.PressRight();
                        break;
                    case GameState.Editing:
                        this.sonicManager.WindowLocation.X += 128;
                        this.sonicManager.BigWindowLocation.X += 128;
                        break;
                }
            },
            () => {
                switch (this.sonicManager.CurrentGameState) {
                    case GameState.Playing:
                        this.sonicManager.SonicToon.ReleaseRight();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("space",
            () => {
                switch (this.sonicManager.CurrentGameState) {
                    case GameState.Playing:
                        this.sonicManager.SonicToon.PressJump();
                        break;
                    case GameState.Editing:
                        break;
                }
            },
            () => {
                switch (this.sonicManager.CurrentGameState) {
                    case GameState.Playing:
                        this.sonicManager.SonicToon.ReleaseJump();
                        break;
                    case GameState.Editing:
                        break;
                }
            });
        keyboardJS.bind("e",
            () => {
                this.sonicManager.SonicLevel.CurHeightMap = !this.sonicManager.SonicLevel.CurHeightMap;
            },
            () => {

            });
        setTimeout(() => {
            //            if (neverGot) {
            this.LoadLevel((<any>window).STATICLEVEL);
            //        }
        }, 1);



        /*        client = SocketIOClient.Connect("159.203.118.77:8998");
                client.On<DataObject<string>>("SonicLevel",
                    data => {
                        Help.DecodeString<SlData.SLData>(data.Data, RunSonic);
                    });
                client.On<DataObject<KeyValuePair<string, string>[]>>("GetObjects.Response", data => {
                    this.sonicManager.loadObjects(data.Data);
                });*/
    }
    private LoadLevel(data: string): void {
        let l = JSON.parse(Help.DecodeString(data));
        SonicEngine.Instance.RunSonic(l);
    }


    public RunSonic(level: SLData): void {
        this.sonicManager.ClearCache();
        this.sonicManager.Load(level);
        this.sonicManager.WindowLocation.X = 0;
        this.sonicManager.WindowLocation.Y = 0;
        this.sonicManager.BigWindowLocation.X = (this.sonicManager.WindowLocation.X - this.sonicManager.WindowLocation.Width * 0.2) | 0;
        this.sonicManager.BigWindowLocation.Y = (this.sonicManager.WindowLocation.Y - this.sonicManager.WindowLocation.Height * 0.2) | 0;
        this.sonicManager.BigWindowLocation.Width = (this.sonicManager.WindowLocation.Width * 1.8) | 0;
        this.sonicManager.BigWindowLocation.Height = (this.sonicManager.WindowLocation.Height * 1.8) | 0;
        let dl = Help.GetQueryString();
        if (dl["run"]) {
            if (this.sonicManager.CurrentGameState == GameState.Playing)
                this.runGame();
            this.runGame();
        }
        this.sonicManager.CacheTiles();
    }
    public runGame(): void {
        let sonicManager = SonicManager.Instance;
        switch (sonicManager.CurrentGameState) {
            case GameState.Playing:
                sonicManager.CurrentGameState = GameState.Editing;
                sonicManager.scale = new Point(4, 4);
                sonicManager.WindowLocation = Help.DefaultWindowLocation(sonicManager.CurrentGameState, sonicManager.scale);
                sonicManager.SonicToon = null;
                break;
            case GameState.Editing:
                sonicManager.CurrentGameState = GameState.Playing;
                sonicManager.scale = new Point(4, 4);
                sonicManager.WindowLocation = Help.DefaultWindowLocation(sonicManager.CurrentGameState, sonicManager.scale);
                sonicManager.SonicToon = new Sonic();
                break;
        }
        sonicManager.DestroyCanvases();
        sonicManager.ResetCanvases();
    }
    private canvasMouseMove(queryEvent: JQueryEventObject): void {
        queryEvent.preventDefault();
        this.sonicManager.MouseMove(queryEvent);
    }
    private canvasOnClick(queryEvent: JQueryEventObject): void {
        queryEvent.preventDefault();
        this.sonicManager.OnClick(queryEvent);
    }
    private canvasMouseUp(queryEvent: JQueryEventObject): void {
        queryEvent.preventDefault();
        this.sonicManager.MouseUp(queryEvent);
    }
    public resizeCanvas(resetOverride: boolean): void {
        this.canvasWidth = $(window).width();
        this.canvasHeight = $(window).height();
        this.sonicManager.WindowLocation = Help.DefaultWindowLocation(this.sonicManager.CurrentGameState, this.sonicManager.scale);
        let wide = new DoublePoint((this.canvasWidth / 320 / this.sonicManager.scale.X), (this.canvasHeight / 224 / this.sonicManager.scale.Y));
        let even = new DoublePoint(Math.min((this.canvasWidth / 320 / this.sonicManager.scale.X), (this.canvasHeight / 224 / this.sonicManager.scale.Y)), Math.min((this.canvasWidth / 320 / this.sonicManager.scale.X), (this.canvasHeight / 224 / this.sonicManager.scale.Y)));
        this.sonicManager.RealScale = !this.fullscreenMode ? new DoublePoint(1, 1) : (this.WideScreen ? wide : even);
        if (resetOverride || this.sonicManager.overrideRealScale == null)
            this.sonicManager.overrideRealScale = DoublePoint.create(this.sonicManager.RealScale);
        else this.sonicManager.RealScale = DoublePoint.create(this.sonicManager.overrideRealScale);
        this.gameCanvas.DomCanvas.attr("width",
            (this.sonicManager.WindowLocation.Width * (this.sonicManager.CurrentGameState == GameState.Playing ? this.sonicManager.scale.X * this.sonicManager.RealScale.X : 1)).toString());
        this.gameCanvas.DomCanvas.attr("height",
            (this.sonicManager.WindowLocation.Height * (this.sonicManager.CurrentGameState == GameState.Playing ? this.sonicManager.scale.Y * this.sonicManager.RealScale.Y : 1)).toString());
        this.gameGoodWidth = <number>(this.sonicManager.WindowLocation.Width * (this.sonicManager.CurrentGameState == GameState.Playing ? this.sonicManager.scale.X * this.sonicManager.RealScale.X : 1));
        let screenOffset = this.sonicManager.CurrentGameState == GameState.Playing ? new DoublePoint(((this.canvasWidth / 2 - this.sonicManager.WindowLocation.Width * this.sonicManager.scale.X * this.sonicManager.RealScale.X / 2)),
            (this.canvasHeight / 2 - this.sonicManager.WindowLocation.Height * this.sonicManager.scale.Y * this.sonicManager.RealScale.Y / 2)) : new DoublePoint(0, 0);
        this.gameCanvas.DomCanvas.css("left", screenOffset.X + 'px');
        this.gameCanvas.DomCanvas.css("top", screenOffset.Y + 'px');
        this.sonicManager.DestroyCanvases();
        this.sonicManager.ResetCanvases();
    }
    public Clear(canv: CanvasInformation): void {
        let w: number;
        (<any>canv.DomCanvas[0]).width = this.gameGoodWidth;
        (<any>this.gameCanvas.Context).imageSmoothingEnabled = false;
    }
    public GameDraw(): void {
        this.sonicManager.MainDraw(this.gameCanvas);
    }
}