// import { LoadingManager } from 'three';
import { LoadingManager } from './Three.custom.js';

const fadeLoader = () => {

  const loadingOverlay = document.querySelector( '#loadingOverlay' );

  if ( !loadingOverlay ) return;

  loadingOverlay.classList.add( 'fadeOut' );
  window.setTimeout( () => {

    loadingOverlay.classList.add( 'hide' );

  }, 1500 );

};


const loadingManager = new LoadingManager();

loadingManager.onLoad = function ( ) {

  fadeLoader();

};


loadingManager.onError = ( msg ) => {

  if ( msg instanceof String && msg === '' ) return;

  console.error( 'THREE.LoadingManager error: ' + msg );

};

export default loadingManager;
