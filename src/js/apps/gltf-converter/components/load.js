import main from '../main.js';
import loaders from './Loaders.js'
import exportGLTF from './exportGLTF.js';

// const loaders = new Loaders();
const defaultMat = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x000000 } );

const onLoad = ( object ) => {

  object.traverse( ( child ) => {

    if ( child.material && Array.isArray( child.material ) ) {

      console.error( 'Multimaterials are currently not supported.' );

    }

  } );

  let animations = [];
  if ( object.animations ) animations = object.animations;

  main.originalPreview.addObjectToScene( object );
  main.resultPreview.reset();
  exportGLTF.setInput( object, animations );

};

const load = ( promise, originalFile ) => {

  promise.then( ( result ) => {

    if ( result.isGeometry || result.isBufferGeometry ) onLoad( new THREE.Mesh( result, defaultMat ) );
    else if ( result.isObject3D ) onLoad( result );
    // glTF
    else if ( result.scenes && result.scenes.length > 1 ) {

      result.scenes.forEach( ( scene ) => {

        if ( result.animations ) scene.animations = result.animations;
        onLoad( scene );

      } );

    }
    // glTF or Collada
    else if ( result.scene ) {

      if ( result.animations ) result.scene.animations = result.animations;
      onLoad( result.scene );

    } else console.error( 'No scene found in file!' );

  } ).catch( ( err ) => {

    if ( typeof err.message && err.message.indexOf( 'Use LegacyGLTFLoader instead' ) !== -1 ) {

      load( loaders.legacyGltfLoader( originalFile ) )

    } else {
      console.error( err );
    }

  } );

  return promise;

};

export default load;