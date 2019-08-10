const PrimitiveComponent = require('../PrimitiveComponent')
const TabsView = require('../../views/TabsView')

class Tabs extends PrimitiveComponent {
    /// Initializing

    createView() {
        return new TabsView()
    }

    synchronizeViewFromModel() {
    }
}

module.exports = TabsView