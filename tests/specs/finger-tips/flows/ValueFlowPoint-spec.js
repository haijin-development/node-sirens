const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const Flow = require('../../../../src/finger-tips/flows/Flow')
const CommandsController = require('../../../../src/finger-tips/commands/CommandsController')

describe('When using a ValueFlowPoint', () => {

    describe('ids', () => {

        it('gets a flow point id', () => {
           const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const flowPoint = flow.findFlowPoint({ id: 'flow-1'})

            expect( flowPoint.getId() ) .to .eql('flow-1')
        })

        it('gets a flow point id path', () => {
           const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const flowPoint = flow.findFlowPoint({ id: 'flow-1'})

            expect( flowPoint.getIdPath() ) .to .eql('main.flow-1')
        })

    })

    describe('searches', () => {

        it('gets a child flow point', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const childFlowPoint = flow.findFlowPoint({ id: 'flow-1' })

            expect( childFlowPoint.getId() ) .to .eql('flow-1')
        })

        it('returns null if the child does not exist', () => {
            const flow = Flow.new({ id: 'main' })

            const childFlow = flow.findFlowPoint({ id: 'flow-1' })

            expect( childFlow ) .to .be .null
        })
    })

    describe('values', () => {

        it('gets a child flow point value', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const childFlowPoint = flow.findFlowPoint({ id: 'flow-1' })

            expect( childFlowPoint.getValue() ) .to .be .null
        })

        it('sets a child flow point value', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const childFlowPoint = flow.findFlowPoint({ id: 'flow-1' })

            childFlowPoint.setValue( 1 )

            expect( flow.getChildFlow({ id: 'flow-1' }).getValue() ) .to .eql( 1 )
            expect( childFlowPoint.getValue() ) .to .eql( 1 )
        })

    })

    describe('events', () => {

        it('announces value changes to its listeners', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const childFlowPoint = flow.findFlowPoint({ id: 'flow-1' })

            let valueChange = false

            childFlowPoint.onValueChanged({
                with: this,
                do: ({ newValue: newValue, oldValue: oldValue }) => {
                    valueChange = { newValue: newValue, oldValue: oldValue }
                },
            })

            childFlowPoint.setValue( 1 )

            expect( valueChange ) .to .eql({ newValue: 1, oldValue: null })
        })

        it('receives changes from its flow and announces it to its listeners', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.value({ id: 'flow-1' })
            })

            const childFlowPoint = flow.findFlowPoint({ id: 'flow-1' })

            let valueChange = false

            childFlowPoint.onValueChanged({
                with: this,
                do: ({ newValue: newValue, oldValue: oldValue }) => {
                    valueChange = { newValue: newValue, oldValue: oldValue }
                },
            })

            flow.getChildFlow({ id: 'flow-1' }).setValue( 1 )

            expect( valueChange ) .to .eql({ newValue: 1, oldValue: null })
        })

    })

})