const OInstance = require('../../o-language/classifications/OInstance')

class WidgetBuilder {
    /// Instantiating

    static new() {
        return this.withProps({})
    }

    static withProps(props) {
        const propsCopy = Object.assign( {}, props )

        return OInstance.new()
            .behaveAs(this)
            .mergeProps(propsCopy)
    }

    /// Definition

    static definition() {
        this.instanceVariables = ['props']
    }

    /// Initializing

    afterInstantiation() {
        this.props = {}
    }

    /// Accessing

    getProps() {
        return this.props
    }

    mergeProps(additionalProps) {
        this.props = Object.assign(this.props, additionalProps)

        return this
    }

    /// Setting props

    model(model) {
        this.mergeProps({ model: model })
    }

    styles(props) {
        this.mergeProps(props)
    }

    handlers(props) {
        this.mergeProps(props)
    }

    popupMenu(populatePopupMenuBlock) {
        this.mergeProps({ populatePopupMenuBlock: populatePopupMenuBlock })
    }

    /// Building

    build(closure, ...params) {
        if( closure === undefined ) { return }

        closure.call(this, ...params)
    }
}

module.exports = WidgetBuilder