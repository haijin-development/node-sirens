const ClassificationDefinition = require('./classification-definition')

let MessageDispatcherInstance

function setMessageDispatcher(messageDispatcher) {
    MessageDispatcherInstance = messageDispatcher
}

class Classification {

    /// Definition

    static definition() {
        this.instanceVariables = ['classificationDefinition']
    }

    /// Creating classifications

    define(classificationDefinition) {
        const Classification = MessageDispatcherInstance.getClassificationClassification()

        const classificationInstance = this.createObject()

        classificationInstance.behaveAs( Classification )

        classificationInstance.setClassificationDefinition(classificationDefinition)

        classificationInstance.behaveAs( this )

        classificationInstance.getClassificationBehaviours().forEach( (classification) => {
            classificationInstance.behaveAs(classification)
        })

        classificationInstance.getImplementedProtocols().forEach( (implementation) => {
            classificationInstance.implements({ protocol: implementation })
        })

        return classificationInstance
    }

    /*
     * Returns a new O instance with this OInstance classification instantiated in it.
     */
    createObject() {
        return MessageDispatcherInstance.createObject()
    }

    /*
     * Returns a new O instance with this OInstance classification instantiated in it.
     */
    new(...props) {
        return this.createObject().yourself( (object) => {
            object
                .behaveAs(this)
                .initialize(...props)
        })
    }

    /// Accessing

    getName() {
        return MessageDispatcherInstance.classificationGetName({
            classificationObject: this,
        })
    }

    getClassificationDefinition() {
        return this.classificationDefinition
    }

    initializeClassificationDefinition(classificationDefinition) {
        MessageDispatcherInstance.classificationDefinitionInitialize({
            classificationDefinition: classificationDefinition,
        })
    }

    setClassificationDefinition(classificationDefinition) {
        this.initializeClassificationDefinition( classificationDefinition )

        this.classificationDefinition = classificationDefinition
    }

    getDefinedMethodNames() {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationGetDefinedMethodNames({
            classificationDefinition: classificationDefinition,
        })
    }

    definesMethod(methodName) {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationDefinesMethod({
            classificationDefinition: classificationDefinition,
            methodName: methodName,
        })
    }

    getDefinedInstanceVariables() {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationGetDefinedInstanceVariables({
            classificationDefinition: classificationDefinition,
        })
    }

    setDefinedInstanceVariables(instanceVariables) {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationSetDefinedInstanceVariables({
            classificationDefinition: classificationDefinition,
            instanceVariables: instanceVariables,
        })
    }

    definesInstanceVariable(name) {
        return this.getDefinedInstanceVariables().includes( name ) 
    }

    getAssumptions() {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationGetAssumptions({
            classificationDefinition: classificationDefinition,
        })
    }

    setAssumptions(otherClassifications) {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationSetAssumptions({
            classificationDefinition: classificationDefinition,
            assumptions: otherClassifications,
        })

        return this
    }

    getRecursiveAssumptions() {
        let allAssumptions = []

        const directAssumptions = this.getAssumptions()

        directAssumptions.forEach( (directAssumption) => {
            const assumptions = directAssumption.getRecursiveAssumptions()

            assumptions.forEach( (eachClassification) => {
                if( ! allAssumptions.includes( eachClassification ) ) {
                    allAssumptions.push( eachClassification )
                }
            })

            if( ! allAssumptions.includes( directAssumption ) ) {
                allAssumptions.push( directAssumption )
            }
        })

        return allAssumptions
    }

    getAssumptionsChain() {
        return this.getRecursiveAssumptions()
                    .concat( [this] )
    }

    getClassificationBehaviours() {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationGetClassificationBehaviours({
            classificationDefinition: classificationDefinition,
        })
    }

    setClassificationBehaviours(otherClassifications) {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationSetClassificationBehaviours({
            classificationDefinition: classificationDefinition,
            classificationBehaviours: otherClassifications,
        })
    }

    getImplementedProtocols() {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationGetImplementedClassifications({
            classificationDefinition: classificationDefinition,
        })
    }

    setImplementedProtocols(protocols) {
        const classificationDefinition = this.classificationDefinition

        return MessageDispatcherInstance.classificationSetImplementedClassifications({
            classificationDefinition: classificationDefinition,
            protocols: protocols,
        })
    }

    implements({ protocol: protocol }) {
        protocol.isImplementedBy({
            classification: this
        })

        return this
    }

    compliesWith({ protocol: protocol }) {
        const implementedProtocols = this.getImplementedProtocols()

        return implementedProtocols.some( (implementedProtocol) => {
            return protocol === implementedProtocol
        })
    }
}

module.exports = {Classification, setMessageDispatcher}