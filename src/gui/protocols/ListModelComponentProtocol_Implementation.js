const Protocol = require('../../o-language/classifications/Protocol')

/*
 * Defines the implementation protocol for components that syncronize its contents with a ListModel.
 */
class ListModelComponentProtocol_Implementation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }

    /// Events

    onItemsListChanged() {}

    onItemsAdded({list: list, items: items, index: index}) {}

    onItemsUpdated({list: list, items: items, indices: indices}) {}

    onItemsRemoved({list: list, items: items, indices: indices}) {}
}

module.exports = Protocol.define(ListModelComponentProtocol_Implementation)