const Classification = require('../../O').Classification
const EventEmitter = require('events')

class AnnouncementsSubscriptor {
    /// Definition

    static definition() {
        this.instanceVariables = ['subscriptions']
    }

    // Initializing

    afterInstantiation() {
        this.subscriptions = new Map()
    }

    getSubscriptionsTo(announcer) {
        return this.subscriptions.get(announcer)
    }

    createSubscription({ event: event, from: announcer, do: eventHandler, with: listener }) {
        const subscriptions = this.subscriptions

        if( ! subscriptions.has(announcer) ) {
            subscriptions.set( announcer, {} )
        }

        const announcerSubscriptions = this.getSubscriptionsTo(announcer)

        announcerSubscriptions[event] = eventHandler.bind( listener )
    }

    /// Subscribing

    on({ event: event, from: announcer, do: eventHandler, with: listener }) {
        this.createSubscription({
            event: event,
            from: announcer,
            do: eventHandler,
            with: listener
        })

        const announcerSubscriptions = this.getSubscriptionsTo(announcer)

        const boundEventHandler = announcerSubscriptions[event]

        announcer.on(event, boundEventHandler )
    }

    // Unsubscribinrg

    dropAllAnnouncements() {
        for( const announcer of this.subscriptions.keys() ) {
            this.dropAllAnnouncementsFrom( announcer )
        }
    }

    dropAllAnnouncementsFrom(announcer) {
        const subscriptions = this.subscriptions

        if( ! subscriptions.has(announcer) ) { return }

        const announcerSubscriptions = this.getSubscriptionsTo(announcer)

        for( const event in announcerSubscriptions ) {
            const eventHandler = announcerSubscriptions[event]

            announcer.off(event, eventHandler)
        }

        subscriptions.delete(announcer)
    }
}

module.exports = Classification.define(AnnouncementsSubscriptor)