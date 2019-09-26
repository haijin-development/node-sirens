const Classification = require('../../o-language/classifications/Classification')
const ObjectWithProps = require('../../o-language/classifications/ObjectWithProps')

class Column {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectWithProps]
    }

    /// Initializing

    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        props = Object.assign( {label: ''}, props )

        this.setProps( props )
    }

    /// Asking

    isImage() {
        return this.hasImageBlock()
    }

    hasTextBlock() {
        return this.hasProp({ key: 'getTextBlock' })
    }

    hasImageBlock() {
        return this.hasProp({ key: 'getImageBlock' })
    }

    /// Accessing

    getLabel() {
        return this.getProp({ key: 'label' })
    }

    getTextBlock() {
        return this.getProp({ key: 'getTextBlock' })
    }

    getImageBlock() {
        return this.getProp({ key: 'getImageBlock' })
    }

    getType() {
        if( this.isImage() ) {
            return 'image'
        }

        return 'string'
    }

    getDisplayTextOf({ item: item, onUndefined: undefinedHandler }) {
        if( ! this.hasTextBlock() ) {
            return item.toString()
        }

        const textBlock = this.getTextBlock()

        const text = textBlock(item)

        if(text === undefined) {
            undefinedHandler()
        }

        return text
    }

    getImageFileOf({ item: item, onUndefined: undefinedHandler }) {
        const imageBlock = this.getImageBlock()

        const filename = imageBlock(item)

        if(filename === undefined) {
            undefinedHandler()
        }

        return filename
    }

    getImageWidth() {
        return this.getProp({ key: 'imageWidth' })
    }

    getImageHeight() {
        return this.getProp({ key: 'imageHeight' })
    }
}


module.exports = Classification.define(Column)