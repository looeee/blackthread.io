import { AudioLoader } from './vendor/three/src/THREE.js';

import FBXLoader from './modules/FBXLoader.module.js';

import loadingManager from './loadingManager.js';

let fbxLoader = null;
let audioLoader = null;


const defaultReject = ( err ) => { console.log( err ); };

const promisifyLoader = loader =>
  url => new Promise( ( resolve, reject = defaultReject ) => {

    loader.load( url, resolve, loadingManager.onProgress, reject );

  } );


class Loaders {

  constructor() {

    return {

      get fbxLoader() {
        if ( fbxLoader === null ) {
          fbxLoader = promisifyLoader( new FBXLoader( loadingManager ) );
        }
        return fbxLoader;
      },

      get audioLoader() {
        if ( audioLoader === null ) {
          audioLoader = promisifyLoader( new AudioLoader( loadingManager ) );
        }
        return audioLoader;
      },

    };

  }

}

const loaders = new Loaders();

export default loaders;
