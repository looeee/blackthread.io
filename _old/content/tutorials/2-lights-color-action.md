---
title:  "Lights, Color, Action!"
date: 2018-03-02
modifiedDate: 2018-03-05
description: "Picking up where we left of in the last tutorial we'll add lights, color and animation to our scene."
tags: ['three.js', 'scene', 'renderer', 'webgl', 'animation', 'color', 'lights']
menu: tutorials
menuTitle: Three.js tutorials
menuNumber: "2"
weight: 3
readTime: true
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
const near = 0.1;
const far = 1000;

const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

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

### Code organisation

Before we go any further, let's take a moment to organise our code a little. We'll wrap everything we've written so far in a function called `init()`, except for the line `renderer.render( scene, camera )` which will go inside an `animate` function.

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
  const near = 0.1;
  const far = 1000;

  camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

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

Code organisation is `VERY` important to stay on top of - it will make any piece of software much easier for both you and other people to understand and maintain. You should spend a considerable amount of time on any software project making sure that the code is well organised and clear. Variables should be named so that their purpose is easy to understand, and there should be just enough comments to guide a reader through your code.

Remember, badly organised code is bad code, even if it currently does what it is supposed to.

### Animating with `requestAnimationFrame`

You may have noticed that the `animate` function above is badly named - as I said in the previous chapter, `renderer.render( scene, camera )` renders a _still_ image of the `scene` from the point of view of the `camera` - and it seems a little unfair to call a single image an animation.

Let's fix that.

To do so, we'll use a method that is built into every modern browser, called [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). From that page:

{{% quote %}}
The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint.
{{% /quote %}}

The important term is `next repaint` and we'll should take a few moments now to understand what it means. The browser will attempt to refresh the page, at most, at the same refresh rate as the screen it is being displayed on. This means that if you are viewing your app on a standard issue 2018 monitor, you will get a maximum repaint rate of 60 repaints per second. You can consider the following terms to mean the same thing, although there are technical differences:

`maximum repaint rate` = `refresh rate of your monitor` = `maximum frame rate` = `Hz`/`hertz`.

The last one, hertz or Hz for short, is a unit which means `number of times per second`.

So, our standard issue 2018 computer monitor has a refresh rate of 60Hz, that is, the image on the screen is redrawn 60 times per seconds.

This means that once we set up our animation using `requestAnimationFrame`, our app will _attempt_ to draw a new frame 60 times per second. Depending on the complexity of your app, and the speed of your computer, it may or may not succeed - if the frame is not ready in time, it will simply redraw it at the next available refresh interval instead, and in the meantime the previous frame will be drawn on the screen again.

Other monitors or TVs may have different refresh rates - a typical TV (even a mid-range modern one) is likely to have a refresh rate of 30Hz, while a super fancy new 3D capable monitor may have a refresh rate of 120Hz or even 240Hz. Newer phones may also have a 120Hz refresh rate.

The upshot of all of this is that when you are creating an application, you should never base animation on frame rate - i.e., you should never say that your character should move 1/100th of a step each frame, because on your laptop this may look fine, but on my 3-year-old Android phone the character will be moving in horrible jerky slow motion, while on my friend's uber battlestation with fancy 3D 240Hz monitor, the animations will be happening at 4 times the desired speed.

Base your animations on how much _time_ has passed instead and everything will be golden.

#### Recursively calling our animate() function

Actually using `requestAnimationFrame` is pretty simple - the trick is to do it recursively. If you recall, a recursive function is simply a function that calls itself repeatedly.

So, we'll call our `animate` function _within_ our `animate` function, using `requestAnimationFrame` to handle the timing. Update it to look like this:

{{< highlight js >}}

function animate() {

  // call animate recursively
  requestAnimationFrame( animate );

  // render a frame
  renderer.render( scene, camera );
}

{{< /highlight >}}

And that, my friends, is that! Cue round of applause, bow, exit our hero stage left.

Well, except of course, that our scene doesn't actually _look_ any different. It may be updating at up to 60 frames per second, but nothing is moving so it looks identical to us.

We'll add some movement soon, but first lets set up some lights and color.

### Setting the material's color

