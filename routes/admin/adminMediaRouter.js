let express = require('express');
var jimp = require('jimp');
let path = require('path');
let router = express.Router();
let db = require('./../../db');
let slugify = require('slugify');
let fs = require('fs');
let imageUploader = require('express-fileupload');
router.use(imageUploader());

let aswUpload = require('./../../modules/asw-upload');
let aswDbQuery = require('./../../modules/asw-db-query');


let urlErrorMediaUpload = '/admin/media/list';
let urlSuccessMediaUplad = '/admin/media/list';
let urlMediaIndex = '/admin/media/list';














// DOSYALARIN LİSTELENDİĞİ ROUTER
router.get('/list', (request, response, next) => {
    let sql = `SELECT * FROM ${gdb.media.table} ORDER BY ${gdb.media.id} DESC`;
    aswDbQuery(db, sql, null)
    .then(result => {
        let data = {
            title:' Medya Dosyaları',
            items: result
        }
        response.render('admin/media/index', data);
    })
    .catch(errorResult => {
        let data = {
            title:' Medya Dosyaları',
            items: []
        }
        response.render('admin/media/index', data);
    })
});















router.get('/:id/edit', (request, response, next) => {
    let gid = request.params.id;
    let sql = `SELECT * FROM ${gdb.media.table} WHERE ${gdb.media.id}=?`;
    let media = null;

    aswDbQuery(db, sql, [gid], 'no-data')

    .then(result => {
        if(result.length > 0){ media = result[0]; }
        sql = `SELECT * FROM ${gdb.media.table} ORDER BY ${gdb.media.id} DESC`;
        return aswDbQuery(db, sql, [gid], 'no-data')
    })

    .then(result => {
        if(!media){
            request.flash('error', 'Hedef dosya bulunamadı.');
            response.redirect(urlMediaIndex);
        }else{
            let data = {
                title:' Dosya Düzenle',
                items: result,
                media: media
            }
            response.render('admin/media/index', data);
        }
    })

    .catch(errorResult => {
        request.flash('error', 'Beklenmedik bir sorun oluştu.');
        response.redirect(urlMediaIndex);
    })
});















router.post('/:id/update', (request, response, next) => {
    let gid         = request.params.id;
    let redirectUrl = '/admin/media/:id/edit'.replace(':id', gid);
    datas           = {
        [gdb.media.title]       : request.body.title,
        [gdb.media.seflink]     : slugify(request.body.title, {lower: true}),
        [gdb.media.description] : request.body.description,
        [gdb.media.tags]        : request.body.tags,
    }
    let sql         = `UPDATE ${gdb.media.table} SET ? WHERE ${gdb.media.id}=${gid}`;
    aswDbQuery(db, sql, datas, 'update-data')
    .then(result => {
        request.flash('success', 'Ortam dosyası güncellendi.');
        response.redirect(redirectUrl);
    })
    .catch(error => {
        request.flash('error', 'Beklenmedik bir hata oluştu');
        response.redirect(urlMediaIndex);
    });
});








router.get('/:id/edit-image', (request, response, next) => {
    let gid = request.params.id;
    let sql = `SELECT * FROM ${gdb.media.table} WHERE ${gdb.media.id}=?`;
    let media = null;

    aswDbQuery(db, sql, [gid], 'no-data')

    .then(result => {
        if(result.length > 0){ media = result[0]; }
        sql = `SELECT * FROM ${gdb.media.table} ORDER BY ${gdb.media.id} DESC`;
        return aswDbQuery(db, sql, [gid], 'no-data')
    })

    .then(result => {
        if(!media){
            request.flash('error', 'Hedef dosya bulunamadı.');
            response.redirect(urlMediaIndex);
        }else{
            let data = {
                title:' Dosya Düzenle',
                items: result,
                media: media
            }
            response.render('admin/media/edit-image', data);
        }
    })

    .catch(errorResult => {
        request.flash('error', 'Beklenmedik bir sorun oluştu.');
        response.redirect(urlMediaIndex);
    })
});


router.post('/update-image-changes', (request, response, next) => {
    let imgPath = request.body.image;
    let name = request.body.name;
    let x = parseInt(request.body.x);
    let y = parseInt(request.body.y);
    let w = parseInt(request.body.w);
    let h = parseInt(request.body.h);
    let q = parseInt(request.body.q);
    //let r = parseInt(request.body.r);
    let sx = parseInt(request.body.sx);
    let sy = parseInt(request.body.sy);

    console.log(x)
    console.log(y)
    console.log(w)
    console.log(h)
    //console.log(r)
    console.log(sx)
    console.log(sy)
    console.log(q)
    jimp.read(path.join(__dirname, '../../public/uploads/'+name))
    .then(image => {

        if(x<1 || y<1){
            return image
            .quality(q) // set JPEG quality
            .write('public/uploads/'+name); // save
        }else{
            return image
            .crop(x, y, w, h) // set JPEG quality
            .quality(q) // set JPEG quality
            .write('public/uploads/'+name); // save
        }

    })
    .then(result => {
        console.log(result);
        response.json({status:true});
    })
    .catch(error => {
        console.log(error);
        response.json({status:false});
    })
})














