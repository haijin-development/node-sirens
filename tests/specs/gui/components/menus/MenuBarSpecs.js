const expect = require('chai').expect
const MenuGroupView = require('../../../../../src/gui/gtk-views/MenuGroupView')
const MenuItemView = require('../../../../../src/gui/gtk-views/MenuItemView')
const Component = require('../../../../../src/gui/components/Component')

describe('When using a MenuBar', () => {
    it('instantiates an empty one', () => {
        const menuBar = Component.render( function(renderer) {
            this.menuBar()
        })

        expect( menuBar.getChildComponents() ) .to .eql([])
    })

    it('adds 1 menu group', () => {
        const menuBar = Component.render( function(renderer) {
            this.menuBar( function() {
                this.menuGroup({ label: 'group 1' })
            })
        })

        expect( menuBar.getChildComponents().length) .to .eql(1)
        expect( menuBar.getChildComponents()[0].getView().isBehavingAs(MenuGroupView) ) .to .be .true
    })

    it('adds 1 menu group with 1 meni item', () => {
        const menuBar = Component.render( function(renderer) {
            this.menuBar( function() {
                this.menuGroup({ label: 'group 1' }, function() {
                    this.item({ label: 'item 1' })
                })
            })
        })

        expect( menuBar.getChildComponents().length) .to .eql(1)
        expect( menuBar.getChildComponents()[0].getView().isBehavingAs(MenuGroupView) ) .to .be .true

        expect( menuBar.getChildComponents()[0].getChildComponents()[0].getView().isBehavingAs(MenuItemView) ) .to .be .true
    })
})
