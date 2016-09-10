// The view to login/logout. 

var $ = require('jquery');
var _ = require('underscore');

var LoginPage = require('html!./LoginView.html');
var loginTemplate = _.template(LoginPage); 

var LoginView = function (appView, pageId) {
	this.appView = appView;
	this.pageId = pageId;
};

LoginView.prototype.render = function () {
	$('#page').html(loginTemplate({ isLoggedIn: this.appView.isLoggedIn }));
	$('#page').on('click', '.login-action', this.login.bind(this));
	$('#page').on('click', '.logout-action', this.logout.bind(this));
};

LoginView.prototype.login = function (e) {
	this.appView.showLoader();
	var username = $('#username').val();
	var password = $('#password').val();
	$.ajax({
		url: '/api/login',
		dataType: 'json',
		data: { username: username, password: password },
		method: 'POST'
	}).done(function (data) {
		if (data.status === 1) {
			this.appView.login(data.userid);
			$('.error-msg').html('');
			this.appView.render(this.pageId);
		} else {
			$('.error-msg').html('Login failed');
		}
		this.appView.hideLoader();
	}.bind(this));
};

LoginView.prototype.logout = function (e) {
	this.appView.showLoader();
	$.ajax({
		url: '/api/logout',
		dataType: 'json',
		method: 'POST'
	}).done(function (data) {
		this.appView.logout();
		this.appView.render();
		this.appView.hideLoader();
	}.bind(this));
};

LoginView.prototype.destroy = function () {
	$('#page').off();
};


module.exports = LoginView;
