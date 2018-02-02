// import { Math as _Math } from 'three';
import { _Math } from '../Three.custom.js';

import createBufferAttribute from './createBufferAttribute.js';

import randomPointInSphere from './randomPointInSphere.js';

export default function createBufferAnimation( bufferGeometry ) {

  const vertexCount = bufferGeometry.attributes.position.count;
  const faceCount = vertexCount / 3;

  const aAnimation = createBufferAttribute( bufferGeometry, 'aAnimation', 2, vertexCount );
  const aEndPosition = createBufferAttribute( bufferGeometry, 'aEndPosition', 3, vertexCount );

  const positions = bufferGeometry.attributes.position.array;

  let i;
  let i2;
  let i3;

  const minDuration = 1.0;
  const maxDuration = 100.0;

  const lengthFactor = 0.0005;

  const maxLength = 316; // initially calculated from boundingBox.max.length(), hardcoded for speed

  for ( i = 0, i2 = 0, i3 = 0; i < faceCount; i++, i2 += 6, i3 += 9 ) {

    const l = -Math.abs( positions[ i3 ] - positions[ i3 + 5 ] );

    // animation
    const delay = ( maxLength - l ) * lengthFactor;
    const duration = _Math.randFloat( minDuration, maxDuration );

    for ( let k = 0; k < 6; k += 2 ) {

      aAnimation.array[ i2 + k ] = delay;
      aAnimation.array[ i2 + k + 1 ] = duration;

    }


    // end position
    const point = randomPointInSphere( 1200 );

    for ( let j = 0; j < 9; j += 3 ) {

      aEndPosition.array[i3 + j] = point.x;
      aEndPosition.array[i3 + j + 1] = point.y;
      aEndPosition.array[i3 + j + 2] = point.z;

    }

  }
}
