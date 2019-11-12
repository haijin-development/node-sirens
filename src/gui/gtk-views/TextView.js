const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const GtkWrapModes = require('./constants/GtkWrapModes')
const GtkScroll = require('./constants/GtkScroll')
const MenuView = require('./MenuView')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class TextView {
    /// Definition

    static definition() {
        this.instanceVariables = ['scrolledWindow', 'onTextChanged', 'textView']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Styles

    acceptedStyles() {
        return this.previousClassificationDo( () => {
            return this.acceptedStyles().concat([
                'wrapMode',
                'hScroll', 'vScroll',
            ])
        })
    }

    setHScroll(value) {
        const [hScroll, vScroll] = this.scrolledWindow.getPolicy()

        this.scrolledWindow.setPolicy(
            GtkScroll[ value ],
            vScroll
        )
    }

    setVScroll(value) {
        const [hScroll, vScroll] = this.scrolledWindow.getPolicy()

        this.scrolledWindow.setPolicy(
            hScroll,
            GtkScroll[ value ]
        )        
    }

    setCss(cssClasses) {
        if( typeof(cssClasses) === 'string' ) {
            cssClasses = cssClasses.trim().split( ' ' )
        }

        const styleContext = this.textView.getStyleContext()

        cssClasses.forEach( (cssClass) => {
            styleContext.addClass( cssClass.trim() )
        })
    }

    /// Initializing

    initialize({ onTextChanged: onTextChangedBlock }) {
        this.onTextChanged = onTextChangedBlock

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        this.scrolledWindow = new Gtk.ScrolledWindow()

        this.scrolledWindow.setPolicy(
            GtkScroll.auto,
            GtkScroll.auto
        )

        this.textView = new Gtk.TextView()

        this.scrolledWindow.add( this.textView )
    }

    /// Accessing

    getMainHandle() {
        return this.scrolledWindow
    }

    clearText() {
        this.setText('')
    }

    setText(text) {
        if( text === undefined || text === null ) {
            text = ''
        }

        text = this.textToWindowText(text)

        this.textView.getBuffer().text = text
    }

    getText() {
        const windowText = this.textView.getBuffer().text

        return this.windowTextToText(windowText)
    }

    getSelectedText() {
        const [hasSelection, iterFrom, iterTo] = this.textView.getBuffer().getSelectionBounds()

        if(hasSelection === false) {
            return ''
        }

        const windowText = this.textView.getBuffer().getText(iterFrom, iterTo, false)

        return this.windowTextToText(windowText)
    }

    /// Events

    subscribeToGUISignals() {
        this.textView.on( 'populate-popup', this.handlePopulateMenuPopup.bind(this) )

        this.textView.getBuffer().on( 'changed', this.handleTextChanged.bind(this) )
    }

    handleTextChanged() {
        const onTextChanged = this.onTextChanged

        this.onTextChanged( this.getText() )
    }

    handlePopulateMenuPopup(menuHandle) {
        const menu = MenuView.newFromGtkWidget(menuHandle)

        this.populatePopupMenu({ menu: menu })        
    }

    /// Styles

    setWrapMode(mode) {
        this.textView.setWrapMode(GtkWrapModes[mode])
    }

    getWrapMode() {
        const gtkConstant = this.textView.getWrapMode()

        const mode = Object.keys(GtkWrapModes).find( (key) => {
            return gtkConstant === GtkWrapModes[key]
        })

        return mode
    }

    /// Converting

    textToWindowText(text) {
        return text.split("\n").join( "\r" )
    }

    windowTextToText(windowText) {
        return windowText.split("\r").join( "\n" )
    }
}

module.exports = Classification.define(TextView)
