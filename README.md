# Google reCAPTCHA V2 for Meteor

This package implements the version 2 of Google reCAPTCHA.

Google reCAPTCHA is a free CAPTCHA service that protects your site against spam, malicious registrations and other
forms of attacks where computers try to disguise themselves as a human. In addition to protecting your site, reCAPTCHA
also helps digitize old books and newspapers.

Google reCAPTCHA documentation is available at https://developers.google.com/recaptcha

You will need to sign up for an API key at https://www.google.com/recaptcha/admin

This implementation is based on appshore's verison [https://github.com/appshore/Meteor-reCAPTCHA].

## Installation

``` sh
$ meteor add bratanon:recaptcha
```

## Setup

###On The Client

Add your reCAPTCHA public key (from Google) to the package. Do this in client-side code.

``` javascript
Meteor.startup(function() {
    reCAPTCHA.config({
        sitekey: 'your_sitekey_key_from_google'
    });
});
```

#### Other config settings

See

 * https://developers.google.com/recaptcha/docs/display#render_param
 * https://developers.google.com/recaptcha/docs/display#js_param

###On The Server

Add your reCAPTCHA private key (from Google) to the package. Do this in server-only code (not just an 'isServer' block)
to keep your key secret.

``` javascript
Meteor.startup(function() {
    reCAPTCHA.config({
        privatekey: 'your_private_key_from_google'
    });
});
```

## Usage

###On The Client

Include the `{{> reCAPTCHA widget_id="captcha_widget_id"}}` template block in your form template.

``` html
<template name="myTemplate">
    <form>
    	<!-- your form fields... -->

    	{{> reCAPTCHA widget_id="captcha_widget_id"}}

    	<button type="submit">Submit</button>
    </form>
</template>
```

In your submit event, include the reCAPTCHA data in your method call.

``` javascript
Template.myTemplate.events({
    'submit form': function(evt) {
        evt.preventDefault();

        var formData = {
            //get the data from your form fields
            ...

            // and the recaptcha response
            recaptcha: reCAPTCHA.getResponse("captcha_widget_id")
        };

        Meteor.call('formSubmissionMethod', formData, function (error, result) {
            console.log('result: ', error, result);
        });

        // If the page is not redirected, and the user can submit the same form again you have to reset the captcha
        // widget.
        reCAPTCHA.reset("captcha_widget_id");
    }
});
```

###On The Server

In the server method, pass the captcha data and the user's IP address to `reCAPTCHA.verifyCaptcha(clientIP, captchaData)` to verify that the user entered the correct text.

``` javascript
Meteor.methods({
    formSubmissionMethod: function(formData) {
        if(!reCAPTCHA.verifyCaptcha(this.connection.clientAddress, nomination.recaptcha)) {
            throw new Meteor.Error(400, "Are you really a robot?");
        }

        //do stuff with your formData
    }
});
```