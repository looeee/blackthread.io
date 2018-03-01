---
title:  "Adding Camera Controls"
date: 2018-01-09T00:00:00-00:00
description: "The simplest was to add interactivity to our scene is to add a camera controller. In this tutorial we'll use a ready made plugin called OrbitControls to rotate our camera around the scene"
tags: ['three.js', 'camera', 'controls', 'examples', 'plugins', 'orbit controls']
menu: tutorials
menuTitle: Three.js tutorials
menuNumber: "5"
weight: 6
readTime: true
---

So far our scene is not interactive - it is animated, but it doesn't take any user input (unless you count responding to the changing size of the browser window).

As usual, we'll continue from where we left off in the last chapter:

<p data-height="400" data-theme-id="0" data-slug-hash="YYGEJV" data-default-tab="result" class='codepen'></p>
<script async="async" src="//codepen.io/assets/embed/ei.js"></script>

First of all, remove the lines that make the box rotate - it will be easier to see that the camera is moving without these.

### Including the OrbitControls.js script

The main `three.js` script doesn't include any camera controls, so we will have to include a separate script.

The controls that we are going to use are called [OrbitalControls](https://threejs.org/docs/#examples/controls/OrbitControls), since they allow the camera to 'orbit' around a point in space (by default it will orbit around `(0, 0, 0)` ).

The orbit controls file is located at [/examples/js/controls/OrbitControls.js](https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.js) in the repo, and we can add it in a similar way to how we added the three.js script.

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

{:.paragraph-notice}
Friendly reminder: Don't include the scripts from threejs.org this way in a production app. It's not the fastest way to get the files. I'm doing it this way since we are guaranteed to always get the latest version, but again in a production app you probably don't want this since the version might update at any time and your app will break without warning.

### Setting up the controls

Making the controls work is almost ridiculously easy - in fact, all we need to do is add a single line to our app. Add the following line after the camera has been set up:

{{< highlight js >}}
...
  camera.position.set( 0, 0, 40 );

  const controls = new THREE.OrbitControls( camera );
...
{{< /highlight >}}

And that's it! You can now control the camera using touch or mouse. Experiment with the different mouse buttons and touches to see how it works.

One thing to note about the orbit controls is that they steal your `right click` function - the right mouse button is used to pan the camera whenever you hover over the canvas. It's a bit annoying if you want to use right-click to open the browser console, but just remember that you can still use the shortcut `CTRL + SHIFT + I` instead.

<p data-height="400" data-theme-id="0" data-slug-hash="eydKyM" data-default-tab="result" class='codepen'></p>
<script async="async" src="//codepen.io/assets/embed/ei.js"></script>