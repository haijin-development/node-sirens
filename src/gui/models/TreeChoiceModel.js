const Classification = require('../../o-language/classifications/Classification')
const VirtualTreeModel = require('./VirtualTreeModel')
const ValueModel = require('./ValueModel')

class TreeChoiceModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['selectionModel', 'treeModel']
    }

    /// Initializing

    initialize({ selectionModel: selectionModel, roots: roots, getChildrenBlock: getChildrenBlock }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        if(selectionModel === undefined) selectionModel = null
        if(roots === undefined) roots = []

        this.selectionModel = ValueModel.new({ value: selectionModel })

        this.treeModel = VirtualTreeModel.new({
            roots: roots,
            getChildrenBlock: getChildrenBlock
        })
    }

    /// Accessing

    /**
     * Returns the selectionModel model, not the selected item.
     * This model can be observed for changes.
     * This model value is an array with the objects path from the tree root object to the selected item.
     **/
    getSelectionModel() {
        return this.selectionModel
    }

    getSelectionValue() {
        const selectionPath = this.getSelectionPath()

        if(selectionPath === null) {
            return
        }

        return selectionPath[selectionPath.length - 1].getValue()
    }

    /**
    * Sets the item currently selected.
    * The objects_hierarchy is an array with the objects path from the tree root object to the
    * selected item.
    * The selectionModel model triggers an announcement that its value changed.
    */
    setSelectionPath(objectsHierarchy) {
        this.selectionModel.setValue(objectsHierarchy)
    }

    getSelectionPath() {
        return this.selectionModel.getValue()
    }

    getSelectionIndices() {
        const objectsHierarchy = this.getSelectionPath()

        if(objectsHierarchy === null) {
            return []
        }

        return this.getPathOf(objectsHierarchy)
    }

    /**
    * Sets the item currently selected.
    * The objects_hierarchy is an array with the objects path from the tree root object to the
    * selected item.
    * The selectionModel model triggers an announcement that its value changed.
    */
    setSelectionFromPath(path) {
        const objectsHierarchy = this.getObjectsHierarchyAt(path)

        this.setSelectionPath(objectsHierarchy)
    }

    /**
    * Returns the tree model.
    * The tree model holds the tree items and announces changes on it.
    */
    getTreeModel() {
        return this.treeModel
    }

    /**
    * Sets the tree model roots.
    * Announces that the tree changed.
    */
    setRoots(items) {
        this.treeModel.setRoots(items)
    }

    /**
     * Returns the tree model roots.
     * Announces that the tree changed.
     */
    getRoots() {
        return this.treeModel.getRoots()
    }

    /**
    * Returns the item in the tree at the given path.
    * The path is an array of Integers, each Integer being the index in each level of the tree.
    * Example:
    *       [1, 0, 3] returns the item taken from the second root, its first child and its fourth child.
    */
    getItemAt(path) {
        return this.treeModel.itemAt(path)
    }

    /**
    * Returns an array with the children of the item in the tree at the given path.
    */
    getChildrenAt(path) {
        return this.treeModel.getChildrenAt(path)
    }

    /**
    * Given a hierarchy of objects in the tree, returns an array with the path indices.
    */
    getPathOf(objectsHierarchy) {
        return this.treeModel.getPathOf(objectsHierarchy)
    }

    /**
    * Given a path returns an array with the objects on each tree level corresponding to each index in the path.
    */
    getObjectsHierarchyAt(path) {
        return this.treeModel.getObjectsHierarchyAt(path)
    }

    /// Asking

    hasSelection() {
        return this.selectionModel.value != undefined && this.selectionModel.value.length > 0
    }
}

module.exports = Classification.define(TreeChoiceModel)