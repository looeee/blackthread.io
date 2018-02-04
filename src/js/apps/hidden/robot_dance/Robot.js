export default class Robot {

  constructor( model ) {

    this.model = model;

    this.initParts();
    this.initConstraints();
    this.initDefaultPose();

  }

  initDefaultPose() {

    this.headInitialQuaternion = this.head.quaternion.clone();
    this.leftShoulderInitialQuaternion = this.leftShoulder.quaternion.clone();
    this.rightShoulderInitialQuaternion = this.rightShoulder.quaternion.clone();
    this.leftElbowInitialQuaternion = this.leftElbow.quaternion.clone();
    this.rightElbowInitialQuaternion = this.rightElbow.quaternion.clone();

  }

  initParts() {

    this.head = this.model.getObjectByName( 'head' );

    this.leftShoulder = this.model.getObjectByName( 'leftShoulder' );
    this.rightShoulder = this.model.getObjectByName( 'rightShoulder' );

    this.leftElbow = this.model.getObjectByName( 'leftElbow' );
    this.rightElbow = this.model.getObjectByName( 'rightElbow' );

  }

  initConstraints() {

    this.constraints = {

      headPitchMin: -38.4,
      headPitchMax: 29.5,
      headYawMin: -119.5,
      headYawMax: 119.5,

      shoulderPitchMin: -119.5,
      shoulderPitchMax: 119.5,
      shoulderYawMin: 0.5,
      shoulderYawMax: 94.5,

      elbowPitchMin: 0.5,
      elbowPitchMax: 89.5,
      elbowYawMin: -119.5,
      elbowYawMax: 119.5,

    };

  }

  reset() {

    this.head.quaternion.copy( this.headInitialQuaternion );
    this.leftShoulder.quaternion.copy( this.leftShoulderInitialQuaternion );
    this.rightShoulder.quaternion.copy( this.rightShoulderInitialQuaternion );
    this.leftElbow.quaternion.copy( this.leftElbowInitialQuaternion );
    this.rightElbow.quaternion.copy( this.rightElbowInitialQuaternion );

  }

}
