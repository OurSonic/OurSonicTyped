import {CanvasInformation} from '../common/canvasInformation';
import {GameState} from '../common/enums';
import {Help} from '../common/help';
import {SpriteLoader} from '../common/spriteLoader';
import {IntersectingRectangle, Point} from '../common/utils';
import {SlData} from '../slData';
import {SonicImage} from './level/sonicImage';
import {SpriteCache} from './level/spriteCache';
import {Sonic} from './sonic/sonic';
import {SonicManager} from './sonicManager';
import sonicJson from '../../assets/content/sprites/sonic.json';

export class SonicEngine {
  bgLowTileCanvas: CanvasInformation;
  bgHighTileCanvas: CanvasInformation;
  lowTileCanvas: CanvasInformation;
  spriteCanvas: CanvasInformation;
  highTileCanvas: CanvasInformation;
  sonicManager: SonicManager;
  static instance: SonicEngine;

  constructor() {
    SonicEngine.instance = this;

    this.bgLowTileCanvas = CanvasInformation.createFromElement(
      document.getElementById('bgLowTileLayer') as HTMLCanvasElement,
      320,
      224,
      true
    );
    this.bgHighTileCanvas = CanvasInformation.createFromElement(
      document.getElementById('bgHighTileLayer') as HTMLCanvasElement,
      320,
      224,
      true
    );
    this.lowTileCanvas = CanvasInformation.createFromElement(
      document.getElementById('lowTileLayer') as HTMLCanvasElement,
      320,
      224,
      true
    );
    this.spriteCanvas = CanvasInformation.createFromElement(
      document.getElementById('spriteLayer') as HTMLCanvasElement,
      320,
      224,
      true
    );
    this.highTileCanvas = CanvasInformation.createFromElement(
      document.getElementById('highTileLayer') as HTMLCanvasElement,
      320,
      224,
      true
    );

    this.bindInput();
    window.addEventListener('resize', e => this.resizeCanvas());
    this.sonicManager = new SonicManager(this, () => this.resizeCanvas());

    window.requestAnimationFrame(this.tick.bind(this));

    this.resizeCanvas();
  }

  private sonicSprites: {[key: string]: SonicImage} = {};
  spriteCache: SpriteCache;
  spriteLoader: SpriteLoader;

  preloadSprites(completed: () => void, update: (_: string) => void): void {
    if (this.spriteCache != null) {
      completed();
      return;
    }

    this.sonicSprites = sonicJson;

    this.spriteCache = this.spriteCache != null ? this.spriteCache : new SpriteCache();
    const ci = this.spriteCache.Rings;
    const spriteLocations: string[] = [];
    for (let j: number = 0; j < 4; j++) {
      spriteLocations.push(`assets/sprites/ring${j}.png`);
    }
    const ind_ = this.spriteCache.Indexes;
    this.spriteLoader = new SpriteLoader(completed, update);
    if (ci.length === 0) {
      const spriteStep = this.spriteLoader.addStep(
        'Sprites',
        (i, done) => {
          Help.loadSprite(spriteLocations[i], jd => {
            ci[i] = CanvasInformation.create(jd.width, jd.height, false);
            ci[i].context.drawImage(jd, 0, 0);
            done();
          });
        },
        () => {
          ind_.Sprites++;
          if (ind_.Sprites === 4) {
            return true;
          }
          return false;
        },
        false
      );
      for (let i = 0; i < spriteLocations.length; i++) {
        this.spriteLoader.addIterationToStep(spriteStep, i);
      }
    }
    const cci = this.spriteCache.SonicSprites;

    if (Object.keys(cci).length === 0) {
      const sonicStep = this.spriteLoader.addStep(
        'Sonic Sprites',
        (sp, done) => {
          for (const sonicSprite in this.sonicSprites) {
            cci[sonicSprite] = Help.scaleCsImage(this.sonicSprites[sonicSprite], new Point(1, 1), ec => {});
          }
          done();
        },
        () => true,
        false
      );
      this.spriteLoader.addIterationToStep(sonicStep, 0);
    }
  }

  private loadAssets() {}

