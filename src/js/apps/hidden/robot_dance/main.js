import { AmbientLight, Box3, Cache, Fog, Mesh, MeshBasicMaterial, PlaneBufferGeometry, PCFShadowMap } from './vendor/three/src/THREE.js';

import App from './App/App.js';
import OrbitControls from './modules/OrbitControls.module.js';

import loaders from './loaders.js';
import HTMLControl from './HTMLControl.js';
import Robot from './Robot.js';
import FileControl from './FileControl.js';
import Audio from './Audio.js';

// import invertMirroredFBX from './utilities/invertMirroredFBX.js';

import Frames from './components/Frames.js';
import Groups from './components/Groups.js';
import Dance from './components/Dance.js';

import animationControl from './animation/animationControl.js';

Cache.enabled = true;

class Main {

  constructor() {

    this.init();

    this.preLoad();

    this.load();

    this.postLoad();

  }

  init() {

    this.app = new App( HTMLControl.canvas );
    this.app.renderer.setClearColor( 0xf7f7f7, 1.0 );
    this.app.renderer.shadowMap.enabled = true;
    // this.app.renderer.shadowMap.renderReverseSided = false;
    // this.app.renderer.shadowMap.renderSingleSided = false;
    this.app.renderer.shadowMap.type = PCFShadowMap;

    // Put any per frame calculations here
    this.app.onUpdate = function () {

      // note: 'this' refers to 'app' inside this function
      // use this.delta for timings here
      const delta = this.delta / 1000;

      animationControl.onUpdate( delta );

    };

  }

  preLoad() {

    this.animations = {};
    this.loadingPromises = [];

  }

  load() {

    console.time( 'Loading time' );
    const stagePromise = loaders.fbxLoader( '/models/robot_dance/stage_camera_lights.fbx' ).then( ( object ) => {

      this.stage = object.getObjectByName( 'Stage' );

      this.camera = object.getObjectByName( 'Camera' );
      this.spotLight = object.getObjectByName( 'Spot_stage_center_high' );

      this.soundSourceLeft = object.getObjectByName( 'Stage_Left_Sound' );
      this.soundSourceRight = object.getObjectByName( 'Stage_Right_Sound' );

      this.sceneCentre = new Box3().setFromObject( object ).getCenter();
      this.sceneCentre.y -= 5;

    } );

    const naoPromise = loaders.fbxLoader( '/models/robot_dance/nao.fbx' ).then( ( object ) => {

      // invertMirroredFBX( object );

      this.robot = new Robot( object );

      // move to front of stage a little
      object.position.z += 10;

    } );

    this.loadingPromises.push( naoPromise, stagePromise );

  }

  postLoad() {

    Promise.all( this.loadingPromises ).then(
      () => {

        HTMLControl.setOnLoadEndState();
        console.timeEnd( 'Loading time' );

        this.app.scene.add( this.stage );
        this.app.scene.add( this.robot.model );

        this.initBackground();
        this.initLighting();
        this.initShadows();
        this.initCamera();
        this.initCameraControl();

        animationControl.initMixer( this.robot.model );

        const frames = new Frames( this.robot );
        const groups = new Groups( frames );
        const dance = new Dance( groups );

        animationControl.setDance( dance );

        new Audio( [ this.soundSourceLeft, this.soundSourceRight ], this.app.camera );

        new FileControl( frames, groups, dance );

        this.app.play();

      } );

  }

