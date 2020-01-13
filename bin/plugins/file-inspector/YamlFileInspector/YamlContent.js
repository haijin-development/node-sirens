const Classification = require('../../../../src/O').Classification
const FileObject = require('../../../../src/sirens/objects/file-structure/FileObject')
const Resource = require('../../../../src/sirens/objects/Resource')

class YamlContent {
    /// Definition

    static definition() {
        this.instanceVariables = ['yamlObject']
        this.assumes = [FileObject]
    }

    setYamlObject({ yamlObject: yamlObject }) {
        this.yamlObject = yamlObject
    }

    getYamlObject() {
        return this.yamlObject
    }

    isYamlContent() {
        return true
    }

    getFileObjectType() {
        return 'yamlContent'
    }

    getFileObjectDescription() {
        return 'yaml object'
    }

    getIcon() {
        return Resource.image.object
    }
}

module.exports = Classification.define(YamlContent)
