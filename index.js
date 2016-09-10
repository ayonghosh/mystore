var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var _ = require('underscore');
var cookieParser = require('cookie-parser');

var app = express();

var sessions = {};

// parse application/x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json.
app.use(bodyParser.json());
app.use(cookieParser());

// serve client side code.
app.use('/', express.static('client'));

// Payment gateway
app.get('/pg', function (req, res) {
	var data = fs.readFileSync('./client/payment.html').toString();
	var orderId = req.query.orderId;
	data = data.replace('{{oid}}', orderId);
	res.send(data);
});

// API
app.get('/api/products', function (req, res) {
	var items = [
		{
			id: 'e1d46d28ad5b',
			imageClass: 'shirt-1',
			title: 'Airplane T-shirt',
			desc: 'Color: Orange',
			price: 320	
		},
		{
			id: '28dfcd1b896f',
			imageClass: 'jeans',
			title: 'Fashion Jeans',
			desc: 'Color: Blue',
			price: 699
		},
		{
			id: '3c0b3f888641',
			imageClass: 'shirt-2',
			title: 'Peace T-shirt',
			desc: 'Color: Green',
			price: 432
		},
		{
			id: '108734b8fa27',
			imageClass: 'shorts',
			title: 'Shorts',
			desc: 'Color: Red',
			price: 344
		},
		{
			id: 'ff3d50601dee',
			imageClass: 'top',
			title: 'Women\'s Dress',
			desc: 'Color: Yellow/Blue',
			price: 850
		}
	];
	
	var productIds = null;
	var filteredItems = items;
	if (req.query.pids) {
		productIds = req.query.pids.split(',');
		filteredItems = _.filter(items, function (item) {
			return _.indexOf(productIds, item.id) >= 0;
		});
	}
	
	res.header('Content-Type', 'application/json');
	res.send(filteredItems);
});

app.post('/api/login', function (req, res) {
	var status = 0;
	if (req.body.username === 'test' && req.body.password === 'test') {
		status = 1;
	}
	var sessionId = Math.random().toString(36).substring(7);
	sessions[sessionId] = req.body.username;
	
	res.header('Content-Type', 'application/json');
	res.cookie('Session-Id', sessionId);
	res.send({ status: status, userid: req.body.username });
});

app.post('/api/logout', function (req, res) {
	var sessionId = req.cookies['Session-Id'];
	delete sessions[sessionId];
	res.cookie('Session-Id', '');
	res.header('Content-Type', 'application/json')
	res.send(true);
});

app.get('/api/session', function (req, res) {
	var sessionId = req.cookies['Session-Id'];
	var session = _.find(sessions, function (val, key) {
		return key === sessionId;
	});
	var username = sessions[sessionId] || null;
	
	res.header('Content-Type', 'application/json');
	res.send({ loggedIn: !!username, userId: username });
});

app.get('/api/addresses', function (req, res) {
	var addresses = [
		{
			id: 'c88b79aa981d',
			name: 'John Doe',
			address: '1534 Lowndes Hill Park Road',
			city: 'ROOSEVELT',
			state: 'Arizona',
			zip: '85545'
		},
		{
			id: '27aa685726bd',
			name: 'John Doe',
			address: '2024 Science Center Drive',
			city: 'Idaho Falls',
			state: 'Idaho',
			zip: '83402'
		}
	];
	res.header('Content-Type', 'application/json');
	res.send(addresses);
});

app.post('/api/checkout', function (req, res) {
	var userId = req.body.userId;
	var productIds = req.body.productIds;
	// Generate random order id
	var orderId = Math.random().toString(36).substring(7);
	
	res.header('Content-Type', 'application/json');
	res.send({ orderId: orderId });
});

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

// Finally starting the listener
app.listen(port, function () {
  console.log('Listening on port '+ port);
});
