const watch = require( 'node-watch' );
const fs = require( 'fs' );
const sass = require( 'node-sass' );
const autoprefixer = require( 'autoprefixer' );
const postcss = require( 'postcss' );
const CleanCSS = require( 'clean-css' );

const inputDir = 'src/scss/';
const outputDir = 'static/css/';

if ( !fs.existsSync( outputDir ) ) {
  fs.mkdirSync( outputDir );
}

const writeFile = ( fileName, data ) => {

  fs.writeFileSync( outputDir + fileName, data, 'utf8' );

};

const cleaner = new CleanCSS( {
  level: 2,
} );

const minifyCSS = ( file, input ) => {

  const output = cleaner.minify( input );

  if ( output.errors.length ) {

    console.log( 'Errors: ' );
    console.log( output.errors );

  }
  if ( output.warnings.length ) {

    console.log( 'Warnings: ' );
    console.log( output.warnings );

  }

  const oldSize = output.stats.originalSize / 1000;
  const newSize = output.stats.minifiedSize / 1000;
  console.log( 'Reduced from ' + oldSize + 'kb to ' + newSize + 'kb.' );

  writeFile( file, output.styles );

}

const prefixCSS = ( css, name ) => {

  var file = name + '.css';

  postcss( [ autoprefixer ] ).process( css ).then( ( object ) => {
    object.warnings().forEach( ( warn ) => {

      console.warn( warn.toString() );

    } );

    console.log( 'Writing file: ' + file );
    writeFile( file, object.css );
    console.log( 'Done.' );

    console.log( 'Compressing file: ' + file );
    minifyCSS( name + '.min.css', object.css );
    console.log( 'Done.' );
  } );

};


const compileSCSS = ( file ) => {

  // don't process partials
  if ( file.slice( 0, 1 ) === '_' ) return;
  if ( file.slice( -4 ) !== 'scss' ) return;

  const inputFile = inputDir + file;
  const name = file.slice( 0, -5 );

  sass.render( {
    file: inputFile,
    // outputStyle: 'compressed',
  }, ( err, result ) => {

    if ( err ) {

      console.log( err );

    } else {

      prefixCSS( result.css, name );

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