// GİRİLEN TİPE GÖRE DOSYA FİLTRELEYEN SAYFA
router.get('/items/:types', (request, response, next) => {
    let types = request.params.types;
    let sql = `SELECT * FROM asw_media WHERE media_file LIKE '%.${types}' OR media_type LIKE '%${types}%'`;
    if(types=='all'){ sql = `SELECT * FROM asw_media ORDER BY media_id DESC`; }

    aswDbQuery(db, sql, null)
    .then(result => {
        response.json({
            status: true,
            error: null,
            results:result
        });
    })
    .catch(error => {
        response.json({
            status: false,
            error: error,
            results: null
        });
    });
});














// AJAX OLMADAN UPLOAD ETME İŞLEMLERİ
router.post('/upload', (request, response, next) => {

    // Dosya yüklenmemiş mi?
    if(!request.files){
        request.flash('error', 'Yüklemek için bir dosya seçmeniz gerekli.')
        response.redirect(urlErrorMediaUpload);
    }else{

        let title = request.body.title;
        let seflink = slugify(title, {lower: true});
        let description = request.body.description;
        let tags = request.body.tags;
        let type = request.files.file.mimetype;
        let size = request.files.file.size;

        aswUpload(request.files.file, 'media')
        .then(result => {
            let filePath = result.path;
            let sqlInsertMedia = `INSERT INTO ${gdb.media.table} SET
                                                ${gdb.media.title}=?,
                                                ${gdb.media.seflink}=?,
                                                ${gdb.media.description}=?,
                                                ${gdb.media.file}=?,
                                                ${gdb.media.type}=?,
                                                ${gdb.media.tags}=?`;
            let datasInsertMedia = [title, seflink, description, filePath, type, tags];
            return aswDbQuery(db, sqlInsertMedia, datasInsertMedia);

        })
        .then(result => {
            request.flash('success', 'Dosya yükleme başarılı.');
            response.redirect(urlSuccessMediaUplad);
        })
        .catch(cResponse => { // cResponse.error, cResponse.message, cResponse.tag
            switch(cResponse.tag) {
                case "asw-db-query":    request.flash('error', 'Dosya yükleme işlemi veritabanında başarısız oldu.');   break;
                case "asw-upload":      request.flash('error', 'Dosya yükleme işlemi başarısız oldu.');                 break;
                default:                request.flash('error', 'Dosya yükleme işlemi başarısız oldu.');
            }
            response.redirect(urlErrorMediaUpload);
        });



    } // else !request.files

}); // router.post('/upload', (request, response, next) =>















// AJAX İLE DOSYA UPLOAD ETME İŞLEMLERİ
router.post('/ajax/upload', (request, response, next) => {
    if(!request.files){
        response.json({ error:true });
    }else{
        let file = request.files.file;
        let title = file.name;
        let seflink = slugify(title, {lower: true});
        let type = file.mimetype;
        let size = file.size;
        let path = '';

        aswUpload(file, 'media')
        .then(result => {
            path = result.path;
            let sql = `INSERT INTO ${gdb.media.table}(${gdb.media.title}, ${gdb.media.seflink}, ${gdb.media.type}, ${gdb.media.file}) VALUES(?,?,?,?)`;
            return aswDbQuery(db, sql, [title, seflink, type, path]);
        })
        .then(result => {
            let data = {
                [gdb.media.id]          : result.insertId,
                [gdb.media.title]       : title,
                [gdb.media.description] : '',
                [gdb.media.tags]        : '',
                [gdb.media.file]        : path,
                [gdb.media.type]        : type
            }
            response.json(data);
        })
        .catch(datas => {
            console.log(datas);
            response.json({ error:true, datas });
        });
    } // else if(!request.files){
}); // router.post('/ajax/upload', (request, response, next) => {















// GÖRSEL SİLME İŞLEMLERİ
router.post('/ajax/delete/:id', (request, response, next) => {
    let gid = request.params.id;
    let pid = request.body.id;
    let jsonResult = {
        title:'Bir Hata Oluştu.',
        message:'Beklenmedik bir hata oluştu lütfen daha sonra tekrar deneyin.',
        status:'danger'
    }
    if(gid != pid){
        response.json(jsonResult);
    }else{
        let file = '';
        let sqlSelectItem = `SELECT * FROM ${gdb.media.table} WHERE ${gdb.media.id}=?`;
        let sqlDeleteItem = `DELETE FROM ${gdb.media.table} WHERE ${gdb.media.id}=?`;
        aswDbQuery(db, sqlSelectItem, [pid], 'item-select')
        .then(result => {
            file = result[0].media_file;
            return aswDbQuery(db, sqlDeleteItem, [pid], 'item-delete')
        })
        .then(result => {
           fs.unlink(__dirname+'/../../public/uploads/'+file, err => {
                if(err){
                    jsonResult = { id:pid,  title:'Dosya Silindi.',     message:'Dosya başarılı bir şekilde silindi..',     status:'warning' }
                }else{
                    jsonResult = { id:pid,  title:'Dosya Silindi.',     message:'Dosya başarılı bir şekilde silindi..',     status:'success' }
                }
                response.json(jsonResult);
            });
        })
        .catch(error => {
            response.json(jsonResult);
        });

    }// if(gid != pid){
}); // router.post('/ajax/delete/:id', (request, response, next)



module.exports = router;
