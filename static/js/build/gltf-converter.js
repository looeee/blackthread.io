this['gltf-converter'] = this['gltf-converter'] || {};
(function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











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

var originalCanvas = document.querySelector('#original-preview-canvas');
var resultCanvas = document.querySelector('#result-preview-canvas');
var previews = document.querySelector('#previews');

var fullscreenButton = document.querySelector('#fullscreen-button');

var messages = document.querySelector('#messages');
var errors = document.querySelector('#errors');
var errorsContainer = document.querySelector('#errors-container');
var warnings = document.querySelector('#warnings');
var warningsContainer = document.querySelector('#warnings-container');
var logs = document.querySelector('#logs');
var logsContainer = document.querySelector('#logs-container');

var fileUpload = {
  input: document.querySelector('#file-upload-input'),
  button: document.querySelector('#file-upload-button'),
  form: document.querySelector('#file-upload-form')
};

var loading = {
  original: {
    bar: document.querySelector('#original-loading-bar'),
    overlay: document.querySelector('#original-loading-overlay'),
    progress: document.querySelector('#original-progress')
  },
  result: {
    bar: document.querySelector('#result-loading-bar'),
    overlay: document.querySelector('#result-loading-overlay'),
    progress: document.querySelector('#result-progress')
  }
};

var controls = {
  onlyVisible: document.querySelector('#option_visible'),
  binary: document.querySelector('#option_binary'),
  embedImages: document.querySelector('#option_embedImages'),
  animations: document.querySelector('#option_animations'),
  forceIndices: document.querySelector('#option_forceindices'),
  exportGLTF: document.querySelector('#export'),
  formatLabel: document.querySelector('#format_label')
};

var HTMLControl = function () {
  function HTMLControl() {
    classCallCheck(this, HTMLControl);
  }

  createClass(HTMLControl, null, [{
    key: 'setInitialState',
    value: function setInitialState() {

      controls.exportGLTF.disabled = true;
      loading.original.overlay.classList.remove('hide');
      loading.result.overlay.classList.remove('hide');
      loading.original.bar.classList.add('hide');
      loading.original.progress.style.width = 0;
      loading.result.bar.classList.add('hide');
      loading.result.progress.style.width = 0;
    }
  }, {
    key: 'setOnLoadStartState',
    value: function setOnLoadStartState() {

      controls.exportGLTF.disabled = true;
      loading.result.overlay.classList.remove('hide');
      loading.original.bar.classList.remove('hide');
      messages.classList.add('hide');
      errorsContainer.classList.add('hide');
      warningsContainer.classList.add('hide');
      logsContainer.classList.add('hide');
      errors.innerHTML = '';
      warnings.innerHTML = '';
      logs.innerHTML = '';
    }
  }, {
    key: 'setOnLoadEndState',
    value: function setOnLoadEndState() {

      loading.original.overlay.classList.add('hide');
    }
  }]);
  return HTMLControl;
}();

HTMLControl.originalCanvas = originalCanvas;
HTMLControl.resultCanvas = resultCanvas;
HTMLControl.fileUpload = fileUpload;
HTMLControl.loading = loading;
HTMLControl.controls = controls;
HTMLControl.previews = previews;
HTMLControl.fullscreenButton = fullscreenButton;
HTMLControl.messages = messages;
HTMLControl.errorsContainer = errorsContainer;
HTMLControl.errors = errors;
HTMLControl.warningsContainer = warningsContainer;
HTMLControl.warnings = warnings;
HTMLControl.logsContainer = logsContainer;
HTMLControl.logs = logs;

var originalError = console.warn.bind(console);

function log() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var rep = args.slice(1, args.length);
  var i = 0;

  if (typeof args[0] === 'string') {

    var output = args[0].replace(/%s/g, function (match, idx) {
      var subst = rep.slice(i, ++i);
      return subst;
    });

    return output;
  }

  return args[0];
}
console.error = function () {

  var msg = log.apply(undefined, arguments);

  if (!msg) return;

  HTMLControl.messages.classList.remove('hide');
  HTMLControl.errorsContainer.classList.remove('hide');
  var p = document.createElement('p');
  p.innerHTML = msg;
  HTMLControl.errors.append(p);

  originalError.apply(undefined, arguments);
};

var originalWarn = console.warn.bind(console);

