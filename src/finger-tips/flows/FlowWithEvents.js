const Classification = require('../../O').Classification

/*
    Class(`
        A FlowNode only has an id and a CommandsController.

        This classification adds to a FlowNode the behavior to trigger events.

        Some leaf nodes in a Flow tree may not need or want to announce events
        therefore the FlowNode does not assume it by default.


        A FlowNode mechanism to trigger events is not immediate like in js .emit()
        function.

        Before notifying events to objects outside the Flow tree the whole Flow tree
        itself must be fully updated and only then other objects should be notified 
        of the events.

        This is to ensure that when an object from outside the Flow tree receives a
        announcement of an event it can query any NodeFlow in the tree or execute
        a Command and the Flow tree will be in a consistent state.

        For this reason when a FlowNode wants to announce an event the announcement
        is queued as a pending announcement until the flow finishes updating itself.

        Once the flow finishes its own update it process all the pending announcements.
    `)
*/
class FlowWithEvents {
    /// Definition

    static definition() {
        this.instanceVariables = ['pendingEvents']
    }

    /// Initializing

    afterInstantiation() {
        this.pendingEvents = new Map()
    }

    releaseFlow() {
        this.previousClassificationDo( () => {
            this.releaseFlow()
        })

        this.pendingEvents = new Map()
    }

    // Events

    addPendingEvent({ event: eventName, params: params }) {
        this.pendingEvents.set(
            eventName,
            {
                event: eventName,
                params: params
            }
        )
    }

    clearPendingEvents() {
        this.pendingEvents.clear()
    }

    processPendingEvents() {
        this.pendingEvents.forEach( (pendingEvent, eventName) => {
            this.processPendingEvent(pendingEvent)
        })

        this.clearPendingEvents()
    }

    processPendingEvent({ event: eventName, params: params }) {
        this.emit(eventName, params)
    }
}

module.exports = Classification.define(FlowWithEvents)