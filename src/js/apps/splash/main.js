// import { Cache, Color, DoubleSide, PlaneBufferGeometry, Mesh, TextureLoader, Vector2, RepeatWrapping, RawShaderMaterial, ShaderMaterial } from 'three';
import { Cache, Color, DoubleSide, PlaneBufferGeometry, Mesh, TextureLoader, Vector2, RepeatWrapping, RawShaderMaterial, ShaderMaterial } from './Three.custom.js';

import pointerPosToCanvasCentre from './utilities/pointerPosToCanvasCentre.js';

import App from './App/App.js';

import loaders from './Loaders.js';

import backgroundVert from './shaders/background.vert';
import backgroundFrag from './shaders/background.frag';
import shapeVert from './shaders/shape.vert';
import shapeFrag from './shaders/shape.frag';
import textVert from './shaders/text.vert';
import textFrag from './shaders/text.frag';

import cameraZPos from './utilities/cameraZPos.js';
import pointerPos from './utilities/pointerPos.js';
import createTextGeometry from './utilities/createTextGeometry.js';
import createShapeGeometries from './utilities/createShapeGeometries.js';

Cache.enabled = true;

class Main {

  constructor() {

    this.preLoad();

    this.load();

    this.postLoad();

  }

  preLoad() {

    const self = this;

    this.app = new App( document.querySelector( '#splash-canvas' ) );

    this.app.camera.fov = 75;
    this.app.camera.position.set( 0, 0, cameraZPos( this.app.camera.aspect ) );
    this.app.camera.updateProjectionMatrix();

    this.initMaterials();

    this.addBackground();

    this.app.onWindowResize = function () {

      self.app.camera.position.set( 0, 0, cameraZPos( self.app.camera.aspect ) );

      self.adjustTextPosition();

    };

  }

  load() {

    this.loadingPromises = [];

    const fontPromise = loaders.fontLoader( '/fonts/json/droid_sans_mono_regular.typeface.json' )
      .then( ( font ) => { this.font = font; } );

    this.loadingPromises.push( fontPromise );

  }

  postLoad() {

    Promise.all( this.loadingPromises ).then( () => {

      this.text = createTextGeometry( this.font, this.textMat );

      this.adjustTextPosition();

      this.app.scene.add( this.text );

      this.shape = createShapeGeometries( this.shapeMat );

      this.app.scene.add( this.shape );

      this.initAnimation();

      this.app.play();

    } );

  }

  adjustTextPosition() {

    const aspect = window.innerWidth / window.innerHeight;
    this.adjust = -50 * ( 1 - ( 1 / aspect ) );

    this.text.position.y = ( window.innerWidth / window.innerHeight > 1.1 ) ? this.adjust : 0;

  }

  initAnimation() {

    const self = this;

    let uTime = 1.0;
    const minTime = 0.0;
    let animSpeed = 8000;

    const updateMaterials = function () {

      // Pan events on mobile sometimes register as ( 0, 0 ); ignore these
      if ( pointerPos.x !== 0 && pointerPos.y !== 0 ) {

        const y = pointerPos.y + self.adjust;

        const offsetX = pointerPos.x / self.app.canvas.clientWidth;
        let offsetY = 1 - y / self.app.canvas.clientHeight;

        // make the line well defined when moving the pointer off the top of the canvas
        offsetY = ( offsetY > 0.99 ) ? 0.999 : offsetY;

        self.offset.set( offsetX, offsetY );
        self.smooth.set( 1.0, offsetY );

        const pointer = pointerPosToCanvasCentre( self.app.camera, self.app.canvas );
        self.pointer.set( pointer.x, pointer.y - self.adjust );

      }

    };

    const updateAnimation = function () {

      // set on repeat (for testing)
      // if ( uTime <= minTime ) uTime = 1.0;

      // Ignore large values of delta (caused by window not be being focused for a while)
      if ( uTime >= minTime ) {

        uTime -= self.app.delta / animSpeed;

      }

      self.textMat.uniforms.uTime.value = uTime;

      // speed up the animation as it progresses
      animSpeed -= 5;

    };

    const updateAmount = 0.005;

    this.app.onUpdate = function () {

      updateMaterials();

      updateAnimation();

      self.shape.geometry.rotateX( updateAmount );
      self.shape.geometry.rotateY( updateAmount );

    };

  }


  addBackground() {

    const geometry = new PlaneBufferGeometry( 2, 2, 1 );
    this.bgMesh = new Mesh( geometry, this.backgroundMat );
    this.app.scene.add( this.bgMesh );

  }

  initMaterials() {

    const loader = new TextureLoader();
    const noiseTexture = loader.load( '/images/textures/noise-256.jpg' );
    noiseTexture.wrapS = noiseTexture.wrapT = RepeatWrapping;

    this.offset = new Vector2( 0, 0 );
    this.smooth = new Vector2( 1.0, 1.0 );
    this.pointer = new Vector2( -1000, -1000 );

    const colA = new Color( 0xffffff );
    const colB = new Color( 0x283844 );

    const uniforms = {
      noiseTexture: { value: noiseTexture },
      offset: { value: this.offset },
      smooth: { value: this.smooth },
    };

    this.textMat = new ShaderMaterial( {
      uniforms: Object.assign( {
        color1: { value: colB },
        color2: { value: colA },
        uTime: { value: 0.0 },
        pointer: { value: this.pointer },
      }, uniforms ),
      vertexShader: textVert,
      fragmentShader: textFrag,
      side: DoubleSide,
    } );

    this.shapeMat = new ShaderMaterial( {
      uniforms: Object.assign( {
        color1: { value: colB },
        color2: { value: colA },
        uTime: { value: 0.0 },
        pointer: { value: this.pointer },
      }, uniforms ),
      vertexShader: shapeVert,
      fragmentShader: shapeFrag,
      side: DoubleSide,
    } );

    this.backgroundMat = new RawShaderMaterial( {

      uniforms: Object.assign( {
        color1: { value: colA },
        color2: { value: colB },
      }, uniforms ),
      vertexShader: backgroundVert,
      fragmentShader: backgroundFrag,

    } );

  }

}

export default new Main();
