// import { TetrahedronBufferGeometry, Mesh } from 'three';
import { TetrahedronBufferGeometry, Mesh } from '../Three.custom.js';

import createBufferAnimation from './createBufferAnimation.js';

export default function createShapeGeometries( mat ) {

  const tetraGeo = new TetrahedronBufferGeometry( 50, 1 );

  createBufferAnimation( tetraGeo );

  tetraGeo.translate( -150, 100, 0 );
  tetraGeo.rotateY( -1.5 );

  const tetraMesh = new Mesh( tetraGeo, mat );

  return tetraMesh;

}
