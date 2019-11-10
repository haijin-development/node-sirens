const Classification = require('../../o-language/classifications/Classification')

/*
 Class(`
    Proxy object used to replace a child component by a deaf object that consumes all messages but does nothing.

    It is used to temporary disable a component for testing or debugging:


    	renderWith(componentsRenderer) {
    		componentsRenderer.render(function (component) {

    			this.text({
    				text: 'A text.'
    			})

    			this.skip().text({
    				text: 'A disabled text.'
    			})

    			this.text({
    				text: 'A text'
    			})
                	})
    	})
 `)

 Example({
    Description: `
       Creates a window with a disabled component using the component builder DSL.
    `,
    Code: `
       const Sirens = require('sirens')
       const Classification = require('sirens/src/o-language/classifications/Classification')
       const Component = require('sirens/src/gui/components/Component')
       const ComponentProtocol_Implementation = require('sirens/src/gui/protocols/ComponentProtocol_Implementation')
       const ComponentInstantiator = require('sirens/src/gui/components/ComponentInstantiator')

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
       				this.verticalStack( function() {

       					this.label({
       						text: 'Label 1'
       					})

       					// Disable this component
       					this.skip().label({
       						text: 'Label 2'
       					})

       					this.label({
       						text: 'Label 3'
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
       Creates an AntiComponent proxy and sends chained messages to it.
    `,
    Code: `
       const AntiComponent = require('sirens/src/gui/componentBuilder/AntiComponent')

       const component = AntiComponent.new()

       component
       	.firstMethod()
       	.secondMethod()
       	.thirdMethod()
    `,
 })
*/
class AntiComponent {
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
    }

    /// Hooks

    /*
     Method(`
        Method proxy that cancels the method call.
     `)
     Returns({
        Description: `
           Returns

           {
           	callMethod: null,
           }


           to cancel the actual method call.

           In the afterMethod it replaces the return value by this object in case it receives more message calls.
        `,
     })

     Tags([
        'proxy methods', 'implementation'
     ])
    */
    beforeMethod({ methodName: methodName, params: params, classification: classification }) {
        return {
            callMethod: null,
        }
    }

    /*
     Method(`
        Method proxy to replace the return value by this same object.

        Returning this same Proxy object handles the following case:


        		const AntiComponent = require('sirens/src/gui/componentBuilder/AntiComponent')

        		const component = AntiComponent.new()

        		component
        			.firstMethod()
        			.secondMethod()
        			.thirdMethod()
     `)
     Returns({
        Description: `
           Returns

           {
           	callResult: this,
           }

           to replace the result by this same proxy object.

           Returning this same proxy allows chaining method calls on the return value.


           		const AntiComponent = require('sirens/src/gui/componentBuilder/AntiComponent')

           		const component = AntiComponent.new()

           		component
           			.firstMethod()
           			.secondMethod()
           			.thirdMethod()
        `,
     })

     Tags([
        'proxy methods', 'implementation'
     ])
    */
    afterMethod({ methodName: methodName, params: params, result: result, classification: classification }) {
        return {
            callResult: this,
        }
    }
}


module.exports = Classification.define(AntiComponent)