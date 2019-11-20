#!/usr/bin/env node
const Sirens = require('../src/Sirens')
const Pluggables = require('../src/sirens/objects/Pluggables')
const Preferences = require('../src/sirens/objects/Preferences')

Pluggables.freeze
Preferences.freeze

const optionalFolder = process.argv[2]

Sirens.openAppBrowser({ appFolder: optionalFolder })