const path = require('path')
const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../Skins').ComponentInstantiator
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
        const flow = ClassEditorFlow.new().asFlowPoint()

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
                        ClassEditorMenu.new({
                            model: flow,
                            openFile: () => { flow.pickAndOpenFile({ parentWindow: component }) },
                            openFileInNewWindow: () => { flow.pickAndOpenFileInNewWindow({ parentWindow: component }) },
                            saveFile: undefined,
                            openClassEditor: () => { flow.openClassEditor() },
                            openPlayground: () => { flow.openPlayground() },
                            openDocumentationBrowser: () => { flow.openDocumentationBrowser() },
                        })
                    )

                    this.component(
                        ClassEditorBody.new({
                            model: flow.getFlowPoint({ id: 'sourceFileEdition' }),
                            openDocumentationBrowser: () => { flow.openDocumentationBrowser() },
                        })
                    )

                })
            })
        })
    }
}

module.exports = Classification.define(ClassEditor)