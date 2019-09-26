const expect = require('chai').expect
const Component = require('../../../../../src/gui/components/Component')
const LabelView = require('../../../../../src/gui/gtk-views/LabelView')

describe('When using a Stack', () => {
    describe('horizontal', () => {
        it('instantiates an empty one', () => {
            const stack = Component.render( function(renderer) {
                this.horizontalStack()
            })

            expect(stack.getChildComponents()) .to .eql([])
        })

        it('adds sub-components', () => {
            const stack = Component.render( function(renderer) {
                this.horizontalStack( function() {
                    this.label()

                    this.label()
                })
            })

            expect( stack.getChildComponents().length ) .to .eql(2)
            expect( stack.getChildComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( stack.getChildComponents()[1].getView().isBehavingAs(LabelView) ) .to .be .true
        })
    })

    describe('vertical', () => {
        it('instantiates an empty one', () => {
            const stack = Component.render( function(renderer) {
                this.verticalStack( function() {
                })
            })

            expect(stack.getChildComponents()) .to .eql([])
        })

        it('adds sub-components', () => {
            const stack = Component.render( function(renderer) {
                this.verticalStack( function() {
                    this.label()

                    this.label()
                })
            })

            expect( stack.getChildComponents().length ) .to .eql(2)
            expect( stack.getChildComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( stack.getChildComponents()[1].getView().isBehavingAs(LabelView) ) .to .be .true
        })
    })
})
