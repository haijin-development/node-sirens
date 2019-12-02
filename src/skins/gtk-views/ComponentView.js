const Classification = require('../../O').Classification
const GtkView = require('./GtkView')
const GtkViewProtocol_Implementation = require('../protocols/GtkViewProtocol_Implementation')

class ComponentView {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [GtkView]
        this.implements = [GtkViewProtocol_Implementation]
    }

    /// Accessing

    getMainHandle() {
        throw Error(`ComponentView has no main handle.`)
    }

    getOnlyChildViewMainHandle() {
        const childViews = this.getChildViews()

        if( childViews.length != 1 ) {
            throw new Error(
                `This ComponentView must have exactly 1 childView to respond ComponentView.getOnlyChildViewMainHandle.`
            )
        }

        return childViews[0].getOnlyChildViewMainHandle()
    }

    connectToParentHandleOwnerView() {
        this.getChildViews().forEach( (childView) => {
            const parentHandleOwnerView = this.getParentHandleOwnerView()

            childView.setParentHandleOwnerView( parentHandleOwnerView )

            childView.connectToParentHandleOwnerView()
        })
    }

    disconnectFromParentHandleOwnerView() {
        this.getChildViews().forEach( (childView) => {
            childView.disconnectFromParentHandleOwnerView()
        })
    }

    concreteViewsDo(closure) {
        this.getChildViews().forEach( (childView) => {
            childView.concreteViewsDo(closure)
        })
    }

    isComponentView() {
        return true
    }

    /// Actions

    open() {
        return this.getMainHandle().open()
    }

    /// Child views

    directChildViewAdd(childView) {
        throw new Error(
            `ComponentView.directChildViewAdd() should not be called since it is not a handle owner.`
        )
    }

    directChildViewRemove(childView) {
        throw new Error(
            `ComponentView.directChildViewRemove() should not be called since it is not a handle owner.`
        )
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

module.exports = Classification.define(ComponentView)