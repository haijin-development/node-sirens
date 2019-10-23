const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ValueModel = require('../../../gui/models/ValueModel')
const ScriptEvaluator = require('../../objects/ScriptEvaluator')
const Sirens = require('../../../Sirens')

class PlaygroundComponent {
    /// Definition

    static definition() {
        this.instanceVariables = ['evaluationContext']
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Initializing

    initialize(props) {
        this.previousClassificationDo( () => {
            this.initialize( props )
        })

        this.evaluationContext = {}

        if( this.getProps().text !== undefined ) {
            this.getModel().setValue( props.text )
        }

        this.removeProp({ key: 'text' })
    }

    defaultModel() {
        return ValueModel.new({ value: '' })
    }

    /// Querying

    getSelectedCode() {
        const playgroundComponent = this.getChildComponent({ id: 'playground' })

        let selectedText = playgroundComponent.getSelectedText()

        if(selectedText == '') {
            selectedText = playgroundComponent.getModel().getValue()
        }

        return selectedText
    }

    /// Actions

    inspectSelectedCode() {
        const evaluationResult = this.evaluateSelectedCode()

        Sirens.browseObject( evaluationResult )
    }

    evaluateSelectedCode() {
        const selectedCode = this.getSelectedCode()

        return ScriptEvaluator.evaluate({
            thisObject: this.evaluationContext,
            script: selectedCode,
        })
    }

    /// Building

    getTextStyles() {
        const defaultStyles = {
            id: 'playground',
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
