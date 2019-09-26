const expect = require('chai').expect
const Component = require('../../../../../src/gui/components/Component')
const LabelView = require('../../../../../src/gui/gtk-views/LabelView')

describe('When using a Window', () => {
    it('instantiates an empty one', () => {
        const window = Component.render( function(renderer) {
            this.window()
        })

        expect( window.getChildComponents() ) .to .eql([])
    })

    it('adds a sub-component', () => {
        const window = Component.render( function(renderer) {
            this.window( function() {
                this.label()
            })
        })

        expect( window.getChildComponents().length ) .to .eql(1)
        expect( window.getChildComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
    })
})
