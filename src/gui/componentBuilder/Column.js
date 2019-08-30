const Classification = require('../../o-language/classifications/Classification')

class Column {
    /// Definition

    static definition() {
        this.instanceVariables = ['props']
    }

    /// Initializing

    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        props = Object.assign( props, {label: ''} )

        this.props = props
    }

    /// Asking

    isImage() {
        return this.props.getImageBlock !== undefined
    }

    /// Accessing

    getLabel() {
        return this.props.label
    }

    getType() {
        if( this.isImage() ) {
            return 'image'
        }

        return 'string'
    }

    getDisplayTextOf(item, errorHandler) {
        if(this.props.getTextBlock === undefined) {
            return item.toString()
        }

        const text = this.props.getTextBlock(item)

        if(text === undefined) {
            errorHandler()
        }

        return text
    }

    getImageFileOf(item, errorHandler) {
        const filename = this.props.getImageBlock(item)

        if(filename === undefined) {
            errorHandler()
        }

        return filename
    }

    getImageWidth() {
        return this.props.imageWidth
    }

    getImageHeight() {
        return this.props.imageHeight
    }
}


module.exports = Classification.define(Column)