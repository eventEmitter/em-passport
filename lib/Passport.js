!function(){

	var   Class 		= require('ee-class')
		, EventEmitter 	= require('ee-event-emitter')
		, log 			= require('ee-log')
		, isIPInCIDR 	= require('cidr_match').cidr_match
		, Authorization = require('./Authorization');



	module.exports = new Class({
		inherits: EventEmitter


		// the passport middlewares
		, _middleware: []

		// whitelist hash map
		, _whitelist: {}


		/**
		 * the request() method handles requests
		 *
		 * @param <Object> request
		 * @param <Object> response
		 * @param <Function> callback
		 */
		, request: function(request, response, next){

			// add an autorization instance to the request
			request.authorization = new Authorization();

			// is the url whitelisted?
			if (this._isWhiteListed(request)) next();
			else this._check(request, response, next);
		}


		/**
		 * the _check() method checks if a request has properer
		 * authorization
		 *
		 * @param <Object> request
		 * @param <Object> response
		 * @param <Function> callback
		 * @param <Number> optional index of middleware currently working on
		 */
		, _check: function(request, response, next, index){
			index = index || 0;

			if (index < this._middleware.length) {
				this._middleware[index].request(request, response, function(){
					this._check(request, response, next, ++index);
				}.bind(this));
			}
			else next();
		}



		/**
		 * the _isWhiteListed() method checks if a request matches
		 * a set of whitelist rules
		 *
		 * @param <Object> request object
		 */
		, _isWhiteListed: function(request){
			var   url = request.pathname
				, i
				, rules
				, result;


			if (this._whitelist.hasOwnProperty(url)){
				rules = this._whitelist[url];
				i = rules.length;

				while(i--){
					if(this._isWhitelistedByRule(rules[i], request)) return true;
				}
			}

			return false;
		}


		/**
		 * the _checkWhitelistRule() method checks if a request fullfillls
		 * a set of whitelist rules
		 *
		 * @param <Object> rule
		 * @param <Object> request object
		 */
		, _isWhitelistedByRule: function(rule, request){
			var   headers
				, headerName
				, queries
				, queryName
				, k, m, i;

			/*
			 * ATTENTION: be fucking careful working on this function, there 
			 * is evry much room for dangerous errors. think 10 times before
			 * chaning _anything_ in here!
			 */

			// does the method match?
			if (rule.method && request.method.toLowerCase() !== rule.method) return false;

			// do the headers match?
			if (rule.headers){
				headers = Object.keys(rule.headers);
				i = headers.length;

				while(i--){
					headerName = headers[i];
					if(!request.hasHeader(headerName) || request.getHeader(headerName) !== rule.headers[headerName]) return false;
				}
			}

			// does the uqery match?
			if (rule.query){
				queries = Object.keys(rule.query);
				k = queries.length;

				while(k--){
					queryName = queries[k];
					if(!request.query.hasOwnProperty(queryName) || request.query[queryName] !== rule.query[queryName]) return false;
				}
			}

			// does the cidr match?
			if (rule.cidr){
				m = rule.cidr.length;

				while(m--){
					if(isIPInCIDR(request.neighbouringIp, rule.cidr[m])) return true;
				}

				return false;
			}

			return true;
		}




		/**
		 * using the whitelist() method you can add urls / methods
		 * / headers which schould be ignored when checking for proper
		 * authorization. 
		 *
		 * @param <String> url to whitelist
		 * @param <Object> optional request options: method, headers, 
		 * 				   query, source addrress
		 */
		, whitelist: function(url, options) {
			options = options || {};

			if(!this._whitelist[url]) this._whitelist[url] = [];

			this._whitelist[url].push({
				  method: 	options.method ? options.method.toUpperCase().trim() : null
				, cidr: 	options.cidr
				, headers: 	options.headers
				, query: 	options.query
			});
		}


		/**
		 * using the use() method you can add authorization middleware 
		 * to the passport implementation
		 *
		 * @param <Object> passport middleware
		 */
		, use: function(middleware)  {
			middleware.setAuthorizationHandler(Authorization);
			this._middleware.push(middleware);
		}
	});
}();