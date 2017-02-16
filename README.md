# psi-ngrok [![Build Status](https://travis-ci.org/denar90/psi-ngrok.svg?branch=master)](https://travis-ci.org/denar90/psi-ngrok)
> PageSpeed Insights with local project

Uses [psi](https://github.com/addyosmani/psi) and [ngrok](https://github.com/inconshreveable/ngrok) for running PageSpeed Insights
for locally run web application.

Inspired by 
 - [@addyosmany](https://github.com/addyosmani)'s [psi](https://github.com/addyosmani/psi)
 - [Grunt Local PSI](http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/)
 - [Gulp Local PSI](https://una.im/gulp-local-psi/)

## Install

```
$ npm install --save-dev psi-ngrok
```


## Usage

```js
const psiNgrok = require('psi-ngrok');

psiNgrok();
```

### Usage with configuration

```js
const psiNgrok = require('psi-ngrok');

const config = {
  pages: ['page1.html', 'page2.html'],
  onBeforeConnect: function() {
    // do somtheng before ngrok is connected to your host
  },
  //called if page passed `threshold` limit
  onSuccess: function(data) {
    console.log(data); // all PSI data about page
  },
  //called if page didn't pass `threshold` limit
  onError: function(error) {
    console.log(error); // error message
  },
  options: {
    threshold: 85
  }
};

psiNgrok(config);
```

Also look at [recipes](/recipes).

## Usage with Grunt

Here example of using `psi-ngrok` with [grunt-connect](https://github.com/gruntjs/grunt-contrib-connect)

```js

var psiNgrok = require('psi-ngrok');

module.exports = function(grunt) {

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8000,
          base: 'public'
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('pagespeed', function() {
    var async = this.async;

    grunt.event.once('connect.server.listening', function(host, port) {
      psiNgrok({
        port: port,
        pages: ['index.html', 'slow.html'],
        onError: function(error) {
          grunt.fatal(error);
        },
        options: {
          threshold: 80
        }
      }).then(async());
    });
  });

  grunt.registerTask('default', ['pagespeed', 'connect:server:keepalive']);
};

```

#### Want to test it?

Run
  - `git clone https://github.com/denar90/psi-ngrok && cd psi-ngrok && npm i`
  - `npm run grunt-example`
  

## Usage with Gulp

Here example of using `psi-ngrok` with [gulp-connect](https://github.com/avevlad/gulp-connect)

```js

var gulp = require('gulp');
var connect = require('gulp-connect');
var psiNgrok = require('psi-ngrok');
var port = 8000;

var connectServer = function() {
  return connect.server({
    root: 'public',
    port: port
  });
};

function handleError(err) {
  console.log(err.toString());
  process.exit(-1);
}

gulp.task('pagespeed', function () {
  psiNgrok({
    pages: ['index.html', 'slow.html'],
    port: port,
    onBeforeConnect: connectServer,
    onError: handleError,
    options: {
      threshold: 80
    }
  });
});

gulp.task('default', ['pagespeed']);

```

#### Want to test it?

Run
  - `git clone https://github.com/denar90/psi-ngrok && cd psi-ngrok && npm i`
  - `npm run gulp-example`

## API

### psiNgrok([config])

Returns a promise for the response data from Google PageSpeed Insights for pages run locally.

#### config

Type: `object`

##### strategies

Type: `array` <br>
Default: ['mobile', 'desktop'] <br>
Values: `mobile`, `desktop`

Strategies to use when analyzing the page.

##### pages

Type: `array` <br>
Default: ['/'] <br>

List of local pages which will be analyzed.

##### port

Type: `number` <br>
Default: 8000 <br>

Port local server running at.

##### onBeforeConnect

Type: `function` <br>
Default: Function.prototype <br>

Function called before `ngrok` is started.
> Useful for running local server.

##### onSuccess

Type: `function` <br>
Default: Function.prototype <br>

Function called each time page(s) passed `threshold` limit. Has `data` argument which consist of all PSI data about page.

##### onError

Type: `function` <br>
Default: Function.prototype <br>

Function called each time page(s) didn't pass `threshold` limit. Has `error` argument - message about what went wrong.

#### options

Type: `object`

> Pretty the same as [psi options](https://github.com/addyosmani/psi#options)

###### key

Type: `string`<br>
Default: Free tier

When using this module for a production-level build process, registering for an API key from the [Google Developer Console](https://developers.google.com/speed/docs/insights/v1/getting_started#auth) is recommended.

###### locale

Type: `string`<br>
Default: `en_US`

Locale results should be generated in.

###### threshold

Type: `number`<br>
Default: `70`

Threshold score to pass the PageSpeed test. Useful for setting a performance budget.


MIT © [Artem Denysov](https://github.com/denar90)




