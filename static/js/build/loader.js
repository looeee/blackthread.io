this.loader = this.loader || {};
(function () {
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

// const loadOverlay =
var canvas = document.querySelector('#loader-canvas');
var container = document.querySelector('#page-content');
var reset = document.querySelector('#reset');
var exportBtn = document.querySelector('#export');
var exportAnims = document.querySelector('#export-anims');
var fullscreenButton = document.querySelector('#fullscreen-button');

var modelInfo = {
  bbDepth: document.querySelector('#bb-depth'),
  bbWidth: document.querySelector('#bb-width'),
  bbHeight: document.querySelector('#bb-height'),
  faces: document.querySelector('#faces'),
  vertices: document.querySelector('#vertices'),
  infoBox: document.querySelector('#model-info')
};

var animation = {
  slider: document.querySelector('#animation-slider'),
  playButton: document.querySelector('#play-button'),
  pauseButton: document.querySelector('#pause-button'),
  playbackControl: document.querySelector('#playback-control'),
  clipsSelection: document.querySelector('#animation-clips'),
  controls: document.querySelector('#animation-controls')
};

var fileUpload = {
  input: document.querySelector('#file-upload-input'),
  button: document.querySelector('#file-upload-button'),
  form: document.querySelector('#file-upload-form')
};

var lighting = {
  slider: document.querySelector('#lighting-slider'),
  symbol: document.querySelector('#light-symbol')
};

var loading = {
  bar: document.querySelector('#loading-bar'),
  overlay: document.querySelector('#loading-overlay'),
  progress: document.querySelector('#progress')
};

var screenshot = {
  button: document.querySelector('#screenshot-button')
};

var controls = {
  links: document.querySelector('#controls').querySelectorAll('span'),
  toggleGrid: document.querySelector('#toggle-grid'),
  toggleInfo: document.querySelector('#toggle-info'),
  toggleBackground: document.querySelector('#toggle-background'),
  toggleEnvironment: document.querySelector('#toggle-environment'),
  sliders: document.querySelectorAll('input[type=range]'),
  exampleDuck: document.querySelector('#example-duck'),
  exportGLTF: document.querySelector('#export-gltf')
};

var HTMLControl = function () {
  function HTMLControl() {
    classCallCheck(this, HTMLControl);
  }

  createClass(HTMLControl, null, [{
    key: 'setInitialState',
    value: function setInitialState() {

      loading.overlay.classList.remove('hide');
      fileUpload.form.classList.remove('hide');
      loading.bar.classList.add('hide');
      loading.progress.style.width = 0;

      animation.controls.classList.add('hide');
      animation.playButton.classList.add('hide');
      animation.pauseButton.classList.remove('hide');

      // reset animations options
      var base = animation.clipsSelection.children[0];
      animation.clipsSelection.innerHTML = '';
      animation.clipsSelection.appendChild(base);
    }
  }, {
    key: 'setOnLoadStartState',
    value: function setOnLoadStartState() {
      fileUpload.form.classList.add('hide');
      loading.bar.classList.remove('hide');
    }
  }, {
    key: 'setOnLoadEndState',
    value: function setOnLoadEndState() {

      loading.overlay.classList.add('hide');
    }
  }]);
  return HTMLControl;
}();

HTMLControl.canvas = canvas;
HTMLControl.container = container;
HTMLControl.reset = reset;
HTMLControl.fullscreenButton = fullscreenButton;
HTMLControl.animation = animation;
HTMLControl.fileUpload = fileUpload;
HTMLControl.lighting = lighting;
HTMLControl.loading = loading;
HTMLControl.screenshot = screenshot;
HTMLControl.controls = controls;
HTMLControl.export = exportBtn;
HTMLControl.exportAnims = exportAnims;
HTMLControl.modelInfo = modelInfo;

var goFullscreen = function goFullscreen(elem) {

  if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};

HTMLControl.fullscreenButton.addEventListener('click', function (e) {

  e.preventDefault();
  goFullscreen(HTMLControl.container);
}, false);

/**
 * @author Lewy Blue / https://github.com/looeee
 */

function Time() {

  // Keep track of time when pause() was called
  var _pauseTime = void 0;

  // Keep track of time when delta was last checked
  var _lastDelta = 0;

  // Hold the time when start() was called
  // There is no point in exposing this as it's essentially a random number
  // and will be different depending on whether performance.now or Date.now is used
  var _startTime = 0;

  this.running = false;
  this.paused = false;

  // The scale at which the time is passing. This can be used for slow motion effects.
  var _timeScale = 1.0;
  // Keep track of scaled time across scale changes
  var _totalTimeAtLastScaleChange = 0;
  var _timeAtLastScaleChange = 0;

  Object.defineProperties(this, {

    now: {
      get: function get() {

        return (performance || Date).now();
      }
    },

    timeScale: {
      get: function get() {

        return _timeScale;
      },
      set: function set(value) {

        _totalTimeAtLastScaleChange = this.totalTime;
        _timeAtLastScaleChange = this.now;
        _timeScale = value;
      }
    },

    unscaledTotalTime: {
      get: function get() {

        return this.running ? this.now - _startTime : 0;
      }
    },

    totalTime: {
      get: function get() {

        var diff = (this.now - _timeAtLastScaleChange) * this.timeScale;

        return this.running ? _totalTimeAtLastScaleChange + diff : 0;
      }
    },

    // Unscaled time since delta was last checked
    unscaledDelta: {
      get: function get() {

        var diff = this.now - _lastDelta;
        _lastDelta = this.now;

        return diff;
      }
    },

    // Scaled time since delta was last checked
    delta: {
      get: function get() {

        return this.unscaledDelta * this.timeScale;
      }
    }

  });

  this.start = function () {

    if (this.paused) {

      var diff = this.now - _pauseTime;

      _startTime += diff;
      _lastDelta += diff;
      _timeAtLastScaleChange += diff;
    } else if (!this.running) {

      _startTime = _lastDelta = _timeAtLastScaleChange = this.now;

      _totalTimeAtLastScaleChange = 0;
    }

    this.running = true;
    this.paused = false;
  };

  // Reset and stop clock
  this.stop = function () {

    _startTime = 0;
    _totalTimeAtLastScaleChange = 0;

    this.running = false;
  };

  this.pause = function () {

    _pauseTime = this.now;

    this.paused = true;
  };
}

var _canvas = void 0;
var _scene = void 0;
var _camera = void 0;
var _renderer = void 0;

var _currentAnimationFrameID = void 0;

function App(canvas) {

  var self = this;

  if (canvas !== undefined) _canvas = canvas;

  this.autoRender = true;

  this.autoResize = true;

  this.frameCount = 0;

  this.delta = 0;

  this.isPlaying = false;
  this.isPaused = false;

  this.time = new Time();

  var setRendererSize = function setRendererSize() {

    _renderer.setSize(_canvas.clientWidth, _canvas.clientHeight, false);
  };

  var setCameraAspect = function setCameraAspect() {
    _camera.aspect = _canvas.clientWidth / _canvas.clientHeight;
    _camera.updateProjectionMatrix();
  };

  // note: gets called last when autoResize is on
  this.onWindowResize = function () {};

  var onWindowResize = function onWindowResize() {

    if (!self.autoResize) {

      self.onWindowResize();
      return;
    }

    // don't do anything if the camera doesn't exist yet
    if (!_camera) return;

    if (_camera.type !== 'PerspectiveCamera') {

      console.warn('App: AutoResize only works with PerspectiveCamera');
      return;
    }

    setCameraAspect();

    setRendererSize();

    self.onWindowResize();
  };

  window.addEventListener('resize', onWindowResize, false);

  Object.defineProperties(this, {

    canvas: {
      get: function get() {

        if (_canvas === undefined) {

          _canvas = document.body.appendChild(document.createElement('canvas'));
          _canvas.style.position = 'absolute';
          _canvas.style.width = _canvas.style.height = '100%';
        }

        return _canvas;
      },
      set: function set(newCanvas) {

        _canvas = newCanvas;
      }
    },

    camera: {
      get: function get() {

        if (_camera === undefined) {

          _camera = new THREE.PerspectiveCamera(50, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        }

        return _camera;
      },
      set: function set(camera) {

        _camera = camera;
        setCameraAspect();
      }
    },

    scene: {
      get: function get() {

        if (_scene === undefined) {

          _scene = new THREE.Scene();
        }

        return _scene;
      },
      set: function set(scene) {

        _scene = scene;
      }
    },

    renderer: {
      get: function get() {

        if (_renderer === undefined) {

          _renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
          _renderer.setPixelRatio(window.devicePixelRatio);
          _renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
        }

        return _renderer;
      },
      set: function set(renderer) {

        _renderer = renderer;
        setRendererSize();
      }
    },

    averageFrameTime: {
      get: function get() {

        return this.frameCount !== 0 ? this.time.unscaledTotalTime / this.frameCount : 0;
      }
    }

  });

  this.play = function () {

    this.time.start();

    this.isPlaying = true;
    this.isPaused = false;

    function animationHandler() {

      self.frameCount++;
      self.delta = self.time.delta;

      self.onUpdate();

      if (self.controls && self.controls.enableDamping) self.controls.update();

      if (self.autoRender) self.renderer.render(self.scene, self.camera);

      _currentAnimationFrameID = requestAnimationFrame(function () {
        animationHandler();
      });
    }

    animationHandler();
  };

  this.pause = function () {

    this.isPaused = true;

    this.time.pause();

    cancelAnimationFrame(_currentAnimationFrameID);
  };

  this.stop = function () {

    this.isPlaying = false;
    this.isPaused = false;

    this.time.stop();
    this.frameCount = 0;

    cancelAnimationFrame(_currentAnimationFrameID);
  };

  this.onUpdate = function () {};

  this.initControls = function () {

    this.controls = new THREE.OrbitControls(this.camera, this.canvas);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;
  };

  this.fitCameraToObject = function (object, zoom) {

    zoom = zoom || 1;

    var boundingBox = new THREE.Box3();

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject(object);

    var center = boundingBox.getCenter();

    var size = boundingBox.getSize();

    // get the max side of the bounding box
    var maxDim = Math.max(size.x, size.y, size.z);
    var fov = this.camera.fov * (Math.PI / 180);
    var cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));

    cameraZ *= zoom; // zoom out a little so that objects don't fill the screen

    var minZ = boundingBox.min.z;
    var cameraToFarEdge = -minZ + cameraZ;

    var far = cameraToFarEdge * 3;
    this.camera.far = far;

    // camera near needs to be set to accommodate tiny objects
    // but not cause artefacts for large objects
    if (far < 1) this.camera.near = 0.001;else if (far < 100) this.camera.near = 0.01;else if (far < 500) this.camera.near = 0.1;
    // else if ( far < 1000 ) this.camera.near = 1;
    else this.camera.near = 1;

    // set camera to rotate around center of loaded object
    this.controls.target.copy(center);

    // // prevent camera from zooming out far enough to create far plane cutoff
    this.controls.maxDistance = cameraToFarEdge * 2;

    this.camera.position.set(center.x, size.y, cameraZ);

    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.controls.saveState();

    return boundingBox;
  };
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;
var nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var lodash_throttle = throttle;

// saving function taken from three.js editor
var link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link); // Firefox workaround, see #6594

var save = function save(blob, filename) {

  link.href = URL.createObjectURL(blob);
  link.download = filename || 'data.json';
  link.click();
};

var saveString = function saveString(text, filename) {

  save(new Blob([text], { type: 'text/plain' }), filename);
};

var exportAsJSON = function exportAsJSON(anim) {

  var output = JSON.stringify(THREE.AnimationClip.toJSON(anim), null, '\t');

  // remove first '[' and last ']' from json
  output = output.replace(/[^{]*/i, '').replace(/\]$/i, '');

  saveString(output, 'blackThreadAnimations.json');
};

var AnimationControls = function () {
  function AnimationControls() {
    classCallCheck(this, AnimationControls);


    this.isPaused = false;
    this.pauseButtonActive = false;

    this.clips = [];
    this.mixers = [];
    this.actions = [];
    this.animationNames = [];

    this.initExportAnims();
  }

  createClass(AnimationControls, [{
    key: 'reset',
    value: function reset() {

      this.clips = [];
      this.mixers = [];
      this.actions = [];
      this.animationNames = [];

      this.currentMixer = null;
      this.currentAction = null;
      this.isPaused = false;
      this.pauseButtonActive = false;

      HTMLControl.animation.playbackControl.removeEventListener('click', this.playPause, false);
      HTMLControl.animation.slider.removeEventListener('mousedown', this.sliderMouseDownEvent, false);
      HTMLControl.animation.slider.removeEventListener('input', this.sliderInputEvent, false);
      HTMLControl.animation.slider.removeEventListener('mouseup', this.sliderMouseupEvent, false);
      HTMLControl.animation.clipsSelection.removeEventListener('change', this.clipsChangeEvent, false);
    }
  }, {
    key: 'update',
    value: function update(delta) {

      // delta is in seconds while animations are in milliseconds so convert here
      if (this.currentMixer && this.currentAction && !this.isPaused) {

        this.currentMixer.update(delta / 1000);

        // this.currentMixer.time increases indefinitely, whereas this.currentAction.time
        // increases modulo the animation duration, so set the slider value from that
        this.setSliderValue(this.currentAction.time);
      }
    }
  }, {
    key: 'initAnimation',
    value: function initAnimation(object) {
      var _this = this;

      // don't do anything if the object has no animations
      if (!object.animations || object.animations.length === 0) return;

      object.animations.forEach(function (animation) {

        if (!(animation instanceof THREE.AnimationClip)) {

          console.warn('Some animations are not valid THREE.AnimationClips. Skipping these.');

          return;
        }

        var mixer = new THREE.AnimationMixer(object);

        var action = mixer.clipAction(animation);

        _this.clips.push(animation);
        _this.mixers.push(mixer);
        _this.actions.push(action);
        _this.animationNames.push(animation.name);

        HTMLControl.animation.clipsSelection.appendChild(new Option(animation.name, animation.name));
      });

      // If all animations have been skipped, return
      if (this.animationNames.length === 0) return;

      this.selectCurrentAnimation(this.animationNames[0]);

      HTMLControl.animation.controls.classList.remove('hide');

      this.initPlayPauseControls();

      this.initSlider();

      this.initSelectionMenu();
    }
  }, {
    key: 'selectCurrentAnimation',
    value: function selectCurrentAnimation(name) {

      var index = this.animationNames.indexOf(name);

      if (index === -1) {

        console.warn('Animation ' + name + ' not found.');
      } else {

        if (this.currentAction) this.currentAction.stop();

        this.currentMixer = this.mixers[index];
        this.currentAction = this.actions[index];
        this.currentClip = this.clips[index];

        // set animation slider max to length of animation
        HTMLControl.animation.slider.max = String(this.currentClip.duration);

        HTMLControl.animation.slider.step = String(this.currentClip.duration / 150);

        this.currentAction.play();
      }
    }
  }, {
    key: 'setSliderValue',
    value: function setSliderValue(val) {

      HTMLControl.animation.slider.value = String(val);
    }
  }, {
    key: 'initPlayPauseControls',
    value: function initPlayPauseControls() {
      var _this2 = this;

      this.playPause = function (e) {

        e.preventDefault();

        _this2.togglePause();
      };

      HTMLControl.animation.playbackControl.addEventListener('click', this.playPause, false);
    }
  }, {
    key: 'togglePause',
    value: function togglePause() {

      if (!this.isPaused) {

        this.pauseButtonActive = true;
        this.pause();
      } else {

        this.pauseButtonActive = false;
        this.play();
      }
    }
  }, {
    key: 'pause',
    value: function pause() {

      this.isPaused = true;
      HTMLControl.animation.playButton.classList.remove('hide');
      HTMLControl.animation.pauseButton.classList.add('hide');
    }
  }, {
    key: 'play',
    value: function play() {

      this.isPaused = false;
      HTMLControl.animation.playButton.classList.add('hide');
      HTMLControl.animation.pauseButton.classList.remove('hide');
    }
  }, {
    key: 'initSlider',
    value: function initSlider() {
      var _this3 = this;

      this.sliderMouseDownEvent = function (e) {

        if (!_this3.pauseButtonActive) _this3.pause();
      };

      HTMLControl.animation.slider.addEventListener('mousedown', this.sliderMouseDownEvent, false);

      this.sliderInputEvent = lodash_throttle(function (e) {

        var oldTime = _this3.currentMixer.time;
        var newTime = HTMLControl.animation.slider.value;

        _this3.currentMixer.update(newTime - oldTime);
      }, 17);

      HTMLControl.animation.slider.addEventListener('input', this.sliderInputEvent, false); // throttling at ~17 ms will give approx 60fps while sliding the controls

      this.sliderMouseupEvent = function (e) {

        if (!_this3.pauseButtonActive) _this3.play();
      };

      HTMLControl.animation.slider.addEventListener('mouseup', this.sliderMouseupEvent, false);
    }
  }, {
    key: 'initSelectionMenu',
    value: function initSelectionMenu() {
      var _this4 = this;

      HTMLControl.animation.clipsSelection.selectedIndex = 1;

      this.clipsChangeEvent = function (e) {

        e.preventDefault();
        if (e.target.value === 'static') {

          _this4.currentAction.stop();
        } else {

          _this4.selectCurrentAnimation(e.target.value);
        }
      };

      HTMLControl.animation.clipsSelection.addEventListener('change', this.clipsChangeEvent, false);
    }
  }, {
    key: 'initExportAnims',
    value: function initExportAnims() {
      var _this5 = this;

      HTMLControl.exportAnims.addEventListener('click', function (e) {

        e.preventDefault();

        if (_this5.clips.length === 0) return;

        exportAsJSON(_this5.currentClip);
      }, false);
    }
  }]);
  return AnimationControls;
}();

var backgroundVert = "#define GLSLIFY 1\nattribute vec3 position;\nvarying vec2 uv;\nvoid main() {\n\tgl_Position = vec4( vec3( position.x, position.y, 1.0 ), 1.0 );\n\tuv = vec2(position.x, position.y) * 0.5;\n}\n";

var backgroundFrag = "precision mediump float;\n#define GLSLIFY 1\nuniform vec3 color1;\nuniform vec3 color2;\nuniform float vignetteAmount;\nuniform float mixAmount;\nuniform vec2 smooth;\nuniform sampler2D noiseTexture;\nvarying vec2 uv;\nvoid main() {\n\tfloat dst = length( uv );\n\tvec3 color = mix( color1, color2, dst );\n  vec2 texSize = vec2( 0.25, 0.25 );\n  vec2 phase = fract(  uv / texSize );\n\tvec3 noise = mix( color, texture2D( noiseTexture, phase ).rgb, mixAmount );\n\tvec4 col = vec4( mix( noise, vec3( vignetteAmount ), dot( uv, uv ) ), 1.0 );\n\tgl_FragColor = col;\n}";

var Background = function () {
  function Background(app) {
    classCallCheck(this, Background);


    this.app = app;

    this.initMaterials();
    this.initMesh();
    this.initButton();

    this.lightControls();
  }

  createClass(Background, [{
    key: 'initMesh',
    value: function initMesh() {

      var geometry = new THREE.PlaneBufferGeometry(2, 2, 1);
      var mesh = new THREE.Mesh(geometry, this.mat);

      this.app.camera.add(mesh);
    }
  }, {
    key: 'initMaterials',
    value: function initMaterials() {

      var loader = new THREE.TextureLoader();
      var noiseTexture = loader.load('/assets/images/textures/noise-256.jpg');
      noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

      this.colA = new THREE.Color(0xffffff);
      this.colB = new THREE.Color(0x283844);

      var uniforms = {
        color1: { value: this.colA },
        color2: { value: this.colB },
        noiseTexture: { value: noiseTexture },
        vignetteAmount: { value: 0 },
        mixAmount: { value: 0.08 }
      };

      this.mat = new THREE.RawShaderMaterial({

        uniforms: uniforms,
        // depthTest: false,
        // depthWrite: false,
        depthFunc: THREE.NeverDepth,
        vertexShader: backgroundVert,
        fragmentShader: backgroundFrag

      });
    }
  }, {
    key: 'initButton',
    value: function initButton() {
      var _this = this;

      var dark = false;

      HTMLControl.controls.toggleBackground.addEventListener('click', function (e) {

        e.preventDefault();
        if (!dark) {

          _this.mat.uniforms.mixAmount.value = 0.8;
          _this.mat.uniforms.vignetteAmount.value = -1.6;
          // this.colA.set( 0x283844 );
          // this.colB.set( 0xffffff );

          _this.darkControls();
        } else {

          _this.mat.uniforms.mixAmount.value = 0.08;
          _this.mat.uniforms.vignetteAmount.value = 0;
          // this.colA.set( 0xffffff );
          // this.colB.set( 0x283844 );

          _this.lightControls();
        }

        dark = !dark;
      }, false);
    }
  }, {
    key: 'darkControls',
    value: function darkControls() {

      HTMLControl.modelInfo.infoBox.style.color = 'white';

      for (var i = 0; i < HTMLControl.controls.links.length; i++) {

        HTMLControl.controls.links[i].style.color = 'white';
      }

      for (var _i = 0; _i < HTMLControl.controls.sliders.length; _i++) {

        HTMLControl.controls.sliders[_i].classList.remove('light-slider');
        HTMLControl.controls.sliders[_i].classList.add('dark-slider');
      }
    }
  }, {
    key: 'lightControls',
    value: function lightControls() {

      HTMLControl.modelInfo.infoBox.style.color = 'black';

      for (var i = 0; i < HTMLControl.controls.links.length; i++) {

        HTMLControl.controls.links[i].style.color = 'black';
      }

      for (var _i2 = 0; _i2 < HTMLControl.controls.sliders.length; _i2++) {

        HTMLControl.controls.sliders[_i2].classList.remove('dark-slider');
        HTMLControl.controls.sliders[_i2].classList.add('light-slider');
      }
    }
  }]);
  return Background;
}();

var Environment = function () {
  function Environment(materials) {
    classCallCheck(this, Environment);


    this.materials = materials;

    this.loadMaps();
    this.initButton();
  }

  createClass(Environment, [{
    key: 'loadMaps',
    value: function loadMaps() {

      this.maps = [];

      var textureLoader = new THREE.TextureLoader();
      var mapA = textureLoader.load('/assets/images/textures/env_maps/test_env_map.jpg');
      mapA.mapping = THREE.EquirectangularReflectionMapping;
      mapA.magFilter = THREE.LinearFilter;
      mapA.minFilter = THREE.LinearMipMapLinearFilter;

      this.maps.push(mapA);

      var r = '/assets/images/textures/cube_maps/Bridge2/';
      var urls = [r + 'posx.jpg', r + 'negx.jpg', r + 'posy.jpg', r + 'negy.jpg', r + 'posz.jpg', r + 'negz.jpg'];

      var mapB = new THREE.CubeTextureLoader().load(urls);
      mapB.format = THREE.RGBFormat;
      mapB.mapping = THREE.CubeReflectionMapping;

      this.maps.push(mapB);
    }
  }, {
    key: 'initButton',
    value: function initButton() {
      var _this = this;

      var mapNum = 0;

      HTMLControl.controls.toggleEnvironment.addEventListener('click', function (e) {

        e.preventDefault();

        var map = _this.maps[mapNum % _this.maps.length];

        mapNum++;

        _this.materials.forEach(function (material) {

          if (material.reflectivity !== undefined) material.reflectivity = 0.5;
          if (material.envMapIntensity !== undefined) material.envMapIntensity = 0.5;
          if (material.envMap !== undefined) material.envMap = map;
          material.needsUpdate = true;
        });
      });
    }
  }, {
    key: 'default',
    value: function _default() {
      var _this2 = this;

      this.materials.forEach(function (material) {

        if (material.reflectivity !== undefined) material.reflectivity = 0.25;
        if (material.envMapIntensity !== undefined) material.envMapIntensity = 0.25;
        if (material.envMap !== undefined) material.envMap = _this2.maps[0];
        material.needsUpdate = true;
      });
    }
  }]);
  return Environment;
}();

var Lighting = function () {
  function Lighting(app) {
    classCallCheck(this, Lighting);


    this.app = app;

    this.initLights();

    this.initSlider();

    this.initialStrength = this.light.intensity;

    HTMLControl.lighting.slider.value = String(this.light.intensity);
  }

  createClass(Lighting, [{
    key: 'initLights',
    value: function initLights() {

      var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      this.app.scene.add(ambientLight);

      // const backLight = new THREE.DirectionalLight( 0xffffff, 0.325 );
      // backLight.position.set( 2.6, 1, 3 );

      // const keyLight = new THREE.DirectionalLight( 0xffffff, 0.475 );
      // keyLight.position.set( -2, -1, 0 );

      // this.app.scene.add( backLight, keyLight );


      // this.light = new THREE.DirectionalLight( 0xffffff, 1.2 );
      this.light = new THREE.PointLight(0xffffff, 1.2);

      this.app.camera.add(this.light);
      this.app.scene.add(this.app.camera);
    }
  }, {
    key: 'initSlider',
    value: function initSlider() {
      var _this = this;

      this.sliderInputEvent = lodash_throttle(function (e) {

        e.preventDefault();
        _this.light.intensity = HTMLControl.lighting.slider.value;
      }, 100);

      HTMLControl.lighting.slider.addEventListener('input', this.sliderInputEvent, false);

      this.symbolClickEvent = lodash_throttle(function (e) {

        e.preventDefault();
        _this.reset();
      }, 100);

      HTMLControl.lighting.symbol.addEventListener('click', this.symbolClickEvent, false);
    }
  }, {
    key: 'reset',
    value: function reset() {

      this.light.intensity = this.initialStrength;
      HTMLControl.lighting.slider.value = String(this.light.intensity);

      // HTMLControl.lighting.slider.removeEventListener( 'input', this.sliderInputEvent, false );
      // HTMLControl.lighting.symbol.removeEventListener( 'click', this.symbolClickEvent, false );
    }
  }]);
  return Lighting;
}();

var Screenshot = function () {
  function Screenshot(app) {
    classCallCheck(this, Screenshot);


    this.camera = app.camera;
    this.scene = app.scene;
    this.renderer = app.renderer;

    this.initButton();
  }

  createClass(Screenshot, [{
    key: 'initButton',
    value: function initButton() {
      var _this = this;

      HTMLControl.screenshot.button.addEventListener('click', lodash_throttle(function (e) {

        e.preventDefault();

        _this.takeScreenshot();
      }, 1000), false);
    }

    // take a screenshot at a given width and height
    // and return an img element

  }, {
    key: 'takeScreenshot',
    value: function takeScreenshot() {

      // render scene
      this.renderer.render(this.scene, this.camera, null, false);

      var dataURL = this.renderer.domElement.toDataURL('image/png');

      var iframe = '\n      <iframe\n        src="' + dataURL + '"\n        frameborder="0"\n        style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;"\n        allowfullscreen>\n      </iframe>';

      var win = window.open();
      win.document.open();
      win.document.write(iframe);
      win.document.close();
    }
  }]);
  return Screenshot;
}();

var Grid = function () {
  function Grid(app) {
    classCallCheck(this, Grid);


    this.app = app;

    this.size = 0;

    this.gridHelper = new THREE.GridHelper();
    this.axesHelper = new THREE.AxesHelper();

    this.helpers = new THREE.Group();

    this.helpers.add(this.gridHelper, this.axesHelper);
    this.helpers.visible = false;

    this.initButton();
  }

  createClass(Grid, [{
    key: 'setSize',
    value: function setSize() {

      this.size = Math.floor(this.app.camera.far * 0.5);
      if (this.size % 2 !== 0) this.size++;
      this.updateGrid();
      this.updateAxes();
    }
  }, {
    key: 'updateGrid',
    value: function updateGrid() {

      var gridHelper = new THREE.GridHelper(this.size, 10);
      this.helpers.remove(this.gridHelper);
      this.gridHelper = gridHelper;
      this.helpers.add(this.gridHelper);
    }
  }, {
    key: 'updateAxes',
    value: function updateAxes() {

      var axesHelper = new THREE.AxesHelper(this.size / 2);
      this.helpers.remove(this.axesHelper);
      this.axesHelper = axesHelper;
      this.helpers.add(this.axesHelper);
    }
  }, {
    key: 'initButton',
    value: function initButton() {
      var _this = this;

      HTMLControl.controls.toggleGrid.addEventListener('click', function (e) {

        e.preventDefault();

        _this.setSize();
        _this.helpers.visible = !_this.helpers.visible;
      });
    }
  }]);
  return Grid;
}();

var Info = function () {
  function Info(app, objects) {
    classCallCheck(this, Info);


    this.renderer = app.renderer;
    this.objects = objects;
    this.modelInfo = this.boundingBox = new THREE.Box3();

    this.initButton();
  }

  createClass(Info, [{
    key: 'update',
    value: function update() {

      this.boundingBox.expandByObject(this.objects);

      var depth = Math.abs(this.boundingBox.max.z - this.boundingBox.min.z);
      var width = Math.abs(this.boundingBox.max.x - this.boundingBox.min.x);
      var height = Math.abs(this.boundingBox.max.y - this.boundingBox.min.y);

      HTMLControl.modelInfo.bbDepth.innerHTML = depth.toPrecision(4);
      HTMLControl.modelInfo.bbWidth.innerHTML = width.toPrecision(4);
      HTMLControl.modelInfo.bbHeight.innerHTML = height.toPrecision(4);

      HTMLControl.modelInfo.faces.innerHTML = this.renderer.info.render.faces;
      HTMLControl.modelInfo.vertices.innerHTML = this.renderer.info.render.vertices;
    }
  }, {
    key: 'initButton',
    value: function initButton() {

      HTMLControl.controls.toggleInfo.addEventListener('click', function (e) {

        e.preventDefault();

        HTMLControl.modelInfo.infoBox.classList.toggle('hide');
      });
    }
  }]);
  return Info;
}();

(function(self) {
  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    };

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue+','+value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) { items.push(name); });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) { items.push(value); });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) { items.push([name, value]); });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = 'status' in options ? options.status : 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : undefined);

