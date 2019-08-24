const expect = require('chai').expect
const Window = require('../../../../../src/gui/components/containers/Window')
const Label = require('../../../../../src/gui/components/widgets/Label')

describe('When using a Window', () => {
    it('instantiates an empty one', () => {
        const window = Window.new()

        expect( window.getComponents() ) .to .eql([])
    })

    it('adds a sub-component', () => {
        const window = Window.new()

        window.addComponent( Label.new() )

        expect( window.getComponents().length ) .to .eql(1)
        expect( window.getComponents()[0].constructor.name ) .to .eql('Label')
        expect( window.getComponents()[0].getView().constructor.name ) .to .eql('LabelView')
    })
})
