import * as twgl from 'twgl.js';
import {m4} from 'twgl.js';
import {CanvasInformation, CanvasInformationGL} from '../common/canvasInformation';
import {GameState} from '../common/enums';
import {assertType, Help} from '../common/help';
import {SpriteLoader} from '../common/spriteLoader';
import {IntersectingRectangle, Point, Utils} from '../common/utils';
import {SlData} from '../slData';
import {SonicImage} from './level/sonicImage';
import {SpriteCache} from './level/spriteCache';
import {Sonic} from './sonic/sonic';
import {SonicManager} from './sonicManager';
import sonicJson from '../../assets/content/sprites/sonic.json';
import {TilePiece} from './level/tiles/tilePiece';

export class SonicEngine {
  bgLowTileCanvas: CanvasInformation;
  bgHighTileCanvas: CanvasInformation;
  lowTileCanvas: CanvasInformation | CanvasInformationGL;
  spriteCanvas: CanvasInformation;
  highTileCanvas: CanvasInformation;
  sonicManager: SonicManager;
  static instance: SonicEngine;
  private glDraw: () => void;

  constructor() {
    SonicEngine.instance = this;

    const canvasWidth = 320;
    const canvasHeight = 224;
    this.bgLowTileCanvas = CanvasInformation.createFromElement(
      document.getElementById('bgLowTileLayer') as HTMLCanvasElement,
      canvasWidth,
      canvasHeight,
      true
    );
    this.bgHighTileCanvas = CanvasInformation.createFromElement(
      document.getElementById('bgHighTileLayer') as HTMLCanvasElement,
      canvasWidth,
      canvasHeight,
      true
    );
    this.lowTileCanvas = (Help.DRAWGL ? CanvasInformationGL : CanvasInformation).createFromElement(
      document.getElementById('lowTileLayer') as HTMLCanvasElement,
      canvasWidth,
      canvasHeight
    );
    this.spriteCanvas = CanvasInformation.createFromElement(
      document.getElementById('spriteLayer') as HTMLCanvasElement,
      canvasWidth,
      canvasHeight,
      true
    );
    this.highTileCanvas = CanvasInformation.createFromElement(
      document.getElementById('highTileLayer') as HTMLCanvasElement,
      canvasWidth,
      canvasHeight,
      true
    );

    this.bindInput();
    window.addEventListener('resize', (e) => this.resizeCanvas());
    this.sonicManager = new SonicManager(this, () => this.resizeCanvas());

    window.requestAnimationFrame(this.tick);

    this.resizeCanvas();
  }

  private sonicSprites: {[key: string]: SonicImage} = {};
  spriteCache: SpriteCache;
  spriteLoader: SpriteLoader;

