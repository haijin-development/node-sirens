
class OLanguageError extends Error {}

// Implementation

class MethodNotFoundError extends OLanguageError {}

class InstanceVariableNotFoundError extends OLanguageError {}

class AnotherClassificationMustImplementMethod extends OLanguageError {
    constructor(message = undefined) {
        if( message === undefined ) {
            message = 'Another classification must implement this method.'
        }

        super(message)
    }
}

// Protocols

class ProtocolError extends OLanguageError {}

// Assertions

class AssertionError extends OLanguageError {}

class AssertionCompilerError extends AssertionError {}

class FailedAssertionError extends AssertionError {}

// Namespace

class LockedNamespaceError extends OLanguageError {}



module.exports = {
    OLanguageError: OLanguageError,

    InstanceVariableNotFoundError: InstanceVariableNotFoundError,
    MethodNotFoundError: MethodNotFoundError,
    AnotherClassificationMustImplementMethod: AnotherClassificationMustImplementMethod,
    ProtocolError: ProtocolError,

    AssertionError: AssertionError,
    AssertionCompilerError: AssertionCompilerError,
    FailedAssertionError: FailedAssertionError,

    LockedNamespaceError: LockedNamespaceError,
}