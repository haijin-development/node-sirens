const Classification = require('../../../O').Classification
const FolderPath = require('../../../O').FolderPath
const Path = require('./Path')
const PathProtocol = require('../../protocols/PathProtocol')
const Resource = require('../Resource')
const File = require('./File')

/*
    Wrapper on a Folder suitable for a tree folders browser.

    It is not redundant with O.FolderPath, it wraps it and adapts it to a tree component.
*/
class Folder {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Path]
        this.implements = [PathProtocol]
    }

    /// Asking

    isFolder() {
        return true
    }

    isFile() {
        return false
    }

    /// Querying

    getIcon() {
        return Resource.image.folder
    }

    getChildren() {
        const children = []

        const folderPath = FolderPath.new({ path: this.getPath() })

        folderPath.filesAndFoldersDo( (childPath) => {
            const child = childPath.isFolderPath() ?
                _Folder.new({ path: childPath })
                :
                File.new({ path: childPath })

            children.push( child )
        })

        return children
    }
}

const _Folder = Classification.define(Folder)

module.exports = _Folder