console.warn = function () {

  var msg = log.apply(undefined, arguments);

  if (!msg) return;

  HTMLControl.messages.classList.remove('hide');
  HTMLControl.warningsContainer.classList.remove('hide');
  var p = document.createElement('p');
  p.innerHTML = msg;
  HTMLControl.warnings.append(p);

  originalWarn.apply(undefined, arguments);
};

var originalLog = console.log.bind(console);

console.log = function () {

  var msg = log.apply(undefined, arguments);

  if (!msg) return;

  if (typeof msg.indexOf === 'function') {
    if (msg.indexOf('THREE.WebGLRenderer') !== -1 || msg.indexOf('[object Object]')) return;
  }

  HTMLControl.messages.classList.remove('hide');
  HTMLControl.logsContainer.classList.remove('hide');
  var p = document.createElement('p');
  p.innerHTML = msg;
  HTMLControl.logs.append(p);

  originalLog.apply(undefined, arguments);
};

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
  goFullscreen(HTMLControl.previews);
}, false);

// import loadingManager from '../loadingManager.js';

var promisifyLoader = function promisifyLoader(loader, manager) {
  return function (url) {
    var parse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


    return new Promise(function (resolve, reject) {

      if (parse === true) loader.parse(url, '', resolve, reject);else loader.load(url, resolve, manager.onProgress, reject);
    });
  };
};

var loadingManager = new THREE.LoadingManager();

var percentComplete = 0;

var timerID = null;

// hide the upload form when loading starts so that the progress bar can be shown
loadingManager.onStart = function () {

  // prevent onStart being called multiple times
  // if ( timerID !== null ) return;
  HTMLControl.setOnLoadStartState();

  timerID = setInterval(function () {

    percentComplete += 5;

    if (percentComplete >= 100) {

      clearInterval(timerID);
    } else {

      HTMLControl.loading.original.progress.style.width = percentComplete + '%';
    }
  }, 100);
};

// loadingManager.onLoad = function ( ) {

//   console.log( 'loadingManager.onLoad ' )

//   HTMLControl.setOnLoadEndState();
//   clearInterval( timerID );

// };

loadingManager.onProgress = function () {

  if (percentComplete >= 100) return;

  percentComplete += 1;

  HTMLControl.loading.original.progress.style.width = percentComplete + '%';
};

loadingManager.onError = function (msg) {

  console.error(msg);
};

var bufferGeometryLoader = null;
var amfLoader = null;
var colladaLoader = null;
// let ctmLoader = null;
// let dracoLoader = null;
var fbxLoader = null;
var gltfLoader = null;
var jsonLoader = null;
// let kmzLoader = null;
var legacyGltfLoader = null;
// let mmdLoader = null;
var mtlLoader = null;
// let nrrdLoader = null;
var objectLoader = null;
var objLoader = null;
var pcdLoader = null;
var pdbLoader = null;
var plyLoader = null;
var pwrmLoader = null;
var stlLoader = null;
var threemfLoader = null;

// used for passing materials to objLoader
var objLoaderInternal = null;

