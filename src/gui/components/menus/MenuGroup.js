const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const MenuGroupView = require('../../gtk-views/MenuGroupView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class MenuGroup {
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

        return MenuGroupView.new({ label: label })
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(MenuGroup)