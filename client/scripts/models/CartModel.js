// The shopping cart model. This is where the state of
// the shopping cart is maintained, and provides an
// inteface for various operations on the cart. It 
// persists the cart data at any time in the local
// storage so a returning user is able to resume
// checkout later.

var _ = require('underscore');

var CART_LS_KEY = 'cartData';

var CartModel = function () {
	this.cartMap = {};
};

CartModel.prototype.addToCart = function (productId) {
	if (this.cartMap[productId]) {
		this.cartMap[productId]++;
	} else {
		this.cartMap[productId] = 1;
	}
	this.writeToStorage();
};

CartModel.prototype.setQuantity = function (productId, quantity) {
	this.cartMap[productId] = quantity || 1;
	this.writeToStorage();
};

CartModel.prototype.removeFromCart = function (productId) {
	delete this.cartMap[productId];
	this.writeToStorage();
};

CartModel.prototype.clearCart = function () {
	this.cartMap = {};
	this.writeToStorage();
};

CartModel.prototype.readFromStorage = function () {
	if (typeof localStorage !== 'undefined') {
		this.cartMap = JSON.parse(localStorage.getItem(CART_LS_KEY)) || {};
	}
};

CartModel.prototype.writeToStorage = function () {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(CART_LS_KEY, JSON.stringify(this.cartMap));
	}
};

CartModel.prototype.getTotalItemCount = function () {
	var count = 0;
	for (var id in this.cartMap) {
		count += this.cartMap[id];
	}
	
	return count;
};

CartModel.prototype.getItemCount = function (id) {
	return this.cartMap[id] || 0;
};

CartModel.prototype.getData = function () {
	return this.cartMap;
};

CartModel.prototype.getProductIds = function () {
	return _.keys(this.cartMap);
};


module.exports = CartModel;

