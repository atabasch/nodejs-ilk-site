const express = require('express');
const router  = express.Router();
const db = require('../../db');
const aswDbQuery = require('../../modules/asw-db-query');


// Yorumları Listeleme Sayfası
router.get('/list', async  (request, response) => {
    let datas = {
        title: 'Yorumlar',
        items: []
    }

    let sql = `SELECT * FROM asw_comments ORDER BY comment_id DESC`;
    await aswDbQuery(db, sql, null, 'select-items')
    .then(result => { datas.items = result })
    .catch(err => {  });

    response.render('admin/comments/index', datas);
});










// Yorum Silme İşlemi
router.post('/:id/delete', (request, response) => {

    let gid = request.params.id;
    let pid = request.body.id;
    let result = {
        title:'Bir Hata Oluştu.',
        message:'Beklenmedik bir hata oluştu lütfen daha sonra tekrar deneyin.',
        status:'danger'
    }

    if(gid != pid){
        response.json(result);
    }else{

        let sql = `DELETE FROM ${gdb.comment.table} WHERE ${gdb.comment.id}=?`
        aswDbQuery(db, sql, [pid, pid])
        .then(results => {

            result = {
                id:pid,
                title:'Yorum Silindi.',
                message:'Belirtilen yorum silindi..',
                status:'success'
            }
            response.json(result);

        })
        .catch(err => {
            response.json(result);
        });

    }
});




// Yorum Silme İşlemi
router.post('/change-status', (request, response) => {

    let pid = request.body.id;
    let status = request.body.status;
    let result = {
        title:'Bir Hata Oluştu.',
        message:'Beklenmedik bir hata oluştu lütfen daha sonra tekrar deneyin.',
        status:'danger'
    }

    let sql = `UPDATE ${gdb.comment.table} SET ${gdb.comment.status}=? WHERE ${gdb.comment.id}=?`
    aswDbQuery(db, sql, [status, pid])
    .then(results => {

        result = {
            id:pid,
            title:'Yorum Güncellendi.',
            message:'Belirtilen yorum Güncellendi..',
            status:'success'
        }
        response.json(result);

    })
    .catch(err => {
        response.json(result);
    });


});

module.exports = router;
