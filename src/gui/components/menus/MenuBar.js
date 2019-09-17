const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const MenuBarView = require('../../gtk-views/MenuBarView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class MenuBar {
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
        const label = this.getProps().label

        return MenuBarView.new()
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(MenuBar)