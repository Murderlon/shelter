'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const db = require('../db');
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

function index(req, res) {
  const data = { ...{ data: db.all() }, ...helpers };
  res.format({
    json: () => res.json(data),
    html: () => res.render('list', data)
  });
}

function notFound(req, res) {
  res.redirect('/');
}
