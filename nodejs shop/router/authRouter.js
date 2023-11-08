// 202035107 권희진

const express = require('express');
var router = express.Router()
var auth = require('../lib/auth');

router.get('/signup', (req, res) => {
  auth.signup(req, res);
});
router.post('/signup_process', (req, res) => {
  auth.signup_process(req, res);
});
router.get('/login', (req, res) => {
  auth.login(req, res);
});
router.post('/login_process', (req, res) => {
  auth.login_process(req, res);
});
router.get('/logout_process', (req, res) => {
  auth.logout_process(req, res);
});

module.exports = router;