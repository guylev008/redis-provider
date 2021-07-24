const index = require('../index');

const clientName = 'test';
const config = {
	name: clientName,
	host: 'localhost',
	port: 6379,
	password: '',
	timeout: 90000,
	retries: 10,
	delay: 100,
	db: 0
};

describe('redis test', () => {
	it('should set key', async () => {
		index.createClient(config);
		const setKey = async () => {
			await index.setAsync(clientName, 'key', 'value');
		};

		await index.aquireLockAsync(clientName, 'lock:key', setKey);
	});

	it('should set batch', async () => {
		index.createClient(config);

		await index.setBatchAsync(['key1', 'value1', 'key2', 'value2']);
	});

	it('should delete', async () => {
		index.createClient(config);

		await index.setAsync('key', 'value');
		await index.deleteAsync('key');
	});

	it('should set key in db 0 and 1', async () => {
		const clientName2 = 'test2';
		const config2 = {
			name: clientName2,
			host: 'localhost',
			port: 6379,
			password: '',
			timeout: 90000,
			retries: 10,
			delay: 100,
			db: 1
		};

		index.createClient(config);
		index.createClient(config2);
		const setKeyInDb0 = async () => {
			await index.setAsync(clientName, 'key', 'value');
		};

		const setKeyInDb1 = async () => {
			await index.setAsync(clientName2, 'key', 'value');
		};

		await index.aquireLockAsync(clientName, 'lock:key', setKeyInDb0);
		await index.aquireLockAsync(clientName2, 'lock:key', setKeyInDb1);
	});
});
