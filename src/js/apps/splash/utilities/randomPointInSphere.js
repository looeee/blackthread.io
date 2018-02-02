// import { Math as _Math, Vector3 } from 'three';
import { _Math, Vector3 } from '../Three.custom.js';

const v = new Vector3();

export default function randomPointInSphere( radius ) {

  const x = _Math.randFloat( -1, 1 );
  const y = _Math.randFloat( -1, 1 );
  const z = _Math.randFloat( -1, 1 );
  const normalizationFactor = 1 / Math.sqrt( x * x + y * y + z * z );

  v.x = x * normalizationFactor * radius;
  v.y = y * normalizationFactor * radius;
  v.z = z * normalizationFactor * radius;

  return v;
}
