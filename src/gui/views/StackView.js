const OInstance = require('../../o-language/classifications/OInstance')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')

class StackView {
    /// Instantiating

    static new(orientation) {
        return OInstance.new().yourself( (checkbox) => {
            checkbox
                .behaveAs(this)
                .initializeHandles(orientation)
        })
    }

    /// Definition

    static definition() {
        this.instanceVariables = ['mainHandle']
        this.assumptions = [GtkWidget]
    }

    /// Initializing

    initializeHandles(orientation) {
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
}

module.exports = StackView