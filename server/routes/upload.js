const express = require('express');
const statusCode = require('node-status-codes');

const db = require('../../db');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (req, res) => res.render('upload'));

router.post('/', (req, res) => {
  const data = req.body;
  const normalized = Object.keys(req.body).reduce((acc, key) => {
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
    const { id } = db.add(normalized);
    res.redirect(`/animal/${id}`);
  } catch (err) {
    res.status(422).send(statusCode[422]);
  }
});

module.exports = router;