var loadingManager = new THREE.LoadingManager();

var percentComplete = 0;

var timerID = null;

// hide the upload form when loading starts so that the progress bar can be shown
loadingManager.onStart = function () {

  // prevent onStart being called multiple times
  if (timerID !== null) return;

  HTMLControl.setOnLoadStartState();

  timerID = setInterval(function () {

    percentComplete += 5;

    if (percentComplete >= 100) {

      clearInterval(timerID);
    } else {

      HTMLControl.loading.progress.style.width = percentComplete + '%';
    }
  }, 100);
};

loadingManager.onLoad = function () {

  HTMLControl.setOnLoadEndState();
  clearInterval(timerID);
};

loadingManager.onProgress = function () {

  if (percentComplete >= 100) return;

  percentComplete += 1;

  HTMLControl.loading.progress.style.width = percentComplete + '%';
};

loadingManager.onError = function (msg) {

  console.error(msg);
};

function readFileAs(file, as) {
  if (!(file instanceof Blob)) {
    throw new TypeError('Must be a File or Blob');
  }
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function (e) {
      resolve(e.target.result);
    };
    reader.onerror = function (e) {
      reject(new Error('Error reading' + file.name + ': ' + e.target.result));
    };
    reader['readAs' + as](file);
  });
}

THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

