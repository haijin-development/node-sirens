const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const FileImageView = require('../../gtk-views/FileImageView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class FileImage {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Widget]
        this.implements = [ComponentBehaviourProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        return undefined
    }

    createView() {
        const filename = this.getProps().filename
        const width = this.getProps().width
        const height = this.getProps().height

        return FileImageView.new({
            filename: filename,
            width: width,
            height: height,
        })
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(FileImage)