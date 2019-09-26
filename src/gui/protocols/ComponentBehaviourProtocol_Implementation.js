const Protocol = require('../../o-language/classifications/Protocol')

/*
 * Defines the implementation protocol of the ComponentBehaviour classification.
 * Any objects that assumes ComponentBehaviour must implement this protocol. 
 */
class ComponentBehaviourProtocol_Implementation {

    /// Initializing

    createView() {}

    /// Accessing

    defaultModel() {}

    getMainComponent() {}

    /// Synchronizing

    synchronizeViewFromModel() {}
}

module.exports = Protocol.define(ComponentBehaviourProtocol_Implementation)