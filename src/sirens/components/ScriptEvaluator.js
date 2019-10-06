class ScriptEvaluator {

    static evaluate({ thisObject: thisObject, script: script }) {

        const codeEvaluator = function(){
            return eval(script)
        }

        let evaluationResult = null

        try {
            evaluationResult = codeEvaluator.call( thisObject )
        } catch (e) {
            evaluationResult = e
        }

        return evaluationResult
    }
}

module.exports = ScriptEvaluator
