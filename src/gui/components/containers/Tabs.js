const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const TabsView = require('../../gtk-views/TabsView')

class Tabs {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Queyring

    getSelectedPageComponent() {
        const selectedPageIndex = this.getView().getSelectedPageIndex()

        return this.getComponents()[selectedPageIndex]
    }

    /// Initializing

    createView() {
        return TabsView.new()
    }

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(Tabs)