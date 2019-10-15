const Classification = require('./Classification')
const ParamsCheckerCreator = require('./ParamsCheckerCreator')

class ClassificationWithTypeChecking {
    
    define(classificationDefinition) {

        const newClassificationInstance = this.previousClassificationDo( () => {
            return this.define( classificationDefinition )
        })

        newClassificationInstance.behaveAs( ParamsCheckerCreator )

        return newClassificationInstance
    }
    
}

module.exports = Classification.define(ClassificationWithTypeChecking)
