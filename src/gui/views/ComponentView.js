const Classification = require('../../o-language/classifications/Classification')
const GtkView = require('./GtkView')

class ComponentView {
    /// Definition

    static definition() {
        this.instanceVariables = ['mainHandle', 'onClickedBlock']
        this.assumptions = [GtkView]
    }

    onViewAdded(childView) {
    }

    /// Accessing

    getMainView() {
        if( this.getChildViews().length === 0 ) {
            throw Error(`The ${this.constructor.name} has no main child view.`)
        }

        return this.getChildViews()[0].getMainView()
    }

    getMainHandle() {
        return this.getMainView().getMainHandle()
    }

    getChildHandles() {
        let handles = []

        this.getChildViews().forEach( (view) => {
            handles = handles.concat( view.getChildHandles() )
        })

        return handles
    }

    /// Actions

    open() {
        return this.getMainHandle().open()
    }

    addView(childView) {
        this.getChildViews().push(childView)

        if(!childView.isTopMostView()) {
            this.onViewAdded(childView)
        }
    }

    /// Events

    onAddedToParentView(parentView) {
    }
}

module.exports = Classification.define(ComponentView)