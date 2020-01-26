/// <reference path="../../typings/keyboardjs.d.ts" />

import {CanvasInformation, CanvasInformationGL} from '../common/canvasInformation';
import {GameState} from '../common/enums';
import {Help} from '../common/help';
import mainTileShader from '../shaders/mainTileShader.glsl';
import {SpriteLoader} from '../common/spriteLoader';
import {IntersectingRectangle, Point} from '../common/utils';
import {SlData} from '../slData';
import {SonicImage} from './level/sonicImage';
import {SpriteCache} from './level/spriteCache';
import {Sonic} from './sonic/sonic';
import {SonicManager} from './sonicManager';

export class SonicEngine {
  bgLowTileCanvas: CanvasInformation;
  bgHighTileCanvas: CanvasInformation;
  lowTileCanvas: CanvasInformationGL;
  spriteCanvas: CanvasInformation;
  highTileCanvas: CanvasInformation;
  sonicManager: SonicManager;
  static instance: SonicEngine;
  private fpsMeter;

  constructor() {
    SonicEngine.instance = this;

    this.fpsMeter = new (window as any).FPSMeter(document.getElementById('canvasBox'), {
      right: '5px',
      left: 'auto',
      heat: 1
    });
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
    this.lowTileCanvas = CanvasInformationGL.createFromElement(
      document.getElementById('lowTileLayer') as HTMLCanvasElement,
      8,
      8
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

    this.setupGL(this.lowTileCanvas);
  }

  private sonicSprites: {[key: string]: SonicImage} = {};
  spriteCache: SpriteCache;
  spriteLoader: SpriteLoader;

  preloadSprites(completed: () => void, update: (_: string) => void): void {
    if (this.spriteCache != null) {
      completed();
      return;
    }
    jQuery.getJSON('assets/content/sprites/sonic.json', (data: {[key: string]: SonicImage}) => {
      this.sonicSprites = data;

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
    });
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
      this.fpsMeter.tick();
    } catch (ex) {
      console.error(ex);
    }
  }

  private bindInput(): void {
    this.highTileCanvas.domCanvas.mousedown((e: JQueryEventObject) => this.canvasOnClick(e));
    this.highTileCanvas.domCanvas.mouseup((e: JQueryEventObject) => this.canvasMouseUp(e));
    this.highTileCanvas.domCanvas.mousemove((e: JQueryEventObject) => this.canvasMouseMove(e));
    this.highTileCanvas.domCanvas.bind('touchstart', (e: JQueryEventObject) => this.canvasOnClick(e));
    this.highTileCanvas.domCanvas.bind('touchend', (e: JQueryEventObject) => this.canvasMouseUp(e));
    this.highTileCanvas.domCanvas.bind('touchmove', (e: JQueryEventObject) => this.canvasMouseMove(e));
    this.highTileCanvas.domCanvas.bind('contextmenu', e => e.preventDefault());

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

  private static buildShaderProgram(gl: WebGLRenderingContext) {
    const program = gl.createProgram();

    function addShader(type: number, code: string) {
      const shader = gl.createShader(type);

      gl.shaderSource(shader, code);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(`Error compiling shader:`);
        console.log(gl.getShaderInfoLog(shader));
        return;
      }
      gl.attachShader(program, shader);
    }

    addShader(
      gl.VERTEX_SHADER,
      ` attribute vec4 a_position;
    varying vec2 v_texcoord;
    void main() {
      gl_Position = a_position;
      v_texcoord = a_position.xy * vec2(0.5, -0.5) + 0.5;
    }`
    );
    addShader(gl.FRAGMENT_SHADER, mainTileShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log('Error linking shader program:');
      console.log(gl.getProgramInfoLog(program));
    }

    return program;
  }

  private setupGL(lowTileCanvas: CanvasInformationGL) {
    const gl = lowTileCanvas.context;
    // Note: createProgramFromScripts will call bindAttribLocation
    // based on the index of the attibute names we pass to it.
    const program = SonicEngine.buildShaderProgram(gl);
    gl.useProgram(program);
    const paletteLoc = gl.getUniformLocation(program, 'u_palette');
    const u_boardSizeLoc = gl.getUniformLocation(program, 'u_boardSize');
    const u_windowPositionLoc = gl.getUniformLocation(program, 'u_windowPosition');
    const chunkMapLoc = gl.getUniformLocation(program, 'u_chunkMap');
    const chunksLoc = gl.getUniformLocation(program, 'u_chunks');

    gl.uniform1i(paletteLoc, 1);
    gl.uniform1i(u_boardSizeLoc, 2);
    gl.uniform1i(u_windowPositionLoc, 3);
    gl.uniform1i(chunkMapLoc, 4);
    gl.uniform1i(chunksLoc, 5);
    // prettier-ignore
    const positions = [
      1,  1,
      -1,  1,
      -1, -1,
      1,  1,
      -1, -1,
      1, -1,
    ];
    const vertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // Setup a palette.
    const palette = new Uint8Array(256 * 4);

    // I'm lazy so just setting 4 colors in palette
    function setPalette(index, r, g, b, a) {
      palette[index * 4 + 0] = r;
      palette[index * 4 + 1] = g;
      palette[index * 4 + 2] = b;
      palette[index * 4 + 3] = a;
    }
    setPalette(1, 255, 0, 0, 255); // red
    setPalette(2, 0, 255, 0, 255); // green
    setPalette(3, 0, 0, 255, 255); // blue
    setPalette(4, 0, 255, 255, 255); // blue

    // make palette texture and upload palette
    gl.activeTexture(gl.TEXTURE1);
    const paletteTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, paletteTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette);

    gl.uniform2i(u_windowPositionLoc, 0, 0);
    gl.uniform2i(u_boardSizeLoc, 16, 16);

    gl.activeTexture(gl.TEXTURE4);
    const chunkMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, chunkMap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // prettier-ignore
    const image = new Uint8Array([
      1,2,0,0,0,0,0,0,
      3,1,2,0,0,0,0,0,
      0,3,1,2,0,0,0,0,
      0,0,3,1,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
    ]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, 8, 8, 0, gl.ALPHA, gl.UNSIGNED_BYTE, image);

    gl.activeTexture(gl.TEXTURE5);
    const chunks = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, chunks);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // prettier-ignore
    const chunksData = new Uint8Array([
      1,2,0,0,0,0,0,0,
      3,1,2,0,0,0,0,0,
      0,3,1,2,0,0,0,0,
      0,0,3,1,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
    ]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, 8, 8, 0, gl.ALPHA, gl.UNSIGNED_BYTE, chunksData);

    let i = 0;
    i = 0;

    setInterval(() => {
      i = (i + 1) % 16;
      // gl.uniform2i(u_windowPositionLoc, (Math.random() * 3) | 0, 300);

      // image[Math.floor(Math.random() * image.length)] = Math.floor(Math.random() * 4);
      // gl.activeTexture(gl.TEXTURE0);
      // gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, 8, 8, 0, gl.ALPHA, gl.UNSIGNED_BYTE, image);

      gl.uniform2i(u_windowPositionLoc, i, i);

      gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
    }, 500);
  }
}
