const Widget = require('../Widget')
const TabsView = require('../../views/TabsView')

class Tabs extends Widget {
    /// Initializing

    createView() {
        return TabsView.new()
    }

    synchronizeViewFromModel() {
    }
}

module.exports = TabsView