var Loaders = function Loaders() {
  classCallCheck(this, Loaders);


  return {

    get amfLoader() {
      if (amfLoader === null) {
        amfLoader = promisifyLoader(new THREE.AMFLoader(loadingManager), loadingManager);
      }
      return amfLoader;
    },

    get bufferGeometryLoader() {
      if (bufferGeometryLoader === null) {
        bufferGeometryLoader = promisifyLoader(new THREE.BufferGeometryLoader(loadingManager), loadingManager);
      }
      return bufferGeometryLoader;
    },

    get colladaLoader() {
      if (colladaLoader === null) {

        colladaLoader = promisifyLoader(new THREE.ColladaLoader(loadingManager), loadingManager);
      }
      return colladaLoader;
    },

    // ctmLoader
    // get loaderName() {
    //   if ( loaderName === null ) {
    //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
    //   }
    //   return loaderName;
    // },

    // dracoLoader
    // get loaderName() {
    //   if ( loaderName === null ) {
    //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
    //   }
    //   return loaderName;
    // },

    // TODO: testing lazy load JS
    // get fbxLoader() {

    //   loadJavascript( '/js/vendor/three/examples/js/loaders/FBXLoader.min.js' ).then( () => {

    //     if ( fbxLoader === null ) fbxLoader = promisifyLoader( new THREE.FBXLoader( loadingManager ), loadingManager );

    //     return fbxLoader;

    //   } ).catch( ( err ) => { console.error( err ); } );

    // },

    get fbxLoader() {
      if (fbxLoader === null) {
        fbxLoader = promisifyLoader(new THREE.FBXLoader(loadingManager), loadingManager);
      }
      return fbxLoader;
    },

    get gltfLoader() {
      if (gltfLoader === null) {
        gltfLoader = promisifyLoader(new THREE.GLTFLoader(loadingManager), loadingManager);
      }
      return gltfLoader;
    },

    get jsonLoader() {
      if (jsonLoader === null) {
        jsonLoader = promisifyLoader(new THREE.JSONLoader(loadingManager), loadingManager);
      }
      return jsonLoader;
    },

    // kmzLoader
    // get loaderName() {
    //   if ( loaderName === null ) {
    //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
    //   }
    //   return loaderName;
    // },

    get legacyGltfLoader() {
      if (legacyGltfLoader === null) {
        legacyGltfLoader = promisifyLoader(new THREE.LegacyGLTFLoader(loadingManager), loadingManager);
      }
      return legacyGltfLoader;
    },

    // mmdLoader
    // get loaderName() {
    //   if ( loaderName === null ) {
    //     loaderName = promisifyLoader( new THREE.CAPLoader( loadingManager ), loadingManager );
    //   }
    //   return loaderName;
    // },

    get mtlLoader() {
      if (mtlLoader === null) {

        mtlLoader = promisifyLoader(new THREE.MTLLoader(loadingManager), loadingManager);
      }
      return mtlLoader;
    },

    // nrrdLoader
    // get loaderName() {
    //   if ( loaderName === null ) {
    //     loaderName = promisifyLoader( new THREE.NRRDLoader( loadingManager ), loadingManager );
    //   }
    //   return loaderName;
    // },

    get objectLoader() {
      if (objectLoader === null) {
        objectLoader = promisifyLoader(new THREE.ObjectLoader(loadingManager), loadingManager);
      }
      return objectLoader;
    },

    get objLoader() {

      if (objLoaderInternal === null) {

        objLoaderInternal = new THREE.OBJLoader(loadingManager);

        objLoader = promisifyLoader(objLoaderInternal, loadingManager);

        objLoader.setMaterials = function (materials) {

          objLoaderInternal.setMaterials(materials);
        };
      }

      return objLoader;
    },

    get pcdLoader() {
      if (pcdLoader === null) {
        pcdLoader = promisifyLoader(new THREE.PCDLoader(loadingManager), loadingManager);
      }
      return pcdLoader;
    },

    get pdbLoader() {
      if (pdbLoader === null) {
        pdbLoader = promisifyLoader(new THREE.PDBLoader(loadingManager), loadingManager);
      }
      return pdbLoader;
    },

    get plyLoader() {
      if (plyLoader === null) {
        plyLoader = promisifyLoader(new THREE.PLYLoader(loadingManager), loadingManager);
      }
      return plyLoader;
    },

    get pwrmLoader() {
      if (pwrmLoader === null) {
        pwrmLoader = promisifyLoader(new THREE.PWRMLoader(loadingManager), loadingManager);
      }
      return pwrmLoader;
    },

    get stlLoader() {
      if (stlLoader === null) {
        stlLoader = promisifyLoader(new THREE.STLLoader(loadingManager), loadingManager);
      }
      return stlLoader;
    },

    get threemfLoader() {
      if (threemfLoader === null) {
        threemfLoader = promisifyLoader(new THREE.ThreeMFLoader(loadingManager), loadingManager);
      }
      return threemfLoader;
    }

  };
};

var loaders = new Loaders();

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

var saveArrayBuffer = function saveArrayBuffer(buffer, filename) {

  save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
};

var stringByteLength = function stringByteLength(str) {
  // returns the byte length of an utf8 string
  var s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    var code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xDC00 && code <= 0xDFFF) i--; // trail surrogate
  }

  return s;
};

