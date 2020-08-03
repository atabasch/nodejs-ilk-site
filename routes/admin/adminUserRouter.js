var express = require('express');
var router  = express.Router();

var db = require('./../../db');
var aswCrypto = require('./../../modules/asw-crypto');



let aswDbQuery = require('./../../modules/asw-db-query');

router.get('/list', (request, response, next) => {
    let datas = {users:[], title: 'Kullanıcı Hesapları'}
    let sql = `SELECT * FROM asw_users ORDER BY user_id DESC`;
    aswDbQuery(db, sql, null, 'no-data')
    .then(results => {
        datas['users'] = results;
        response.render('admin/users/index', datas);
    })
    .catch(error => {
        console.log(error);
    })
});





router.get('/create', (request, response, next) => {
    let datas = { title:'Yeni Kullanıcı Hesabı Oluştur', headTitle: 'Yeni Kullanıcı Hesabı Oluştur' };
    response.render('admin/users/form', datas);
});





router.post('/create', (request, response, next) => {
    let urlError  = '/admin/user/create';
    let urlSuccess  = '/admin/user/:id/edit';

    let postDatas = {
        user_username   : request.body.username.trim().length < 4? false : request.body.username.trim(),
        user_password   : request.body.password.length < 6? false : aswCrypto.mix(request.body.password),
        user_email      : request.body.email.length < 10? false : request.body.email,
        user_fullname   : request.body.fullname.trim(),
        user_status     : request.body.status==1? true : false,
        user_level      : request.body.level
    }
    if(!postDatas.user_username){
        request.flash('error', 'En az 4 karakterden oluşan geçerli bir kullanıcı adı girilmeli.');
        response.redirect(urlError);
    }else if(!postDatas.user_password){
        request.flash('error', 'En az 6 karakterden oluşan geçerli bir parola girilmeli.');
        response.redirect(urlError);
    }else if(!postDatas.user_email){
        request.flash('error', 'Geçerli bir E-posta adresi girilmedi.');
        response.redirect(urlError);
    }else{

        let sql = `SELECT * FROM asw_users WHERE user_username=? LIMIT 1`;
        aswDbQuery(db, sql, [postDatas.user_username], 'select-username')
        .then(result => {
            if(result.length > 0){
                request.flash('error', `${postDatas.user_username} kullanıcı adı sistemde zaten kayıtlı.`);
                response.redirect(urlError);
            }else{
                sql = `SELECT * FROM asw_users WHERE user_email=? LIMIT 1`;
                return aswDbQuery(db, sql, [postDatas.user_email], 'select-email');
            }
        })

        .then(result => {
            if(result.length > 0){
                request.flash('error', `${postDatas.user_email} e-posta adresi ile kayıtlı bir hesap zaten var.`);
                response.redirect(urlError);
            }else{
                sql = `INSERT INTO ${gdb.user.table} SET ?`;
                return aswDbQuery(db, sql, postDatas, 'insert-user');
            }
        })

        .then(result => {
            let user_id = result.insertId;
            request.flash('success', 'Kullanıcı Hesabı Oluşturuldu.');
            response.redirect(urlSuccess.replace(':id', user_id));
        })

        .catch(error => {
            console.log(error);
            switch (error.tag) {
                case 'select-username':     request.flash('error', `[${error.tag}] Beklenmedik bir sorun oluştu.`); break;
                case 'select-email':        request.flash('error', `[${error.tag}] Beklenmedik bir sorun oluştu.`); break;
                case 'insert-user':         request.flash('error', `[${error.tag}] Kullanıcı hesabı oluşturulamadı.`); break;
                default:                    request.flash('error', `[${error.tag}] Beklenmedik bir sorun oluştu.`); break;
            }
            response.redirect(urlError);
        });

    }// Form kontrol koşulları sonu
});





// HESAP DÜZENLEME SAYFASI
router.get('/:id/edit', (request, response, next) => {
    let urlError = '/admin/user/list';

    let gid = request.params.id;
    let datas = { title:'Hesap Düzenle', headTitle: 'Kullanıcı Hesabı Düzenle' }
    let sql = `SELECT * FROM ${gdb.user.table} WHERE ${gdb.user.id}=? LIMIT 1`;
    aswDbQuery(db, sql, [gid], 'select-user')
    .then(result => {
        if(result.length > 0){
            datas['user'] = result[0];
            response.render('admin/users/form', datas);
        }else{
            request.flash('error', 'Kullanıcı hesabı bulunamadı.');
            response.redirect(urlError);
        }
    })
    .catch(error => {
        request.flash('error', 'Kullanıcı düzenleme sayfasında beklenmedik bir sorun oluştu.');
        response.redirect(urlError);
    });
});



