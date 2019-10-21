const Classification = require('./Classification')
const ParamsChecker = require('./ParamsChecker')

/*
 Class(`
    This classifications makes another classification to add the ParamsChecker behaviour to the instances it creates with
    the method

    		AClassification.new()

    If you want a particular classification to makes its instances to validate the parameters on each method call according to the 
    specifications of the protocols it implements the make it behave as a ParamsCheckerCreator:


    	const ParamsCheckerCreator = require('sirens/src/o-language/classifications/ParamsCheckerCreator')
    	const StringStream = require('sirens/src/o-language/classifications/StringStream')

    	StringStream.behaveAs( ParamsCheckerCreator )

    	StringStream.new()
 `)

 Example({
    Description: `
       Adds the ParamsCheckerCreator behaviour to another classification, StringStream, to make the instances of
       StringStream to also behave as ParamChecker.
    `,
    Code: `
       const ParamsCheckerCreator = require('sirens/src/o-language/classifications/ParamsCheckerCreator')
       const StringStream = require('sirens/src/o-language/classifications/StringStream')

       StringStream.behaveAs( ParamsCheckerCreator )

       StringStream.new()
    `,
 })
*/
class ParamsCheckerCreator {
    
    /*
     Method(`
        Overrides the new method to create a regular instance and then adds the ParamsCheck behaviour to the instance, making
        it to validate the parameters on each method call the instance receives, according to the Protocols it implements.
     `)

     Param({
        Name: `
           ...params
        `,
        Description: `
           The parameters of the new() method of some other classification.
        `,
     })

     Returns({
        Description: `
           object.
           An OInstance with the ParamChecker behaviour attached to it.
        `,
     })

     Example({
        Description: `
           Adds the ParamsCheckerCreator behaviour to another classification, StringStream, to make the instances of
           StringStream to also behave as ParamChecker.
        `,
        Code: `

           const ParamsCheckerCreator = require('sirens/src/o-language/classifications/ParamsCheckerCreator')
           const StringStream = require('sirens/src/o-language/classifications/StringStream')

           StringStream.behaveAs( ParamsCheckerCreator )

           StringStream.new()

        `,
     })
    */
    new(...params) {
        const newInstance = this.previousClassificationDo( () => {
            return this.new( ...params )
        })

        newInstance.behaveAs( ParamsChecker )

        return newInstance
    }
    
}

module.exports = Classification.define(ParamsCheckerCreator)
