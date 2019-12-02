const Classification = require('../../O').Classification
const Announcer = require('../announcements/Announcer')
const ListModelProtocol = require('../protocols/ListModelProtocol')

class ListModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['list']
        this.assumes = [Announcer]
        this.implements = [ListModelProtocol]
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

        this.announce({
            event: 'list-changed',
            with: { oldList: oldList, newList: newList },
        })
    }

    getIndexOf({ item: item }) {
        return this.list.indexOf(item)
    }

    getItemAt({ index: index }) {
        return this.list[index]
    }

    /// Adding

    push(...items) {
        const index = this.list.length

        // optimized
        this.list.push(...items)

        this.announce({
            event: 'items-added',
            with: { list: this.list, items: items, index: index },
        })
    }

    insert({ index: index, item: item }) {
        if( item === undefined ) { throw new Error(`{ item: } is undefined. Are you trying to use ListModel.insertAll instead?`) }

        this.insertAll({ index: index, items: [item] })
    }

    insertAll({ index: index, items: items }) {
        if( items === undefined ) { throw new Error(`{ items: } is undefined. Are you trying to use ListModel.insert instead?`) }

        this.list.splice(index, 0, ...items)

        this.announce({
            event: 'items-added',
            with: { list: this.list, items: items, index: index },
        })
    }

    /// Updating

    update({ index: index, item: item })
    {
        if( item === undefined ) { throw new Error(`{ item: } is undefined. Are you trying to use ListModel.updateAll instead?`) }

        this.updateAll({ indices: [index], items: [item] })
    }

    updateAll({ indices: indices, items: items })
    {
        if( items === undefined ) { throw new Error(`{ items: } is undefined. Are you trying to use ListModel.update instead?`) }

        for (let i = 0; i < items.length; i++) {
            const index = indices[i]
            const item = items[i]

            this.list[index] = item
        }

        this.announce({
            event: 'items-updated',
            with: { list: this.list, items: items, indices: indices },
        })
    }

    /// Removing

    // Removes the first ocurrence of the item from the list.
    remove({ item: item }) {
        return this.removeAll({ items: [item] })
    }

    removeAll({ items: items }) {
        if( items === undefined ) { throw new Error(`{ items: } is undefined. Are you trying to use ListModel.remove instead?`) }

        const removedItems = []

        const removedIndices = this.indicesOf(items).sort().reverse()

        removedIndices.forEach( (index) => {
            removedItems.push(this.list[index])

            this.list.splice(index, 1)
        })

        this.announce({
            event: 'items-removed',
            with: { list: this.list, items: removedItems, indices: removedIndices },
        })
    }

    removeAt({ index: index }) {
        this.removeAllAt({ indices: [index] })
    }

    removeAllAt({ indices: indices }) {
        const removedItems = []

        const removedIndices = indices.slice().sort().reverse()

        removedIndices.forEach( (index) => {
            removedItems.push( this.list[index] )

            this.list.splice( index, 1 )
        })

        this.announce({
            event: 'items-removed',
            with: { list: this.list, items: removedItems, indices: removedIndices },
        })
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

    /// Events

    onListChanged({ with: object, do: closure }) {
        this.subscribe({
            event: 'list-changed',
            to: object,
            doing: closure,
        })        

        return this
    }

    onItemsAdded({ with: object, do: closure }) {
        this.subscribe({
            event: 'items-added',
            to: object,
            doing: closure,
        })        

        return this
    }

    onItemsUpdated({ with: object, do: closure }) {
        this.subscribe({
            event: 'items-updated',
            to: object,
            doing: closure,
        })        

        return this
    }

    onItemsRemoved({ with: object, do: closure }) {
        this.subscribe({
            event: 'items-removed',
            to: object,
            doing: closure,
        })        

        return this
    }
}

module.exports = Classification.define(ListModel)