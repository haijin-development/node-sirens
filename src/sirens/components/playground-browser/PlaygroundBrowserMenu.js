const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const PlaygroundBrowserMenuBar = require('./PlaygroundBrowserMenuBar')
const PlaygroundBrowserToolBar = require('./PlaygroundBrowserToolBar')

class PlaygroundBrowserMenu {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const props = this.getProps()

        componentsRenderer.render(function (component) {

            this.verticalStack( function() {

                this.styles({
                    viewAttributes: {
                        stackSize: 'fixed',
                    }
                })

                this.component(
                    PlaygroundBrowserMenuBar.new( props )
                )

                this.component(
                    PlaygroundBrowserToolBar.new( props )
                )

            })

        })
    }
}

module.exports = Classification.define(PlaygroundBrowserMenu)
