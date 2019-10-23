const Classification = require('../../o-language/classifications/Classification')
const ComponentInstantiator = require('../../gui/components/ComponentInstantiator')
const Component = require('../../gui/components/Component')
const Sirens = require('../../Sirens')
const ObjectBrowserModel = require('../models/ObjectBrowserModel')
const ObjectPropertiesComponent = require('./shared/ObjectPropertiesComponent')
const ComponentProtocol_Implementation = require('../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../gui/protocols/ComponentProtocol')
const ScriptEvaluator = require('../objects/ScriptEvaluator')

class ObjectBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
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

    inspectSelectedCode() {
        const evaluationResult = this.evaluateSelectedCode()

        Sirens.browseObject( evaluationResult )
    }

    evaluateSelectedCode() {
        const selectedValue = this.getModel().getSelectedPropertyValue()

        const selectedText = this.getSelectedText()

        return ScriptEvaluator.evaluate({
            thisObject: selectedValue,
            script: selectedText,
        })
    }

    /// Querying

    getSelectedText() {
        const playgroundComponent = this.getChildComponent({ id: 'playground' })

        let selectedText = playgroundComponent.getSelectedText()

        if(selectedText == '') {
            selectedText = playgroundComponent.getModel().getValue()
        }

        return selectedText
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {
            this.window( function() {
                this.styles({
                    title: 'Object Browser',
                    width: 400,
                    height: 400,
                })

                this.verticalSplitter( function() {
                    this.component(
                        ObjectPropertiesComponent.new({
                            model: model,
                            viewAttributes: { splitProportion: 1.0/2.0 },
                        })
                    )

                    this.text( function() {
                        this.model( model.getSelectedPropertyTextModel() )

                        this.styles({
                            id: 'playground',
                            viewAttributes: { splitProportion: 1.0/2.0 },
                            wrapMode: 'wordChar'
                        })

                        this.popupMenu( function() {
                            const selectedObject =
                                component.getModel().getSelectedPropertyValue()

                            this.separator()

                            this.item({
                                label: 'Evaluate selected code',
                                enabled: selectedObject !== undefined,
                                action: () => { component.evaluateSelectedCode() },
                            })

                            this.separator()

                            this.item({
                                label: 'Inspect selected code',
                                enabled: selectedObject !== undefined,
                                action: () => { component.inspectSelectedCode() },
                            })
                        })
                    })
                })
            })
        })
    }
}

module.exports = Classification.define(ObjectBrowser)
