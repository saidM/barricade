# Barricade

[![Build Status](https://travis-ci.org/saidM/barricade.svg?branch=master)](https://travis-ci.org/saidM/barricade) [![NPM Downloads](https://img.shields.io/npm/dt/barricade.svg)](https://www.npmjs.com/package/barricade) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/saidM/barricade) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/saidM/barricade)

[![NPM](https://nodei.co/npm/barricade.png?downloads=true)](https://nodei.co/npm/barricade)

Barricade is a small library that allows you to setup environment variable from a single `env.yml` file. It parses the YAML file and loads all of the configuration values into the `process.env` object.

It has built-in support for multiple NODE_ENV.

## Installation

    npm install --save barricade

## Usage

Add the following line at the top of your application JS file:

```javascript
 require('barricade')
 ```
 
The library expects a YAML file (`env.yml`) at the root of your application. Given the following YAML file:

```yaml
# env.yml

APP_SECRET: hello_world
STRIPE_SECRET_KEY: secret_key_for_both_development_and_test

production:
    STRIPE_SECRET_KEY: secret_key_used_only_in_production
````

You can then start your application and access those values from the `process.env` object. Example:

```javascript
// index.js

require('barricade')

console.log(process.env.APP_SECRET) // hello_world
console.log(process.env.STRIPE_SECRET_KEY) // secret_key_for_both_development_and_test

// Switch the Node environment to production
process.env.NODE_ENV = 'production'

console.log(process.env.STRIPE_SECRET_KEY) // secret_key_used_only_in_production
```

## Licence

MIT
