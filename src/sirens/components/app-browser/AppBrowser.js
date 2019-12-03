const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../Skins').ComponentInstantiator
const AppBrowserMenu = require('./AppBrowserMenu')
const AppBrowserBody = require('./AppBrowserBody')
const AppBrowserFlow = require('../../flows/app-browser/AppBrowserFlow')
const Sirens = require('../../../Sirens')

class AppBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    /**
     * Returns a new AppBrowserFlow.
     * If the props include a props.object defined the that props.object is the browsed object,
     * otherwise the browsed object is undefined.
     */
    defaultModel() {
        const flow = AppBrowserFlow.new().asFlowPoint()

        const appFolderPath = this.getProps().appFolder

        if( appFolderPath ) {
            flow.openFolder({ folderPath: appFolderPath })
        }

        return flow
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render( function(component) {
            this.window( function() {
                this.styles({
                    title: flow.getFlowPoint({ id: 'windowTitle' }),
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function() {

                    this.component(
                        AppBrowserMenu.new({
                            model: flow,
                            openFolder: () => { flow.pickAndOpenFolder({ parentWindow: component }) },
                            openClassEditor: () => { flow.openClassEditor({ parentWindow: component }) },
                            openClassDocumentation: () => { flow.openClassDocumentation({ parentWindow: component }) },
                            openPlayground: () => { flow.openPlayground({ parentWindow: component }) },
                        })
                    )

                    this.component(
                        AppBrowserBody.new({
                            model: flow,
                            openClassEditor: () => { flow.openClassEditor({ parentWindow: component }) },
                            openClassDocumentation: () => { flow.openClassDocumentation({ parentWindow: component }) },
                        })
                    )

                })

            })
        })
    }
}

module.exports = Classification.define(AppBrowser)
