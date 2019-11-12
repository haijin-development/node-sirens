const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const MenuItemSeparatorView = require('../../gtk-views/MenuItemSeparatorView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class MenuItemSeparator {
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
        return MenuItemSeparatorView.new( this.getProps() )
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(MenuItemSeparator)