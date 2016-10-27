var ceStore = require('../../ceStore/ceStore');

function getThings(req, res) {
  'use strict';

  ceStore.getThings(req.sessionID, function(err, body) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(body);
    }
  });
}

function getInstance(req, res) {
  'use strict';

  ceStore.getInstance(req.sessionID, req.params.name, function(err, body) {
    if (err) {
      res.send({});
    } else {
      res.send(body);
    }
  });
}

function getConcepts(req, res) {
  'use strict';

  ceStore.getConcepts(req.sessionID, function(err, body) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(body);
    }
  });
}

function getCe(req, res) {
  'use strict';

  if (req.session.ce) {
    res.send(req.session.ce);
  } else {
    res.send('');
  }
}

function saveCe(req, res) {
  'use strict';

  req.session.ce = req.body.ce;

  ceStore.postCe(req.sessionID, req.body.ce, function(err) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
}

function validate(req, res) {
  'use strict';

  ceStore.validate(req.sessionID, req.body.ce, function(err, body) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(body);
    }
  });
}

module.exports = {
  getThings: getThings,
  getInstance: getInstance,
  getConcepts: getConcepts,
  getCe: getCe,
  saveCe: saveCe,
  validate: validate
};
