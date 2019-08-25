const Classification = require('../../o-language/classifications/Classification')
const Model = require('./Model')

const ListModel = Classification.define( class {
    /// Definition

    static definition() {
        this.instanceVariables = ['list']
        this.assumptions = [Model]
    }

    /// Initializing

    initialize({ list: list } = { list: [] }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.list = list
    }

    /// Accessing

    getList() {
        return this.list
    }

    setList(newList) {
        const oldList = this.list

        this.list = newList

        this.emit('list-changed', {oldList: oldList, newList: newList})
    }

    getIndexOf(item) {
        return this.list.indexOf(item)
    }

    /// Adding

    push(...items) {
        const index = this.list.length

        // optimized
        this.list.push(...items)

        this.emit('items-added', {list: this.list, items: items, index: index})
    }

    insert(index, ...items) {
        this.list.splice(index, 0, ...items)

        this.emit('items-added', {list: this.list, items: items, index: index})
    }

    /// Updating

    update({index: index, item: item, indices: indices, items: items} =
               {index: undefined, item: undefined, indices: undefined, items: undefined})
    {
        if(indices === undefined) {
            indices = [index]
        }

        if(items === undefined) {
            items = [item]
        }

        this.updateAll({indices: indices, items: items})
    }

    updateAll({indices: indices, items: items})
    {
        for (let i = 0; i < items.length; i++) {
            const index = indices[i]
            const item = items[i]

            this.list[index] = item
        }

        this.emit('items-updated', {list: this.list, items: items, indices: indices})
    }

    /// Removing

    // Removes the first ocurrence of the item from the list.
    remove(item) {
        const index = this.list.indexOf(item)

        this.list.splice(index, 1)

        this.emit('items-removed', {list: this.list, items: [item], indices: [index]})
    }

    removeAll(items) {
        const removedItems = []

        const removedIndices = this.indicesOf(items).sort().reverse()

        removedIndices.forEach( (index) => {
            removedItems.push(this.list[index])

            this.list.splice(index, 1)
        })

        this.emit('items-removed', {list: this.list, items: removedItems, indices: removedIndices})
    }

    removeAt(index) {
        this.removeAllAt([index])
    }

    removeAllAt(indices) {
        const removedItems = []

        const removedIndices = indices.slice().sort().reverse()

        removedIndices.forEach( (index) => {
            removedItems.push(this.list[index])

            this.list.splice(index, 1)
        })

        this.emit('items-removed', {list: this.list, items: removedItems, indices: removedIndices})
    }

    indicesOf(items) {
        const indices = []

        this.list.forEach((item, index) => {
            if( items.includes(item) ) {
                indices.push(index)
            }
        })

        return indices
    }
})

module.exports = ListModel