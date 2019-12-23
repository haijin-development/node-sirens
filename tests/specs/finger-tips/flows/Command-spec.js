const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const Flow = require('../../../../src/finger-tips/flows/Flow')

describe('When using a StatefulCommand', () => {

    describe('ids', () => {

        it('gets a command id', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({ id: 'command-1' })
            })

            const command = flow.getChildFlow({ id: 'command-1' })

            expect( command.getId() ) .to .eql('command-1')
        })

        it('gets a command id path', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({ id: 'command-1' })
            })

            const command = flow.getChildFlow({ id: 'command-1' })

            expect( command.getIdPath() ) .to .eql('main.command-1')
        })
    })

    describe('searching', () => {

        it('finds a command', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({ id: 'command-1' })
            })

            const command = flow.getChildFlow({ id: 'command-1' })

            expect( command.getIdPath() ) .to .eql('main.command-1')
        })  

        it('raises an error if the command does not exist', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'value-1' })
            })

            expect( () => {

                flow.getChildFlow({ id: 'command-1' })

            }).to .throw("Child flow with {id: 'command-1'} not found.")
        })
    })

    describe('enabled state', () => {

        it('calculates its enabled state without updating it', () => {
            const flow = Flow.new({ id: 'main' })

            let n

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                    enabledIf: () => { return n == 1 }
                })
            })

            const command = flow.getChildFlow({ id: 'command-1' })

            expect( command.calculateEnabledState() ) .to .be .false
            expect( command.isEnabled() ) .to .be .true

            n = 1

            expect( command.calculateEnabledState() ) .to .be .true
            expect( command.isEnabled() ) .to .be .true
        })

        it('updates its enabled state', () => {
            const flow = Flow.new({ id: 'main' })

            let n

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                    enabledIf: () => { return n == 1 }
                })
            })

            const command = flow.getChildFlow({ id: 'command-1' })

            {
                const result = command.updateEnabledState()

                expect( command.isEnabled() ) .to .be .false
                expect( result ) .to .be .false
            }

            n = 1

            {
                const result = command.updateEnabledState()

                expect( command.isEnabled() ) .to .be .true
                expect( result ) .to .be .true
            }
        })

    })

    describe('action handler', () => {
        it('executes the command', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                    whenActioned: (a, b) => { return a + b },
                })
            })

            const command = flow.getChildFlow({ id: 'command-1' })

            const result = command.execute({ params: [1,2] })

            expect( result ) .to .eql(3)
        })

        it('executes the command when enabled', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                    enabledIf: () => { return true },
                    whenActioned: (a, b) => { return a + b },
                })
            })

            const command = flow.getChildFlow({ id: 'command-1' })

            const result = command.execute({ params: [1,2] })

            expect( result ) .to .eql(3)
        })

        it('does not execute the command when disabled', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                    enabledIf: () => { return false },
                    whenActioned: (a, b) => { return a + b },
                })
            })

            const command = flow.getChildFlow({ id: 'command-1' })

            const result = command.execute({ params: [1,2] })

            expect( result ) .to .be .undefined
        })

        it('raises an error if the action handler is not defined', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                })
            })

            const command = flow.getChildFlow({ id: 'command-1' })

            expect( () => {
                command.execute({ params: [1,2] })
            }).to .throw("The actionHandler for the command 'main.command-1' is not defined, the application should define it.")
        })

    })

    describe('commandsController', () => {
        const CustomCommandsController = require('./CustomCommandsController')

        it('propagates the commandsController set before adding a command', () => {
            const flow = Flow.new({ id: 'main' })

            const commandsController = CustomCommandsController.new({ mainFlow: flow })

            flow.setCommandsController( commandsController )

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                })
            })

            const command = flow.getChildFlow({ id: 'command-1' })

            expect( command.getCommandsController() ).to .eql(commandsController)
        })

        it('propagates the commandsController set before after a child flow', () => {
            const flow = Flow.new({ id: 'main' })

            const commandsController = CustomCommandsController.new({ mainFlow: flow })

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                })
            })

            flow.setCommandsController( commandsController )

            const command = flow.getChildFlow({ id: 'command-1' })

            expect( command.getCommandsController() ).to .eql(commandsController)
        })

        it('receives a command execution notification', () => {
            const flow = Flow.new({ id: 'main' })

            const commandsController = CustomCommandsController.new({ mainFlow: flow })

            flow.setCommandsController( commandsController )

            flow.build( function({ rootFlow: flow }) {
                this.command({
                    id: 'command-1',
                    whenActioned: (a, b) => { return a + b },
                })
            })

            const command = flow.getChildFlow({ id: 'command-1' })

            command.execute({ params: [1,2] })

            const commands = commandsController.getCommands()

            expect( commands.length ).to .eql( 1 )
            expect( commands[0].command.getIdPath() ).to .eql( 'main.command-1' )
            expect( commands[0].params ).to .eql( [1,2] )
            expect( commands[0].result ).to .eql( 3 )
        })

    })

})