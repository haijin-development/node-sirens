const expect = require('chai').expect
const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../../src/gui/components/Component')
const LabelView = require('../../../../src/gui/gtk-views/LabelView')

describe('When skipping a component', () => {
    it('does not add the sub-component', () => {
        const window = Component.render( function(renderer) {
            this.window( function() {
                this.skip().label().anyOtherMethod()
                this.skip().anyOtherMethod()
            })
        })

        expect( window.getChildComponents() ) .to .eql( [] )
    })
})
