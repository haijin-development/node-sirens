const expect = require('chai').expect
const MenuBar = require('../../../../../src/gui/components/menus/MenuBar')
const MenuGroup = require('../../../../../src/gui/components/menus/MenuGroup')
const MenuItem = require('../../../../../src/gui/components/menus/MenuItem')
const MenuGroupView = require('../../../../../src/gui/views/MenuGroupView')
const MenuItemView = require('../../../../../src/gui/views/MenuItemView')

describe('When using a MenuBar', () => {
    it('instantiates an empty one', () => {
        const menuBar = MenuBar.new()

        expect( menuBar.getComponents() ) .to .eql([])
    })

    it('adds 1 menu group', () => {
        const menuGroup = MenuGroup.new({
            label: 'group 1'
        })

        const menuBar = MenuBar.new()

        menuBar.addComponent(menuGroup)

        expect( menuBar.getComponents().length) .to .eql(1)
        expect( menuBar.getComponents()[0].getView().isBehavingAs(MenuGroupView) ) .to .be .true
    })

    it('adds 1 menu group with 1 meni item', () => {
        const menuGroup = MenuGroup.new({
            label: 'group 1'
        })

        const menuItem = MenuItem.new({
            label: 'item 1'
        })

        const menuBar = MenuBar.new()

        menuBar.addComponent(menuGroup)

        menuGroup.addComponent(menuItem)

        expect( menuBar.getComponents().length) .to .eql(1)
        expect( menuBar.getComponents()[0].getView().isBehavingAs(MenuGroupView) ) .to .be .true

        expect( menuBar.getComponents()[0].getComponents()[0].getView().isBehavingAs(MenuItemView) ) .to .be .true
    })
})
