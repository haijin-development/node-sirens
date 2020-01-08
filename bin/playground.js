#!/usr/bin/env node
const Sirens = require('../src/Sirens')

const optionalFilename = process.argv[2]

Sirens.useGtkViews()
Sirens.openPlayground({ filename: optionalFilename })