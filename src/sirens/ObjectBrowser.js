const Classification = require('../../src/o-language/classifications/Classification')
const ComponentClassification = require('../gui/components/ComponentClassification')
const Component = require('../gui/components/Component')
const Sirens = require('../Sirens')
const ObjectBrowserModel = require('./models/ObjectBrowserModel')
const ObjectPropertiesComponent = require('./components/ObjectPropertiesComponent')

class ObjectBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
    }

    /// Initializing

    /**
     * Returns a new ObjectBrowserModel.
     * If the props include a props.object defined the that props.object is the browsed object,
     * otherwise the browsed object is undefined.
     */
    defaultModel() {
        return ObjectBrowserModel.new({ object: this.getProps().object })
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
            selectedText = playgroundComponent.getModel().getValue()
        }

        return selectedText
    }

    /// Building

    renderWith(builder) {
        const browserModel = this.getModel()

        builder.render( function(component) {
            this.window( function() {
                this.styles({
                    title: 'Object Browser',
                    width: 400,
                    height: 400,
                })

                this.verticalStack( function() {
                    this.verticalSplitter( function() {
                        this.component(
                            ObjectPropertiesComponent.new({
                                model: browserModel,
                                splitProportion: 2.0/4.0,
                            })
                        )

                        this.text( function() {
                            this.model( browserModel.getSelectedPropertyText() )

                            this.styles({
                                id: 'playground',
                                splitProportion: 1.0/3.0,
                                wrapMode: 'wordChar'
                            })

                            this.popupMenu( function() {
                                const selectedObject =
                                    component.getModel().getSelectedPropertyValue()

                                this.separator()

                                this.item({
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

module.exports = Classification.define(ObjectBrowser)
                    .behaveAs(ComponentClassification)