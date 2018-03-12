const express = require('express');
const statusCode = require('node-status-codes');

const db = require('../../db');
const helpers = require('../helpers');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/:id', (req, res) => {
  if (db.removed(req.params.id)) {
    return res.status(410).send(statusCode[410]);
  }
  try {
    if (db.has(req.params.id)) {
      const data = {
        ...{ data: db.get(req.params.id) },
        ...helpers
      };
      res.format({
        json: () => res.json(data),
        html: () => res.render('detail', data)
      });
    } else {
      const err = {
        ...{
          errors: [
            {
              id: 404,
              title: statusCode[404],
              detail: statusCode[404]
            }
          ]
        },
        ...helpers
      };
      res.format({
        json: () => res.json(err),
        html: () => res.render('error', err)
      });
    }
  } catch (err) {
    res.status(400).send(statusCode[400]);
  }
});

router.delete('/:id', (req, res) => {
  if (db.removed(req.params.id)) {
    return res.status(410).send(statusCode[410]);
  }
  try {
    if (db.has(req.params.id)) {
      db.remove(req.params.id);
      res.status(204).send(statusCode[204]);
    } else {
      res.status(404).send(statusCode[404]);
    }
  } catch (err) {
    res.status(400).send(statusCode[400]);
  }
});

module.exports = router;
