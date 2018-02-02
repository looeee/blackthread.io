
const fbx2gltf = require( 'fbx2gltf' );
const fs = require( 'fs' );

const options = [
  // '--khr-materials-common',
  // '--binary',
  '--embed'
];


if ( process.argv[ 2 ] !== undefined ) {

  const name = process.argv[ 2 ];

  fbx2gltf( 'assets/models/fbx/' + name + '.fbx', 'assets/models/gltf/' + name + '_from_fbx.glb', options ).then(
    ( gltfFile ) => {

      // fs.writeFileSync( gltfFile, gltfFile );

    },
    error => console.error( error ),
  );


} else {

  console.error( 'Please specify a filename!' );

}

