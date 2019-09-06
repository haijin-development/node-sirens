const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const Sirens = require('../../Sirens')
const MenuView = require('./MenuView')

Sirens.initialize()

class GtkView {
    /// Definition

    static definition() {
        this.instanceVariables = ['childViews', 'viewCustomAttributes']
    }

    /// Styles

    acceptedStyles() {
        return [
            'width', 'height',
            'backgroundColor', 'foregroundColor',
            'populatePopupMenuBlock',
            'viewCustomAttributes'
        ]
    }

    /// Initializing

    afterInstantiation() {
        this.childViews = []
        this.viewCustomAttributes = []
    }

    addView(childView) {
        this.childViews.push(childView)

        this.onViewAdded(childView)
    }

    /// Events

    onViewAdded(childView) {
        throw Error(`The class ${this.constructor.name} must implement the method ::onViewAdded()`)
    }

    onAddedToParentView(parentView) {
        throw Error(`The class ${this.constructor.name} must implement the method ::onAddedToParentView()`)
    }

    /// Accessing

    getChildViews() {
        return this.childViews
    }

    getMainView() {
        throw Error(`The class ${this.constructor.name} must implement the method ::getMainView()`)
    }

    getMainHandle() {
        throw Error(`The class ${this.constructor.name} must implement the method ::getMainHandle()`)
    }

    getChildHandles() {
        return [this.getMainHandle()]
    }

    getChildrenCount() {
        return this.childViews.length
    }

    /// Styles

    setWidth(value) {
        const sizeRequest = this.getMainHandle().getSizeRequest()

        sizeRequest.width = value

        this.getMainHandle().setSizeRequest(sizeRequest.width, sizeRequest.height)
    }

    getWidth(value) {
        return this.getMainHandle().getSizeRequest().width
    }

    setHeight(value) {
        const sizeRequest = this.getMainHandle().getSizeRequest()

        sizeRequest.height = value

        this.getMainHandle().setSizeRequest(sizeRequest.width, sizeRequest.height)
    }

    getHeight(value) {
        return this.getMainHandle().getSizeRequest().height
    }

    /// View custom attributes

    setViewCustomAttributes(value) {
        this.viewCustomAttributes = value
    }

    getViewCustomAttributes() {
        return this.viewCustomAttributes
    }

    getViewCustomAttribute({ at: attributeName, ifAbsent: absentValue }) {
        const value = this.viewCustomAttributes[attributeName]

        return value !== undefined ? value : absentValue
    }
}

module.exports = Classification.define(GtkView)