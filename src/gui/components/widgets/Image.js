const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const ImageView = require('../../gtk-views/ImageView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Image {
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
        const props = this.getProps()

        return ImageView.new({
            imageProps: {
                filename: props.filename,
                width: props.width,
                height: props.height,
                iconName: props.iconName,
                size: props.size,
            }
        })
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(Image)