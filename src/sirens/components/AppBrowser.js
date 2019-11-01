const Classification = require('../../o-language/classifications/Classification')
const ComponentInstantiator = require('../../gui/components/ComponentInstantiator')
const Component = require('../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../gui/protocols/ComponentProtocol_Implementation')
const AppBrowserMenu = require('./app-browser/AppBrowserMenu')
const AppBrowserBody = require('./app-browser/AppBrowserBody')
const AppBrowserModel = require('../models/AppBrowserModel')
const Sirens = require('../../Sirens')
const FolderChooser = require('../../gui/components/dialogs/FolderChooser')

class AppBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = ['lastOpenedFolder']
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    /**
     * Returns a new ObjectBrowserModel.
     * If the props include a props.object defined the that props.object is the browsed object,
     * otherwise the browsed object is undefined.
     */
    defaultModel() {
        return AppBrowserModel.new().yourself( (model) => {
            const appFolder = this.getProps().appFolder

            if( appFolder !== undefined ) {
                model.openFolder({ appFolder: appFolder })
            }
        })
    }

    /// Actions

    pickFolder() {
        const chosenFolder = FolderChooser.chooseFolder({
            title: 'Choose a folder',
            window: this,
            initialFolder: this.lastOpenedFolder,
        })

        if( chosenFolder !== null ) {
            this.lastOpenedFolder = chosenFolder
        }

        return chosenFolder        
    }

    openFolder() {
        const appFolder = this.pickFolder()

        if( appFolder === null ) {
            return
        }

        this.getModel().openFolder({ appFolder: appFolder })
    }

    openClassEditor() {
        const model = this.getModel()

        const selectedPath = model.getSelectedFilePath()

        if( selectedPath === null ) {
            Sirens.openClassEditor()
        } else {
            Sirens.openClassEditor({ filename: selectedPath })
        }
    }

    openClassDocumentation() {
        const model = this.getModel()

        const classesDefinitions = model.getClassesDefinitions()

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
                    title: model.getTitleModel(),
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