Now would be a good time to take a look at the [Color](https://threejs.org/docs/#api/math/Color) documentation to get an idea of how color works in three.js.

Although there are lots of ways to set the color listed in the docs, the standard way is to use a `hexadecimal triple`. You may already be familiar with CSS colors - they look like `#ffffff` (white) or `#000000` (black). Well, that is a hexadecimal triple, and in JavaScript, it's pretty similar. We just need to write them slightly differently.

In JavaScript, a hexadecimal number is denoted with `0x` instead of `#`. The CSS colors above become `0xffffff` (white)  or `0x000000`, or `0x800080` (purple). Let's use the last one now and set our previously white material to a nice purple color:

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

No, it's OK - remember in the last chapter I told you that most materials need a light to be seen? Well, `MeshStandardMaterial` needs a light. In fact, not only that but it's a super fancy 'Physically Correct' material, that reacts to light in the same way an object in the real world does, or at least in a fairly good approximation.

### Adding lights

So we need a light then? No problem. There are lots of options. Here's a list of the basic light types currently available in three.js:

* AmbientLight: [docs](https://threejs.org/docs/#api/lights/AmbientLight)
* DirectionalLight: [docs](https://threejs.org/docs/#api/lights/DirectionalLight), [example](https://threejs.org/examples/?q=light#webgl_lights_hemisphere)
* HemisphereLight: [docs](https://threejs.org/docs/#api/lights/HemisphereLight), [example](https://threejs.org/examples/?q=light#webgl_lights_hemisphere) (same as Directional light example)
* PointLight: [docs](https://threejs.org/docs/#api/lights/PointLight), [example](https://threejs.org/examples/?q=light#webgl_lights_pointlights)
* RectAreaLight: [docs](https://threejs.org/docs/#api/lights/RectAreaLight), [example](https://threejs.org/examples/?q=light#webgl_lights_rectarealight). Note that this one was added recently and is still somewhat experimental
* SpotLight: [docs](https://threejs.org/docs/#api/lights/SpotLight), [example](https://threejs.org/examples/?q=light#webgl_lights_spotlight)

We'll add an `AmbientLight` and a `PointLight` to our scene next.

#### Adding global illumination with an AmbientLight

`AmbientLight` provides [global illumination](https://en.wikipedia.org/wiki/Global_illumination) - that is, it adds non-directional light equally from all directions to all objects in the scene. You will generally always add some ambient light to a 3D scene, since real light bounces infinitely from object to object. There is no way to mimic this in 3D so we fake it by adding some (dim) global illumination.

We'll create an AmbientLight inside our `init` function. Just like with meshes, lights need to be added to the scene to be taken into account when rendering.

{{< highlight js >}}
....
  scene.add( mesh );

  // create a global illumination light
  const ambientLight = new THREE.AmbientLight( 0xffffff, 1.0 );

  // remember to add the light to the scene
  scene.add( ambientLight );
...
{{< /highlight >}}

If you refresh the page again, you will see dimly see the mesh again, now purple in color.

Note that this light still doesn't give any appearance of depth - it shines equally from all directions and distances, so it illuminates all surfaces the same way. In practice, that means that a curved surface illuminated with just an ambient light will look flat.

Usually an ambient light is used for artistic control, and you wouldn't set it as brightly as we have here - rather, you might leave the intensity at 1.0, but set the color to a dim gray, perhaps: `const ambientLight = new THREE.AmbientLight( 0x555555, 1.0 );`

#### Adding omnidirectional illumination with a PointLight

Next we'll add a `PointLight`. This light also shines in every direction, but this time from a specific point in space. You can think if this one as being like a bare light bulb, that illuminates everything around it. In some applications, this is called an 'Omni' (for omnidirectional) light.

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

Try moving the light around a little to see the effect of the shiny areas (the technical term for these is [specular highlights](https://en.wikipedia.org/wiki/Specular_highlight)).

### Adding movement

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

Note that I'm going against my own advice here for the sake of simplicity. I'm updating a fixed amount each frame, so there is no way to be sure that the animation you are seeing will be the same on another device. In fact, if you are viewing this on a very new phone or fancy gaming monitor, the animation should be very fast. For now, that's OK though.

### Final result

...and there you have it, as promised at the start of Chapter 1, we now have a spinny, rotaty, truly glorious purple torus knot!

{{< codepen "GmJPrm" >}}