---
title:  "Understanding the three.js versioning system"
description: "How to deal with the different version of three.js"
tags: ['three.js', 'versions', 'revisions', 'wiki', 'migration guide', 'API', 'releases']
menu: tutorials
menuTitle: Three.js tutorials
menuNumber: "0.2"
weight: 3
---
### Semver? No way!

The development pace of three.js is _fast_, and it uses a slightly unusual versioning system. Most software gets released incrementally as V0.5, V0.6, V1.0, V1.1.1 etc. This is known as [semver](https://semver.org/), or Semantic Versioning.

Well, three.js is far too hipster for that - instead, we use a revision system. There's a new revision out about once month or so, and we are currently up to Revision 88 (R88), as of mid December 2017.

EDIT: since I wrote this (last night) R89 was released - I told you development was fast!.

### Syntax in older versions

The syntax may change in any revision. This means that if you are following a tutorial that was written a couple of years ago when R65 was the bee's knees, you may find that things are not working out as you expect.

Also, you should make sure that any files you use from the /examples folder (see [0.1 Three.js on Github](/tutorials/0-1-github-repo/#the-examples-folder)) match the version of three.js you are using. Otherwise you might run into some nasty bugs.

In practice, it's not actually that bad. The majority of the syntax has not changed in years.

Also, everything that does change is kept as an alias (if possible). Whenever you use one of these aliases, a deprecation warning is logged to the console.

So if you are following an old tutorial or getting help from a three-year-old StackOverflow post that has out of date syntax, most things will still work.

Just remember to keep an eye on those console warnings (remember, press `CTRL + SHIFT + I` to view these).

### Watch these pages for changes

To keep up to date with changes, follow these pages:

* The [Deprecated API List](https://threejs.org/docs/#api/deprecated/DeprecatedList) docs page
* The [Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide) on the wiki
* The [releases](https://github.com/mrdoob/three.js/releases) page which has detailed info about all the changes for each release