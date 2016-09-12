// This view allows the user to choose shipping details
// as a final step of the checkout process.

var $ = require('jquery');
var _ = require('underscore');

var CheckoutPage = require('html!./CheckoutView.html');

var checkoutTemplate = _.template(CheckoutPage);

var CheckoutView = function (appView) {
  this.appView = appView;
};

CheckoutView.prototype.render = function () {
  this.appView.showLoader();
  $.ajax({
    url: '/api/addresses',
    dataType: 'json',
    method: 'GET'
  }).done(function (addresses) {
    $('#page').html(checkoutTemplate({ addresses: addresses }));
    $('#page').on('click', '.addr', this.checkout.bind(this));
    this.appView.hideLoader();
  }.bind(this));
};

CheckoutView.prototype.checkout = function (e) {
  var addressId = $(e.currentTarget).data('id');
  this.appView.showLoader();
  // Submit order and generate order id on backend
  // that will be passed on to the payment gateway
  $.ajax({
    url: '/api/checkout',
    dataType: 'json',
    data: this.appView.getCheckoutData(),
    method: 'POST'
  }).done(function (data) {
    // Redirect to payment gateway
    window.location = '/pg?orderId=' + data.orderId;
  }.bind(this));
};


module.exports = CheckoutView;
