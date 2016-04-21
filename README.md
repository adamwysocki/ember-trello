# Ember Trello

[ ![Codeship Status for adamwysocki/ember-trello](https://codeship.com/projects/7b8d1db0-e932-0133-4de9-226489e381a7/status?branch=master)](https://codeship.com/projects/147492)

This addon allows you to quickly and effortlessly integrate the Trello API into your Ember application.

Note: This project is still in a pre-stable (1.0.0) release. Not all functionality is supported, but basic board, label, list, and card CRUD API's are stable. Additional features coming ...

## Usage

First, and most importantly, make sure to register for a Trello application key: https://trello.com/app-key

Then, install this addon:

```shell
ember install ember-trello
```

In your config/envrironment.js file add your Trello application key:

```javascript
ENV.emberTrello = {
  key: '<your-trello-app-key>'
};
```

You will also probably want to update your content security policy (CSP):

```javascript
ENV.contentSecurityPolicy = {
  'script-src': "'self' 'unsafe-inline' https://*.trello.com http://localhost:4200",
  'connect-src': "'self' https://*.trello.com",
  'img-src': "'self' https://*.trello.com"
};
```

## Installation

* `git clone` this repository
* `cd ember-trello`
* `npm-intall -g ember-cli`
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
