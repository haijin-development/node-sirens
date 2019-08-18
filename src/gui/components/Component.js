const AbstractComponent = require('./AbstractComponent')
const ComponentView = require('../views/ComponentView')
const ComponentRenderer = require('../componentBuilder/ComponentRenderer')

class Component extends AbstractComponent {
    build(props) {
        super.build(props)

        const builder = ComponentRenderer.onRootComponent(this)

        this.renderWith(builder)
    }

    createView() {
        return new ComponentView()
    }

    synchronizeViewFromModel() {
    }

    renderWith(builder) {
        throw Error(`The class ${this.constructor.name} must implement the method ::renderWith()`)
    }

    /// Accessing

    getMainComponent() {
        if( this.components.length === 0 ) {
            throw Error(`The ${this.constructor.name} has no main child component.`)
        }

        return this.components[0].getMainComponent()
    }

    /// Asking

    isTopMostComponent() {
        return this.getMainComponent().isTopMostComponent()
    }
}

module.exports = Component