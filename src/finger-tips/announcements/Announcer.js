const Classification = require('../../O').Classification
const EventEmitter = require('events')

class Announcer extends EventEmitter {
    /// Definition

    static definition() {
        this.instanceVariables = ['_events', '_eventsCount', 'subscriptions']
    }

    // Initializing

    afterInstantiation() {
        this.subscriptions = new WeakMap()
    }

    // Listeners

    subscribe({ event: event, to: listener, doing: eventHandler }) {
        this.createSubscription({ event: event, to: listener, eventHandler: eventHandler })

        const boundEventHandler = this.subscriptions.get(listener)[event]

        this.on( event, boundEventHandler )
    }

    createSubscription({ event: event, to: listener, eventHandler: eventHandler }) {
        const subscriptions = this.subscriptions

        if( ! subscriptions.has(listener) ) {
            subscriptions.set( listener, {} )
        }

        subscriptions.get(listener)[event] = eventHandler.bind( listener )
    }

    // Announcing

    announce({ event: event, with: announcement }) {
        this.emit(event, announcement)
    }

    // Unsubscribing announcements

    dropAllAnnouncementsFor({ listener: listener }) {
        const subscriptions = this.subscriptions

        if( ! subscriptions.has(listener) ) { return }

        const listenerSubscriptions = subscriptions.get(listener)

        for( const event in listenerSubscriptions ) {
            const eventHandler = listenerSubscriptions[event]

            this.off(event, eventHandler)
        }

        subscriptions.delete(listener)
    }

    dropAllAnnouncementsForAllListeners() {
        this.subscriptions = new WeakMap()
    }
}

module.exports = Classification.define(Announcer)