const Gtk = require('node-gtk').require('Gtk', '3.0')
const OInstance = require('../../o-language/classifications/OInstance')

const gtkMenuMethodsToCopy = ['add', 'showAll', 'popupAtPointer']

class MenuView {
    /// Instantiating

    /*
     * Downcast a GtkWidget handle to a Gtk.Menu handle.
     *
     * Actually we just copy and bind the functions that the MenuView uses from a Gtk.Menu to the given
     * gtkWidget. Don't know if there is a cleaner way to do it.
     */
    static castGtkWidgetToGtkMenu(gtkWidget) {
        Object.setPrototypeOf(gtkWidget, Gtk.Menu.prototype)

        return gtkWidget
    }

    /// Instantiating

    static new({ gtkWidget: gtkWidget } = { gtkWidget: undefined })
    {
        return OInstance.new().yourself( (menu) => {
            menu
                .behaveAs(this)
                .initialize({ gtkWidget: gtkWidget })
        })
    }

    /*
     * Returns a new MenuView wrapping the given GtkWidget.
     */
    static newFromGtkWidget(gtkWidget) {
        const gtkWidget = this.castGtkWidgetToGtkMenu(gtkWidget)

        return this.new({ gtkWidget: gtkWidget })
    }

    /// Definition

    static definition() {
        this.instanceVariables = [ 'menuHandle' ]
    }

    /// Initializing

    initialize({ gtkWidget: gtkWidget }) {
        if(gtkWidget === undefined) {
            gtkWidget = new Gtk.Menu()
        }

        this.menuHandle = gtkWidget
    }

    /// Querying

    getItemsCount() {
        return this.menuHandle.getChildren().length
    }

    /// Adding

    addItem({label: label, enabled: enabled, action: action}) {
        if(enabled === undefined) {
            enabled = true
        }

        const menuItemHandle = new Gtk.MenuItem({label: label})

        menuItemHandle.sensitive = enabled

        menuItemHandle.on('activate', (props) => {
            action()
        })

        this.menuHandle.add(menuItemHandle)

        menuItemHandle.show()
    }

    addSeparator() {
        const menuSeparatorHandle = new Gtk.SeparatorMenuItem()

        this.menuHandle.add(menuSeparatorHandle)

        menuSeparatorHandle.show()
    }

    /// Operations

    open() {
        this.menuHandle.showAll()
        this.menuHandle.popupAtPointer()
    }
}

module.exports = MenuView