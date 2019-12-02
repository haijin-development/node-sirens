const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../O').Classification
const OInstance = require('../../O').OInstance

class MenuViewBuilder {
    /// Instantiating

    /*
     * Downcast a GtkWidget handle to a Gtk.Menu handle.
     *
     * Actually we just copy and bind the functions that the MenuView uses from a Gtk.Menu to the given
     * gtkWidget.
     */
    castGtkWidgetToGtkMenu(gtkWidget) {
        Object.setPrototypeOf(gtkWidget, Gtk.Menu.prototype)

        return gtkWidget
    }

    /*
     * Returns a new MenuView wrapping the given GtkWidget.
     */
    newFromGtkWidget(gtkWidget) {
        gtkWidget = this.castGtkWidgetToGtkMenu(gtkWidget)

        return this.new({ gtkWidget: gtkWidget })
    }
}

MenuViewBuilder = Classification.define(MenuViewBuilder)


const gtkMenuMethodsToCopy = ['add', 'showAll', 'popupAtPointer']

class MenuView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'menuHandle' ]
        this.classificationBehaviours = [MenuViewBuilder]
    }

    /// Initializing

    initialize({ gtkWidget: gtkWidget } = { gtkWidget: undefined }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

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

    item({label: label, enabled: enabled, action: action}) {
        if( enabled === undefined ) {
            enabled = true
        }

        if( OInstance.isOInstance(enabled) && enabled.respondsTo('getValue') ) {
            enabled = enabled.getValue() === true
        }

        const menuItemHandle = new Gtk.MenuItem({label: label})

        menuItemHandle.setSensitive( enabled )

        menuItemHandle.on('activate', (props) => {
            action()
        })

        this.menuHandle.add(menuItemHandle)

        this.menuHandle.showAll()
    }

    separator() {
        const menuSeparatorHandle = new Gtk.SeparatorMenuItem()

        this.menuHandle.add(menuSeparatorHandle)

        this.menuHandle.showAll()
    }

    /// Operations

    open() {
        this.menuHandle.showAll()
        this.menuHandle.popupAtPointer()
    }

    releaseHandles() {
        this.previousClassificationDo( () => {
            this.releaseHandles()
        })

        this.thisClassification().getDefinedInstanceVariables().forEach( (instVar) => {
            this[instVar] = null
        })
    }
}

MenuView = Classification.define(MenuView)

module.exports = MenuView