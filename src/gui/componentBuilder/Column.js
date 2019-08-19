const OInstance = require('../../o-language/classifications/OInstance')

class Column {
    /// Instantiating

    static withProps(props) {
        props = Object.assign( props, {type: 'string', label: ''} )

        return OInstance.new().yourself( (column) => {
            column
                .behaveAs(this)
                .setProps(props)
        })
    }

    /// Definition

    static definition() {
        this.instanceVariables = ['props']
    }

    /// Accessing

    setProps(props) {
        this.props = props
    }

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