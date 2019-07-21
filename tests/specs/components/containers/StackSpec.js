const expect = require('chai').expect
const Stack = require('../../../../src/components/containers/Stack')
const Label = require('../../../../src/components/widgets/Label')

describe('When using a Stack', () => {
    describe('horizontal', () => {
        it('instantiates an empty one', () => {
            const stack = new Stack()

            expect(stack.components) .to .eql([])
        })

        it('adds sub-components', () => {
            const stack = new Stack({orientation: 'horizontal'})

            stack.addComponent(new Label())
            stack.addComponent(new Label())

            expect(stack.components.length) .to .eql(2)
            expect(stack.components[0].getView().constructor.name) .to .eql('LabelView')
            expect(stack.components[1].getView().constructor.name) .to .eql('LabelView')
        })
    })

    describe('vertical', () => {
        it('instantiates an empty one', () => {
            const stack = new Stack()

            expect(stack.components) .to .eql([])
        })

        it('adds sub-components', () => {
            const stack = new Stack({orientation: 'vertical'})

            stack.addComponent(new Label())
            stack.addComponent(new Label())

            expect(stack.components.length) .to .eql(2)
            expect(stack.components[0].getView().constructor.name) .to .eql('LabelView')
            expect(stack.components[1].getView().constructor.name) .to .eql('LabelView')
        })
    })
})