// HESAP GÜNCELLEME İŞLEMLERİ
router.post('/:id/update', (request, response, next) => {
    let gid = request.params.id;
    let urlError  = '/admin/user/:id/edit'.replace(':id', gid);
    let urlSuccess  = '/admin/user/:id/edit'.replace(':id', gid);

    let postDatas = {
        user_email      : request.body.email.length < 10? null : request.body.email,
        user_fullname   : request.body.fullname.trim(),
        user_status     : request.body.status==1? true : false,
        user_level      : request.body.level
    }

    let password  = null;
    if( request.body.password.length > 0 && request.body.password.length < 6 ){ password = false; }
    if( request.body.password.length > 5 ){
        password = true;
        postDatas['user_password'] = aswCrypto.mix(request.body.password);
    }


    if(password==false){
        request.flash('error', 'Tercih edilen parola 6 karakterden daha az olamaz.');
        response.redirect(urlError);
    }else if(!postDatas.user_email){
        request.flash('error', 'Geçerli bir E-posta adresi girilmedi.');
        response.redirect(urlError);
    }else{

        sql = `SELECT * FROM asw_users WHERE user_email=? AND user_id!=? LIMIT 1`;
        aswDbQuery(db, sql, [postDatas.user_email, gid], 'select-email')
        .then(result => {
            if(result.length > 0){
                request.flash('error', `${postDatas.user_email} e-posta adresi ile kayıtlı başka bir hesap zaten var.`);
                response.redirect(urlError);
            }else{
                sql = `UPDATE ${gdb.user.table} SET ? WHERE ${gdb.user.id}=${gid}`;
                return aswDbQuery(db, sql, postDatas, 'update-user');
            }
        })

        .then(result => {
            request.flash('success', 'Kullanıcı Hesabı Güncellendi.');
            response.redirect(urlSuccess);
        })

        .catch(error => {
            console.log(error);
            switch (error.tag) {
                case 'select-email':        request.flash('error', `[${error.tag}] Beklenmedik bir sorun oluştu.`); break;
                case 'update-user':         request.flash('error', `[${error.tag}] Kullanıcı hesabı güncellenemedi.`); break;
                default:                    request.flash('error', `[${error.tag}] Beklenmedik bir sorun oluştu.`); break;
            }
            response.redirect(urlError);
        });

    }// Form kontrol koşulları sonu
});














router.get('/:id/delete', (request, response, next) => {
    let gid = request.params.id;
    let datas = { title: 'Kullanıcı Sil' }

    let urlList = '/admin/user/list'
    let urlDelete = '/admin/user/:id/delete'.replace(':id', gid);

    let sql = `SELECT * FROM ${gdb.user.table} WHERE ${gdb.user.id}=? LIMIT 1`;
    aswDbQuery(db, sql, [gid], 'no-user')
    .then(result => {
        if(result.length < 1){
            request.flash('error', 'Kullanıcı hesabı bulunamadı');
            response.redirect(urlList);
        }else{
            datas['user'] = result[0];
            datas['headTitle'] = `[${result[0].user_username}] hesabını sil`
            sql = `SELECT * FROM ${gdb.post.table} WHERE ${gdb.post.user}=?`;
            return aswDbQuery(db, sql, [gid], 'no-posts');
        }
    })
    .then(result => {
        datas['posts'] = result;
        sql = `SELECT * FROM ${gdb.user.table} WHERE ${gdb.user.status}=1 and ${gdb.user.level}>1 and ${gdb.user.id}!=?`;
        return aswDbQuery(db, sql, [gid], 'select-users')
    })
    .then(result => {
        datas['users'] = result;
        response.render('admin/users/delete', datas);
    })
    .catch(error => {
        request.flash('error', 'Beklenmedik bir hata oluştu');
        response.redirect(urlList);
    });

});





router.post('/:id/delete', (request, response, next) => {
    let gid = request.params.id;
    let pid = request.body.user_id;
    let newAuthor = !request.body.author? false : request.body.author;

    let urlError = '/admin/user/:id/delete'.replace(':id', gid);
    let urlSuccess = '/admin/user/list'

    if(gid!=pid){
        request.flash('error', 'Kullanıcı silme işlemi başarısız.');
        response.redirect(urlError);
    }else{
        let sql = `DELETE FROM ${gdb.user.table} WHERE ${gdb.user.id}=?`;
        aswDbQuery(db, sql, [gid], 'delete-user')
        .then(result => {
            sql = `UPDATE ${gdb.post.table} SET ${gdb.post.user}=? WHERE ${gdb.post.user}=?`;
            return aswDbQuery(db, sql, [newAuthor, gid], 'post-update');
        })
        .then(result => {
            request.flash('success', 'Kullanıcı Hesabı Silindi.');
            response.redirect(urlSuccess);
        })
        .catch(error => {
            request.flash('error', '['+error.tag+'] Kullanıcı silme sırasında beklenmedik bir sorun oluştu');
            response.redirect(urlError);
        });
    }
});







module.exports = router;