  preloadSprites(completed: () => void, update: (_: string) => void): void {
    if (this.spriteCache) {
      completed();
      return;
    }

    this.sonicSprites = sonicJson;

    this.spriteCache = new SpriteCache();
    const spriteLocations: string[] = [];
    for (let j: number = 0; j < 4; j++) {
      spriteLocations.push(`assets/sprites/ring${j}.png`);
    }
    const spriteCacheIndexes = this.spriteCache.indexes;
    this.spriteLoader = new SpriteLoader(completed, update);
    if (this.spriteCache.rings.length === 0) {
      const spriteStep = this.spriteLoader.addStep(
        'Sprites',
        (i, done) => {
          Help.loadSprite(spriteLocations[i], (jd) => {
            this.spriteCache.rings[i] = CanvasInformation.create(jd.width, jd.height, false);
            this.spriteCache.rings[i].context.drawImage(jd, 0, 0);
            done();
          });
        },
        () => {
          spriteCacheIndexes.sprites++;
          if (spriteCacheIndexes.sprites === 4) {
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

    if (Object.keys(this.spriteCache.sonicSprites).length === 0) {
      const sonicStep = this.spriteLoader.addStep(
        'Sonic Sprites',
        (sp, done) => {
          for (const sonicSprite in this.sonicSprites) {
            this.spriteCache.sonicSprites[sonicSprite] = Help.scaleCsImage(
              this.sonicSprites[sonicSprite],
              new Point(1, 1),
              (ec) => {}
            );
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

  private tick = (): void => {
    window.requestAnimationFrame(this.tick);
    try {
      const t0 = performance.now();
      this.sonicManager.tick();
      const t1 = performance.now();
      this.sonicManager.mainDraw();
      const t2 = performance.now();
      if (this.glDraw) {
        this.glDraw();
      }
      if (t1 - t0 + (t2 - t1) > 16) {
        // console.error('tick:', (t1 - t0).toFixed(1), 'draw:', (t2 - t1).toFixed(1));
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  private bindInput(): void {
    this.highTileCanvas.canvas.onmousedown = (e) => this.canvasOnClick(e);
    this.highTileCanvas.canvas.onmouseup = (e) => this.canvasMouseUp(e);
    this.highTileCanvas.canvas.onmousemove = (e) => this.canvasMouseMove(e);
    this.highTileCanvas.canvas.oncontextmenu = (e) => e.preventDefault();

    // (<any>keyboardJS).watch(document.getElementById('canvasBox'));
    keyboardJS.bind('f', () => (this.sonicManager.showHeightMap = !this.sonicManager.showHeightMap));
    keyboardJS.bind('r', () => {
      if (this.sonicManager.currentGameState === GameState.playing) {
        this.sonicManager.sonicToon.gsp = 16;
      }
    });

    keyboardJS.bind(
      'o',
      () => {
        if (this.sonicManager.sonicToon) this.sonicManager.inHaltMode = !this.sonicManager.inHaltMode;
      },
      () => {}
    );
    keyboardJS.bind(
      'p',
      () => {
        if (this.sonicManager.sonicToon)
          if (this.sonicManager.inHaltMode) {
            this.sonicManager.waitingForTickContinue = false;
          }
      },
      () => {}
    );

    keyboardJS.bind('q', () => this.runGame());

    keyboardJS.bind('e', () => {
      this.sonicManager.sonicLevel.curHeightMap = !this.sonicManager.sonicLevel.curHeightMap;
    });
    keyboardJS.bind('1', () => {
      this.sonicManager.currentTestSonic--;
    });
    keyboardJS.bind('2', () => {
      this.sonicManager.currentTestSonic++;
    });

    keyboardJS.bind('c', () => {
      if (this.sonicManager.currentGameState === GameState.playing) {
        this.sonicManager.sonicToon.debug();
      }
    });
    keyboardJS.bind(
      'up',
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.playing:
            this.sonicManager.sonicToon.pressUp();
            break;
          case GameState.editing:
            this.sonicManager.windowLocation.y -= 128;
            this.sonicManager.objectTickWindow.y -= 128;
            break;
        }
      },
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.playing:
            this.sonicManager.sonicToon.releaseUp();
            break;
          case GameState.editing:
            break;
        }
      }
    );
    keyboardJS.bind(
      'down',
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.playing:
            this.sonicManager.sonicToon.pressCrouch();
            break;
          case GameState.editing:
            this.sonicManager.windowLocation.y += 128;
            this.sonicManager.objectTickWindow.y += 128;
            break;
        }
      },
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.playing:
            this.sonicManager.sonicToon.releaseCrouch();
            break;
          case GameState.editing:
            break;
        }
      }
    );
    keyboardJS.bind(
      'left',
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.playing:
            this.sonicManager.sonicToon.pressLeft();
            break;
          case GameState.editing:
            this.sonicManager.windowLocation.x -= 128;
            this.sonicManager.objectTickWindow.x -= 128;
            break;
        }
      },
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.playing:
            this.sonicManager.sonicToon.releaseLeft();
            break;
          case GameState.editing:
            break;
        }
      }
    );
    keyboardJS.bind(
      'right',
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.playing:
            this.sonicManager.sonicToon.pressRight();
            break;
          case GameState.editing:
            this.sonicManager.windowLocation.x += 128;
            this.sonicManager.objectTickWindow.x += 128;
            break;
        }
      },
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.playing:
            this.sonicManager.sonicToon.releaseRight();
            break;
          case GameState.editing:
            break;
        }
      }
    );
    keyboardJS.bind(
      'space',
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.playing:
            this.sonicManager.sonicToon.pressJump();
            break;
          case GameState.editing:
            break;
        }
      },
      () => {
        switch (this.sonicManager.currentGameState) {
          case GameState.playing:
            this.sonicManager.sonicToon.releaseJump();
            break;
          case GameState.editing:
            break;
        }
      }
    );
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
    this.sonicManager.currentGameState = GameState.editing;

    this.runGame();
  }

  private clearCache() {
    if (this.spriteCache != null) {
      this.spriteCache.clearCache();
    }
  }

  runGame(): void {
    const sonicManager = SonicManager.instance;
    switch (sonicManager.currentGameState) {
      case GameState.playing:
        sonicManager.currentGameState = GameState.editing;
        sonicManager.windowLocation = SonicEngine.defaultWindowLocation(sonicManager.currentGameState);
        sonicManager.sonicToon = null;
        break;
      case GameState.editing:
        sonicManager.currentGameState = GameState.playing;
        sonicManager.windowLocation = SonicEngine.defaultWindowLocation(sonicManager.currentGameState);
        sonicManager.sonicToon = new Sonic(this.sonicManager);
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
      case GameState.playing:
        return new IntersectingRectangle(0, 0, 320, 224);
      case GameState.editing:
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

  setupGL() {
    const lowTileCanvas = this.lowTileCanvas;
    const gl = lowTileCanvas.context;
    if (!Help.DRAWGL) return;
    assertType<WebGLRenderingContext>(gl);
    twgl.addExtensionsToContext(gl);
    const programInfo = twgl.createProgramInfo(gl, [
      // language=GLSL
      `
          precision highp  float;
          attribute vec4 position;
          varying highp  vec2 vTexCoord;
          uniform  mat4 world;
          attribute vec2 texcoord;
          void main() {
              gl_Position = (position)*world;
              vTexCoord =texcoord;
          }
      `,
      // language=GLSL
      `
          precision highp  float;
          uniform sampler2D texture;
          uniform sampler2D palette;
          varying highp  vec2 vTexCoord;
          void main() {
              float d=texture2D(texture,vTexCoord).r;
              gl_FragColor = texture2D(palette,vec2(0.5,d));
//              gl_FragColor = texture2D(palette,vTexCoord);
          }
      `,
    ]);
    const bufferInfo = twgl.primitives.createPlaneBufferInfo(
      gl,
      2,
      2,
      1,
      1,
      m4.scale(m4.rotateX(m4.identity(), Help.degToRad(90)), [1 / (320 / 8), 1, 1 / (224 / 8)])
    );
    const textures = Utils.toDictionary(
      this.sonicManager.sonicLevel.tiles,
      (e) => e.index,
      (e) => {
        const buffer = new Array(8 * 8 * 4);
        for (let x = 0; x < 8; x++) {
          const color = e.colors[x];
          for (let y = 0; y < 8; y++) {
            const col = color[y];
            buffer[(y * 8 + x) * 4] = (col / 16) * 256;
            buffer[(y * 8 + x) * 4 + 1] = (col / 16) * 256;
            buffer[(y * 8 + x) * 4 + 2] = (col / 16) * 256;
            buffer[(y * 8 + x) * 4 + 3] = (col / 16) * 256;
          }
        }

        const texture = twgl.createTexture(gl, {
          mag: gl.NEAREST,
          min: gl.NEAREST,
          wrapS: gl.CLAMP_TO_EDGE,
          wrapT: gl.CLAMP_TO_EDGE,
          width: 8,
          height: 8,
          src: Array.from(buffer),
        });
        return texture;
      }
    );

    const palette = Utils.toDictionary(
      this.sonicManager.sonicLevel.palette,
      (e, index) => index,
      (e) => {
        const buffer = new Array(e.length * 4);
        for (let j = 0; j < e.length; j++) {
          const k = from32toRGB(e[j]);
          buffer[j * 4 + 0] = k[2];
          buffer[j * 4 + 1] = k[1];
          buffer[j * 4 + 2] = k[0];
          buffer[j * 4 + 3] = 255;
        }
        const texture = twgl.createTexture(gl, {
          mag: gl.NEAREST,
          min: gl.NEAREST,
          wrapS: gl.CLAMP_TO_EDGE,
          wrapT: gl.CLAMP_TO_EDGE,
          width: 1,
          height: e.length,
          src: buffer,
        });
        return texture;
      }
    );
    function from32toRGB(v) {
      const color = v;
      const r = (color >> 16) & 255; // 255
      const g = (color >> 8) & 255; // 122
      const b = color & 255; // 15

      return [r, g, b];
    }
    let ind = 0;
    this.glDraw = function render() {
      // console.time('render')
      console.profile('render');
      // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.useProgram(programInfo.program);
      twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      for (let lx = 0; lx < this.sonicManager.sonicLevel.levelWidth; lx++) {
        for (let ly = 0; ly < this.sonicManager.sonicLevel.levelHeight; ly++) {
          const chunk = this.sonicManager.sonicLevel.getChunkAt(lx, ly);
          for (let tpX = 0; tpX < 8; tpX++) {
            for (let tpY = 0; tpY < 8; tpY++) {
              /*          twgl.setAttributes(programInfo.attribSetters, {
                position: {
                  value: [x, 0, y, 1],
                  size: 3,
                } as any,
              });*/
              const tilepieceInfo = chunk.getTilePieceInfo(tpX, tpY, false);
              const tilepiece = chunk.getTilePieceAt(tpX, tpY, false);
              const drawOrderIndex = tilepieceInfo.xFlip ? (tilepieceInfo.yFlip ? 0 : 1) : tilepieceInfo.yFlip ? 2 : 3;
              for (let tInd = 0; tInd < tilepiece.tiles.length; tInd++) {
                const tileInfo = tilepiece.tiles[tInd];
                const tile = this.sonicManager.sonicLevel.getTile(tileInfo.tileIndex);

                const tileXFlip = tilepieceInfo.xFlip !== tileInfo.xFlip;
                const tileYFlip = tilepieceInfo.yFlip !== tileInfo.yFlip;
                const drawOrderElement = TilePiece.drawOrder[drawOrderIndex];
                const df = TilePiece.drawInfo[drawOrderElement[tInd]];
                const world = m4.identity();
                m4.translate(
                  world,
                  [(tpX * 2 + df[0] + lx * 16) / (320 / 16), (tpY * 2 + df[1] + ly * 16) / (224 / 16), 0],
                  world
                );
                // m4.multiply(world, [1 / (320 / 16), 1 / (224 / 16), 1, 1], world);
                m4.scale(world, [tileXFlip ? -1 : 1, tileYFlip ? 1 : -1, 1], world);
                m4.transpose(world, world);
                m4.scale(world, [1, -1, 1], world);
                twgl.setUniforms(programInfo, {
                  world,
                  texture: textures[tile.index],
                  palette: palette[tileInfo.palette],
                });
                twgl.drawBufferInfo(gl, bufferInfo);
              }
            }
          }
        }
      }
      console.profileEnd('render');
      // console.timeEnd('render');
    };
  }
}

/*
 * each tile gets a triangle that you pass the texture shader into with the xflip yflip tiledata (colors) and palette
 * */

/*<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf8">
    <!--

    @license twgl.js Copyright (c) 2015, Gregg Tavares All Rights Reserved.
    Available via the MIT license.
    see: http://github.com/greggman/twgl.js for details

    -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <meta property="og:title" content="TWGL.js - instancing" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="http://twgljs.org/examples/screenshots/instancing.png" />
    <meta property="og:description" content="TWGL.js - instancing" />
    <meta property="og:url" content="http://twgljs.org" />

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@greggman">
    <meta name="twitter:creator" content="@greggman">
    <meta name="twitter:domain" content="twgljs.org">
    <meta name="twitter:title" content="TWGL.js - instancing">
    <meta name="twitter:url" content="http://twgljs.org/examples/instancing.html">
    <meta name="twitter:description" content="TWGL.js - instancing">
    <meta name="twitter:image:src" content="http://twgljs.org/examples/screenshots/instancing.png">

    <link href="/resources/images/twgljs-icon.png" rel="shortcut icon" type="image/png">

    <title>twgl.js - twgl cube</title>
    <style>
      body {
          margin: 0;
          font-family: monospace;
      }
      canvas {
          display: block;
          width: 100vw;
          height: 100vh;
      }
      #b {
        position: absolute;
        top: 10px;
        width: 100%;
        text-align: center;
        z-index: 2;
      }
    </style>
  </head>
  <body>
    <canvas id="c"></canvas>
    <div id="b"><a href="http://twgljs.org">twgl.js</a> - instancing</div>
  </body>
  <script id="vs" type="notjs">
uniform mat4 u_viewProjection;
uniform vec3 u_lightWorldPos;
uniform mat4 u_viewInverse;

attribute vec4 instanceColor;
attribute mat4 instanceWorld;
attribute vec4 position;
attribute vec3 normal;

varying vec4 v_position;
varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;
varying vec4 v_color;

void main() {
  v_color = instanceColor;
  vec4 worldPosition = instanceWorld * position;
  v_position = u_viewProjection * worldPosition;
  v_normal = (instanceWorld * vec4(normal, 0)).xyz;
  v_surfaceToLight = u_lightWorldPos - worldPosition.xyz;
  v_surfaceToView = u_viewInverse[3].xyz - worldPosition.xyz;
  gl_Position = v_position;
}
  </script>
  <script id="fs" type="notjs">
precision mediump float;

varying vec4 v_position;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;
varying vec4 v_color;

uniform vec4 u_lightColor;
uniform vec4 u_ambient;
uniform vec4 u_specular;
uniform float u_shininess;
uniform float u_specularFactor;

vec4 lit(float l ,float h, float m) {
  return vec4(1.0,
              max(l, 0.0),
              (l > 0.0) ? pow(max(0.0, h), m) : 0.0,
              1.0);
}

void main() {
  vec4 diffuseColor = v_color;
  vec3 a_normal = normalize(v_normal);
  vec3 surfaceToLight = normalize(v_surfaceToLight);
  vec3 surfaceToView = normalize(v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLight + surfaceToView);
  vec4 litR = lit(dot(a_normal, surfaceToLight),
                    dot(a_normal, halfVector), u_shininess);
  vec4 outColor = vec4((
  u_lightColor * (diffuseColor * litR.y + diffuseColor * u_ambient +
                u_specular * litR.z * u_specularFactor)).rgb,
      diffuseColor.a);
  gl_FragColor = outColor;
}
  </script>
  <script type="module">
    import * as twgl from '../dist/4.x/twgl-full.module.js';
    function main() {
      const m4 = twgl.m4;
      const gl = document.getElementById("c").getContext("webgl");
      twgl.addExtensionsToContext(gl);
      if (!gl.drawArraysInstanced || !gl.createVertexArray) {
        alert("need drawArraysInstanced and createVertexArray"); // eslint-disable-line
        return;
      }
      const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

      function rand(min, max) {
        if (max === undefined) {
          max = min;
          min = 0;
        }
        return min + Math.random() * (max - min);
      }

      const numInstances = 100000;
      const instanceWorlds = new Float32Array(numInstances * 16);
      const instanceColors = [];
      const r = 70;
      for (let i = 0; i < numInstances; ++i) {
        const mat = new Float32Array(instanceWorlds.buffer, i * 16 * 4, 16);
        m4.translation([rand(-r, r), rand(-r, r), rand(-r, r)], mat);
        m4.rotateZ(mat, rand(0, Math.PI * 2), mat);
        m4.rotateX(mat, rand(0, Math.PI * 2), mat);
        instanceColors.push(rand(1), rand(1), rand(1));
      }
      const arrays = twgl.primitives.createCubeVertices();
      Object.assign(arrays, {
        instanceWorld: {
          numComponents: 16,
          data: instanceWorlds,
          divisor: 1,
        },
        instanceColor: {
          numComponents: 3,
          data: instanceColors,
          divisor: 1,
        },
      });
      const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
      const vertexArrayInfo = twgl.createVertexArrayInfo(gl, programInfo, bufferInfo);

      const uniforms = {
        u_lightWorldPos: [1, 8, -30],
        u_lightColor: [1, 1, 1, 1],
        u_ambient: [0, 0, 0, 1],
        u_specular: [1, 1, 1, 1],
        u_shininess: 50,
        u_specularFactor: 1,
      };

      function render(time) {
        time *= 0.001;
        twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fov = 30 * Math.PI / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.5;
        const zFar = 500;
        const projection = m4.perspective(fov, aspect, zNear, zFar);
        const radius = 25;
        const speed = time * .1;
        const eye = [Math.sin(speed) * radius, Math.sin(speed * .7) * 10, Math.cos(speed) * radius];
        const target = [0, 0, 0];
        const up = [0, 1, 0];

        const camera = m4.lookAt(eye, target, up);
        const view = m4.inverse(camera);
        uniforms.u_viewProjection = m4.multiply(projection, view);
        uniforms.u_viewInverse = camera;

        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, vertexArrayInfo);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, vertexArrayInfo, gl.TRIANGLES, vertexArrayInfo.numelements, 0, numInstances);

        // do it with drawObjectList (not you'd probably make/update the list outside the render loop
        // twgl.drawObjectList(gl, [
        //   {
        //     programInfo: programInfo,
        //     vertexArrayInfo: vertexArrayInfo,
        //     uniforms: uniforms,
        //     instanceCount: numInstances,
        //   },
        // ]);

        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
    }
    main();
  </script>
</html>


*/
