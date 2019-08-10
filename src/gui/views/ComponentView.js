const AbstractView = require('./AbstractView')

class ComponentView extends AbstractView {
    onViewAdded(childView) {
    }

    /// Accessing

    getMainView() {
        if( this.childViews.length === 0 ) {
            throw Error(`The ${this.constructor.name} has no main child view.`)
        }

        return this.childViews[0].getMainView()
    }

    getMainHandle() {
        return this.getMainView().getMainHandle()
    }

    getChildHandles() {
        let handles = []

        this.childViews.forEach( (view) => {
            handles = handles.concat( view.getChildHandles() )
        })

        return handles
    }

    /// Actions

    open() {
        return this.getMainHandle().open()
    }

    addView(childView) {
        this.childViews.push(childView)

        if(!childView.isTopMostView()) {
            this.onViewAdded(childView)
        }
    }

    /// Events

    onAddedToParentView(parentView) {
    }
}

module.exports = ComponentView