var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.redirect('/books');
});

// Stop favicon 500 error as found at: https://stackoverflow.com/questions/35408729/express-js-prevent-get-favicon-ico
router.get('/favicon.ico', (req, res) => res.status(204).end());

module.exports = router;
