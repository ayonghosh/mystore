// The cart page view. The cart is re-rendered in case
// of any user interaction that modifies the cart data.
// This essentially follows the "always-re-render-on-state-change"
// principle used by libraries like ReactJS, which could be
// used here for making the DOM manipulation more efficient. But
// for a small number of products and this demo, it doesn't have
// much noticeable difference.

var $ = require('jquery');
var _ = require('underscore');

var CartViewPage = require('html!./CartView.html');

var cartViewTemplate = _.template(CartViewPage);

var CartView = function (appView) {
  this.appView = appView;
};

CartView.prototype.render = function () {
  this.appView.showLoader();
  
  var pids = this.appView.getCartProductIds().join(',');
  // Fetch the product details info for all items in the cart and render
  $.ajax({
    url: '/api/products' + (pids ? '?pids=' + pids : '') ,
    dataType: 'json',
    method: 'GET'
  }).done(function (items) {
    this.items = items;
    this.renderCartItems();
    this.appView.hideLoader();
    
    $('#page').on('change', 'input[name="quantity"]', 
      this.changeQuantityAndRender.bind(this));
    $('#page').on('click', '.delete', 
      this.deleteItemAndRender.bind(this));
  }.bind(this));
};

CartView.prototype.changeQuantityAndRender = function (e) {
  var currentTargetEl = $(e.currentTarget);
  var id = currentTargetEl.data('id');
  var val = +currentTargetEl.val();
  this.appView.setQuantity(id, val);
  this.renderCartItems();
};

CartView.prototype.deleteItemAndRender = function (e) {
  var id = $(e.currentTarget).data('id');
  this.appView.removeFromCart(id);
  this.renderCartItems();
};

CartView.prototype.renderCartItems = function () {
  var cartItems = [];
  this.appView.showLoader();
  _.each(this.items, function (item) {
    var count = this.appView.getItemCount(item.id);
    if (count) {
      cartItems.push($.extend({}, item, { quantity: count}));
    }
  }, this);
  $('#page').html(cartViewTemplate({ items: cartItems }));
  this.appView.hideLoader();
};

CartView.prototype.destroy = function () {
  $('#page').off();
};

module.exports = CartView;
