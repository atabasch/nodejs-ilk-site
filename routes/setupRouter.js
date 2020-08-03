var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var aswCrypto = require('./../modules/asw-crypto');
let db = require('./../db');
let aswDbQuery = require('./../modules/asw-db-query');





router.get('/', (request, response, next) => {
    response.render('setup/index');
});










router.get('/step-database', (request, response, next) => {

    /*fs.readFile(path.join(__dirname, '../database.sql'), 'utf8', (readFileError, readFileData) => {
        if(readFileError){
            request.flash('error', 'Dosya okuma başarısız oldu. Lütfen gerekli dosyalara okuma izni verin.');
            response.render('setup/database');
        }else{
            aswDbQuery(db, readFileData, null)
            .then(result => {
                request.flash('success', 'Veritabanı Kuruldu');
                response.redirect('/asw-app-setup/step-general');
            })
            .catch(error => {
                request.flash('error', 'Veritabanı kurulum işlemi başarısız oldu.');
                response.render('setup/database');
            });

        }
    });*/

    response.render('setup/database');


});











router.post('/step-database', (request, response, next) => {

    let host = request.body.host;
    let database = request.body.database;
    let username = request.body.username;
    let password = request.body.password;

    // .env-sample dosyasını al gerekli değişiklikleri yap
    fs.readFile(path.join(__dirname, '../.env-sample'), 'utf8', (readFileError, data)=>{

        if(readFileError){
            console.log("readFileError");
            request.flash('error', '.env-sample dosyası okunamadı')
            response.redirect('/asw-app-setup/step-database');
        }else{

            let newData = data.replace(':DB_HOST:', host)
                              .replace(':DB_NAME:', database)
                              .replace(':DB_USER:', username)
                              .replace(':DB_PASSWORD:', password);

            fs.writeFile(path.join(__dirname, '../.env'), newData, 'utf8', (writeFileError) => {

                if(writeFileError){
                    console.log("writeFileError");
                    request.flash('error', '.env dosyası oluşturulamadı veya yazılamadı. ')
                    response.redirect('/asw-app-setup/step-database');
                }else{
                    require('dotenv').config();
                    response.redirect('/asw-app-setup/step-database-import')

                } // else for if(writeFileError)

            }); // fs.writeFile(path.join(__dirname, '../.env')

        } // else for if(readFileError)

    }); //fs.readFile(path.join(__dirname, '../.env-sample')
});

router.get('/step-database-import', (request, response, next) => {
    fs.readFile(path.join(__dirname, '../database.sql'), 'utf8', (readSqlFileError, readSqlFileData) => {
        if(readSqlFileError){
            console.log("readSqlFileError");
            request.flash('error', 'Dosya okuma başarısız oldu. Lütfen gerekli dosyalara okuma izni verin.');
            response.render('/asw-app-setup/step-database');
        }else{

            aswDbQuery(db, readSqlFileData, null)
            .then(result => {
                request.flash('success', 'Veritabanı Kuruldu');
                response.redirect('/asw-app-setup/step-general');
            })
            .catch(error => {
                console.log("DB ERROR");
                console.log(error);
                request.flash('error', 'Veritabanı kurulum işlemi başarısız oldu.');
                response.redirect('/asw-app-setup/step-database');

            });


        }
    }); // fs.readFile(path.join(__dirname, '../database.sql'), 'utf8', (readSqlFileError, readSqlFileData) => {
});

















router.get('/step-general', (request, response, next) => {
    response.render('setup/general');
});

router.post('/step-general', (request, response, next) => {
    let urlError = '/asw-app-setup/step-general';

    let title = request.body.title;
    let description = request.body.description;

    let user = {
        user_username   : request.body.username.trim().length < 4? false : request.body.username.trim(),
        user_email      : request.body.email.length < 10? false : request.body.email,
        user_password   : request.body.password.length < 6? false : aswCrypto.mix(request.body.password),
        user_status     : true,
        user_level      : 3
    }

    if(!user.user_username){
        request.flash('error', 'En az 4 karakterden oluşan geçerli bir kullanıcı adı girilmeli.');
        response.redirect(urlError);
    }else if(!user.user_password){
        request.flash('error', 'En az 6 karakterden oluşan geçerli bir parola girilmeli.');
        response.redirect(urlError);
    }else if(!user.user_email){
        request.flash('error', 'Geçerli bir E-posta adresi girilmedi.');
        response.redirect(urlError);
    }else{
        let sql = `INSERT INTO ${gdb.user.table} SET ?`;
        aswDbQuery(db, sql, user)
        .then(result => {
            fs.appendFile(path.join(__dirname, '../.env'), 'SETUP=true', 'utf8', (appendFileError) => {
                if(appendFileError){
                    request.flash('warning', 'Ayarlar eklendi ancak .env dosyasına yazılamadı. Siteye giriş yapabilmek için .env dosyasını açın ve son satır olarak SETUP=true yazısını ekleyin.');
                    response.redirect(urlError);
                }else{
                    require('dotenv').config();
                    response.redirect('/admin');
                }
            })

        })
        .catch(error => {
            console.log(error);
            request.flash('error', 'Beklenmedik bir hata oluştu');
            response.redirect(urlError);
        })
    }
});





module.exports = router;
