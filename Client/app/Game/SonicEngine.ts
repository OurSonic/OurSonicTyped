import {CanvasInformation} from "../Common/CanvasInformation";
import {SonicManager} from "./SonicManager";
import {GameState} from "../Common/Enums";
import {Point, IntersectingRectangle} from "../Common/Utils";
import {Sonic} from "./Sonic/Sonic";



export class SonicEngine {
    private gameCanvas: CanvasInformation;
    private uiCanvas: CanvasInformation;
    private canvasWidth: number;
    private canvasHeight: number;
    private fullscreenMode: boolean;
    public sonicManager: any;

    wideScreen: boolean;
    gameGoodWidth: number;
    public Engine() {
        const gameCanvasName = "gameLayer";
        const uiCanvasName = "uiLayer";

        this.gameCanvas = CanvasInformation.createFromElement(<HTMLCanvasElement>document.getElementById(gameCanvasName), 0, 0, true);
        this.uiCanvas = CanvasInformation.createFromElement(<HTMLCanvasElement>document.getElementById(uiCanvasName), 0, 0, true);
        this.canvasWidth = 0;
        this.canvasHeight = 0;

        this.bindInput();

        this.fullscreenMode = true;

        window.addEventListener("resize", e => this.resizeCanvas(true));

//        this.sonicManager = new SonicManager(this, this.gameCanvas, () => this.resizeCanvas(true));
        this.sonicManager.indexedPalette = 0;
        window.setInterval(this.sonicManager.tick, 1000 / 60);
        window.setInterval(this.gameDraw, 1000 / 60);
        this.resizeCanvas(true);
    }



