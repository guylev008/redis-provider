# redis-provider

Also see: https://github.com/guylev008/redis-provider

# Install

```bash
$ npm i redis-provider
```

## Usage simple example

Each DB connection have it's own name.

```jsx
const redisProvider = require('redis-provider');

const clientName = 'client';
const config = {
	clientName: clientName,
	host: 'localhost',
	port: 6379,
	password: '',
	timeout: 90000,
	retries: 10,
	delay: 100,
	dbNumber: 0
};

redisProvider.createClient(config);

await redisProvider.setAsync(clientName, 'key', 'value');
```

## Aquire Lock

aquireLockAsync needs to be provided with a lock key and a callback function that will run during the lock

```jsx
const redisProvider = require('redis-provider');

const clientName = 'client';
const config = {
	clientName: clientName,
	host: 'localhost',
	port: 6379,
	password: '',
	timeout: 90000,
	retries: 10,
	delay: 100,
	dbNumber: 0
};

redisProvider.createClient(config);

const setKey = async () => {
	await redisProvider.setAsync(clientName, 'key', 'value');
};

await redisProvider.aquireLockAsync(clientName, 'lock:key', setKey);
```
