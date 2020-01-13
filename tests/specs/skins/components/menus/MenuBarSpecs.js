const expect = require('chai').expect

const namespace = require('../../skinsNamespace')

describe('When using a MenuBar', () => {
    it('instantiates an empty one', () => {
        const menuBar = namespace.ComponentRenderer.new().render( function(renderer) {
            this.menuBar()
        })

        expect( menuBar.getChildComponents() ) .to .eql([])
    })

    it('adds 1 menu group', () => {
        const menuBar = namespace.ComponentRenderer.new().render( function(renderer) {
            this.menuBar( function() {
                this.menuGroup({ label: 'group 1' })
            })
        })

        expect( menuBar.getChildComponents() ) .count .to .eql(1)

        expect( menuBar.getChildComponents() ) .atIndex(0) .to .be .suchThat( (menuGroup) => {
            expect( menuGroup.getView() ) .to .behaveAs( 'MenuGroupView' )
        })
    })

    it('adds 1 menu group with 1 menu item', () => {
        const menuBar = namespace.ComponentRenderer.new().render( function(renderer) {
            this.menuBar( function() {
                this.menuGroup({ label: 'group 1' }, function() {
                    this.item({ label: 'item 1', action: () => {} })
                })
            })
        })

        expect( menuBar.getChildComponents() ) .count .to .eql(1)

        expect( menuBar.getChildComponents() ) .atIndex(0) .to .be .suchThat( (menuGroup) => {
            expect( menuGroup.getView() ) .to .behaveAs( 'MenuGroupView' )
        })

        expect( menuBar.getChildComponents() ) .atIndex(0) .to .be .suchThat( (component) => {
            expect( component.getChildComponents()[0].getView() ) .to .behaveAs( 'MenuItemView' )
        })
    })
})
