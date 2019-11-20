const path = require('path')
const fs = require('fs')
const Classification = require('../../../O').Classification
const Path = require('./Path')
const PathProtocol = require('../../protocols/PathProtocol')
const Resource = require('../Resource')
const File = require('./File')

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
        const folderContents = fs.readdirSync( this.getPath(), { withFileTypes: true } )

        const children = []

        folderContents.forEach( (eachPath) => {
            const fullPath = path.join( this.getPath(), eachPath.name )

            let child = null

            if( eachPath.isDirectory() ) {
                child = _Folder.new({ path: fullPath })
            } else {
                child = File.new({ path: fullPath })
            }

            children.push( child )
        })

        return children
    }
}

const _Folder = Classification.define(Folder)

module.exports = _Folder
