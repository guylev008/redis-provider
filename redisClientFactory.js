const redis = require('redis');
const { promisifyAll } = require('bluebird');

promisifyAll(redis);

const createClient = (host, port, password, db) => {
	if (db == null || (db < 0 && db > 15)) {
		throw new Error('Db must be greater than -1 and feawer than 15');
	}

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
