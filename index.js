'use strict';
const psi = require('psi');
const ngrok = require('ngrok');
const url = require('url');

let config = {
  strategies: ['mobile', 'desktop'],
  pages: ['/'],
  onBeforeConnect: Function.prototype,
  onSuccess: Function.prototype,
  onError: Function.prototype,
  port: 8000,
  options: {}
};

const psiNgrok = function() {
  return Promise.resolve()
    .then(() => {
      return Promise.resolve().then(config.onBeforeConnect);
    })
    .then(ngrokConnect)
    .then(runPSIWithStrategy)
    .then(() => { ngrok.kill() });
};

const ngrokConnect = function() {
  return new Promise((resolve, reject) => {
    ngrok.connect(config.port, (err, url) => {
      if (err !== null) {
        reject(err);
      }

      config.url = url;
      resolve(url);
    });
  });
};

const runPSIWithStrategy = function() {
  return Promise.all(config.strategies.map(strategy => {
    return runPSI(Object.assign({strategy: strategy}, config.options));
  }));
};

const runPSI = function(options) {
  return Promise.all(config.pages.map(page => {
    return psi.output(url.resolve(config.url, page), options).then((data) => {
      config.onSuccess(data);
    }).catch(err => {
      config.onError(err.message);
    });
  }));
};

module.exports = function(params) {
  Object.assign(config, params);

  return psiNgrok();
};