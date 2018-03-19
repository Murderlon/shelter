'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const statusCode = require('node-status-codes');

const pool = require('./mysql');
const helpers = require('./helpers');
const animal = require('./routes/animal');
const upload = require('./routes/upload');

module.exports = express()
  .set('view engine', 'ejs')
  .set('views', 'view')
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(express.static('static'))
  .use('/image', express.static('db/image'))
  .use('/animal', animal)
  .use('/upload', upload)
  .get('/', index)
  .get('*', notFound)
  .listen(1902, console.log('listening on http:localhost:1902'));

function index(req, res, next) {
  pool.getConnection((err, connection) => {
    connection.query('SELECT * from animal', done);
    connection.release();
    // Handle error after the release.
    if (err) throw err;
  });

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.format({
        json: () => res.json({ data, ...helpers }),
        html: () => res.render('list', { data, ...helpers })
      });
    }
  }
}

function notFound(req, res) {
  const err = {
    errors: [
      {
        id: 404,
        title: statusCode[404],
        detail: statusCode[404]
      }
    ]
  };
  res.format({
    json: () => res.json(err),
    html: () => res.render('error', err)
  });
}
