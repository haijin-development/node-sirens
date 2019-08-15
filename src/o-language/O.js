const OInstance = require('./OInstance')

/*
 * Creates a new O instance with a OInstance already added.
 *
 * Usage
 *
 *      const object = O.new()
 *
 * instead of
 *
 *      const object = new O()
 *
 * to avoid the created object to have a default prototype since the O language sets the whole
 * prototype chain.
 */

const O = Object.create(null)

O.new = function Instance() {
    return OInstance.new()
}

module.exports = O