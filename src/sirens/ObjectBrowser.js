const Sirens = require('../Sirens')
const Component = require('../gui/components/Component')
const ObjectBrowserModel = require('./models/ObjectBrowserModel')
const ObjectPropertiesComponent = require('./components/ObjectPropertiesComponent')

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

    evaluateSelectedCode() {
        const selectedValue = this.getModel().getSelectedPropertyValue()

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
            selectedText = this.getModel().getSelectedPropertyText().getValue()
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
                        this.component(
                            new ObjectPropertiesComponent({
                                model: browserModel,
                                splitProportion: 2.0/4.0,
                            })
                        )

                        this.text( () => {
                            this.model(browserModel.getSelectedPropertyText())

                            this.styles({
                                id: 'playground',
                                splitProportion: 1.0/3.0,
                                wrapMode: 'wordChar'
                            })

                            this.popupMenu(({menu: menu, ownerView: ownerView}) => {
                                const selectedObject =
                                    component.getModel().getSelectedPropertyValue()

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