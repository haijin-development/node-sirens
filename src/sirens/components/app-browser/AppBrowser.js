const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../Skins').ComponentInstantiator
const FolderChooser = require('../../../Skins').FolderChooser
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
        const model = AppBrowserFlow.new()

        const appFolderPath = this.getProps().appFolder

        if( appFolderPath ) {
            model.openFolder({ path: appFolderPath })
        }

        return model
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {
            this.window( function() {
                this.styles({
                    title: model.getChild({ id: 'windowTitle' }),
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function() {

                    this.component(
                        AppBrowserMenu.new({
                            model: model,
                            openFolder: component.openFolder.bind(component),
                            openClassEditor: model.getActionHandler({ id: 'openClassEditor' }),
                            openClassDocumentation: model.getActionHandler({ id: 'openClassDocumentation' }),
                            openPlayground: model.getActionHandler({ id: 'openPlayground' }),
                        })
                    )

                    this.component(
                        AppBrowserBody.new({
                            model: model,
                            openClassEditor: model.getActionHandler({ id: 'openClassEditor' }),
                            openClassDocumentation: model.getActionHandler({ id: 'openClassDocumentation' }),
                        })
                    )

                })

            })
        })
    }

    /// Actions

    pickFolder() {
        const chosenFolder = FolderChooser.chooseFolder({
            title: 'Choose a folder',
            window: this,
            initialFolder: this.getModel().getLastOpenedFolder(),
        })

        return chosenFolder        
    }

    openFolder() {
        const appFolderPath = this.pickFolder()

        if( appFolderPath === null ) { return }

        const handler = this.getModel().getActionHandler({ id: 'openApplicationFolder' })

        handler({ folderPath: appFolderPath })
    }
}

module.exports = Classification.define(AppBrowser)
