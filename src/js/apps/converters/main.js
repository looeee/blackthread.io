import './components/fullscreen.js';

import App from './App/App.js';

import AnimationControls from './components/AnimationControls.js';
import Background from './components/Background.js';
import Lighting from './components/Lighting.js';
// import Grid from './components/Grid.js';
import HTMLControl from './HTMLControl.js';

import './components/fileReader.js';
import exportGLTF from './utilities/exportGLTF.js';

/* ******************************************************** */

// Set up THREE caching
THREE.Cache.enabled = true;

class Main {

  constructor( canvas ) {

    const self = this;

    this.canvas = canvas;

    this.app = new App( this.canvas );

    // this.app.renderer.setClearColor( 0xf7f7f7, 1.0 );

    this.animationControls = new AnimationControls();

    // Put any per frame calculation here
    this.app.onUpdate = function () {
      // NB: use self inside this function

      self.animationControls.update( self.app.delta );

    };

    // put any per resize calculations here (throttled to once per 250ms)
    this.app.onWindowResize = function () {

      // NB: use self inside this function

    };

    this.loadedObjects = new THREE.Group();
    this.loadedMaterials = [];
    this.app.scene.add( this.loadedObjects );

    this.lighting = new Lighting( this.app );

    this.background = new Background( this.app );

    this.app.initControls();

    this.initExport();

  }

  addObjectToScene( object ) {

    this.reset();

    if ( object === undefined ) {

      console.error( 'Oops! An unspecified error occurred :(' );
      return;

    }

    this.animationControls.initAnimation( object );

    this.loadedObjects.add( object );

    // fit camera to all loaded objects
    this.app.fitCameraToObject( this.loadedObjects, 0.9 );

    this.app.play();

    // this.loadedObjects.traverse( ( child ) => {

    //   if ( child.material !== undefined && Array.isArray( child.material ) ) {

    //     HTMLControl.errors.classList.remove( 'hide' );
    //     HTMLControl.controls.exportGLTF.disabled = true;

    //   }

    // } );

  }

  reset() {

    while ( this.loadedObjects.children.length > 0 ) {

      let child = this.loadedObjects.children[ 0 ];

      this.loadedObjects.remove( child );
      child = null;

    }

    this.loadedMaterials = [];

    this.animationControls.reset();

  }

  initExport() {

    HTMLControl.controls.exportGLTF.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      exportGLTF( this.loadedObjects );

    } );
  }

}

const main = new Main( HTMLControl.originalCanvas );

export default main;
