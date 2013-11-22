# em-passport

Authorization middleware for ee-webservice

## installation

	npm install em-passport

## API

The passport middleware provides a authorization framework. It does not validate authorizations itself but it does rely on other middleware which is able to work with ee-passport api.

### Contructor

The consturcotr takes no options.

	var Passport = require('em-passport');
	var myPassport = new Passport();

### Use() Method

The use method accepts em-passport compatible middleware. Em-Compatible middleware must expose a request() method which takes the arguments «request», «response» and «next».

***example of a passport middleware which accepts all request execpt requests on /yeah***

	var MyPassportMiddleware = new Class({

		init: function(){
			// set up your stuff
		}

		, request: function(request, response, next){
			if(request.pathname === "/yeah") response.send(401);
			else {
				requests.authorization.authorized = true;
				next();
			}
		}
	});

	passport.use(new MyPassportMiddleware());

### Whitelist() Method;

Using the whitelist method you can whitelist some urls with specific methods, headers and ip ranges which schould not be authorized but also not be rejected.

## example

example of the passport middleware and the ee-passport middleware

	var   Passport 		= require('em-passport')
		, EEPassport 	= require('em-passport-ee');


	var passport = new Passport();

	var eePassport = new EEPassport({ authorizationUrl: '/session' });

	// you have to check yourself if the authroization is valid
	eePassport.on('authorization', function(authorization, finished){
		new this.db.session({ token: authorization}).exec(function(err, session){
			authorization.authorized = session && !session.valid;
			callback();
		});
	});


	// no authorization for this url & this method
	passport.whitelist('/session', { method: 'POST' });

	// let the passport middleware use the ee passport
	passport.use(session);

	// let the webservice use the passport middleware
	webservice.use(passport);