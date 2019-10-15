const Protocol = require('../../o-language/classifications/Protocol')
const ComponentBehaviourProtocol = require('./ComponentBehaviourProtocol')

/*
 * Defines the implementation protocol of the ComponentBehaviour classification.
 * Any objects that assumes ComponentBehaviour must implement this protocol. 
 */
class ComponentBehaviourProtocol_Implementation {

    /// Definition

    static definition() {
        this.assumes = [ComponentBehaviourProtocol]
    }

    /// Initializing

    createView() {}

    /// Accessing

    defaultModel() {}

    getMainComponent() {}

    /// Synchronizing

    synchronizeViewFromModel() {}
}

module.exports = Protocol.define(ComponentBehaviourProtocol_Implementation)