const path = require('path')

/*
    A previous comment, not the class comment.
*/

/*
 * A class comment
 * for Sample.
 */
class Sample {
    /* 13 123 123 */
    getName() {
        return this.name
    }
}

function modFunction() {
    return 'A standalone function'
}

class AnotherSample {
    constructor() {
        this.name = ''
    }
}

module.exports = Sample