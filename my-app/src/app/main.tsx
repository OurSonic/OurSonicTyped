/// <reference path="../typings/Compress.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {SonicEngine} from './game/sonicEngine';
import {Layout} from './layout/layout';
/*
import {asm} from "./asm/index";
console.log(asm.add(1,2));
*/

function run() {
  ReactDOM.render(<Layout />, document.getElementById('main'));

  setTimeout(() => {
    new SonicEngine();
  }, 1);
}

run();
