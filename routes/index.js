const express = require('express');
const router = express.Router();
const path = require('path')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('template.html', {
    root: path.join( __dirname, '..', 'views' )
  });
});

module.exports = router;
