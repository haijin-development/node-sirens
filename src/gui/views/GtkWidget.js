const Classification = require('../../o-language/classifications/Classification')
const GtkView = require('./GtkView')
const GtkWidgetWithContextMenu = require('./GtkWidgetWithContextMenu')

class GtkWidget extends Classification {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [GtkView, GtkWidgetWithContextMenu]
    }

    /// Initializing

    initialize() {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.initializeHandles()

        this.subscribeToGUISignals()
    }

    initializeHandles() {
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
        throw Error(`The class ${this.constructor.name} must implement the method ::getMainHandle()`)
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

module.exports = GtkWidget