const expect = require('chai').expect
const ValueFlow = require('../../../../src/finger-tips/flows/ValueFlow')

describe('When using a ValueFlow', () => {

    describe('ids', () => {

        it('gets a flow id', () => {
            const flow = ValueFlow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const childFlowPoint = flow.getChildFlow({ id: 'flow-1' })

            expect( childFlowPoint.getId() ) .to .eql('flow-1')
        })

        it('gets a flow id path', () => {
            const flow = ValueFlow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const childFlowPoint = flow.getChildFlow({ id: 'flow-1' })

            expect( childFlowPoint.getIdPath() ) .to .eql('main.flow-1')
        })

    })

    describe('searches', () => {

        it('raises an error if the child does not exist', () => {
            const flow = ValueFlow.new({ id: 'main' })

            expect( () => {

                flow.getChildFlow({ id: 'flow-1' })

            }).to .throw("Child flow with {id: 'flow-1'} not found.")
        })

        it('gets a child flow', () => {
            const flow = ValueFlow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const childFlowPoint = flow.getChildFlow({ id: 'flow-1' })

            expect( childFlowPoint.getId() ) .to .eql('flow-1')
        })

    })

    describe('values', () => {

        it('gets a flow value', () => {
            const flow = ValueFlow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const childFlowPoint = flow.getChildFlow({ id: 'flow-1' })

            expect( childFlowPoint.getValue() ) .to .be .null
        })

        it('sets a flow value', () => {
            const flow = ValueFlow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const childFlowPoint = flow.getChildFlow({ id: 'flow-1' })

            childFlowPoint.setValue(1)

            expect( childFlowPoint.getValue() ) .to .eql(1)
        })

        it('returns the flow when setting its value', () => {
            const flow = ValueFlow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const childFlowPoint = flow.getChildFlow({ id: 'flow-1' })

            const result = childFlowPoint.setValue(1)

            expect( result ) .to .eql( childFlowPoint )
        })

    })

    describe('events', () => {

        it('defines an whenValueChanges handler', () => {
            const flow = ValueFlow.new({ id: 'main' })

            let onValueChanged = false

            flow.build( function({ rootFlow: flow }) {
                this.whenValueChanges( ({ newValue: newValue, oldValue: oldValue }) => {
                    onValueChanged = { newValue: newValue, oldValue: oldValue }
                })
            })

            const result = flow.setValue(1)

            expect( onValueChanged ) .to .eql( { newValue: 1, oldValue: null } )
        })

        it('evaluates the flow onValueChanged handler when setting its value', () => {
            const flow = ValueFlow.new({ id: 'main' })

            let onValueChanged = false

            flow.build( function({ rootFlow: flow }) {
                this.value({
                    id: 'flow-1',
                    whenValueChanges: ({ newValue: newValue, oldValue: oldValue }) => {
                        onValueChanged = { newValue: newValue, oldValue: oldValue }
                    }
                })
            })

            const childFlowPoint = flow.getChildFlow({ id: 'flow-1' })

            const result = childFlowPoint.setValue(1)

            expect( onValueChanged ) .to .eql( { newValue: 1, oldValue: null } )
        })

    })

    describe('commandsController', () => {
        const CustomCommandsController = require('./CustomCommandsController')

        it('propagates the commandsController set before adding a child flow', () => {
            const flow = ValueFlow.new({ id: 'main' })

            const commandsController = CustomCommandsController.new({ mainFlow: flow })

            flow.setCommandsController( commandsController )

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const childFlow = flow.getChildFlow({ id: 'flow-1' })

            expect( childFlow.getCommandsController() ).to .eql(commandsController)
        })

        it('propagates the commandsController set before after a child flow', () => {
            const flow = ValueFlow.new({ id: 'main' })

            const commandsController = CustomCommandsController.new({ mainFlow: flow })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            flow.setCommandsController( commandsController )

            const childFlow = flow.getChildFlow({ id: 'flow-1' })

            expect( childFlow.getCommandsController() ).to .eql(commandsController)
        })

        it('receives an root flow event notification', () => {
            const flow = ValueFlow.new({ id: 'main' })

            const commandsController = CustomCommandsController.new({ mainFlow: flow })

            flow.setCommandsController( commandsController )

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            flow.setValue(1)

            expect( commandsController.getEvents() ).to .eql([
                {
                    flowId: 'main',
                    event: 'setValue',
                    params: [1],
                }
            ])
            expect( flow.getValue() ).to .eql(1)
        })

        it('receives a child root event notification', () => {
            const flow = ValueFlow.new({ id: 'main' })

            const commandsController = CustomCommandsController.new({ mainFlow: flow })

            flow.setCommandsController( commandsController )

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const childFlowPoint = flow.getChildFlow({ id: 'flow-1' })

            childFlowPoint.setValue(1)

            expect( commandsController.getEvents() ).to .eql([
                {
                    flowId: 'main.flow-1',
                    event: 'setValue',
                    params: [1],
                }
            ])
            expect( childFlowPoint.getValue() ).to .eql(1)
        })

        it('receives a command execution notification', () => {
            const flow = ValueFlow.new({ id: 'main' })

            const commandsController = CustomCommandsController.new({ mainFlow: flow })

            flow.setCommandsController( commandsController )

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                    whenActioned: (a, b) => { return a + b },
                })
            })

            flow.executeCommand({ id: 'command-1', withAll: [1,2] })

            const commands = commandsController.getCommands()

            expect( commands.length ).to .eql( 1 )
            expect( commands[0].command.getIdPath() ).to .eql( 'main.command-1' )
            expect( commands[0].params ).to .eql( [1,2] )
            expect( commands[0].result ).to .eql( 3 )
        })
    })
})