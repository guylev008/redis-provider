const redis = require('redis');
const { promisifyAll } = require('bluebird');

promisifyAll(redis);

const createClient = ({ host, port, password, db }) => {
	const client = redis.createClient({
		host,
		port,
		password,
		db
	});

	client.on('error', err => {
		console.log('Error: ', err);
	});

	client.on('connect', function () {
		console.log('Connected!');
	});

	return client;
};

module.exports.createClient = createClient;
