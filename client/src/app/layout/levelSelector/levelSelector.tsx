import React from 'react';
import {SonicEngine} from '../../game/sonicEngine';
import {LevelService, SonicLevelData} from '../services/levelService';

interface Props {
  setLoading: (loading: boolean) => void;
}

interface State {
  loadedALevel: boolean;
  levels: SonicLevelData[];
}

export class LevelSelector extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      loadedALevel: false,
      levels: null
    };
  }

  async componentDidMount() {
    const levels = await LevelService.getLevels();
    this.loadLevel(levels[0]);
    this.setState({levels});
  }

  async loadLevel(level: SonicLevelData) {
    this.setState({loadedALevel: true});
    this.props.setLoading(true);
    document.getElementById('hiddenBox').focus();
    const levelData = await LevelService.getLevel(level.name);
    SonicEngine.instance.loadLevel(levelData);
    this.props.setLoading(false);
  }

  render() {
    return (
      <ul style={{margin: 0, width: '100%', overflowY: 'scroll'}}>
        {!this.state.levels && <div style={{fontSize: '3rem', color: 'white'}}>Loading Levels</div>}
        {this.state.levels &&
          this.state.levels.map(level => (
            <li key={level.name}>
              <button
                style={{
                  width: '100%',
                  height: '50px',
                  display: 'block',
                  textDecoration: 'none',
                  color: '#fff',
                  backgroundColor: '#26a69a',
                  textAlign: 'center',
                  letterSpacing: '.5px',
                  transition: '.2s ease-out',
                  cursor: 'pointer',
                  lineHeight: '50px',
                  border: 'solid 1px #cccccc',
                  outline: 0,
                  padding: '0 2rem',
                  textTransform: 'uppercase',
                  verticalAlign: 'middle',
                  WebkitTapHighlightColor: 'transparent'
                }}
                onClick={() => this.loadLevel(level)}
              >
                {level.name}
              </button>
            </li>
          ))}
      </ul>
    );
  }
}
