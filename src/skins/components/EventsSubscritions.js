const Classification = require('../../O').Classification

class EventsSubscritions {
    /// Definition

    static definition() {
        this.instanceVariables = ['announcers']
    }

    /// Initializing

    afterInstantiation() {
      this.announcers = []
    }

    addSubscriptionTo(announcer) {
      this.announcers.push(announcer)
    }

    dropAllAnnouncementsFor({ listener: listener }) {
        for( const announcer of this.announcers ) {
            this.dropSubscription({ announcer: announcer, listener: listener })
        }
    }

    dropSubscription({ announcer: announcer, listener: listener }) {
        announcer.dropAllAnnouncementsFor({ listener: listener })
    }
}

module.exports = Classification.define(EventsSubscritions)