var objectLoader = null;
var bufferGeometryLoader = null;
var jsonLoader = null;
var fbxLoader = null;
var gltfLoader = null;
var objLoader = null;
var mtlLoader = null;
var colladaLoader = null;

var objLoaderInternal = null;

var promisifyLoader = function promisifyLoader(loader) {
  return function (url) {
    return new Promise(function (resolve, reject) {

      loader.load(url, resolve, loadingManager.onProgress, reject);
    });
  };
};

var Loaders = function Loaders() {
  classCallCheck(this, Loaders);


  return {

    get objectLoader() {
      if (objectLoader === null) {
        objectLoader = promisifyLoader(new THREE.ObjectLoader(loadingManager));
      }
      return objectLoader;
    },

    get bufferGeometryLoader() {
      if (bufferGeometryLoader === null) {
        bufferGeometryLoader = promisifyLoader(new THREE.BufferGeometryLoader(loadingManager));
      }
      return bufferGeometryLoader;
    },

    get jsonLoader() {
      if (jsonLoader === null) {
        jsonLoader = promisifyLoader(new THREE.JSONLoader(loadingManager));
      }
      return jsonLoader;
    },

    get fbxLoader() {
      if (fbxLoader === null) {
        fbxLoader = promisifyLoader(new THREE.FBXLoader(loadingManager));
      }
      return fbxLoader;
    },

    get gltfLoader() {
      if (gltfLoader === null) {
        gltfLoader = promisifyLoader(new THREE.GLTFLoader(loadingManager));
      }
      return gltfLoader;
    },

    get objLoader() {

      if (objLoaderInternal === null) {

        objLoaderInternal = new THREE.OBJLoader(loadingManager);

        objLoader = promisifyLoader(objLoaderInternal);

        objLoader.setMaterials = function (materials) {

          objLoaderInternal.setMaterials(materials);
        };
      }

      return objLoader;
    },

    get mtlLoader() {
      if (mtlLoader === null) {

        mtlLoader = promisifyLoader(new THREE.MTLLoader(loadingManager));
      }
      return mtlLoader;
    },

    get colladaLoader() {
      if (colladaLoader === null) {
        colladaLoader = promisifyLoader(new THREE.ColladaLoader(loadingManager));
      }
      return colladaLoader;
    }

  };
};