var ExportGLTF = function () {
  function ExportGLTF() {
    classCallCheck(this, ExportGLTF);


    this.loader = loaders.gltfLoader;

    this.sizeInfo = '';

    this.exporter = new THREE.GLTFExporter();
    this.initExportButton();
    this.initOptionListeners();
  }

  createClass(ExportGLTF, [{
    key: 'getOptions',
    value: function getOptions() {

      var options = {
        binary: HTMLControl.controls.binary.checked,
        animations: HTMLControl.controls.animations.checked,
        onlyVisible: HTMLControl.controls.onlyVisible.checked,
        embedImages: HTMLControl.controls.embedImages.checked,
        forceIndices: HTMLControl.controls.forceIndices.checked,
        truncateDrawRange: false, // probably can't load models with drawrange defined
        trs: false,
        forcePowerOfTwoTextures: true // facebook compatibility
      };

      if (options.animations && this.animations && this.animations.length > 0) options.animations = this.animations;

      return options;
    }
  }, {
    key: 'setInput',
    value: function setInput(input, animations, name) {

      this.input = input;
      this.animations = animations;
      this.name = name;
      this.parse();
    }
  }, {
    key: 'parse',
    value: function parse() {
      var _this = this;

      this.exporter.parse(this.input, function (result) {

        _this.result = result;
        _this.processResult(result);
      }, this.getOptions());
    }
  }, {
    key: 'loadPreview',
    value: function loadPreview() {

      main.resultPreview.reset();

      var promise = loaders.gltfLoader(this.output, true);

      promise.then(function (gltf) {

        HTMLControl.loading.result.overlay.classList.add('hide');
        HTMLControl.controls.exportGLTF.disabled = false;

        if (gltf.scenes.length > 1) {

          gltf.scenes.forEach(function (scene) {

            if (gltf.animations) scene.animations = gltf.animations;
            main.resultPreview.addObjectToScene(scene);
          });
        } else if (gltf.scene) {

          if (gltf.animations) gltf.scene.animations = gltf.animations;
          main.resultPreview.addObjectToScene(gltf.scene);
        }
      }).catch(function (err) {

        console.log(err);
        HTMLControl.loading.result.overlay.classList.remove('hide');
        HTMLControl.controls.exportGLTF.disabled = true;
      });
    }
  }, {
    key: 'processResult',
    value: function processResult() {

      this.setOutput();
      this.loadPreview();
    }
  }, {
    key: 'updateInfo',
    value: function updateInfo(byteLength) {

      var type = HTMLControl.controls.binary.checked ? 'GLB' : 'GLTF';

      if (byteLength) {

        this.sizeInfo = byteLength < 1000000 ? ' (' + Math.ceil(byteLength * 0.001) + 'kb)' : ' (' + (byteLength * 1e-6).toFixed(3) + 'mb)';
      }

      HTMLControl.controls.formatLabel.innerHTML = type === 'GLB' ? 'Binary (.glb)' : 'ASCII (.gltf)';

      HTMLControl.controls.exportGLTF.value = 'Export as ' + type + this.sizeInfo;
    }
  }, {
    key: 'setOutput',
    value: function setOutput() {

      if (this.result instanceof ArrayBuffer) {

        this.output = this.result;
        this.updateInfo(this.result.byteLength);
      } else {

        this.output = JSON.stringify(this.result, null, 2);
        this.updateInfo(stringByteLength(this.output));
      }
    }
  }, {
    key: 'save',
    value: function save() {

      if (this.output instanceof ArrayBuffer) {

        saveArrayBuffer(this.result, this.name + '.glb');
      } else {

        saveString(this.output, this.name + '.gltf');
      }
    }
  }, {
    key: 'initExportButton',
    value: function initExportButton() {
      var _this2 = this;

      HTMLControl.controls.exportGLTF.addEventListener('click', function (e) {

        e.preventDefault();

        if (_this2.output) _this2.save(_this2.output);
      });
    }
  }, {
    key: 'initOptionListeners',
    value: function initOptionListeners() {
      var _this3 = this;

      var onOptionChange = function onOptionChange(e) {

        e.preventDefault();
        _this3.updateInfo();

        if (_this3.input === undefined) return;

        _this3.parse();
      };

      HTMLControl.controls.binary.addEventListener('change', onOptionChange, false);
      HTMLControl.controls.animations.addEventListener('change', onOptionChange, false);
      HTMLControl.controls.onlyVisible.addEventListener('change', onOptionChange, false);
      HTMLControl.controls.embedImages.addEventListener('change', onOptionChange, false);
      HTMLControl.controls.forceIndices.addEventListener('change', onOptionChange, false);
    }
  }]);
  return ExportGLTF;
}();

var exportGLTF = new ExportGLTF();

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

var checkForFileAPI = function checkForFileAPI() {

  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {

    console.error('This loader requires the File API. Please upgrade your browser');
  }
};

checkForFileAPI();

