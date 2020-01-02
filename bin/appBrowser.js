#!/usr/bin/env node
const Sirens = require('../src/Sirens')
const Pluggables = require('../src/sirens/Pluggables')

Pluggables.freeze

const optionalFolder = process.argv[2]

Sirens.openAppBrowser({ appFolder: optionalFolder })