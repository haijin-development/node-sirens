const AbstractView = require('./AbstractView')

class View extends AbstractView {
    /// Initializing

    constructor(...params) {
        super()

        this.mainHandle = null

        this.build(...params)
    }

    build(...params) {
        this.initializeHandles(...params)

        this.subscribeToGUISignals()
    }

    initializeHandles() {
        throw Error(`The class ${this.constructor.name} must implement the method ::initializeHandles()`)
    }

    onViewAdded(childView) {
        const childHandles = childView.getChildHandles()

        childHandles.forEach( (childHandle) => {
            this.getMainHandle().add(childHandle)

            childView.onAddedToParentView(this)

            childView.getMainHandle().show()
        })
    }

    onAddedToParentView(parentView) {
    }

    /// Accessing

    getMainHandle() {
        return this.mainHandle
    }

    subscribeToGUISignals() {
        throw Error(`The class ${this.constructor.name} must implement the method ::subscribeToGUISignals()`)
    }

    /// Asking

    getMainView() {
        return this
    }

    isTopMostView() {
        return false
    }
}

module.exports = View