const path = require('path')

class Sample {
    getName() {
        return this.name
    }

    setName(name) {
        this.name = name
    }

    setNameAndLastName({ name: name, lastName: lastName }) {
        this.name = name
        this.lastName = lastName
    }

    nameAndLastNameDo({ name: name, lastName: lastName }, closure) {
        closure(name, lastName)
    }

    format(name, ...params) {
    }
}

module.exports = Sample