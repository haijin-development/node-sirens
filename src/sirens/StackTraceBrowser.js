const Sirens = require('../Sirens')
const Component = require('../components/Component')
const StackTraceBrowserModel = require('./models/StackTraceBrowserModel')

class StackTraceBrowser extends Component {

    /**
     * Returns a new StackTraceBrowserModel.
     */
    defaultModel() {
        return new StackTraceBrowserModel(this.props.framesStack)
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

                    this.listChoice( (list) => {
                        list.model( browserModel.getFramesStackModel() )

                        list.styles({
                            splitProportion: 1.0/2.0,
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