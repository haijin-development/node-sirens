const Gtk = require('node-gtk').require('Gtk', '3.0')
const Sirens = require('../Sirens')

Sirens.initialize()

class AbstractView {
    /// Styles

    static acceptedStyles() {
        return [
            'width', 'height',
            'backgroundColor', 'foregroundColor',
            'populatePopupMenuBlock'
        ]
    }

    /// Initializing

    constructor() {
        this.childViews = []
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

    getMainView() {
        throw Error(`The class ${this.constructor.name} must implement the method ::getMainView()`)
    }

    getMainHandle() {
        throw Error(`The class ${this.constructor.name} must implement the method ::getMainHandle()`)
    }

    getChildHandles() {
        return [this.getMainHandle()]
    }

    /// Styles

    setWidth(value) {
        let [width, height] = this.getMainHandle().getDefaultSize()

        width = value

        this.getMainHandle().setDefaultSize(width, height)
    }

    getWidth(value) {
        return this.getMainHandle().getDefaultSize()[0]
    }

    setHeight(value) {
        let [width, height] = this.getMainHandle().getDefaultSize()

        height = value

        this.getMainHandle().setDefaultSize(width, height)
    }

    getHeight(value) {
        return this.getMainHandle().getDefaultSize()[1]
    }

    /// Menu

    setPopulatePopupMenuBlock(block) {
        this.populatePopupMenuBlock = block
    }

    getPopulatePopupMenuBlock(block) {
        return this.populatePopupMenuBlock
    }

    populatePopupMenu({menu: menuView}) {
        this.populatePopupMenuBlock({menu: menuView, ownerView: this})
    }
}

module.exports = AbstractView