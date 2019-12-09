const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../Skins').ComponentInstantiator
const FileChooser = require('../../../Skins').FileChooser
const PlaygroundComponent = require('../shared/PlaygroundComponent')
const PlaygroundBrowserMenu = require('./PlaygroundBrowserMenu')
const PlaygroundBrowserFlow = require('../../flows/playground/PlaygroundBrowserFlow')
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
     * Returns a new PlaygroundBrowserFlow.
     * If the props include a props.object defined the that props.object is the browsed object,
     * otherwise the browsed object is undefined.
     */
    defaultModel() {
        const flow = PlaygroundBrowserFlow.new().asFlowPoint()

        if( this.getProps().filename !== undefined ) {
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
                    id: 'window',
                    title: flow.getFlowPoint({ id: 'windowTitle' }),
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function() {

                    this.component(
                        PlaygroundBrowserMenu.new({
                            model: flow,
                            openFile: () => { flow.pickAndOpenFile({ parentWindowd: component }) },
                            openFileInNewWindow: () => { flow.pickAndOpenFileInNewWindow({ parentWindowd: component }) },
                            saveFile: () => { flow.saveFile() },
                            openFileEditor: () => { flow.openFileEditor() },
                            openPlayground: () => { flow.openPlayground() },
                        })
                    )

                    this.component(
                        PlaygroundComponent.new({
                            model: flow.getFlowPoint({ id: 'fileContents' }),
                        })
                    )

                })
            })
        })
    }
}

module.exports = Classification.define(PlaygroundBrowser)
