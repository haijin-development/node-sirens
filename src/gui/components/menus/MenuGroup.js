const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const MenuGroupView = require('../../views/MenuGroupView')

class MenuGroup {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    createView() {
        const label = this.getProps().label

        return MenuGroupView.new({ label: label })
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(MenuGroup)