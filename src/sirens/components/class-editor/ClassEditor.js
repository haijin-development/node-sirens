const path = require('path')
const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../Skins').ComponentInstantiator
const FileChooser = require('../../../Skins').FileChooser
const ClassEditorModel = require('../../models/class-editor/ClassEditorModel')
const ClassEditorMenu = require('./ClassEditorMenu')
const ClassEditorBody = require('./ClassEditorBody')
const Sirens = require('../../../Sirens')

class ClassEditor {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    /**
     * Returns a new ClassEditorModel.
     * If the props include a props.object defined the that props.object is the browsed object,
     * otherwise the browsed object is undefined.
     */
    defaultModel() {
        const model = ClassEditorModel.new()

        if( this.getProps().filename ) {
            const filename = this.getProps().filename

            model.openFile({ filename: filename })
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
                        ClassEditorMenu.new({
                            openFile: component.openFile.bind(component),
                            openFileInNewWindow: component.openFileInNewWindow.bind(component),
                            saveFile: component.saveFile.bind(component),
                            openClassEditor: component.openClassEditor.bind(component),
                            openPlayground: component.openPlayground.bind(component),
                            openDocumentationBrowser: component.openDocumentationBrowser.bind(component),
                        })
                    )

                    this.component(
                        ClassEditorBody.new({
                            model: model.getChild({ id: 'sourceFileEdition' }),
                            openDocumentationBrowser: component.openDocumentationBrowser.bind(component),
                        })
                    )

                })
            })
        })
    }

    /// Actions

    pickFile() {
        const filename = FileChooser.openFile({
            title: 'Choose a file',
            window: this,
            initialFolder: this.getModel().getLastOpenedFolder(),
        })

        return filename        
    }

    openFile() {
        const filename = this.pickFile()

        if( filename === null ) { return }

        this.getModel().openFile({ filename: filename })
    }

    openFileInNewWindow() {
        const filename = this.pickFile()

        if( filename === null ) { return }

        this.openClassEditor({ filename: filename })
    }

    openClassEditor({ filename: filename } = { filename: undefined }) {
        const model = this.getModel().getChild({ id: 'sourceFileEdition' })

        if( filename === undefined ) {
            filename = model.getSourceFile().getFilePath()
        }

        Sirens.openClassEditor({ filename: filename })
    }

    openPlayground() {
        Sirens.openPlayground()
    }

    openDocumentationBrowser() {
        const model = this.getModel().getChild({ id: 'sourceFileEdition' })

        const fileSection = model.getSelectedClassDefinition()

        if( fileSection === null ) { return }

        const methodName = model.getSelectedMethodName()

        Sirens.browseClassDocumentation({ classDefinition: fileSection, methodName: methodName })
    }
}

module.exports = Classification.define(ClassEditor)