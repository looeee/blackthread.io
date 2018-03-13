// import recursive from 'recursive-readdir';
// import fs from 'fs';

const es6 = require( './es6-converter' );
const config = require( './es6-converter-config' );

es6.setInputs( config.inputs )
   .setExcludes( config.excludes )
   .setOutput( config.output )
   .setEdgeCases( config.edgeCases )
   .convert( () => {

      //  copyPolyfills()
      //  copyShaderChunk()
      //  updateThreeExports()

      //  done()

   } );

// const inputDir = 'static/js/vendor/three/examples';

// const convert = ( file ) => {

//   console.log( 'Converting ' + file );

//   const name = file.substring( 0, file.length - 3 );
//   const outputFile = name + '.es.js';


//   fs.writeFileSync( outputFile, RESULT, 'utf8' );

//   console.log( 'Finished converting ' + file );

// };

// recursive( inputDir, ( err, files ) => {

//   files.forEach( ( file ) => {

//     if ( file.slice( -3 ) !== '.js' ) return;

//     convert( file );

//   } );

// } );
