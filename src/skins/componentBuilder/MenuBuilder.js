const Classification = require('../../O').Classification
const WidgetBuilder = require('./WidgetBuilder')

/*
 Class(`
    This object is used to build a MenuBar using the builder DSL.

    A MenuBar can have one or more menuGroups.

    This MenuBuilder defines the DSL methods to create and add these menuGroups.

    The usage of a MenuBuilder typically consists in instantiating it, calling its

    	const menuBar = menuBuilder.createFromClosure( function() {
    			...
    		})

    to build and get a MenuBar object.
 `)

 Example({
    Description: `
       Builds a MenuBar using a MenuBuilder object.
    `,
    Code: `
       const MenuBuilder = require('sirens/src/skins/componentBuilder/MenuBuilder')
       const MenuBar = require('sirens/src/skins/components/menus/MenuBar')

       const builder = MenuBuilder.new()

       builder.build( function() {
       	this.menuGroup({ label: 'File' }, function() {
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

       	this.menuGroup({ label: 'Edit' }, function() {
       		this.item({
       			label: 'Cut',
       			action: () => { this.getProps().cut() },
       		})

       		this.item({
       			label: 'Copy',
       			action: () => { this.getProps().copy() },
       		})

       		this.item({
       			label: 'Paste',
       			action: () => { this.getProps().paste() },
       		})
       	})
       })

       const menu = MenuBar.new( builder.getProps() )

       menu.addAllChildrenComponents( builder.getMenuGroups() )
    `,
 })
*/
class MenuBuilder {
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
        this.instanceVariables = ['menuGroups']
        this.assumes = [WidgetBuilder]
    }

    /// Initializing

    /*
     Method(`
        Initializes this MenuBuilder and sets its initial properties with the given props.
     `)

     Tags([
        'initializing', 'public'
     ])
    */
    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        this.menuGroups = []
    }

    /// Accessing

    /*
     Method(`
        Returns the MenuGroups created during the call of the

        	builder.build( function() {
        		// ...
        	})



        method.

        Typically these MenuGroups are added to a MenuBar component.
     `)

     Example({
        Description: `
           Creates 2 menu groups and gets them.
        `,
        Code: `
           const MenuBuilder = require('sirens/src/skins/componentBuilder/MenuBuilder')

           const builder = MenuBuilder.new()

           builder.build( function() {
           	this.menuGroup({ label: 'File' }, function() {
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

           	this.menuGroup({ label: 'Edit' }, function() {
           		this.item({
           			label: 'Cut',
           			action: () => { this.getProps().cut() },
           		})

           		this.item({
           			label: 'Copy',
           			action: () => { this.getProps().copy() },
           		})

           		this.item({
           			label: 'Paste',
           			action: () => { this.getProps().paste() },
           		})
           	})
           })

           builder.getMenuGroups()
        `,
     })

     Tags([
        'getters', 'querying', 'public'
     ])
    */
    getMenuGroups() {
        return this.menuGroups
    }

    /// Buidling

    /*
     Method(`
        Evaluates the given closure to build MenuGroups, adds them to a new MenuBar and returns the created MenuBar.
     `)

     Param({
        Name: `
           closure
        `,
        Description: `
           Function.
           The closure to evaluate to build the MenuGroups.

           The MenuGroups built during the evaluation of the given closure are added to the new MenuBar that is returned.
        `,
     })

     Returns({
        Description: `
           MenuBar.
           A new MenuBar object with the properties and MenuGroups created during the evaluation of the given closure.
        `,
     })

     Example({
        Description: `
           Creates a new MenuBar with 2 MenuGroups.
        `,
        Code: `
           const MenuBuilder = require('sirens/src/skins/componentBuilder/MenuBuilder')

           const builder = MenuBuilder.new()

           const menu = builder.createFromClosure( function() {
           	this.menuGroup({ label: 'File' }, function() {
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

           	this.menuGroup({ label: 'Edit' }, function() {
           		this.item({
           			label: 'Cut',
           			action: () => { this.getProps().cut() },
           		})

           		this.item({
           			label: 'Copy',
           			action: () => { this.getProps().copy() },
           		})

           		this.item({
           			label: 'Paste',
           			action: () => { this.getProps().paste() },
           		})
           	})
           })

           menu
        `,
     })

     Tags([
        'creating objects', 'public'
     ])
    */
    createFromClosure(closure) {
        this.build(closure)

        const menuBar = this.namespace().MenuBar.new( this.getProps() )

        menuBar.assemble()

        menuBar.addAllChildrenComponents( this.menuGroups )

        return menuBar
    }


    /*
     Method(`
        Adds a MenuGroup component to the array of built MenuGroups.
     `)

     Param({
        Name: `
           props
        `,
        Description: `
           An object with the following properties:

           {
           	label: String
           }
        `,
     })

     Param({
        Name: `
           closure
        `,
        Description: `
           An optional closure to evaluate to set additional properties and menuItems calling any or all of the methods

           		this.styles()

           		this.model()

           		this.handlers()

           		this.menuItem()

           methods.
        `,
     })

     Example({
        Description: `
           Creates 2 MenuGroups.
        `,
        Code: `
           const MenuBuilder = require('sirens/src/skins/componentBuilder/MenuBuilder')

           const builder = MenuBuilder.new()

           const menu = builder.createFromClosure( function() {
           	this.menuGroup({ label: 'File' }, function() {
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

           	this.menuGroup({ label: 'Edit' }, function() {
           		this.item({
           			label: 'Cut',
           			action: () => { this.getProps().cut() },
           		})

           		this.item({
           			label: 'Copy',
           			action: () => { this.getProps().copy() },
           		})

           		this.item({
           			label: 'Paste',
           			action: () => { this.getProps().paste() },
           		})
           	})
           })

           menu
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    menuGroup(props, closure) {
        [props, closure] = this.normalizeArguments(props, closure)

        const menuGroup = this.namespace().MenuGroupBuilder.new( props ).createFromClosure(closure)

        this.menuGroups.push( menuGroup )
    }
}

module.exports = Classification.define(MenuBuilder)