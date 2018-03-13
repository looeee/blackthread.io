import promisifyLoader from '../utilities/promisifyLoader.js';
// import loadJavascript from '../utilities/loadJavascript.js';
import loadingManager from './loadingManager.js';


THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

let objectLoader = null;
let bufferGeometryLoader = null;
let jsonLoader = null;
let fbxLoader = null;
let gltfLoader = null;
let objLoader = null;
let mtlLoader = null;
let colladaLoader = null;

let objLoaderInternal = null;

class Loaders {

  constructor() {

    return {

      get objectLoader() {
        if ( objectLoader === null ) {
          objectLoader = promisifyLoader( new THREE.ObjectLoader( loadingManager ), loadingManager );
        }
        return objectLoader;
      },

      get bufferGeometryLoader() {
        if ( bufferGeometryLoader === null ) {
          bufferGeometryLoader = promisifyLoader( new THREE.BufferGeometryLoader( loadingManager ), loadingManager );
        }
        return bufferGeometryLoader;
      },

      get jsonLoader() {
        if ( jsonLoader === null ) {
          jsonLoader = promisifyLoader( new THREE.JSONLoader( loadingManager ), loadingManager );
        }
        return jsonLoader;
      },


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

      get mtlLoader() {
        if ( mtlLoader === null ) {

          mtlLoader = promisifyLoader( new THREE.MTLLoader( loadingManager ), loadingManager );

        }
        return mtlLoader;
      },

      get colladaLoader() {
        if ( colladaLoader === null ) {

          colladaLoader = promisifyLoader( new THREE.ColladaLoader( loadingManager ), loadingManager );

        }
        return colladaLoader;
      },

    };

  }

}


export default new Loaders();
