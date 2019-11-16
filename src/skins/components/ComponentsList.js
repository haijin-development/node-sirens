const Classification = require('../../O').Classification
const Component = require('./Component')
const ListModelComponentProtocol_Implementation = require('../../finger-tips/protocols/ListModelComponentProtocol_Implementation')

const ComponentProtocol = require('../protocols/ComponentProtocol')
const ComponentProtocol_Implementation = require('../protocols/ComponentProtocol_Implementation')
const ListModel = require('../../finger-tips/models/ListModel')

/*
 Class(`
    A ComponentsList is a Component whose model is a ListModel renders a sub-component for each item in its model list.

    A ComponentsList hooks its ListModel events to keep its View in sync with it.

    Since a ComponentsList renders a component for each item in its model list instead of implementing the method

    	renderWith(componentsRenderer)

    it must implement the method

    	renderItem({ item: item, index: index, renderer: componentsRenderer })


    If the ComponentsList renders only a child component for each item then it does not need to do anythiing else besides providing
    a method

    	renderItem({ item: item, index: index, renderer: componentsRenderer }).

    If the ComponentsList wants to render additional child components besides the ones of the list items then it can override the method

    	renderWith(componentsRenderer)


    A ComponentsList is less useful that it may seem since in most cases a regular Component can render a list of items with a simple
    loop and is much less complex to use and debug.

    You should use a ComponentsList if a part of a model changes its contents dynamically without changing the rest of the model.
    In that case a ComponentsList can hook the changes in the list alone.
 `)

 Example({
    Description: `
       Evaluate the first parte of the example to create a CustomListComponent to show the contents of a ListModel of objects 
       in a Window.

       The evaluate the statements of the second part of the example, one by one, to modify the ListModel contents and
       see how the opened CustomListComponent keeps it contents in sync with it.
    `,
    Code: `
       const Classification = require('sirens/src/O').Classification
       const Component = require('sirens/src/skins/components/Component')
       const ComponentsList = require('sirens/src/skins/components/ComponentsList')
       const ComponentProtocol_Implementation = require('sirens/src/skins/protocols/ComponentProtocol_Implementation')
       const ListModelComponentProtocol_Implementation = require('sirens/src/skins/protocols/ListModelComponentProtocol_Implementation')
       const ListModel = require('sirens/src/finger-tips/models/ListModel')

       /// Define a ComponentsList 
       class CustomListComponent {

       	static definition() {
       		this.instanceVariables = []
       		this.assumes = [ComponentsList]
       		this.implements = [
       			ListModelComponentProtocol_Implementation
       		]
       	}

       	renderItem({ item: item, index: index, renderer: componentsRenderer }) {

       		componentsRenderer.bindYourself( function() {

       			this.horizontalStack( function() {
       				this.label({
       					text: 'Item ' + item.id.toString() + ': ', 
       				})

       				this.textButton({
       					text: item.name,
       					onClicked: () => {},
       				})
       			})

       		})
       	}
       }

       CustomListComponent = Classification.define(CustomListComponent)

       // Define a Window to contain the CustomListComponent
       class CustomWindow {

       	static definition() {
       		this.instanceVariables = []
       		this.assumes = [Component]
       		this.implements = [ComponentProtocol_Implementation]
       	}

       	/// Building

       	renderWith(componentsRenderer) {
       		const itemsModel = this.getModel()

       		componentsRenderer.render(function (component) {

       			this.window( function() {

       				this.verticalStack( function() {
       					// Add the CustomListComponent and pass along the ListModel to it.
       					this.component(
       						CustomListComponent.new({
       							model: itemsModel
       						})
       					)				
       				})
       			})

       		})
       	}

       }

       CustomWindow = Classification.define(CustomWindow)




       // Create a ListModel with some initial items
       const list = [
       	{
       		id: 1,
       		name: 'Item 1',
       	},
       	{
       		id: 2,
       		name: 'Item 2',
       	},
       ]
       this.itemsModel = ListModel.new({ list: list })



       // Open the window

       const window = CustomWindow.new({
       	model: this.itemsModel
       })

       window.open()

       /// --- Evaluate the previous code up to here to see the opened window with two items rendered. --- ///




       /// --- Now evaluate the following to add, remove or update items and see how the window syncs its contents. --- ///

       // Add a new item
       this.itemsModel.push({
       	id: 3,
       	name: 'Item 3',
       })

       // Update and item
       this.itemsModel.update({
       	index: 1,
       	item: { id: 2, name: 'Item 2' }
       })

       // Remove an item
       this.itemsModel.removeAt({
       	index: 1,
       })
    `,
 })
*/
class ComponentsList {
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
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [
            ListModelComponentProtocol_Implementation,
            ComponentProtocol,
        ]
        this.expects = [ComponentProtocol_Implementation]
    }

    /// Initializing

    /*
     Method(`
        Returns a new ListModel on an empty array.

        This model is used by if no other model is given when creating the component.
     `)
     Returns({
        Description: `
           ListModel.
           A ListModel on an empty array.
        `,
     })

     Example({
        Description: `
           Gets the model created by default for a new ComponentsList object.
        `,
        Code: `

           const ComponentsList = require('sirens/src/skins/components/ComponentsList')

           const componentsList = ComponentsList.new()
           componentsList.getModel()

        `,
     })

     Tags([
        'creating objects', 'initializing', 'implementation'
     ])
    */
    defaultModel() {
        return ListModel.new({ list: [] })
    }

    /// Rendering

    /*
     Method(`
        In most components this method builds the component styles and children based on its model and props.
        For that reason each component implements it with its custom rendering.

        In the case of the ComponentsList this method iterates the items on its ListModel and renders each item component.

        If you want to render additional components and widgets instead of exactly one component for each item you can add
        the surrounding components in the parent of this ComponentsList or you can override this method in a more specific classification.
     `)

     Param({
        Name: `
           componentsRenderer
        `,
        Description: `
           ComponentRenderer.
           The ComponentRenderer object to build this Component styles and children through its component builder DSL.
        `,
     })

     Tags([
        'rendering', 'implementation'
     ])
    */
    renderWith(componentsRenderer) {
        const items = this.getModel().getList()

        componentsRenderer.render( function(component) {
            items.forEach( (item, index) => {
                component.renderItem({ item: item, index: index, renderer: this })
            })
        })
    }


    /// Events

    /*
     Method(`
        A ComponentsList has a ListModel as its model.

        This method listens to the model events to keep this component view in sync with the changes in the model list.
     `)

     Tags([
        'events', 'initializing', 'implementation'
     ])
     */
    subscribeToModelEvents() {
        this.previousClassificationDo( () => {
            this.subscribeToModelEvents()
        })

        this.getModel().onListChanged( this.onItemsListChanged.bind(this) )
        this.getModel().onItemsAdded( this.onItemsAdded.bind(this) )
        this.getModel().onItemsUpdated( this.onItemsUpdated.bind(this) )
        this.getModel().onItemsRemoved( this.onItemsRemoved.bind(this) )
    }

    /*
     Method(`
        This method is called when the entire list changes in this component model.

        The implementation removes all this component children and renders again the component.
     `)

     Tags([
        'events', 'implementation'
     ])
    */
    onItemsListChanged() {
        this.removeAllChildrenComponents()

        this.build()
    }

    /*
        Method(`
           This method is called when more items are added to this component model.

           This method renders the child components for the items added and adds them as children of this component.
        `)

        Param({
           Name: `
              list
           `,
           Description: `
              Array.
              Array with all the items in this component model, including the added items.
           `,
        })

        Param({
           Name: `
              items
           `,
           Description: `
              Array.
              Array with all added items in the same order as they were added.
           `,
        })

        Param({
           Name: `
              index
           `,
           Description: `
              The position in the array where the new items were added.
           `,
        })

        Implementation(`
           Currently this method re-renders the whole component.
           This is inneficient and will be optimized in the future to render the child components of the new items only.
        `)

        Tags([
           'events', 'implementation'
        ])
    */
    onItemsAdded({ list: list, items: items, index: index }) {
        this.onItemsListChanged()
    }

    /*
        Method(`
           This method is called when one or more items are updated in this component model.

           This method renders the child components of the updated items.
        `)

        Param({
           Name: `
              list
           `,
           Description: `
              Array.
              Array with all the items in this component model, including the updated items.
           `,
        })

        Param({
           Name: `
              items
           `,
           Description: `
              Array.
              Array with the updated items.
           `,
        })

        Param({
           Name: `
              indices
           `,
           Description: `
              Array.
              Array with the indices of the updated items in the list.
           `,
        })

        Implementation(`
           Currently this method re-renders the whole component.
           This is inneficient and will be optimized in the future to re-render the child components of the updated items only.
        `)

        Tags([
           'implementation', 'events'
        ])
    */
    onItemsUpdated({ list: list, items: items, indices: indices }) {
        this.onItemsListChanged()
    }

    /*
        Method(`
           Implementation note: rewrite this method to render the changed components only.
        `)

        Param({
           Name: `
              list
           `,
           Description: `
              Array.
              Array with all the items in this component model. The removed items were already removed from this list.
           `,
        })

        Param({
           Name: `
              items
           `,
           Description: `
              Array.
              Array with the removed items.
           `,
        })

        Param({
           Name: `
              indices
           `,
           Description: `
              Array.
              Array with the indices of the removed items in the old list.
           `,
        })

        Implementation(`
           Currently this method re-renders the whole component.
           This is inneficient and will be optimized in the future to remove the child components of the removed items.
        `)

        Tags([
           'implementation', 'events'
        ])
    */
    onItemsRemoved({ list: list, items: items, indices: indices }) {
        this.onItemsListChanged()
    }
}

module.exports = Classification.define(ComponentsList)