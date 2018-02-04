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

const promisifyLoader = loader =>
  url => new Promise( ( resolve, reject ) => {

    loader.load( url, resolve, loadingManager.onProgress, reject );

  } );

export default class Loaders {

  constructor() {

    return {

      get objectLoader() {
        if ( objectLoader === null ) {
          objectLoader = promisifyLoader( new THREE.ObjectLoader( loadingManager ) );
        }
        return objectLoader;
      },

      get bufferGeometryLoader() {
        if ( bufferGeometryLoader === null ) {
          bufferGeometryLoader = promisifyLoader( new THREE.BufferGeometryLoader( loadingManager ) );
        }
        return bufferGeometryLoader;
      },

      get jsonLoader() {
        if ( jsonLoader === null ) {
          jsonLoader = promisifyLoader( new THREE.JSONLoader( loadingManager ) );
        }
        return jsonLoader;
      },

      get fbxLoader() {
        if ( fbxLoader === null ) {
          fbxLoader = promisifyLoader( new THREE.FBXLoader( loadingManager ) );
        }
        return fbxLoader;
      },

      get gltfLoader() {
        if ( gltfLoader === null ) {
          gltfLoader = promisifyLoader( new THREE.GLTFLoader( loadingManager ) );
        }
        return gltfLoader;
      },

      get objLoader() {

        if ( objLoaderInternal === null ) {

          objLoaderInternal = new THREE.OBJLoader( loadingManager );

          objLoader = promisifyLoader( objLoaderInternal );

          objLoader.setMaterials = ( materials ) => {

            objLoaderInternal.setMaterials( materials );

          };
        }

        return objLoader;
      },

      get mtlLoader() {
        if ( mtlLoader === null ) {

          mtlLoader = promisifyLoader( new THREE.MTLLoader( loadingManager ) );
        }
        return mtlLoader;
      },

      get colladaLoader() {
        if ( colladaLoader === null ) {
          colladaLoader = promisifyLoader( new THREE.ColladaLoader( loadingManager ) );
        }
        return colladaLoader;
      },

    };

  }

}
