const Protocol = require('../../o-language/classifications/Protocol')

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
