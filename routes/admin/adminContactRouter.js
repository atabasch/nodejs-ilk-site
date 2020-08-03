var express = require('express');
var router = express.Router();
let slugify = require('slugify');
let db = require('./../../db');
let aswDb = require('./../../modules/asw-db-query');


router.get('/list', (request, response) => {
    response.render('admin/contacts/index');
});







module.exports = router;
