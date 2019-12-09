const expect = require('chai').expect
const Flow = require('../../../../src/finger-tips/flows/Flow')
const TreeChoiceFlow = require('../../../../src/finger-tips/flows/TreeChoiceFlow')

describe('When using a TreeChoiceFlow', () => {

    describe('ids', () => {

        it('gets a flow id', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            const childFlow = flow.getChildFlow({ id: 'flow-1' })

            expect( childFlow.getId() ) .to .eql('flow-1')
        })

        it('gets a flow id path', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            const childFlow = flow.getChildFlow({ id: 'flow-1' })

            expect( childFlow.getIdPath() ) .to .eql('main.flow-1')
        })

    })

    describe('searches', () => {

        it('raises an error if the child does not exist', () => {
            const flow = Flow.new({ id: 'main' })

            expect( () => {

                flow.getChildFlow({ id: 'flow-1' })

            }).to .throw("Child flow with {id: 'flow-1'} not found.")
        })

        it('gets a child flow', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            const childFlow = flow.getChildFlow({ id: 'flow-1' })

            expect( childFlow.getId() ) .to .eql('flow-1')
        })

    })

    describe('values', () => {

        it('gets a flow roots', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    roots: [1, 2, 3],
                    getChildrenClosure: () => {},
                })
            })

            const childFlow = flow.getChildFlow({ id: 'flow-1' })

            expect( childFlow.getRoots() ) .to .eql([1, 2, 3])
        })

        it('sets a flow roots', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    roots: [1, 2, 3],
                    getChildrenClosure: () => {},
                })
            })

            const childFlow = flow.getChildFlow({ id: 'flow-1' })

            childFlow.setRoots({ items: [1, 2] })

            expect( childFlow.getRoots() ) .to .eql([1, 2])
        })

        it('sets the flow selection', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    roots: [1, 2, 3],
                    getChildrenClosure: () => {},
                })
            })

            const childFlow = flow.getChildFlow({ id: 'flow-1' })

            const result = childFlow.setSelection([ 2 ])

            expect( childFlow.getSelection() ) .to .eql( [2] )
        })

    })

    describe('events', () => {

        it('evaluates the flow onSelectionChanged handler when setting its selection', () => {
            const flow = Flow.new({ id: 'main' })

            let onSelectionChanged = false

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    roots: [1, 2, 3],
                    getChildrenClosure: () => {},
                    whenSelectionChanges: ({ newValue: newSelection, oldValue: oldSelection }) => {
                        onSelectionChanged = { newValue: newSelection, oldValue: oldSelection }
                    },
                })
            })

            const childFlow = flow.getChildFlow({ id: 'flow-1' })

            const result = childFlow.setSelection([2])

            expect( onSelectionChanged ) .to .eql({ newValue: [2], oldValue: [] })
        })

    })

    describe('commandsController', () => {
        const CustomCommandsController = require('./CustomCommandsController')

        it('propagates the commandsController set before adding a child flow', () => {
            const flow = Flow.new({ id: 'main' })

            const commandsController = CustomCommandsController.new({ mainFlow: flow })

            flow.setCommandsController( commandsController )

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            const childFlow = flow.getChildFlow({ id: 'flow-1' })

            expect( childFlow.getCommandsController() ).to .eql(commandsController)
        })

        it('propagates the commandsController set before after a child flow', () => {
            const flow = Flow.new({ id: 'main' })

            const commandsController = CustomCommandsController.new({ mainFlow: flow })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            flow.setCommandsController( commandsController )

            const childFlow = flow.getChildFlow({ id: 'flow-1' })

            expect( childFlow.getCommandsController() ).to .eql(commandsController)
        })

        it('receives a set roots event notification', () => {
            const flow = Flow.new({ id: 'main' })

            const commandsController = CustomCommandsController.new({ mainFlow: flow })

            flow.setCommandsController( commandsController )

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            const childFlow = flow.getChildFlow({ id: 'flow-1' })

            childFlow.setRoots({ items: [1, 2, 3] })

            expect( commandsController.getEvents() ).to .eql([
                {
                    flowId: 'main.flow-1',
                    event: 'setRoots',
                    params: [ [1, 2, 3] ],
                }
            ])
            expect( childFlow.getRoots() ).to .eql([1, 2, 3])
        })

        it('receives a set selection event notification', () => {
            const flow = Flow.new({ id: 'main' })

            const commandsController = CustomCommandsController.new({ mainFlow: flow })

            flow.setCommandsController( commandsController )

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    roots: [1, 2, 3],
                    getChildrenClosure: () => {},
                })
            })

            const childFlow = flow.getChildFlow({ id: 'flow-1' })

            const result = childFlow.setSelection([2])

            expect( commandsController.getEvents() ).to .eql([
                {
                    flowId: 'main.flow-1',
                    event: 'setSelection',
                    params: [ [2] ],
                }
            ])
            expect( childFlow.getSelection() ).to .eql([2])
        })

    })
})