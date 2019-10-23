const path = require('path')
const Classification = require('../../o-language/classifications/Classification')
const ComponentInstantiator = require('../../gui/components/ComponentInstantiator')
const Component = require('../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../gui/protocols/ComponentProtocol_Implementation')
const PlaygroundComponent = require('./shared/PlaygroundComponent')
const PlaygroundBrowserMenu = require('./playground-browser/PlaygroundBrowserMenu')
const PlaygroundBrowserModel = require('../models/PlaygroundBrowserModel')
const FileChooser = require('../../gui/components/dialogs/FileChooser')
const Sirens = require('../../Sirens')

class PlaygroundBrowser {
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
        return PlaygroundBrowserModel.new().yourself( (model) => {
            const filename = this.getProps().filename

            if( filename !== undefined ) {
                model.openFile({ filename: filename })
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
    }

    openFileInNewWindow() {
        const filename = this.pickFile()

        if( filename === null ) {
            return
        }

        Sirens.openPlayground({ filename: filename })
    }

    saveFile() {
        this.getModel().saveFile()
    }

    openClassEditor() {
        Sirens.openClassEditor()
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
                        PlaygroundBrowserMenu.new({
                            model: model,
                            openFile: component.openFile.bind(component),
                            openFileInNewWindow: component.openFileInNewWindow.bind(component),
                            saveFile: component.saveFile.bind(component),
                            openClassEditor: component.openClassEditor.bind(component),
                            openPlayground: component.openPlayground.bind(component),
                        })
                    )

                    this.component(
                        PlaygroundComponent.new({
                            model: model.getPlaygroundTextModel(),
                        })
                    )

                })
            })
        })
    }
}

module.exports = Classification.define(PlaygroundBrowser)
