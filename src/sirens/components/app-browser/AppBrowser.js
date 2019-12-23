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

        const selectedClassFlow = flow.getFlowPoint({ id: 'selectedFile.selectedFileObject' })

        componentsRenderer.render( function(component) {
            this.window( function() {
                this.styles({
                    title: flow.getFlowPoint({ id: 'windowTitle' }),
                    width: 1200,
                    height: 600,
                })

                this.verticalStack( function() {

                    this.component(
                        AppBrowserMenu.new({
                            model: flow,
                            openFolder: () => { flow.pickAndOpenFolder({ parentWindow: component }) },
                            openPlayground: () => { flow.openPlayground({ parentWindow: component }) },
                        })
                    )

                    this.component(
                        AppBrowserBody.new({
                            model: flow,
                        })
                    )

                })

            })
        })
    }
}

module.exports = Classification.define(AppBrowser)
