module.exports = {

  parallel: function(fns, done) {
    done = done || function() {};
    this.map(fns, function(fn, callback) {
      fn(callback);
    }, done);
  },


  map: function(items, iterator, done) {
    done = done || function() {};
    var results = [];
    var failure = false;
    var expected = items.length;
    var actual = 0;
    var createIntermediary = function(index) {
      return function(err, result) {

        if (failure != false) {
          return;
        }

        if (err != null) {
          failure = true;
          done(err, result);
          return;
        }

        actual += 1;

        if (actual == expected) {
          done(null, results);
        }
      };
    };

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      iterator(item, createIntermediary(i));
    }

    if (items.length == 0) {
      done(null, []);
    }
  },


  eachSeries: function(items, iterator, done) {
    done = done || function() {};
    var results = [];
    var failure = false;
    var expected = items.length;
    var current = -1;

    function callback(err, result) {
      if (err) return done(err);

      results.push(result);

      if (current == expected) {
        return done(null, results);
      } else {
        next();
      }
    }

    function next() {
      current += 1;

      var item = items[current];
      iterator(item, callback);
    }

    next()
  }
};
