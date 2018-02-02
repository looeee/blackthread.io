// import { TextureLoader, FontLoader } from 'three';
import { TextureLoader, FontLoader } from './Three.custom.js';

import loadingManager from './loadingManager.js';

let fontLoader = null;
let textureLoader = null;

const defaultReject = ( err ) => { console.log( err ); };

const promisifyLoader = loader =>
  url => new Promise( ( resolve, reject = defaultReject ) => {

    loader.load( url, resolve, loadingManager.onProgress, reject );

  } );


class Loaders {

  constructor() {

    return {

      get textureLoader() {
        if ( textureLoader === null ) {
          textureLoader = promisifyLoader( new TextureLoader( loadingManager ) );
        }
        return textureLoader;
      },

      get fontLoader() {
        if ( fontLoader === null ) {
          fontLoader = promisifyLoader( new FontLoader( loadingManager ) );
        }
        return fontLoader;
      },

    };

  }

}

const loaders = new Loaders();

export default loaders;
