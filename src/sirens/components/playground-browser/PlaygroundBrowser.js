const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')
const PlaygroundComponent = require('../shared/PlaygroundComponent')
const PlaygroundBrowserMenu = require('./PlaygroundBrowserMenu')

class PlaygroundBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = ['playgroundTextModel']
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
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
                            openFile: () => {
                                const window = component.getChildComponent({ id: 'window' })
                                flow.pickAndOpenFile({ parentWindow: window })
                            },
                            openFileInNewWindow: () => {
                                const window = component.getChildComponent({ id: 'window' })
                                flow.pickAndOpenFileInNewWindow({ parentWindowd: window })
                            },
                            saveFile: () => { flow.saveFile() },
                            openPlayground: () => { flow.openPlayground() },
                        })
                    )

                    this.spaceFiller( function() {
                        this.component(
                            PlaygroundComponent.new({
                                model: flow.getFlowPoint({ id: 'fileContents' }),
                            })
                        )
                    })
                })
            })
        })
    }
}

module.exports = Classification.define(PlaygroundBrowser)
