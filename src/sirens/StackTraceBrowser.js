const Sirens = require('../Sirens')
const Component = require('../gui/components/Component')
const StackTraceBrowserModel = require('./models/StackTraceBrowserModel')
const ObjectPropertiesComponent = require('./components/ObjectPropertiesComponent')

class StackTraceBrowser extends Component {

    /**
     * Returns a new StackTraceBrowserModel.
     */
    defaultModel() {
        return new StackTraceBrowserModel({
            framesStack: this.props.framesStack,
            object: this.props.object
        })
    }

    /// Building

    renderWith(builder) {
        const browserModel = this.getModel()

        builder.render( function(component) {
            this.window( () => {
                this.styles({
                    title: 'Stack trace browser',
                    width: 900,
                    height: 400,
                })

                this.verticalSplitter( () => {

                    this.horizontalSplitter( () => {

                        this.styles({
                            splitProportion: 1.0/2.0,
                        })

                        this.listChoice( (list) => {
                            list.model( browserModel.getFramesStackModel() )

                            list.styles({
                                splitProportion: 2.0/3.0,
                                showHeaders: true,
                                clickableHeaders: false,
                            })

                            list.column({
                                label: 'Functions calls',
                                getTextBlock: (stackFrame) => { return stackFrame.getFunctionName() }
                            })

                            list.column({
                                label: 'File',
                                getTextBlock: (stackFrame) => { return stackFrame.getFileName() }
                            })

                            list.column({
                                label: 'Line',
                                getTextBlock: (stackFrame) => { return stackFrame.getLineNumber() }
                            })
                        })

                        this.component(
                            new ObjectPropertiesComponent({
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