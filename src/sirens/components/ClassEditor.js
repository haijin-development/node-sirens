const path = require('path')
const Classification = require('../../o-language/classifications/Classification')
const ComponentInstantiator = require('../../gui/components/ComponentInstantiator')
const Component = require('../../gui/components/Component')
const ClassEditorModel = require('../models/ClassEditorModel')
const ClassEditorMenu = require('./class-editor/ClassEditorMenu')
const ClassesComponent = require('./class-editor/ClassesComponent')
const ComponentProtocol_Implementation = require('../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../gui/protocols/ComponentProtocol')
const FileChooser = require('../../gui/components/dialogs/FileChooser')
const Sirens = require('../../Sirens')

class ClassEditor {
    /// Definition

    static definition() {
        this.instanceVariables = ['lastOpenedFolder']
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    /**
     * Returns a new ObjectBrowserModel.
     * If the props include a props.object defined the that props.object is the browsed object,
     * otherwise the browsed object is undefined.
     */
    defaultModel() {
        return ClassEditorModel.new().yourself( (model) => {
            const filename = this.getProps().filename

            if( filename !== undefined ) {
                model.openFile( { filename: filename })
            }
        })
    }

    /// Actions

    pickFile() {
        const filename = FileChooser.openFile({
            title: 'Choose a file',
            window: this,
            initialFolder: this.lastOpenedFolder,
        })

        if( filename !== null ) {
            this.lastOpenedFolder = path.dirname( filename )
        }

        return filename        
    }

    openFile() {
        const filename = this.pickFile()

        if( filename === null ) {
            return
        }

        this.getModel().openFile({ filename: filename })

        this.showFirstTabPage()
    }

    openFileInNewWindow() {
        const filename = this.pickFile()

        if( filename === null ) {
            return
        }

        Sirens.openClassEditor({ filename: filename })
    }

    saveFile() {
        const tabsComponent = this.getChildComponent({ id: 'tabs' })

        const selectedPageComponent = tabsComponent.getSelectedPageComponent()

        const selectedPageModel = selectedPageComponent.getModel()

        this.getModel().saveFile({ selectedPageModel: selectedPageModel })
    }

    showFirstTabPage() {
        const tabsComponent = this.getChildComponent({ id: 'tabs' })

        tabsComponent.showTabPageAt({ index: 0 })
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {
            this.window( function() {
                this.styles({
                    title: model.getSourceFilenameModel(),
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function() {

                    this.component(
                        ClassEditorMenu.new({
                            model: model,
                            openFile: component.openFile.bind(component),
                            openFileInNewWindow: component.openFileInNewWindow.bind(component),
                            saveFile: component.saveFile.bind(component),
                        })
                    )

                    this.component(
                        ClassesComponent.new({
                            model: model.getClassesDefinitionsModel(),
                            footerModel: model.getFooterSourceCodeModel(),
                        })
                    )

                })
            })
        })

        this.showFirstTabPage()
    }
}

module.exports = Classification.define(ClassEditor)