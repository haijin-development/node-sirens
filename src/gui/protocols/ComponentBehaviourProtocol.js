const Protocol = require('../../o-language/classifications/Protocol')

/*
 * Defines the public protocol of an object behaving as a ComponentBehaviour.
 * Users of an object behaving as a ComponentBehaviour will safely assume this protocol. 
 */
class ComponentBehaviourProtocol {

    /// Initializing

    initialize(props = {}) {}

    /// Accessing

    getChildComponents() {}

    getModel() {}

    getView() {}

    getProps() {}

    setProps(props) {}

    getId() {}

    getChildComponent({ id: childComponentId }) {}

    /// Sub-components

    addChildComponent(component) {}

    addAllChildrenComponents(components) {}

    removeChildComponent(component) {}

    removeAllChildrenComponents(components) {}
}

module.exports = Protocol.define(ComponentBehaviourProtocol)