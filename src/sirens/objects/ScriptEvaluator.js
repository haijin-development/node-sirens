function codeEvaluator(script){
    return eval(script)
}

class ScriptEvaluator {

    static evaluate({ thisObject: thisObject, script: script }) {

        let evaluationResult = null

        try {
            evaluationResult = codeEvaluator.call( thisObject, script )
        } catch (e) {
            evaluationResult = {
                error: e,
                erroCode: e.errorCode,
                message: e.message,
                stack: e.stack,
                info: e.info,
            }

            if( e.message === undefined ) {
                e.message = e.toString()
            }
        }

        return evaluationResult
    }
}

module.exports = ScriptEvaluator
