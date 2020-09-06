export default class Entry {
  constructor (key, value, ttl) {
    this.key = key
    this.newer = this.older = null

    this.update(value, ttl)
  }

  update (value, ttl) {
    this.value = value
    this.expiresAt = ttl > 0 ? Date.now() + ttl : null
  }
}
