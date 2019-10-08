const Classification = require('./Classification')
const MethodValidator = require('./params-validation/MethodValidator')

class ParamsChecker {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }

    beforeMethod({ methodName: methodName, params: params, classification: classification }) {
        const protocols = new Set()

        classification.getImplementedProtocols().forEach( (protocol) => {
            protocol.getAssumptionsChain().forEach( (protocol) => {
                protocols.add( protocol )
            }) 
        })

        classification.getExpectedProtocols().forEach( (protocol) => {
            protocol.getAssumptionsChain().forEach( (protocol) => {
                protocols.add( protocol )
            }) 
        })

        protocols.forEach( (protocol) => {

            const protocolDefinesMethod = protocol.definesMethod( methodName )

            if( ! protocolDefinesMethod ) { return }

            // Instantiate the protocol
            const protocolInstance = protocol.new()

            // A protocol declaration should not assume any other classification to not to polute
            // the protocol it defines.
            // The protocol may also be used for documentation purposes, to perform other validations
            // different than the ones this ParamsChecker does or to do static type inference.
            // Instead of making the protocol to assume the MethodValidator behaviour
            // add it dynamically to this created instance only.
            protocolInstance.behaveAs( MethodValidator )

            // Evaluate the method of the protocol that validates the method in the classification.
            // It would look like
            //      append({ string: string, if: condition }) {
            //          param(string) .string()
            //          param(condition) .undefined() .or() .boolean()
            //      }
            protocolInstance[ methodName ]( ...params )

            protocolInstance.evaluateCollectedValidation()
        })
    }
}

module.exports = Classification.define(ParamsChecker)
