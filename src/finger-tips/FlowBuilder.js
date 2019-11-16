const Classification = require('../O').Classification
const ValueModel = require('./models/ValueModel')
const ChoiceModel = require('./models/ChoiceModel')
const ObjectAttributeModel = require('./models/ObjectAttributeModel')
const BufferedAttributeModel = require('./models/BufferedAttributeModel')
const TreeChoiceModel = require('./models/TreeChoiceModel')

class _FlowBuilder {
    /// Definition

    static definition() {
        this.instanceVariables = ['rootModel']
    }

    /// Initializing

    initialize({ rootModel: rootModel }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.rootModel = rootModel
    }

    /// Accessing

    getRootModel() {
        return this.rootModel
    }

    /// Building

    main(closure) {
        this.bindYourself( closure, this.rootModel )

        return this
    }

    value({ id: childId, value: value, whenValueChanges: valueChangedClosure }) {
        if( value === undefined ) { value = null }

        const valueModel = ValueModel.new({ value: value })

        this.rootModel.addChildModel({ id: childId, model: valueModel })

        if( valueChangedClosure !== undefined ) {
            valueModel.onValueChanged( valueChangedClosure )
        }
    }

    objectAttributeValue({
        id: childId,
        object: object, attributeReader: attributeReader, attributeWriter: attributeWriter,
        whenValueChanges: valueChangedClosure
    }) {
        if( object === undefined ) { object = null }

        const valueModel = ObjectAttributeModel.new({
            object: object,
            attributeReader: attributeReader,
            attributeWriter: attributeWriter,
        })

        this.rootModel.addChildModel({ id: childId, model: valueModel })

        if( valueChangedClosure !== undefined ) {
            valueModel.onValueChanged( valueChangedClosure )
        }
    }

    bufferedAttributeValue({
        id: childId,
        object: object, attributeReader: attributeReader,
        whenValueChanges: valueChangedClosure
    }) {
        if( object === undefined ) { object = null }

        const valueModel = BufferedAttributeModel.new({
            object: object,
            attributeReader: attributeReader,
        })

        this.rootModel.addChildModel({ id: childId, model: valueModel })

        if( valueChangedClosure !== undefined ) {
            valueModel.onValueChanged( valueChangedClosure )
        }
    }

    toggle({ id: childId, value: value, whenValueChanges: valueChangedClosure }) {
        if( value === undefined ) { value = false }

        this.value({ id: childId, value: value, whenValueChanges: valueChangedClosure })
    }

    choice({ id: childId, choices: choices, whenSelectionChanges: selectionChangedClosure }) {
        if( choices === undefined ) { choices = [] }

        const choiceModel = ChoiceModel.new({ choices: choices })

        this.rootModel.addChildModel({ id: childId, model: choiceModel })

        if( selectionChangedClosure !== undefined ) {
            choiceModel.onSelectionChanged( selectionChangedClosure )
        }
    }

    treeChoice({
        id: childId,
        roots: roots, getChildrenClosure: getChildrenClosure,
        whenSelectionChanges: selectionChangedClosure
    }) {
        if( roots === undefined ) { roots = [] }

        const treeChoiceModel = TreeChoiceModel.new({
            roots: roots, getChildrenClosure: getChildrenClosure
        })

        this.rootModel.addChildModel({ id: childId, model: treeChoiceModel })

        if( selectionChangedClosure !== undefined ) {
            treeChoiceModel.onSelectionChanged( selectionChangedClosure )
        }
    }

    object({
        id: childId, object: object, whenObjectChanges: valueChangedClosure, definedWith: modelObject },
         closure
    ) {
        if( modelObject === undefined ) {

            const FlowModel = require('./models/FlowModel')

            modelObject = FlowModel.new({ object: object, build: false })

        }

        this.rootModel.addChildModel({ id: childId, model: modelObject })

        if( closure !== undefined ) {
            const modelObjectBuilder = FlowBuilder.new({ rootModel: modelObject })

            modelObjectBuilder.main( closure, modelObject )
        }

        if( valueChangedClosure !== undefined ) {
            modelObject.onValueChanged( valueChangedClosure )
        }
    }

    whenObjectChanges(valueChangedClosure) {
        this.rootModel.onValueChanged( valueChangedClosure )
    }
}

FlowBuilder = Classification.define(_FlowBuilder)

module.exports = FlowBuilder