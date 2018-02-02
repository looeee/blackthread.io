import { BufferAttribute } from '../Three.custom.js';


const createBufferAttribute = ( bufferGeometry, name, itemSize, count ) => {
  const buffer = new Float32Array( count * itemSize );
  const attribute = new BufferAttribute( buffer, itemSize );

  bufferGeometry.addAttribute( name, attribute );

  return attribute;
};

export default createBufferAttribute;
