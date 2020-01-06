const expect = require('chai').expect
const FingerTipsNamespace = require('../../../../src/finger-tips/FingerTipsNamespace')

const namespace = FingerTipsNamespace.new()

describe('When using a TreeChoiceFlowPoint', () => {

    describe('ids', () => {

        it('gets a flow point id', () => {
           const flow = namespace.Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            const flowPoint = flow.findFlowPoint({ id: 'flow-1'})

            expect( flowPoint.getId() ) .to .eql('flow-1')
        })

        it('gets a flow point id path', () => {
           const flow = namespace.Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            const flowPoint = flow.findFlowPoint({ id: 'flow-1'})

            expect( flowPoint.getIdPath() ) .to .eql('main.flow-1')
        })

    })

    describe('searches', () => {

        it('gets a child flow point', () => {
            const flow = namespace.Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            const childFlowPoint = flow.findFlowPoint({ id: 'flow-1' })

            expect( childFlowPoint.getId() ) .to .eql('flow-1')
        })

        it('returns null if the child does not exist', () => {
            const flow = namespace.Flow.new({ id: 'main' })


            const childFlowPoint = flow.findFlowPoint({ id: 'flow-1' })

            expect( childFlowPoint ) .to .be .null
        })
    })

    describe('protocol', () => {

        it('complies with the TreeChoiceModel protocol', () => {
            const flow = namespace.Flow.new({ id: 'main' })

            flow.build( function({ rootFlow: flow }) {
                this.treeChoice({
                    id: 'flow-1',
                    getChildrenClosure: () => {},
                })
            })

            const childFlowPoint = flow.findFlowPoint({ id: 'flow-1' })

            expect( childFlowPoint ) .to .behaveAs( 'TreeChoiceModel' )
        })

    })


})