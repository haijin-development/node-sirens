const Protocol = require('../../o-language/classifications/Protocol')
const ComponentProtocol = require('./ComponentProtocol')
const ComponentRendererProtocol = require('./ComponentRendererProtocol')

class ComponentProtocol_Implementation {
    /// Definition

    static definition() {
        this.assumes = [ComponentProtocol]
    }

    /// Rendering

    renderWith(componentsRenderer) {
        this.param(componentsRenderer) .compliesWith( ComponentRendererProtocol )
    }
}

module.exports = Protocol.define(ComponentProtocol_Implementation)