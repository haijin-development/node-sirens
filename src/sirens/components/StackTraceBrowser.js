const Classification = require('../../o-language/classifications/Classification')
const ComponentInstantiator = require('../../gui/components/ComponentInstantiator')
const Component = require('../../gui/components/Component')
const Sirens = require('../../Sirens')
const StackTraceBrowserModel = require('../models/StackTraceBrowserModel')
const ObjectPropertiesComponent = require('./shared/ObjectPropertiesComponent')
const ComponentProtocol_Implementation = require('../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../gui/protocols/ComponentProtocol')

class StackTraceBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    /**
     * Returns a Stack.newTraceBrowserModel.
     */
    defaultModel() {
        return StackTraceBrowserModel.new({
            framesStack: this.getProps().framesStack,
            object: this.getProps().object,
        })
    }

    /// Building

    renderWith(componentsRenderer) {
        const browserModel = this.getModel()

        componentsRenderer.render( function(component) {
            this.window( function() {
                this.styles({
                    title: 'Stack trace browser',
                    width: 900,
                    height: 400,
                })

                this.verticalSplitter( function() {

                    this.horizontalSplitter( function() {

                        this.styles({
                            viewAttributes: { splitProportion: 1.0/2.0 },
                        })

                        this.listChoice( function() {
                            this.model( browserModel.getFramesStackModel() )

                            this.styles({
                                viewAttributes: { splitProportion: 2.0/3.0 },
                                showHeaders: true,
                                clickableHeaders: false,
                            })

                            this.column({
                                label: 'Functions calls',
                                getTextBlock: function(stackFrame) { return stackFrame.getFunctionName() }
                            })

                            this.column({
                                label: 'File',
                                getTextBlock: function(stackFrame) { return stackFrame.getFileName() }
                            })

                            this.column({
                                label: 'Line',
                                getTextBlock: function(stackFrame) { return stackFrame.getLineNumber() }
                            })
                        })

                        this.component(
                            ObjectPropertiesComponent.new({
                                model: browserModel,
                                viewAttributes: { splitProportion: 1.0/3.0 },
                            })
                        )

                    })

                    this.text({
                        viewAttributes: { splitProportion: 1.0/2.0 },
                        model: browserModel.getFunctionSourceCodeModel(),
                    })

                })

            })
        })
    }
}

module.exports = Classification.define(StackTraceBrowser)
