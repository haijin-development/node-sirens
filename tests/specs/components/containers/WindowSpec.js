const expect = require('chai').expect
const Window = require('../../../../src/components/containers/Window')
const Label = require('../../../../src/components/widgets/Label')

describe('When using a Window', () => {
    it('instantiates an empty one', () => {
        const window = new Window()

        expect(window.components) .to .eql([])
    })

    it('adds a sub-component', () => {
        const window = new Window()

        window.addComponent(new Label())

        expect(window.components.length) .to .eql(1)
        expect(window.components[0].constructor.name) .to .eql('Label')
        expect(window.components[0].getView().constructor.name) .to .eql('LabelView')
    })
})
