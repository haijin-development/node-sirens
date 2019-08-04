const Gtk = require('node-gtk').require('Gtk', '3.0')

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
        const tmpGtkMenu = new Gtk.Menu()

        gtkMenuMethodsToCopy.forEach( (eachMethod) => {
            gtkWidget[eachMethod] = tmpGtkMenu[eachMethod].bind(gtkWidget)
        })

        return gtkWidget
    }

    /*
     * Returns a new MenuView wrapping the given GtkWidget.
     */
    static newFromGtkWidget(gtkWidget) {
        const menuHandle = this.castGtkWidgetToGtkMenu(gtkWidget)

        return new this(menuHandle)
    }

    /// Initializing

    constructor(menuHandle) {
        if(menuHandle === undefined) {
            menuHandle = new Gtk.Menu()
        }

        this.menuHandle = menuHandle
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