const expect = require('chai').expect
const Stack = require('../../../../../src/gui/components/containers/Stack')
const Label = require('../../../../../src/gui/components/widgets/Label')
const LabelView = require('../../../../../src/gui/views/LabelView')

describe('When using a Stack', () => {
    describe('horizontal', () => {
        it('instantiates an empty one', () => {
            const stack = Stack.new()

            expect(stack.getComponents()) .to .eql([])
        })

        it('adds sub-components', () => {
            const stack = Stack.new({ orientation: 'horizontal' })

            stack.addComponent(Label.new())
            stack.addComponent(Label.new())

            expect( stack.getComponents().length ) .to .eql(2)
            expect( stack.getComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( stack.getComponents()[1].getView().isBehavingAs(LabelView) ) .to .be .true
        })
    })

    describe('vertical', () => {
        it('instantiates an empty one', () => {
            const stack = Stack.new()

            expect(stack.getComponents()) .to .eql([])
        })

        it('adds sub-components', () => {
            const stack = Stack.new({orientation: 'vertical'})

            stack.addComponent(Label.new())
            stack.addComponent(Label.new())

            expect( stack.getComponents().length ) .to .eql(2)
            expect( stack.getComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( stack.getComponents()[1].getView().isBehavingAs(LabelView) ) .to .be .true
        })
    })
})
