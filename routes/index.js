var express = require('express');
var router = express.Router();
var dbConnect = require('../db');
var aswDbQuery = require('../modules/asw-db-query');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});





router.get('/iletisim', (request, response) => {
    let data = {
        title: 'İletişim Formu',
    }
    response.render('contact', data);
});
router.post('/iletisim', (request, response) => {
    let datas = {
        contact_title:    request.body.title,
        contact_author:   request.body.name,
        contact_content:  request.body.content,
        contact_type:     request.body.type || 'question',
        contact_datas:    JSON.stringify({
            email:      request.body.email || '',
            phone:      request.body.phone || '',
        })
    }
    let sql = `INSERT INTO ${gdb.contact.table} SET ?`
    aswDbQuery(dbConnect, sql, datas)
    .then( result => {
        response.json({ status: true/*, result: result*/ });
    } )
    .catch( err => {
        response.json({ status: false/*, error: err*/ });
    } );
});

module.exports = router;
