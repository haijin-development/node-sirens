#!/usr/bin/env node
const Sirens = require('../src/Sirens')
const Preferences = require('../src/sirens/objects/Preferences')

Preferences.freeze

const optionalFolder = process.argv[2]

Sirens.openAppBrowser({ appFolder: optionalFolder })