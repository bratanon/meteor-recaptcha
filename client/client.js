/**
 * Google reCAPTCHA 2 for Meteor
 *
 * By BratAnon
 * https://github.com/bratanon/meteor-recaptcha
 */
reCAPTCHA = {
  // API and render parameters.
  // See https://developers.google.com/recaptcha/docs/display#render_param
  // See https://developers.google.com/recaptcha/docs/display#js_param
  settings: {},

  // A collection of active widgets.
  widgets: {},

  config: function(settings) {
    return _.extend(this.settings, settings);
  },

  reset: function (widget_id) {
    if (widget_id !== undefined) {
      grecaptcha.reset(this.widgets[widget_id]);
    }
    else {
      grecaptcha.reset();
    }
  },

  getResponse: function (widget_id) {
    if (widget_id !== undefined) {
      return grecaptcha.getResponse(this.widgets[widget_id]);
    }
    else {
      return grecaptcha.getResponse();
    }
  }
};

window.onloadcaptcha = function() {
  // Render the captcha widget.
  _.each(reCAPTCHA.widgets, function(element, index, list) {
    // Clear the loading text in the placeholder template.
    $("#" + index).empty();
    reCAPTCHA.widgets[index] = grecaptcha.render(index, reCAPTCHA.settings);
  });
};

Template.reCAPTCHA.onCreated(function () {
  var dataContext = Template.currentData();

  if (dataContext.widget_id === undefined) {
    throw new Meteor.Error("reCAPTCHA_WIDGET_ERROR", "Widget missing widget_id.");
  }

  // Register the widget_id with a null value.
  reCAPTCHA.widgets[dataContext.widget_id] = null;
});

Template.reCAPTCHA.onDestroyed(function () {
  var dataContext = Template.currentData();
  // Unregister the widget_id.
  delete reCAPTCHA.widgets[dataContext.widget_id];
});

Template.reCAPTCHA.onRendered(function() {
  var uri = "//www.google.com/recaptcha/api.js";

  if (reCAPTCHA.settings.onload !== undefined) {
    uri += "?onload=" + reCAPTCHA.settings.onload;
  }
  else {
    uri += "?onload=onloadcaptcha";
  }

  if (reCAPTCHA.settings.render !== undefined) {
    uri += "&render=" + reCAPTCHA.settings.render;
  }
  else {
    uri += "&render=explicit";
  }

  // See https://developers.google.com/recaptcha/docs/language for language options.
  if (reCAPTCHA.settings.hl !== undefined) {
    uri += "&hl=" + reCAPTCHA.settings.hl;
  }

  $.ajax({
    url: uri,
    dataType: "script",
    cache: true
  });
});
