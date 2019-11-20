const Classification = require('../../O').Classification
const ObjectWithProps = require('../../O').ObjectWithProps

/*
 Class(`
    This object specifies a column in a List or Tree component.

    The column contents can be a text or an image.

    This object defines the closures to get the column contents for each item.

    Usually you will not instantiate this object directly but through the components builder DSL.
 `)

 Example({
    Description: `
       Creates a ListChoice component with a text column.
    `,
    Code: `
       const Sirens = require('sirens')
       const Classification = require('sirens/src/O').Classification
       const Component = require('sirens/src/skins/components/Component')
       const ComponentProtocol_Implementation = require('sirens/src/skins/protocols/ComponentProtocol_Implementation')
       const ComponentInstantiator = require('sirens/src/skins/components/ComponentInstantiator')

       class ExampleComponent {
       	/// Definition

       	static definition() {
       		this.instanceVariables = []
       		this.assumes = [Component]
       		this.implements = [ComponentProtocol_Implementation]
       		this.classificationBehaviours = [ComponentInstantiator]
       	}

       	/// Building

       	renderWith(componentsRenderer) {
       		componentsRenderer.render(function (component) {

       			this.window({ width: 100, height: 100,}, function() {

       				this.listChoice({ choices: ['Item 1', 'Item 2', 'Item 3'], }, function(list) {
       					this.column({
       						label: 'Column 1',
       						getTextClosure: (item) => { return item.toString() },
       					})
       				})

       			})

       		})
       	}
       }

       ExampleComponent = Classification.define(ExampleComponent)

       ExampleComponent.open()
    `,
 })

 Example({
    Description: `
       Creates a ListChoice component with a file image column.
    `,
    Code: `
       const Sirens = require('sirens')
       const Classification = require('sirens/src/O').Classification
       const Component = require('sirens/src/skins/components/Component')
       const ComponentProtocol_Implementation = require('sirens/src/skins/protocols/ComponentProtocol_Implementation')
       const ComponentInstantiator = require('sirens/src/skins/components/ComponentInstantiator')

       class ExampleComponent {
       	/// Definition

       	static definition() {
       		this.instanceVariables = []
       		this.assumes = [Component]
       		this.implements = [ComponentProtocol_Implementation]
       		this.classificationBehaviours = [ComponentInstantiator]
       	}

       	imageForItem(item) {
       		return  './node_modules/sirens/resources/icons/haiku.png'
       	}

       	/// Building

       	renderWith(componentsRenderer) {
       		componentsRenderer.render(function (component) {

       			this.window({ width: 100, height: 100,}, function() {

       				this.listChoice({ choices: [1, 2, 3], }, function(list) {

       					this.column({
       						label: 'Column 1',
       						getImageClosure: (item) => { return component.imageForItem( item ) },
                               			imageWidth: 24,
                               			imageHeight: 24,
       					})
       				})

       			})

       		})
       	}
       }

       ExampleComponent = Classification.define(ExampleComponent)

       ExampleComponent.open()
    `,
 })

 Example({
    Description: `
       Creates a ListChoice component with an image and a text columns.
    `,
    Code: `

       const Sirens = require('sirens')
       const Classification = require('sirens/src/O').Classification
       const Component = require('sirens/src/skins/components/Component')
       const ComponentProtocol_Implementation = require('sirens/src/skins/protocols/ComponentProtocol_Implementation')
       const ComponentInstantiator = require('sirens/src/skins/components/ComponentInstantiator')

       class ExampleComponent {
       	/// Definition

       	static definition() {
       		this.instanceVariables = []
       		this.assumes = [Component]
       		this.implements = [ComponentProtocol_Implementation]
       		this.classificationBehaviours = [ComponentInstantiator]
       	}

       	imageForItem(item) {
       		return  './node_modules/sirens/resources/icons/haiku.png'
       	}

       	/// Building

       	renderWith(componentsRenderer) {
       		componentsRenderer.render(function (component) {

       			this.window({ width: 100, height: 100,}, function() {

       				this.listChoice({ choices: [1, 2, 3], }, function(list) {

       					this.column({
       						label: 'Column 1',
       						getImageClosure: (item) => { return component.imageForItem( item ) },
                               			imageWidth: 24,
                               			imageHeight: 24,
       					})

       					this.column({
       						label: 'Column 1',
       						getTextClosure: (item) => { return item.toString() },
       					})

       				})

       			})

       		})
       	}
       }

       ExampleComponent = Classification.define(ExampleComponent)

       ExampleComponent.open()

    `,
 })
*/
class Column {
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
        this.assumes = [ObjectWithProps]
    }

    /// Initializing

    /*
     Method(`
        Initializes this object with the arguments given in the method .new().

        Its arguments are any of the optional

        {
        	label: label,
        	getTextClosure: getTextClosure,
        	getImageClosure: getImageClosure,
        	imageWidth: imageWidth,
        	imageHeight: imageHeight,
        }
     `)

     Param({
        Name: `
           label
        `,
        Description: `
           Optional.
           String.
           The column header text.
           Can be absent if the column does not show its header.
        `,
     })

     Param({
        Name: `
           getTextClosure
        `,
        Description: `
           Optional.
           Function.
           The function to get the text for each item.

           It has the following signature:

           	function(item) {
           	}


           Returns the string for the given item.

           If the column has a getImageClosure this parameter is ignored.
        `,
     })

     Param({
        Name: `
           getImageClosure
        `,
        Description: `
           Optional.
           Function.
           The function to get an image to show for each item.

           It has the following signature:

           	function(item) {
           	}


           Returns the path to the image file to use for the given item.

           If the column has a getImageClosure it must also define an

           	.imageWidth

           and

           	.imageHeight

           arguments.
        `,
     })

     Param({
        Name: `
           imageWidth
        `,
        Description: `
           Optional.
           Interger.
           The width of the image to show in the column for each item.

           If the column defines a getImageClosure then it must be present.
        `,
     })

     Param({
        Name: `
           imageHeight
        `,
        Description: `
           Optional.
           Interger.
           The height of the image to show in the column for each item.

           If the column defines a getImageClosure then it must be present.
        `,
     })

     Example({
        Description: `
           Creates a column with a label and a getTextClosure and gets the label and the text for an item.
        `,
        Code: `
           const Column = require('sirens/src/skins/componentBuilder/Column')

           const column = Column.new({
           	label: 'Colum 1',
           	getTextClosure: (item) => { return item.toString() }
           })

           column.getLabel()

           column.getDisplayTextOf({ item: 123 })
        `,
     })

     Example({
        Description: `
           Creates a column with a getImageClosure and gets the image for an item.
        `,
        Code: `
           const Column = require('sirens/src/skins/componentBuilder/Column')

           const column = Column.new({
           	getImageClosure: (item) => { return  './node_modules/sirens/resources/icons/haiku.png' },
           	imageWidth: 24,
           	imageHeight: 24,
           })
           column.getImageFileOf({ item: 123 })
        `,
     })

     Tags([
        'initializing', 'public'
     ])
    */
    initialize(props = {}) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        props = Object.assign( {label: ''}, props )

        this.setProps( props )
    }

    /// Asking

    /*
     Method(`
        For each item this column displays either text or an image.

        It displays an image if it defines a getImageClosure.

        This method returns true if this column displays an image, false if it displays text.
     `)
     Returns({
        Description: `
           Boolean.

           True if this column defines a getImageClosure.
           False otherwise.
        `,
     })

     Example({
        Description: `
           Asks if a text column displays images.
        `,
        Code: `
           const Column = require('sirens/src/skins/componentBuilder/Column')

           const column = Column.new({
           	getTextClosure: (item) => { return item.toString() },
           })

           column.isImage()
        `,
     })

     Example({
        Description: `
           Asks if an image column displays images.
        `,
        Code: `
           const Column = require('sirens/src/skins/componentBuilder/Column')

           const column = Column.new({
           	getImageClosure: (item) => { return  './node_modules/sirens/resources/icons/haiku.png' },
           	imageWidth: 24,
           	imageHeight: 24,
           })
           column.isImage()
        `,
     })

     Tags([
        'asking', 'public'
     ])
    */
    isImage() {
        return this.hasImageClosure()
    }

    /*
     Method(`
        Returns true if this column has a getTextClosure defined, false otherwise.
     `)
     Returns({
        Description: `
           Boolean.
           True if this column has a getTextClosure defined, false otherwise.
        `,
     })

     Example({
        Description: `
           Asks a Column if it has a text closure defined.
        `,
        Code: `
           const Column = require('sirens/src/skins/componentBuilder/Column')

           const column = Column.new({
           	getTextClosure: (item) => { return item.toString() },
           })

           column.hasTextClosure()
        `,
     })

     Example({
        Description: `
           Asks a Column if it has a text closure defined.
        `,
        Code: `
           const Column = require('sirens/src/skins/componentBuilder/Column')

           const column = Column.new()

           column.hasTextClosure()
        `,
     })

     Tags([
        'asking', 'public'
     ])
    */
    hasTextClosure() {
        return this.hasProp({ key: 'getTextClosure' })
    }

    /*
     Method(`
        Returns true if this column has a getImageClosure defined, false otherwise.
     `)
     Returns({
        Description: `
           Boolean.
           True if this column has a getImageClosure defined, false otherwise.
        `,
     })

     Example({
        Description: `
           Asks a Column if it has an image closure defined.
        `,
        Code: `
           const Column = require('sirens/src/skins/componentBuilder/Column')

           const column = Column.new({
           	getImageClosure: (item) => { return '/image.png' },
           })

           column.hasImageClosure()
        `,
     })

     Example({
        Description: `
           Asks a Column if it has an image closure defined.
        `,
        Code: `
           const Column = require('sirens/src/skins/componentBuilder/Column')

           const column = Column.new()

           column.hasImageClosure()
        `,
     })

     Tags([
        'asking', 'public'
     ])
    */
    hasImageClosure() {
        return this.hasProp({ key: 'getImageClosure' })
    }

    /// Accessing

    /*
     Method(`
        Returns the label of this Column.

        The label is optional and can be undefined if the List or Tree component does not have a visible header.
     `)
     Returns({
        Description: `
           String.
           The label of this Column.

           The label is optional and can be undefined if the List or Tree component does not have a visible header.
        `,
     })

     Example({
        Description: `
           Gets the label of a Column object.
        `,
        Code: `
           const Column = require('sirens/src/skins/componentBuilder/Column')

           const column = Column.new({
           	label: 'Label',
           })

           column.getLabel()
        `,
     })

     Tags([
        'querying', 'public'
     ])
    */
    getLabel() {
        return this.getProp({ key: 'label' })
    }

    /*
     Method(`
        Returns the closure used by this Column object to get the text to display for an item.
     `)
     Returns({
        Description: `
           Function.
           The closure used by this Column object to get the text to display for an item.
           Can be undefined.
        `,
     })

     Tags([
        'querying', 'public'
     ])
    */
    getTextClosure() {
        return this.getProp({ key: 'getTextClosure' })
    }

    /*
     Method(`
        Returns the closure used by this Column object to get the image to display for an item.
     `)
     Returns({
        Description: `
           Function.
           The closure used by this Column object to get the image to display for an item.
           Can be undefined.
        `,
     })

     Tags([
        'querying', 'public'
     ])
    */
    getImageClosure() {
        return this.getProp({ key: 'getImageClosure' })
    }

    /*
     Method(`
        Returns whether this colum shows text or an image.
     `)
     Returns({
        Description: `
           String.
           Returns 'string' if the Column has a getTextClosure.
           Returns 'image' if the Column has a getImageClosure.
        `,
     })

     Tags([
        'querying', 'public'
     ])
    */
    getType() {
        if( this.isImage() ) {
            return 'image'
        }

        return 'string'
    }

    /*
     Method(`
        Returns the text to display in the List or Tree column for the given item.

        If the text for the given item is undefined and an undefinedHandler is given returns the result of the evaluation of
        the undefinedHandler.
     `)

     Param({
        Name: `
           item
        `,
        Description: `
           object.
           The item to display its textual representation in this column.
        `,
     })

     Param({
        Name: `
           undefinedHandler
        `,
        Description: `
           Optional.
           Function.
           If the getTextClosure returns undefined for the given item evaluate this function.

           It may be used to return a default text for the item or to raise an error.
        `,
     })

     Returns({
        Description: `
           String.
           The text to display in the List or Tree column for the given item.

           If the text for the given item is undefined and an undefinedHandler is given returns the result of the evaluation of
           the undefinedHandler.
        `,
     })

     Example({
        Description: `
           Gets the text to display in the column the number 1.
        `,
        Code: `
           const Column = require('sirens/src/skins/componentBuilder/Column')

           const column = Column.new({
           	getTextClosure: (n) => {
           		if( n === 0 ) { return undefined }
           		return '# ' + n.toString()
           	},
           })

           column.getDisplayTextOf({
           	item: 1,
           	onUndefined: () => { return 'Undefined' }
           })
           column.getDisplayTextOf({
           	item: 0,
           	onUndefined: () => { return 'Undefined' }
           })
        `,
     })

     Tags([
        'displaying', 'public'
     ])
    */
    getDisplayTextOf({ item: item, onUndefined: undefinedHandler }) {
        if( ! this.hasTextClosure() ) {
            return item.toString()
        }

        const textBlock = this.getTextClosure()

        const text = textBlock(item)

        if(text === undefined) {
            return undefinedHandler()
        }

        return text
    }

    /*
     Method(`
        Returns the image filename to display in the List or Tree column for the given item.

        If the image filename for the given item is undefined and an undefinedHandler is given returns the result of the evaluation of
        the undefinedHandler.
     `)

     Param({
        Name: `
           item
        `,
        Description: `
           object.
           The item to display its textual representation in this column.
        `,
     })

     Param({
        Name: `
           undefinedHandler
        `,
        Description: `
           Optional.
           Function.
           If the getImageClosure returns undefined for the given item evaluate this function.

           It may be used to return a default image for the item or to raise an error.
        `,
     })

     Returns({
        Description: `
           String.
           The filename of the image to display in the List or Tree column for the given item.

           If the image for the given item is undefined and an undefinedHandler is given returns the result of the evaluation of
           the undefinedHandler.
        `,
     })

     Example({
        Description: `
           Gets the image filename to display in the column the number 1.
        `,
        Code: `
           const Column = require('sirens/src/skins/componentBuilder/Column')

           const column = Column.new({
           	getImageClosure: (n) => {
           		if( n === 0 ) { return undefined }
           		return '/number.jpg'
           	},
           })

           column.getImageFileOf({
           	item: 1,
           	onUndefined: () => { return 'Undefined' }
           })

           column.getImageFileOf({
           	item: 0,
           	onUndefined: () => { return 'Undefined' }
           })
        `,
     })

     Tags([
        'displaying', 'public'
     ])
    */
    getImageFileOf({ item: item, onUndefined: undefinedHandler }) {
        const imageBlock = this.getImageClosure()

        const filename = imageBlock(item)

        if(filename === undefined) {
            return undefinedHandler()
        }

        return filename
    }

    /*
     Method(`
        Returns the width of the image to display in this Column.

        It is optional.
     `)
     Returns({
        Description: `
           Integer.
           The width of the image to display in this Column.

           Can be undefined.
        `,
     })

     Example({
        Description: `
           Gets the width of the images used in this column.
        `,
        Code: `
           const Column = require('sirens/src/skins/componentBuilder/Column')

           const column = Column.new({
           	imageWidth: 16,
           	imageHeight: 16,
           })

           column.getImageWidth()
        `,
     })

     Tags([
        'public', 'querying'
     ])
    */
    getImageWidth() {
        return this.getProp({ key: 'imageWidth' })
    }

    /*
     Method(`
        Returns the height of the image to display in this Column.

        It is optional.
     `)
     Returns({
        Description: `
           Integer.
           The height of the image to display in this Column.

           Can be undefined.
        `,
     })

     Example({
        Description: `
           Gets the height of the images used in this column.
        `,
        Code: `
           const Column = require('sirens/src/skins/componentBuilder/Column')

           const column = Column.new({
           	imageWidth: 16,
           	imageHeight: 16,
           })

           column.getImageHeight()
        `,
     })

     Tags([
        'public', 'querying'
     ])
    */
    getImageHeight() {
        return this.getProp({ key: 'imageHeight' })
    }
}


module.exports = Classification.define(Column)