  private tick(): void {
    window.requestAnimationFrame(this.tick.bind(this));
    try {
      const t0 = performance.now();
      this.sonicManager.tick();
      const t1 = performance.now();
      this.sonicManager.mainDraw();
      const t2 = performance.now();
      if (t1 - t0 + (t2 - t1) > 16) {
        // console.error('tick:', (t1 - t0).toFixed(1), 'draw:', (t2 - t1).toFixed(1));
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  private bindInput(): void {
    this.highTileCanvas.canvas.onmousedown = e => this.canvasOnClick(e);
    this.highTileCanvas.canvas.onmouseup = e => this.canvasMouseUp(e);
    this.highTileCanvas.canvas.onmousemove = e => this.canvasMouseMove(e);
    this.highTileCanvas.canvas.oncontextmenu = e => e.preventDefault();

    // (<any>keyboardJS).watch(document.getElementById('canvasBox'));
    keyboardJS.bind('f', () => (this.sonicManager.showHeightMap = !this.sonicManager.showHeightMap));

    keyboardJS.bind('q', () => this.runGame());

    keyboardJS.bind('c', () => {
      if (this.sonicManager.currentGameState === GameState.Playing) {
        this.sonicManager.sonicToon.debug();
      }
    });
    keyboardJS.bind(
      'up',
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.Playing:
            this.sonicManager.sonicToon.pressUp();
            break;
          case GameState.Editing:
            this.sonicManager.windowLocation.y -= 128;
            this.sonicManager.objectTickWindow.y -= 128;
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
      }
    );
    keyboardJS.bind(
      'down',
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.Playing:
            this.sonicManager.sonicToon.pressCrouch();
            break;
          case GameState.Editing:
            this.sonicManager.windowLocation.y += 128;
            this.sonicManager.objectTickWindow.y += 128;
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
      }
    );
    keyboardJS.bind(
      'left',
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.Playing:
            this.sonicManager.sonicToon.pressLeft();
            break;
          case GameState.Editing:
            this.sonicManager.windowLocation.x -= 128;
            this.sonicManager.objectTickWindow.x -= 128;
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
      }
    );
    keyboardJS.bind(
      'right',
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.Playing:
            this.sonicManager.sonicToon.pressRight();
            break;
          case GameState.Editing:
            this.sonicManager.windowLocation.x += 128;
            this.sonicManager.objectTickWindow.x += 128;
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
      }
    );
    keyboardJS.bind(
      'space',
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
      }
    );
    keyboardJS.bind('e', () => {
      this.sonicManager.sonicLevel.curHeightMap = !this.sonicManager.sonicLevel.curHeightMap;
    });
  }

  loadLevel(data: string): void {
    const l = JSON.parse(Help.decodeString(data));
    this.runSonic(l);
  }

  runSonic(level: SlData): void {
    this.clearCache();
    this.sonicManager.clearCache();
    this.sonicManager.load(level);
    this.sonicManager.windowLocation.x = 0;
    this.sonicManager.windowLocation.y = 0;
    this.sonicManager.objectTickWindow.x =
      (this.sonicManager.windowLocation.x - this.sonicManager.windowLocation.width * 0.2) | 0;
    this.sonicManager.objectTickWindow.y =
      (this.sonicManager.windowLocation.y - this.sonicManager.windowLocation.height * 0.2) | 0;
    this.sonicManager.objectTickWindow.width = (this.sonicManager.windowLocation.width * 1.8) | 0;
    this.sonicManager.objectTickWindow.height = (this.sonicManager.windowLocation.height * 1.8) | 0;
    this.sonicManager.currentGameState = GameState.Editing;

    this.runGame();
  }

  private clearCache() {
    if (this.spriteCache != null) {
      this.spriteCache.ClearCache();
    }
  }

  runGame(): void {
    const sonicManager = SonicManager.instance;
    switch (sonicManager.currentGameState) {
      case GameState.Playing:
        sonicManager.currentGameState = GameState.Editing;
        sonicManager.windowLocation = SonicEngine.defaultWindowLocation(sonicManager.currentGameState);
        sonicManager.sonicToon = null;
        break;
      case GameState.Editing:
        sonicManager.currentGameState = GameState.Playing;
        sonicManager.windowLocation = SonicEngine.defaultWindowLocation(sonicManager.currentGameState);
        sonicManager.sonicToon = new Sonic();
        break;
    }
    // sonicManager.DestroyCanvases();
    sonicManager.resetCanvases();
  }

  private canvasMouseMove(queryEvent: MouseEvent): void {
    queryEvent.preventDefault();
    this.sonicManager.mouseMove(queryEvent);
  }

  private canvasOnClick(queryEvent: MouseEvent): void {
    queryEvent.preventDefault();
    this.sonicManager.onClick(queryEvent);
  }

  private canvasMouseUp(queryEvent: MouseEvent): void {
    queryEvent.preventDefault();
    this.sonicManager.mouseUp(queryEvent);
  }

  resizeCanvas(): void {
    this.sonicManager.windowLocation = SonicEngine.defaultWindowLocation(this.sonicManager.currentGameState);
    this.sonicManager.resetCanvases();
  }

  static defaultWindowLocation(gameState: GameState) {
    switch (gameState) {
      case GameState.Playing:
        return new IntersectingRectangle(0, 0, 320, 224);
      case GameState.Editing:
        let x = 0;
        let y = 0;
        if (
          SonicManager.instance.sonicLevel &&
          SonicManager.instance.sonicLevel.startPositions &&
          SonicManager.instance.sonicLevel.startPositions[0]
        ) {
          x = SonicManager.instance.sonicLevel.startPositions[0].x - 128;
          y = SonicManager.instance.sonicLevel.startPositions[0].y - 128;
        }
        return new IntersectingRectangle(x, y, window.innerWidth, window.innerHeight);
    }
    return null;
  }
}
