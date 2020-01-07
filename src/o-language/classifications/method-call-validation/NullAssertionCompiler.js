const Classification = require('../Classification')

/*
    Class(`
        This object receives any method call and does nothing except returning itself.

        It can be used as an implementation mechanism to ignore without raising an error
        a chain of sent message calls.

                NullAssertionCompiler().new()
                    .message()
                    .anotherMessage()

        This object behavior is similar to the one that NaN implements in javascript.
    `)

    Implementation(`
        Although this classification could be renamed to a more generic name and moved
        to the o-language classifications folder it is not recommended to.

        The use of implementation mechanisms like NaN and null objects usually masks
        errors and defers the manifestation of the error until later in the program
        execution, making it difficult to find the source of the error.
    `)
*/
class NullAssertionCompiler {
    static definition() {
        this.instanceVariables = []
    }

    /*
        Method(`
            Cancels the actual method call.
        `)
    */
    beforeMethod({ methodName: methodName, params: params, classification: classification }) {
        return {
            callMethod: null,
        }
    }

    /*
        Method(`
            Returns this obejct.
        `)
    */
    afterMethod({ methodName: methodName, params: params, classification: classification }) {
        return {
            callResult: this,
        }
    }
}

module.exports = Classification.define(NullAssertionCompiler)
