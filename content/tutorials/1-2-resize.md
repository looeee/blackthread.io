---
title:  "Resizing the canvas"
description: "Dealing with the ever changing browser window size "
tags: ['event listener', 'resize', 'browser']
menu: tutorials
menuTitle: Three.js tutorials
menuNumber: "1.2"
weight: 7
---

Here's where we left off at the end of the last chapter.

<p data-height="400" data-theme-id="0" data-slug-hash="GmJPrm" data-default-tab="result" class='codepen'></p>
<script async="async" src="//codepen.io/assets/embed/ei.js"></script>

It's pretty respectable result for such a small amount of code. However, there is one big problem that will quickly make it look at lot less professional to anyone using your website - that is, the scene does not resize when the browser window changes size.

This will be particularly obvious if you load this page with a small browser window and then increase the size. Codepen makes this very easy to see since you can just drag to adjust the size of the preview window to see this.

#### Calling a function whenever the browser window changes size

Fortunately, it's pretty easy to fix, and just as we did when we wanted to add animation, we'll turn to a built-in browser method. This time, we'll use [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener), and we want to listen for an event on the whole window so we'll use `window.addEventListener`.

You can listen for all kinds of events such as `click`, `scroll`, `keypress` and many more, but the one that we want to listen for here is called `resize`.

{:.paragraph-notice}
You can listen for events on nearly any HTML element rather than the whole window, so you might think that you should be calling this as `canvas.addEventListener`. However the resize event doesn't fire when attached to anything other than the `window` object, so don't do that.

Add the following code after your `animate` function and before the call to `init`:
{{< highlight js >}}
...
function animate() {

  ...
  renderer.render( scene, camera );

}

function onWindowResize() {

  console.log( 'You resized the browser window!' );

}

window.addEventListener( 'resize', onWindowResize );

// call the init function to set everything up
init();
...
{{< /highlight >}}

This will call the `onWindowResize` function every time the window resizes.

{:.paragraph-notice}
Be aware that when you resize the browser window, the function might get called _many_ times. Like, 50 times when you resize the window just once. So don't do any heavy calculation in here.

Notice that we have added `console.log( ... )` inside the function? This is a very useful way of making sure that something is working correctly. Open up the browser console now and resize the window and you should see this:

{{< figure src="/images/tutorials/1.2/console-resize.png" caption="Fig 1: The number on the left notes how many times the function was called" alt="Logging resize event to console" >}}

#### Setting up the `onWindowResize` function

Now that's set up, what should be put inside the `onWindowResize` function? It's fairly straightforward to figure this out actually- go over the code in the init function and take a note of everywhere that `window.innerWidth` or `window.innerHeight` was used. These are the lines we where we used these, and we'll need to figure out a way of updating them:

{{< highlight js >}}
  renderer.setSize( window.innerWidth, window.innerHeight );

  const aspect = window.innerWidth / window.innerHeight;
{{< /highlight >}}

OK, so the renderer's size and the aspect ratio of the camera. Doesn't sound too bad.
Remember that the `<canvas>` element was automatically created and given a size by the renderer? Well, fortunately when we update the renderer's size it can take care of resizing the canvas again if we want.

Our final `onWindowResize` function will look like this:

{{< highlight js >}}
...
function onWindowResize() {

  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener( 'resize', onWindowResize );
...
{{< /highlight >}}

Now try resizing the window and again and watch as your scene resizes to match. Nice!

There are a couple of things to take note of here. The first is that we had to call `camera.updateProjectionMatrix()`. You will need to do this any time you make a change to camera parameters that change the shape of the frustum - see the section on the camera in  [Ch 1: Getting Started](/tutorials/1-0-getting-started/#the-camera) for details on the camera. Basically, if you change the `fov`, the `aspect` the `near` clipping plane, or the `far` clipping plane, then you will need to update the frustum, AKA the 'projection matrix'.

I'm not sure which sounds cooler, 'frustum', or 'projection matrix'...

The other thing to note is that, as I mentioned, `renderer.setSize` also takes care of setting the `<canvas>` size for us. There are times when we don't want that, for example, if you are using different canvas sizes when your app is being viewed on a mobile device.
In these cases, you can call `renderer.setSize( window.innerWidth, window.innerHeight, false )` and the canvas will be left up to you to adjust.

Here's our lovely torus knot with the resize function set up:

<p data-height="400" data-theme-id="0" data-slug-hash="QaKqzq" data-default-tab="result" class='codepen'></p>
<script async="async" src="//codepen.io/assets/embed/ei.js"></script>