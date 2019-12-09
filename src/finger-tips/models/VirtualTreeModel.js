const Classification = require('../../O').Classification
const Announcer = require('../announcements/Announcer')
const VirtualTreeModelProtocol = require('../protocols/VirtualTreeModelProtocol')

class VirtualTreeModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['getChildrenClosure', 'roots']
        this.assumes = [Announcer]
        this.implements = [VirtualTreeModelProtocol]
    }

    /// Initializing

    initialize({ roots: roots, getChildrenClosure: getChildrenClosure }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        if(getChildrenClosure === undefined) {
            throw new Error(
                `A getChildrenClosure must be defined.`
            )
        }

        this.getChildrenClosure = getChildrenClosure

        this.roots = []

        this.setRoots({ items: roots })
    }

    newTreeNodeOn({ item: item }) {
        return TreeNodeClassification.new({ value: item, getChildrenClosure: this.getChildrenClosure })
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

        this.announce({
            event: 'roots-changed',
            with: {newRoots: newRoots, oldRoots: oldRoots},
        })

        return this
    }

    setGetChildrenClosure(closure) {
        const roots = this.roots

        this.getChildrenClosure = closure

        this.setRoots({ items: roots })

        return this
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

        for( const each_object of objectsHierarchy) {
            const index = objects.findIndex((node) => {
                return node.getValue() == each_object
            })

            if(  objects[index] === undefined ) break

            pathIndices.push(index)

            objects = objects[index].getChildren()
        }

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

    onRootsChanged({ with: object, do: closure }) {
        this.subscribe({
            event: 'roots-changed',
            to: object,
            doing: closure,
        })        

        return this
    }

}

// Tree node class

const TreeNodeClassification = Classification.define( class TreeNode {
    /// Definition

    static definition() {
        this.instanceVariables = ['value', 'children', 'getChildrenClosure']
    }

    initialize({ value: value, getChildrenClosure: getChildrenClosure }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.value = value
        this.children = undefined
        this.getChildrenClosure = getChildrenClosure
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
        const children = this.getChildrenClosure( this.value )

        if( children === undefined ) {
            return []
        }

        return children
    }

    _getChildNodes() {
        return this._getChildItems().map( (item) => {
            return TreeNodeClassification.new({ value: item, getChildrenClosure: this.getChildrenClosure })
        })
    }
})

module.exports = Classification.define(VirtualTreeModel)