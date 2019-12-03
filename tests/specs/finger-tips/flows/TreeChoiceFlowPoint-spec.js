const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const Flow = require('../../../../src/finger-tips/flows/Flow')
const TreeChoiceModel = require('../../../../src/finger-tips/models/TreeChoiceModel')
const CommandsController = require('../../../../src/finger-tips/commands/CommandsController')

describe('When using a TreeChoiceFlowPoint', () => {

    describe('ids', () => {

        it('gets a flow point id', () => {
           const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            const flowPoint = flow.getFlowPoint({ id: 'flow-1'})

            expect( flowPoint.getId() ) .to .eql('flow-1')
        })

        it('gets a flow point id path', () => {
           const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            const flowPoint = flow.getFlowPoint({ id: 'flow-1'})

            expect( flowPoint.getIdPath() ) .to .eql('main.flow-1')
        })

    })

    describe('searches', () => {

        it('gets a child flow point', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            const childFlowPoint = flow.getFlowPoint({ id: 'flow-1' })

            expect( childFlowPoint.getId() ) .to .eql('flow-1')
        })

        it('raises an error if the child does not exist', () => {
            const flow = Flow.new({ id: 'main' })

            expect( () => {

                flow.getFlowPoint({ id: 'flow-1' })

            }).to .throw("Child flow with {id: 'flow-1'} not found.")
        })

        it('raises an error when trying to get a child flow', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            expect( () => {

                flow.asFlowPoint().getChildFlow({ id: 'flow-1' })

            }) .to .throw('Method not found .asFlowPoint()')
        })
    })

    describe('protocol', () => {

        it('complies with the TreeChoiceModel protocol', () => {
            const flow = Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            const childFlowPoint = flow.getFlowPoint({ id: 'flow-1' })

            expect( childFlowPoint.isBehavingAs(TreeChoiceModel) ) .to .be .true
        })

    })


})