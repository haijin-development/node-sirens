
class OLanguageError extends Error {}

class MethodNotFoundError extends OLanguageError {}

class InstanceVariableNotFoundError extends OLanguageError {}

class ProtocolError extends OLanguageError {}

class AssertionError extends OLanguageError {}

class AssertionCompilerError extends AssertionError {}

class FailedAssertionError extends AssertionError {}

module.exports = {
    OLanguageError: OLanguageError,
    InstanceVariableNotFoundError: InstanceVariableNotFoundError,
    MethodNotFoundError: MethodNotFoundError,
    ProtocolError: ProtocolError,
    AssertionError: AssertionError,
    AssertionCompilerError: AssertionCompilerError,
    FailedAssertionError: FailedAssertionError,
}