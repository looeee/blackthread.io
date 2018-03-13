const path = require( 'path' );
const rollup = require( 'rollup' );
const spawn = require( 'cross-spawn' );
const { StringDecoder } = require( 'string_decoder' );

// (function() {

//   var oldSpawn = childProcess.spawn;
//   function mySpawn() {
//       console.log('spawn called');
//       console.log(arguments);
//       var result = oldSpawn.apply(this, arguments);
//       return result;
//   }
//   childProcess.spawn = mySpawn;
// })();

const ALL_FILES = {
	GLTFLoader: 'loaders/GLTFLoader.js',
	curves: 'curves/NURBSCurve.js'
};

let files = ALL_FILES;

// default to all files, but support `node build.js TargetClass`
if ( process.argv.length > 2 ) {

	files = {};
	files[ process.argv[ 2 ] ] = ALL_FILES[ process.argv[ 2 ] ];

}

console.log( 'rollup:' );

Object.keys( files ).forEach( ( name ) => {

	const inputPath = files[ name ];
	const outputPath = inputPath.replace( path.basename( inputPath ), '' ) + name + '.js';

	const umdTask = spawn( 'rollup', [
		'-i', `examples/js/${ inputPath }`,
		'-o', `build/examples/js/${ outputPath }`,
		'-f', 'umd',
		'-n', name,
		'-g', 'three:THREE',
		'--silent'
	] );

	// propagate logs
	const decoder = new StringDecoder( 'utf8' );
	umdTask.stdout.on( 'data', ( data ) => console.log( decoder.write( data ) ) );
	umdTask.stderr.on( 'data', ( data ) => console.warn( decoder.write( data ) ) );

	umdTask.on( 'close', ( code ) => {

		code
			? console.error( `  • error building ${ name }!` )
			: console.info( `  • ${ name }` );

	} );

} );
