const Protocol = require('../../O').Protocol

/*
 * Defines the implementation protocol for components that syncronize its contents with a ListModel.
 */
class ListModelComponentProtocol_Implementation {
    /// Events

    onItemsListChanged() {}

    onItemsAdded({list: list, items: items, index: index}) {
        this.param(list) .isArray()
        this.param(items) .isArray()
        this.param(index) .isInteger()
    }

    onItemsUpdated({list: list, items: items, indices: indices}) {
        this.param(list) .isArray()
        this.param(items) .isArray()
        this.param(indices) .isArray({
            forEachItem: (index) => {
                this.param(index) .isInteger()
            }
        })
    }

    onItemsRemoved({list: list, items: items, indices: indices}) {
        this.param(list) .isArray()
        this.param(items) .isArray()
        this.param(indices) .isArray({
            forEachItem: (index) => {
                this.param(index) .isInteger()
            }
        })
    }
}

module.exports = Protocol.define(ListModelComponentProtocol_Implementation)