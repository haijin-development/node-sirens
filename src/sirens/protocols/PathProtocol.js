const Protocol = require('../../O').Protocol

class PathProtocol {

    /// Asking

    isFolder() {}

    isFile() {}

    /// Querying

    getIcon() {}

    getBaseName() {}

    getChildren() {}

}

module.exports = Protocol.define(PathProtocol)
