const PrimitiveComponent = require('../PrimitiveComponent')
const TreeChoiceModel = require('../../models/TreeChoiceModel')
const TreeView = require('../../views/TreeView')

class ChoicesTree extends PrimitiveComponent {
    /// Initializing

    initializeProps(props) {
        super.initializeProps(props)

        if(props.columns === undefined) {
            throw Error(`The class ${this.constructor.name} props must defined a .columns property.`)
        }
    }

    initializeModel(props) {
        super.initializeModel(props)

        if(props.roots !== undefined) {
            this.getModel().setRoots(props.roots)
        }

        if(props.setSelectionPath !== undefined) {
            this.getModel().setSelectionPath(props.setSelectionPath)
        }
    }

    defaultModel() {
        return new TreeChoiceModel({
            roots: [],
            getChildrenBlock: () => { return [] }
        })
    }

    createView() {
        return new TreeView({
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

        this.view.clearItems()

        this.view.addItems({
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

        this.view.setRoots(roots)
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
        if(this.props.onAction === undefined) {
            return
        }

        this.props.onAction()
    }
}

module.exports = ChoicesTree