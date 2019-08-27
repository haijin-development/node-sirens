const Classification = require('../../o-language/classifications/Classification')

class WidgetBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = ['props']
    }

    /// Initializing

    afterInstantiation() {
        this.props = {}
    }

    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.props = props
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

module.exports = Classification.define(WidgetBuilder)