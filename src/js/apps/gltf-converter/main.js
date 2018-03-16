import './utilities/logging.js';
import './components/fullscreen.js';
import HTMLControl from './HTMLControl.js';
import exportGLTF from './components/exportGLTF.js';
import './components/fileReader.js';
import Viewer from './components/Viewer.js';
import loaders from './components/Loaders.js';
import loadingManager from './components/loadingManager.js';


THREE.Cache.enabled = true;

const defaultMat = new THREE.MeshStandardMaterial( {
  color: 0xcccccc,
  side: THREE.FrontSide,
} );

class Main {

  constructor( originalCanvas, resultCanvas ) {

    this.originalPreview = new Viewer( originalCanvas );
    this.resultPreview = new Viewer( resultCanvas );

  }

  load( promise, name = 'scene', originalFile ) {

    loadingManager.onStart();

    promise.then( ( result ) => {

      if ( result.isGeometry || result.isBufferGeometry ) this.onLoad( new THREE.Mesh( result, defaultMat ) );
      else if ( result.isObject3D ) this.onLoad( result, name );
      // glTF
      else if ( result.scenes && result.scenes.length > 1 ) {

        result.scenes.forEach( ( scene ) => {

          if ( result.animations ) scene.animations = result.animations;
          this.onLoad( scene, name );

        } );

      }
      // glTF or Collada
      else if ( result.scene ) {

        if ( result.animations ) result.scene.animations = result.animations;
        this.onLoad( result.scene, name );

      } else console.error( 'No scene found in file!' );

    } ).catch( ( err ) => {

      if ( typeof err.message && err.message.indexOf( 'Use LegacyGLTFLoader instead' ) !== -1 ) {

        this.load( loaders.legacyGltfLoader( originalFile ) );

      } else {
        console.error( err );
      }

    } );

    return promise;

  }

  onLoad( object, name ) {

    object.traverse( ( child ) => {

      if ( child.material && Array.isArray( child.material ) ) {

        console.error( 'Multimaterials are currently not supported.' );

      }

    } );

    let animations = [];
    if ( object.animations ) animations = object.animations;

    this.originalPreview.addObjectToScene( object );
    this.resultPreview.reset();
    exportGLTF.setInput( object, animations, name );

  }

}
export default new Main( HTMLControl.originalCanvas, HTMLControl.resultCanvas );
