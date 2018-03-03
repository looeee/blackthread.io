const canvas = document.querySelector( '#export-preview' );

const fileUpload = {
  input: document.querySelector( '#file-upload-input' ),
  button: document.querySelector( '#file-upload-button' ),
  form: document.querySelector( '#file-upload-form' ),
};

const loading = {
  bar: document.querySelector( '#loading-bar' ),
  overlay: document.querySelector( '#loading-overlay' ),
  progress: document.querySelector( '#progress' ),
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

const errors = document.querySelector( '#errors' )

export default class HTMLControl {

  static setInitialState() {

    loading.overlay.classList.remove( 'hide' );
    fileUpload.form.classList.remove( 'hide' );
    loading.bar.classList.add( 'hide' );
    loading.progress.style.width = 0;

  }

  static setOnLoadStartState() {

    errors.classList.add( 'hide' );
    controls.exportGLTF.disabled = true;
    loading.bar.classList.remove( 'hide' );
  }

  static setOnLoadEndState() {

    loading.overlay.classList.add( 'hide' );
    controls.exportGLTF.disabled = false;

  }

}

HTMLControl.canvas = canvas;
HTMLControl.fileUpload = fileUpload;
HTMLControl.loading = loading;
HTMLControl.controls = controls;
HTMLControl.errors = errors;