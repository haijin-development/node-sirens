const Classification = require('../../../O').Classification
const Path = require('./Path')
const PathProtocol = require('../../protocols/PathProtocol')
const Resource = require('../Resource')

/*
    Wrapper on a File suitable for a tree folders browser.

    It is not redundant with O.FilePath, it wraps it and adapts it to a tree component.
*/
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
