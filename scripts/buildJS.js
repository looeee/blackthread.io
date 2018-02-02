const rollup = require( 'rollup' );
const watch = require( 'rollup-watch' );
const babel = require( 'rollup-plugin-babel' );

const glslify = require( 'glslify' );

const fs = require( 'fs' );

const glsl = () => {
  return {
    transform( code, id ) {

      if ( !/\.glsl$|\.vert$|\.frag$/.test( id ) ) return;
      const res = glslify( code );
      return 'export default ' + JSON.stringify( res
        .replace( /[ \t]*\/\/.*\n/g, '' )
        .replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' )
        .replace( /\n{2,}/g, '\n' ) ) + ';';
    },
  };
};

const defaultPlugins = [
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

const inputDir = 'src/js/entries/';
const outputDir = 'static/js/build/';

// config to feed the watcher function
const config = ( file ) => {

  const input = inputDir + file;
  const output = outputDir + file;

  return {
    input,
    plugins: defaultPlugins,
    targets: [
      {
        format: 'iife',
        name: file,
        file: output,
      },
    ],
  };
};

// stderr to stderr to keep `rollup main.js > bundle.js` from breaking
const stderr = console.error.bind( console );

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
