const path = require('path')

    function getName() {
        return this.name
    }

    function setName(name) {
        this.name = name
    }

    function setNameAndLastName({ name: name, lastName: lastName }) {
        this.name = name
        this.lastName = lastName
    }

    function nameAndLastNameDo({ name: name, lastName: lastName }, closure) {
        closure(name, lastName)
    }

    function format(name, ...params) {
    }

module.exports = getName