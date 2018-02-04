import { AnimationClip, AnimationMixer, LoopOnce, QuaternionKeyframeTrack } from '../vendor/three/src/THREE.js';
import HTMLControl from '../HTMLControl.js';

let framerate = 1;

class AnimationControl {

  constructor() {

    this.defaultFrame = null;

    this.frames = null;
    this.groups = null;
    this.dance = null;

    this.actions = [];

    HTMLControl.controls.dance.framerate.addEventListener( 'input', ( e ) => {

      e.preventDefault();

      this.framerate = e.target.value;

    } );

    this.onFinish = () => {};

  }

  set framerate( value ) {

    framerate = value;

  }

  get framerate() {

    return framerate;

  }

  setDance( dance ) {

    this.dance = dance;
    this.frames = dance.frames;
    this.groups = dance.groups;

    return this;

  }

  initMixer( object ) {

    this.mixer = new AnimationMixer( object );

    this.mixer.addEventListener( 'finished', () => {

      this.onFinish();

    } );

  }

  onUpdate( delta ) {

    if ( this.mixer ) this.mixer.update( delta * framerate );

  }

  createAnimation( frames ) {

    this.reset();

    if ( frames.length < 2 ) return;

    const headValues = [

      frames[ 0 ].headQuaternion.x,
      frames[ 0 ].headQuaternion.y,
      frames[ 0 ].headQuaternion.z,
      frames[ 0 ].headQuaternion.w,

    ];

    const leftShoulderValues = [

      frames[ 0 ].leftShoulderQuaternion.x,
      frames[ 0 ].leftShoulderQuaternion.y,
      frames[ 0 ].leftShoulderQuaternion.z,
      frames[ 0 ].leftShoulderQuaternion.w,

    ];

    const rightShoulderValues = [

      frames[ 0 ].rightShoulderQuaternion.x,
      frames[ 0 ].rightShoulderQuaternion.y,
      frames[ 0 ].rightShoulderQuaternion.z,
      frames[ 0 ].rightShoulderQuaternion.w,

    ];

    const leftElbowValues = [

      frames[ 0 ].leftElbowQuaternion.x,
      frames[ 0 ].leftElbowQuaternion.y,
      frames[ 0 ].leftElbowQuaternion.z,
      frames[ 0 ].leftElbowQuaternion.w,

    ];

    const rightElbowValues = [

      frames[ 0 ].rightElbowQuaternion.x,
      frames[ 0 ].rightElbowQuaternion.y,
      frames[ 0 ].rightElbowQuaternion.z,
      frames[ 0 ].rightElbowQuaternion.w,

    ];

    const times = [ 0 ];

    for ( let i = 1; i < frames.length; i++ ) {

      times.push( i );

      headValues.push(

        frames[ i ].headQuaternion.x,
        frames[ i ].headQuaternion.y,
        frames[ i ].headQuaternion.z,
        frames[ i ].headQuaternion.w,

      );

      leftShoulderValues.push(

        frames[ i ].leftShoulderQuaternion.x,
        frames[ i ].leftShoulderQuaternion.y,
        frames[ i ].leftShoulderQuaternion.z,
        frames[ i ].leftShoulderQuaternion.w,

      );


      rightShoulderValues.push(

        frames[ i ].rightShoulderQuaternion.x,
        frames[ i ].rightShoulderQuaternion.y,
        frames[ i ].rightShoulderQuaternion.z,
        frames[ i ].rightShoulderQuaternion.w,

      );

      leftElbowValues.push(

        frames[ i ].leftElbowQuaternion.x,
        frames[ i ].leftElbowQuaternion.y,
        frames[ i ].leftElbowQuaternion.z,
        frames[ i ].leftElbowQuaternion.w,

      );

      rightElbowValues.push(

        frames[ i ].rightElbowQuaternion.x,
        frames[ i ].rightElbowQuaternion.y,
        frames[ i ].rightElbowQuaternion.z,
        frames[ i ].rightElbowQuaternion.w,

      );

    }

    const allTracks = [

      new QuaternionKeyframeTrack( 'head.quaternion', times, headValues ),
      new QuaternionKeyframeTrack( 'leftShoulder.quaternion', times, leftShoulderValues ),
      new QuaternionKeyframeTrack( 'rightShoulder.quaternion', times, rightShoulderValues ),
      new QuaternionKeyframeTrack( 'leftElbow.quaternion', times, leftElbowValues ),
      new QuaternionKeyframeTrack( 'rightElbow.quaternion', times, rightElbowValues ),

    ];

    this.createAction( 'headControl.quaternion', allTracks );

  }

  // A Clip consists of one or more keyframe tracks
  // - for example the movement of an arm over the duration of a group.
  // An Action controls playback of the clip
  createAction( name, tracks ) {

    const clip = new AnimationClip( name, -1, tracks );

    this.action = this.mixer.clipAction( clip );

    // action.zeroSlopeAtStart = false;
    // this.action.zeroSlopeAtEnd = true;

    this.action.clampWhenFinished = true;

    this.action.loop = LoopOnce;

    this.action.name = clip.name;

    return this.action;

  }

  play() {

    if ( this.action ) this.action.play();

  }

  reset() {

    if ( this.action ) {

      this.action.stop();
      this.action = null;

      this.frames.robot.reset();

    }

  }

}

export default new AnimationControl();