var loaders = new Loaders();
var defaultMat = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x000000 });

var OnLoadCallbacks = function () {
  function OnLoadCallbacks() {
    classCallCheck(this, OnLoadCallbacks);
  }

  createClass(OnLoadCallbacks, null, [{
    key: 'onJSONLoad',
    value: function onJSONLoad(file, originalFile) {
      var _this = this;

      var json = JSON.parse(file);

      if (json.metadata && json.metadata.type) {

        var type = json.metadata.type.toLowerCase();

        readFileAs(originalFile, 'DataURL').then(function (data) {

          if (type === 'buffergeometry') _this.onJSONBufferGeometryLoad(data);else if (type === 'geometry') _this.onJSONGeometryLoad(data);else if (type === 'object') _this.onJSONObjectLoad(data);
        }).catch(function (err) {
          return console.error(err);
        });
      } else {

        console.error('Error: Invalid JSON file.');
      }
    }
  }, {
    key: 'onJSONBufferGeometryLoad',
    value: function onJSONBufferGeometryLoad(file) {

      console.log('Using THREE.BufferGeometryLoader');

      var promise = loaders.bufferGeometryLoader(file);
      promise.then(function (geometry) {

        console.log(geometry);

        var object = new THREE.Mesh(geometry, defaultMat);
        main.addObjectToScene(object);
      }).catch(function (err) {

        console.log(err);
      });

      return promise;
    }
  }, {
    key: 'onJSONGeometryLoad',
    value: function onJSONGeometryLoad(file) {

      console.log('Using THREE.JSONLoader');

      var promise = loaders.jsonLoader(file);
      promise.then(function (geometry) {

        console.log(geometry);

        var object = new THREE.Mesh(geometry, defaultMat);
        main.addObjectToScene(object);
      }).catch(function (err) {

        console.log(err);
      });

      return promise;
    }
  }, {
    key: 'onJSONObjectLoad',
    value: function onJSONObjectLoad(file) {

      console.log('Using THREE.ObjectLoader');

      var promise = loaders.objectLoader(file);
      promise.then(function (object) {

        console.log(object);

        main.addObjectToScene(object);
      }).catch(function (err) {

        console.log(err);
      });

      return promise;
    }
  }, {
    key: 'onFBXLoad',
    value: function onFBXLoad(file) {

      console.log('Using THREE.FBXLoader');

      var promise = loaders.fbxLoader(file);

      promise.then(function (object) {

        console.log(object);

        main.addObjectToScene(object);
      }).catch(function (err) {

        console.log(err);
      });

      return promise;
    }
  }, {
    key: 'onGLTFLoad',
    value: function onGLTFLoad(file) {

      var promise = new Promise(function (resolve, reject) {});

      console.log('Using THREE.GLTFLoader');

      promise = loaders.gltfLoader(file);

      promise.then(function (gltf) {

        console.log(gltf);

        if (gltf.scenes.length > 1) {

          gltf.scenes.forEach(function (scene) {

            if (gltf.animations) scene.animations = gltf.animations;
            main.addObjectToScene(scene);
          });
        } else if (gltf.scene) {

          if (gltf.animations) gltf.scene.animations = gltf.animations;
          main.addObjectToScene(gltf.scene);
        } else {

          console.error('No scene found in GLTF file.');
        }
      }).catch(function (err) {

        console.log(err);
      });

      return promise;
    }
  }, {
    key: 'onMTLLoad',
    value: function onMTLLoad(file) {

      var promise = new Promise(function (resolve, reject) {});

      promise = loaders.mtlLoader(file);

      return promise;
    }
  }, {
    key: 'onOBJLoad',
    value: function onOBJLoad(file, materials) {

      var promise = new Promise(function (resolve, reject) {});

      loaders.objLoader.setMaterials(materials);

      promise = loaders.objLoader(file);

      promise.then(function (object) {

        console.log(object);

        main.addObjectToScene(object);
      }).catch(function (err) {

        console.log(err);
      });

      return promise;
    }
  }, {
    key: 'onDAELoad',
    value: function onDAELoad(file) {

      var promise = new Promise(function (resolve) {});

      // no need for this as ColladaLoader2 reports plenty of information
      // console.log( 'Using THREE.ColladaLoader2' );

      promise = loaders.colladaLoader(file);

      promise.then(function (object) {

        console.log(object);

        var scene = object.scene;

        if (object.animations && object.animations.length > 0) scene.animations = object.animations;

        main.addObjectToScene(scene);
      }).catch(function (err) {

        console.log(err);
      });

      return promise;
    }
  }]);
  return OnLoadCallbacks;
}();

