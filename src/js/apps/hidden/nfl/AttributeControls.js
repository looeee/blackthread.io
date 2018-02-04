import throttle from 'lodash.throttle';
import HTMLControl from './HTMLControl.js';

export default class AttributeControls {

  constructor() {

    this.attributes = HTMLControl.attributes;

    this.dominantHand = 'right';
    this.passAnim = 'pass_right_hand';
    this.victoryAnim = 'victory';

  }

  init( player ) {

    this.player = player;

    this.initSize();
    this.initAthleticAbility();
    this.initFootQuickness();
    this.initDominantHand();
    this.initReleaseQuickness();
    this.initDelivery();
    this.initMechanics();
    this.initArmStrength();
    this.initAnticipation();
    this.initAccuracyShort();
    this.initTouchShort();
    this.initAccuracyLong();
    this.initTouchLong();
    this.initDecisionMaking();
    this.initReadCoverage();
    this.initPocketPresence();
    this.initPoise();
    this.initMobility();
    this.initThrowOnMove();
    this.initRunningAbility();
    this.initClutchProduction();
    this.initAbilityToWin();

  }

  initAnimationControls( controls ) {

    this.animationControls = controls;

  }

  initCameraControls( controls ) {

    this.cameraControls = controls;

  }

  initSprites( sprites ) {

    this.sprites = sprites

  }

  enableControls() {

    Object.values( this.attributes ).forEach( ( attribute ) => { attribute.disabled = false; } );

    this.attributes[ 'dominant-hand' ].left.disabled = false;
    this.attributes[ 'dominant-hand' ].right.disabled = false;
    this.attributes[ 'dominant-hand' ].both.disabled = false;

  }

