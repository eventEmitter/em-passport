!function(){

	var   Class 		= require('ee-class')
		, log 			= require('ee-log');



	module.exports = new Class({

		
		/**
		 * Authorization contructor funtion
		 *
		 * @param <Object> options
		 */
		init: function(options){
			Object.defineProperty( this, '_authorized', {
				writable: true
				, value: false
			} );

			Object.defineProperty( this, 'authorized', {
				  enumerable: true
				, get: function(){ return this._authorized; }.bind(this) 
				, set: function(isAuthorized){ this._authorized = isAuthorized; }.bind(this) 
			} );
		}
	});
}();