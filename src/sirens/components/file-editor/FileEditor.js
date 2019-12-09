const path = require('path')
const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../Skins').ComponentInstantiator
const FileEditorFlow = require('../../flows/file-editor/FileEditorFlow')
const FileEditorMenu = require('./FileEditorMenu')
const ClassEditorBody = require('./ClassEditorBody')
const Sirens = require('../../../Sirens')

class FileEditor {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    /**
     * Returns a new FileEditorFlow.
     * If the props include a props.object defined the that props.object is the browsed object,
     * otherwise the browsed object is undefined.
     */
    defaultModel() {
        const flow = FileEditorFlow.new().asFlowPoint()

        if( this.getProps().filename ) {
            const filename = this.getProps().filename

            flow.openFile({ filename: filename })
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
                        FileEditorMenu.new({
                            model: flow,
                            openFile: () => { flow.pickAndOpenFile({ parentWindow: component }) },
                            openFileInNewWindow: () => { flow.pickAndOpenFileInNewWindow({ parentWindow: component }) },
                            saveFile: undefined,
                            openFileEditor: () => { flow.openFileEditor() },
                            openPlayground: () => { flow.openPlayground() },
                            openDocumentationBrowser: () => { flow.openDocumentationBrowser() },
                        })
                    )

                    this.component(
                        ClassEditorBody.new({
                            model: flow.getFlowPoint({ id: 'selectedFile' }),
                            openDocumentationBrowser: () => { flow.openDocumentationBrowser() },
                        })
                    )

                })
            })
        })
    }
}

module.exports = Classification.define(FileEditor)