var isAsset = function isAsset(type) {
  return new RegExp('(bin|bmp|frag|gif|jpeg|jpg|mtl|png|svg|vert)$').test(type);
};

var isModel = function isModel(type) {
  return new RegExp('(3mf|amf|ctm|dae|drc|fbx|gltf|glb|js|json|kmz|mmd|nrrd|obj|pcd|pdb|ply|pwrm|stl)$').test(type);
};

var isValid = function isValid(type) {
  return isAsset(type) || isModel(type);
};

var models = [];
var assets = {};
var promises = [];

var selectJSONLoader = function selectJSONLoader(file, name, originalFile) {
  var json = JSON.parse(file);

  if (json.metadata) {

    var type = '';
    if (json.metadata.type) type = json.metadata.type.toLowerCase();

    readFileAs(originalFile, 'DataURL').then(function (data) {

      if (type === 'buffergeometry') main.load(loaders.bufferGeometryLoader(data), name);else if (type === 'object') main.load(loaders.objectLoader(data), name);else main.load(loaders.jsonLoader(data), name);
    }).catch(function (err) {
      return console.error(err);
    });
  } else {

    console.error('Error: Invalid JSON file.');
  }
};

var loadFile = function loadFile(details) {

  var file = details[0];
  var name = details[1];
  var type = details[2];
  var originalFile = details[3];

  switch (type) {

    case '3mf':
      main.load(loaders.threemfLoader(file), name);
      break;
    case 'amf':
      main.load(loaders.amfLoader(file), name);
      break;
    case 'ctm':
      console.log('Support for ' + type + ' coming soon!');
      // main.load( loaders.ctmLoader( file ), name );
      break;
    case 'dae':
      main.load(loaders.colladaLoader(file), name);
      break;
    case 'drc':
      console.log('Support for ' + type + ' coming soon!');
      // main.load( loaders.dracoLoader( file ), name );
      break;
    case 'fbx':
      main.load(loaders.fbxLoader(file), name);
      break;
    case 'gltf':
    case 'glb':
      main.load(loaders.gltfLoader(file), name, file);
      break;
    case 'json':
    case 'js':
      selectJSONLoader(file, name, originalFile);
      break;
    case 'kmz':
      console.log('Support for ' + type + ' coming soon!');
      // main.load( loaders.kmzLoader( file ), name );
      break;
    case 'mmd':
      // console.log( 'Support for ' + type + ' coming soon!' );
      // main.load( loaders.mmdLoader( file ), name );
      break;
    case 'nrrd':
      console.log('Support for ' + type + ' coming soon!');
      // main.load( loaders.nrrdLoader( file ), name );
      break;
    case 'obj':
      loaders.mtlLoader(assets[originalFile.name.replace('.obj', '.mtl')]).then(function (materials) {

        loaders.objLoader.setMaterials(materials);
        return main.load(loaders.objLoader(file), name);
      }).catch(function (err) {
        return console.error(err);
      });
      break;
    case 'pcd':
      main.load(loaders.pcdLoader(file), name);
      break;
    case 'pdb':
      console.log('Support for ' + type + ' coming soon!');
      // main.load( loaders.pdbLoader( file ), name );
      break;
    case 'ply':
      main.load(loaders.plyLoader(file), name);
      break;
    case 'pwrm':
      console.log('Support for ' + type + ' coming soon!');
      // main.load( loaders.pwrmLoader( file ), name );
      break;
    case 'stl':
      // console.log( 'Support for ' + type + ' coming soon!' );
      main.load(loaders.stlLoader(file), name);
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

  var name = file.name.split('/').pop().split('.')[0];
  var type = file.name.split('.').pop().toLowerCase();

  if (!isValid(type)) return;

  if (type === 'js' || type === 'json') {

    var promise = readFileAs(file, 'Text').then(function (data) {
      models.push([data, name, type, file]);
    }).catch(function (err) {
      return console.error(err);
    });

    promises.push(promise);
  } else {

    var _promise = readFileAs(file, 'DataURL').then(function (data) {

      if (isModel(type)) {

        if (type === 'obj') models.push([data, name, type, file]);else models.push([data, name, type]);
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

    // form.classList.add( 'border' );
    button.style.background = '#B82601';
  });
});

['dragend', 'dragleave', 'drop'].forEach(function (event) {
  return form.addEventListener(event, function () {

    // form.classList.remove( 'border' );
    button.style.background = '#062f4f';
  });
});

HTMLControl.fileUpload.form.addEventListener('drop', function (e) {

  var files = e.dataTransfer.files;

  processFiles(files);
});

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

function App(canvas) {

  var _scene = void 0;
  var _camera = void 0;
  var _renderer = void 0;

  var _currentAnimationFrameID = void 0;

  var self = this;

  if (canvas !== undefined) this.canvas = canvas;else console.warn('Canvas is undefined! ');

  this.autoRender = true;

  this.autoResize = true;

  this.frameCount = 0;

  this.delta = 0;

  this.isPlaying = false;
  this.isPaused = false;

  this.time = new Time();

  var setRendererSize = function setRendererSize() {

    if (_renderer) _renderer.setSize(self.canvas.clientWidth, self.canvas.clientHeight, false);
  };

  var setCameraAspect = function setCameraAspect() {

    if (_camera) {
      _camera.aspect = self.canvas.clientWidth / self.canvas.clientHeight;
      _camera.updateProjectionMatrix();
    }
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

    var center = boundingBox.getCenter(new THREE.Vector3());
    var size = boundingBox.getSize(new THREE.Vector3());

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

var AnimationControls = function () {
  function AnimationControls() {
    classCallCheck(this, AnimationControls);


    this.isPaused = false;
    this.pauseButtonActive = false;

    this.clips = [];
    this.mixers = [];
    this.actions = [];
    this.animationNames = [];
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

      // HTMLControl.animation.playbackControl.removeEventListener( 'click', this.playPause, false );
      // HTMLControl.animation.slider.removeEventListener( 'mousedown', this.sliderMouseDownEvent, false );
      // HTMLControl.animation.slider.removeEventListener( 'input', this.sliderInputEvent, false );
      // HTMLControl.animation.slider.removeEventListener( 'mouseup', this.sliderMouseupEvent, false );
      // HTMLControl.animation.clipsSelection.removeEventListener( 'change', this.clipsChangeEvent, false );
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

        // HTMLControl.animation.clipsSelection.appendChild( new Option( animation.name, animation.name ) );
      });

      // If all animations have been skipped, return
      if (this.animationNames.length === 0) return;

      this.selectCurrentAnimation(this.animationNames[0]);

      // HTMLControl.animation.controls.classList.remove( 'hide' );

      // this.initPlayPauseControls();

      // this.initSlider();

      // this.initSelectionMenu();
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
        // HTMLControl.animation.slider.max = String( this.currentClip.duration );

        // HTMLControl.animation.slider.step = String( this.currentClip.duration / 150 );

        this.currentAction.play();
      }
    }
  }, {
    key: 'setSliderValue',
    value: function setSliderValue(val) {

      // HTMLControl.animation.slider.value = String( val );

    }
  }, {
    key: 'initPlayPauseControls',
    value: function initPlayPauseControls() {
      var _this2 = this;

      this.playPause = function (e) {

        e.preventDefault();

        _this2.togglePause();
      };

      // HTMLControl.animation.playbackControl.addEventListener( 'click', this.playPause, false );
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
      // HTMLControl.animation.playButton.classList.remove( 'hide' );
      // HTMLControl.animation.pauseButton.classList.add( 'hide' );
    }
  }, {
    key: 'play',
    value: function play() {

      this.isPaused = false;
      // HTMLControl.animation.playButton.classList.add( 'hide' );
      // HTMLControl.animation.pauseButton.classList.remove( 'hide' );
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

    // this.lightControls();
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
      var noiseTexture = loader.load('/images/textures/noise-256.jpg');
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

      var dark = true;

      // HTMLControl.controls.toggleBackground.addEventListener( 'click', ( e ) => {

      //   e.preventDefault();
      if (!dark) {

        this.mat.uniforms.mixAmount.value = 0.8;
        this.mat.uniforms.vignetteAmount.value = -1.6;
        // this.colA.set( 0x283844 );
        // this.colB.set( 0xffffff );

        // this.darkControls();
      } else {

        this.mat.uniforms.mixAmount.value = 0.08;
        this.mat.uniforms.vignetteAmount.value = 0;
        // this.colA.set( 0xffffff );
        // this.colB.set( 0x283844 );

        // this.lightControls();
      }

      dark = !dark;

      // }, false );
    }
  }]);
  return Background;
}();

