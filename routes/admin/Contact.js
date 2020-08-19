var express = require('express');
var router = express.Router();
let slugify = require('slugify');
let db = require('./../../db');
let aswDbQuery = require('./../../modules/asw-db-query');
let nodemailer = require('nodemailer');

// MESJALAR LİSTELENİYOR
router.get('/list', async (request, response) => {
    let datas = { title: 'İletişim Mesajları', items: [] }
    let sql = 'SELECT * FROM asw_contacts WHERE contact_parent=0 ORDER BY contact_id DESC';
    await aswDbQuery(db, sql, null, 'select-items')
    .then(results => {
        datas['items'] = results
    })
    .catch(err => {

    });
    response.render('admin/contacts/index', datas);
});


// MESAJ DETAYI OKUNUYOR
router.get('/:id/detail', (request, response) => {

    let id  = request.params.id;
    let sql = 'SELECT * FROM asw_contacts WHERE contact_id=:id LIMIT 1'.replace(':id', id);
    aswDbQuery(db, sql, null, 'select-item')
    .then(async results => {

        let datas = {
            title: 'Oku: ' + results[0].contact_title,
            item: results[0],
            answers: []
        }

        if(results[0].contact_status < 1){
            aswDbQuery(db, 'UPDATE asw_contacts SET contact_status=1 WHERE contact_id='+id);
        }

        let answerSql = `SELECT * FROM asw_contacts WHERE contact_parent=${id} ORDER BY contact_id ASC`;
        await aswDbQuery(db, answerSql, null, 'select-items')
        .then(results => {
            datas['answers'] = results
        })
        .catch(err => {

        });


        response.render('admin/contacts/detail', datas);

    })
    .catch(err => {
        response.redirect('/admin/contact/list')
    });

});




// MESAJA CEVAP VERİLİYOR
router.post('/:id/reply', (request, response) => {
    let gid = request.params.id;
    let email = {
        from:       `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
        to:         request.body.to,
        subject:    request.body.subject,
        html:       `${request.body.reply} <hr> ${request.body.content}`
    };

    if(process.env.MAIL_SERVICE=='smtp'){
        let = transporterData = {
            host:   process.env.MAIL_HOST || '',
            port:   process.env.MAIL_PORT || 587,
            secure: process.env.MAIL_SECURE || false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        }
    }else{ // gmail
        let = transporterData = {
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        }
    }

    let transporter = nodemailer.createTransport(transporterData);

    transporter.sendMail(email, (err, info) => {
        if(err){ request.flash('error', 'Cevap verme işlemi başarısız oldu.'); }
        transporter.close();

        let dbDatas = {
            contact_title: request.body.subject,
            contact_author: process.env.MAIL_FROM_NAME,
            contact_content: request.body.reply,
            contact_parent: gid,
            contact_type: 'answer',
            contact_status: 1
        }

        aswDbQuery(db, 'INSERT INTO asw_contacts SET ?', dbDatas)
        .then(result => {
            return aswDbQuery(db, 'UPDATE asw_contacts SET contact_status=2 WHERE contact_id='+gid );
        })
        .then(result => {
            request.flash('success', 'İleti cevaplandı.');
            response.redirect('/admin/contact/:id/detail'.replace(':id', gid));
        })
        .catch(err => {
            console.log(err);
            request.flash('success', 'İleti cevabı mail ile gönderildi ancak veri tabanına kayıt edilemedi..');
            response.redirect('/admin/contact/:id/detail'.replace(':id', gid));
        })


    });

}); // mesaja cevap verildi







module.exports = router;
