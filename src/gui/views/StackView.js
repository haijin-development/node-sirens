const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')

const StackView = Classification.define( class {
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
        const childHandles = childView.getChildHandles()

        const packExpand = childView.packExpand !== undefined ? childView.packExpand : true
        const packFill = childView.packFill !== undefined ? childView.packFill : true
        const packPadding = childView.packPadding !== undefined ? childView.packPadding : 0

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
})

module.exports = StackView