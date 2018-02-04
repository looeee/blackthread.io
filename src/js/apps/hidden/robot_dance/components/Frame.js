import { Math as _Math, Vector3 } from '../vendor/three/src/THREE.js';

import TextCell from './HTML/TextCell.js';
import CellInputElem from './HTML/CellInputElem.js';
import ResetButtonCell from './HTML/ResetButtonCell.js';

export default class Frame {

  constructor( robot, num, isBaseFrame = false ) {

    this.type = 'frame';
    this.num = num;
    this.robot = robot;

    this._selected = false;

    if ( !isBaseFrame ) {

      this.createTableEntry( num );
      this.initControlFunctions();
      this.setFlags( false );

    } else {

      this.setFlags( true );

    }

    this.initQuaternions();
    this.setValues( 0 );

  }

  set selected( bool ) {

    if ( this._selected === bool ) return;

    if ( bool === true ) {

      if ( this.row ) this.row.classList.add( 'selected' );
      this.setRotations();
      this.addEventListeners();

      this._selected = true;

    } else {

      if ( this.row ) this.row.classList.remove( 'selected' );
      this.removeEventListeners();

      this._selected = false;

    }

  }

  createTableEntry( num ) {

    const constraints = this.robot.constraints;

    this.row = document.createElement( 'tr' );

    new TextCell( this.row, num + 1 );

    const headCell = document.createElement( 'td' );
    this.row.appendChild( headCell );
    this.headPitchInput = new CellInputElem( this.row, headCell, constraints.headPitchMin, constraints.headPitchMax, 'pitch' );
    this.headYawInput = new CellInputElem( this.row, headCell, constraints.headYawMin, constraints.headYawMax, 'yaw' );

    const leftShoulderCell = document.createElement( 'td' );
    this.row.appendChild( leftShoulderCell );
    this.leftShoulderPitchInput = new CellInputElem( this.row, leftShoulderCell, constraints.shoulderPitchMin, constraints.shoulderPitchMax, 'pitch' );
    this.leftShoulderYawInput = new CellInputElem( this.row, leftShoulderCell, constraints.shoulderYawMin, constraints.shoulderYawMax, 'yaw' );

    const rightShoulderCell = document.createElement( 'td' );
    this.row.appendChild( rightShoulderCell );
    this.rightShoulderPitchInput = new CellInputElem( this.row, rightShoulderCell, constraints.shoulderPitchMin, constraints.shoulderPitchMax, 'pitch' );
    this.rightShoulderYawInput = new CellInputElem( this.row, rightShoulderCell, constraints.shoulderYawMin, constraints.shoulderYawMax, 'yaw' );

    const leftElbowCell = document.createElement( 'td' );
    this.row.appendChild( leftElbowCell );
    this.leftElbowPitchInput = new CellInputElem( this.row, leftElbowCell, constraints.elbowPitchMin, constraints.elbowPitchMax, 'pitch' );
    this.leftElbowYawInput = new CellInputElem( this.row, leftElbowCell, constraints.elbowYawMin, constraints.elbowYawMax, 'yaw' );

    const rightElbowCell = document.createElement( 'td' );
    this.row.appendChild( rightElbowCell );
    this.rightElbowPitchInput = new CellInputElem( this.row, rightElbowCell, constraints.elbowPitchMin, constraints.elbowPitchMax, 'pitch' );
    this.rightElbowYawInput = new CellInputElem( this.row, rightElbowCell, constraints.elbowYawMin, constraints.elbowYawMax, 'yaw' );

    this.resetButton = new ResetButtonCell( this.row );

    const click = () => {

      this.reset();

    };
    this.resetButton.onClick = click;

  }

  addEventListeners() {

    this.headPitchInput.addEventListener( 'input', this.controlFunctions.headPitch );
    this.headYawInput.addEventListener( 'input', this.controlFunctions.headYaw );

    this.leftShoulderPitchInput.addEventListener( 'input', this.controlFunctions.leftShoulderPitch );
    this.leftShoulderYawInput.addEventListener( 'input', this.controlFunctions.leftShoulderYaw );

    this.rightShoulderPitchInput.addEventListener( 'input', this.controlFunctions.rightShoulderPitch );
    this.rightShoulderYawInput.addEventListener( 'input', this.controlFunctions.rightShoulderYaw );

    this.leftElbowPitchInput.addEventListener( 'input', this.controlFunctions.leftElbowPitch );
    this.leftElbowYawInput.addEventListener( 'input', this.controlFunctions.leftElbowYaw );

    this.rightElbowPitchInput.addEventListener( 'input', this.controlFunctions.rightElbowPitch );
    this.rightElbowYawInput.addEventListener( 'input', this.controlFunctions.rightElbowYaw );

  }

