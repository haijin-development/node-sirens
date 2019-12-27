const Classification = require('../../O').Classification
const FlowPoint = require('../flows/FlowPoint')
const TreeChoiceModel = require('../models/TreeChoiceModel')

class TreeChoiceFlowPoint {
    /// Definition

    static definition() {
        this.instanceVariables = ['_setSelection']
        this.assumes = [TreeChoiceModel, FlowPoint]
    }

    /// Initializing

    initialize({ flow: flow }) {
        this.withClassificationDo(TreeChoiceModel, () => {
            this.initialize({
                roots: flow.getRoots(),
                getChildrenClosure: flow.getGetChildrenClosure(),
            })
        })

        this.withClassificationDo(FlowPoint, () => {
            this.initialize({ flow: flow })
        })

        this._setSelection = flow.setSelection.bind(flow)

        this.onSelectionChanged({
            with: this,
            do: this.updateFlowOnSelectionChange,
        })
    }

    /// Events

    updateFlowOnSelectionChange({ newValue: newValue, oldValue: oldValue }) {
        this._setSelection( newValue )
    }

    onFlowSelectionChanged({ newValue: objectsHierarchy }) {
        this.setSelectionPath({ objectsHierarchy: objectsHierarchy })
    }

    onFlowRootsChanged({ newRoots: newRoots }) {
        this.setRoots({ items: newRoots })
    }
}

module.exports = Classification.define(TreeChoiceFlowPoint)