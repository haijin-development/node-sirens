const path = require('path')
const Classification = require('../../O').Classification
const Component = require('../../GUI').Component
const ComponentProtocol_Implementation = require('../../GUI').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../GUI').ComponentInstantiator
const BufferedAttributeModel = require('../../GUI').BufferedAttributeModel
const PlaygroundComponent = require('./shared/PlaygroundComponent')
const PlaygroundBrowserMenu = require('./playground-browser/PlaygroundBrowserMenu')
const PlaygroundBrowserModel = require('../models/PlaygroundBrowserModel')
const FileChooser = require('../../GUI').FileChooser
const Sirens = require('../../Sirens')

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

        model.onValueChanged( this.onOpenedFileChanged.bind(this) )

        return model
    }

    /*
     Method(`
        Besides initializing the PlaygroundBrowserModel initialize another one for the Playrground component.
     `)

     Tags([
        'implementation', 'initializing'
     ])
    */
    initializeModel() {
        this.previousClassificationDo( () => {
            this.initializeModel()
        })

        this.playgroundTextModel = BufferedAttributeModel.new({
            attributeReader: (object) => { 
                return object ? object.getFileContents() : '' }
        })

        if( this.getProps().filename !== undefined ) {
            this.getModel().openFile({ filename: this.getProps().filename })
        }
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const playgroundModel = this.playgroundTextModel

        componentsRenderer.render( function(component) {
            this.window( function() {
                this.styles({
                    id: 'window',
                    title: model.getWindowTitle(),
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
                            id: 'playground',
                            model: playgroundModel,
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

        if( filename !== null ) {
            const lastOpenedFolder = path.dirname( filename )

            this.getModel().setLastOpenedFolder( lastOpenedFolder )
        }

        return filename        
    }

    openFile() {
        const filename = this.pickFile()

        if( filename === null ) {
            return
        }

        this.getModel().openFile({ filename: filename })
    }

    openFileInNewWindow() {
        const filename = this.pickFile()

        if( filename === null ) {
            return
        }

        Sirens.openPlayground({ filename: filename })
    }

    saveFile() {
        const fileTextContents = this.playgroundTextModel.getValue()

        this.getModel().saveFile({ fileContents: fileTextContents })
    }

    openClassEditor() {
        Sirens.openClassEditor()
    }

    openPlayground() {
        Sirens.openPlayground()
    }

    /// Events

    onOpenedFileChanged() {
        const model = this.getModel()

        this.playgroundTextModel.setObject( model.getSourceFile() )

        const window = this.getChildComponent({ id: 'window', ifNone: null })

        if( window === null ) { return }

        window.mergeProps({
            title: model.getWindowTitle(),
        })
    }
}

module.exports = Classification.define(PlaygroundBrowser)