  initSize() {

    let frameId = null;
    let scale = 1;
    const anim = 'offensive_idle';

    const updateScale = () => {

      const currentScale = this.player.scale.x;

      const diff = scale - currentScale;

      const change = diff * 0.025;

      const newScale = currentScale + change;

      if ( Math.abs( diff ) > 0.005 ) {

        this.player.scale.set( newScale, newScale, newScale );

        frameId = requestAnimationFrame( updateScale );

      } else {

        this.player.scale.set( scale, scale, scale );

        cancelAnimationFrame( frameId );

      }

    };

    this.attributes.size.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const x = e.target.value;

      // curve fitted to give value between 0.9 and 1.1, with x = 5 returning 1
      scale = 0.872222 + ( 0.0283333 * x ) + ( 0.000555556 * ( x * x ) );

      cancelAnimationFrame( frameId );
      updateScale();

      this.animationControls.playAction( anim );
      this.cameraControls.focusDefault();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initAthleticAbility() {

    this.attributes[ 'athletic-ability' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      if ( e.target.value < 5 ) this.animationControls.playAction( 'catch_to_fall' );
      else this.animationControls.playAction( 'catch_to_roll' );

      this.cameraControls.focusDynamic();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initFootQuickness() {

    const anim = 'hike';

    this.attributes[ 'foot-quickness' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();


      const x = ( e.target.value === 1 ) ? 2 : e.target.value;

      // curve fit to give range ( 0.85, 1.2 )
      const timeScale = 0.813889 + 0.0358333 * x + 0.000277778 * ( x * x );

      this.animationControls.setTimeScale( timeScale, anim );
      this.animationControls.playAction( anim );

      this.cameraControls.focusDefault();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initDominantHand() {

    const anim = 'offensive_idle';

    const handy = () => {

      this.animationControls.setTimeScale( 1, anim );
      this.animationControls.playAction( anim );

      this.cameraControls.setArmTarget( this.dominantHand );
      this.cameraControls.focusArms();

      this.sprites.setArm( this.dominantHand );
      this.sprites.hideAllExcept( 'armStrength' );

    };

    this.attributes[ 'dominant-hand' ].left.addEventListener( 'click', throttle( ( e ) => {

      e.preventDefault();

      this.passAnim = 'pass_left_hand';
      this.dominantHand = 'left';

      handy();

    }, 100 ), false );

    this.attributes[ 'dominant-hand' ].right.addEventListener( 'click', throttle( ( e ) => {

      e.preventDefault();

      this.passAnim = 'pass_right_hand';
      this.dominantHand = 'right';

      handy();

    }, 100 ), false );

    this.attributes[ 'dominant-hand' ].both.addEventListener( 'click', throttle( ( e ) => {

      e.preventDefault();

      this.passAnim = 'pass_right_hand';
      this.dominantHand = 'right';

      handy();

    }, 100 ), false );

  }

  initReleaseQuickness() {

    this.attributes[ 'release-quickness' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( this.passAnim );

      this.cameraControls.focusDynamic();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initDelivery() {

    this.attributes.delivery.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( this.passAnim );

      this.cameraControls.focusDynamicUpper();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initMechanics() {

    this.attributes.mechanics.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( this.passAnim );

      this.cameraControls.focusDynamicUpper();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initArmStrength() {

    this.attributes[ 'arm-strength' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( 'offensive_idle' );

      this.cameraControls.focusDefault();
      this.sprites.hideAllExcept( 'armStrength' );

    }, 100 ), false );

  }

  initAnticipation() {

    this.attributes.anticipation.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( this.passAnim );

      this.cameraControls.focusDynamic();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initAccuracyShort() {

    this.attributes[ 'accuracy-short' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( this.passAnim );

      this.cameraControls.focusDynamic();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initTouchShort() {

    this.attributes[ 'touch-short' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( this.passAnim );

      this.cameraControls.focusDynamic();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initAccuracyLong() {

    this.attributes[ 'accuracy-long' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( this.passAnim );

      this.cameraControls.focusDynamic();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initTouchLong() {

    this.attributes[ 'touch-long' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( this.passAnim );

      this.cameraControls.focusDynamic();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initDecisionMaking() {

    this.attributes[ 'decision-making' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( 'offensive_idle' );

      this.cameraControls.focusHead();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initReadCoverage() {

    this.attributes[ 'read-coverage' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( this.passAnim );

      this.cameraControls.focusDynamicUpper();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initPocketPresence() {

    this.attributes[ 'pocket-presence' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( 'hike' );

      this.cameraControls.focusDefault();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initPoise() {

    this.attributes.poise.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( 'hike' );

      this.cameraControls.focusDefault();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initMobility() {

    this.attributes.mobility.addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( 'run' );

      this.cameraControls.focusUpper();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initThrowOnMove() {

    this.attributes[ 'throw-on-move' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      this.animationControls.playAction( this.passAnim );

      this.cameraControls.focusDynamicUpper();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initRunningAbility() {

    this.attributes[ 'running-ability' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const x = ( e.target.value === 1 ) ? 2 : e.target.value;

      // curve fit to give range ( 0.85, 1.2 )
      const timeScale = 0.813889 + 0.0358333 * x + 0.000277778 * ( x * x );

      this.animationControls.setTimeScale( timeScale, 'run' );

      this.animationControls.playAction( 'run' );

      this.cameraControls.focusDefault();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initClutchProduction() {

    this.attributes[ 'clutch-production' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const total = parseInt( e.target.value ) + parseInt( this.attributes[ 'ability-to-win' ].value );

      if ( total < 7 ) {

        this.animationControls.playAction( 'defeat' );

      } else {

        this.animationControls.playAction( 'victory' );

      }

      this.cameraControls.focusUpper();

      this.sprites.hideAll();

    }, 100 ), false );

  }

  initAbilityToWin() {

    this.attributes[ 'ability-to-win' ].addEventListener( 'input', throttle( ( e ) => {

      e.preventDefault();

      const total = parseInt( e.target.value ) + parseInt( this.attributes[ 'clutch-production' ].value );

      if ( total < 7 ) {

        this.animationControls.playAction( 'defeat' );

      } else {

        this.animationControls.playAction( 'victory' );

      }

      this.cameraControls.focusDefault();

      this.sprites.hideAll();

    }, 100 ), false );

  }

}
