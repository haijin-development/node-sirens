const expect = require('chai').expect
const ListModel = require('../../../src/models/ListModel')

describe('When using a ListModel', () => {
    beforeEach( () => {
        this.triggeredEvent = false
    })

    describe('when setting and getting its list', () => {
        it('sets its list in its constructor', () => {
            const list_model = new ListModel({list: [1, 2, 3]})

            expect(list_model.getList()) .to .eql([1, 2, 3])
        })

        it('sets and gets its list', () => {
            const list_model = new ListModel()

            list_model.setList([1, 2, 3])

            expect(list_model.getList()) .to .eql([1, 2, 3])
        })

        it('sets and gets a lits over an existent list', () => {
            const list_model = new ListModel()

            list_model.setList([1, 2, 3])

            list_model.setList([1, 2, 3, 4])

            expect(list_model.getList()) .to .eql([1, 2, 3, 4])
        })

        it('triggers a list-changed event', () => {
            const list_model = new ListModel()

            list_model.on('list-changed', (event) => {
                this.triggeredEvent = true

                expect(event.oldList) .to .eql([])
                expect(event.newList) .to .eql([1])
            })

            list_model.setList([1])

            expect(this.triggeredEvent) .to .be .true
        })
    })

    describe('when adding items', () => {
        it('adds an item', () => {
            const list_model = new ListModel()

            list_model.on('items-added', (event) => {
                this.triggeredEvent = true

                expect(event.list) .to .eql([1])
                expect(event.items) .to .eql([1])
                expect(event.index) .to .eql(0)
            })

            list_model.push(1)

            expect(list_model.getList()) .to .eql([1])
            expect(this.triggeredEvent) .to .be .true
        })

        it('adds many items', () => {
            const list_model = new ListModel()

            list_model.on('items-added', (event) => {
                this.triggeredEvent = true

                expect(event.list) .to .eql([1, 2, 3])
                expect(event.items) .to .eql([1, 2, 3])
                expect(event.index) .to .eql(0)
            })

            list_model.push(1, 2, 3)

            expect(list_model.getList()) .to .eql([1, 2, 3])
            expect(this.triggeredEvent) .to .be .true
        })

        it('adds an item at a position', () => {
            const list_model = new ListModel()

            list_model.push(1, 2, 3)

            list_model.on('items-added', (event) => {
                this.triggeredEvent = true

                expect(event.list) .to .eql([1, 4, 2, 3])
                expect(event.items) .to .eql([4])
                expect(event.index) .to .eql(1)
            })

            list_model.insert(1, 4)

            expect(list_model.getList()) .to .eql([1, 4, 2, 3])
            expect(this.triggeredEvent) .to .be .true
        })

        it('adds many items at a position', () => {
            const list_model = new ListModel()

            list_model.push(1, 2, 3)

            list_model.on('items-added', (event) => {
                this.triggeredEvent = true

                expect(event.list) .to .eql([1, 4, 5, 6, 2, 3])
                expect(event.items) .to .eql([4, 5, 6])
                expect(event.index) .to .eql(1)
            })

            list_model.insert(1, 4, 5, 6)

            expect(list_model.getList()) .to .eql([1, 4, 5, 6, 2, 3])
            expect(this.triggeredEvent) .to .be .true
        })
    })

    describe('when updating items', () => {
        it('updates an item', () => {
            const list_model = new ListModel({list: [1, 2, 3]})

            list_model.on('items-updated', (event) => {
                this.triggeredEvent = true

                expect(event.list) .to .eql([1, 'a', 3])
                expect(event.items) .to .eql(['a'])
                expect(event.indices) .to .eql([1])
            })

            list_model.update({index: 1, item: 'a'})

            expect(list_model.getList()) .to .eql([1, 'a', 3])
            expect(this.triggeredEvent) .to .be .true
        })

        it('updates many items', () => {
            const list_model = new ListModel({list: [1, 2, 3]})

            list_model.on('items-updated', (event) => {
                this.triggeredEvent = true

                expect(event.list) .to .eql(['a', 'b', 3])
                expect(event.items) .to .eql(['a', 'b'])
                expect(event.indices) .to .eql([0, 1])
            })

            list_model.update({indices: [0, 1], items: ['a', 'b']})

            expect(list_model.getList()) .to .eql(['a', 'b', 3])
            expect(this.triggeredEvent) .to .be .true
        })
    })

    describe('when removing items', () => {
        it('removes an item', () => {
            const list_model = new ListModel({list: ['a', 'b', 'c']})

            list_model.on('items-removed', (event) => {
                this.triggeredEvent = true

                expect(event.list) .to .eql(['a', 'c'])
                expect(event.items) .to .eql(['b'])
                expect(event.indices) .to .eql([1])
            })

            list_model.remove('b')

            expect(list_model.getList()) .to .eql(['a', 'c'])
            expect(this.triggeredEvent) .to .be .true
        })

        it('removes many items', () => {
            const list_model = new ListModel({list: ['a', 'b', 'c']})

            list_model.on('items-removed', (event) => {
                this.triggeredEvent = true

                expect(event.list) .to .eql(['c'])
                expect(event.items) .to .eql(['b', 'a'])
                expect(event.indices) .to .eql([1, 0])
            })

            list_model.removeAll(['a', 'b'])

            expect(list_model.getList()) .to .eql(['c'])
            expect(this.triggeredEvent) .to .be .true
        })

        it('removes an item at an index', () => {
            const list_model = new ListModel({list: ['a', 'b', 'c']})

            list_model.on('items-removed', (event) => {
                this.triggeredEvent = true

                expect(event.list) .to .eql(['a', 'c'])
                expect(event.items) .to .eql(['b'])
                expect(event.indices) .to .eql([1])
            })

            list_model.removeAt(1)

            expect(list_model.getList()) .to .eql(['a', 'c'])
            expect(this.triggeredEvent) .to .be .true
        })

        it('removes many items at indices', () => {
            const list_model = new ListModel({list: ['a', 'b', 'c']})

            list_model.on('items-removed', (event) => {
                this.triggeredEvent = true

                expect(event.list) .to .eql(['a'])
                expect(event.items) .to .eql(['c', 'b'])
                expect(event.indices) .to .eql([2, 1])
            })

            list_model.removeAllAt([1, 2])

            expect(list_model.getList()) .to .eql(['a'])
            expect(this.triggeredEvent) .to .be .true
        })
    })
})
