const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const TabsView = require('../../views/TabsView')

const Tabs = Classification.define( class {
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
})

module.exports = TabsView