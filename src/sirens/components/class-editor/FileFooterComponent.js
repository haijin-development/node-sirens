const path = require('path')
const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')

class FileFooterComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.behaveAsTabsPageBuilder()

        componentsRenderer.render( function(component) {

            this.tabPage({ label: 'Footer', fixedPosition: -1 }, function() {
                this.text({
                    model: model,
                    splitProportion: 1.0 / 2,
                })
            })

        })
    }
}

module.exports = Classification.define(FileFooterComponent)
