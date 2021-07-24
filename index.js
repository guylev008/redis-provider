const redisClientFactory = require('./redisClientFactory');
const redislock = require('redislock');

let client;
let lock;

const createClient = ({ host, port, password = null, timeout, retries, delay }) => {
	try {
		client = redisClientFactory.createClient(host, port, password);
		lock = redislock.createLock(client, {
			timeout,
			retries,
			delay
		});
	} catch (error) {
		console.log('Error createClient: ', error);
		throw error;
	}
};

const setAsync = async (key, value, ttl = 60) => {
	try {
		if (!key || key === '') {
			throw new Error('Missing key');
		}

		if (!value || value === '') {
			throw new Error('Missing value');
		}

		await client.setAsync(key, value, ttl);
		await client.expire(key, ttl);
	} catch (error) {
		console.log('Error setAsync: ', error);
		throw error;
	}
};

const getAsync = async key => {
	try {
		if (!key || key === '') {
			throw new Error('Missing key');
		}

		return await client.getAsync(key);
	} catch (error) {
		console.log('Error getAsync: ', error);
		throw error;
	}
};

const getBatchAsync = async keys => {
	try {
		if (keys && keys instanceof Array == false) {
			throw new Error('Parameter keys must be an array');
		}

		if (keys.length === 0) {
			throw new Error('Array must be with at least on key');
		}

		await client.mgetAsync(keys, (err, res) => {
			if (err) {
				console.log('Error getBatch: ', err);
			}

			return res;
		});
	} catch (error) {
		console.log('Error getBatchAsync: ', error);
		throw error;
	}
};

const setBatchAsync = async keysWithValues => {
	try {
		if (keys && keys instanceof Array == false) {
			throw new Error('Parameter keys must be an array');
		}

		if (keys.length < 2) {
			throw new Error('Array must be with at least on key and value');
		}

		client.msetAsync(keysWithValues, (err, result) => {
			if (err) {
				console.log('Error setBatch: ', err);
			}

			return result;
		});
	} catch (error) {
		console.log('Error setBatchAsync: ', error);
		throw error;
	}
};

const aquireLockAsync = async (lockKey, callback) => {
	try {
		if (!lockKey || lockKey === '') {
			throw new Error('Missing lock key');
		}
		await lock.acquire(lockKey);
		callback();
		await lock.release();
	} catch (error) {
		console.log('Error aquireLockAsync: ', error);
		throw error;
	}
};

const deleteAsync = async key => {
	try {
		if (!lockKey || lockKey === '') {
			throw new Error('Missing key');
		}

		await client.delAsync(key);
	} catch (error) {
		console.log('Error deleteAsync: ', error);
		throw error;
	}
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
