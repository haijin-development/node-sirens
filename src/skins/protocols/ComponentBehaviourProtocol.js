const Protocol = require('../../O').Protocol

/*
 * Defines the public protocol of an object behaving as a ComponentBehaviour.
 * Users of an object behaving as a ComponentBehaviour will safely assume this protocol. 
 */
class ComponentBehaviourProtocol {

    /// Accessing

    getChildComponents() {}

    getModel() {}

    getView() {}

    getProps() {}

    setProps(props) {}

    getId() {}

    getChildComponent({ id: childComponentId }) {
        this.param(childComponentId) .isString()        
    }

    /// Sub-components

    addChildComponent(component) {
        this.param(component) .compliesWith( _ComponentBehaviourProtocol )
    }

    addAllChildrenComponents(components) {
        this.param(components) .isArray()
    }

    removeChildComponent(component) {
        this.param(component) .compliesWith( _ComponentBehaviourProtocol )
    }

    removeAllChildrenComponents() {
    }
}

_ComponentBehaviourProtocol = Protocol.define(ComponentBehaviourProtocol)

module.exports = _ComponentBehaviourProtocol