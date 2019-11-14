const Classification = require('../../O').Classification
const Component = require('../../GUI').Component
const ComponentProtocol_Implementation = require('../../GUI').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../GUI').ComponentInstantiator

const PlaygroundComponent = require('./shared/PlaygroundComponent')
const ObjectPropertiesComponent = require('./shared/ObjectPropertiesComponent')
const Pluggables = require('../objects/Pluggables')

class ObjectBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = ['propertiesTreeModel']
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Building

    renderWith(componentsRenderer) {
        const inspectedObject = this.getProps().object

        componentsRenderer.render( function(component) {
            this.window( function() {
                this.styles({
                    css: ['window', 'object-browser'],
                    title: 'Object Browser',
                    width: 400,
                    height: 400,
                })

                this.verticalSplitter( function() {

                    this.component(
                        ObjectPropertiesComponent.new({
                            id: 'objectProperties',
                            rootObject: inspectedObject,
                            onSelectionChanged: component.handleObjectPropertySelectionChanged.bind(component),
                            viewAttributes: { splitProportion: 1.0/2.0 },                            
                        })
                    )

                    this.component(
                        PlaygroundComponent.new({
                            id: 'propertyPlayground',
                            viewAttributes: { splitProportion: 1.0/2.0 },                            
                        })
                    )

                })
            })
        })

        // Sync the playground with the tree with this call
        this.handleObjectPropertySelectionChanged()
    }

    /// Events

    handleObjectPropertySelectionChanged() {
        const playground = this.getChildComponent({ id: 'propertyPlayground', ifNone: null })

        if( playground === null ) { return }

        const selectedValue = this.getSelectedPropertyValue()

        const selectedValueString = this.propertySelectionValueStringFrom({ value: selectedValue })

        playground.setText( selectedValueString )

        playground.setEvaluationContextBinding( selectedValue )
    }

    getSelectedPropertyValue() {
        const objectPropertiesTree = this.getChildComponent({ id: 'objectProperties', ifNone: null })

        return objectPropertiesTree.getSelectedPropertyValue()
    }

    propertySelectionValueStringFrom({ value: value }) {
        const valueToTextClassification = Pluggables.objectPropertiesInspector.playgroundTextConverter

        const valueToText = valueToTextClassification.new()

        return valueToText.getDisplayValueFrom({ value: value })
    }
}

module.exports = Classification.define(ObjectBrowser)
