const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const MenuItemView = require('../../gtk-views/MenuItemView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class MenuItem {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Widget]
        this.implements = [ComponentBehaviourProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        return undefined
    }

    createView() {
        return MenuItemView.new( this.getProps() )
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(MenuItem)