const expect = require('chai').expect
const ObjectWithNamespace = require('../../../../src/O').ObjectWithNamespace
const Errors = require('../../../../src/O').Errors

class Shape {}

describe('When using an ObjectWithNamespace', () => {
    it('sets a namespace', () => {
        const object = ObjectWithNamespace.new()

        object.setNamespace({ Shape: Shape })

        const namespace = object.namespace()

        expect( namespace.Shape ) .to .equal( Shape )
    })

    it('returns false to namespaceIsLocked', () => {
        const object = ObjectWithNamespace.new()

        expect( object.namespaceIsLocked() ) .to .be .false
    })

    describe('when locking the namespace', () => {
        it('returns true to namespaceIsLocked', () => {
            const object = ObjectWithNamespace.new()

            object.lockNamespace()

            expect( object.namespaceIsLocked() ) .to .be .true
        })

        it('gets the namespace set before locking it', () => {
            const object = ObjectWithNamespace.new()

            object.setNamespace({ Shape: Shape })

            object.lockNamespace()

            const namespace = object.namespace()

            expect( namespace.Shape ) .to .equal( Shape )
        })

        it('raises and error when trying to set the namespace', () => {
            const object = ObjectWithNamespace.new()

            object.setNamespace({ Shape: Shape })

            object.lockNamespace()

            expect( () => {
                object.setNamespace({ Shape: Shape })
            }).to .raise({
                error: Errors.LockedNamespaceError,
                withMessage: 'Can not set the namespace after locking it',
            })
        })

        it('gets the namespace set before try to set it again', () => {
            const object = ObjectWithNamespace.new()

            object.setNamespace({ Shape: Shape })

            object.lockNamespace()

            try {
                object.setNamespace({ Shape: Shape })
            } catch(error) {
            }

            const namespace = object.namespace()

            expect( namespace.Shape ) .to .equal( Shape )
        })
    })
})