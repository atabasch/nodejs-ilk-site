let db = require('./../db');
let aswDbQuery = require('./../modules/asw-db-query');

module.exports = (request, response, next) => {
    let publishUrl = `${request.protocol}://${request.get('host')}`;
    console.log('Atabasch Online Node JS Uygulaması Çalıştırıldı.');
    console.log('Uygulamayı Görüntülemek için aşağıdaki bağlantıyı ziyaret et.');
    console.log(publishUrl);

    if(request.originalUrl.indexOf('/asw-app-setup') > -1){
        if(process.env.SETUP == 'true'){ response.redirect('/'); }
    }else{
        if(process.env.SETUP != 'true'){ response.redirect('/asw-app-setup') }
    }


    next();
}
