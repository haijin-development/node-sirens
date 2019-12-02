const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class SplitterView {
    /// Definition

    static definition() {
        this.instanceVariables = ['orientation', 'paned', 'isFirstSizeAllocation']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
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
        this.paned = this.newPaned()
    }

    subscribeToGUISignals() {
        const eventsSubscriptor = this.getEventsSubscriptor()

        eventsSubscriptor.on({
            event: 'size-allocate',
            from: this.paned,
            do: this.handleSizeAllocate,
            with: this,
        })
    }

    /// Accessing

    getMainHandle() {
        return this.paned
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

    directChildRemove(childView) {
        this.isFirstSizeAllocation = true

        this.previousClassificationDo( () => {
            this.directChildRemove( childView )
        })
    }

    directChildViewAdd(childView) {
        this.isFirstSizeAllocation = true

        const childHandle = childView.getMainHandle()

        childHandle.showAll()

        let lastParent = this.paned

        while( true ) {
            const children = lastParent.getChildren()

            if( children.length < 2 ) { break }

            const typeOfLastChildren = children[1].constructor

            if( typeOfLastChildren !== Gtk.HPaned && typeOfLastChildren !== Gtk.VPaned ) {
                break
            }

            lastParent = children[1]
        }

        const children = lastParent.getChildren()

        if( children.length < 2 ) {
            lastParent.add( childHandle )

            return
        }

        const lastChildren = lastParent.getChildren()[1]

        lastParent.remove(lastChildren)

        const paned = this.newPaned()

        paned.add( lastChildren )
        paned.add( childHandle )

        lastParent.add( paned )

        this.paned.showAll()
    }

    newPaned() {
        if( this.isHorizontal() ) {
            return new Gtk.HPaned()
        } else {
            return new Gtk.VPaned()
        }

    }

    /// Events

    handleSizeAllocate(rectangle) {
        if( this.isFirstSizeAllocation != true ) {
            return
        }

        this.isFirstSizeAllocation = false

        const width = rectangle.width
        const height = rectangle.height

        let remainingProportion = 1.0

        let currentHandle = this.paned

        const childViewsCount = this.getChildViews().length

        let totalSize
        let remainingSize

        if( this.isHorizontal() ) {
            totalSize = width
            remainingSize = width
        } else {
            totalSize = height
            remainingSize = height
        }

        this.getChildViews().forEach( (childView, index) => {

            if(index === childViewsCount) {
                return
            }

            const typeOfLastChildren = currentHandle.constructor
            if( typeOfLastChildren !== Gtk.HPaned && typeOfLastChildren !== Gtk.VPaned ) {
                return
            }

            const children = currentHandle.getChildren()

            const firstChild = children[0]

            const secondChild = children[1]

            const splitProportion = childView.getViewAttribute({ at: 'splitProportion' })

            const firstChildSize = totalSize * splitProportion

            remainingSize = remainingSize - firstChildSize

            this.setProportionalSize(firstChild, width, height, firstChildSize)

            if( secondChild === undefined ) {
                return
            }

            this.setProportionalSize(secondChild, width, height, remainingSize)

            currentHandle = secondChild
        })
    }

    setProportionalSize(childHandle, width, height, size) {
        const allocation = childHandle.getAllocation()

        if(this.isHorizontal()) {
            allocation.width = size

            childHandle.setSizeRequest(size, height)
            childHandle.sizeAllocate(allocation)
        } else {
            allocation.height = size

            childHandle.setSizeRequest(width, size)
            childHandle.sizeAllocate(allocation)
        }
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

module.exports = Classification.define(SplitterView)
