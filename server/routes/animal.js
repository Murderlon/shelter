const express = require('express');
const statusCode = require('node-status-codes');
const head = require('lodash.head');

const pool = require('../mysql');
const helpers = require('../helpers');
const db = require('../../db');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  // if (db.removed(id)) {
  //   return res.status(410).send(statusCode[410]);
  // }
  try {
    const done = (err, result) => {
      if (err) next(err);
      const data = {
        data: head(result),
        ...helpers
      };
      res.format({
        json: () => res.json(data),
        html: () => res.render('detail', data)
      });
    };
    pool.getConnection((err, connection) => {
      connection.query('SELECT * FROM animal WHERE id = ?', id, done);
      connection.release();
      if (err) throw err;
    });
  } catch (err) {
    res.status(400).send(statusCode[400]);
  }
});

router.delete('/:id', (req, res, next) => {
  if (db.removed(req.params.id)) {
    return res.status(410).send(statusCode[410]);
  }
  try {
    if (db.has(req.params.id)) {
      db.remove(req.params.id);
      res.status(204).send(statusCode[204]);
    } else {
      next();
    }
  } catch (err) {
    res.status(400).send(statusCode[400]);
  }
});

module.exports = router;
