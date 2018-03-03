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

export default class HTMLControl {

  static setInitialState() {

    loading.overlay.classList.remove( 'hide' );
    fileUpload.form.classList.remove( 'hide' );
    loading.bar.classList.add( 'hide' );
    loading.progress.style.width = 0;

  }

  static setOnLoadStartState() {
    fileUpload.form.classList.add( 'hide' );
    loading.bar.classList.remove( 'hide' );
  }

  static setOnLoadEndState() {

    loading.overlay.classList.add( 'hide' );

  }

}

HTMLControl.canvas = canvas;
HTMLControl.fileUpload = fileUpload;
HTMLControl.loading = loading;
