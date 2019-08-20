const Widget = require('../Widget')
const SplitterView = require('../../views/SplitterView')

class Splitter extends Widget {
    /// Initializing

    createView() {
        return SplitterView.new(this.props.orientation)
    }

    synchronizeViewFromModel() {
    }

    addComponent(component) {
        component.view.splitProportion = component.props.splitProportion

        super.addComponent(component)
    }
}

module.exports = Splitter