var checkForFileAPI = function checkForFileAPI() {

  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {

    console.error('This loader requires the File API. Please upgrade your browser');
  }
};

checkForFileAPI();

var isAsset = function isAsset(type) {
  return new RegExp('(png|jpg|jpeg|gif|bmp|dds|tga|bin|vert|frag|txt|mtl)$').test(type);
};

var isModel = function isModel(type) {
  return new RegExp('(json|js|fbx|gltf|glb|dae|obj)$').test(type);
};

var isValid = function isValid(type) {
  return isAsset(type) || isModel(type);
};

var models = [];
var assets = {};
var promises = [];

var loadFile = function loadFile(details) {

  var file = details[0];
  var type = details[1];
  var originalFile = details[2];

  switch (type) {

    case 'fbx':
      loadingManager.onStart();
      OnLoadCallbacks.onFBXLoad(file);
      break;
    case 'gltf':
    case 'glb':
      loadingManager.onStart();
      OnLoadCallbacks.onGLTFLoad(file);
      break;
    case 'obj':
      loadingManager.onStart();
      OnLoadCallbacks.onMTLLoad(assets[originalFile.name.replace('.obj', '.mtl')]).then(function (materials) {

        OnLoadCallbacks.onOBJLoad(file, materials);
      }).catch(function (err) {
        return console.error(err);
      });
      break;
    case 'dae':
      loadingManager.onStart();
      OnLoadCallbacks.onDAELoad(file);
      break;
    case 'json':
    case 'js':
      loadingManager.onStart();
      OnLoadCallbacks.onJSONLoad(file, originalFile);
      break;
    default:
      console.error('Unsupported file type ' + type + ' - please load one of the supported model formats.');
  }
};

