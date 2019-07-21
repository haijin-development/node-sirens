const Sirens = require('../Sirens')
const Component = require('../components/Component')
const ObjectBrowserModel = require('./models/ObjectBrowserModel')

class ObjectBrowser extends Component {
    /// Initializing

    defaultModel() {
        return new ObjectBrowserModel(this.props.object)
    }

    /// Actions

    getSelectedObject() {
        let selectedValue = this.getModel().getSelectedInstanceVariables()

        if(selectedValue === undefined) {
            selectedValue = this.getModel().getRootObject()
        }

        return selectedValue
    }

    inspectSelectedObject() {
        const selectedValue = this.getSelectedObject()

        Sirens.browseObject(selectedValue)
    }

    browseSelectedObjectFunctions() {
        const selectedValue = this.getSelectedObject()

        Sirens.browsePrototypes(selectedValue)
    }

    evaluateSelectedCode() {
        const selectedValue = this.getModel().getSelectedInstanceVariables()

        const selectedText = this.getSelectedText()

        const codeEvaluator = function(){ return eval(selectedText) }

        let evaluationResult = null

        try {
            evaluationResult = codeEvaluator.call(selectedValue)
        } catch (e) {
            evaluationResult = e
        }

        Sirens.browseObject(object)
    }

    /// Querying

    getSelectedText() {
        const playgroundComponent = this.getChildComponent({id: 'playground'})

        let selectedText = playgroundComponent.getSelectedText()

        if(selectedText == '') {
            selectedText = this.getModel().getSelectedInstanceVariableText().getValue()
        }

        return selectedText
    }

    /// Building

    renderWith(builder) {
        const browserModel = this.getModel()

        builder.render( function(component) {
            this.window( () => {
                this.styles({
                    title: 'Object Browser',
                    width: 400,
                    height: 400,
                })

                this.verticalStack( () => {
                    this.horizontalStack( () => {
                        this.styles({
                            packExpand: false
                        })

                        this.textButton({
                            text: 'Inspect object',
                            onClicked: component.inspectSelectedObject.bind(component),
                        })

                        this.textButton({
                            text: 'Browse functions',
                            onClicked: component.browseSelectedObjectFunctions.bind(component),
                        })
                    })

                    this.verticalSplitter( () => {
                        this.treeChoice( (tree) => {
                            tree.model(browserModel.getObjectInstanceVariablesTree())

                            tree.styles({
                                splitProportion: 2.0/3.0,
                                showHeaders: false,
                                clickableHeaders: false,
                                onAction: component.inspectSelectedObject.bind(component),
                            })

                            tree.column({
                                label: '',
                                getTextBlock: (instVar) => { return instVar.displayString() },
                            })
                        })

                        this.text( () => {
                            this.model(browserModel.getSelectedInstanceVariableText())

                            this.styles({
                                id: 'playground',
                                splitProportion: 1.0/3.0,
                                wrapMode: 'wordChar'
                            })

                            this.popupMenu( ({menu: menu, ownerView: textView}) => {
                                const selectedText = textView.getSelectedText()

                                menu.addSeparator()

                                menu.addItem({
                                    label: 'Browse it',
                                    enabled: selectedText !== undefined,
                                    action: () => {
                                        component.browseTextSelection({text: selectedText})
                                    },
                                })
                            })
                        })
                    })

                    this.textButton({
                        packExpand: false,
                        text: 'Evaluate selected code',
                        onClicked: component.evaluateSelectedCode.bind(component),
                    })
                })
            })
        })
    }
}

module.exports = ObjectBrowser