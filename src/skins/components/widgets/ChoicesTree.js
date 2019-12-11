const Classification = require('../../../O').Classification
const UpdatingModel = require('../UpdatingModel')
const Widget = require('../Widget')
const TreeChoiceModel = require('../../../finger-tips/models/TreeChoiceModel')
const TreeView = require('../../gtk-views/TreeView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class ChoicesTree {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Widget]
        this.implements = [ComponentBehaviourProtocol_Implementation]
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
            getChildrenClosure: () => { return [] }
        })

        if( this.getProps().getChildrenClosure !== undefined ) {
            model.setGetChildrenClosure( this.getProps().getChildrenClosure )

            this.removeProp({ key: 'getChildrenClosure' })
        }

        if( this.getProps().roots !== undefined ) {
            model.setRoots({ items: this.getProps().roots })

            this.removeProp({ key: 'roots' })
        }

        if( this.getProps().selectionPath !== undefined ) {
            model.setSelectionPath({ objectsHierarchy: this.getProps().selectionPath })

            this.removeProp({ key: 'selectionPath' })
        }

        return model
    }

    createView() {
        return TreeView.new({
            getChildrenClosure: this.getChildrenAt.bind(this),
            onSelectionChanged: this.onUserSelectionChanged.bind(this),
            onSelectionAction: this.onUserSelectionAction.bind(this)
        })
    }

    getChildrenAt(itemPath) {
        return this.getModel().getChildrenAt({ indices: itemPath })
    }

    setRoots({ items: items }) {
        this.getModel().setRoots({ items: items })

        return this
    }

    setGetChildrenClosure(closure) {
        this.getModel().setGetChildrenClosure(closure)

        return this        
    }

    expandNodeAtIndex({ indexPath: indexPath }) {
        this.getView().expandNodeAtIndex({ indexPath: indexPath })

        return this        
    }

    /// Synchronizing

    synchronizeViewFromModel() {
        this.duringClassificationDo( UpdatingView, () => {
            const selectionIndices = this.getModel().getSelectionIndices()

            this.getView().clearItems()

            this.getView().addItems({
                parentIter: null,
                items: this.getModel().getRoots(),
                index: 0
            })

            this.getView().setSingleSelection({ indexPath: selectionIndices })
        })
    }

    /// Events

    /**
     * Subscribes this component to the model events
     */
    subscribeToModelEvents() {
        this.getModel().getTreeModel().onRootsChanged({
            with: this,
            do: this.onChoicesChanged,
        })
        this.getModel().onSelectionChanged({
            with: this,
            do: this.onSelectedValueChanged,
        })
    }

    onChoicesChanged() {
        this.duringClassificationDo( UpdatingView, () => {
            const roots = this.getModel().getRoots()

            this.getView().setRoots({ items: roots })
        })
    }

    onSelectedValueChanged() {
        this.duringClassificationDo( UpdatingView, () => {
            let selectionIndices = this.getModel().getSelectionIndices()

            this.getView().setSingleSelection({ indexPath: selectionIndices })
        })
    }

    onUserSelectionChanged() {
        const oldSelection = this.getModel().getSelectionValue()

        this.duringClassificationDo( UpdatingModel, () => {
            const selectedPath = this.getView().getSelectionIndices()

            const indices = selectedPath.length === 0 ? [] : selectedPath[0]

            this.getModel().setSelectionFromIndices({ indices: indices })
        })
    }

    onUserSelectionAction() {
        if( this.getProps().onAction === undefined ) { return }

        this.getProps().onAction()
    }
}

class UpdatingView {
    onUserSelectionChanged() {}
}

UpdatingView = Classification.define(UpdatingView)

module.exports = Classification.define(ChoicesTree)