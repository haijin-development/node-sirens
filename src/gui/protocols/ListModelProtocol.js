const Protocol = require('../../o-language/classifications/Protocol')

class ListModelProtocol {

    /// Accessing

    getList() {}

    setList(newList) {}

    getIndexOf({ item: item }) {}

    getItemAt({ index: index }) {}

    /// Adding

    push(...items) {}

    insert({ index: index, item: item }) {}

    insertAll({ index: index, items: items }) {}

    /// Updating

    update({ index: index, item: item }) {}

    updateAll({ indices: indices, items: items }) {}

    /// Removing

    // Removes the first ocurrence of the item from the list.
    remove({ item: item }) {}

    removeAll({ items: items }) {}

    removeAt({ index: index }) {}

    removeAllAt({ indices: indices }) {}

    indicesOf(items) {}

    /// Events

    onListChanged(closure) {}
    onItemsAdded(closure) {}
    onItemsUpdated(closure) {}
    onItemsRemoved(closure) {}
}

module.exports = Protocol.define(ListModelProtocol)