// 202035107 권희진

const express = require('express');
var router = express.Router()
var shop = require('../lib/shop');

router.get('/:category', (req, res) => {
  shop.home(req, res);
});

module.exports = router;