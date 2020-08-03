let crypto = require('crypto');
let aswUpload = (file, path) => {
return new Promise( (resolve, reject) => {

    let fileNameParts   = file.name.split('.');
    let ext             = fileNameParts.pop();
    let fileTitle       = fileNameParts.join(' ');
    let fileName        =  (crypto.createHash('md5').update(new Date().getTime().toString()).digest("hex")) + '.'+ext;
    let filePath        = `${path}/${fileName}`;
    let fileFullPath    = __dirname+'/../public/uploads/'+filePath;

    if( gmedia.allow_extensions.indexOf(ext) < 0 ){
        reject({
            error: 'deny file extension',
            tag: 'asw-upload',
            message: 'Dosya uzantısının yüklenmesine izin verilmiyor.'
        });
    }else{

        file.mv(fileFullPath, error => {

            if(error){
                reject({
                    error: error,
                    tag: 'asw-upload',
                    message: 'Dosya yüklenirken bir sorun oluştu.'
                });
            }else{
                resolve({
                    title: fileTitle,
                    file: fileName,
                    path: filePath
                });

            } // else Dosya upload başarılı

        }); // file.mv('/uploads/media/'+fileName, error => {

    } // Dosya uzantısına izin verildi.


} ); // Promise
} // fonksiyon


module.exports = aswUpload;
