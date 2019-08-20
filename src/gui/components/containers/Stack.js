const Widget = require('../Widget')
const StackView = require('../../views/StackView')

class Stack extends Widget {
    /// Initializing

    createView() {
        return StackView.new(this.props.orientation)
    }

    synchronizeViewFromModel() {
    }

    addComponent(component) {
        component.view.packExpand = component.props.packExpand
        component.view.packFill = component.props.packFill
        component.view.packPadding = component.props.packPadding

        super.addComponent(component)
    }
}

module.exports = Stack