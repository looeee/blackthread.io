const watch = require( 'node-watch' );
const fs = require( 'fs' );
const sass = require( 'node-sass' );
const autoprefixer = require( 'autoprefixer' );
const postcss = require( 'postcss' );

const inputDir = 'src/scss/';
const outputDir = 'static/css/';

if ( !fs.existsSync( outputDir ) ) {
  fs.mkdirSync( outputDir );
}

const writeFile = ( fileName, data ) => {

  fs.writeFileSync( outputDir + fileName, data, 'utf8' );

};

const prefixCSS = ( css, outputFile ) => {

  postcss( [ autoprefixer ] ).process( css ).then( ( object ) => {
    object.warnings().forEach( ( warn ) => {

      console.warn( warn.toString() );

    } );

    console.log( 'Writing file: ' + outputFile );
    writeFile( outputFile, object.css );
    console.log( 'Done.' );

  } );

};

const compileSCSS = ( file ) => {

  // don't process partials
  if ( file.slice( 0, 1 ) === '_' ) return;
  if ( file.slice( -4 ) !== 'scss' ) return;

  const inputFile = inputDir + file;
  const outputFile = file.slice( 0, -5 ) + '.css';

  sass.render( {
    file: inputFile,
    outputStyle: 'compressed',
  }, ( err, result ) => {

    if ( err ) {

      console.log( err );

    } else {

      prefixCSS( result.css, outputFile );

    }

  } );

};


// pass in a single filename, e.g. 'main' to process only that file
if ( process.argv[ 2 ] !== undefined ) {

  const file = process.argv[ 2 ] + '.scss';

  compileSCSS( file );

  watch( inputDir, { recursive: true }, () => {

    compileSCSS( file );

  } );

} else {

  fs.readdir( inputDir, ( err, files ) => {

    if ( err ) console.log( err );

    files.forEach( ( file ) => {

      compileSCSS( file );

    } );

    watch( inputDir, { recursive: true }, () => {

      files.forEach( ( file ) => {

        compileSCSS( file );

      } );

    } );

  } );

}
