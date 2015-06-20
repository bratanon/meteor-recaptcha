/**
 * Google reCAPTCHA 2 for Meteor
 *
 * By BratAnon
 * https://github.com/bratanon/meteor-recaptcha
 */
reCAPTCHA = {
  settings: {},

  config: function(settings) {
    return _.extend(this.settings, settings);
  },

  verifyCaptcha: function(clientIP, response) {
    var captcha_data = {
      privatekey: this.settings.privatekey,
      remoteip: clientIP,
      response: response
    };

    var serialized_captcha_data =
    "secret=" + captcha_data.privatekey +
    "&remoteip=" + captcha_data.remoteip +
    "&response=" + captcha_data.response;

    try {
      var captchaResponse = HTTP.post("https://www.google.com/recaptcha/api/siteverify", {
        content: serialized_captcha_data.toString("utf8"),
        headers: {
          'Content-Type': "application/x-www-form-urlencoded",
          'Content-Length': serialized_captcha_data.length
        }
      });
    }
    catch (e) {
      console.log("Captcha exception", e);
      return {
        'success': false,
        'error-codes': "reCaptcha service not available"
      };
    }

    if(captchaResponse.data.success === false){
      console.log(Meteor.Error("reCAPTCHA_ERROR", reCaptchaMessage(captchaResponse.data["error-codes"][0])));
      return false;
    }

    return true;
  }
};

var reCaptchaMessage = function (error_code) {
  var codes = {
    "missing-input-secret": "The secret parameter is missing.",
    "invalid-input-secret": "The secret parameter is invalid or malformed.",
    "missing-input-response": "The response parameter is missing.",
    "invalid-input-response": "The response parameter is invalid or malformed."
  };

  return codes[error_code];
};
