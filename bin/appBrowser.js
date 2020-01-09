#!/usr/bin/env node
const O = require('../src/O')

const Sirens = require('../src/Sirens')

const optionalFolder = process.argv[2]

Sirens.useGtkViews()
Sirens.openAppBrowser({ appFolder: optionalFolder })