loadingManager.setURLModifier(function (url) {

  if (url[url.length - 3] === '.' || url[url.length - 4] === '.') {

    var type = url.split('.').pop().toLowerCase();

    if (isAsset(type)) {

      url = url.replace('data:application/', '');
      url = url.split('/');
      url = url[url.length - 1];
    }
  }

  if (assets[url] === undefined) return url;
  return assets[url];
});

var processFile = function processFile(file) {

  var type = file.name.split('.').pop().toLowerCase();

  if (!isValid(type)) return;

  if (type === 'js' || type === 'json') {

    var promise = readFileAs(file, 'Text').then(function (data) {
      models.push([data, type, file]);
    }).catch(function (err) {
      return console.error(err);
    });

    promises.push(promise);
  } else {

    var _promise = readFileAs(file, 'DataURL').then(function (data) {

      if (isModel(type)) {

        if (type === 'obj') models.push([data, type, file]);else models.push([data, type]);
      } else if (isAsset(type)) {

        assets[file.name] = data;
      }
    }).catch(function (err) {
      return console.error(err);
    });

    promises.push(_promise);
  }
};

var processFiles = function processFiles(files) {

  models = [];
  assets = {};
  promises = [];

  for (var i = 0; i < files.length; i++) {

    processFile(files[i]);
  }

  Promise.all(promises).then(function () {

    models.forEach(function (model) {
      return loadFile(model);
    });
  }).catch(function (err) {
    return console.error(err);
  });
};

