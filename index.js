const redisClientFactory = require('./redisClientFactory');
const redislock = require('redislock');

let clients = {};
let locks = {};

const createClient = ({ name, host, port, password, timeout, retries, delay, db }) => {
	try {
		validateDuplicateClient(name);
		const client = redisClientFactory.createClient(host, port, password, db);
		clients[name] = client;
		const lock = redislock.createLock(client, {
			timeout,
			retries,
			delay
		});
		locks[name] = lock;
	} catch (error) {
		console.log('Error createClient: ', error);
		throw error;
	}
};

const setAsync = async (clientName, key, value, ttl = 60) => {
	try {
		validateClientExist(clientName);
		if (!key || key === '') {
			throw new Error('Missing key');
		}

		if (!value || value === '') {
			throw new Error('Missing value');
		}

		await clients[clientName].setAsync(key, value);
		await clients[clientName].expire(key, ttl);
	} catch (error) {
		console.log('Error setAsync: ', error);
		throw error;
	}
};

const getAsync = async (clientName, key) => {
	try {
		validateClientExist(clientName);
		if (!key || key === '') {
			throw new Error('Missing key');
		}

		return await clients[clientName].getAsync(key);
	} catch (error) {
		console.log('Error getAsync: ', error);
		throw error;
	}
};

const getBatchAsync = async (clientName, keys) => {
	try {
		validateClientExist(clientName);
		if (keys && keys instanceof Array == false) {
			throw new Error('Parameter keys must be an array');
		}

		if (keys.length === 0) {
			throw new Error('Array must be with at least on key');
		}

		await clients[clientName].mgetAsync(keys, (err, res) => {
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

const setBatchAsync = async (clientName, keysWithValues) => {
	try {
		validateClientExist(clientName);
		if (keys && keys instanceof Array == false) {
			throw new Error('Parameter keys must be an array');
		}

		if (keys.length < 2) {
			throw new Error('Array must be with at least on key and value');
		}

		await clients[clientName].msetAsync(keysWithValues, (err, result) => {
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

const aquireLockAsync = async (clientName, lockKey, callback) => {
	try {
		validateClientExist(clientName);
		if (!lockKey || lockKey === '') {
			throw new Error('Missing lock key');
		}
		await locks[clientName].acquire(lockKey);
		callback();
		await locks[clientName].release();
	} catch (error) {
		console.log('Error aquireLockAsync: ', error);
		throw error;
	}
};

const deleteAsync = async (clientName, key) => {
	try {
		validateClientExist(clientName);
		if (!lockKey || lockKey === '') {
			throw new Error('Missing key');
		}

		await clients[clientName].delAsync(key);
	} catch (error) {
		console.log('Error deleteAsync: ', error);
		throw error;
	}
};

const validateDuplicateClient = clientName => {
	if (clients[clientName]) {
		throw new Error('Client name is already exist');
	}
};

const validateClientExist = clientName => {
	if (clients.hasOwnProperty(clientName) == false) {
		throw new Error('Client not exist');
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
