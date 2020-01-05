const expect = require('chai').expect
const FingerTipsNamespace = require('../../../../src/finger-tips/FingerTipsNamespace')

const namespace = FingerTipsNamespace.new()

describe('When using a StatefulCommand', () => {

    describe('ids', () => {

        it('gets a command point id', () => {
            const flow = namespace.Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({ id: 'command-1' })
            })

            const commandPoint = flow.getCommand({ id: 'command-1' })

            expect( commandPoint.getId() ) .to .eql('command-1')
        })

        it('gets a command point id path', () => {
            const flow = namespace.Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({ id: 'command-1' })
            })

            const commandPoint = flow.getCommand({ id: 'command-1' })

            expect( commandPoint.getIdPath() ) .to .eql('main.command-1')
        })

    })

    describe('searches', () => {

        it('raises an error if the child flow exists but it is not a command', () => {
            const flow = namespace.Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'value-1' })
            })

            expect( () => {

                flow.getCommand({ id: 'value-1' })

            }).to .throw("The flow child with id {id: 'value-1'} exists but it is not a Command.")
        })

    })

    describe('enabled state', () => {

        it('gets a command enabled state', () => {
            const flow = namespace.Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                    enabledIf: () => { return true },
                })
            })

            const commandPoint = flow.getCommand({ id: 'command-1' })

            expect( commandPoint.isEnabled() ) .to .be .true
        })

    })

    describe('events', () => {

        it('receives enables status changes from its flow and announces it to its listeners', () => {
            const flow = namespace.Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                    enabledIf: () => { return true },
                })
            })

            const commandPoint = flow.getCommand({ id: 'command-1' })

            let enabledChange = false

            commandPoint.onValueChanged({
                with: this,
                do: ({ newValue: newValue, oldValue: oldValue }) => {
                    enabledChange = { newValue: newValue, oldValue: oldValue }
                },
            })

            flow.getChildFlow({ id: 'command-1' }).enabledIf( false )

            expect( enabledChange ) .to .eql({ newValue: false, oldValue: true })
        })

    })

    describe('commands', () => {

        it('executes a command', () => {
            const flow = namespace.Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                    whenActioned: (a, b) => { return a + b },
                })
            })

            const commandPoint = flow.getCommand({ id: 'command-1' })

            let result = commandPoint.execute({ withAll: [1, 2] })

            expect( result ) .to .eql( 3 )
        })

        it('executes a command with a true ifEnabled', () => {
            const flow = namespace.Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                    ifEnabled: true,
                    whenActioned: (a, b) => { return a + b },
                })
            })

            const commandPoint = flow.getCommand({ id: 'command-1' })

            let result = commandPoint.execute({ withAll: [1, 2] })

            expect( result ) .to .eql( 3 )
        })

        it('does not execute a command with a false ifEnabled', () => {
            const flow = namespace.Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                    enabledIf: false,
                    whenActioned: (a, b) => { return a + b },
                })
            })

            const commandPoint = flow.getCommand({ id: 'command-1' })

            let result = commandPoint.execute({ withAll: [1, 2] })

            expect( result ) .to .be .undefined
        })

        it('executes an action handler', () => {
            const flow = namespace.Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow' }, function() {

                    this.command({
                        id: 'command_1',
                        whenActioned: (a, b) => { return a + b },
                    })

                })
            })

            const result = flow.findFlowPoint({ id: 'flow' }).command_1(1,2)

            expect( result ) .to .eql( 3 )
        })

    })

})