import * as React from 'react';
import {Fragment} from 'react';
import {LevelSelector} from './levelSelector/levelSelector';

interface Props {}

interface State {
  tabItems: {label: string; image: string}[];
  selectedTabIndex: number;
  title: string;
  loading: boolean;
  collapseSide: boolean;
}

export class Layout extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      title: 'Level Select',
      selectedTabIndex: 0,
      loading: false,
      collapseSide: false,
      tabItems: [
        {
          image: 'assets/images/tabs/sonic.png',
          label: 'Level Select'
        },
        {
          image: 'assets/images/tabs/tile.png',
          label: 'Tiles'
        },
        {
          image: 'assets/images/tabs/tilepiece.png',
          label: 'Tile Pieces'
        },
        /*         {
            image: 'assets/images/tabs/sonic.png',
            label: 'Object Select'
        },*/
        {
          image: 'assets/images/tabs/tilechunk.png',
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

  render() {
    return (
      <Fragment>
        <div
          className={`col ${!this.state.collapseSide ? 's8' : 's12'}`}
          style={{padding: 0, margin: 0, position: 'relative', height: '100vh', border: '10px solid black'}}
          id="canvasBox"
        >
          <button
            style={{width: '1px', height: '1px', left: '-200px', top: '-200px', position: 'absolute'}}
            id="hiddenBox"
          >
            a
          </button>
          <canvas id="bgLowTileLayer" width={320} height={224} className="game-canvas" />
          <canvas id="bgHighTileLayer" width={320} height={224} className="game-canvas" />
          <canvas id="lowTileLayer" width={320} height={224} className="game-canvas" />
          <canvas id="spriteLayer" width={320} height={224} className="game-canvas" />
          <canvas id="highTileLayer" width={320} height={224} className="game-canvas" />
        </div>
        {this.state.collapseSide && (
          <span
            style={{position: 'absolute', fontSize: '2rem', color: 'white', right: '5px', bottom: '5px'}}
            onChange={() => this.collapse(false)}
          >
            &lt;&lt;&lt;
          </span>
        )}
        {!this.state.collapseSide && (
          <div className="col s4" style={{padding: 0, margin: 0, height: '100vh', position: 'relative'}}>
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
                    <div style={{flex: '13 0', width: '100%', display: 'inline-flex'}}>
                      <LevelSelector
                        setLoading={loading =>
                          this.setState({
                            loading
                          })
                        }
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
        )}
      </Fragment>
    );
  }
}
