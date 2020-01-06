const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const NamespaceFlow = require('../../../../src/finger-tips/flows/NamespaceFlow')


describe('When using a NamespaceFlow', () => {
    it('defines an object creator command', () => {

        class NamespaceSample {
            static definition() {
                this.assumes = [NamespaceFlow]
            }

            buildWith(flow) {
                flow.main({ id: 'namespace' }, function(thisFlow) {

                    this.createObject({
                        id: 'AString',
                        with: function() { return 'a string' }
                    })
                })
            }
        }
        NamespaceSample = Classification.define(NamespaceSample)


        const namespace = NamespaceSample.new()

        expect( namespace.AString.new() ) .to .eql( 'a string' )
    })

    it('defines an object creator command with parameters', () => {

        class NamespaceSample {
            static definition() {
                this.assumes = [NamespaceFlow]
            }

            buildWith(flow) {
                flow.main({ id: 'namespace' }, function(thisFlow) {

                    this.createObject({
                        id: 'AString',
                        with: function(aString) { return aString.toUpperCase() }
                    })
                })
            }
        }
        NamespaceSample = Classification.define(NamespaceSample)


        const namespace = NamespaceSample.new()

        expect( namespace.AString.new( 'a string' ) ) .to .eql( 'A STRING' )
    })

    it('defines an object creator command within a group', () => {

        class NamespaceSample {
            static definition() {
                this.assumes = [NamespaceFlow]
            }

            buildWith(flow) {
                flow.main({ id: 'namespace' }, function(thisFlow) {

                    this.group('group-1', () => {
                        this.createObject({
                            id: 'AString',
                            with: function(aString) { return aString.toUpperCase() }
                        })
                    })
                })
            }
        }
        NamespaceSample = Classification.define(NamespaceSample)


        const namespace = NamespaceSample.new()

        expect( namespace.AString.new( 'a string' ) ) .to .eql( 'A STRING' )
    })

    it('defines a nested NamespaceFLow using the DSL', () => {

        class NamespaceSample {
            static definition() {
                this.assumes = [NamespaceFlow]
            }

            buildWith(flow) {
                flow.main({ id: 'namespace' }, function(thisFlow) {
                    this.namespace({ id: 'Nested' }, function() {
                        this.createObject({
                            id: 'AString',
                            with: function() { return 'a string' }
                        })
                    })
                })
            }
        }
        NamespaceSample = Classification.define(NamespaceSample)


        const namespace = NamespaceSample.new()

        expect( namespace.AString ) .not .to .be .oInstance
        expect( namespace.Nested.AString.new() ) .to .eql( 'a string' )
    })

    it('defines a nested NamespaceFLow from another NamespaceFlow', () => {

        class AnotherNamespaceFlow {
            static definition() {
                this.assumes = [NamespaceFlow]
            }

            buildWith(flow) {
                flow.main({ id: 'another-namespace' }, function(thisFlow) {
                    this.createObject({
                        id: 'AString',
                        with: function() { return 'a string' }
                    })
                })
            }
        }
        AnotherNamespaceFlow = Classification.define(AnotherNamespaceFlow)

        class NamespaceSample {
            static definition() {
                this.assumes = [NamespaceFlow]
            }

            buildWith(flow) {
                const anotherNamespace = AnotherNamespaceFlow.new()

                flow.main({ id: 'namespace' }, function(thisFlow) {
                    this.namespace({ id: 'Nested', from: anotherNamespace })
                })
            }
        }
        NamespaceSample = Classification.define(NamespaceSample)


        const namespace = NamespaceSample.new()

        expect( namespace.AString ) .not .to .be .oInstance
        expect( namespace.Nested.AString.new() ) .to .eql( 'a string' )
    })
})