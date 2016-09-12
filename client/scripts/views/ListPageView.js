// This view lists all the products in the store.

var $ = require('jquery');
var _ = require('underscore');

var ListPageTemplate = require('html!./ListPageView.html');

var listPageViewTemplate = _.template(ListPageTemplate);

var ListPageView = function (appView) {
  this.appView = appView;
};

ListPageView.prototype.render = function () {
  this.appView.showLoader();
  $.ajax({
    url: '/api/products',
    dataType: 'json',
    method: 'GET'
  }).done(function (items) {
    $('#page').html(listPageViewTemplate({items: items}));
    $('#page').on('click', '.buy', this.addToCart.bind(this));
    this.appView.hideLoader();
  }.bind(this));
};

ListPageView.prototype.addToCart = function (e) {
  var id = $(e.currentTarget).data('id');
  this.appView.addToCart(id);
};

ListPageView.prototype.destroy = function () {
  $('#page').off();
};

module.exports = ListPageView;

