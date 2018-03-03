const UglifyJS = require( 'uglify-js' );
const recursive = require( 'recursive-readdir' );
const fs = require( 'fs' );

const inputDir = 'static/js/vendor/three/examples';

const minify = ( file ) => {

  console.log( 'Minifying ' + file );

  const name = file.substring( 0, file.length - 3 );
  const outputFile = name + '.min.js';

  const inputCode = fs.readFileSync( file, 'utf8' );

  const result = UglifyJS.minify( inputCode );

  if ( result.error ) console.error( result.error );
  if ( result.warnings ) console.warm( result.warnings );

  fs.writeFileSync( outputFile, result.code, 'utf8' );

  console.log( 'Finished minifying ' + file );

};

recursive( inputDir, ( err, files ) => {

  files.forEach( ( file ) => {

    if ( file.slice( -3 ) !== '.js' ) return;

    minify( file );

  } );

} );
