---
title:  "Adding Camera Controls"
date: 2018-03-01
description: "The simplest way to add interactivity to our scene is to add a camera controller. In this tutorial we'll use a ready made plugin called OrbitControls to rotate our camera around the scene"
tags: ['three.js', 'camera', 'controls', 'examples', 'plugins', 'orbit controls']
menu: tutorials
menuTitle: Three.js tutorials
menuNumber: "5"
weight: 6
readTime: true
toc: false
---

So far our scene is not interactive - it is animated, but it doesn't take any user input. Let's do something about that. The most obvious change we can make is to allow the camera to be moved around, so that we can view the scene from all angles.

As usual, we'll continue from where we left off in the last chapter:

{{< codepen "YYGEJV" >}}

First of all, remove the lines that make the box rotate - it will be easier to see that the camera is moving without these.

### Including the OrbitControls.js script

Moving the camera around the scene in such as way as to allow panning, zooming and rotation is a non-trivial task - especially when it comes to rotation.

You'll quickly come to realize, as you work in 3D, that moving around is pretty easy, mathematically speaking, but rotation is really not. We set the box above rotating pretty easily, it's true. But we are not really controlling that, just setting it to a random looking tumble. Gaining true mastery of an object's rotation is a tricky task, and definitely beyond the scope of these tutorials.

Fortunately there are plenty of camera control scripts freely available for us to use. Let's take a look at one of the most commonly uses here: [OrbitalControls](https://threejs.org/docs/#examples/controls/OrbitControls).

The name comes from the fact the these controls allow the camera to 'orbit' around a point in space (by default it will start to orbit around `(0, 0, 0)` ).

The orbit controls file is located at [/examples/js/controls/OrbitControls.js](https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.js) in the repo, and we can add it in a similar way to how we added the the main three.js script.

Turn your attention to the HTML pane in Codepen. Currently, it looks like this:

{{< highlight html >}}
<!--

Include the main three.js script.

This means that the global variable THREE will be available for use to use
-->

<script src="https://threejs.org/build/three.js"></script>
{{< /highlight >}}

Add the OrbitControls.js file, making sure to put it after the three.js script:

{{< highlight html >}}
...
<script src="https://threejs.org/build/three.js"></script>

<!--

Include the OrbitControls script.

Note that this must be included AFTER the three.js script as it
needs to use the global THREE variable
-->

<script src="https://threejs.org/examples/js/controls/OrbitControls.js"></script>
{{< /highlight >}}

By the way: Don't include the scripts from threejs.org this way in a production app. It's not the fastest way to get the files. I'm doing it this way since we are guaranteed to always get the latest version, but again in a production app you probably don't want that since an update might be released at any time and your app could break without warning.

### Setting up the controls

Making the controls work is almost ridiculously easy - in fact, all we need to do is add a single line to our app. Add the following line after the camera has been set up:

{{< highlight js >}}
...
  camera.position.set( 0, 0, 40 );

  const controls = new THREE.OrbitControls( camera );
...
{{< /highlight >}}

And that's it! You can now control the camera using touch or mouse. Experiment with the different mouse buttons and touch controls to see how it works (note that panning takes _three_ fingers for touch).

One thing to note about the orbit controls is that they steal your `right click` function - the right mouse button is used to pan the camera whenever you hover over the canvas. It's a bit annoying if you want to use right-click to open the browser console, but just remember that you can still use the shortcut `CTRL + SHIFT + I` instead, or on a Mac `CMD + SHIFT + I`.

{{< codepen "eydKyM" >}}