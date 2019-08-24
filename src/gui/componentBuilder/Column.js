const Classification = require('../../o-language/classifications/Classification')

class Column extends Classification {
    /// Definition

    static definition() {
        this.instanceVariables = ['props']
    }

    /// Initializing

    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        props = Object.assign( props, {type: 'string', label: ''} )

        this.props = props
    }

    /// Accessing

    getLabel() {
        return this.props.label
    }

    getType() {
        return this.props.type
    }

    getDisplayTextOf(item) {
        if(this.props.getTextBlock === undefined) {
            return item.toString()
        }

        return this.props.getTextBlock(item)
    }
}

module.exports = Column