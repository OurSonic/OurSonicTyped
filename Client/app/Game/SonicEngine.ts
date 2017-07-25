/// <reference path="../../typings/keyboardjs.d.ts" />
/// <reference path="../../typings/socket.io-client.d.ts" />


import {CanvasInformation} from "../common/CanvasInformation";
import {SonicManager} from "./SonicManager";
import {GameState} from "../common/Enums";
import {Point} from "../common/Utils";
import {Sonic} from "./sonic/Sonic";
import {SLData} from "../SLData";
import {Help} from "../common/Help";
import {TileAnimationManager} from "./level/Tiles/TileAnimationManager";
import {TilePaletteAnimationManager} from "./Level/Tiles/TilePaletteAnimationManager";


export class SonicEngine {
    public lowTileCanvas: CanvasInformation;
    public spriteCanvas: CanvasInformation;
    public highTileCanvas: CanvasInformation;
    public sonicManager: SonicManager;
    public static instance: SonicEngine;
    private fpsMeter;

    constructor() {
        SonicEngine.instance = this;

        this.fpsMeter = new (<any>window).FPSMeter(document.getElementById('canvasBox'), {
            right: '5px',
            left: 'auto',
            heat: 1
        });
        this.lowTileCanvas = CanvasInformation.CreateFromElement(<HTMLCanvasElement>document.getElementById('lowTileLayer'), 320, 224, true);
        this.spriteCanvas = CanvasInformation.CreateFromElement(<HTMLCanvasElement>document.getElementById('spriteLayer'), 320, 224, true);
        this.highTileCanvas = CanvasInformation.CreateFromElement(<HTMLCanvasElement>document.getElementById('highTileLayer'), 320, 224, true);


        this.bindInput();
        window.addEventListener("resize", e => this.resizeCanvas());
        this.sonicManager = new SonicManager(this, () => this.resizeCanvas());


        window.requestAnimationFrame(this.tick.bind(this));


        this.resizeCanvas();


    }

    private tick(): void {
        window.requestAnimationFrame(this.tick.bind(this));

        let t0 = performance.now();
        this.sonicManager.tick();
        let t1 = performance.now();
        this.sonicManager.mainDraw();
        let t2 = performance.now();
        if ((t1 - t0) + (t2 - t1) > 16) {
            console.error('tick:', (t1 - t0).toFixed(1), 'draw:', (t2 - t1).toFixed(1));
        }
        this.fpsMeter.tick();
    }

