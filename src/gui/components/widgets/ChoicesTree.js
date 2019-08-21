const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const TreeChoiceModel = require('../../models/TreeChoiceModel')
const TreeView = require('../../views/TreeView')

class ChoicesTree extends Classification {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    initializeProps() {
        if(this.getProps().columns === undefined) {
            throw Error(`The class ${this.constructor.name} props must defined a .columns property.`)
        }
    }

    defaultModel() {
        const model = TreeChoiceModel.new({
            roots: [],
            getChildrenBlock: () => { return [] }
        })

        if(this.getProps().roots !== undefined) {
            model.setRoots( this.getProps().roots )
        }

        if(this.getProps().setSelectionPath !== undefined) {
            model.setSelectionPath( this.getProps().setSelectionPath )
        }

        return model
    }

    createView() {
        return TreeView.new({
            getChildrenBlock: this.getChildrenAt.bind(this),
            onSelectionChanged: this.onUserSelectionChanged.bind(this),
            onSelectionAction: this.onUserSelectionAction.bind(this)
        })
    }

    getChildrenAt(itemPath) {
        return this.getModel().getChildrenAt(itemPath)
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        const selectionIndices = this.getModel().getSelectionIndices()
        const indices = selectionIndices.length == 0 ? [] : [selectionIndices]

        this.getView().clearItems()

        this.getView().addItems({
            parentIter: null,
            items: this.getModel().getRoots(),
            index: 0
        })

        this.getView().setSelectionIndices(indices)
    }

    /// Events

    /**
     * Subscribes this component to the model events
     */
    subscribeToModelEvents() {
        this.getModel().getTree().on('roots-changed', this.onChoicesChanged.bind(this))
        this.getModel().getValue().on('value-changed', this.onSelectedValueChanged.bind(this))
    }

    onChoicesChanged() {
        const roots = this.getModel().getRoots()

        this.getView().setRoots(roots)
    }

    onSelectedValueChanged() {
        let selectionIndices = this.getModel().getSelectionIndices()

        selectionIndices = selectionIndices === null ?
            [] : [selectionIndices]

        this.getView().setSelectionIndices(selectionIndices)
    }

    onUserSelectionChanged() {
        const selectedPath = this.getView().getSelectionIndices()

        this.getModel().setSelectionFromPath(selectedPath[0])
    }

    onUserSelectionAction() {
        if(this.getProps().onAction === undefined) {
            return
        }

        this.getProps().onAction()
    }
}

module.exports = ChoicesTree