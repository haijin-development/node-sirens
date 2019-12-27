const Classification = require('../../O').Classification

/*
    Class(`
        A FLowPointFinder searches for a child FlowNode with a given id in a Flow tree.

        Since the search logic is not immediate it is isolated in a different object.
    `)
*/
class FlowPointFinder {
    /// Definition

    static definition() {
        this.instanceVariables = []
    }

    findFlowPoint({ id: flowPointId, startingAt: flowPoint }) {
        const ids = this.flowPointIdAsArray({ id: flowPointId })

        {
            const firstId = ids[0]

            const child = flowPoint.findDirectChildFlow({ id: firstId })

            if( child !== undefined ) {
                if( ids.length === 1 ) { return child }

                const remainingIds = ids.slice( 1 )

                return this.findFlowPoint({ id: remainingIds, startingAt: child })
            }
        }

        const children = flowPoint.getChildFlows()

        for( const eachChild of children ) {
            const child = this.findFlowPoint({ id: ids, startingAt: eachChild })

            if( child !== undefined ) {
                return child
            }
        }

        return undefined
    }

    flowPointIdAsArray({ id: flowPointId }) {
        return typeof(flowPointId) === 'string' ? flowPointId.split('.') : flowPointId
    }
}

module.exports = Classification.define(FlowPointFinder)