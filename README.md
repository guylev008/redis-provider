# redis-provider

Also see: https://github.com/guylev008/redis-provider

# Install

```bash
$ npm i redis-provider
```

## Usage simple example

```jsx
const redisProvider = require('redis-provider');

const config = {
	host: 'localhost',
	port: 6379,
	password: null,
	timeout: 90000,
	retries: 10,
	delay: 100
};

redisProvider.createClient(config);

const setKey = async () => {
	await redisProvider.setAsync('key', 'value');
};

await redisProvider.aquireLockAsync('lock:key', setKey);
```
