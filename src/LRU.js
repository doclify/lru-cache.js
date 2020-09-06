import Entry from './Entry'

export default class LRU {
  constructor (options) {
    this.config = Object.assign({
      max: 1000,
      ttl: 0,
    }, options || {})

    this.entries = Object.create(null)
    this.newest = this.oldest = null
    this.size = 0
  }

  clear () {
    this.entries = Object.create(null)
    this.newest = this.oldest = null
    this.size = 0
  }

  keys () {
    return Object.keys(this.entries)
  }

  has (key) {
    return key in this.entries
  }

  get (key) {
    const entry = this.entries[key]

    if (!entry) {
      return
    }

    if (entry.expiresAt && Date.now() >= entry.expiresAt) {
      this.delete(key)

      return
    }

    this.markEntryAsUsed(entry)

    return entry.value
  }

  set (key, value, ttl) {
    ttl = typeof ttl === 'number' ? ttl : this.config.ttl

    let entry = this.entries[key]

    if (!entry) {
      if (this.config.max > 0 && this.size >= this.config.max) {
        this.evict()
      }

      entry = new Entry(key, value, ttl)

      this.entries[key] = entry
      this.size += 1

      if (this.newest) {
        this.newest.newer = entry
        entry.older = this.newest
      } else {
        this.oldest = entry
      }
    } else {
      entry.update(value, ttl)

      this.markEntryAsUsed(entry)
    }

    this.newest = entry

    return true
  }

  markEntryAsUsed (entry) {
    if (entry === this.newest) {
      // Already the most recenlty used entry, so no need to update the list
      return
    }

    // HEAD--------------TAIL
    //   <.older   .newer>
    //  <--- add direction --
    //   A  B  C  <D>  E
    if (entry.newer) {
      if (entry === this.oldest) {
        this.oldest = entry.newer
      }

      entry.newer.older = entry.older // C <-- E.
    }
    if (entry.older) {
      entry.older.newer = entry.newer // C. --> E
    }
    entry.newer = null // D --x
    entry.older = this.newest // D. --> E

    if (this.newest) {
      this.newest.newer = entry // E. <-- D
    }

    this.newest = entry
  }

  delete (key) {
    const entry = this.entries[key]

    if (!entry) {
      return false
    }

    delete this.entries[key]
    this.size -= 1

    if (entry.older !== null) {
      entry.older.newer = entry.newer
    }

    if (entry.newer !== null) {
      entry.newer.older = entry.older
    }

    if (this.newest === entry) {
      this.newest = entry.older
    }

    if (this.oldest === entry) {
      this.oldest = entry.newer
    }

    entry.newer = entry.older = null

    return true
  }

  evict () {
    const entry = this.oldest

    if (!entry) {
      return false
    }

    return this.delete(entry.key)
  }
}