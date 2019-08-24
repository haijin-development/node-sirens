const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const TabsView = require('../../views/TabsView')

class Tabs extends Classification {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    createView() {
        return TabsView.new()
    }

    synchronizeViewFromModel() {
    }
}

module.exports = TabsView