    private bindInput(): void {
        this.highTileCanvas.domCanvas.mousedown((e: JQueryEventObject) => this.canvasOnClick(e));
        this.highTileCanvas.domCanvas.mouseup((e: JQueryEventObject) => this.canvasMouseUp(e));
        this.highTileCanvas.domCanvas.mousemove((e: JQueryEventObject) => this.canvasMouseMove(e));
        this.highTileCanvas.domCanvas.bind("touchstart", (e: JQueryEventObject) => this.canvasOnClick(e));
        this.highTileCanvas.domCanvas.bind("touchend", (e: JQueryEventObject) => this.canvasMouseUp(e));
        this.highTileCanvas.domCanvas.bind("touchmove", (e: JQueryEventObject) => this.canvasMouseMove(e));
        this.highTileCanvas.domCanvas.bind("contextmenu", (e) => e.preventDefault());

        // (<any>keyboardJS).watch(document.getElementById('canvasBox'));
        keyboardJS.bind("f", () => this.sonicManager.showHeightMap = !this.sonicManager.showHeightMap);
        keyboardJS.bind("o", () => {
            if (this.sonicManager.currentGameState == GameState.Playing) this.sonicManager.inHaltMode = !this.sonicManager.inHaltMode;
        });

        keyboardJS.bind("q", () => this.runGame());
        keyboardJS.bind("p", () => {
            if (this.sonicManager.currentGameState == GameState.Playing)
                if (this.sonicManager.inHaltMode)
                    this.sonicManager.waitingForTickContinue = false;
        });


        keyboardJS.bind("c", () => {
            if (this.sonicManager.currentGameState == GameState.Playing)
                this.sonicManager.sonicToon.debug();
        });
        keyboardJS.bind("up", () => {
            switch (this.sonicManager.currentGameState) {
                case GameState.Playing:
                    this.sonicManager.sonicToon.pressUp();
                    break;
                case GameState.Editing:
                    this.sonicManager.windowLocation.y -= 128;
                    this.sonicManager.bigWindowLocation.y -= 128;
                    break;
            }
        }, () => {
            switch (this.sonicManager.currentGameState) {
                case GameState.Playing:
                    this.sonicManager.sonicToon.releaseUp();
                    break;
                case GameState.Editing:
                    break;
            }
        });
        keyboardJS.bind("down", () => {
            switch (this.sonicManager.currentGameState) {
                case GameState.Playing:
                    this.sonicManager.sonicToon.pressCrouch();
                    break;
                case GameState.Editing:
                    this.sonicManager.windowLocation.y += 128;
                    this.sonicManager.bigWindowLocation.y += 128;
                    break;
            }
        }, () => {
            switch (this.sonicManager.currentGameState) {
                case GameState.Playing:
                    this.sonicManager.sonicToon.releaseCrouch();
                    break;
                case GameState.Editing:
                    break;
            }
        });
        keyboardJS.bind("left", () => {
            switch (this.sonicManager.currentGameState) {
                case GameState.Playing:
                    this.sonicManager.sonicToon.pressLeft();
                    break;
                case GameState.Editing:
                    this.sonicManager.windowLocation.x -= 128;
                    this.sonicManager.bigWindowLocation.x -= 128;
                    break;
            }
        }, () => {
            switch (this.sonicManager.currentGameState) {
                case GameState.Playing:
                    this.sonicManager.sonicToon.releaseLeft();
                    break;
                case GameState.Editing:
                    break;
            }
        });
        keyboardJS.bind("right", () => {
            switch (this.sonicManager.currentGameState) {
                case GameState.Playing:
                    this.sonicManager.sonicToon.pressRight();
                    break;
                case GameState.Editing:
                    this.sonicManager.windowLocation.x += 128;
                    this.sonicManager.bigWindowLocation.x += 128;
                    break;
            }
        }, () => {
            switch (this.sonicManager.currentGameState) {
                case GameState.Playing:
                    this.sonicManager.sonicToon.releaseRight();
                    break;
                case GameState.Editing:
                    break;
            }
        });
        keyboardJS.bind("space", () => {
            switch (this.sonicManager.currentGameState) {
                case GameState.Playing:
                    this.sonicManager.sonicToon.pressJump();
                    break;
                case GameState.Editing:
                    break;
            }
        }, () => {
            switch (this.sonicManager.currentGameState) {
                case GameState.Playing:
                    this.sonicManager.sonicToon.releaseJump();
                    break;
                case GameState.Editing:
                    break;
            }
        });
        keyboardJS.bind("e", () => {
            this.sonicManager.sonicLevel.curHeightMap = !this.sonicManager.sonicLevel.curHeightMap;
        });

    }

    loadLevel(data: string): void {
        let l = JSON.parse(Help.decodeString(data));
        this.runSonic(l);
    }


    public runSonic(level: SLData): void {
        this.sonicManager.clearCache();
        this.sonicManager.load(level);
        this.sonicManager.windowLocation.x = 0;
        this.sonicManager.windowLocation.y = 0;
        this.sonicManager.bigWindowLocation.x = (this.sonicManager.windowLocation.x - this.sonicManager.windowLocation.width * 0.2) | 0;
        this.sonicManager.bigWindowLocation.y = (this.sonicManager.windowLocation.y - this.sonicManager.windowLocation.height * 0.2) | 0;
        this.sonicManager.bigWindowLocation.width = (this.sonicManager.windowLocation.width * 1.8) | 0;
        this.sonicManager.bigWindowLocation.height = (this.sonicManager.windowLocation.height * 1.8) | 0;
        this.sonicManager.currentGameState = GameState.Editing;
        this.sonicManager.tilePaletteAnimationManager = new TilePaletteAnimationManager(this.sonicManager);
        this.sonicManager.tileAnimationManager = new TileAnimationManager(this.sonicManager);

        this.runGame();
        debugger;
    }

    public runGame(): void {
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
        // sonicManager.DestroyCanvases();
        sonicManager.resetCanvases();
    }

    private canvasMouseMove(queryEvent: JQueryEventObject): void {
        queryEvent.preventDefault();
        this.sonicManager.mouseMove(queryEvent);
    }

    private canvasOnClick(queryEvent: JQueryEventObject): void {
        queryEvent.preventDefault();
        this.sonicManager.onClick(queryEvent);
    }

    private canvasMouseUp(queryEvent: JQueryEventObject): void {
        queryEvent.preventDefault();
        this.sonicManager.mouseUp(queryEvent);
    }

    public resizeCanvas(): void {
        this.sonicManager.windowLocation = Help.defaultWindowLocation(this.sonicManager.currentGameState, this.sonicManager.scale);
        this.sonicManager.resetCanvases();
    }


}