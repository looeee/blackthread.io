const UglifyJS = require( 'uglify-js' );

const fs = require( 'fs' );

const inputDir = 'static/js/build/';
const outputDir = 'static/js/build-min/';

const uglifyJSOptions = {

  compress: {

    // causes PROTOTYPE undefined error if true
    unused: false,

    // note: increases size if true
    hoist_vars: false,

    // only allow true if getters have no side effects
    pure_getters: false,

    // removes ALL code!
    unsafe: false,

    // tested
    drop_debugger: true,
    sequences: true,
    properties: true,
    dead_code: true,
    hoist_funs: true,
    if_return: true,
    join_vars: true,
    cascade: true,
    negate_iife: true,
    warnings: true,
    conditionals: true,
    comparisons: true,
    loops: true,
    evaluate: true,
    booleans: true,

    // remove all console calls
    drop_console: false,

  },
  // ie8: false,
  mangle: true,

};


const minifyFile = ( file ) => {

  console.log( 'Minifying ' + file );

  const inputFile = inputDir + file;
  const outputFile = outputDir + file;

  const inputCode = fs.readFileSync( inputFile, 'utf8' );

  // minify input code
  const outputCode = UglifyJS.minify( inputCode, uglifyJSOptions ).code;

  fs.writeFileSync( outputFile, outputCode, 'utf8' );

  console.log( 'Finished minifying ' + file );

}

// pass in a single filename, e.g. 'main' to process only that file
if ( process.argv[ 2 ] !== undefined ) {

  const name = process.argv[ 2 ] + '.js';

  fs.readdir( inputDir, ( err, files ) => {
    files.forEach( ( file ) => {

      if ( file !== name ) return;

      minifyFile( file );

    } );

  } );

} else {

  // Process js files
  fs.readdir( inputDir, ( err, files ) => {

    files.forEach( ( file ) => {

      minifyFile( file );

    } );

  } );

}
