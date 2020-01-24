/// <reference path="../typings/Compress.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SonicEngine} from './game/sonicEngine';
import {Layout} from './layout/layout';

function run() {
  ReactDOM.render(<Layout />, document.getElementById('main'));

  setTimeout(() => {
    new SonicEngine();
  }, 1);
}

run();
