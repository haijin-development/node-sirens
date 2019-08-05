# Sirens

Sirens gives Node.js developers some simple and interactive utilities to ease development, testing, debugging and learning Node.

These utilities are written in Node and use GTK3 through [node-gtk](https://www.npmjs.com/package/node-gtk) as its GUI support.

**Note: this project is usable but it is still at an early stage of development.**

![Object browser](./docs/browsing-object.gif)

### Installation

**Note: please keep in mind that this project is not meant for production but only as an utility to be used during development**

Add `Sirens` to the project with

```
npm install sirens --save-dev
```

### Usage

Require the `sirens` module and open a browser on any object with

```
const Sirens = require('sirens')

Sirens.browseObject(object)
```

Open a browser on any object properties and methods along its prototypes chain with

```
const Sirens = require('sirens')

Sirens.browsePrototypes(object)
```

### Pre-requisites

The current version does not work with node > v10.

```
nvm install v10.15.3
```

Please refer to the installation section of [node-gtk](https://www.npmjs.com/package/node-gtk#installing-and-building).


In Ubuntu installing the following libraries

```
sudo apt install libgtk-3-dev libgirepository1.0-dev gobject-introspection build-essential
```

should be enough to run [node-gtk](https://www.npmjs.com/package/node-gtk#installing-and-building) and `sirens`.


## Development

### Running the tests

Run the tests with 

```
npm test
```

### Running the examples

Run the browser and GTK widgets examples from the directory `examples/`.

For example

```
node examples/widgets/checkBox.js
```

```
node examples/browsers/objectBrowser.js
```

## References

These utilities are heavily based in the Smalltalk browsers, in particular in the [Object Arts](https://www.object-arts.com/)
implementation named [Dolphin Smalltalk](https://github.com/dolphinsmalltalk/Dolphin) which I fancy for its
outstanding beauty, and it's an independent port of [Sirens for the Ruby language](https://github.com/haijin-development/ruby-sirens).

The graphics code is encapsulated in the `views` layer and it should be possible to switch to any other graphics library, be it GTK+ or QT, implementing that layer alone.