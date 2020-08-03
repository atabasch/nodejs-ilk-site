var express = require('express');
var router = express.Router();
let slugify = require('slugify');
let db = require('./../../db');
let aswDb = require('./../../modules/asw-db-query');

var mainDatas = {}
function resetMainDatas(){
    mainDatas = {
        title: 'Makaleler',
        pageType: 'standart'
    }
}
resetMainDatas();


let pathView = 'admin/articles/'

let urlCategoryIndex = '/admin/article/list';
let urlPostIndex = '/admin/article/list';
let urlErrorCategoryCreate   = '/admin/article/create';
let urlErrorPostCreate   = '/admin/article/create';
let urlSuccessCategoryCreate = '/admin/article/:id/edit';
let urlSuccessPostCreate = '/admin/article/:id/edit';

// MAKALELER LİSTE SAYFASI
router.get('/list', (request, response, next) => {
    let sql = `SELECT P.*, U.${gdb.user.username} FROM ${gdb.post.table} AS P
                INNER JOIN ${gdb.user.table} AS U ON U.${gdb.user.id}=P.${gdb.post.user}
                WHERE P.${gdb.post.type}='post' 
                ORDER BY P.${gdb.post.id} DESC`;
    db.query(sql, (error, results, fields) => {
        if(error){

        }else{
            mainDatas['articles'] = results;
            response.render(pathView+'index', mainDatas);
        }
    });
});











// MAKALE OLUŞTURMA FORM SAYFASI
router.get('/create', (request, response, next) => {
    resetMainDatas();
    mainDatas['title'] = 'Yeni Makale Yaz';

    let sql = `SELECT * FROM ${gdb.category.table}`;
    db.query(sql, (error, results, fields) => {
        if(error){
            response.redirect(urlCategoryIndex);
        }else{
            mainDatas['categories'] = results;
            mainDatas['headTitle'] = 'Yeni Makale Yaz';
            response.render(pathView+'/form', mainDatas);
        }
    });
});


// MAKALE OLUŞTURMA POST İŞLEMELERİ
router.post('/create', (request, response, next) => { // article create urlsinde bu fonksiyon çalışır.

    // Postdan gelen verileri al
    let post        = request.body;
    let title       = post.title.trim().length < 5? null : post.title.trim();
    let seflink     = post.seflink.trim().length < 5? title.toLowerCase().replace(" ", "-") : post.seflink.trim();
    let description = post.description.trim();
    let content     = post.content.trim();
    let cover       = post.cover.trim();
    let tags        = post.tags.trim();
    let categories  = typeof post.categories == "undefined"? null : post.categories;
    let status      = post.status;
    let user_id     = request.session.user.id;

    // Title girdisinde hata varsa
    if(!title){
        request.flash('error', 'En az 5 karakterden oluşan bir makale başlığı yazmalısınız.');
        response.redirect(urlErrorCategoryCreate);

    // Hiç kategori seçilmemiş ise
    }else if(!categories){
        request.flash('error', 'En az 1 adet kategori seçmelisiniz.');
        response.redirect(urlErrorCategoryCreate);

    // Girdiler sorunsuz ise
    }else{

        // Makale ekleme sorgusunu hazırla.
        let sql = `INSERT INTO ${gdb.post.table} SET
                                ${gdb.post.title}=?,
                                ${gdb.post.seflink}=?,
                                ${gdb.post.description}=?,
                                ${gdb.post.content}=?,
                                ${gdb.post.tags}=?,
                                ${gdb.post.status}=?,
                                ${gdb.post.user}=?,
                                ${gdb.post.cover}=?`;

        // Makaleyi tablouya ekleyecek sorguyu çalıştır.
        db.query(sql, [title, seflink, description, content, tags, status, user_id, cover], (error, result, fields) => {

            if(error){
                request.flash('error', 'Beklenmedik bir hata oluştu.');
                console.log(error);
                response.redirect(urlErrorCategoryCreate);

            }else{
                // Makale eklenirken bir sorun oluştuysa
                if(result.affectedRows < 1){
                    request.flash('error', 'En az 1 adet kategori seçmelisiniz.');
                    response.redirect(urlErrorCategoryCreate);

                // Makale ekleme başarılı olduysa
                }else{

                    // Kategori bağlantısını oluşturacak sorguyu hazırla.
                    let sqlConnect = "";
                    for(index in categories){
                        let catId = categories[index];
                        sqlConnect += `INSERT INTO ${gdb.post_category.table}(${gdb.post_category.category_id}, ${gdb.post_category.post_id}) VALUES(${catId}, ${result.insertId});`;
                        if(index >= categories.length-1){

                            db.query(sqlConnect, (error, results, fields) => {

                                if(error){

                                    let sqlDeleteCategory = `DELETE FROM ${gdb.post_category.table} WHERE ${gdb.post_category.post_id}=?`;
                                    db.query(sqlDeleteCategory, [result.insertId], (err,res,fie) => {

                                        let sqlDeletePost = `DELETE FROM ${gdb.post.table} WHERE ${gdb.post.id}=?`;
                                        db.query(sqlDeletePost, [result.insertId], (err,res,fie) => {

                                            request.flash('error', 'Beklenmedik bir hata oluştu');
                                            console.log(error);
                                            response.redirect(urlErrorCategoryCreate);

                                        });

                                    });

                                }else{
                                    request.flash('success', 'Makale oluşturuldu');
                                    response.redirect(urlSuccessCategoryCreate.replace(':id', result.insertId));
                                }
                            });

                        }
                    }

                } // else => result.affectedRows < 1
            }

        });//db.query

    }//else
}); //router.post('/create'





