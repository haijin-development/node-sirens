const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const Flow = require('../../../../src/finger-tips/flows/Flow')
const CustomCommandsController = require('./CustomCommandsController')

describe('When using a CommandsFlow', () => {

    describe('defines a StatelessCommand', () => {
        const flow = Flow.new({ id: 'main' })

        flow.build( function({ rootFlow: flow }) {
            this.command({
                id: 'command-1',
                whenAction: function() { return 'command actioned' },
            })
        })

        const command = flow.getChildFlow({ id: 'command-1' })

        expect( flow ) .to .have .childFlow({ id: 'command-1' })
            .suchThat( (command ) => {
                expect( command ) .to .behaveAs( 'StatelessCommand' )
            })
    })

    describe('defines a StateFulCommand', () => {
        const flow = Flow.new({ id: 'main' })

        flow.build( function({ rootFlow: flow }) {
            this.command({
                id: 'command-1',
                enabledIf: true,
                whenAction: function() { return 'command actioned' },
            })
        })

        const command = flow.getChildFlow({ id: 'command-1' })

        expect( flow ) .to .have .childFlow({ id: 'command-1' })
            .suchThat( (command ) => {
                expect( command ) .to .behaveAs( 'StatefulCommand' )
            })
    })

    describe('when defining a Command from a method definition', () => {
        let CustomFlow

        beforeEach( () => {
            class _CustomFlow{
                static definition() {
                    this.assumes = [Flow]
                }

                buildWith(flow) {
                    flow.main({ id: 'main' }, function(thisFlow) {

                        const commandsController = CustomCommandsController.new({
                            mainFlow: thisFlow
                        })

                        this.setCommandsController( commandsController )

                        this.defineMethodsAsCommands({
                            methods: [
                                'customMethod'
                            ],
                        })
                    })
                }

                customMethod() {
                    return 'custom method was called'
                }
            }
            CustomFlow = Classification.define(_CustomFlow)
        })

        it('it creates a Command with the method name as its id', () => {
            const customFlow = CustomFlow.new()

            expect( customFlow ) .to .have .childFlow({ id: 'customMethod' })
                .suchThat( (command) => {
                    expect(command) .to .behaveAs( 'StatelessCommand' )
                })
        })

        it('the method is callable like any other method', () => {
            const customFlow = CustomFlow.new()

            const commandResult = customFlow.customMethod()

            expect( commandResult ) .to .eql( 'custom method was called' )

        })

        it('the method is called like a Command', () => {
            const customFlow = CustomFlow.new()

            customFlow.customMethod()
            customFlow.customMethod()

            const commandsController = customFlow.getCommandsController()

            const commandsCalled = commandsController.getCommands()

            expect( commandsCalled ) .count .to .eql( 2 )

            expect( commandsCalled ) .atIndex( 0 ) .to .be .suchThat( (commandCalled) => {
                expect( commandCalled.command.getId() ) .to .eql( 'customMethod' )
                expect( commandCalled.params ) .to .eql( [] )
                expect( commandCalled.result ) .to .eql( 'custom method was called' )
            })
        })
    })
})