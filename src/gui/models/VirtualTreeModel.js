const Classification = require('../../o-language/classifications/Classification')
const Model = require('./Model')

class VirtualTreeModel extends Classification {
    /// Definition

    static definition() {
        this.instanceVariables = ['getChildrenBlock', 'roots']
        this.assumptions = [Model]
    }

    /// Initializing

    initialize({ roots: roots, getChildrenBlock: getChildrenBlock }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        if(getChildrenBlock === undefined) {
            throw new Error(
                `A getChildrenBlock must be defined.`
            )
        }

        this.getChildrenBlock = getChildrenBlock

        this.roots = []

        this.setRoots(roots)
    }

    newTreeNodeOn(item) {
        return TreeNode.new({ value: item, getChildrenBlock: this.getChildrenBlock })
    }

    /// Accessing

    getRoots() {
        return this.roots.map((node) => {
            return node.getValue()
        })
    }

    setRoots(newRoots) {
        const oldRoots = this.roots

        this.roots = newRoots.map((item) => {
            return this.newTreeNodeOn(item)
        })

        this.emit('roots-changed', {newRoots: newRoots, oldRoots: oldRoots})
    }

    getNodeAt(path) {
        let node = this.roots[path[0]]

        const allIndicesButFirst = path.slice(1, path.length)

        allIndicesButFirst.forEach((childIndex) => {
            node = node.childAt(childIndex)
        })

        return node
    }

    getItemAt(path) {
        return this.getNodeAt(path).getValue()
    }

    getChildrenAt(path) {
        return this.getNodeAt(path).getChildren().map((node) => {
            return node.getValue()
        })
    }

    /**
     * Given a hierarchy of objects in the tree, returns an array with the path indices.
     */
    getPathOf(objectsHierarchy) {
        let objects = this.roots
        const path = []

        objectsHierarchy.forEach((each_object) => {
            const index = objects.findIndex((node) => {
                return node.getValue() == each_object
            })

            path.push(index)

            objects = objects[index].getChildren()
        })

        return path
    }

    /*
     * Given a path returns an array with the objects on each tree level corresponding to each index
     * in the path.
     */
    getObjectsHierarchyAt(path) {
        if (path === undefined) {
            return []
        }

        let nodes = this.roots

        const hierarchy = []

        path.forEach((index) => {
            const node = nodes[index]

            hierarchy.push(node.getValue())

            nodes = node.getChildren()
        })

        return hierarchy
    }
}

// Tree node class

class TreeNode extends Classification {
    /// Definition

    static definition() {
        this.instanceVariables = ['value', 'children', 'getChildrenBlock']
    }

    initialize({ value: value, getChildrenBlock: getChildrenBlock }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.value = value
        this.children = undefined
        this.getChildrenBlock = getChildrenBlock
    }

    getValue() {
        return this.value
    }

    getChildren() {
        if( this.children === undefined) {
            this.children = this._getChildNodes()
        }

        return this.children
    }

    childAt(index) {
        return this.children[index]
    }

    _getChildItems() {
        return this.getChildrenBlock(this.value)
    }

    _getChildNodes() {
        return this._getChildItems().map( (item) => {
            return TreeNode.new({ value: item, getChildrenBlock: this.getChildrenBlock })
        })
    }
}

module.exports = VirtualTreeModel