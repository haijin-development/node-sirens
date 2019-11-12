const Protocol = require('../../O').Protocol
const ComponentBehaviourProtocol = require('./ComponentBehaviourProtocol')

class ComponentProtocol {
    /// Definition

    static definition() {
        this.assumes = [ComponentBehaviourProtocol]
    }
    
    /// Opening

    open() {}
}

module.exports = Protocol.define(ComponentProtocol)