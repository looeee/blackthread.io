const originalCanvas = document.querySelector( '#original-preview-canvas' );
const resultCanvas = document.querySelector( '#result-preview-canvas' );
const previews = document.querySelector( '#previews' );

const fullscreenButton = document.querySelector( '#fullscreen-button' );

const fileUpload = {
  input: document.querySelector( '#file-upload-input' ),
  button: document.querySelector( '#file-upload-button' ),
  form: document.querySelector( '#file-upload-form' ),
};

const loading = {
  original: {
    bar: document.querySelector( '#original-loading-bar' ),
    overlay: document.querySelector( '#original-loading-overlay' ),
    progress: document.querySelector( '#original-progress' ),
  },
  result: {
    bar: document.querySelector( '#result-loading-bar' ),
    overlay: document.querySelector( '#result-loading-overlay' ),
    progress: document.querySelector( '#result-progress' ),
  },
};

const controls = {
  trs: document.querySelector( '#option_trs' ),
  onlyVisible: document.querySelector( '#option_visible' ),
  truncateDrawRange: document.querySelector( '#option_drawrange' ),
  binary: document.querySelector( '#option_binary' ),
  forceIndices: document.querySelector( '#option_forceindices' ),
  forcePowerOfTwoTextures: document.querySelector( '#option_forcepot' ),
  exportGLTF: document.querySelector( '#export' ),
};

// const errors = document.querySelector( '#errors' );

export default class HTMLControl {

  static setInitialState() {

    HTMLControl.controls.exportGLTF.disabled = true;
    loading.original.overlay.classList.remove( 'hide' );
    loading.result.overlay.classList.remove( 'hide' );
    loading.original.bar.classList.add( 'hide' );
    loading.original.progress.style.width = 0;
    loading.result.bar.classList.add( 'hide' );
    loading.result.progress.style.width = 0;

  }

  static setOnLoadStartState() {

    controls.exportGLTF.disabled = true;
    loading.original.bar.classList.remove( 'hide' );

  }

  static setOnLoadEndState() {

    loading.original.overlay.classList.add( 'hide' );
    controls.exportGLTF.disabled = false;

  }

}

HTMLControl.originalCanvas = originalCanvas;
HTMLControl.resultCanvas = resultCanvas;
HTMLControl.fileUpload = fileUpload;
HTMLControl.loading = loading;
HTMLControl.controls = controls;
// HTMLControl.errors = errors;
HTMLControl.previews = previews;
HTMLControl.fullscreenButton = fullscreenButton;
