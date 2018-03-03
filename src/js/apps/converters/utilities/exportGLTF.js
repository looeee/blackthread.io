import HTMLControl from '../HTMLControl.js';

// saving function taken from three.js editor
const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link ); // Firefox workaround, see #6594

const save = ( blob, filename ) => {

  link.href = URL.createObjectURL( blob );
  link.download = filename || 'data.json';
  link.click();

};

const saveString = ( text, filename ) => {

  save( new Blob( [ text ], { type: 'text/plain' } ), filename );

};

const saveArrayBuffer = ( buffer, filename ) => {

  save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );

};

const stringByteLength = ( str ) => {
  // returns the byte length of an utf8 string
  let s = str.length;
  for ( let i = str.length - 1; i >= 0; i-- ) {
    const code = str.charCodeAt( i );
    if ( code > 0x7f && code <= 0x7ff ) s++;
    else if ( code > 0x7ff && code <= 0xffff ) s += 2;
    if ( code >= 0xDC00 && code <= 0xDFFF ) i--; // trail surrogate
  }

  return s;

}

function exportGLTF( input ) {

  const gltfExporter = new THREE.GLTFExporter();

  const options = {
    trs: HTMLControl.controls.trs.checked,
    onlyVisible: HTMLControl.controls.onlyVisible.checked,
    truncateDrawRange: HTMLControl.controls.truncateDrawRange.checked,
    binary: HTMLControl.controls.binary.checked,
    forceIndices: HTMLControl.controls.forceIndices.checked,
    forcePowerOfTwoTextures: HTMLControl.controls.forcePowerOfTwoTextures.checked,
  };

  gltfExporter.parse( input, ( result ) => {

    let byteLength;

    if ( result instanceof ArrayBuffer ) {

      byteLength = result.byteLength;

      saveArrayBuffer( result, 'scene.glb' );

    } else {

      const output = JSON.stringify( result, null, 2 );
      byteLength = stringByteLength( output );
      console.log( 'byteLength',byteLength );
      saveString( output, 'scene.gltf' );

    }

    if ( byteLength < 1000000 ) {
      console.log( 'File size: ' + byteLength * 0.001 + 'kb' );
    } else {
      console.log( 'File size: ' + byteLength * 1e-6 + 'mb' );
    }

  }, options );

}

export default exportGLTF;
