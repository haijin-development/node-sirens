const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../Skins').ComponentInstantiator
const FolderChooser = require('../../../Skins').FolderChooser
const AppBrowserMenu = require('./AppBrowserMenu')
const AppBrowserBody = require('./AppBrowserBody')
const AppBrowserModel = require('../../models/app-browser/AppBrowserModel')
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
     * Returns a new AppBrowserModel.
     * If the props include a props.object defined the that props.object is the browsed object,
     * otherwise the browsed object is undefined.
     */
    defaultModel() {
        const model = AppBrowserModel.new()

        const appFolderPath = this.getProps().appFolder

        if( appFolderPath ) {
            model.openFolder({ path: appFolderPath })
        }

        return model
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

        this.getModel().openFolder({ path: appFolderPath })
    }

    openClassEditor() {
        const model = this.getModel()

        const selectedPath = model.getSelectedFilePath()

        Sirens.openClassEditor({ filename: selectedPath })
    }

    openClassDocumentation() {
        const model = this.getModel()

        const classesDefinitions = model.getClassesDefinitionsInSelectedFile()

        if( classesDefinitions.length === 0 ) { return }

        Sirens.browseClassDocumentation({
            classDefinition: classesDefinitions[0],
        })
    }

    openPlayground() {
        Sirens.openPlayground()
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
                            openClassEditor: component.openClassEditor.bind(component),
                            openClassDocumentation: component.openClassDocumentation.bind(component),
                            openPlayground: component.openPlayground.bind(component),
                        })
                    )

                    this.component(
                        AppBrowserBody.new({
                            model: model,
                            openClassEditor: component.openClassEditor.bind(component),
                            openClassDocumentation: component.openClassDocumentation.bind(component),
                        })
                    )

                })

            })
        })
    }
}

module.exports = Classification.define(AppBrowser)
