const Classification = require('../../o-language/classifications/Classification')
const Component = require('./Component')
const ListModelComponentProtocol_Implementation = require('../protocols/ListModelComponentProtocol_Implementation')
const ComponentProtocol = require('../protocols/ComponentProtocol')
const ComponentProtocol_Implementation = require('../protocols/ComponentProtocol_Implementation')
const ListModel = require('../models/ListModel')

class ComponentsList {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [
            ListModelComponentProtocol_Implementation,
            ComponentProtocol,
        ]
        this.expects = [ComponentProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        return ListModel.new({ list: [] })
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const items = this.getModel().getList()

        componentsRenderer.render( function(component) {
            items.forEach( (item, index) => {
                component.renderItem({ item: item, index: index, renderer: this })
            })
        })
    }


    /// Events

    /**
     * Subscribes this component to the model events
     */
    subscribeToModelEvents() {
        this.previousClassificationDo( () => {
            this.subscribeToModelEvents()
        })

        this.getModel().on('list-changed', this.onItemsListChanged.bind(this))

        this.getModel().on('items-added', this.onItemsAdded.bind(this))
        this.getModel().on('items-updated', this.onItemsUpdated.bind(this))
        this.getModel().on('items-removed', this.onItemsRemoved.bind(this))
    }

    onItemsListChanged() {
        this.removeAllChildrenComponents()

        this.build()
    }

    /*
        Implementation note: rewrite this method to render the changed components only.
    */
    onItemsAdded({ list: list, items: items, index: index }) {
        this.onItemsListChanged()
    }

    /*
        Implementation note: rewrite this method to render the changed components only.
    */
    onItemsUpdated({ list: list, items: items, indices: indices }) {
        this.onItemsListChanged()
    }

    /*
        Implementation note: rewrite this method to render the changed components only.
    */
    onItemsRemoved({ list: list, items: items, indices: indices }) {
        this.onItemsListChanged()
    }
}

module.exports = Classification.define(ComponentsList)