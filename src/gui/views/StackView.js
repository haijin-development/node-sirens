const Gtk = require('node-gtk').require('Gtk', '3.0')
const View = require('./View')

class StackView extends View {
    /// Initializing

    initializeHandles(orientation) {
        this.orientation = orientation

        if(this.orientation == 'horizontal') {
            this.mainHandle = new Gtk.HBox()
        } else {
            this.mainHandle = new Gtk.VBox()
        }
    }

    /// Events

    subscribeToGUISignals(props) {
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
}

module.exports = StackView