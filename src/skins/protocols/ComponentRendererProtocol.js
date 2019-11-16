const Protocol = require('../../O').Protocol

class ComponentRendererProtocol {

    /// Building

    render(closure) {
        this.param(closure) .isFunction()
    }

}

module.exports = Protocol.define(ComponentRendererProtocol)