var form = HTMLControl.fileUpload.form;
var button = HTMLControl.fileUpload.button;

button.addEventListener('click', function (e) {

  e.preventDefault();
  HTMLControl.fileUpload.input.click();
}, false);

HTMLControl.fileUpload.input.addEventListener('change', function (e) {

  e.preventDefault();

  var files = e.target.files;

  processFiles(files);
}, false);

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
  return form.addEventListener(event, function (e) {

    e.preventDefault();
    e.stopPropagation();
  });
});

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
  return document.addEventListener(event, function (e) {

    e.preventDefault();
    e.stopPropagation();
  });
});

['dragover', 'dragenter'].forEach(function (event) {
  return form.addEventListener(event, function () {

    form.classList.add('border');
    button.classList.add('highlight');
  });
});

['dragend', 'dragleave', 'drop'].forEach(function (event) {
  return form.addEventListener(event, function () {

    form.classList.remove('border');
    button.classList.remove('highlight');
  });
});

HTMLControl.fileUpload.form.addEventListener('drop', function (e) {

  var files = e.dataTransfer.files;

  processFiles(files);
});

HTMLControl.controls.exampleDuck.addEventListener('click', function (e) {

  e.preventDefault();

  loadingManager.onStart();
  OnLoadCallbacks.onGLTFLoad('/assets/models/loader/Duck.gltf');
});

