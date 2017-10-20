'use strict'

const fs = require('fs')

const expect = require('chai').expect
const yaml = require('yamljs')

describe('Barricade', () => {
  beforeEach(() => {
    // Empty the require.cache before each test runs
    Object.keys(require.cache).forEach(key => delete require.cache[key])

    // Unset the env variable also
    delete process.env.FOO
  })

  it('raises an error if the file env.yml does not exist', () => {
    fs.readFile = (filename, encoding, cb) => cb('file does not exist')

    expect(() => {
      require('../index')
    }).to.throw()
  })

  it('assigns the file content to the process.ENV object', () => {
    // Mock the .env.yml file
    fs.readFile = (filename, encoding, cb) => cb(null, yaml.stringify({foo: 'bar'}, 2))

    // Re-load the file
    require('../index')
    expect(process.env.FOO).to.equal('bar')
  })

  it('parses the file content based on the NODE_ENV', () => {
    // Second one should overwrite the first one
    fs.readFile = (filename, encoding, cb) => cb(null, yaml.stringify({foo: 'bar'}, 2))
    fs.readFile = (filename, encoding, cb) => cb(null, yaml.stringify({test: {foo: 'test_bar'}}, 2))
    require('../index')

    expect(process.env.FOO).to.equal('test_bar')
  })

  it('transforms all the keys to the uppercase format', () => {
    fs.readFile = (filename, encoding, cb) => cb(null, yaml.stringify({Foo: 'bar'}, 2))
    require('../index')

    expect(process.env.FOO).to.equal('bar')
    expect(process.env.Foo).to.be.undefined
  })

  it('works with the lowercase version of the variable name', () => {
    fs.readFile = (filename, encoding, cb) => cb(null, yaml.stringify({foo: 'bar'}, 2))
    require('../index')

    expect(process.env.FOO).to.equal('bar')
    expect(process.env.foo).to.equal('bar')
  })
})
