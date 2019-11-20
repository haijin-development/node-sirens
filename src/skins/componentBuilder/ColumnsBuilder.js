const Classification = require('../../O').Classification
const WidgetBuilder = require('./WidgetBuilder')
const Column = require('./Column')

/*
 Class(`
    This classification adds the methods to the component builder DSL to build columns for components like Lists or Trees.

    After evaluating the DSL you can ask this object for the array with the created columns definitions.
 `)

 Example({
    Description: `
       Evaluate the ColumnsBuilder DSL to collect column definitions.
    `,
    Code: `

       const Classification = require('sirens/src/O').Classification
       const ColumnsBuilder = require('sirens/src/skins/componentBuilder/ColumnsBuilder')

       const builder = ColumnsBuilder.new()

       builder.build(function (component) {

       	this.column({
       		label: 'Column 1',
       		getTextClosure: (n) => { return n.toString() },
       	})

       })

       builder.getProps().columns

    `,
 })
*/
class ColumnsBuilder {
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
        this.assumes = [WidgetBuilder]
    }

    /// Initializing

    /*
     Method(`
        Initializes this object with an empty list of column definitions.
     `)

     Example({
        Description: `
           Instantiates a ColumnsBuilder.
        `,
        Code: `
           const ColumnsBuilder = require('sirens/src/skins/componentBuilder/ColumnsBuilder')

           ColumnsBuilder.new()
        `,
     })

     Tags([
        'initializing', 'public'
     ])
    */
    initialize(props) {
        this.previousClassificationDo( () => {
            this.initialize(props)
        })

        this.mergeProps({ columns: [] })
    }

    /// Columns

    /*
     Method(`
        Creates a new column definition and adds it to the list of columns definitions to build.
     `)

     Param({
        Name: `
           columnProps
        `,
        Description: `
           object.
           The properties of the column.

           If can be any of the following optional properties:

                   {
                   	label: label,
                   	getTextClosure: getTextClosure,
                   	getImageClosure: getImageClosure,
                   	imageWidth: imageWidth,
                   	imageHeight: imageHeight,
                   }


           See the Column classification for a detailed documentation on each property.
        `,
     })

     Example({
        Description: `
           Defines two columns with a label and a getTextClosure each one.
        `,
        Code: `
           const ColumnsBuilder = require('sirens/src/skins/componentBuilder/ColumnsBuilder')

           const builder = ColumnsBuilder.new()

           builder.build(function (component) {

           	this.column({
           		label: 'Column 1',
           		getTextClosure: (n) => { return n.toString() },
           	})

           	this.column({
           		label: 'Column 2',
           		getTextClosure: (n) => { return n.toString() },
           	})

           })

           builder.getProps().columns
        `,
     })

     Tags([
        'dsl', 'public'
     ])
    */
    column(columnProps) {
        const column = Column.new(columnProps)

        this.getProps().columns.push(column)
    }
}

module.exports = Classification.define(ColumnsBuilder)