// saving function taken from three.js editor
var link$1 = document.createElement('a');
link$1.style.display = 'none';
document.body.appendChild(link$1); // Firefox workaround, see #6594

var save$1 = function save(blob, filename) {

  link$1.href = URL.createObjectURL(blob);
  link$1.download = filename || 'data.json';
  link$1.click();
};

var saveString$1 = function saveString(text, filename) {

  save$1(new Blob([text], { type: 'text/plain' }), filename);
};

function exportGLTF(input) {

  var gltfExporter = new THREE.GLTFExporter();

  var options = {
    trs: false,
    onlyVisible: true,
    truncateDrawRange: true,
    binary: false,
    embedImages: true
  };

  console.log(input);

  gltfExporter.parse(input.children[0].children[0], function (result) {

    // if ( result instanceof ArrayBuffer ) {

    //   saveArrayBuffer( result, 'scene.glb' );

    // } else {

    var output = JSON.stringify(result, null, 2);
    saveString$1(output, 'blackThreadGLTF.gltf');

    // }
  }, options);
}

THREE.Cache.enabled = true;

var Main = function () {
  function Main(canvas) {
    classCallCheck(this, Main);


    var self = this;

    this.canvas = canvas;

    this.app = new App(this.canvas);

    // this.app.renderer.setClearColor( 0xf7f7f7, 1.0 );

    this.animationControls = new AnimationControls();

    // Put any per frame calculation here
    this.app.onUpdate = function () {
      // NB: use self inside this function

      self.animationControls.update(self.app.delta);
    };

    // put any per resize calculations here (throttled to once per 250ms)
    this.app.onWindowResize = function () {

      // NB: use self inside this function

    };

    this.loadedObjects = new THREE.Group();
    this.loadedMaterials = [];
    this.app.scene.add(this.loadedObjects);

    this.lighting = new Lighting(this.app);
    this.grid = new Grid(this.app);
    this.background = new Background(this.app);
    this.environment = new Environment(this.loadedMaterials);
    this.info = new Info(this.app, this.loadedObjects);

    this.app.scene.add(this.grid.helpers);

    this.app.initControls();

    this.screenshotHandler = new Screenshot(this.app);

    this.initReset();
    this.initExport();
  }

  createClass(Main, [{
    key: 'addObjectToScene',
    value: function addObjectToScene(object) {
      var _this = this;

      if (object === undefined) {

        console.error('Oops! An unspecified error occurred :(');
        return;
      }

      this.animationControls.initAnimation(object);

      this.loadedObjects.add(object);

      // fit camera to all loaded objects
      this.app.fitCameraToObject(this.loadedObjects, 0.9);

      this.app.play();

      this.info.update();

      this.loadedObjects.traverse(function (child) {

        if (child.material !== undefined) {

          _this.loadedMaterials.push(child.material);
        }
      });

      this.environment.default();
    }
  }, {
    key: 'initExport',
    value: function initExport() {
      var _this2 = this;

      HTMLControl.controls.exportGLTF.addEventListener('click', function (e) {

        e.preventDefault();

        exportGLTF(_this2.loadedObjects);
      });
    }
  }, {
    key: 'initReset',
    value: function initReset() {
      var _this3 = this;

      HTMLControl.reset.addEventListener('click', function () {

        while (_this3.loadedObjects.children.length > 0) {

          var child = _this3.loadedObjects.children[0];

          _this3.loadedObjects.remove(child);
          child = null;
        }

        _this3.loadedMaterials = [];

        _this3.animationControls.reset();
        _this3.lighting.reset();
        HTMLControl.setInitialState();
      });
    }
  }]);
  return Main;
}();

var main = new Main(HTMLControl.canvas);

}());
