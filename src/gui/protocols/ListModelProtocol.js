const Protocol = require('../../O').Protocol

class ListModelProtocol {

    /// Accessing

    getList() {}

    setList(newList) {
        this.param(newList) .isArray()
    }

    getIndexOf({ item: item }) {}

    getItemAt({ index: index }) {
        this.param(index) .isInteger()
    }

    /// Adding

    push(...items) {
        this.param(items) .isArray()
    }

    insert({ index: index, item: item }) {
        this.param(index) .isInteger()
    }

    insertAll({ index: index, items: items }) {
        this.param(index) .isInteger()
        this.param(items) .isArray()
    }

    /// Updating

    update({ index: index, item: item }) {
        this.param(index) .isInteger()
    }

    updateAll({ indices: indices, items: items }) {
        this.param(indices) .isArray()
        this.param(items)   .isArray()
    }

    /// Removing

    // Removes the first ocurrence of the item from the list.
    remove({ item: item }) {}

    removeAll({ items: items }) {
        this.param(items) .isArray()
    }

    removeAt({ index: index }) {
        this.param(index) .isInteger()
    }

    removeAllAt({ indices: indices }) {
        this.param(indices) .isArray()
    }

    indicesOf(items) {
        this.param(items) .isArray()
    }

    /// Events

    onListChanged(closure) {
        this.param(closure) .isFunction()
    }

    onItemsAdded(closure) {
        this.param(closure) .isFunction()
    }

    onItemsUpdated(closure) {
        this.param(closure) .isFunction()
    }

    onItemsRemoved(closure) {
        this.param(closure) .isFunction()
    }
}

module.exports = Protocol.define(ListModelProtocol)