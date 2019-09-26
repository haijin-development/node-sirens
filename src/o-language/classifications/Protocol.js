const Classification = require('./Classification')

class Protocol {
    isImplementedBy({ classification: classification, ifNot: closure }) {
        if( closure === undefined ) {
            closure = (methodName) => {
                throw new Error(`${classification.getName()} classification must implement the method ${this.getName()}.${methodName} to comply with the protocol implementation.`)                
            }
        }

        const assumptionsChain = classification.getAssumptionsChain()

        return this.isImplementedByAll({
            classifications: assumptionsChain,
            ifNot: closure,
        })
    }

    isImplementedByAll({ classifications: classifications, ifNot: closure }) {
        if( closure === undefined ) {
            closure = (methodName) => {
                throw new Error(`Must implement the method ${this.getName()}.${methodName} to comply with the protocol implementation.`)
            }
        }

        let protocolMethods = []

        this.getAssumptionsChain().forEach( (protocol) => {
            protocolMethods = protocolMethods.concat( protocol.getDefinedMethodNames() )
        })

        for(const eachMethod of protocolMethods) {
            const implementsMethod = classifications.some( (classification) => {
                return classification.definesMethod( eachMethod )
            })

            if( ! implementsMethod ) {
                return closure(eachMethod)
            }
        }

        return true
    }
}

module.exports = Classification.define(Protocol)
