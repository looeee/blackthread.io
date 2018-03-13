import promisifyLoader from '../utilities/promisifyLoader.js';
import loadingManager from './loadingManager.js';

// TODO
// import loadJavascript from '../utilities/loadJavascript.js';

// Removed for now
// THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

let bufferGeometryLoader = null;
let amfLoader = null;
let colladaLoader = null;
// let ctmLoader = null;
// let dracoLoader = null;
let fbxLoader = null;
let gltfLoader = null;
let jsonLoader = null;
// let kmzLoader = null;
let legacyGltfLoader = null;
// let mmdLoader = null;
let mtlLoader = null;
// let nrrdLoader = null;
let objectLoader = null;
let objLoader = null;
// let pcdLoader = null;
// let pdbLoader = null;
// let plyLoader = null;
// let pwrmLoader = null;
// let stlLoader = null;
let threemfLoader = null;

// used for passing materials to objLoader
let objLoaderInternal = null;


class Loaders {

  constructor() {

    return {

      get amfLoader() {
        if ( amfLoader === null ) {
          amfLoader = promisifyLoader( new THREE.AMFLoader( loadingManager ), loadingManager );
        }
        return amfLoader;
      },

      get bufferGeometryLoader() {
        if ( bufferGeometryLoader === null ) {
          bufferGeometryLoader = promisifyLoader( new THREE.BufferGeometryLoader( loadingManager ), loadingManager );
        }
        return bufferGeometryLoader;
      },

      get colladaLoader() {
        if ( colladaLoader === null ) {

          colladaLoader = promisifyLoader( new THREE.ColladaLoader( loadingManager ), loadingManager );

        }
        return colladaLoader;
      },

      //ctmLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      //dracoLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      // TODO: testing lazy load JS
      // get fbxLoader() {

      //   loadJavascript( '/js/vendor/three/examples/js/loaders/FBXLoader.min.js' ).then( () => {

      //     if ( fbxLoader === null ) fbxLoader = promisifyLoader( new THREE.FBXLoader( loadingManager ), loadingManager );

      //     return fbxLoader;

      //   } ).catch( ( err ) => { console.error( err ); } );

      // },

      get fbxLoader() {
        if ( fbxLoader === null ) {
          fbxLoader = promisifyLoader( new THREE.FBXLoader( loadingManager ), loadingManager );
        }
        return fbxLoader;
      },

      get gltfLoader() {
        if ( gltfLoader === null ) {
          gltfLoader = promisifyLoader( new THREE.GLTFLoader( loadingManager ), loadingManager );
        }
        return gltfLoader;
      },

      get jsonLoader() {
        if ( jsonLoader === null ) {
          jsonLoader = promisifyLoader( new THREE.JSONLoader( loadingManager ), loadingManager );
        }
        return jsonLoader;
      },

      //kmzLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      get legacyGltfLoader() {
        if ( legacyGltfLoader === null ) {
          legacyGltfLoader = promisifyLoader( new THREE.LegacyGLTFLoader( loadingManager ), loadingManager );
        }
        return legacyGltfLoader;
      },

      //mmdLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      get mtlLoader() {
        if ( mtlLoader === null ) {

          mtlLoader = promisifyLoader( new THREE.MTLLoader( loadingManager ), loadingManager );

        }
        return mtlLoader;
      },

      //nrrdLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      get objectLoader() {
        if ( objectLoader === null ) {
          objectLoader = promisifyLoader( new THREE.ObjectLoader( loadingManager ), loadingManager );
        }
        return objectLoader;
      },

      get objLoader() {

        if ( objLoaderInternal === null ) {

          objLoaderInternal = new THREE.OBJLoader( loadingManager );

          objLoader = promisifyLoader( objLoaderInternal, loadingManager );

          objLoader.setMaterials = ( materials ) => {

            objLoaderInternal.setMaterials( materials );

          };
        }

        return objLoader;
      },

      //pcdLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      //pdbLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      //plyLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      //pwrmLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      //stlLoader
      // get loaderName() {
      //   if ( loaderName === null ) {
      //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
      //   }
      //   return loaderName;
      // },

      get threemfLoader() {
        if ( threemfLoader === null ) {
          threemfLoader = promisifyLoader( new THREE.ThreeMFLoader( loadingManager ), loadingManager );
        }
        return threemfLoader;
      },

    };

  }

}


export default new Loaders();
