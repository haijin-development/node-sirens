const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const AppBrowserMenuBar = require('./AppBrowserMenuBar')
const AppBrowserToolBar = require('./AppBrowserToolBar')

class AppBrowserMenu {
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
                    AppBrowserMenuBar.new( props )
                )

                this.component(
                    AppBrowserToolBar.new( props )
                )

            })

        })
    }
}

module.exports = Classification.define(AppBrowserMenu)
