const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Container {

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
        const hasScrollBars = this.getProps().hasScrollBars

        const view = this.namespace().Views.ContainerView.new({ hasScrollBars: hasScrollBars })

        view.assemble()

        return view
    }

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(Container)