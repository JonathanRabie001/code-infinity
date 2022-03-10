const express = require('express');
const router = express.Router();
const fileServ = require('../services/file.service');
const dbServ = require('../services/db.service');

router.post('/generate/file', fileServ.createCSV);

module.exports = router;