'use strict2'

const expect  = require('chai').expect,
      fs      = require('fs'),
      yaml    = require('yamljs')

describe('Barricade', () => {
  beforeEach(() => {
    // Empty the require.cache before each test runs
    Object.keys(require.cache).forEach(key => delete require.cache[key])
   
   // Unset the env variable also
    delete process.env.FOO
  })

  it('raises an error if the file env.yml does not exist', () => {
    fs.readFile = (filename, encoding, cb) => cb('file does not exist')

    expect(function() {
      require('../index')
    }).to.throw()
  })

  it('assigns the file content to the process.ENV object', () => {
    expect(process.env.FOO).to.be.undefined

    // Mock the .env.yml file
    fs.readFile = (filename, encoding, cb) => cb(null, yaml.stringify({foo: 'bar'}, 2))

    // Re-load the file
    require('../index')
    expect(process.env.FOO).to.equal('bar')
  })

  it('parses the file content based on the NODE_ENV', () => {
    expect(process.env.FOO).to.be.undefined

    // Second one should overwrite the first one
    fs.readFile = (filename, encoding, cb) => cb(null, yaml.stringify({foo: 'bar'}, 2))
    fs.readFile = (filename, encoding, cb) => cb(null, yaml.stringify({test: {foo: 'test_bar'}}, 2))
    require('../index')

    expect(process.env.FOO).to.equal('test_bar')
  })

  it('transforms all the keys to the uppercase format', () => {
    expect(process.env.FOO).to.be.undefined

    fs.readFile = (filename, encoding, cb) => cb(null, yaml.stringify({Foo: 'bar'}, 2))
    require('../index')

    expect(process.env.FOO).to.equal('bar')
    expect(process.env.Foo).to.be.undefined
  })

  it('works with the lowercase version of the variable name', () => {
    expect(process.env.FOO).to.be.undefined

    fs.readFile = (filename, encoding, cb) => cb(null, yaml.stringify({foo: 'bar'}, 2))
    require('../index')

    expect(process.env.FOO).to.equal('bar')
    expect(process.env.foo).to.equal('bar')
  })
})
