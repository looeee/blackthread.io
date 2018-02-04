import * as THREE from 'three';

import App from 'App/App.js';

import loaders from './loaders.js';
import AttributeControls from './AttributeControls.js';
import AnimationControls from './AnimationControls.js';
import CameraControls from './CameraControls.js';
import Sprites from './Sprites.js';
import Lighting from './Lighting.js';
import HTMLControl from './HTMLControl.js';

// Set up THREE caching
THREE.Cache.enabled = true;

class Main {

  constructor() {

    this.preLoad();

    this.loadModels();

    this.loadAnimations();

    this.postLoad();

  }

  preLoad() {

    const self = this;

    this.app = new App( HTMLControl.canvas );
    this.app.renderer.setClearColor( 0xf7f7f7, 1.0 );
    this.app.initControls();

    this.lighting = new Lighting( this.app );

    this.animationControls = new AnimationControls();
    this.attributeControls = new AttributeControls();
    this.cameraControls = new CameraControls( this.app );
    this.sprites = new Sprites( this.app );

    this.animations = {};
    this.loadingPromises = [];

    // Put any per frame calculation here
    this.app.onUpdate = function () {
      // NB: use self inside this function, 'this' will refer to this.app
      const delta = this.delta / 1000;

      self.animationControls.update( delta );
      self.cameraControls.update( delta );
      self.sprites.update( delta );

    };

    // put any per resize calculations here (throttled to once per 250ms)
    this.app.onWindowResize = function () {
      // NB: use self inside this function, 'this' will refer to this.app

    };

    this.initFog();
    this.addGround();

  }

  loadModels() {

    const playerPromise = loaders.fbxLoader( '/assets/models/nfl/t_pose_rigged.fbx' ).then( ( object ) => {

      // object.traverse( ( child ) => {

      //   if ( child instanceof THREE.Mesh ) {

      //     child.frustumCulled = false;

      //   }


      // } );

      this.player = object;

    } );

    // ball not currently used so just resolve the promise immediately
    const ballPromise = Promise.resolve();

    this.loadingPromises = [ playerPromise, ballPromise ];

  }

  loadAnimations() {

    const animationsNames = [
      'catch_to_fall',
      'catch_to_roll',
      'defeat',
      'hike',
      'idle_transition_long',
      'idle_transition_short',
      'offensive_idle',
      'pass_left_hand',
      'pass_right_hand',
      'pushup_to_idle',
      'run',
      'situp_to_idle',
      'victory',
    ];

    this.animations = [];

    animationsNames.forEach( ( name ) => {

      this.loadingPromises.push( loaders.animationLoader( '/assets/models/nfl/anims/' + name + '.json' ).then( ( anim ) => {

        anim.name = name;
        this.animations.push( anim );

      } ) );

    } );

  }

  postLoad() {

    Promise.all( this.loadingPromises ).then(
      () => {

        this.app.scene.add( this.player );

        this.app.play();

        this.animationControls.initMixer( this.player );

        this.animations.forEach( ( anim ) => {

          this.animationControls.initAnimation( anim );

        } );

        this.animationControls.playAction( 'offensive_idle' );

        this.cameraControls.init( this.player );
        this.sprites.init( this.player );

        this.attributeControls.init( this.player );
        this.attributeControls.initAnimationControls( this.animationControls );
        this.attributeControls.initCameraControls( this.cameraControls );
        this.attributeControls.initSprites( this.sprites );
        this.attributeControls.enableControls();

      },
    );

  }

  initFog() {

    this.app.scene.fog = new THREE.Fog( 0xe7e7e7, 600, this.app.camera.far );

  }

  addGround() {

    const geometry = new THREE.PlaneBufferGeometry( 20000, 20000 );
    const material = new THREE.MeshPhongMaterial( { color: 0xb0b0b0, shininess: 0.1 } );
    const ground = new THREE.Mesh( geometry, material );
    ground.position.set( 0, -25, 0 );
    ground.rotation.x = -Math.PI / 2;

    ground.receiveShadow = true;
    this.app.scene.add( ground );

  }

}

const main = new Main();

export default main;
