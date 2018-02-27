---
title:  "Lights, Color, Action!"
description: "Picking up where we left of in the last tutorial we'll add lights, color and animation to our scene."
tags: ['three.js', 'scene', 'renderer', 'webgl', 'animation', 'color', 'lights']
menu: tutorials
menuTitle: Three.js tutorials
menuNumber: "1.1"
weight: 6
---

We'll pick up here exactly where we left off in the last chapter. Here is the complete code so far:

{{< highlight js >}}
// create a WebGLRenderer and set its width and height
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

// add the automatically created canvas element to the page
document.body.appendChild( renderer.domElement );

// create a Scene
const scene = new THREE.Scene();

// set up the options for a perspective camera
const fov = 35; // fov = Field Of View
const aspect = window.innerWidth / window.innerHeight;
const nearClippingPlane = 0.1;
const farClippingPlane = 1000;

const camera = new THREE.PerspectiveCamera( fov, aspect, nearClippingPlane, farClippingPlane );

// every object is initially created at ( 0, 0, 0 )
// we'll move the camera back a bit so that we can view the scene
camera.position.set( 0, 0, 40 );

// create a TorusKnotBufferGeometry
const geometry = new THREE.TorusKnotBufferGeometry( 5, 1 );

// create a default (white) MeshBasicMaterial
const material = new THREE.MeshBasicMaterial();

// create a Mesh containing the geometry and material
const mesh = new THREE.Mesh( geometry, material );

// add the mesh to the scene object
scene.add( mesh );

renderer.render( scene, camera );

{{< /highlight >}}

## Code organisation

Before we go any further, let's take a moment to organise our code a little. We'll wrap everything we've written so far in a function called `init()`, except for the line `renderer.render( scene, camera )` which will go in an `animate` function.

Once we have done this, our code will look like this:

{{< highlight js >}}

// these need to be accessed inside more than one function so we'll declare them first
let camera, renderer, scene, mesh;

function init() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  // add the automatically created canvas element to the page
  document.body.appendChild( renderer.domElement );

  // create a Scene
  scene = new THREE.Scene();

  // set up the options for a perspective camera
  const fov = 35; // fov = Field Of View
  const aspect = window.innerWidth / window.innerHeight;
  const nearClippingPlane = 0.1;
  const farClippingPlane = 1000;

  camera = new THREE.PerspectiveCamera( fov, aspect, nearClippingPlane, farClippingPlane );

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set( 0, 0, 40 );

  // create a TorusKnotBufferGeometry
  const geometry = new THREE.TorusKnotBufferGeometry( 5, 1 );

  // create a default (white) MeshBasicMaterial
  const material = new THREE.MeshBasicMaterial();

  // create a Mesh containing the geometry and material
  mesh = new THREE.Mesh( geometry, material );

  // add the mesh to the scene object
  scene.add( mesh );

}

function animate() {

  renderer.render( scene, camera );

}

// call the init function to set everything up
init();

// then call the animate function to render the scene
animate();

{{< /highlight >}}

Code organisation is a `VERY` important thing to stay on top of - it will make any piece of software much easier for both you and other people to understand and maintain, and you should spend a considerable amount of time on any software project making sure that the code is well organised, clear, well named and easy to understand, as well as having just enough comments to guide a reader. It's not the subject of these tutorials so I won't say anything more about it, except that if you are serious about coding, then you need to be serious about code organisation too. Badly organised code is bad code, even if it currently does what it is supposed to.

You may have noticed that the `animate` function above is badly named - as I said in the previous chapter, `renderer.render( scene, camera )` renders a _still_ image of the `scene` from the point of view of the `camera` - and it seems a little unfair to call a single image an animation.

The obvious thing to do next, then, is to turn it into an animation.

### Animating with `requestAnimationFrame`

To do so, we'll use a method that is built into every modern browser, called [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). From that page:

{:.quote}
The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint.

The important term here is `next repaint` and we should take a few moments here to understand what it means. The browser will attempt to refresh the page, at most, at the same refresh rate as the screen it is being displayed on. This means that if you are viewing your app on a standard issue 2017 monitor, you will get a maximum repaint rate of 60 repaints per second. You can consider the following terms identical, although there are technical differences:

`maximum repaint rate` = `refresh rate of your monitor` = `maximum frame rate` = `Hz` = `Hertz`.

The last one, Hz, is a unit which means `number of times per second`.

So, our standard issue 2017 computer monitor has a refresh rate of 60Hz, that is, the picture is redrawn 60 times per seconds.

This means that once we set up our animation using `requestAnimationFrame`, our app will _attempt_ to draw a new frame 60 times per second. Depending on the complexity of your app, and the speed of your computer, it may or may not succeed - if the frame is not ready in time, it will simply redraw it at the next available refresh interval instead.

Other monitors or TVs may have different refresh rates - a typical TV (even a mid-range modern one) likely has a refresh rate of 30Hz, while a super fancy new 3D capable monitor may have a refresh rate of 120Hz or even 240Hz.

