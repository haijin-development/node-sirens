const path = require('path')
const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const ScriptEvaluator = require('../ScriptEvaluator')
const Sirens = require('../../../Sirens')
const ValueModel = require('../../../gui/models/ValueModel')

class DocumentationPlayground {
    /// Definition

    static definition() {
        this.instanceVariables = ['evaluationContext']
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Initializing

    initialize(props) {
        this.previousClassificationDo( () => {
            this.initialize( props )
        })

        this.evaluationContext = {}
    }

    defaultModel() {
        return ValueModel.new({ value: '' })
    }

    /// Actions

    evaluateSelectedCode(selectedText) {
        const evaluationResult = ScriptEvaluator.evaluate({
            thisObject: this.evaluationContext,
            script: selectedText,
        })

        Sirens.browseObject( evaluationResult )
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const text = "\n" + this.getProps().text + "\n"

        model.setValue( text )

        componentsRenderer.render( function(component) {

            this.text( function() {

                this.model( model )

                this.styles({
                    hScroll: 'never',
                    vScroll: 'never',
                    viewAttributes: {
                        stackSize: 'fixed',
                    }
                })

                this.popupMenu( function({ ownerView: ownerView }) {
                    const selectedText = ownerView.getSelectedText().trim()

                    this.separator()

                    this.item({
                        label: 'Inspect selected code',
                        enabled: selectedText !== '',
                        action: () => { component.evaluateSelectedCode( selectedText ) },
                    })
                })

            })

        })
    }
}

module.exports = Classification.define(DocumentationPlayground)