  initShadows() {

    // this.stage.getObjectByName( 'scene' ).receiveShadow = true;
    // this.stage.getObjectByName( 'curtains_top' ).receiveShadow = true;

    this.stage.traverse( ( child ) => {

      if (
        child.name === 'scene'
        || child.name === 'curtains_top'
        // || child.name === 'curtains'
       ) {

        child.receiveShadow = true;

      }

      if (

        child.name === 'side'
        // || child.name === 'curtains'

        || child.name === 'speaker_cone'
        || child.name === 'speaker_cone_edge'
        || child.name === 'speaker_cone_outer'
        || child.name === 'Speaker_body'
        || child.name === 'tassle04'
        || child.name === 'tassle02'

      ) {
        child.castShadow = true;
      }

    } );

    this.robot.model.traverse( ( child ) => {

      if (

        child.name === 'R_shin'
        || child.name === 'R_thigh'
        || child.name === 'L_thigh'
        || child.name === 'L_shin'
        || child.name === 'fingers18'
        || child.name === 'fingers11'
        || child.name === 'fingers21'
        || child.name === 'fingers20'
        || child.name === 'fingers14'
        || child.name === 'fingers12'
        || child.name === 'fingers16'
        || child.name === 'fingers15'
        || child.name === 'fingers13'
        || child.name === 'fingers13'
        || child.name === 'fingers19'
        || child.name === 'L_forearm'
        || child.name === 'L_elbow'
        || child.name === 'L_shoulder'
        || child.name === 'L_arm_upper'
        || child.name === 'fingers05'
        || child.name === 'fingers06'
        || child.name === 'fingers08'
        || child.name === 'fingers10'
        || child.name === 'fingers00'
        || child.name === 'fingers02'
        || child.name === 'fingers04'
        || child.name === 'fingers03'
        || child.name === 'fingers07'
        || child.name === 'fingers09'
        || child.name === 'fingers01'
        || child.name === 'R_elbow'
        || child.name === 'R_shoulder'
        || child.name === 'R_arm_upper'
        || child.name === 'R_hand'
        || child.name === 'R_wrist'
        || child.name === 'body'
        || child.name === 'neck'
        || child.name === 'head'
        || child.name === 'L_hip'
        || child.name === 'R_hip'
        || child.name === 'L_hand'

        // ||  child.name === 'R_foot'
        // || child.name === 'R_knee'
        // || child.name === 'L_foot'
        // || child.name === 'chest_detail'
        // || child.name === 'R_knee_rear'
        // || child.name === 'R_hip_lower'
        // || child.name === 'R_hip_cog'
        // || child.name === 'L_hip_cog'
        // || child.name === 'L_hip_lower'
        // || child.name === 'L_knee'
        // || child.name === 'L_ankle'
        // || child.name === 'R_ankle'
        // || child.name === 'L_knee_rear'
        // || child.name === 'fingers17'
        // || child.name === 'L_shoulder_joint'
        // || child.name === 'R_shoulder_joint'

      ) {

        child.castShadow = true;

      }

    } );

  }

  initLighting() {

    const ambientLight = new AmbientLight( 0xffffff, 0.3 );
    this.app.scene.add( ambientLight );

    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.camera.near = 80;
    this.spotLight.shadow.camera.far = 300;

    this.spotLight.penumbra = 0.45;
    this.spotLight.angle = 0.45;
    this.spotLight.distance = 300;

    const left = this.spotLight.clone();
    left.intensity = 0.9;
    left.position.x -= 100;
    left.position.y += 20;
    left.shadow.radius = 1.5;

    const center = this.spotLight.clone();
    center.intensity = 1.2;
    center.position.x += 25;
    center.shadow.radius = 1.75;

    this.app.scene.add( left, center );

  }

  initCamera() {

    this.app.camera.far = 800;
    this.app.camera.fov = 35;
    this.app.camera.position.set( 0, 50, 160 );
    this.app.camera.updateProjectionMatrix();

  }

  initCameraControl() {

    this.app.controls = new OrbitControls( this.app.camera, this.app.canvas );

    this.app.controls.enableKeys = false;

    this.app.controls.enableZoom = false;

    // vertical rotation limits
    this.app.controls.minPolarAngle = Math.PI * 0.1; // upper
    this.app.controls.maxPolarAngle = Math.PI * 0.45; // lower

    this.app.controls.minDistance = 60;
    this.app.controls.maxDistance = 400;

    // horizontal rotation limits
    this.app.controls.minAzimuthAngle = -Math.PI * 0.5;
    this.app.controls.maxAzimuthAngle = Math.PI * 0.5;

    this.app.controls.enableDamping = true;
    this.app.controls.dampingFactor = 0.2;

    this.app.controls.target.copy( this.sceneCentre );
    this.app.controls.update();

  }


  initBackground() {

    this.app.scene.fog = new Fog( 0xf7f7f7, 400, 700 );

    const geometry = new PlaneBufferGeometry( 20000, 20000 );
    const material = new MeshBasicMaterial( { color: 0xaaaaaa } );
    const ground = new Mesh( geometry, material );
    ground.position.set( 0, -5, 0 );
    ground.rotation.x = -Math.PI / 2;

    this.app.scene.add( ground );

  }

}

export default new Main();
