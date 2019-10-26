const Classification = require('../../../o-language/classifications/Classification')
const Path = require('./Path')
const PathProtocol = require('../../protocols/PathProtocol')
const Resource = require('../Resource')

class File {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Path]
        this.implements = [PathProtocol]
    }

    /// Asking

    isFolder() {
        return false
    }

    isFile() {
        return true
    }


    /// Querying

    getIcon() {
        return Resource.image.file
    }

    getChildren() {
        return []
    }
}

module.exports = Classification.define(File)
