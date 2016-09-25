'use strict';
const test = require('ava');
const Promise = require('bluebird');
const sinon = require('sinon');
const connect = require('connect');
const serveStatic = require('serve-static');
const psiNgrok = require('../index');
const PORT = 8000;
const staticFolder = 'fixtures';

const onBeforeConnect = sinon.spy();
const onSuccess = sinon.spy();
const onError = sinon.spy();

let config = {
  strategies: ['mobile', 'desktop'],
  pages: ['index.html', 'slow_2.html'],
  onBeforeConnect: onBeforeConnect,
  onSuccess: onSuccess,
  onError: onError,
  port: PORT,
  options: {
    threshold: 85,
    locale: 'en_GB',
  }
};

const connectToServer = function() {
  return new Promise((resolve, reject) => {
    connect().use(serveStatic(staticFolder)).listen(PORT, resolve);
  });
};

test.before(async t => {
  await connectToServer();
  await psiNgrok(config);
});

test('onBeforeConnect should be called', t => {
  t.true(onBeforeConnect.calledOnce);
});

test('onSuccess should be called', t => {
  t.true(onSuccess.calledTwice);
});

test('onError should be called', t => {
  t.true(onError.calledTwice);
});