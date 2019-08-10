const EventEmitter = require('events')

class VirtualTreeModel extends EventEmitter {
    /// Initializing

    constructor({roots: roots, getChildrenBlock: getChildrenBlock}) {
        super()

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
        return new TreeNode({value: item, getChildrenBlock: this.getChildrenBlock})
    }

    /// Accessing

    getRoots() {
        return this.roots.map((node) => {
            return node.value
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
        return this.getNodeAt(path).value
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
                return node.value == each_object
            })

            path.push(index)

            objects = objects[index].children
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

            hierarchy.push(node.value)

            nodes = node.children
        })

        return hierarchy
    }
}

/// Announcements

class TreeChanged {
    constructor({newRoots: newRoots, oldRoots: oldRoots}) {
        this.newRoots = newRoots
        this.oldRoots = oldRoots
    }
}

// Tree node class

let index = 0;

class TreeNode {
    constructor({value: value, getChildrenBlock: getChildrenBlock}) {
        this.value = value
        this.children = undefined
        this.getChildrenBlock = getChildrenBlock
        this.index = index

        index += 1
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
            return new TreeNode({value: item, getChildrenBlock: this.getChildrenBlock})
        })
    }
}

module.exports = VirtualTreeModel