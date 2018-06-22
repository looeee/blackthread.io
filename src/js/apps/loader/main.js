import App from 'three-app';
import './components/fullscreen.js';

import AnimationControls from './components/AnimationControls.js';
import Background from './components/Background.js';
import Environment from './components/Environment.js';
import Lighting from './components/Lighting.js';
import ScreenshotHandler from './components/Screenshot.js';
import Grid from './components/Grid.js';
import HTMLControl from './HTMLControl.js';
import Info from './components/Info.js';

import './components/fileReader.js';
import exportGLTF from './utilities/exportGLTF.js';

/* ******************************************************** */

// Set up THREE caching
THREE.Cache.enabled = true;

class Main {

  constructor( canvas ) {

    const self = this;

    this.canvas = canvas;

    this.app = new App( THREE, this.canvas );

    this.animationControls = new AnimationControls();


    this.app.registerOnUpdateFunction( () => {
      self.animationControls.update( self.app.delta );
    } );

    this.app.loadedObjects = new THREE.Group();
    this.app.loadedMaterials = [];
    this.app.scene.add( this.app.loadedObjects );

    this.lighting = new Lighting( this.app );
    this.grid = new Grid( this.app );
    this.background = new Background( this.app );
    this.environment = new Environment( this.app.loadedMaterials );
    this.info = new Info( this.app, this.app.loadedObjects );

    this.app.scene.add( this.grid.helpers );

    this.app.initControls( THREE.OrbitControls );

    this.screenshotHandler = new ScreenshotHandler( this.app );

    this.initReset();
    this.initExport();

  }

  addObjectToScene( object ) {

    if ( object === undefined ) {

      console.error( 'Oops! An unspecified error occurred :(' );
      return;

    }

    this.animationControls.initAnimation( object );

    this.app.loadedObjects.add( object );

    // fit camera to all loaded objects
    this.app.fitCameraToObject( this.app.loadedObjects, 3 );

    this.app.play();

    this.info.update();

    this.app.loadedObjects.traverse( ( child ) => {

      if ( child.material !== undefined ) {

        this.app.loadedMaterials.push( child.material );

      }

    } );

    this.environment.default();

  }

  initExport() {

    HTMLControl.controls.exportGLTF.addEventListener( 'click', ( e ) => {

      e.preventDefault();

      exportGLTF( this.app.loadedObjects );

    } );
  }

  initReset() {

    HTMLControl.reset.addEventListener( 'click', () => {

      while ( this.app.loadedObjects.children.length > 0 ) {

        let child = this.app.loadedObjects.children[ 0 ];

        this.app.loadedObjects.remove( child );
        child = null;

      }

      this.app.loadedMaterials = [];

      this.animationControls.reset();
      this.lighting.reset();
      HTMLControl.setInitialState();

    } );

  }

}

const main = new Main( HTMLControl.canvas );

export default main;
