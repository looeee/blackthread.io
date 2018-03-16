const rollup = require( 'rollup' );
const watch = require( 'rollup-watch' );
const babel = require( 'rollup-plugin-babel' );
const glslify = require( 'glslify' );
const nodeResolve = require( 'rollup-plugin-node-resolve' );
// const UglifyJS = require( 'uglify-js' );

const fs = require( 'fs' );

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

const inputDir = 'src/js/entries/';
const outputDir = 'static/js/build/';

const defaultPlugins = [
  nodeResolve(),
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

// config to feed the watcher function
const config = ( file ) => {

  const input = inputDir + file;
  const output = outputDir + file;

  return {
    input,
    plugins: defaultPlugins,
    globals: {
      three: 'THREE'
    },
    targets: [
      {
        format: 'iife',
        name: file,
        dest: output,
      },
    ],
  };
};

// stderr to stderr to keep `rollup main.js > bundle.js` from breaking
const stderr = console.error.bind( console );

// const minify = ( file ) => {

//   console.log( 'Minifying ' + file );

//   const name = file.substring( 0, file.length - 3 );
//   const outputFile = outputDir + name + '.min.js';

//   const inputCode = fs.readFileSync( outputDir + file, 'utf8' );

//   const result = UglifyJS.minify( inputCode );

//   if ( result.error ) console.error( result.error );
//   if ( result.warnings ) console.warm( result.warnings );

//   fs.writeFileSync( outputFile, result.code, 'utf8' );

//   console.log( 'Finished minifying ' + file );

// }

const eventHandler = ( file ) => {
  return ( event ) => {
    switch ( event.code ) {
      case 'STARTING':
        stderr( 'checking rollup-watch version...' );
        break;
      case 'BUILD_START':
        stderr( `bundling ${file}...` );
        break;
      case 'BUILD_END':
        stderr( `bundled ${file} in ${event.duration}ms. Watching for changes...` );
        // minify( file );
        break;
      case 'ERROR':
        stderr( `error: ${event.error} with ${file}` );
        break;
      default:
        stderr( `unknown event: ${event} from ${file}` );
    }
  };
};

// pass in a single filename, e.g. 'main' to process only that file
if ( process.argv[ 2 ] !== undefined ) {

  const name = process.argv[ 2 ] + '.js';

  fs.readdir( inputDir, ( err, files ) => {
    files.forEach( ( file ) => {

      if ( file !== name ) return;

      const entryConfig = config( file );
      const watcher = watch( rollup, entryConfig );
      const entryEventHandler = eventHandler( file );
      watcher.on( 'event', entryEventHandler );
    } );

  } );

} else {

  fs.readdir( inputDir, ( err, files ) => {
    files.forEach( ( file ) => {
      const entryConfig = config( file );
      const watcher = watch( rollup, entryConfig );
      const entryEventHandler = eventHandler( file );
      watcher.on( 'event', entryEventHandler );
    } );
  } );

}