  removeEventListeners() {

    this.headPitchInput.removeEventListener( 'input', this.controlFunctions.headPitch );
    this.headYawInput.removeEventListener( 'input', this.controlFunctions.headYaw );

    this.leftShoulderPitchInput.removeEventListener( 'input', this.controlFunctions.leftShoulderPitch );
    this.leftShoulderYawInput.removeEventListener( 'input', this.controlFunctions.leftShoulderYaw );

    this.rightShoulderPitchInput.removeEventListener( 'input', this.controlFunctions.rightShoulderPitch );
    this.rightShoulderYawInput.removeEventListener( 'input', this.controlFunctions.rightShoulderYaw );

    this.leftElbowPitchInput.removeEventListener( 'input', this.controlFunctions.leftElbowPitch );
    this.leftElbowYawInput.removeEventListener( 'input', this.controlFunctions.leftElbowYaw );

    this.rightElbowPitchInput.removeEventListener( 'input', this.controlFunctions.rightElbowPitch );
    this.rightElbowYawInput.removeEventListener( 'input', this.controlFunctions.rightElbowYaw );

  }

  setFlags( value ) {

    this.headPitchSet = value;
    this.headYawSet = value;
    this.leftShoulderPitchSet = value;
    this.leftShoulderYawSet = value;
    this.rightShoulderPitchSet = value;
    this.rightShoulderYawSet = value;
    this.leftElbowPitchSet = value;
    this.leftElbowYawSet = value;
    this.rightElbowPitchSet = value;
    this.rightElbowYawSet = value;

  }

  initQuaternions() {

    this.headQuaternion = this.robot.headInitialQuaternion.clone();
    this.leftShoulderQuaternion = this.robot.leftShoulderInitialQuaternion.clone();
    this.rightShoulderQuaternion = this.robot.rightShoulderInitialQuaternion.clone();
    this.leftElbowQuaternion = this.robot.leftElbowInitialQuaternion.clone();
    this.rightElbowQuaternion = this.robot.rightElbowInitialQuaternion.clone();

  }

  setValues( value ) {

    value = value || 0;

    this.headPitchValue = value;
    this.headYawValue = value;

    this.leftShoulderPitchValue = value;
    this.leftShoulderYawValue = value;

    this.rightShoulderPitchValue = value;
    this.rightShoulderYawValue = value;

    this.leftElbowPitchValue = value;
    this.leftElbowYawValue = value;

    this.rightElbowPitchValue = value;
    this.rightElbowYawValue = value;

  }

  initControlFunctions() {

    const xAxis = new Vector3( 1, 0, 0 );
    const yAxis = new Vector3( 0, 1, 0 );
    const zAxis = new Vector3( 0, 0, 1 );

    const control = ( e, name, sign, direction, axis ) => {

      let value;

      if ( e === '' ) return;

      // this function can either be used from an input Event or by passing a number directly
      if ( e instanceof Event ) {

        e.preventDefault();

        value = _Math.degToRad( sign * e.target.value );


      } else {

        value = _Math.degToRad( sign * e );

      }

      // e.g.  this.robot[ 'head' ].rotateOnAxis( zAxis, this[ 'headPitchValue' ] - value );
      this.robot[name].rotateOnAxis( axis, this[ name + direction + 'Value'] - value );

      // e.g. this.headPitchValue = value;
      this[ name + direction + 'Value'] = value;

      // e.g. this.headPitchSet = true;
      this[ name + direction + 'Set'] = true;

      // e.g. this.headQuaternion.copy(this.robot[ 'head' ].quaternion);
      this[ name + 'Quaternion' ].copy( this.robot[ name ].quaternion );

    };

    this.controlFunctions = {

      headPitch: e => control( e, 'head', 1, 'Pitch', zAxis ),
      headYaw: e => control( e, 'head', 1, 'Yaw', xAxis ),

      leftShoulderPitch: e => control( e, 'leftShoulder', -1, 'Pitch', zAxis ),
      leftShoulderYaw: e => control( e, 'leftShoulder', -1, 'Yaw', yAxis ),

      rightShoulderPitch: e => control( e, 'rightShoulder', -1, 'Pitch', zAxis ),
      rightShoulderYaw: e => control( e, 'rightShoulder', 1, 'Yaw', yAxis ),

      leftElbowPitch: e => control( e, 'leftElbow', 1, 'Pitch', yAxis ),
      leftElbowYaw: e => control( e, 'leftElbow', -1, 'Yaw', zAxis ),

      rightElbowPitch: e => control( e, 'rightElbow', -1, 'Pitch', yAxis ),
      rightElbowYaw: e => control( e, 'rightElbow', -1, 'Yaw', zAxis ),

    };

  }

