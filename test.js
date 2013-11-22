


	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert');



	var   Passport = require('./')
		, EEPassport = require('em-passport-ee')
		, passport = new Passport()
		, eePassport = new EEPassport({ authorizationUrl: '/session' });


	var Request = new Class({
		pathname: '/session'

		, hasHeader: function(){
			return true;
		}

		, getHeader: function(){
			return 'ee 84GBA140C464234828A337D8AE8E3D3E60EFBDB5C646D83D6C83B2703B0BBA6FE10GBCABEEB0E732044GDEFA2B4CAG50D0D58AFBE6352G427E3573355A45E7D8'
		}
	});

	passport.whitelist('/session');

	var Response = new Class({


		send: function(){
			log(arguments);
		}
	});

	var request = new Request();



	eePassport.on('authorization', function(authorization, callback){
		authorization.authorized = true;
		callback();
	});

	passport.use(eePassport);

	passport.request(request, new Response(), function(){
		log(request.authorization);
	});




	


