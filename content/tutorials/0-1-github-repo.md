---
title:  "Three.js on Github"
description: "Everything you need to know about the official three.js repo on github"
tags: ['three.js', 'github', 'repository', 'mrdoob', 'build files', 'threejs examples', ]
menu: tutorials
menuTitle: Three.js tutorials
menuNumber: "0.1"
weight: 2
comments: false
---

Everything officially related to the three.js project is in one rather [monolithic repository](https://github.com/mrdoob/three.js) on Github. Its maintained by the original creator of three.js, [@mrdoob](https://twitter.com/mrdoob) (AKA Ricardo Cabello), along with an army of open-source aficionados.

It's a huge and very active repo - the 16th most starred Javascript library on Github in fact, and the 8th most forked. Its up there with superstars like [React](https://facebook.github.io/react/), [jQuery](https://jquery.com/) and [Node.js](https://nodejs.org/en/).

It's also quite overwhelming at first glance, but luckily we only need to look inside two folders for now.

### The /build folder

Contained in this folder are just three files, each of which contains the core `THREE` object. You only need to include one of these.

* [three.js](https://github.com/mrdoob/three.js/blob/dev/build/three.js) - the uncompressed file containing the core `THREE` object. This is for use as a `<script>` tag,. This means you can load three.js by putting `<script src="/js/three.js"></script>` in the `<head>` section of your HTML document. If you are following along on Codepen, this file is already included in the examples.
* [three.min.js](https://github.com/mrdoob/three.js/blob/dev/build/three.min.js). This is the same file but in a compressed format, with all the comments removed and names replaced with short versions. Your webpage will load faster if you use this since the file size is smaller.  However any error messages you get in the browser console will likely be garbled. Generally, you want to use `three.js` in development, and then switch to `three.min.js` in production.
* [three.module.js](https://github.com/mrdoob/three.js/blob/dev/build/three.module.js) was added more recently - it's the same as three.js, but is intended to be used with a build tool such as WebPack or Rollup. That's beyond the scope of these tutorials so we'll just focus on the first two file for now.

### The /examples folder

We'll be looking at this folder in detail later. There are a lot of useful goodies in this folder, such as:

* source code for the [official examples](https://threejs.org/examples/)
* plugins in the [/examples/js](https://github.com/mrdoob/three.js/tree/master/examples/js) folder (also known by the community as examples, confusingly)
* [fonts](https://github.com/mrdoob/three.js/tree/master/examples/fonts/) for use with the [FontLoader](https://threejs.org/docs/#api/loaders/FontLoader)
* [models](https://github.com/mrdoob/three.js/tree/master/examples/models/) in many different formats
* full [scenes](https://github.com/mrdoob/three.js/tree/master/examples/scenes/) in the three.js JSON format
* [sounds](https://github.com/mrdoob/three.js/tree/master/examples/sounds/)
* [textures](https://github.com/mrdoob/three.js/tree/master/examples/textures/)
* ... and lots more. Everything you need to learn how to use three.js is here in fact.

You should definitely make sure that you are familiar with this folder and whenever you are working to understand a new feature of three.js, first check the [official examples](https://threejs.org/examples/) to see if there is one that covers it and go over the corresponding source code.

Everything in this folder is covered by the same license as three.js, which means that you are free to use anything in your own projects.

### Other folders

Here are the other folders. We won't be covering them further here, but you may find their contents useful:

* [/docs](https://github.com/mrdoob/three.js/tree/dev/docs): All the files related to the official documentation and tutorials are here, although you'll probably find the [live version](https://threejs.org/docs/) easier to read!
* [/editor](https://github.com/mrdoob/three.js/tree/dev/editor/): The three.js community maintains an editor. If you want to look at the code, here it is, although again the [live version](https://threejs.org/editor/) will probably be more useful.
* [/src](https://github.com/mrdoob/three.js/tree/dev/src/): the uncompiled three.js source files. If you want to look under the hood, check here. It will be a lot clearer than trying to look through the huge compiled main file in the /build folder. We'll refer to files here every so often to illustrate how things work under the hood.
* [/test](https://github.com/mrdoob/three.js/tree/dev/test/): three.js unit tests are kept here. Unless you start developing for three.js you don't need to concern yourself with these.
* [/utils](https://github.com/mrdoob/three.js/tree/dev/utils/): here you will find a collection of [build tools](https://github.com/mrdoob/three.js/tree/dev/utils/build/), [converters](https://github.com/mrdoob/three.js/tree/dev/utils/converters/), [exporters](https://github.com/mrdoob/three.js/tree/dev/utils/exporters/) and [servers](https://github.com/mrdoob/three.js/tree/dev/utils/servers/). Some are great, some are very old and out of date. Use at your own risk.