The upshot of all of this is that when you are creating an application, you should never base animation on frame rate - i.e., you should never say that your character should move 1/100th of step each frame, because on your super fast laptop this may look fine, but on my 3-year-old Android phone, complete with a cracked screen since I forgot to take it out of my pocket while hanging upside down from a tree last week, your character will be moving in horrible jerky slow motion.

Base your animations on how much _time_ has passed instead and everything will be golden.

#### Recursively calling our animate() function

Actually using `requestAnimationFrame` is pretty simple - the trick is to do it recursively. That is, we'll call our `animate` function _within_ our animate function. Update it to look like this:

{{< highlight js >}}

function animate() {

  // call animate recursively
  requestAnimationFrame( animate );

  // render a frame
  renderer.render( scene, camera );
}

{{< /highlight >}}

And that, my friends, is that! Cue round of applause, bow, exeunt our hero stage left.

Well, except of course, that our scene doesn't _look_ any different. It may be updating at up to 60 frames per second, but nothing is moving so it looks identical to us.

We'll add some movement soon, but first lets set up some lights and colour.

### Setting the material's colour

Now would be a good time to take a look at the [Color](https://threejs.org/docs/#api/math/Color) documentation to get an idea of how colour works in three.js.

We'll go over it in more depth soon, but for now just note that although there are lots of ways listed in the docs, the standard way of setting colour is to use a `hexadecimal triple`. You may already be familiar with CSS colours - they look like `#ffffff` (white) or `#000000` (black). Well, that is a hexadecimal triple, and in JavaScript, it's pretty similar, we just need to write them slightly differently.

In JavaScript, a hexadecimal number is denoted with `0x` instead of `#`. The CSS colors above become `0xffffff` (white)  or `0x000000`, or `0x800080` (purple). Let's use the last one now and set our previously white material to a nice purple colour:

Update the section:

{{< highlight js >}}

// create a default (white) MeshBasicMaterial
const material = new THREE.MeshBasicMaterial();

{{< /highlight >}}

So that it looks like:

{{< highlight js >}}

  // create a purple MeshStandardMaterial
  const material = new THREE.MeshStandardMaterial( { color: 0x800080 } );

{{< /highlight >}}

And... our scene has gone completely black. Great.

No, it's OK - remember in the last chapter I told you that most materials need a light to be seen? Well, MeshStandardMaterial needs a light. In fact, not only that but it's a super fancy 'Physically Correct' material, that reacts to light in the same way an object in the real work does, or at least in a fairly good approximation thereof.

So we need a light then? No problem.

#### Adding lights

At the moment our scene looks kind of ugly. Let's add some lights and switch to a higher quality material.

##### Adding global illumination with an AmbientLight

First we'll add an [AmbientLight](https://threejs.org/docs/#Reference/Lights/AmbientLight).

This provides [global illumination](https://en.wikipedia.org/wiki/Global_illumination) - that is, it adds non-directional light equally from all directions to all objects in the scene. You will generally always add some ambient light to a 3D scene. Real light bounces infinitely from object to object and there is no way to mimic this in 3D so we fake it by adding some global illumination. We'll create an AmbientLight inside our init function.

And take note that just like meshes, lights need to be added to the scene to be taken into account when rendering

{{< highlight js >}}
....
scene.add( mesh );

  // create a global illumination light
  const ambientLight = new THREE.AmbientLight( 0xffffff, 1.0 );

  // remember to add the light to the scene
  scene.add( ambientLight );
...
{{< /highlight >}}

If you refresh the page again, you will see dimly see the mesh again.

##### Adding omnidirectional illumination with a PointLight

Let's add another light - this time a [PointLight](https://threejs.org/docs/#Reference/Lights/PointLight). This light also shines in every direction, but this time from a specific point in space. You can think if this one like a bare light bulb, that illuminates everything around it. In some applications, this is called an 'Omni' (for omnidirectional) light.

{{< highlight js >}}
....
  scene.add( ambientLight );

  // Create an omnidirectional point light
  const pointLight = new THREE.PointLight( 0xffffff, 1.0 );

  pointLight.position.set( 0, 0, 20 );

  scene.add( pointLight );
...
{{< /highlight >}}

We've also positioned the light halfway between the mesh and the camera (remember, since we didn't move the mesh it's still at the default position of `(0, 0, 0)` ).

Also now (FINALLY!!) our scene really looks 3D too. Sweet.

Try moving the light around a little to see the effect of the shiny areas (these are called `specular highlights`).

There are a couple of other light types as well. We'll go over them later.

#### Adding movement

Back to the animation. As noted above, our scene should now be animating nicely at somewhere close to 60 frames per second, but we have no way of telling this since nothing is moving.

Let's add some rotation to the mesh. Add a couple of lines to the `animate` function:

{{< highlight js >}}
...
function animate() {

  // call animate recursively
  requestAnimationFrame( animate );

  // increase the mesh's rotation each frame
  mesh.rotation.z += 0.01;
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  renderer.render( scene, camera );

}
...
{{< /highlight >}}

### Final result

...and there you have it, a fine spiny rotaty torus knot in all its glory!

<p data-height="400" data-theme-id="0" data-slug-hash="GmJPrm" data-default-tab="result" class='codepen'></p>
<script async="async" src="//codepen.io/assets/embed/ei.js"></script>