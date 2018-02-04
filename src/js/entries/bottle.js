import 'babel-polyfill';

import bottleLayout from 'pages/work/bottle/bottleLayout.js';
import BottleCanvas from 'pages/work/bottle/BottleCanvas.js';

bottleLayout();

new BottleCanvas( document.querySelector( '#canvas' ), null, 0xcccccc );
