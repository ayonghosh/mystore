// Tha main single-page app view. This is the main 
// controller that takes care of rendering the different
// sub-pages of the app. Each sub-page is expected to
// have a constructor, a render and a destroy function
// that are called in order throughout the sub-view's 
// life cycle.

var $ = require('jquery');
var _ = require('underscore');

var HeaderView = require('html!./HeaderView.html');
var ListPageView = require('./ListPageView');
var CartView = require('./CartView');
var LoginView = require('./LoginView');
var CheckoutView = require('./CheckoutView');
var CheckoutStatusView = require('./CheckoutStatusView');
var CartModel = require('../models/CartModel');

var headerViewTemplate = _.template(HeaderView);

// The map of all pages in the app
var PAGE = {
  LIST    : 'list',
  LOGIN   : 'login',
  CART    : 'cart',
  CHECKOUT  : 'checkout',
  STATUS    : 'status'
};

var AppView = function () {
  this.isLoggedIn = false;
  this.isHeaderRendered = false;
  this.userId = null;
  this.sessionCheckDone = false;
  this.PAGE = PAGE;
  this.cartModel = new CartModel();
  this.cartModel.readFromStorage();
  this.loaderEl = $('#loader');
  this.loaderEl.hide();
  
  this.currentView = null;
};

AppView.prototype.renderHeaderView = function () {
  if (!this.isHeaderRendered) {
    $('#header').html(headerViewTemplate({
      count: this.cartModel.getTotalItemCount() 
    }));
    this.isHeaderRendered = true;
  }
};

AppView.prototype.renderPageView = function (pageId, data) {
  if (this.currentPageView && typeof this.currentPageView.destroy === 'function') {
    this.currentPageView.destroy();
  }
  var PageView = null;
  var redirectPageId = null;
  switch (pageId) {
    case PAGE.CART:
      PageView = CartView;
      break;
    case PAGE.LOGIN:
      PageView = LoginView;
      break;
    case PAGE.CHECKOUT:
      if (this.isLoggedIn) {
        PageView = CheckoutView;
      } else {
        redirectPageId = pageId;
        PageView = LoginView; 
      }
      break;
    case PAGE.STATUS:
      PageView = CheckoutStatusView;
      break;
    case PAGE.LIST:
    default:
      PageView = ListPageView;
      window.location.hash = this.PAGE.LIST;
      break;
  }
  this.currentPageView = new PageView(this, redirectPageId, data);
  this.currentPageView.render();
};

AppView.prototype.render = function (pageId, data) {
  if (!this.sessionCheckDone) {
    this.showLoader();
    $.ajax({
      url: '/api/session',
      type: 'json',
      method: 'GET'
    }).done(function (sessionData) {
      this.sessionCheckDone = true;
      if (sessionData.loggedIn) {
        this.login(sessionData.userId);
      }
      this.renderHeaderView();
      this.renderPageView(pageId, data);
      this.hideLoader();
    }.bind(this));
  } else {
    this.renderHeaderView();
    this.renderPageView(pageId, data);
  }
};


// Global app-level blocking loader
AppView.prototype.showLoader = function () {
  this.loaderEl.show();
};

AppView.prototype.hideLoader = function () {
  this.loaderEl.hide();
};

// Interface to the cart. Both the app view and the cart
// are singletons, and the app view contains the reference
// to the cart, hence all cart invocations are centrally
// accessed through the app view.
AppView.prototype.addToCart = function (id) {
  this.cartModel.addToCart(id);
  this.refreshHeader();
};

AppView.prototype.setQuantity = function (productId, quantity) {
  this.cartModel.setQuantity(productId, quantity);
  this.refreshHeader();
};

AppView.prototype.removeFromCart = function (productId) {
  this.cartModel.removeFromCart(productId);
  this.refreshHeader();
};

AppView.prototype.getItemCount = function (productId) {
  return this.cartModel.getItemCount(productId);
};

AppView.prototype.clearCart = function () {
  this.cartModel.clearCart();
  this.refreshHeader();
};

AppView.prototype.getCartProductIds = function () {
  return this.cartModel.getProductIds() || [];
};

AppView.prototype.getCheckoutData = function () {
  return {
    userId: this.userId,
    productIds: this.cartModel.getData()
  };
};

AppView.prototype.refreshHeader = function () {
  $('.cart-badge').html(this.cartModel.getTotalItemCount());
};


// Interface to login/logout (app-level and app-wide)
AppView.prototype.login = function (userId) {
  this.isLoggedIn = true;
  this.userId = userId;
};

AppView.prototype.logout = function () {
  this.isLoggedIn = false;
  this.userId = null;
};

AppView.prototype.getUserId = function () {
  return this.userId;
};


module.exports = AppView;
