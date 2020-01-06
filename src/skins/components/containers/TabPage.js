const Classification = require('../../../O').Classification
const ComponentBehaviour = require('../ComponentBehaviour')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class TabPage {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ComponentBehaviour]
        this.implements = [ComponentBehaviourProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        return undefined
    }

    createView() {
        const view = this.namespace().Views.TabPageView.new()

        view.assemble()

        return view
    }

    getMainComponent() {
        throw Error(`The ${this.constructor.name} has no main child component.`)
    }

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(TabPage)