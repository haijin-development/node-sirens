const PrimitiveComponent = require('../PrimitiveComponent')
const StackView = require('../../views/StackView')

class Stack extends PrimitiveComponent {
    /// Initializing

    createView() {
        return new StackView(this.props.orientation)
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