    private bindInput(): void {
        this.uiCanvas.domCanvas.mousedown(this.canvasOnClick);
        this.uiCanvas.domCanvas.mouseup(this.canvasMouseUp);
        this.uiCanvas.domCanvas.mousemove(this.canvasMouseMove);
        this.uiCanvas.domCanvas.bind("touchstart", this.canvasOnClick);
        this.uiCanvas.domCanvas.bind("touchend", this.canvasMouseUp);
        this.uiCanvas.domCanvas.bind("touchmove", this.canvasMouseMove);
        this.uiCanvas.domCanvas.bind("contextmenu", (e) => e.preventDefault());
        keyboardjs.bind("f",
            () => {
                this.sonicManager.showHeightMap = !this.sonicManager.showHeightMap;
            },
            () => {

            });
        keyboardjs.bind("o",
            () => {
                if (this.sonicManager.currentGameState == GameState.Playing)
                    this.sonicManager.inHaltMode = !this.sonicManager.inHaltMode;
            },
            () => {

            });

        keyboardjs.bind("1",
            () => {
                this.sonicManager.indexedPalette++;
                this.sonicManager.clearCache();
            },
            () => {

            });
        keyboardjs.bind("q",
            () => {
                this.runGame();
            },
            () => {

            });
        keyboardjs.bind("p",
            () => {
                if (this.sonicManager.currentGameState == GameState.Playing)
                    if (this.sonicManager.inHaltMode)
                        this.sonicManager.waitingForTickContinue = false;
            },
            () => {

            });
        keyboardjs.bind("h",
            () => {
                if (this.sonicManager.currentGameState == GameState.Playing)
                    this.sonicManager.sonicToon.Hit(this.sonicManager.sonicToon.x, this.sonicManager.sonicToon.y);
            },
            () => {

            });
        keyboardjs.bind("u",
            () => {
                this.wideScreen = !this.wideScreen;
                this.resizeCanvas(true);
            },
            () => {

            });
        keyboardjs.bind("c",
            () => {
                if (this.sonicManager.currentGameState == GameState.Playing)
                    this.sonicManager.sonicToon.Debug();
            },
            () => {

            });
        keyboardjs.bind("up",
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
        keyboardjs.bind("down",
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
        keyboardjs.bind("left",
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
        keyboardjs.bind("right",
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
        keyboardjs.bind("space",
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
        keyboardjs.bind("e",
            () => {
                this.sonicManager.sonicLevel.curHeightMap = !this.sonicManager.sonicLevel.curHeightMap;
            },
            () => {

            });



        /*        client = SocketIOClient.Connect("159.203.118.77:8998");
                client.On<DataObject<string>>("SonicLevel",
                    data => {
                        Help.DecodeString<SlData.SLData>(data.Data, RunSonic);
                    });
                client.On<DataObject<KeyValuePair<string, string>[]>>("GetObjects.Response", data => {
                    this.sonicManager.loadObjects(data.Data);
                });*/
    }


    public runGame(): void {
        var sonicManager = this.sonicManager;
        switch (sonicManager.currentGameState) {
            case GameState.Playing:
                sonicManager.currentGameState = GameState.Editing;
                sonicManager.scale = new Point(4, 4);
                sonicManager.windowLocation = this.defaultWindowLocation(sonicManager.currentGameState, sonicManager.scale);
                sonicManager.sonicToon = null;
                break;
            case GameState.Editing:
                sonicManager.currentGameState = GameState.Playing;
                sonicManager.scale = new Point(4, 4);
                sonicManager.windowLocation = this.defaultWindowLocation(sonicManager.currentGameState, sonicManager.scale);
                sonicManager.sonicToon = new Sonic();
                break;
        }
        sonicManager.DestroyCanvases();
        sonicManager.ResetCanvases();
    }



    private canvasMouseMove(queryEvent: JQueryEventObject): void {
        queryEvent.preventDefault();
        document.body.style.cursor = "default";
        if (this.sonicManager.MouseMove(queryEvent))
            return;
        return;
    }
    private canvasOnClick(queryEvent: JQueryEventObject): void {
        queryEvent.preventDefault();
        if (this.sonicManager.OnClick(queryEvent))
            return;
    }
    private canvasMouseUp(queryEvent: JQueryEventObject): void {
        queryEvent.preventDefault();
        if (this.sonicManager.MouseUp(queryEvent))
            return;
    }
    public resizeCanvas(resetOverride: boolean): void {
        var canvasWidth = jQuery(window).width();
        var canvasHeight = jQuery(window).height();

        this.sonicManager.windowLocation = this.defaultWindowLocation(this.sonicManager.currentGameState, this.sonicManager.scale);


        var wide = new Point((canvasWidth / 320 / this.sonicManager.scale.x), (canvasHeight / 224 / this.sonicManager.scale.y));
        var even = new Point(Math.min((canvasWidth / 320 / this.sonicManager.scale.x), (canvasHeight / 224 / this.sonicManager.scale.y)), Math.min((canvasWidth / 320 / this.sonicManager.scale.x), (canvasHeight / 224 / this.sonicManager.scale.y)));
        this.sonicManager.realScale = !this.fullscreenMode ? new Point(1, 1) : (this.wideScreen ? wide : even);

        if (resetOverride || this.sonicManager.overrideRealScale == null)
            this.sonicManager.overrideRealScale = Point.create(this.sonicManager.realScale);
        else this.sonicManager.realScale = Point.create(this.sonicManager.overrideRealScale);

        this.gameCanvas.domCanvas.attr("width", (this.sonicManager.windowLocation.Width * (this.sonicManager.currentGameState == GameState.Playing ? this.sonicManager.scale.x * this.sonicManager.realScale.x : 1)).toString());
        this.gameCanvas.domCanvas.attr("height", (this.sonicManager.windowLocation.Height * (this.sonicManager.currentGameState == GameState.Playing ? this.sonicManager.scale.y * this.sonicManager.realScale.y : 1)).toString());
        this.gameGoodWidth = this.sonicManager.windowLocation.Width * (this.sonicManager.currentGameState == GameState.Playing ? this.sonicManager.scale.x * this.sonicManager.realScale.x : 1);
        var screenOffset = this.sonicManager.currentGameState == GameState.Playing ? new Point(((canvasWidth / 2 - this.sonicManager.windowLocation.Width * this.sonicManager.scale.x * this.sonicManager.realScale.x / 2)),
            (canvasHeight / 2 - this.sonicManager.windowLocation.Height * this.sonicManager.scale.y * this.sonicManager.realScale.y / 2)) : new Point(0, 0);
        this.gameCanvas.domCanvas.css("left", screenOffset.x + "px");
        this.gameCanvas.domCanvas.css("top", screenOffset.y + "px");
        this.sonicManager.destroyCanvases();
        this.sonicManager.resetCanvases();
    }
    public clear(canv: CanvasInformation): void {
        var w= this.gameGoodWidth;

        (<HTMLCanvasElement>canv.domCanvas[0]).width = this.gameGoodWidth;

        (<any>this.gameCanvas).webkitImageSmoothingEnabled = false;
        (<any>this.gameCanvas).mozImageSmoothingEnabled = false;
        (<any>this.gameCanvas).imageSmoothingEnabled = false;
    }
    public gameDraw(): void {
        this.sonicManager.mainDraw(this.gameCanvas);
    }

    public defaultWindowLocation(state: GameState, scale: Point): IntersectingRectangle {
        switch (state) {
            case GameState.Playing:
                return new IntersectingRectangle(0, 0, 320, 224);
            case GameState.Editing:
                var x = 0;
                var y = 0;
                if (this.sonicManager.sonicLevel && this.sonicManager.sonicLevel.startPositions && this.sonicManager.sonicLevel.startPositions[0]) {
                    x = this.sonicManager.sonicLevel.startPositions[0].x - 128 * scale.x;
                    y = this.sonicManager.sonicLevel.startPositions[0].y - 128 * scale.y;
                }
                return new IntersectingRectangle(x, y, window.innerWidth, window.innerHeight);
        }
        return null;
    }

    public static getCursorPosition(ev: JQueryEventObject): Point {
        if (ev.originalEvent && (<any>ev.originalEvent).targetTouches && (<any>ev.originalEvent).targetTouches.length > 0)
            ev = (<any>ev.originalEvent).targetTouches[0];
        if (ev.pageX && ev.pageY)
            return new Point(ev.pageX, ev.pageY);
        return new Point(ev.clientX, ev.clientY/*, 0, ev.Which == 3*/);
    }

}
