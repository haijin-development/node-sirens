const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')
const AppBrowserMenu = require('./AppBrowserMenu')
const AppBrowserBody = require('./AppBrowserBody')

class AppBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const selectedClassFlow = flow.getFlowPoint({ id: 'selectedFile.selectedFileObject' })

        componentsRenderer.render( function(component) {
            this.window( function() {
                this.styles({
                    id: 'window',
                    title: flow.getFlowPoint({ id: 'windowTitle' }),
                    width: 1200,
                    height: 600,
                })

                this.verticalStack( function() {

                    this.component(
                        AppBrowserMenu.new({
                            model: flow,
                            openFolder: () => {
                                const window = component.getChildComponent({ id: 'window' })
                                flow.pickAndOpenFolder({ parentWindow: window })
                            },
                            openPlayground: () => {
                                flow.openPlayground({ parentWindow: component })
                            },
                        })
                    )

                    this.spaceFiller( function() {
                        this.component(
                            AppBrowserBody.new({
                                model: flow,
                                window: component,
                            })
                        )
                    })

                })

            })
        })
    }
}

module.exports = Classification.define(AppBrowser)
