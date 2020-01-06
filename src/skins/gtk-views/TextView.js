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
        this.instanceVariables = [
            'scrolledWindow', 'onTextChanged', 'textView', 'hasScrollBars',
        ]
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Styles

    acceptedStyles() {
        return this.previousClassificationDo( () => {
            return this.acceptedStyles().concat([
                'wrapMode',
                'hScroll', 'vScroll',
                'editable'
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

    setEditable(boolean) {
        this.textView.setEditable( boolean )
    }

    /// Initializing

    initialize({ onTextChanged: onTextChangedBlock, hasScrollBars: hasScrollBars }) {
        this.onTextChanged = onTextChangedBlock
        this.hasScrollBars = hasScrollBars === false ? false : true

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        if( this.hasScrollBars === false ) {
            this.textView = new Gtk.TextView()            
        } else {
            this.scrolledWindow = new Gtk.ScrolledWindow()

            this.scrolledWindow.setPolicy(
                GtkScroll.auto,
                GtkScroll.auto
            )

            this.textView = new Gtk.TextView()

            this.scrolledWindow.add( this.textView )
        }
    }

    /// Accessing

    getMainHandle() {
        return this.scrolledWindow ? this.scrolledWindow : this.textView
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
        const eventsSubscriptor = this.getEventsSubscriptor()

        eventsSubscriptor.on({
            event: 'populate-popup',
            from: this.textView,
            do: this.handlePopulateMenuPopup,
            with: this,
        })

        eventsSubscriptor.on({
            event: 'changed',
            from: this.textView.getBuffer(),
            do: this.handleTextChanged,
            with: this,
        })
    }

    handleTextChanged() {
        const onTextChanged = this.onTextChanged

        this.onTextChanged( this.getText() )
    }

    handlePopulateMenuPopup(menuHandle) {
        const menu = MenuView.newFromGtkWidget({
            gtkWidget: menuHandle,
            namespace: this.namespace(),
        })

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

    releaseHandles() {
        this.previousClassificationDo( () => {
            this.releaseHandles()
        })

        this.thisClassification().getDefinedInstanceVariables().forEach( (instVar) => {
            this[instVar] = null
        })
    }
}

module.exports = Classification.define(TextView)
