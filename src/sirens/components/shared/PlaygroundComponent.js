const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')
const ValueModel = require('../../../finger-tips/models/ValueModel')
const ScriptEvaluator = require('../../objects/ScriptEvaluator')

class PlaygroundComponent {
    /// Definition

    static definition() {
        this.instanceVariables = ['evaluationContext']
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Initializing

    assemble() {
        this.previousClassificationDo( () => {
            this.assemble()
        })

        this.evaluationContext = {}

        const props = this.getProps()

        if( props.text !== undefined ) {
            this.getModel().setValue( props.text )

            this.removeProp({ key: 'text' })
        }
    }

    defaultModel() {
        // review to use this.namespace() instead
        return ValueModel.new({ value: '' })
    }

    /// Querying

    getSelectedCode() {
        const playgroundComponent = this.getOnlyChildComponent()

        let selectedText = playgroundComponent.getSelectedText()

        if(selectedText == '') {
            selectedText = playgroundComponent.getModel().getValue()
        }

        return selectedText
    }

    /// Actions

    inspectSelectedCode() {
        const evaluationResult = this.evaluateSelectedCode()

        require('../../../Sirens').browseObject( evaluationResult )
    }

    evaluateSelectedCode() {
        const selectedCode = this.getSelectedCode()

        return ScriptEvaluator.evaluate({
            thisObject: this.evaluationContext,
            script: selectedCode,
        })
    }

    getText() {
        return this.getModel().getValue()
    }

    setText(string) {
        this.getModel().setValue(string)
    }

    setEvaluationContextBinding(object) {
        this.evaluationContext = object
    }

    /// Building

    getTextStyles() {
        const defaultStyles = {
            css: 'playground',
            wrapMode: 'wordChar',
        }

        const textStyles = Object.assign( defaultStyles, this.getProps() )

        delete textStyles.model

        return textStyles
    }

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const textStyles = this.getTextStyles()

        componentsRenderer.render( function(component) {

            this.text( function() {
                this.model( model )

                this.styles( textStyles )

                this.popupMenu( function() {
                    this.separator()

                    this.item({
                        label: 'Evaluate selected code',
                        action: () => { component.evaluateSelectedCode() },
                    })

                    this.separator()

                    this.item({
                        label: 'Inspect selected code',
                        action: () => { component.inspectSelectedCode() },
                    })
                })
            })

        })
    }
}

module.exports = Classification.define(PlaygroundComponent)
