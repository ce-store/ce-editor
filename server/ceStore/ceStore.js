var request = require('request');
var config = require('../../config/config');
var ceStore = config.store + '/stores/';

function getStore(id, cb) {
  'use strict';
  var url = ceStore + id;
  request
    .get(url)
    .on('error', function(err) {
      cb(err);
    })
    .on('response', function(res) {
      if (res.statusCode !== 200) {
        cb(new Error(res.statusCode + ' - ' + res.statusMessage));
      } else {
        cb();
      }
    });
}

function createStore(id, cb) {
  'use strict';
  var url = ceStore + id;
  request
    .post(url)
    .on('error', function(err) {
      cb(err); 
    })
    .on('response', function(res) {
      if (res.statusCode !== 200) {
        cb(new Error(res.statusCode + ' - ' + res.statusMessage));
      } else {
        cb();
      }
    });
}

function deleteStore(id, cb) {
  'use strict';
  var url = ceStore + id;
  request
    .delete(url)
    .on('error', function(err) {
      cb(err);
    })
    .on('response', function(res) {
      if (res.statusCode !== 200) {
        cb(new Error(res.statusCode + ' - ' + res.statusMessage));
      } else {
        cb();
      }
    });
}

function getThings(id, cb) {
  'use strict';
  var url = ceStore + id + '/concepts/thing/instances?style=normalised';
  request
    .get(url, function (err, response, body) {
      if (err) {
        cb(err);
      } else {
        cb(null, body);
      }
    });
}

function getInstance(id, name, cb) {
  'use strict';
  var url = ceStore + id + '/instances/' + name + '?style=normalised';
  request
    .get(url, function (err, response, body) {
      if (err) {
        cb(err);
      } else if (response.statusCode !== 200) {
        cb(new Error(response.statusCode + ' - ' + response.statusMessage));
      } else {
        cb(null, body);
      }
    });
}

function getConcepts(id, cb) {
  'use strict';
  var url = ceStore + id + '/concepts?style=summary';
  request
    .get(url, function (err, response, body) {
      if (err) {
        cb(err);
      } else {
        cb(null, body);
      }
    });
}

function getConcept(id, name, cb) {
  'use strict';
  var url = ceStore + id + '/concepts/' + name + '/instances?style=normalised';
  request
    .get(url, function (err, response, body) {
      if (err) {
        cb(err);
      } else {
        cb(null, body);
      }
    });
}

function getRules(id, cb) {
  'use strict';
  var url = ceStore + id + '/rules';
  request
    .get(url, function (err, response, body) {
      if (err) {
        cb(err);
      } else {
        cb(null, body);
      }
    });
}

function postCe(id, ce, cb) {
  'use strict';
  ce = 'perform%20reset%20store. ' + ce;
  var url = ceStore + id + '/sources/generalCeForm?runRules=true&action=save';
  request
    .post({url: url, body: ce}, function (err, response, body) {
      if (err) {
        cb(err);
      } else {
        cb(null, body);
      }
    });
}

function validate(id, ce, cb) {
  'use strict';
  var url = ceStore + id + '/sentences?action=validate';
  request
    .post({url: url, body: ce}, function (err, response, body) {
      if (err) {
        cb(err);
      } else {
        cb(null, body);
      }
    });
}

function reset() {
  'use strict';
  var url = ceStore;
  request
    .get(url, function (err, response, body) {
      if (err) {
        console.log(err);
      } else {
        var stores = JSON.parse(body);
        stores.forEach(function(store) {
          console.log('deleting ' + store._id);
          var deleteUrl = ceStore + store._id;
          request
            .delete(deleteUrl, function(err) {
              if (err) {
                console.log(err);
              }
            });
        });
      }
    });
}

module.exports = {
  getStore: getStore,
  createStore: createStore,
  deleteStore: deleteStore,
  getThings: getThings,
  getInstance: getInstance,
  getConcepts: getConcepts,
  getConcept: getConcept,
  getRules: getRules,
  postCe: postCe,
  validate: validate,
  reset: reset
};