// MAKALE GÜNCELLEME FORM SAYFASI
router.get('/:id/edit', (request, response, next) => {
    resetMainDatas();
    mainDatas['title'] = 'Makale Güncelle';
    let gid = request.params.id;

    let sqlGetPost = `SELECT * FROM ${gdb.post.table} WHERE ${gdb.post.id}=? LIMIT 1`;
    aswDb(db, sqlGetPost, [gid])
    .then(resultPost => {
        if(resultPost.length < 1){ throw Error({tag:'no-data'});}
        mainDatas['post'] = resultPost[0];
        let sqlGetCategoriesId =  `SELECT * FROM ${gdb.post_category.table} WHERE ${gdb.post_category.post_id}=?`;
        return aswDb(db, sqlGetCategoriesId, [gid]);
    })
    .then(resultCategoriesID => {
        mainDatas['postCategoriesId'] = resultCategoriesID;
        let sqlGetCategories = `SELECT * FROM ${gdb.category.table}`;
        return aswDb(db, sqlGetCategories, null);
    })
    .then(resultCategories => {
        mainDatas['categories'] = resultCategories;
        mainDatas['headTitle'] = 'Düzenle ('+mainDatas['post'].post_title+')';
        response.render(pathView+'/form', mainDatas);
    })
    .catch(error => {
        request.flash('error', '<strong>'+error.tag+'</strong> İçerik bulunamadı veya başka bir sorgu hatası ile karşılaşıldı.')
        response.redirect(urlPostIndex);
    });
}); //router.get


// MAKALE DÜZENLEME SAYFASI POST EDİLDİĞİNDE
router.post('/:id/update', (request, response, next) => {
    resetMainDatas();
    let gid = request.params.id;
    let urlRedirect = '/admin/article/:id/edit'.replace(':id', gid);
    let postDatas = {
        post_title:     request.body.title.trim().length < 5? null : request.body.title.trim(),
        post_seflink:   request.body.seflink.trim().length < 5? slugify(request.body.title, {lower: true}): request.body.seflink.trim(),
        post_description: request.body.description.trim(),
        post_content:   request.body.content.trim(),
        post_cover:     request.body.cover,
        post_tags:      request.body.tags.trim(),
        post_user:      1,
        post_status:    request.body.status
    }

    let sql = `UPDATE ${gdb.post.table} SET ? WHERE ${gdb.post.id}=${gid}`;
    aswDb(db, sql, postDatas, 'update-post')
    .then(result => {
        sql = `DELETE FROM ${gdb.post_category.table} WHERE ${gdb.post_category.post_id}=${gid}`;
        return aswDb(db, sql, null, 'delete-categories')
    })
    .then(result => {
        if(request.body.categories.length < 1){
            return true
        }else{
            sql = '';
            request.body.categories.forEach((catId, index) => {
                console.log(catId);
                console.log(index);
                sql += `INSERT INTO ${gdb.post_category.table}(${gdb.post_category.post_id}, ${gdb.post_category.category_id}) VALUES(${gid},${catId});`;
                if(index >= request.body.categories.length-1){
                    return aswDb(db, sql, null, 'insert-categories');
                }
            });
        }
    })
    .then(result => {
        request.flash('succes', 'Yazı güncellendi.');
        response.redirect(urlRedirect);
    })
    .catch(error => {
        switch(error.tag){
            case 'update-post':         request.flash('error', 'Yazı güncelleme başarısız..'); break;
            case 'delete-categories':   request.flash('error', 'Yazı güncellendi ancak kategori temizleme esnasında sorun oluştu.'); break;
            case 'insert-categories':   request.flash('error', 'Yazı güncellendi ancak kategori bağlama başarısız oldu.'); break;
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

        let sqlDeletePost = `DELETE FROM ${gdb.post.table} WHERE ${gdb.post.id}=?`;
        let sqlDeleteConnect = `DELETE FROM ${gdb.post_category.table} WHERE ${gdb.post_category.post_id}=?`;

        db.query(sqlDeletePost, [pid], (error, result, fields) => {
            if(error){
                response.json(result);
            }else{

                db.query(sqlDeleteConnect, [pid], (error, result, field) => {
                    if(error){
                        response.json(result);
                    }else{
                        result = {
                            id:pid,
                            title:'Makale Silindi.',
                            message:'Makale başarılı bir şekilde silindi..',
                            status:'success'
                        }
                        response.json(result);
                    }
                });

            }
        });

    }
});


























module.exports = router;
