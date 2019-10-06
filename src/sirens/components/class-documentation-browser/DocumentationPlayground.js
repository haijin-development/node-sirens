const path = require('path')
const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const ScriptEvaluator = require('../ScriptEvaluator')
const Sirens = require('../../../Sirens')

class DocumentationPlayground {
    /// Definition

    static definition() {
        this.instanceVariables = ['evaluationContext']
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    initialize(props) {
        this.previousClassificationDo( () => {
            this.initialize( props )
        })

        this.evaluationContext = {}
    }

    evaluateSelectedCode(selectedText) {
        const evaluationResult = ScriptEvaluator.evaluate({
            thisObject: this.evaluationContext,
            script: selectedText,
        })

        Sirens.browseObject( evaluationResult )
    }

    renderWith(componentsRenderer) {
        const text = "\n" + this.getProps().text + "\n"

        componentsRenderer.render( function(component) {

            this.text( function() {

                this.styles({
                    text: text,
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
