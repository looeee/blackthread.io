import originalLoadingManager from './originalLoadingManager.js';

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

const loadJavascript = ( url, callback ) => {

  const e = document.createElement( 'script' );
  e.src = url;
  e.type = 'text/javascript';
  e.addEventListener( 'load', callback );
  document.getElementsByTagName( 'head' )[ 0 ].appendChild( e );

};

const promisifyLoader = loader =>
  ( url, parse = false ) => {

    return new Promise( ( resolve, reject ) => {

      if ( parse === true ) loader.parse( url, '', resolve, reject );
      else loader.load( url, resolve, originalLoadingManager.onProgress, reject );

    } );

  };
class Loaders {

  constructor() {

    return {

      get objectLoader() {
        if ( objectLoader === null ) {
          objectLoader = promisifyLoader( new THREE.ObjectLoader( originalLoadingManager ) );
        }
        return objectLoader;
      },

      get bufferGeometryLoader() {
        if ( bufferGeometryLoader === null ) {
          bufferGeometryLoader = promisifyLoader( new THREE.BufferGeometryLoader( originalLoadingManager ) );
        }
        return bufferGeometryLoader;
      },

      get jsonLoader() {
        if ( jsonLoader === null ) {
          jsonLoader = promisifyLoader( new THREE.JSONLoader( originalLoadingManager ) );
        }
        return jsonLoader;
      },


      get fbxLoader() {
        if ( fbxLoader === null ) {
          loadJavascript( '/js/vendor/three/examples/js/loaders/FBXLoader.min.js', () => {

            fbxLoader = promisifyLoader( new THREE.FBXLoader( originalLoadingManager ) );

          } );
        }
        return fbxLoader;
      },

      get gltfLoader() {
        if ( gltfLoader === null ) {
          gltfLoader = promisifyLoader( new THREE.GLTFLoader( originalLoadingManager ) );
        }
        return gltfLoader;
      },

      get objLoader() {

        if ( objLoaderInternal === null ) {

          objLoaderInternal = new THREE.OBJLoader( originalLoadingManager );

          objLoader = promisifyLoader( objLoaderInternal );

          objLoader.setMaterials = ( materials ) => {

            objLoaderInternal.setMaterials( materials );

          };
        }

        return objLoader;
      },

      get mtlLoader() {
        if ( mtlLoader === null ) {

          mtlLoader = promisifyLoader( new THREE.MTLLoader( originalLoadingManager ) );

        }
        return mtlLoader;
      },

      get colladaLoader() {
        if ( colladaLoader === null ) {

          colladaLoader = promisifyLoader( new THREE.ColladaLoader( originalLoadingManager ) );

        }
        return colladaLoader;
      },

    };

  }

}

export default new Loaders();
