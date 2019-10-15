const Protocol = require('../../o-language/classifications/Protocol')

class ComponentRendererProtocol {

    /// Building

    render(closure) {
        this.param(closure) .isFunction()
    }

}

module.exports = Protocol.define(ComponentRendererProtocol)