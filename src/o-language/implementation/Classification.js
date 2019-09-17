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
        const classificationInstance = MessageDispatcherInstance.createClassification({
            classificationDefinition: classificationDefinition
        })

        // If this object is different than the Classification object make the object created
        // to adquire the behaviour of this object
        classificationInstance.behaveAs(this)

        // If the classificationDefinition declares additional classificationBehaviours make the 
        // created classification to adquire them
        classificationDefinition.classificationBehaviours.forEach( (classification) => {
            classificationInstance.behaveAs(classification)
        })

        // If the classificationDefinition declares implementations to comply with 
        // validate that the created classification complies with them
        classificationDefinition.implements.forEach( (implementation) => {
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
            classification: this
        })
    }

    getClassificationDefinition() {
        return this.classificationDefinition
    }

    setClassificationDefinition(classificationDefinition) {
        ClassificationDefinition.initialize({ classificationDefinition: classificationDefinition })

        this.classificationDefinition = classificationDefinition
    }

    getDefinedMethodNames() {
        return MessageDispatcherInstance.classificationGetDefinedMethodNames({
            classificationObject: this
        })
    }

    definesMethod(methodName) {
        return MessageDispatcherInstance.classificationDefinesMethod({
            classificationObject: this,
            methodName: methodName
        })
    }

    getDefinedInstanceVariables() {
        return this.getClassificationDefinition().instanceVariables.slice() 
    }

    setDefinedInstanceVariables(instanceVariables) {
        this.getClassificationDefinition().instanceVariables = instanceVariables 

        return this
    }

    definesInstanceVariable(name) {
        return this.getDefinedInstanceVariables().includes( name ) 
    }

    getAssumptions() {
        return this.getClassificationDefinition().assumes.slice() 
    }

    setAssumptions(assumptions) {
        MessageDispatcherInstance.classificationSetAssumptions({
            classification: this,
            assumptions: assumptions,
        })
    
        return this
    }

    getRecursiveAssumptions() {
        return MessageDispatcherInstance.classificationRecursiveAssumptions({
            classification: this
        })
    }

    getAssumptionsChain() {
        return this.getRecursiveAssumptions()
                    .concat( [this] )
    }

    implements({ protocol: protocol }) {
        protocol.isImplementedBy({ classification: this })

        return this
    }
}

module.exports = {Classification, setMessageDispatcher}