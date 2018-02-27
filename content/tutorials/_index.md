---
title: "Three.js Tutorials"
description: "Welcome to the Black Thread series of tutorials on three.js! In this tutorial series we'll focus on getting to know three.js in depth, fast"
noPagination: true
noTOC: true
noReadTime: true
comments: false
heroImage: /images/tutorials/tutorial-hero.jpg
heroTitle: Three.js Tutorials
heroDescription: Quickly get up and running with three.js
---

Welcome to the Black Thread series of tutorials on [three.js](https://threejs.org/)! Here we'll focus on getting to know three.js in depth - all the amazing features that make this beautiful library so great to work with, but also all how to deal with all the quirks and annoyances that you will undoubtedly come across, so that you can quickly become familiar enough to start building your own projects.

These tutorials are intended to be supplementary to the [official documentation](https://threejs.org/docs/) and you'll be referred there regularly (_disclaimer_: I wrote quite a bit of that documentation, so if you find a mistake there it is probably my fault. Please let me know here or raise an issue on [github](https://github.com/mrdoob/three.js/issues/) and I'll fix it ASAP!).

If you need some inspiration to get you started, have a look at the [threejs.org](https://threejs.org/) frontpage which features a regularly updated collection of some cutting-edge work from around the web.

If you need some more detailed explanations of anything to do with three.js, or just want to say hi, come find us on the official [forum](https://discourse.threejs.org/). My username there is [@looeee](https://discourse.threejs.org/u/looeee/).

These tutorials are work in progress - see the menu on the left for currently available tutorials. I'll be adding more whenever I have the time. And if you want a specific tutorial or have any comments please I'd love to [hear from you]({{ site.url }}/contact/).

#### Prerequisites

You are expected to have a basic grasp of JavaScript (including ES6), and know how to get your code running in a web browser, although we will be briefly covering everything that you need to know as we go along.

#### Section 0 (Introduction)

We'll start with a brief overview of WebGL and what you need to get it running on a computer, tablet or phone. Then we'll take a brief overview of the [three.js repo](https://github.com/mrdoob/three.js) on GitHub, and we'll finish up the section with some tips on getting help, reporting bugs and how to set up a development server.

#### Section 1 (First Steps)

We'll get going properly here, making sure we understand the basics - the components that make up every 3D scene, how to create objects, lights, cameras and how to apply simple materials and textures to our creations, as well as how to work with the [Scene](https://threejs.org/docs/#api/scenes/Scene), how to [Group](https://threejs.org/docs/#api/objects/Group) objects and how to set up our canvas to resize automatically if the browser window size changes.

#### Section 2 (Components and Helpers)

Now that we have a basic understanding of a three.js scene, we'll go a little deeper and gently introduce various components such as [Colors](https://threejs.org/docs/#api/math/Color) and the various helper objects, before taking a look at [Object3D](https://threejs.org/docs/#api/core/Object3D) which is the base class for most other objects in three.js and contains various method for organising and moving objects around in 3D.

#### Technical details

The code examples will be written with basic ES6 style JavaScript - nothing too fancy, but we will be using `let`, `const`, arrow functions and so on. This means that your code will work fine in modern browsers, but you might run into trouble if you are using an old version of Internet Explorer or something. Basically, just stick to the latest versions of Chrome or Firefox and you will be fine. If you want more details, have a look at the [Browser Support](https://threejs.org/docs/#manual/introduction/Browser-support) page in the docs.

OK people, button up and let's get those pixels flowing!

#### [Happy coding!](/tutorials/0-0-requirements/)
