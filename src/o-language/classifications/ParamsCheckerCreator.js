const Classification = require('./Classification')
const ParamsChecker = require('./ParamsChecker')

class ParamsCheckerCreator {
    
    new(...params) {
        const newInstance = this.previousClassificationDo( () => {
            return this.new( ...params )
        })

        newInstance.behaveAs( ParamsChecker )

        return newInstance
    }
    
}

module.exports = Classification.define(ParamsCheckerCreator)
