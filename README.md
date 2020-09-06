# LRU Cache

Least Recently Used cache for browser or Node.js.

## Instalation
```sh
npm install @doclify/lru-cache
```

## Usage

```javascript
import LRU from '@doclify/lru-cache'
// commonjs
// const LRU = require('@doclify/lru-cache')

const cache = new LRU({
	max: 1000, //max items in cache
	ttl: 60 * 1000 //max ttl in ms, set 0 for never expiring cache
})

cache.set('foo', 'baz')

const value = cache.get('foo')
```


## Reference

### .has(): boolean
Returns whether key exists in cache

### .clear()
Clears the cache

### .set(key: string, value: any, ttl?: number): boolean
Sets item in cache

### .get(key: string)
Returns item from cache

### .delete(key: string)
Removes item from cache

### .evict(): boolean
Evicts the least recently used item from cache

## License

This repository is published under the [MIT](LICENSE) license.
