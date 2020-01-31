import React from 'react';
import {Fragment} from 'react';
import {LevelSelector} from './levelSelector/levelSelector';
import sonic from './assets/tabs/sonic.png';
import tile from './assets/tabs/tile.png';
import tileChunk from './assets/tabs/tilechunk.png';
import tilePiece from './assets/tabs/tilepiece.png';
import {Help} from '../common/help';
import Joystick from 'react-joystick';
import {SonicEngine} from '../game/sonicEngine';

interface Props {}

interface State {
  tabItems: {label: string; image: string}[];
  selectedTabIndex: number;
  title: string;
  loading: boolean;
  collapseSide: boolean;
  showFullscreen: boolean;
}

export class Layout extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      title: 'Level Select',
      selectedTabIndex: 0,
      loading: false,
      collapseSide: false,
      showFullscreen: false,
      tabItems: [
        {
          image: sonic,
          label: 'Level Select'
        },
        {
          image: tile,
          label: 'Tiles'
        },
        {
          image: tilePiece,
          label: 'Tile Pieces'
        },
        /*         {
            image: 'assets/images/tabs/sonic.png',
            label: 'Object Select'
        },*/
        {
          image: tileChunk,
          label: 'Tile Chunks'
        } /*,
            {
                image: 'assets/images/tabs/sonic.png',
                label: 'Animated Tiles'
            }*/
      ]
    };
  }

  tabClick(index: number) {
    this.setState({
      selectedTabIndex: index,
      title: this.state.tabItems[this.state.selectedTabIndex].label
    });
  }

  collapse(collapseSide: boolean) {
    this.setState({collapseSide});
  }

  managerListenerMove = manager => {
    manager.on('move', (e, stick) => {
      SonicEngine.instance.sonicManager.sonicToon.releaseCrouch();
      SonicEngine.instance.sonicManager.sonicToon.releaseUp();
      SonicEngine.instance.sonicManager.sonicToon.releaseLeft();
      SonicEngine.instance.sonicManager.sonicToon.releaseRight();
      switch (stick.direction?.angle) {
        case 'up':
          SonicEngine.instance.sonicManager.sonicToon.pressUp();
          break;
        case 'down':
          SonicEngine.instance.sonicManager.sonicToon.pressCrouch();
          break;
        case 'left':
          SonicEngine.instance.sonicManager.sonicToon.pressLeft();
          break;
        case 'right':
          SonicEngine.instance.sonicManager.sonicToon.pressRight();
          break;
      }
    });
    manager.on('end', () => {
      SonicEngine.instance.sonicManager.sonicToon.releaseCrouch();
      SonicEngine.instance.sonicManager.sonicToon.releaseUp();
      SonicEngine.instance.sonicManager.sonicToon.releaseLeft();
      SonicEngine.instance.sonicManager.sonicToon.releaseRight();
    });
  };

  managerListenerJump = manager => {
    manager.on('move', (e, stick) => {
      SonicEngine.instance.sonicManager.sonicToon.pressJump();
    });
    manager.on('end', () => {
      SonicEngine.instance.sonicManager.sonicToon.releaseJump();
    });
  };

  componentDidMount(): void {
    setTimeout(() => {
      if (Help.isMobile()) {
        this.setState({showFullscreen: true});
      }
    }, 100);
  }

  render() {
    return (
      <>
        <div
          className={`col ${!this.state.collapseSide ? (Help.isMobile() ? '' : 's8') : 's12'}`}
          style={{padding: 0, margin: 0, position: 'relative', height: '100vh'}}
          id="canvasBox"
        >
          <button
            style={{width: '1px', height: '1px', left: '-200px', top: '-200px', position: 'absolute'}}
            id="hiddenBox"
          >
            a
          </button>
          <canvas id="bgLowTileLayer" className="game-canvas" />
          <canvas id="bgHighTileLayer" className="game-canvas" />
          <canvas id="lowTileLayer" className="game-canvas" />
          <canvas id="spriteLayer" className="game-canvas" />
          <canvas id="highTileLayer" className="game-canvas" />

          {this.state.showFullscreen && (
            <button
              style={{position: 'absolute'}}
              onClick={() => {
                const video = document.documentElement as any;
                const rfs =
                  video.requestFullscreen ||
                  video.webkitRequestFullScreen ||
                  video.mozRequestFullScreen ||
                  video.msRequestFullscreen;
                rfs.call(video);

                // eslint-disable-next-line no-restricted-globals
                screen.orientation.lock('landscape-primary');
                this.setState({showFullscreen: false});
              }}
            >
              Go Fullscreen And Rotate
            </button>
          )}
          {Help.isMobile() && (
            <>
              <Joystick
                options={{
                  mode: 'semi',
                  catchDistance: 150,
                  color: 'white',
                  dataOnly: true
                }}
                containerStyle={{
                  position: 'absolute',
                  height: '350px',
                  width: '60%',
                  bottom: 0,
                  left: 0,
                  background: 'transparent'
                }}
                managerListener={this.managerListenerMove}
              />
              <Joystick
                options={{
                  mode: 'semi',
                  catchDistance: 150,
                  color: 'white',
                  dataOnly: true
                }}
                containerStyle={{
                  position: 'absolute',
                  height: '350px',
                  width: '40%',
                  bottom: 0,
                  right: 0,
                  background: 'transparent'
                }}
                managerListener={this.managerListenerJump}
              />
            </>
          )}
        </div>
        {this.state.collapseSide && (
          <button
            style={{
              position: 'absolute',
              zIndex: 1000,
              fontSize: '2rem',
              color: 'white',
              background: 'black',
              border: 'none',
              right: '0',
              bottom: '0'
            }}
            onClick={() => this.collapse(false)}
          >
            Open Menu
          </button>
        )}
        <div
          className={'col ' + (Help.isMobile() ? 's12' : 's4')}
          style={{
            padding: 0,
            margin: 0,
            height: '100vh',
            position: 'relative',
            display: this.state.collapseSide ? 'none' : 'block'
          }}
        >
          <div style={{width: '100%', backgroundColor: 'white', height: '100%'}}>
            <div className="row" style={{padding: 0, margin: 0, height: '100%', backgroundColor: '#81D4FA'}}>
              <div
                className="col s9"
                style={{
                  padding: 0,
                  margin: 0,
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexFlow: 'column nowrap'
                }}
              >
                <div
                  style={{
                    flex: '1 0',
                    width: '100%',
                    display: 'inline-flex',
                    position: 'relative',
                    fontSize: '3.2rem',
                    backgroundColor: '#29B6F6',
                    color: 'white',
                    padding: '10px 10px 10px 30px'
                  }}
                >
                  <span
                    style={{position: 'absolute', fontSize: '1rem', left: '5px', top: '5px'}}
                    onClick={() => this.collapse(true)}
                  >
                    &gt;&gt;&gt;
                  </span>
                  <span>
                    {this.state.title}{' '}
                    <span style={{fontSize: '1.6rem'}}>{this.state.loading ? 'loading...' : ''}</span>
                  </span>
                </div>
                {this.state.selectedTabIndex === 0 && (
                  <div style={{flex: '13 0', width: '100%', height: '100%', display: 'inline-flex'}}>
                    <LevelSelector
                      setLoading={loading => {
                        if (!loading) {
                          if (Help.isMobile()) {
                            this.setState({collapseSide: true});
                          }
                        }
                        this.setState({
                          loading
                        });
                      }}
                    />
                  </div>
                )}

                {/*<object-selector ngif=""  style="flex:13 0;width:100%;display:inline-flex;"></object-selector>*/}
                {/*   {this.state.selectedTabIndex === 1 && (
                                        <Tiles style={{flex: '13 0', width: '100%', display: 'inline-flex'}} />
                                    )}
                                    {this.state.selectedTabIndex === 1 && (
                                        <TilePiece style={{flex: '13 0', width: '100%', display: 'inline-flex'}} />
                                    )}
                                    {this.state.selectedTabIndex === 2 && (
                                        <TileChunk style={{flex: '13 0', width: '100%', display: 'inline-flex'}} />
                                    )}
                                    {this.state.selectedTabIndex === 3 && (
                                        <AnimatedTiles style={{flex: '13 0', width: '100%', display: 'inline-flex'}} />
                                    )}*/}
              </div>
              <div className="col s3" style={{padding: 0, margin: 0, position: 'relative'}}>
                {this.state.tabItems.map((item, ind) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '15px',
                      color: 'white',
                      backgroundColor: ind === this.state.selectedTabIndex ? '#29B6F6' : '#81D4FA'
                    }}
                    onClick={() => this.tabClick(ind)}
                  >
                    <div>
                      <img
                        style={{display: 'block', imageRendering: 'pixelated'}}
                        width={94}
                        height={94}
                        src={item.image}
                      />
                      <span style={{textAlign: 'center'}}>{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