  setRotations() {

    this.robot.head.quaternion.copy( this.headQuaternion );
    this.robot.leftShoulder.quaternion.copy( this.leftShoulderQuaternion );
    this.robot.rightShoulder.quaternion.copy( this.rightShoulderQuaternion );
    this.robot.leftElbow.quaternion.copy( this.leftElbowQuaternion );
    this.robot.rightElbow.quaternion.copy( this.rightElbowQuaternion );

  }

  setValuesAndQuaternionsFromInputs() {

    this.controlFunctions.headPitch( this.headPitchInput.value );
    this.controlFunctions.headYaw( this.headYawInput.value );
    this.controlFunctions.leftShoulderPitch( this.leftShoulderPitchInput.value );
    this.controlFunctions.leftShoulderYaw( this.leftShoulderYawInput.value );

    this.controlFunctions.rightShoulderPitch( this.rightShoulderPitchInput.value );
    this.controlFunctions.rightShoulderYaw( this.rightShoulderYawInput.value );
    this.controlFunctions.leftElbowPitch( this.leftElbowPitchInput.value );
    this.controlFunctions.leftElbowYaw( this.leftElbowYawInput.value );

    this.controlFunctions.rightElbowPitch( this.rightElbowPitchInput.value );
    this.controlFunctions.rightElbowYaw( this.rightElbowYawInput.value );

  }

  reset() {

    this.headPitchInput.value = '';
    this.headYawInput.value = '';
    this.leftShoulderPitchInput.value = '';
    this.leftShoulderYawInput.value = '';
    this.rightShoulderPitchInput.value = '';
    this.rightShoulderYawInput.value = '';
    this.leftElbowPitchInput.value = '';
    this.leftElbowYawInput.value = '';
    this.rightElbowPitchInput.value = '';
    this.rightElbowYawInput.value = '';

    this.setFlags( false );
    this.setValues();

    this.initQuaternions();
    this.setRotations();

  }

  fromJSON( object ) {

    this.reset();

    this.headPitchInput.value = object.headPitch;
    this.headYawInput.value = object.headYaw;
    this.leftShoulderPitchInput.value = object.leftShoulderPitch;
    this.leftShoulderYawInput.value = object.leftShoulderYaw;
    this.rightShoulderPitchInput.value = object.rightShoulderPitch;
    this.rightShoulderYawInput.value = object.rightShoulderYaw;
    this.leftElbowPitchInput.value = object.leftElbowPitch;
    this.leftElbowYawInput.value = object.leftElbowYaw;
    this.rightElbowPitchInput.value = object.rightElbowPitch;
    this.rightElbowYawInput.value = object.rightElbowYaw;

    this.headPitchSet = this.headPitchInput.value !== '';
    this.headYawSet = this.headYawInput.value !== '';
    this.leftShoulderPitchSet = this.leftShoulderPitchInput.value !== '';
    this.leftShoulderYawSet = this.leftShoulderYawInput.value !== '';
    this.rightShoulderPitchSet = this.rightShoulderPitchInput.value !== '';
    this.rightShoulderYawSet = this.rightShoulderYawInput.value !== '';
    this.leftElbowPitchSet = this.leftElbowPitchInput.value !== '';
    this.leftElbowYawSet = this.leftElbowYawInput.value !== '';
    this.rightElbowPitchSet = this.rightElbowPitchInput.value !== '';
    this.rightElbowYawSet = this.headPitchInput.value !== '';

    this.setValuesAndQuaternionsFromInputs();

  }

  toJSON() {

    return {

      headPitch: this.headPitchInput.value,
      headYaw: this.headYawInput.value,
      leftShoulderPitch: this.leftShoulderPitchInput.value,
      leftShoulderYaw: this.leftShoulderYawInput.value,
      rightShoulderPitch: this.rightShoulderPitchInput.value,
      rightShoulderYaw: this.rightShoulderYawInput.value,
      leftElbowPitch: this.leftElbowPitchInput.value,
      leftElbowYaw: this.leftElbowYawInput.value,
      rightElbowPitch: this.rightElbowPitchInput.value,
      rightElbowYaw: this.rightElbowYawInput.value,

    };

  }

}
