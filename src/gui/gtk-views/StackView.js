const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')

class StackView {
    /// Definition

    static definition() {
        this.instanceVariables = ['mainHandle']
        this.assumptions = [GtkWidget]
    }

    /// Initializing

    initialize({ orientation: orientation }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        if(orientation == 'horizontal') {
            this.mainHandle = new Gtk.HBox()
        } else {
            this.mainHandle = new Gtk.VBox()
        }
    }

    getMainHandle() {
        return this.mainHandle
    }

    /// Events

    subscribeToGUISignals() {
    }

    onViewAdded(childView) {
        childView = childView.getMainView()

        const packExpand = childView.getViewCustomAttribute({ at: 'packExpand', ifAbsent: true })
        const packFill = childView.getViewCustomAttribute({ at: 'packFill', ifAbsent: true })
        const packPadding = childView.getViewCustomAttribute({ at: 'packPadding', ifAbsent: 0 })

        const childHandles = childView.getChildHandles()

        childHandles.forEach( (childHandle) => {
            this.mainHandle.packStart(
                childHandle,
                packExpand,
                packFill,
                packPadding
            )

            childView.onAddedToParentView(this)

            childView.getMainHandle().show()
        })
    }
}

module.exports = Classification.define(StackView)
