const path = require('path')

/*
    A previous comment, not the class comment.
*/

/*
    Method(`
        A class comment
        for Sample.
    `)
 */
class Sample {
    getName() {
        return this.name
    }
}

/*
    Method(`
        A method description.
    `)
*/
function modFunction() {
    return 'A standalone function'
}

class AnotherSample {
    constructor() {
        this.name = ''
    }
}

module.exports = Sample