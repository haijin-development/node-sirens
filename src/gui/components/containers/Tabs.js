const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const TabsView = require('../../gtk-views/TabsView')
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
        return TabsView.new()
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
        this.getView().showTabPageAt({ index: 0 })
    }
}

module.exports = Classification.define(Tabs)