var Lighting = function () {
  function Lighting(app) {
    classCallCheck(this, Lighting);


    this.app = app;

    this.initLights();

    this.initialStrength = 1.2;
  }

  createClass(Lighting, [{
    key: "initLights",
    value: function initLights() {

      var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      this.app.scene.add(ambientLight);

      this.light = new THREE.PointLight(0xffffff, this.initialStrength);

      this.app.camera.add(this.light);
      this.app.scene.add(this.app.camera);
    }
  }]);
  return Lighting;
}();

var Viewer = function () {
  function Viewer(canvas) {
    classCallCheck(this, Viewer);


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

    this.background = new Background(this.app);

    this.app.initControls();
  }

  createClass(Viewer, [{
    key: 'addObjectToScene',
    value: function addObjectToScene(object) {

      this.reset();

      if (object === undefined) {

        console.error('Oops! An unspecified error occurred :(');
        return;
      }

      this.animationControls.initAnimation(object);

      this.loadedObjects.add(object);

      // fit camera to all loaded objects
      this.app.fitCameraToObject(this.loadedObjects, 0.9);

      this.app.play();

      // this.loadedObjects.traverse( ( child ) => {

      //   if ( child.material !== undefined && Array.isArray( child.material ) ) {

      //     HTMLControl.errors.classList.remove( 'hide' );
      //     HTMLControl.controls.exportGLTF.disabled = true;

      //   }

      // } );
    }
  }, {
    key: 'reset',
    value: function reset() {

      while (this.loadedObjects.children.length > 0) {

        var child = this.loadedObjects.children[0];

        this.loadedObjects.remove(child);
        child = null;
      }

      this.loadedMaterials = [];

      this.animationControls.reset();
    }
  }]);
  return Viewer;
}();

