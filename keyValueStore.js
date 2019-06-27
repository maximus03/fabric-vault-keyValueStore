
const debug = require('debug')('VaultKVS');
const fetch = require('node-fetch');

module.exports = class VaultKVS {
  constructor(options) {
    debug('Enter Constructor, options are %j', options);
    if (!options.apiVersion) {
      throw new Error('Missing Required apiVersion in options');
    }
    if (!options.endpoint) {
      throw new Error('Missing Required endpoint in options');
    }
    this.endpoint = options.endpoint;
    this.token = options.token
    this.apiVersion = options.apiVersion

    if (!options.token) {
      throw new Error('Missing Required token in options');
    }
    const self = this;
    return new Promise(((resolve, reject) => {
      resolve(self);
    }));
  }


  getValue(name) {
    let url = this.endpoint + '/' + this.apiVersion + '/secret/' + name
    return new Promise((resolve,reject) => {
      return fetch(url,{
        method: 'GET',
        headers: {'X-Vault-Token': this.token}
      }).then(function(data) {
        return data.json()
      }).then(function(jsonData) {
        return resolve(jsonData.data.value)
      }).catch(function(e) {
        debug('getValue error %s', e.message);
        resolve(null)
      })
    })
  }

  setValue(name, value) {
    let url = this.endpoint + '/' + this.apiVersion + '/secret/' + name
    return new Promise((resolve,reject) => {
      return fetch(url,{
        method: 'POST',
        headers: {'X-Vault-Token': this.token,
                  'Content-Type': 'application/json'},
        body:    JSON.stringify({value: value})
      }).then(function(data) {
        return data.json()
      }).then(function(jsonData) {
        return resolve(value)
      }).catch(function(e) {
        debug('setValue error %s', e.message);
        resolve(e)
      })
    })
  }
};
