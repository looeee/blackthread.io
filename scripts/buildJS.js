const rollup = require( 'rollup' );
const watch = require( 'watch' );
const babel = require( 'rollup-plugin-babel' );
const glslify = require( 'glslify' );
const nodeResolve = require( 'rollup-plugin-node-resolve' );
const commonjs = require( 'rollup-plugin-commonjs' );
const UglifyJS = require( 'uglify-js' );

const fs = require( 'fs' );

const writeFile = ( fileName, data ) => {

  fs.writeFileSync( fileName, data, 'utf8' );

};

const glsl = () => {
  return {
    transform( code, id ) {

      if ( !/\.glsl$|\.vert$|\.frag$/.test( id ) ) return;
      //
      const res = glslify( code );
      //
      return 'export default ' + JSON.stringify(
        res
        .replace( /[ \t]*\/\/.*\n/g, '' )
        .replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' )
        .replace( /\n{2,}/g, '\n' ),
      ) + ';';
    },
  };
};

const minify = ( fileName, code ) => {

  console.log( 'Minifying ' + fileName );

  const name = fileName.replace( '.js', '.min.js' );

  const result = UglifyJS.minify( code );

  if ( result.error ) console.error( result.error );
  if ( result.warnings ) console.warm( result.warnings );

  writeFile( name, result.code );

  console.log( 'Finished minifying ' + fileName );

};

const inputDir = 'src/js/entries/';
const codeDir = 'src/js/';
const outputDir = 'static/js/build/';

const defaultPlugins = [
  nodeResolve(),
  commonjs(),
  glsl(),
  babel( {
    compact: false,
    exclude: ['node_modules/**', 'src/shaders/**'],
    babelrc: false,
    plugins: [
      'external-helpers',
    ],
    presets: [
      ['env',
        {
          modules: false,
          targets: {
            browsers: [ 'last 2 versions', '> 5%' ],
          },
        } ],
    ],
  } ),
];

// rollup inputOptions
const inputOptions = ( file ) => {

  const input = inputDir + file;

  return {
    input,
    plugins: defaultPlugins,
    // cache,
    perf: true,
  };
};

// rollup outputOptions
const outputOptions = ( file ) => {
  const output = outputDir + file;

  return {
    file: output,
    format: 'iife',
    name: 'output',
    globals: {
      three: 'THREE'
    },
  }
}

const watchOptions = ( file ) => {
  return {
    ...inputOptions( file ),
    output: outputOptions( file ),
  }
}

// stderr to stderr to keep `rollup main.js > bundle.js` from breaking
const stderr = console.error.bind( console );

async function build( inputOpts, outputOpts ) {

  // create a bundle
  const bundle = await rollup.rollup( inputOpts );

  // generate code and a sourcemap
  const { code, map } = await bundle.generate( outputOpts );

  console.log( 'Writing file: ' + outputOpts.file );
  writeFile( outputOpts.file, code );
  minify( outputOpts.file, code );

  console.log( 'Generated bundle: ', bundle.getTimings()[ '# GENERATE' ] )

}

function watchFile( file ) {

  const inputOpts = inputOptions( file );
  const outputOpts = outputOptions( file );

  build( inputOpts, outputOpts );

  watch.watchTree( codeDir, { interval: 1 }, ( f, curr, prev ) => {

    if ( typeof f == "object" && prev === null && curr === null) {

      // Finished walking the tree

    } else if ( prev === null ) {  // f is a new file
    } else if ( curr.nlink === 0 ) { // f was removed
    } else {

      console.log( 'Files on disk changed, updating bundle.' );
      build( inputOpts, outputOpts );

    }

  } );
}

// pass in a single filename, e.g. 'main' to process only that file
if ( process.argv[ 2 ] !== undefined ) {

  const name = process.argv[ 2 ] + '.js';

  fs.readdir( inputDir, ( err, files ) => {

    files.forEach( ( file ) => {

      if ( file !== name ) return;

      watchFile( file );

    } );

  } );

} else {

  fs.readdir( inputDir, ( err, files ) => {

    files.forEach( ( file ) => {

      watchFile( file );

    } );

  } );

}