THREE.Cache.enabled = true;

var defaultMat = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  side: THREE.FrontSide
});

var Main = function () {
  function Main(originalCanvas, resultCanvas) {
    classCallCheck(this, Main);


    this.originalPreview = new Viewer(originalCanvas);
    this.resultPreview = new Viewer(resultCanvas);

    this.loadingManagerOnLoadCalled = false;
    this.setUpExporter = false;

    this.loadedObject = null;
    this.animations = null;
    this.name = 'scene';
  }

  createClass(Main, [{
    key: 'load',
    value: function load(promise) {
      var _this = this;

      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'scene';
      var originalFile = arguments[2];


      this.loadingManagerOnLoadCalled = false;
      this.setUpExporter = false;
      this.loadedObject = null;
      this.animations = null;
      this.name = 'scene';

      loadingManager.onStart();

      loadingManager.onLoad = function () {

        if (_this.loadingManagerOnLoadCalled === true) return;

        _this.loadingManagerOnLoadCalled = true;

        if (_this.setUpExporter === false) exportGLTF.setInput(_this.loadedObject, _this.animations, _this.name);
      };

      promise.then(function (result) {

        if (result.isGeometry || result.isBufferGeometry) _this.onLoad(new THREE.Mesh(result, defaultMat));else if (result.isObject3D) _this.onLoad(result, name);
        // glTF
        else if (result.scenes && result.scenes.length > 1) {

            result.scenes.forEach(function (scene) {

              if (result.animations) scene.animations = result.animations;
              _this.onLoad(scene, name);
            });
          }
          // glTF or Collada
          else if (result.scene) {

              if (result.animations) result.scene.animations = result.animations;
              _this.onLoad(result.scene, name);
            } else console.error('No scene found in file!');
      }).catch(function (err) {

        if (_typeof(err.message) && err.message.indexOf('Use LegacyGLTFLoader instead') !== -1) {

          _this.load(loaders.legacyGltfLoader(originalFile));
        } else {
          console.error(err);
        }
      });

      return promise;
    }
  }, {
    key: 'onLoad',
    value: function onLoad(object, name) {

      HTMLControl.setOnLoadEndState();

      object.traverse(function (child) {

        if (child.material && Array.isArray(child.material)) {

          console.error('Multimaterials are currently not supported.');
        }
      });

      var animations = [];
      if (object.animations) animations = object.animations;

      this.originalPreview.addObjectToScene(object);
      this.resultPreview.reset();

      this.loadedObject = object;
      this.animations = animations;
      this.name = name;

      if (this.loadingManagerOnLoadCalled === true) {

        exportGLTF.setInput(this.loadedObject, this.animations, this.name);
        this.setUpExporter = true;
      }
    }
  }]);
  return Main;
}();

var main = new Main(HTMLControl.originalCanvas, HTMLControl.resultCanvas);

}());
