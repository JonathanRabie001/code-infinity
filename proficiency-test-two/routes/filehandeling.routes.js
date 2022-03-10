const express = require('express');
const router = express.Router();
const fileServ = require('../services/file.service');

router.get('/generate/file', fileServ.createCSV);

module.exports = router;