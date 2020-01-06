const Classification = require('../../../O').Classification
const Widget = require('../Widget')
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
        const view = this.namespace().Views.MenuItemView.new( this.getProps() )

        view.assemble()

        return view
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(MenuItem)