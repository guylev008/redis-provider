const redisClientFactory = require('./redisClientFactory');
const redislock = require('redislock');

let client;
let lock;

const createClient = ({ host, port, password, timeout, retries, delay }) => {
	client = redisClientFactory.createClient(host, port, password);
	lock = redislock.createLock(client, {
		timeout,
		retries,
		delay
	});
};

const setAsync = async (key, value, ttl = 60) => {
	await client.setAsync(key, value);
	await client.expire(key, ttl);
};

const getAsync = async key => {
	return await client.getAsync(key);
};

const getBatchAsync = async keys => {
	await client.mgetAsync(keys, (err, res) => {
		if (err) {
			console.log('Error getBatch: ', err);
		}

		return res;
	});
};

const setBatchAsync = async keysWithValues => {
	client.msetAsync(keysWithValues, (err, result) => {
		if (err) {
			console.log('Error setBatch: ', err);
		}

		return result;
	});
};

const aquireLockAsync = async (lockKey, callback) => {
	try {
		await lock.acquire(lockKey);
		callback();
		await lock.release();
	} catch (error) {
		console.log('Error aquireLockAsync: ', error);
	}
};

const deleteAsync = async key => {
	await client.delAsync(key);
};

module.exports = {
	createClient,
	setAsync,
	getAsync,
	aquireLockAsync,
	getBatchAsync,
	setBatchAsync,
	deleteAsync
};
