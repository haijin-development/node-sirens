const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class ToolButton {
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
        const props = this.getProps()

        const view = this.namespace().Views.ToolButtonView.new({
            imageProps: props.imageProps,
            label: props.label,
            tooltip: props.tooltip,
            action: (...params) => { this.handleAction(...params) },
        })

        view.assemble()

        return view
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }

    handleAction(...params) {
        const handler = this.getProps().action

        handler( ...params )
    }
}

module.exports = Classification.define(ToolButton)