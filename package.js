/**
 * Google reCAPTCHA 2 for Meteor
 *
 * By BratAnon
 * https://github.com/bratanon/meteor-recaptcha
 */
Package.describe({
  name: 'bratanon:recaptcha',
  version: '0.0.1',
  summary: 'Implementation of Google reCAPTCHA V2 for Meteor',
  git: 'https://github.com/bratanon/meteor-recaptcha',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.export('reCAPTCHA');

  api.use(['templating', 'handlebars', 'jquery'], 'client');
  api.use(['http'], 'server');
  api.addFiles(['server/server.js'], 'server');
  api.addFiles(['client/client.html', 'client/client.js'], 'client');
});
