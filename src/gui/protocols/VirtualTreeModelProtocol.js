const Protocol = require('../../o-language/classifications/Protocol')

class VirtualTreeModelProtocol {

    /// Accessing

    getRoots() {}

    setRoots(newRoots) {}

    getItemAt(path) {}

    getChildrenAt(path) {}

    /**
     * Given a hierarchy of objects in the tree, returns an array with the path indices.
     */
    getPathOf(objectsHierarchy) {}

    /*
     * Given a path returns an array with the objects on each tree level corresponding to each index
     * in the path.
     */
    getObjectsHierarchyAt(path) {}

    onRootsChanged(closure) {}
}

module.exports = Protocol.define(VirtualTreeModelProtocol)