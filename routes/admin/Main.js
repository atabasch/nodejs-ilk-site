var express = require('express');
var router  = express.Router();
var url = require('url');
var db = require('./../../db');
var aswDbQuery = require('./../../modules/asw-db-query');
var aswCrypto = require('./../../modules/asw-crypto');


var mainDatas = {}
function resetMainDatas(){
    mainDatas = {
        title: 'Asw Panel',
        pageType: 'standart',
    }
}
resetMainDatas();




// Admin panel başlangıç sayfası
router.get('/', async (request, response, next) => {
    resetMainDatas();
    mainDatas['count_posts'] = 0;
    mainDatas['count_media'] = 0;
    mainDatas['count_users'] = 0;
    mainDatas['count_comments'] = 0;
    mainDatas['last_posts'] = [];
    await aswDbQuery(db, "SELECT count(*) as count FROM asw_posts WHERE post_type='post' AND post_status='publish'").then(r => mainDatas['count_posts'] = r[0].count);
    await aswDbQuery(db, "SELECT count(*) as count FROM asw_media").then(r => mainDatas['count_media'] = r[0].count);
    await aswDbQuery(db, "SELECT count(*) as count FROM asw_users").then(r => mainDatas['count_users'] = r[0].count);
    await aswDbQuery(db, "SELECT * FROM asw_posts WHERE post_type='post' ORDER BY post_id DESC LIMIT 10 ").then(r => mainDatas['last_posts'] = r);


    response.render('admin/index', mainDatas);
});



// KULLANICI GİRİŞ İŞLEMLERİ
router.get('/login', (request, response, next) => {
    console.log(request.session);
    response.render('admin/login');
});
router.post('/login', (request, response) => {
    let username = request.body.asw_username;
    let password = request.body.asw_password;
    let remember_me = request.body.asw_remember_me;
    let urlError = '/admin/login';
    let urlSuccess = '/admin';

    if(username.trim().length < 4 || password.length < 6){
        request.flash('error', 'Geçerli kullanıcı adı yada şifre girilmedi');
        response.redirect(urlError);
    }else{
        password = aswCrypto.mix(password);
        let sql = `SELECT * FROM ${gdb.user.table} WHERE (${gdb.user.username}=? OR ${gdb.user.email}=?) AND ${gdb.user.password}=? AND ${gdb.user.status}=? AND ${gdb.user.level}>? LIMIT 1`;
        aswDbQuery(db, sql, [username, username, password, true, 1], 'login')
        .then(result => {
            if(result.length < 1){
                request.flash('error', 'Girilen bilgilerle eşleşen kullanıcı hesabı yok.');
                response.redirect(urlError);
            }else{
                let user = result[0];
                request.session.user = {
                    id: user.user_id,
                    username: user.user_username,
                    email: user.user_email,
                    level: user.user_level,
                    last_login: user.user_lastlogin
                }
                request.session.save(err => {
                    if(err){
                        request.flash('error', 'Beklenmedik bir hata oluştu. Lütfen daha sonra yeniden deneyin.');
                        response.redirect(urlError);
                    }else{
                        request.flash('success', 'Kullanıcı girişi yapıldı');
                        response.redirect(urlSuccess);
                    }
                });
            }
        })
        .catch(error => {
            request.flash('error', 'Beklenmedik bir hata oluştu. Lütfen daha sonra yeniden deneyin.');
            response.redirect(urlError);
        })
    }
});



// ÇIKIŞ YAP
router.get('/logout', (request, response) => {
    request.session.destroy(err => {
        response.redirect('/admin/login');
    });
});



module.exports = router;
