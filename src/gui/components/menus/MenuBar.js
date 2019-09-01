const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const MenuBarView = require('../../views/MenuBarView')

class MenuBar {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    createView() {
        const label = this.getProps().label

        return MenuBarView.new()
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(MenuBar)