const Protocol = require('../../o-language/classifications/Protocol')

class VirtualTreeModelProtocol {

    /// Accessing

    getRoots() {}

    setRoots(newRoots) {
        this.param(newRoots) .isArray()
    }

    getItemAt(path) {
        this.param(path) .isArray()

        path.forEach( (index) => {
            this.param(index) .isInteger()
        })
    }

    getChildrenAt(path) {
        this.param(path) .isArray()

        path.forEach( (index) => {
            this.param(index) .isInteger()
        })
    }

    /**
     * Given a hierarchy of objects in the tree, returns an array with the path indices.
     */
    getPathOf(objectsHierarchy) {
        this.param(objectsHierarchy) .isArray()
    }

    /*
     * Given a path returns an array with the objects on each tree level corresponding to each index
     * in the path.
     */
    getObjectsHierarchyAt(path) {
        this.param(path) .isArray()

        path.forEach( (index) => {
            this.param(index) .isInteger()
        })
    }

    onRootsChanged(closure) {
        this.param(closure) .isFunction()
    }
}

module.exports = Protocol.define(VirtualTreeModelProtocol)