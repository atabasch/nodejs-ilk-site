var express = require('express');
var router = express.Router();
var url = require('url');
var db = require('./../../db');

var urlIndexPage = '/admin/category/list';


var mainDatas = {}
function resetMainDatas(){
    mainDatas = {
        title: 'Asw Panel',
        pageType: 'standart'
    }
}
resetMainDatas();


// KATEGORİ GETİRME FONKSİYONU
function getCategories(moreQuery="", callback){
    let sql = `SELECT * FROM ${gdb.category.table} ORDER BY ${gdb.category.id} DESC`;
    if( moreQuery != null && moreQuery.length > 5){
        sql = `SELECT * FROM ${gdb.category.table} ${moreQuery}`;
    }

    db.query(sql, (err, results, fields) => {
        if(err){
            callback("Kategoriler veritabanından çekilirken bir sorun oluştu.", null);
        }else{
            callback(null, results);
        }
    }); // Database query sorgusu
}






// Admin panel kategori sayfası
router.get('/list', (request, response, next) => {
    resetMainDatas();
    getCategories(null, (err, results) => {
        if(err){
            request.flash('error', 'Kategoriler veritabanından çekilirken bir sorun oluştu.');
        }
        mainDatas['categories'] = results;
        mainDatas['title'] = "Kategori Listesi";
        response.render('admin/categories', mainDatas);
    });
});





// Admin paneli kategori oluşturma POST yönlendirmesi.
router.post('/create', (request, response, next) => {

    let urlSuccessRedirect = urlIndexPage;
    let urlErrorRedirect = urlIndexPage;
    // Post'dan gelen dataları al.
    let postDatas = {
        name: (request.body.name.trim()==""? null : request.body.name),
        seflink: (request.body.seflink.trim()==""? request.body.name.toLowerCase().replace(" ", "-") : request.body.seflink),
        description: request.body.description
    }

    // Kategori adı 5 karakterden daha az ise hata ver.
    if(postDatas.name != null && postDatas.name.length < 3){
        request.flash('error', 'En az 3 karakterden oluşan bir kategori adı girmelisiniz.');
        response.redirect(urlErrorRedirect);
    // Kategori adı 5 karakter yada daha uzunsa diğer işlemlere geç
    }else{


        let sqlStr = `INSERT INTO ${gdb.category.table} SET ${gdb.category.name}=?, ${gdb.category.seflink}=?, ${gdb.category.description}=?`;     // Sql Insert sorgusunu hazırla.
        let sqlDts = [postDatas.name, postDatas.seflink, postDatas.description];        // Sql e gönderilecek parametreleri hazırla.

        db.query(sqlStr, sqlDts, (err, result, fields) => { // Bir sql sorgusunu çalıştır.
            if(err){ // Bir sorun çıkarsa
                request.flash('error', 'Kategori oluşturulamadı.');
                response.redirect(urlErrorRedirect);

            }else{
                request.flash('success', 'Kategori başarılı bir şekilde oluşturuldu..')
                response.redirect(urlSuccessRedirect);
            }
        });

    }
});





// KATEGORİ GÜNCELLE SAYFASI
router.get('/:id', (request, response, next) => {
    resetMainDatas();
    getCategories(null, (err, results) => {

        if(err){
            response.redirect(urlIndexPage);
        }else{

            let id = request.params.id;
            getCategories(`WHERE ${gdb.category.id}=${id} LIMIT 1`, (err, result) => {

                if(err){
                    request.flash('error', 'Kategori bulunamadı');
                    response.redirect(urlIndexPage);
                }else{
                    if(result.length < 1){
                        request.flash('error', 'Kategori bulunamadı');
                        response.redirect(urlIndexPage);
                    }else{
                        mainDatas['title'] = '';
                        mainDatas['pageType'] = 'update';
                        mainDatas['categories'] = results;
                        mainDatas['category'] = result[0];
                        response.render('admin/categories', mainDatas);
                    }
                }

            });

        }

    });
});






// KATEGORİ GÜNCELLEME POST METHODU
router.post('/:id/update', (request, response, next) => {

    let id = request.params.id;
    let name = (request.body.name < 3)? null : request.body.name;
    let seflink = (request.body.seflink < 1)? name.toLowerCase().replace(" ", "-") : request.body.seflink;
    let description = request.body.description;
    let urlErrorRedirect = '/admin/category/'+id;
    let urlSuccessRedirect = '/admin/category/'+id;

    if(!name){
        request.flash('error', 'Kategori adı için en az 3 karakterden oluşan bir yazı girmelisiniz.');
        response.redirect(urlErrorRedirect);
    }else{
        let sql = `UPDATE ${gdb.category.table} SET ${gdb.category.name}=?, ${gdb.category.seflink}=?, ${gdb.category.description}=? WHERE ${gdb.category.id}=?`;
        db.query(sql, [name,seflink,description, id], (error, result, fields) => {
            if(error){
                request.flash('error', 'Kategori güncelleme esnasında bir sorun oluştu.');
                response.redirect(urlErrorRedirect);
            }else{
                request.flash('success', 'Kategori güncellendi.');
                response.redirect(urlSuccessRedirect);
            }
        });
    }


});






// KATEGORİ SİLME POST FONKSİYONU
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
        let sql = `DELETE FROM ${gdb.category.table} WHERE ${gdb.category.id}=?`
        db.query(sql, [pid], (error, result, fields) => {
            if(error){
                response.json(result);
            }else{
                if(result.affectedRows < 1){
                    response.json(result);
                }else{
                    result = {
                        id:pid,
                        title:'Kategori Silindi.',
                        message:'Kategori başarılı bir şekilde silindi..',
                        status:'success'
                    }
                    response.json(result);
                }
            }
        });
    }

});




module.exports = router;
