const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

class ValueFlowContainerComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    reRenderWhen() {
        const flow = this.getModel()

        this.reRenderOnValueChangeOf( flow )
    }

    renderWith(componentsRenderer) {
        const getFlowComponentClosure = this.getProps().getFlowComponentClosure

        const flowComponent = getFlowComponentClosure()

        if( ! flowComponent ) { return }

        componentsRenderer.render( function(component) {

            this.component( flowComponent )

        })
    }
}

module.exports = Classification.define(ValueFlowContainerComponent)
