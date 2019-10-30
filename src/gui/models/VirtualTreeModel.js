const Classification = require('../../o-language/classifications/Classification')
const Model = require('./Model')
const VirtualTreeModelProtocol = require('../protocols/VirtualTreeModelProtocol')

class VirtualTreeModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['getChildrenBlock', 'roots']
        this.assumes = [Model]
        this.implements = [VirtualTreeModelProtocol]
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

        this.setRoots({ items: roots })
    }

    newTreeNodeOn({ item: item }) {
        return TreeNodeClassification.new({ value: item, getChildrenBlock: this.getChildrenBlock })
    }

    /// Accessing

    getRoots() {
        return this.roots.map((node) => {
            return node.getValue()
        })
    }

    setRoots({ items: newRoots }) {
        const oldRoots = this.roots

        this.roots = newRoots.map((item) => {
            return this.newTreeNodeOn({ item: item })
        })

        this.emit('roots-changed', {newRoots: newRoots, oldRoots: oldRoots})
    }

    getNodeAt({ indices: pathIndices }) {
        let node = this.roots[pathIndices[0]]

        const allIndicesButFirst = pathIndices.slice(1, pathIndices.length)

        allIndicesButFirst.forEach((childIndex) => {
            node = node.childAt({ index: childIndex })
        })

        return node
    }

    getItemAt({ indices: pathIndices }) {
        return this.getNodeAt({ indices: pathIndices }).getValue()
    }

    getChildrenAt({ indices: pathIndices }) {
        return this.getNodeAt({ indices: pathIndices }).getChildren().map((node) => {
            return node.getValue()
        })
    }

    /**
     * Given a hierarchy of objects in the tree, returns an array with the path indices.
     */
    getPathOf({ objectsHierarchy: objectsHierarchy }) {
        let objects = this.roots
        const pathIndices = []

        objectsHierarchy.forEach((each_object) => {
            const index = objects.findIndex((node) => {
                return node.getValue() == each_object
            })

            pathIndices.push(index)

            objects = objects[index].getChildren()
        })

        return pathIndices
    }

    /*
     * Given a pathIndices returns an array with the objects on each tree level corresponding to each index
     * in the path.
     */
    getObjectsHierarchyAt({ indices: pathIndices }) {
        if (pathIndices === undefined) {
            return []
        }

        let nodes = this.roots

        const hierarchy = []

        pathIndices.forEach((index) => {
            const node = nodes[index]

            hierarchy.push(node.getValue())

            nodes = node.getChildren()
        })

        return hierarchy
    }

    /// Events

    onRootsChanged(closure) {
        this.on('roots-changed', closure)

        return this
    }

}

// Tree node class

const TreeNodeClassification = Classification.define( class TreeNode {
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

    childAt({ index: index }) {
        return this.children[index]
    }

    _getChildItems() {
        const children = this.getChildrenBlock( this.value )

        if( children === undefined ) {
            return []
        }

        return children
    }

    _getChildNodes() {
        return this._getChildItems().map( (item) => {
            return TreeNodeClassification.new({ value: item, getChildrenBlock: this.getChildrenBlock })
        })
    }
})

module.exports = Classification.define(VirtualTreeModel)