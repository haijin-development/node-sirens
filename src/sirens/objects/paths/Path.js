const path = require('path')
const Classification = require('../../../O').Classification
const PathProtocol = require('../../protocols/PathProtocol')

/*
    Wrapper on a path suitable for a tree folders browser.

    It is not redundant with O.Path, it wraps it and adapts it to a tree component.
*/
class Path {
    /// Definition

    static definition() {
        this.instanceVariables = ['path']
        this.expects = [PathProtocol]
    }

    /// Initializing

    initialize({ path: path }) {
        this.path = path
    }

    /// Accessing

    getPath() {
        return this.path
    }

    /// Querying

    getBaseName() {
        return this.path.getBaseName()
    }
}

module.exports = Classification.define(Path)
