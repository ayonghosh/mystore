// This view shows the status of the checkout and payment.

var $ = require('jquery');

var CheckoutStatusView = function (appView, pageId, data) {
  this.appView = appView;
  this.data = data;
  console.log(data);
};

CheckoutStatusView.prototype.render = function () {
  // If payment gateway responds with an order id it means the 
  // payment was successful. Otherwise it responds with zero,
  // meaning failure
  if (this.data.paymentStatus != 0) {
    this.appView.clearCart();
    $('#page').html('<section id="status-page">Payment was successful. Your order id is: <b>' + 
      this.data.paymentStatus.toUpperCase() + '</b>' +
      '<div><a href="/#list" class="continue-btn">Continue Shopping</a></div></section>');
  } else {
    $('#page').html('<section id="status-page">Payment failed!' +
      '<div><a href="/#checkout" class="continue-btn">Try Again</a></div></section>');
  }
};


module.exports = CheckoutStatusView;
