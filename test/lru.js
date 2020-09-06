"use strict";

const path = require("path"),
  LRU = require(path.join("..", "dist", "lru.cjs.js"));

exports.order = {
  setUp: function (done) {
    this.cache = new LRU({
      max: 4
    });
    this.items = ["a", "b", "c", "d", "e"];
    done();
  },
  test: function (test) {
    this.items.forEach(i => this.cache.set(i, false));

    test.expect(7);
    
    test.equal(this.cache.newest.key, "e", "Should be 'e'");
    test.equal(this.cache.oldest.key, "b", "Should be 'b'");
    test.equal(this.cache.size, 4, "Should be '4'");

    this.cache.get('d');
    test.equal(this.cache.newest.key, "d", "Should be 'd'");
    test.equal(this.cache.newest.older.key, "e", "Should be 'e'");

    this.cache.delete('e');
    test.equal(this.cache.newest.older.key, "c", "Should be 'c'");

    this.cache.delete('b');
    test.equal(this.cache.oldest.key, "c", "Should be 'c'");

    test.done();
  }
};

exports.evict = {
  setUp: function (done) {
    this.cache = new LRU({
      max: 4
    });
    this.items = ["a", "b", "c", "d", "e"];
    done();
  },
  test: function (test) {
    this.items.forEach(i => this.cache.set(i, false));
    test.expect(6);
    test.equal(this.cache.newest.key, "e", "Should be 'e'");
    test.equal(this.cache.oldest.key, "b", "Should be 'b'");
    test.equal(this.cache.size, 4, "Should be '4'");
    this.cache.evict();
    test.equal(this.cache.newest.key, "e", "Should be 'e'");
    test.equal(this.cache.oldest.key, "c", "Should be 'c'");
    test.equal(this.cache.size, 3, "Should be '3'");
    test.done();
  }
};

exports.deletion = {
  setUp: function (done) {
    this.cache = new LRU({
      max: 4
    });
    this.items = ["a", "b", "c", "d", "e"];
    done();
  },
  test: function (test) {
    this.items.forEach(i => this.cache.set(i, false));
    test.expect(28);
    test.equal(this.cache.newest.key, "e", "Should be 'e'");
    test.equal(this.cache.oldest.key, "b", "Should be 'b'");
    test.equal(this.cache.size, 4, "Should be '4'");
    test.equal(this.cache.entries.e.newer, null, "Should be 'null'");
    test.equal(this.cache.entries.e.older.key, "d", "Should be 'd'");
    test.equal(this.cache.entries.d.newer.key, "e", "Should be 'e'");
    test.equal(this.cache.entries.d.older.key, "c", "Should be 'c'");
    test.equal(this.cache.entries.c.newer.key, "d", "Should be 'd'");
    test.equal(this.cache.entries.c.older.key, "b", "Should be 'b'");
    test.equal(this.cache.entries.b.newer.key, "c", "Should be 'c'");
    test.equal(this.cache.entries.b.older, null, "Should be 'null'");
    this.cache.delete("c");
    test.equal(this.cache.newest.key, "e", "Should be 'e'");
    test.equal(this.cache.oldest.key, "b", "Should be 'b'");
    test.equal(this.cache.size, 3, "Should be '3'");
    test.equal(this.cache.entries.e.newer, null, "Should be 'null'");
    test.equal(this.cache.entries.e.older.key, "d", "Should be 'd'");
    test.equal(this.cache.entries.d.newer.key, "e", "Should be 'e'");
    test.equal(this.cache.entries.d.older.key, "b", "Should be 'b'");
    test.equal(this.cache.entries.b.newer.key, "d", "Should be 'd'");
    test.equal(this.cache.entries.b.older, null, "Should be 'null'");
    this.cache.delete("e");
    test.equal(this.cache.oldest.key, "b", "Should be 'b'");
    test.equal(this.cache.newest.key, "d", "Should be 'd'");
    test.equal(this.cache.size, 2, "Should be '2'");
    this.cache.get("b");
    test.equal(this.cache.newest.key, "b", "Should be 'b'");
    test.equal(this.cache.newest.older.key, "d", "Should be 'd'");
    test.equal(this.cache.oldest.key, "d", "Should be 'd'");
    test.equal(this.cache.oldest.newer.key, "b", "Should be 'b'");
    test.equal(this.cache.size, 2, "Should be '2'");
    test.done();
  }
};

exports.ttl = {
  setUp: function (done) {
    this.cache = new LRU({
      max: 4,
      ttl: 10
    });
    done();
  },
  test: function (test) {
    this.cache.set("foo", "baz");
    this.cache.set("baz", "foo", 100);

    test.equal(this.cache.get("foo"), "baz", "should return baz");
    test.equal(this.cache.get("baz"), "foo", "should return foo");
    setTimeout(function(){
      test.equal(this.cache.get("foo"), undefined, "should return 'undefined'");
      test.equal(this.cache.get("baz"), "foo", "should return foo");
      test.done();
    }.bind(this), 11);
  }
};
