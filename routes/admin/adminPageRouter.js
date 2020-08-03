var express = require('express');
var router = express.Router();
let slugify = require('slugify');
let db = require('./../../db');
let aswDb = require('./../../modules/asw-db-query');

var mainDatas = {}
function resetMainDatas(){
    mainDatas = {
        title: 'Sayfalar',
        pageType: 'standart'
    }
}
resetMainDatas();


let pathView = 'admin/pages/'

let urlPageIndex = '/admin/page/list';
let urlErrorPageCreate   = '/admin/page/create';
let urlSuccessPageCreate = '/admin/page/:id/edit';


// SAYFALAR LİSTE SAYFASI
router.get('/list', (request, response, next) => {
    let sql = `SELECT P.*, U.${gdb.user.username} FROM ${gdb.post.table} AS P
                INNER JOIN ${gdb.user.table} AS U ON U.${gdb.user.id}=P.${gdb.post.user}
                WHERE P.${gdb.post.type}='page'
                ORDER BY P.${gdb.post.id} DESC`;
    db.query(sql, (error, results, fields) => {
        if(error){

        }else{
            mainDatas['pages'] = results;
            response.render(pathView+'index', mainDatas);
        }
    });
});











// YENİ SAYFA OLUŞTURMA FORM SAYFASI
router.get('/create', (request, response, next) => {
    resetMainDatas();
    mainDatas['title'] = 'Yeni Sayfa Oluştur';

    let sql = `SELECT * FROM ${gdb.post.table} WHERE ${gdb.post.type}='page' ORDER BY ${gdb.post.id} DESC`;
    db.query(sql, (error, results, fields) => {
        if(error){
            response.redirect(urlPageIndex);
        }else{
            mainDatas['pages'] = results;
            mainDatas['headTitle'] = 'Yeni Sayfa Oluştur';
            response.render(pathView+'/form', mainDatas);
        }
    });
});


// MAKALE OLUŞTURMA POST İŞLEMELERİ
router.post('/create', (request, response, next) => { // article create urlsinde bu fonksiyon çalışır.

    // Postdan gelen verileri al
    let post        = request.body;
    let title       = post.title.trim().length < 3? null : post.title.trim();
    let seflink     = post.seflink.trim().length < 3? title.toLowerCase().replace(" ", "-") : post.seflink.trim();
    let description = post.description.trim();
    let content     = post.content.trim();
    let cover       = post.cover.trim();
    let tags        = post.tags.trim();
    let parent      = post.parent;
    let order       = post.order.trim();
    let status      = post.status;
    let user_id     = request.session.user.id;

    // Title girdisinde hata varsa
    if(!title){
        request.flash('error', 'En az 3 karakterden oluşan bir sayfa adı yazmalısınız.');
        response.redirect(urlErrorPageCreate);

    }else{

        // Makale ekleme sorgusunu hazırla.
        let sql = `INSERT INTO ${gdb.post.table} SET
                                ${gdb.post.type}='page',
                                ${gdb.post.title}=?,
                                ${gdb.post.seflink}=?,
                                ${gdb.post.description}=?,
                                ${gdb.post.content}=?,
                                ${gdb.post.tags}=?,
                                ${gdb.post.status}=?,
                                ${gdb.post.parent}=?,
                                ${gdb.post.order}=?,
                                ${gdb.post.user}=?,
                                ${gdb.post.cover}=?`;

        // Sayfayı tablouya ekleyecek sorguyu çalıştır.
        db.query(sql, [title, seflink, description, content, tags, status, parent, order, user_id, cover], (error, result, fields) => {

            if(error){
                request.flash('error', 'Beklenmedik bir hata oluştu.');
                response.redirect(urlErrorPageCreate);

            }else{
                request.flash('success', 'Sayfa oluşturuldu');
                response.redirect(urlSuccessPageCreate.replace(':id', result.insertId));
            }

        });//db.query

    }//else
}); //router.post('/create'





// SAYFA GÜNCELLEME FORM SAYFASI
router.get('/:id/edit', (request, response, next) => {
    resetMainDatas();
    mainDatas['title'] = 'Sayfa Güncelle';
    let gid = request.params.id;

    let sqlGetPost = `SELECT * FROM ${gdb.post.table} WHERE ${gdb.post.id}=? and ${gdb.post.type}='page' LIMIT 1`;
    aswDb(db, sqlGetPost, [gid])
    .then(resultPost => {
        if(resultPost.length < 1){ throw Error({tag:'no-data'});}
        mainDatas['post'] = resultPost[0];
        let sqlGetPages =  `SELECT * FROM ${gdb.post.table} WHERE ${gdb.post.type}='page' AND ${gdb.post.id}!=${gid} ORDER BY ${gdb.post.id} DESC`;
        return aswDb(db, sqlGetPages, [gid], 'no-pages');
    })
    .then(resultPages => {
        mainDatas['pages'] = resultPages;
        mainDatas['headTitle'] = 'Düzenle ('+mainDatas['post'].post_title+')';
        response.render(pathView+'/form', mainDatas);
    })
    .catch(error => {
        request.flash('error', '<strong>'+error.tag+'</strong> Sayfa bulunamadı veya başka bir sorgu hatası ile karşılaşıldı.')
        response.redirect(urlPageIndex);
    });
}); //router.get



// MAKALE DÜZENLEME SAYFASI POST EDİLDİĞİNDE
router.post('/:id/update', (request, response, next) => {
    resetMainDatas();
    let gid = request.params.id;
    let urlRedirect = '/admin/page/:id/edit'.replace(':id', gid);
    let postDatas = {
        post_title      : request.body.title.trim().length < 5? null : request.body.title.trim(),
        post_seflink    : request.body.seflink.trim().length < 5? slugify(request.body.title, {lower: true}): request.body.seflink.trim(),
        post_description: request.body.description.trim(),
        post_content    : request.body.content.trim(),
        post_cover      : request.body.cover,
        post_parent     : request.body.parent,
        post_order      : request.body.order.trim(),
        post_tags       : request.body.tags.trim(),
        post_user       : 1,
        post_status     : request.body.status
    }

    let sql = `UPDATE ${gdb.post.table} SET ? WHERE ${gdb.post.id}=${gid}`;
    aswDb(db, sql, postDatas, 'update-post')
    .then(result => {
        request.flash('succes', 'Sayfa güncellendi.');
        response.redirect(urlRedirect);
    })
    .catch(error => {
        switch(error.tag){
            case 'update-post':         request.flash('error', 'Yazı güncelleme başarısız..'); break;
            default:                    request.flash('error', error.message); break;
        }
        response.redirect(urlRedirect);
    });
});









// MAKALE SİLME POST İŞLEMİ
router.post('/:id/delete', (request, response, next) => {
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

        let sqlDeletePage = `DELETE FROM ${gdb.post.table} WHERE ${gdb.post.id}=? AND ${gdb.post.type}='page'`;

        db.query(sqlDeletePage, [pid], (error, result, fields) => {
            if(error){
                response.json(result);
            }else{

                result = {
                    id:pid,
                    title:'Sayfa Silindi.',
                    message:'Sayfa başarılı bir şekilde silindi..',
                    status:'success'
                }
                response.json(result);

            }
        });

    }
});


























module.exports = router;
