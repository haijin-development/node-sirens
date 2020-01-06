const Classification = require('../../O').Classification
const WidgetBuilder = require('./WidgetBuilder')

/*
 Class(`
    This object is used to build a MenuGroup using the builder DSL.

    A MenuGroup can have one or more menu items.

    This MenuGroupBuilder defines the DSL methods to create and add these menuGroups.

    The usage of a MenuGroupBuilder typically consists in instantiating it, calling its

    	const menuGroup = menuGroupBuilder.createFromClosure( function() {
    			...
    		})

    to build and get the MenuGroup.
 `)

 Example({
    Description: `
       Builds a MenuGroup with 2 items.
    `,
    Code: `
       const MenuGroupBuilder = require('sirens/src/skins/componentBuilder/MenuGroupBuilder')
       const MenuBar = require('sirens/src/skins/components/menus/MenuBar')

       const builder = MenuGroupBuilder.new()

       const menuGroup = builder.createFromClosure( function() {
       	this.item({
       		label: 'Open file...',
       		enabled: true,
       		action: () => { this.getProps().openFile() },
       	})

       	this.item({
       		label: 'New file',
       		enabled: true,
       		action: () => { this.getProps().createFile() },
       	})
       })

       menuGroup
    `,
 })
*/
class MenuGroupBuilder {
    /// Definition

    /*
     Method(`
        This classification definition.
     `)

     Tags([
        'definition', 'implementation'
     ])
    */
    static definition() {
        this.instanceVariables = ['menuItems']
        this.assumes = [WidgetBuilder]
    }

    /// Initializing

    /*
     Method(`
        Initializes this MenuGroupBuilder and sets its initial properties with the given props.
     `)

     Tags([
        'initializing', 'public'
     ])
    */
    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        this.menuItems = []
    }

    /// Accessing

    /*
     Method(`
        Returns the menu items built during the evaluation of the createFromClosure() method.
     `)
     Returns({
        Description: `
           Array.
           An array with the menu items built during the evaluation of the .build() method.
        `,
     })

     Example({
        Description: `
           Builds 2 menu items and gets them.
        `,
        Code: `
           const MenuGroupBuilder = require('sirens/src/skins/componentBuilder/MenuGroupBuilder')
           const MenuBar = require('sirens/src/skins/components/menus/MenuBar')

           const builder = MenuGroupBuilder.new()

           builder.createFromClosure( function() {
           	this.item({
           		label: 'Open file...',
           		enabled: true,
           		action: () => { this.getProps().openFile() },
           	})

           	this.item({
           		label: 'New file',
           		enabled: true,
           		action: () => { this.getProps().createFile() },
           	})
           })

           builder.getMenuItems()
        `,
     })

     Tags([
        'getters', 'querying', 'public'
     ])
    */
    getMenuItems() {
        return this.menuItems
    }

    /// Buidling

    /*
     Method(`
        Evaluates the given closure to build menu items, creates a new MenuGroup with those menu items and returns the MenuGroup.
     `)

     Param({
        Name: `
           closure
        `,
        Description: `
           Function.
           A closure to evaluate and build the menu items.
        `,
     })

     Returns({
        Description: `
           MenuGroup.
           A new MenuGroup with the items created during the evaluation of given closure.
        `,
     })

     Tags([
        'creating objects', 'public'
     ])
    */
    createFromClosure(closure) {
        this.build(closure)

        const label = this.getProps().label

        const menuGroup = this.namespace().MenuGroup.new({
            label: label
        })

        menuGroup.assemble()

        menuGroup.addAllChildrenComponents( this.menuItems )

        return menuGroup
    }

    /*
     Method(`
        Creates a new MenuItem and adds it to the array of menu items.
     `)

     Param({
        Name: `
           label
        `,
        Description: `
           String.
           The label for the menu item.
        `,
     })

     Param({
        Name: `
           enabled
        `,
        Description: `
           Boolean.
           If false the menu label will be shown grayed and the user won't be able to click on it.
        `,
     })

     Param({
        Name: `
           action
        `,
        Description: `
           Function.
           A closure to evaluate when the menu item is selected by the user.

           The signature of the closure is the following

           	function() {
           		...
           	}
        `,
     })

     Example({
        Description: `
           Builds a MenuGroup with 2 items.
        `,
        Code: `
           const MenuGroupBuilder = require('sirens/src/skins/componentBuilder/MenuGroupBuilder')
           const MenuBar = require('sirens/src/skins/components/menus/MenuBar')

           const builder = MenuGroupBuilder.new()

           const menuGroup = builder.createFromClosure( function() {
           	this.item({
           		label: 'Open file...',
           		enabled: true,
           		action: () => { this.getProps().openFile() },
           	})

           	this.item({
           		label: 'New file',
           		enabled: true,
           		action: () => { console.info('selected New file') },
           	})
           })

           menuGroup
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    item({label: label, enabled: enabled, action: action}) {
        if( label === undefined ) { label = '' }
        if( enabled === undefined ) { enabled = true }

        const menuItem = this.namespace().MenuItem.new({
            label: label,
            enabled: enabled,
            action: action
        })

        menuItem.assemble()

        this.menuItems.push( menuItem )
    }

    /*
     Method(`
        Adds a visual separation between two menu items in this MenuGroup.
     `)

     Tags([
        'dsl', 'public'
     ])
    */
    separator() {
        const menuItemSeparator = this.namespace().MenuItemSeparator.new()

        menuItemSeparator.assemble()

        this.menuItems.push( menuItemSeparator )
    }
}

module.exports = Classification.define(MenuGroupBuilder)