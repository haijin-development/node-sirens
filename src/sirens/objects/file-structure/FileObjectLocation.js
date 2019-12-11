const Classification = require('../../../O').Classification

class FileObjectLocation {
    /// Definition

    static definition() {
        this.instanceVariables = ['file', 'positionInFile']
    }

    /// Initializing

}

module.exports = Classification.define(FileObjectLocation)
