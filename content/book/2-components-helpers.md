---
title:  "Components and Helpers"
date: 2018-01-12T00:00:00-00:00
description: "In this section we'll be taking a closer look at some of the components that make up three.js, as well as some of the helper objects."
tags: ['three.js', 'requirements', 'WebGL', 'Codepen', 'browser console', 'HTML']
heroImage: /images/tutorials/section2-hero.jpg
heroTitle: Components and Helpers
heroDescription: A closer look at the components that make up three.js
menu: book
menuTitle: Three.js book first draft
menuSectionMain: true
menuNumber: "2"
weight: 13
comments: false
readTime: true
draft: true
---

# DRAFT COPY

Congratulations! You made it to Section 2! That means you know have a basic understanding of how to set up a three.js scene, how to make it animate, add textures, camera controls and even automatically resize along with the browser window.

In this section we'll be taking a closer look at some of the components that make up three.js, as well as some of the helper objects.

We'll take a look at how the various components fit together (_inheritance_) and take our first in depth animation of an object - the [Object3D](https://threejs.org/docs/#api/core/Object3D) which is the _base class_ for nearly everything in three.js.

We'll also be giving an introduction to some of the mathematical theory we need to really understand what's going on in our scenes. Don't worry, it will be very basic, for now.

### Our current setup

[Here](https://codepen.io/looeee/pen/aEBKYK) is a codepen that contains a nearly empty scene with all our setup so far - it has automatic resizing, orbit controls and animation already set up, and most of the comments from the previous section stripped out to make things clearer.

### Onwards! To rainbows and glory!
Let's start with something colourful...
