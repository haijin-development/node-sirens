const Classification = require('../../../O').Classification
const Component = require('../../../GUI').Component
const ComponentProtocol_Implementation = require('../../../GUI').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../GUI').ComponentInstantiator
const FileChooser = require('../../../GUI').FileChooser
const PlaygroundComponent = require('../shared/PlaygroundComponent')
const PlaygroundBrowserMenu = require('./PlaygroundBrowserMenu')
const PlaygroundBrowserModel = require('../../models/playground/PlaygroundBrowserModel')
const Sirens = require('../../../Sirens')

class PlaygroundBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = ['playgroundTextModel']
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    /**
     * Returns a new PlaygroundBrowserModel.
     * If the props include a props.object defined the that props.object is the browsed object,
     * otherwise the browsed object is undefined.
     */
    defaultModel() {
        const model = PlaygroundBrowserModel.new()

        if( this.getProps().filename !== undefined ) {
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
                    id: 'window',
                    title: model.getChild({ id: 'windowTitle' }),
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function() {

                    this.component(
                        PlaygroundBrowserMenu.new({
                            openFile: component.openFile.bind(component),
                            openFileInNewWindow: component.openFileInNewWindow.bind(component),
                            saveFile: component.saveFile.bind(component),
                            openClassEditor: component.openClassEditor.bind(component),
                            openPlayground: component.openPlayground.bind(component),
                        })
                    )

                    this.component(
                        PlaygroundComponent.new({
                            model: model.getChild({ id: 'fileContents' }),
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

        Sirens.openPlayground({ filename: filename })
    }

    saveFile() {
        this.getModel().saveOpenedFile()
    }

    openClassEditor() {
        Sirens.openClassEditor()
    }

    openPlayground() {
        Sirens.openPlayground()
    }
}

module.exports = Classification.define(PlaygroundBrowser)
