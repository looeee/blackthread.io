const obj2gltf = require( 'obj2gltf' );
const fs = require( 'fs' );

const options = {

  binary: true,
  specularGlossiness: false,
  metallicRoughness: true,
  materialsCommon: false,


};

if ( process.argv[ 2 ] !== undefined ) {

  const name = process.argv[ 2 ];

  obj2gltf( 'static/models/obj/' + name + '.obj', options )
    .then( ( gltf ) => {

      fs.writeFileSync( 'static/models/gltf/' + name + '_from_obj.glb', gltf );

    } );

} else {

  console.error( 'Please specify a filename!' );
}

