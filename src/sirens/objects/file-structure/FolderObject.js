const Classification = require('../../../O').Classification
const UknownFileStructure = require('./UknownFileStructure')

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
}

module.exports = Classification.define(FolderObject)
