'use strict'

const fs = require('fs')
const yaml = require('yamljs')

/**
 * Sets an environment variable (stores 2 version; one lowercased & the other uppercased)
 *
 * @param {string} key
 * @param {string} value
 */
const set = (key, value) => {
  process.env[key.toLowerCase()] = value
  process.env[key.toUpperCase()] = value
}

/**
 * Reads the .env.yml file and assigns all the keys to the process.env object
 * Raises an error if the file env.yml does not exist
 */
fs.readFile('./env.yml', 'utf8', (err, data) => {
  if (err) {
    throw new Error('Barricade: the file env.yml does not exist. Please create one at the root of your application.')
  }

  // Parse the YAML file
  const env = yaml.parse(data)

  // Loop through the YAML file and assign each variable to the process.env object
  for (const prop in env) {
    if (Object.prototype.hasOwnProperty.call(env, prop)) {
      if (typeof env[prop] !== 'object') {
        set(prop, env[prop])
      } else if (typeof env[prop] === 'object' && prop === process.env.NODE_ENV) {
        for (const prop2 in env[prop]) {
          if (Object.prototype.hasOwnProperty.call(env[prop], prop2)) {
            set(prop2, env[prop][prop2])
          }
        }
      }
    }
  }
})
