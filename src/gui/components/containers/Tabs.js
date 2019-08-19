const PrimitiveComponent = require('../PrimitiveComponent')
const TabsView = require('../../views/TabsView')

class Tabs extends PrimitiveComponent {
    /// Initializing

    createView() {
        return TabsView.new()
    }

    synchronizeViewFromModel() {
    }
}

module.exports = TabsView