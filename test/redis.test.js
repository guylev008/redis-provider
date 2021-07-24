const index = require('../index');

describe('redis test', () => {
	it.only('should set key', async () => {
		const config = {
			host: 'localhost',
			port: 6379,
			password: null,
			timeout: 90000,
			retries: 10,
			delay: 100
		};

		index.createClient(config);
		const setKey = async () => {
			await index.setAsync('key', 'value');
		};

		await index.aquireLockAsync('lock:key', setKey);
	});

	it('should set batch', async () => {
		const config = {
			host: 'localhost',
			port: 6379,
			password: null,
			timeout: 90000,
			retries: 10,
			delay: 100,
			db: 0
		};

		index.createClient(config);

		await index.setBatchAsync(['key1', 'value1', 'key2', 'value2']);
	});

	it('should delete', async () => {
		const config = {
			host: 'localhost',
			port: 6379,
			password: null,
			timeout: 90000,
			retries: 10,
			delay: 100,
			db: 0
		};

		index.createClient(config);

		await index.setAsync('key', 'value');
		await index.deleteAsync('key');
	});
});
