const Classification = require('../../o-language/classifications/Classification')
const ObjectWithProps = require('../../o-language/classifications/ObjectWithProps')

class WidgetBuilder {
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

        this.setProps( props )
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

        this.bindYourself(closure, ...params)
    }

    normalizeArguments(props, closure) {
        if (typeof (props) == 'function') {
            closure = props
            props = {}
        }

        return [props, closure]
    }
}

module.exports = Classification.define(WidgetBuilder)