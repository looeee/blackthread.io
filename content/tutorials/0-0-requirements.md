---
title:  "Requirements for a three.js scene"
date: 2018-01-03T00:00:00-00:00
description: "Here we'll cover the basic requirement for running an three.js app and following the rest of these tutorials"
tags: ['three.js', 'requirements', 'WebGL', 'Codepen', 'browser console', 'HTML']
menu: tutorials
menuTitle: Three.js tutorials
menuNumber: "0.0"
weight: 1
readTime: true
---

We'll start with a quick overview of what you need to get a basic three.js app working. Please take the time to read over the topics in the introduction (we'll get to the pretty 3D stuff soon, I promise!).

#### [WebGL](https://en.wikipedia.org/wiki/WebGL)

In these tutorials, we are going to be focusing on the [WebGLRenderer](https://threejs.org/docs/#api/renderers/WebGLRenderer). As the name implies, this requires a WebGL enabled device. Not so long ago, this was something that we had to worry about. These days you can largely take it for granted that all users will have WebGL.

Here are two place that track current WebGL support:

* [caniuse.com](https://caniuse.com/#search=WebGL), which reports a global rate of 93% WebGL enabled devices
* [webglstats.com](https://webglstats.com/) which reports a slightly higher 97%

#### Become familiar with the browser console

Press `CTRL + SHIFT + I` and take a look at the window that opens up. Looks familiar? Great. If not take a moment now to become familiar with it, and read a couple of help files about how it works. We won't need anything more than the basic console for these tutorials but it is worth taking the time to become familiar with the other sections.

#### Codepen

The live examples used in these tutorials will all use [Codepen](https://codepen.io/looeee/pen/aEBKYK), and you can find any of the 'pens [here](https://codepen.io/collection/DKNVdO/).

Using Codepen will allow us to to bypass a couple of annoying technicalities, such as setting up a dev server to load models and textures.

#### Working locally

The basic pen linked above already includes a basic three.js scene as well as two JavaScript files: `three.js` and `OrbitControls.js`.

If you choose to work locally instead, you will need to include at least the `three.js` file. You can do this a couple of ways, the simplest is to add the following line somewhere between `<head>` and `</head>` in your HTML:

{{< highlight html >}}
  <script src="https://threejs.org/build/three.js"></script>
{{< /highlight >}}

A very basic HTML file, ready to create some cool three.js scenes, will look like this:

{{< highlight html >}}
<!DOCTYPE html>
<html>
  <head>
      <script src="https://threejs.org/build/three.js"></script>
  </head>

  <body>
    <script>
      // your code will go here
    </script>
  </body>
</html>
{{< /highlight >}}

You will also need to set up a development server to load texture and model files if you are working locally. Fortunately, there is a [page](https://threejs.org/docs/#manual/introduction/How-to-run-thing-locally) in the official docs that should help you out.
