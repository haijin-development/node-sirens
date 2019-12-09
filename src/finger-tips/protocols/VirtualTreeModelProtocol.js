const Protocol = require('../../O').Protocol

class VirtualTreeModelProtocol {

    /// Accessing

    getRoots() {}

    setRoots({ items: newRoots }) {
        this.param(newRoots) .isArray()
    }

    getItemAt({ indices: path }) {
        this.param(path) .isArray({
            forEachItem: (index) => {
                this.param(index) .isInteger()
            }
        })
    }

    getChildrenAt({ indices: path }) {
        this.param(path) .isArray({
            forEachItem: (index) => {
                this.param(index) .isInteger()
            }
        })
    }

    /**
     * Given a hierarchy of objects in the tree, returns an array with the path indices.
     */
    getPathOf({ objectsHierarchy: objectsHierarchy }) {
        this.param(objectsHierarchy) .isArray()
    }

    /*
     * Given a path returns an array with the objects on each tree level corresponding to each index
     * in the path.
     */
    getObjectsHierarchyAt({ indices: path }) {
        this.param(path) .isArray({
            forEachItem: (index) => {
                this.param(index) .isInteger()
            }
        })
    }

    onRootsChanged({ with: object, do: closure }) {
        this.param(object) .isObject()
        this.param(closure) .isFunction()
    }
}

module.exports = Protocol.define(VirtualTreeModelProtocol)