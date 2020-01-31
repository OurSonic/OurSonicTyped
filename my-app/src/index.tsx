import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Layout} from './app/layout/layout';
import {SonicEngine} from './app/game/sonicEngine';

function run() {
  ReactDOM.render(<Layout />, document.getElementById('main'));

  setTimeout(() => {
    new SonicEngine();
  }, 1);
}

run();
