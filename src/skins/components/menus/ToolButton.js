const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const ToolButtonView = require('../../gtk-views/ToolButtonView')
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

        return ToolButtonView.new({
            imageProps: props.imageProps,
            label: props.label,
            tooltip: props.tooltip,
            action: (...params) => { this.handleAction(...params) },
        })
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