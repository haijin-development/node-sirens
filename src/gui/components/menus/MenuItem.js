const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const MenuItemView = require('../../views/MenuItemView')

class MenuItem {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    createView() {
        return MenuItemView.new( this.getProps() )
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(MenuItem)