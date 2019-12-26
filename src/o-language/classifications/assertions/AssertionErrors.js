class AssertionError extends Error {
}

class AssertionCompilerError extends AssertionError {
}

class FailedAssertionError extends AssertionError {
}

module.exports = {
	AssertionError: AssertionError,
	AssertionCompilerError: AssertionCompilerError,
    FailedAssertionError: FailedAssertionError,
}