const Sirens = require('../Sirens')
const Component = require('../gui/components/Component')
const ObjectBrowserModel = require('./models/ObjectBrowserModel')

class ObjectBrowser extends Component {
    /// Initializing

    /**
     * Returns a new ObjectBrowserModel.
     * If the props include a props.object defined the that props.object is the browsed object,
     * otherwise the browsed object is undefined.
     */
    defaultModel() {
        return new ObjectBrowserModel(this.props.object)
    }

    /// Actions

    getSelectedObject() {
        let selectedValue = this.getModel().getSelectedInstanceVariableValue()

        if(selectedValue === undefined) {
            selectedValue = this.getModel().getRootObject()
        }

        return selectedValue
    }

    inspectSelectedObject() {
        const selectedValue = this.getSelectedObject()

        Sirens.browseObject(selectedValue)
    }

    browseSelectedObjectPrototypes() {
        const selectedValue = this.getSelectedObject()

        Sirens.browsePrototypes(selectedValue)
    }

    evaluateSelectedCode() {
        const selectedValue = this.getModel().getSelectedInstanceVariableValue()

        const selectedText = this.getSelectedText()

        const codeEvaluator = function(){ return eval(selectedText) }

        let evaluationResult = null

        try {
            evaluationResult = codeEvaluator.call(selectedValue)
        } catch (e) {
            evaluationResult = e
        }

        Sirens.browseObject(evaluationResult)
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
                    this.verticalSplitter( () => {
                        this.treeChoice( (tree) => {
                            tree.model(browserModel.getObjectInstanceVariablesTree())

                            tree.styles({
                                splitProportion: 2.0/3.0,
                                showHeaders: false,
                                clickableHeaders: false,
                            })

                            tree.handlers({
                                onAction: component.inspectSelectedObject.bind(component),
                            })

                            tree.column({
                                label: '',
                                getTextBlock: (instVar) => { return instVar.displayString() },
                            })

                            tree.popupMenu(({menu: menu, ownerView: ownerView}) => {
                                const selectedObject =
                                    component.getModel().getSelectedInstanceVariableValue()

                                menu.addItem({
                                    label: 'Browse it',
                                    enabled: selectedObject !== undefined,
                                    action: component.inspectSelectedObject.bind(component),
                                })

                                menu.addSeparator()

                                menu.addItem({
                                    label: 'Browse its prototype',
                                    enabled: selectedObject !== undefined,
                                    action: component.browseSelectedObjectPrototypes.bind(component),
                                })
                            })
                        })

                        this.text( () => {
                            this.model(browserModel.getSelectedInstanceVariableText())

                            this.styles({
                                id: 'playground',
                                splitProportion: 1.0/3.0,
                                wrapMode: 'wordChar'
                            })

                            this.popupMenu(({menu: menu, ownerView: ownerView}) => {
                                const selectedObject =
                                    component.getModel().getSelectedInstanceVariableValue()

                                menu.addSeparator()

                                menu.addItem({
                                    label: 'Inspect selected code',
                                    enabled: selectedObject !== undefined,
                                    action: component.evaluateSelectedCode.bind(component),
                                })
                            })
                        })
                    })
                })
            })
        })
    }
}

module.exports = ObjectBrowser