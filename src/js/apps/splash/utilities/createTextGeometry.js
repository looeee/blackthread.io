// import { TextBufferGeometry, Mesh } from 'three';
import { TextBufferGeometry, Mesh } from '../Three.custom.js';

import createBufferAnimation from './createBufferAnimation.js';

export default function createTextGeometry( font, mat, text = 'Black Thread Design' ) {

  const bufferGeometry = new TextBufferGeometry( text, {

    size: 40,
    height: 0,
    font,
    curveSegments: 12,

  } );

  bufferGeometry.translate( -316, 0, 0 );

  createBufferAnimation( bufferGeometry );

  return new Mesh( bufferGeometry, mat );

}
