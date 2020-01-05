#!/usr/bin/env node
const Sirens = require('../src/Sirens')

const optionalFolder = process.argv[2]

Sirens.openAppBrowser({ appFolder: optionalFolder })