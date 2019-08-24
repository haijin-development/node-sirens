const ComponentClassification = require('../gui/components/ComponentClassification')
const Component = require('../gui/components/Component')
const Sirens = require('../Sirens')
const StackTraceBrowserModel = require('./models/StackTraceBrowserModel')
const ObjectPropertiesComponent = require('./components/ObjectPropertiesComponent')

class StackTraceBrowser extends ComponentClassification {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
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

    renderWith(builder) {
        const browserModel = this.getModel()

        builder.render( function(component) {
            this.window( function() {
                this.styles({
                    title: 'Stack trace browser',
                    width: 900,
                    height: 400,
                })

                this.verticalSplitter( function() {

                    this.horizontalSplitter( function() {

                        this.styles({
                            splitProportion: 1.0/2.0,
                        })

                        this.listChoice( function() {
                            this.model( browserModel.getFramesStackModel() )

                            this.styles({
                                splitProportion: 2.0/3.0,
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
                                splitProportion: 1.0/3.0,
                            })
                        )

                    })

                    this.text({
                        splitProportion: 1.0/2.0,
                        model: browserModel.getFunctionSourceCodeModel(),
                    })

                })

            })
        })
    }
}

module.exports = StackTraceBrowser