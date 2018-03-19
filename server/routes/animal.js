const express = require('express');
const statusCode = require('node-status-codes');
const head = require('lodash.head');

const pool = require('../mysql');
const helpers = require('../helpers');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  try {
    const done = (err, result) => {
      if (err || result.length === 0) {
        next();
      }
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
  const id = req.params.id;
  const done = (err, { affectedRows }) =>
    err
      ? next(err)
      : affectedRows === 0 ? next() : res.status(204).send(statusCode[204]);
  pool.getConnection((err, connection) => {
    connection.query('DELETE FROM animal WHERE id = ?', id, done);
    connection.release();
    if (err) throw err;
  });
});

module.exports = router;
