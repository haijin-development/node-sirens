const Classification = require('../../O').Classification
const WidgetBuilder = require('./WidgetBuilder')

/*
 Class(`
    This object is used to build a ToolBar using the builder DSL.

    A ToolBar can have one or more menuItems and separators.

    This ToolBarBuilder defines the DSL methods to create and add these menuItems and separators.

    The usage of a ToolBarBuilder typically consists in instantiating it, calling its

    	toolBarBuilder.build()

    getting the defined props and children and setting them to a ToolBar object.
 `)

 Example({
    Description: `
       Builds a ToolBar with a ToolBarButton and a ToolBarToggleButton.
    `,
    Code: `

       const ToolBarBuilder = require('sirens/src/skins/componentBuilder/ToolBarBuilder')
       const GtkIcons = require('sirens/src/skins/gtk-views/constants/GtkIcons')

       const builder = ToolBarBuilder.new()

       const toolBar = builder.createFromClosure( function(component) {
       	this.button({
       		label: 'Open folder...',
       		image: {
       			iconName: GtkIcons.open,
       			size: GtkIcons.size._24x24,
       		},
       		tooltip: 'Opens an app folder.',
       		action: () => { component.getProps().openFolder() },
       	})

       	this.separator()

       	this.toggleButton({
       		label: 'Edit mode',
       		image: {
       			iconName: GtkIcons.edit,
       			size: GtkIcons.size._24x24,
       		},
       		tooltip: 'Toggles the edition mode.',
       	})

       })

       toolBar

    `,
 })
*/
class ToolBarBuilder {
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
        this.instanceVariables = ['toolBarItems']
        this.assumes = [WidgetBuilder]
    }

    /// Initializing

    /*
     Method(`
        Initializes this ToolBarBuilder and sets its initial properties with the given props.
     `)

     Tags([
        'initializing', 'public'
     ])
    */
    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        this.toolBarItems = []
    }

    /// Buidling

    /*
     Method(`
        Evaluates the given closure to build ToolBarItems, adds them to a new ToolBar and returns the created ToolBar.
     `)

     Param({
        Name: `
           closure
        `,
        Description: `
           Function.
           The closure to evaluate to build the ToolBar items.
        `,
     })

     Example({
        Description: `
           Builds a ToolBar with a ToolBarButton and a ToolBarToggleButton.
        `,
        Code: `
           const ToolBarBuilder = require('sirens/src/skins/componentBuilder/ToolBarBuilder')
           const GtkIcons = require('sirens/src/skins/gtk-views/constants/GtkIcons')

           const builder = ToolBarBuilder.new()

           const toolBar = builder.createFromClosure( function(component) {
           	this.button({
           		label: 'Open folder...',
           		image: {
           			iconName: GtkIcons.open,
           			size: GtkIcons.size._24x24,
           		},
           		tooltip: 'Opens an app folder.',
           		action: () => { component.getProps().openFolder() },
           	})

           	this.separator()

           	this.toggleButton({
           		label: 'Edit mode',
           		image: {
           			iconName: GtkIcons.edit,
           			size: GtkIcons.size._24x24,
           		},
           		tooltip: 'Toggles the edition mode.',
           	})

           })

           toolBar
        `,
     })

     Tags([
        'creating objects', 'public'
     ])
    */
    createFromClosure(closure) {
        this.build(closure)

        const toolBar = this.namespace().ToolBar.new( this.getProps() )

        toolBar.assemble()

        toolBar.addAllChildrenComponents( this.toolBarItems )

        return toolBar
    }

    /*
     Method(`
        Creates and add a new ToolBarButton.

        A ToolBarButton is a clickable button with an image.
     `)

     Param({
        Name: `
           label
        `,
        Description: `
           Optional.
           String.
           A label for the button.
           It is not shown if the ToolBarButton has an image to display.
        `,
     })

     Param({
        Name: `
           image
        `,
        Description: `
           On object with the properties of the image to display.

           It can be either a stock image and its size

                               image: {
                                   iconName: GtkIcons.open,
                                   size: GtkIcons.size._24x24,
                               },


           or a custom file image and its size

                               image: {
                                   filename: path String to an image file,
                                   width: 24,
                                   height: 24,
                               },
        `,
     })

     Param({
        Name: `
           tooltip
        `,
        Description: `
           Optional.
           String.
           An optional text to display as the ToolBarButton tooltip when the mouse hovers for a while over the button without clicking it.
        `,
     })

     Param({
        Name: `
           enabled
        `,
        Description: `
           Optional. Defaults to true.
           Boolean.
           If false the ToolBarButton is shown but is disabled and can not be clicked.
        `,
     })

     Param({
        Name: `
           action
        `,
        Description: `
           Function.
           Function to evaluate when the button is clicked.

           The expected function signature is the following

           	function() {
           		...
           	}
        `,
     })

     Example({
        Description: `
           Builds a ToolBar with a ToolBarButton.
        `,
        Code: `
           const ToolBarBuilder = require('sirens/src/skins/componentBuilder/ToolBarBuilder')
           const GtkIcons = require('sirens/src/skins/gtk-views/constants/GtkIcons')

           const builder = ToolBarBuilder.new()

           const toolBar = builder.createFromClosure( function(component) {
           	this.button({
           		label: 'Open folder...',
           		image: {
           			iconName: GtkIcons.open,
           			size: GtkIcons.size._24x24,
           		},
           		tooltip: 'Opens an app folder.',
           		action: () => { component.getProps().openFolder() },
           	})

           })

           toolBar
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    button({ label: label, image: imageProps, tooltip: tooltip, enabled: enabled, action: action }) {
        if( label === undefined ) { label = '' }
        if( tooltip === undefined ) { tooltip = '' }
        if( enabled === undefined ) { enabled = true }
        if( imageProps === undefined ) { throw new Error(`button({imageProps: }) must be defined.`) }
        if( action === undefined ) { throw new Error(`button({handleAction: }) must be defined.`) }

        const menuItem = this.namespace().ToolButton.new({
            label: label,
            imageProps: imageProps,
            tooltip: tooltip,
            enabled: enabled,
            action: action,
        })

        menuItem.assemble()

        this.toolBarItems.push(menuItem)
    }

    /*
     Method(`
        Creates and add a new ToolBarToggleButton.

        A ToolBarToggleButton is a two state (unpressed or pressed), clickable button with an image.
     `)

     Param({
        Name: `
           model
        `,
        Description: `
           ValueModelBehaviour.
           An object behaving as a ValueModelBehaviour with Boolean values.

           When the value is set to true in the model the button displays its pressed state, when it is set to false it displays its unpressed state.
        `,
     })

     Param({
        Name: `
           label
        `,
        Description: `
           Optional.
           String.
           A label for the button.
           It is not shown if the ToolBarButton has an image to display.
        `,
     })

     Param({
        Name: `
           image
        `,
        Description: `
           On object with the properties of the image to display.

           It can be either a stock image and its size

                               image: {
                                   iconName: GtkIcons.open,
                                   size: GtkIcons.size._24x24,
                               },


           or a custom file image and its size

                               image: {
                                   filename: path String to an image file,
                                   width: 24,
                                   height: 24,
                               },
        `,
     })

     Param({
        Name: `
           tooltip
        `,
        Description: `
           Optional.
           String.
           An optional text to display as the ToolBarButton tooltip when the mouse hovers for a while over the button without clicking it.
        `,
     })

     Param({
        Name: `
           enabled
        `,
        Description: `
           Optional. Defaults to true.
           Boolean.
           If false the ToolBarButton is shown but is disabled and can not be clicked.
        `,
     })

     Example({
        Description: `
           Builds a ToolBar with a ToolBarToggleButton.
        `,
        Code: `
           const ToolBarBuilder = require('sirens/src/skins/componentBuilder/ToolBarBuilder')
           const ValueModel = require('sirens/src/finger-tips/models/ValueModel')
           const GtkIcons = require('sirens/src/skins/gtk-views/constants/GtkIcons')

           const booleanModel = ValueModel.new({ value: false })

           const builder = ToolBarBuilder.new()

           const toolBar = builder.createFromClosure( function(component) {
           	this.toggleButton({
           		model: booleanModel,
           		label: 'Edition mode',
           		image: {
           			iconName: GtkIcons.edit,
           			size: GtkIcons.size._24x24,
           		},
           		tooltip: 'Toggles between edit/read mode.',
           	})

           })

           toolBar
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    toggleButton({ model: model, label: label, image: imageProps, tooltip: tooltip, enabled: enabled }) {
        if( label === undefined ) { label = '' }
        if( tooltip === undefined ) { tooltip = '' }
        if( enabled === undefined ) { enabled = true }

        const menuItem = this.namespace().ToogleToolButton.new({
            model: model,
            label: label,
            imageProps: imageProps,
            tooltip: tooltip,
            enabled: enabled,
        })

        menuItem.assemble()

        this.toolBarItems.push(menuItem)
    }

    /*
     Method(`
        Adds a ToolBarSeparator item.

        A ToolBarSeparator is a visual separation between two other consecutive ToolBar items.
     `)

     Example({
        Description: `
           Adds a ToolBar separator between 2 ToolBar items.
        `,
        Code: `
           const ToolBarBuilder = require('sirens/src/skins/componentBuilder/ToolBarBuilder')
           const GtkIcons = require('sirens/src/skins/gtk-views/constants/GtkIcons')

           const builder = ToolBarBuilder.new()

           const toolBar = builder.createFromClosure( function(component) {
           	this.button({
           		label: 'Open folder...',
           		image: {
           			iconName: GtkIcons.open,
           			size: GtkIcons.size._24x24,
           		},
           		tooltip: 'Opens an app folder.',
           		action: () => { component.getProps().openFolder() },
           	})

           	this.separator()

           	this.toggleButton({
           		label: 'Edit mode',
           		image: {
           			iconName: GtkIcons.edit,
           			size: GtkIcons.size._24x24,
           		},
           		tooltip: 'Toggles the edition mode.',
           	})

           })

           toolBar
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    separator() {
        const separator = this.namespace().ToolBarSeparator.new()

        separator.assemble()

        this.toolBarItems.push(separator)
    }
}

module.exports = Classification.define(ToolBarBuilder)