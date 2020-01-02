const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Tabs {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Widget]
        this.implements = [ComponentBehaviourProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        return undefined
    }

    createView() {
        const view = this.namespace().Views.TabsView.new({
            onTabPageChanged: this.onTabPageChanged.bind(this)
        })

        view.assemble()

        return view
    }

    synchronizeViewFromModel() {
    }

    /// Queyring

    getPageComponents() {
        let pages = []

        this.getChildComponents().forEach( (childComponent) => {
            childComponent.concreteComponentsDo( (childComponent) => {
                pages.push( childComponent )
            })
        })

        return pages
    }

    getSelectedPageIndex() {
        return this.getView().getSelectedPageIndex()
    }

    getSelectedPageComponent() {
        const pages = this.getPageComponents()
        const selectedPageIndex = this.getSelectedPageIndex()

        return pages[selectedPageIndex]
    }

    /// Actions

    showTabPageAt({ index: index }) {
        this.getView().showTabPageAt({ index: index })
    }

    /// Events

    onTabPageChanged({ tabPageIndex: tabPageIndex }) {
        const tabPageChangedHandler = this.getProps().onTabPageChanged

        if( tabPageChangedHandler === undefined ) { return }

        tabPageChangedHandler({ tabPageIndex: tabPageIndex })
    }
}

module.exports = Classification.define(Tabs)