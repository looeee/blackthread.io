---
title: Three.js loader and converter
date: 2018-02-27T00:00:00-00:00
description: "Test your models for use with three.js! Currently supports these formats: FBX, GTLF, GLB, OBJ, MTL, Collada, three.js JSON as well as textures in DDS, JPG, PNG, BMP and GIF formats."
type: page
layout: fullWidth
css: loader
comments: false
userScaleDisabled: true
noFooter: true
js: loader
css: loader
vendorScripts:
  [
  "/inflate.min",
  "/three/build/three.min",
  '/three/examples/js/loaders/DDSLoader',
  '/three/examples/js/loaders/FBXLoader',
  '/three/examples/js/loaders/GLTFLoader',
  '/three/examples/js/loaders/LoaderSupport',
  '/three/examples/js/loaders/OBJLoader',
  '/three/examples/js/loaders/MTLLoader',
  '/three/examples/js/loaders/ColladaLoader',
  '/three/examples/js/controls/OrbitControls',
  '/three/examples/js/exporters/GLTFExporter'
   ]
---

<canvas id="loader-canvas"></canvas>

<div id="loading-overlay" class="fill">

  <div id="file-upload-form">
    <p>Viewer for fbx, gltf, glb or dae files and associated textures in jpg, png, gif, bmp or dds format using loaders from three.js.</p>
    <input id="file-upload-input" type="file" name="files[]" multiple="" class="hide">
    <input type="submit" value="Upload or Drop Files Here" id="file-upload-button"/>
    <p>Or load the <a id="example-duck" href="#">Example Duck</a></p>
  </div>

  <div id="loading-bar" class="hide">
    <span id="bar">
      <span id="progress"></span>
    </span>
  </div>

</div>

<div id="controls">
  <div class="controls-section"></div>
  <div class="controls-section">
    <input id="lighting-slider" type="range" min="0" max="8" step="0.1" value="0"/>
    <span id="light-symbol" class="fa fa-lg fa-lightbulb-o" aria-hidden="true"></span>
  </div>
  <div class="controls-section">
    <div id="animation-controls" class="hide">
      <select id="animation-clips">
          <option value="static">Static Pose</option>
        </select>
        <a href="#" id="playback-control">
          <span id="play-button" class="fa fa-lg fa-play-circle hide" aria-hidden="true"></span>
          <span id="pause-button" class="fa fa-lg fa-pause-circle" aria-hidden="true"></span>
        </a>
        <input id="animation-slider" type="range" min="0" max="100" value="0" step="0.1" />
        <a href="#" id="playback-control" title="Save take as JSON">
          <span id="export-anims" class="fa fa-lg fa-save" aria-hidden="true"></span>
        </a>
    </div>
  </div>
  <div class="controls-section">
    <div id="model-info" class="hide">
      <p>
          Bounding box - L: <span id="bb-depth">0</span> W: <span id="bb-width">0</span> H: <span id="bb-height">0</span>
      </p>
      <p>
          Faces: <span id="faces"></span> Vertices: <span id="vertices"></span>
      </p>
    </div>
    <div>
      <a href="#" id="toggle-grid" title="Toggle Grid">
          <span class="fa fa-lg fa-th" aria-hidden="true"></span>
      </a>
      <a href="#" id="toggle-info" title="Model info">
        <span class="fa fa-lg fa-info" aria-hidden="true"></span>
      </a>
      <a href="#" id="toggle-environment" title="Change Environment Map">
          <span class="fa fa-lg fa-picture-o" aria-hidden="true"></span>
        </a>
      <a href="#" id="toggle-background" title="Toggle background">
        <span class="fa fa-lg fa-sun-o" aria-hidden="true"></span>
      </a>
      <a href="#" id="fullscreen-button" title="Go fullscreen">
        <span class="fa fa-lg fa-arrows-alt" aria-hidden="true"></span>
      </a>
      <a href="#" id="screenshot-button" title="Take a screenshot">
        <span class="fa fa-lg fa-camera" aria-hidden="true"></span>
      </a>
      <a href="#" id="export-gltf" title="Export to GLTF">
        <span class="fa fa-lg fa-save" aria-hidden="true"></span>
      </a>
      <a href="#" id="reset" title="Reset">
        <span class="fa fa-lg fa-undo" aria-hidden="true"></span>
      </a>
    </div>
  </div>
</div>
