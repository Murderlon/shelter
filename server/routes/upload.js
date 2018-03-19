const express = require('express');
const statusCode = require('node-status-codes');

const pool = require('../mysql');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (req, res) => res.render('upload'));

router.post('/', (req, res, next) => {
  const data = req.body;
  const normalized = Object.keys(data).reduce((acc, key) => {
    switch (key) {
      case 'age':
      case 'weight':
        acc[key] = Number(data[key]);
        break;
      case 'vaccinated':
        acc[key] = data.vaccinated === 1;
        break;
      case 'declawed':
        acc[key] = data.type === 'cat' ? data.declawed === '1' : undefined;
        break;
      default:
        acc[key] = data[key].length === 0 ? undefined : data[key];
    }
    return acc;
  }, {});
  try {
    const done = (err, { insertId }) =>
      err ? next(err) : res.redirect(`/animal/${insertId}`);
    pool.getConnection((err, connection) => {
      connection.query('INSERT INTO animal SET ?', normalized, done);
      connection.release();
      // Handle error after the release.
      if (err) throw err;
    });
  } catch (err) {
    res.status(422).send(statusCode[422]);
  }
});

module.exports = router;
