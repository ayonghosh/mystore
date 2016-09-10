// The client side router and the SPA.

var Backbone = require('backbone');

var AppView = require('./views/AppView');

var AppRouter = Backbone.Router.extend({
	routes: {
		'status/:status'		: 'status',
		'list'							: 'list',
		'login'							: 'login',
		'cart'							: 'cart',
		'checkout'					: 'checkout'
	}
});

var App = function () {
	var router = new AppRouter();
	var appView = new AppView();
	
	router.on('route:list', function () {
		appView.render(appView.PAGE.LIST);
	}.bind(this));
	
	router.on('route:status', function (status) {
		appView.render(appView.PAGE.STATUS, { paymentStatus: status });
	}.bind(this));
	
	router.on('route:login', function () {
		appView.render(appView.PAGE.LOGIN);
	}.bind(this));
	
	router.on('route:cart', function () {
		appView.render(appView.PAGE.CART);
	}.bind(this));
	
	router.on('route:checkout', function () {
		appView.render(appView.PAGE.CHECKOUT);
	}.bind(this));
	
	Backbone.history.start();
	
	// Show the product listing page by default
	if (!Backbone.history.getFragment()) {
		router.navigate('list', {trigger: true});
	}
}

new App();
