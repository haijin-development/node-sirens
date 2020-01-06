const Classification = require('./Classification')
const {LockedNamespaceError} = require('./Errors')

/*
    Class(`
        An ObjectWithNamespace classification adds to an object a getter and a setter
        to an object named namespace:

            .setNamespace(namespace)
            .getNamespace()

        This object has not constraints and can be anything.

        The object can then get and use this namespace to create other objects instead
        of referencing the class global name:

        class RequestHandler {
            definition() {
                this.assumes = [ObjectWithNamespace]
            }

            handleRequest() {
                const mailer = this.getMailer()

                mailer.send(...)
            }

            getMailer() {
                const Mailer = this.namespace().Utilities.Mailer

                return Mailer.new()
            }
        }

        const namespace = {
            Utilities: {
                Mailer: CustomMailer
            }
        }

        const requestHandler = RequestHandler.new()

        requestHandler.setNamespace(namespace)

        This allows to replace the use of static references to global variables like
        the name of classes and functions with a namespace following the Factory
        pattern.

        How to inject the namespace into an object is up to the developer or another
        library since there are multiple possibilities. This classification just adds
        the placeholder for the namespace object.

        The namespace can be locked as well to avoid a further switch of it to a
        different one:

            requestHandler.setNamespace(namespace)
            requestHandler.lockNamespace()

        Once a namespace is locked on an object the object does not accept the method

            requestHandler.setNamespace(namespace)

        any more and will throw a LockedNamespaceError if the method is called.

        Locking the namespace does not freeze the namespace method itself, which could
        still be changed. It just avoids setting a different namespace object.

        Freezing the namespace object should be done in a different part of the program
        and is up to the developer or to another library.
    `)
*/
class ObjectWithNamespace {
    // Definition

    static definition() {
        this.instanceVariables = ['namespace']
    }

    /*
        Method(`
            Returns the current namespace of this object.
            The namespace object can be anything.
        `)
    */
    namespace() {
        return this.namespace
    }

    /*
        Method(`
            Set the current namespace to this object.
            The namespace object can be anything.
        `)
    */
    setNamespace(namespace) {
        this.namespace = namespace
    }

    /*
        Method(`
            Returns true if the namespace is locked in this object.

            If it is locked it will throw a LockedNamespaceError on a new
            call to

                this.setNamespace(namespace).
        `)

        Implementation(`
            This method returns always false because of the implemetation used to lock
            the namespace.

            See the comment in the lockNamespace() method.
        `)
    */
    namespaceIsLocked() {
        return false
    }

    /*
        Method(`
            Locks the namespace in this object.
            After

                this.lockNamespace()

            this object will throw a LockedNamespaceError on a new call to

                this.setNamespace(namespace).
        `)

        Implementation(`
            The locking of this object namespace is done replacing this classification
            by a ObjectWithLockedNamespace classification preserving the current
            ObjectWithNamespace.namespace object.

            ObjectWithLockedNamespace does not provide a method to set the namespace
            instance variable (although it could still be changed accessing the low
            level API of the Classification unless somehow it is locked too).

            However it discourage to assume that this implementation of the locking
            mechanism will remain the same.
        `)
    */
    lockNamespace() {
        this.behaveAs( ObjectWithLockedNamespace )

        this.dropBehaviour( this.thisClassification )
    }
}

/*
    Class(`
        This classification is used to lock the namespace on an object behaving as
        a ObjectWithNamespace.

        When the ObjectWithNamespace locks it namespace first it attaches this
        Classification and later it drops the ObjectWithNamespace classification.

        From there on the namespace of the object is held by this ObjectWithLockedNamespace
        classification that has no method to change it to a different one.
    `)
*/
class ObjectWithLockedNamespace {
    static definition() {
        this.instanceVariables = ['lockedNamespace']
    }

    /*
        Method(`
            Get the namespace from the previous ObjectWithNamespace classification
            and keep it in the 'lockedNamespace' instance variable.
        `)
    */
    afterInstantiation() {
        let namespace

        this.previousClassificationDo( () => {
            namespace = this.namespace()
        })

        this.lockedNamespace = namespace
    }

    /*
        Method(`
            Returns the current namespace of this object.
            The namespace object can be anything.
        `)
    */
    namespace() {
        return this.lockedNamespace
    }

    /*
        Method(`
            Throws a LockedNamespaceError since this classification locks the namespace.
        `)
    */
    setNamespace(namespace) {
        throw new LockedNamespaceError('Can not set the namespace after locking it')
    }

    /*
        Method(`
            Returns true if the namespace is locked in this object.

            If it is locked it will throw a LockedNamespaceError on a new
            call to

                this.setNamespace(namespace).
        `)

        Implementation(`
            This method returns always true because of the implemetation used to lock
            the namespace.

            See the comment in the lockNamespace() method.
        `)
    */
    namespaceIsLocked() {
        return true
    }

    /*
        Method(`
            Does nothing since this classification already locks the namespace.
        `)
    */
    lockNamespace() {
    }
}

ObjectWithLockedNamespace = Classification.define(ObjectWithLockedNamespace)

module.exports = Classification.define(ObjectWithNamespace)