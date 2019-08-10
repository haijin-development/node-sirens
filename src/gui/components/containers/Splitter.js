const PrimitiveComponent = require('../PrimitiveComponent')
const SplitterView = require('../../views/SplitterView')

class Splitter extends PrimitiveComponent {
    /// Initializing

    createView() {
        return new SplitterView(this.props.orientation)
    }

    synchronizeViewFromModel() {
    }

    addComponent(component) {
        component.view.splitProportion = component.props.splitProportion

        super.addComponent(component)
    }
}

module.exports = Splitter