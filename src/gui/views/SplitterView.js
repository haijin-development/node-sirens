const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')

class SplitterView {
    /// Definition

    static definition() {
        this.instanceVariables = ['orientation', 'mainHandle', 'isFirstSizeAllocation']
        this.assumptions = [GtkWidget]
    }

    /// Initializing

    initialize({ orientation: orientation }) {
        this.orientation = orientation

        this.isFirstSizeAllocation = true

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        this.mainHandle = this.newPaned(this.orientation)
    }

    subscribeToGUISignals() {
        this.mainHandle.on('size-allocate', this.onSizeAllocation.bind(this))
    }

    /// Accessing

    getMainHandle() {
        return this.mainHandle
    }

    orientation() {
        return this.orientation
    }

    isVertical() {
        return this.orientation == 'vertical'
    }

    isHorizontal() {
        return this.orientation == 'horizontal'
    }

    /// Adding child views

    addView(childView) {
        const childViewHandle = childView.getMainHandle()

        const childViews = this.getChildViews()

        if(childViews.length < 2) {
            this.mainHandle.add(childViewHandle)

            childViewHandle.show()
        } else {
            const newPaned = this.newPaned(this.orientation)

            const lastView = childViews[ childViews.length - 1 ]
            const lastChildHandle = lastView.getMainHandle()

            const parentHandle = lastChildHandle.getParent()
            parentHandle.remove(lastChildHandle)

            parentHandle.add(newPaned)

            newPaned.add(lastChildHandle)
            newPaned.add(childViewHandle)

            parentHandle.showAll()
        }

        childViews.push(childView)
    }

    newPaned(orientation) {
        if(orientation == 'horizontal') {
            return new Gtk.HPaned()
        } else {
            return new Gtk.VPaned()
        }

    }

    /// Events

    onSizeAllocation(rectangle) {
        if(this.isFirstSizeAllocation != true) {
            return
        }

        this.mainHandle.off('size-allocate')
        this.isFirstSizeAllocation = false

        const width = rectangle.width
        const height = rectangle.height

        let remainingProportion = 1.0

        let currentHandle = this.mainHandle

        const childViewsCount = this.getChildViews().length

        this.getChildViews().forEach( (childView, index) => {

            if(index === childViewsCount) {
                return
            }

            if( currentHandle.getChildren === undefined || currentHandle.getChildren().length == 0 ) {
                return
            }

            const proportion = childView.splitProportion

            remainingProportion = remainingProportion - proportion

            const children = currentHandle.getChildren()

            const firstChild = children[0]

            this.setProportionalSize(firstChild, width, height, proportion)

            const secondChild = children[1]

            if( secondChild === undefined ) {
                return
            }

            this.setProportionalSize(secondChild, width, height, remainingProportion)

            currentHandle = secondChild
        })
    }

    setProportionalSize(childHandle, width, height, proportion) {
        if(this.isHorizontal()) {
            childHandle.setSizeRequest(width * proportion, height)
        } else {
            childHandle.setSizeRequest(width, height * proportion)
        }
    }
}

module.exports = Classification.define(SplitterView)
