const path = require('path')
const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../Skins').ComponentInstantiator
const FileChooser = require('../../../Skins').FileChooser
const ClassEditorFlow = require('../../flows/class-editor/ClassEditorFlow')
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
     * Returns a new ClassEditorFlow.
     * If the props include a props.object defined the that props.object is the browsed object,
     * otherwise the browsed object is undefined.
     */
    defaultModel() {
        const model = ClassEditorFlow.new()

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
                            model: model,
                            openFile: component.openFile.bind(component),
                            openFileInNewWindow: component.openFileInNewWindow.bind(component),
                            saveFile: undefined,
                            openClassEditor: model.getActionHandler({ id: 'openClassEditor' }),
                            openPlayground: model.getActionHandler({ id: 'openPlayground' }),
                            openDocumentationBrowser: model.getActionHandler({ id: 'openDocumentationBrowser' }),
                        })
                    )

                    this.component(
                        ClassEditorBody.new({
                            model: model.getChild({ id: 'sourceFileEdition' }),
                            openDocumentationBrowser: model.getActionHandler({ id: 'openDocumentationBrowser' }),
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

        this.getModel().getActionHandler({ id: 'openFile' })({ filename: filename })
    }

    openFileInNewWindow() {
        const filename = this.pickFile()

        if( filename === null ) { return }

        this.getModel().getActionHandler({ id: 'openFileInNewWindow' })({ filename: filename })
    }
}

module.exports = Classification.define(ClassEditor)