const path = require('path')
const Classification = require('../../../o-language/classifications/Classification')
const PathProtocol = require('../../protocols/PathProtocol')

class Path {
    /// Definition

    static definition() {
        this.instanceVariables = ['path']
        this.expects = [PathProtocol]
    }

    /// Initializing

    initialize({ path: appPath }) {
        this.path = path.resolve(appPath)
    }

    /// Accessing

    getPath() {
        return this.path
    }

    /// Querying

    getBaseName() {
        return path.basename( this.path )
    }
}

module.exports = Classification.define(Path)
