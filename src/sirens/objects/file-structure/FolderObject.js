const Classification = require('../../../O').Classification
const UknownFileStructure = require('./UknownFileStructure')
const Resource = require('../Resource')

class FolderObject {
    /// Definition

    static definition() {
        this.instanceVariables = ['sourceFile']
        this.assumes = [UknownFileStructure]
    }

    getFileObjectDescription() {
        return 'Folder'
    }

    getFileObjectType() {
        return 'folder'
    }

    getIcon() {
        return Resource.image.folder
    }
}

module.exports = Classification.define(FolderObject)
